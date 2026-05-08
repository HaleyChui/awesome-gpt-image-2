import crypto from 'node:crypto';

const COOKIE_NAME = 'gpt_image_free_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const ANON_TTL = COOKIE_MAX_AGE;
const IP_DAY_TTL = 60 * 60 * 30;
const PENDING_TTL = 5 * 60;
const MAX_PROMPT_LENGTH = 6000;
const DEFAULT_CIYUAN_BASE_URL = 'https://ciyuan.it.com';

function json(res, status, payload, extraHeaders = {}) {
  for (const [key, value] of Object.entries(extraHeaders)) {
    res.setHeader(key, value);
  }
  res.status(status).json(payload);
}

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const index = part.indexOf('=');
      if (index === -1) return cookies;
      const key = part.slice(0, index);
      const value = part.slice(index + 1);
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function getOrCreateAnonId(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const existing = cookies[COOKIE_NAME];
  if (existing && /^[a-f0-9-]{32,64}$/i.test(existing)) {
    return { anonId: existing, shouldSetCookie: false };
  }
  return { anonId: crypto.randomUUID(), shouldSetCookie: true };
}

function buildCookie(anonId) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(anonId)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

function isServerConfigured() {
  return Boolean(process.env.CIYUAN_API_KEY && getRedisConfig());
}

async function redisCommand(command) {
  const config = getRedisConfig();
  if (!config) throw new Error('Redis is not configured');

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Redis command failed with status ${response.status}`);
  }
  return payload.result;
}

async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8') || '{}');
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function buildKeys(anonId, ip) {
  const day = new Date().toISOString().slice(0, 10);
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 24);
  return {
    anonKey: `freegen:v1:anon:${anonId}`,
    ipDayKey: `freegen:v1:ip:${ipHash}:${day}`,
    pendingAnonKey: `freegen:v1:pending:anon:${anonId}`,
    pendingIpKey: `freegen:v1:pending:ip:${ipHash}:${day}`
  };
}

async function hasUsedFreeGeneration(keys) {
  const [anonUsed, ipUsed] = await Promise.all([
    redisCommand(['GET', keys.anonKey]),
    redisCommand(['GET', keys.ipDayKey])
  ]);
  return Boolean(anonUsed || ipUsed);
}

async function reserveGeneration(keys) {
  const anonReserved = await redisCommand(['SET', keys.pendingAnonKey, '1', 'NX', 'EX', PENDING_TTL]);
  if (anonReserved !== 'OK') return false;

  const ipReserved = await redisCommand(['SET', keys.pendingIpKey, '1', 'NX', 'EX', PENDING_TTL]);
  if (ipReserved !== 'OK') {
    await redisCommand(['DEL', keys.pendingAnonKey]).catch(() => null);
    return false;
  }

  return true;
}

async function markFreeGenerationUsed(keys) {
  await Promise.all([
    redisCommand(['SET', keys.anonKey, '1', 'EX', ANON_TTL]),
    redisCommand(['SET', keys.ipDayKey, '1', 'EX', IP_DAY_TTL]),
    redisCommand(['DEL', keys.pendingAnonKey]),
    redisCommand(['DEL', keys.pendingIpKey])
  ]);
}

async function releaseGeneration(keys) {
  await Promise.all([
    redisCommand(['DEL', keys.pendingAnonKey]).catch(() => null),
    redisCommand(['DEL', keys.pendingIpKey]).catch(() => null)
  ]);
}

async function generateImage(prompt) {
  const baseUrl = (process.env.CIYUAN_BASE_URL || DEFAULT_CIYUAN_BASE_URL).replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/v1/images/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CIYUAN_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'low',
      format: 'jpeg'
    })
  });
  const payload = await response.json().catch(() => ({}));
  const b64 = payload?.data?.[0]?.b64_json;

  if (!response.ok || !b64) {
    throw new Error(payload?.error?.message || `Image generation failed with status ${response.status}`);
  }

  return `data:image/jpeg;base64,${b64}`;
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const { anonId, shouldSetCookie } = getOrCreateAnonId(req);
  const cookieHeaders = shouldSetCookie ? { 'Set-Cookie': buildCookie(anonId) } : {};

  if (!isServerConfigured()) {
    return json(res, 500, { ok: false, error: 'SERVER_NOT_CONFIGURED' }, cookieHeaders);
  }

  const keys = buildKeys(anonId, getClientIp(req));

  try {
    if (req.method === 'GET') {
      const freeUsed = await hasUsedFreeGeneration(keys);
      return json(res, 200, { ok: true, freeUsed }, cookieHeaders);
    }

    let body;
    try {
      body = await readBody(req);
    } catch {
      return json(res, 400, { ok: false, error: 'INVALID_PROMPT' }, cookieHeaders);
    }

    const prompt = String(body.prompt || '').trim();
    const caseId = Number(body.caseId);
    if (!prompt || prompt.length > MAX_PROMPT_LENGTH || !Number.isFinite(caseId)) {
      return json(res, 400, { ok: false, error: 'INVALID_PROMPT' }, cookieHeaders);
    }

    if (await hasUsedFreeGeneration(keys)) {
      return json(res, 402, { ok: false, error: 'FREE_LIMIT_REACHED' }, cookieHeaders);
    }

    if (!(await reserveGeneration(keys))) {
      return json(res, 402, { ok: false, error: 'FREE_LIMIT_REACHED' }, cookieHeaders);
    }

    try {
      const image = await generateImage(prompt);
      await markFreeGenerationUsed(keys);
      return json(res, 200, { ok: true, image }, cookieHeaders);
    } catch {
      await releaseGeneration(keys);
      return json(res, 502, { ok: false, error: 'GENERATION_FAILED' }, cookieHeaders);
    }
  } catch {
    return json(res, 500, { ok: false, error: 'SERVER_NOT_CONFIGURED' }, cookieHeaders);
  }
}
