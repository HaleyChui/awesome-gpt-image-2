import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  Eye,
  Github,
  ImageIcon,
  LoaderCircle,
  PackageCheck,
  Search,
  Sparkles,
  Terminal,
  WandSparkles,
  X
} from 'lucide-react';
import './styles.css';
import skillExampleImage from '../agents/skills/gpt-image-2-style-library/assets/city-life-system-map.png';

const fallbackRepoUrl = 'https://github.com/freestylefly/awesome-gpt-image-2';

const copy = {
  en: {
    loading: 'Loading GPT-Image2 cases...',
    brand: 'GPT-Image2 Gallery',
    navCases: 'Cases',
    navSkill: 'Skill',
    navTemplates: 'Templates',
    eyebrow: 'Live GPT-Image2 prompt gallery',
    title: 'From viral images to reusable prompts.',
    subtitle:
      'A visual front door for the awesome-gpt-image-2 repository: copy production-ready prompts, filter by style or scene, and jump straight into the GitHub source.',
    explore: 'Explore cases',
    githubProject: 'GitHub project',
    cases: 'cases',
    categories: 'categories',
    templates: 'templates',
    sectionEyebrow: 'Copy, filter, remix',
    sectionTitle: 'Viral cases with prompts one click away.',
    templateEyebrow: '20+ industrial prompt templates',
    templateTitle: 'Start from a proven template, then remix the case library.',
    templateSubtitle:
      'Each template is distilled from real GPT-Image2 examples and includes structure, constraints, and pitfalls for production use.',
    templateKind: 'Prompt Template',
    openTemplate: 'Open Template',
    skillEyebrow: 'Agent skill',
    skillTitle: 'Bring the GPT-Image2 style library into Claude Code and Codex.',
    skillSubtitle:
      'Install one skill, then let your agent choose templates, visual styles, scene tags, and pitfalls from the same library behind this site.',
    skillCommandLabel: 'Install for local agents',
    skillPromptLabel: 'Try this request',
    skillPrompt: 'Use gpt-image-2-style-library to create a city life system map.',
    skillCopyCommand: 'Copy command',
    skillOpenDocs: 'Open skill source',
    skillNpm: 'View npm package',
    skillCopied: 'Command copied',
    skillExampleAlt: 'City life system map generated with the GPT-Image2 style library skill',
    skillExampleCaption: 'Example output generated from the style-library skill.',
    skillStats: ['Claude Code ready', 'Codex ready', '20+ templates'],
    search: 'Search cases, sources, prompts...',
    category: 'Category',
    style: 'Style',
    scene: 'Scene',
    all: 'All',
    matching: 'matching cases',
    openGithub: 'Open GitHub project',
    copied: 'Copied',
    copyPrompt: 'Copy Prompt',
    copyTemplatePrompt: 'Copy Template',
    closePreview: 'Close preview',
    viewDetails: 'View Details',
    generateTest: 'Generate Test',
    generateImage: 'Generate Image',
    generating: 'Generating...',
    editablePrompt: 'Editable Prompt',
    generatedResult: 'Generated Result',
    resetPrompt: 'Reset Prompt',
    oneFreeGeneration: '1 free test image',
    freeLimitReached: 'Free generation used. Credits are coming soon.',
    generationBusy: 'The image service is busy. Please try again in a moment.',
    generationFailed: 'Generation failed. Please try again later.',
    promptRequired: 'Prompt is required and must stay under 6000 characters.',
    serverUnavailable: 'Generation service is not configured yet.',
    fullPrompt: 'Full Prompt',
    templatePrompt: 'Template Prompt',
    useWhen: 'Use When',
    guidance: 'Guidance',
    pitfalls: 'Pitfalls',
    examples: 'Example Cases',
    source: 'Source',
    openOnGithub: 'Open on GitHub',
    limit: (count) => `Showing the first ${count} results for speed. Use search or filters to narrow the gallery.`
  },
  zh: {
    loading: '正在加载 GPT-Image2 案例...',
    brand: 'GPT-Image2 画廊',
    navCases: '案例',
    navSkill: '技能',
    navTemplates: '模板',
    eyebrow: '实时更新的 GPT-Image2 提示词画廊',
    title: '从爆款图片，到可复用 Prompt。',
    subtitle:
      '这是 awesome-gpt-image-2 的可视化入口：复制可直接复用的 Prompt，按风格或场景筛选，并一键跳转到 GitHub 源项目。',
    explore: '浏览案例',
    githubProject: 'GitHub 项目',
    cases: '个案例',
    categories: '个分类',
    templates: '套模板',
    sectionEyebrow: '复制、筛选、复用',
    sectionTitle: '爆款案例和 Prompt，一键可取。',
    templateEyebrow: '20+ 套工业级提示词模板',
    templateTitle: '先用成熟模板起稿，再从案例库里继续 remix。',
    templateSubtitle:
      '每套模板都从真实 GPT-Image2 案例里提炼，包含结构、约束和防坑经验，适合生产流程直接复用。',
    templateKind: '提示词模板',
    openTemplate: '打开模板',
    skillEyebrow: 'Agent Skill',
    skillTitle: '把 GPT-Image2 风格库装进 Claude Code 和 Codex。',
    skillSubtitle:
      '安装一个 skill，让 Agent 从本站同源的模板、风格、场景和防坑规则里自动选型，直接输出可复制的 GPT Image 2 prompt。',
    skillCommandLabel: '安装到本地 Agent',
    skillPromptLabel: '试试这个请求',
    skillPrompt: '用 gpt-image-2-style-library 技能生成城市生命系统图谱',
    skillCopyCommand: '复制命令',
    skillOpenDocs: '打开 skill 源码',
    skillNpm: '查看 npm 包',
    skillCopied: '命令已复制',
    skillExampleAlt: '使用 GPT-Image2 风格库 skill 生成的城市生命系统图谱',
    skillExampleCaption: '示例：用 gpt-image-2-style-library 生成“城市生命系统图谱”。',
    skillStats: ['Claude Code 可用', 'Codex 可用', '20+ 套模板'],
    search: '搜索案例、来源、Prompt...',
    category: '分类',
    style: '风格',
    scene: '场景',
    all: '全部',
    matching: '个匹配案例',
    openGithub: '打开 GitHub 项目',
    copied: '已复制',
    copyPrompt: '复制 Prompt',
    copyTemplatePrompt: '复制模板',
    closePreview: '关闭预览',
    viewDetails: '查看详情',
    generateTest: '生成测试',
    generateImage: '生成图片',
    generating: '生成中...',
    editablePrompt: '可编辑 Prompt',
    generatedResult: '生成结果',
    resetPrompt: '重置 Prompt',
    oneFreeGeneration: '免费生成 1 张测试图',
    freeLimitReached: '免费额度已用完，积分购买即将开放。',
    generationBusy: '生图服务繁忙，请稍后再试。',
    generationFailed: '生成失败，请稍后再试。',
    promptRequired: 'Prompt 不能为空，并且不能超过 6000 字符。',
    serverUnavailable: '生成服务还没有完成配置。',
    fullPrompt: '完整 Prompt',
    templatePrompt: '模板 Prompt',
    useWhen: '适用场景',
    guidance: '使用建议',
    pitfalls: '防坑指南',
    examples: '关联案例',
    source: '来源',
    openOnGithub: '在 GitHub 打开',
    limit: (count) => `为了保证浏览速度，当前展示前 ${count} 条结果。可以用搜索或筛选缩小范围。`
  }
};

const labelMap = {
  zh: {
    'Architecture & Spaces': '建筑与空间',
    Architecture: '建筑',
    Brand: '品牌',
    'Brand & Logos': '品牌与标志',
    Character: '角色',
    Characters: '人物',
    'Characters & People': '人物与角色',
    Charts: '图表',
    'Charts & Infographics': '图表与信息可视化',
    Classical: '古典',
    Commerce: '商业',
    Creative: '创意',
    Documents: '文档',
    'Documents & Publishing': '文档与出版物',
    Education: '教育',
    Fashion: '时尚',
    Food: '食品饮品',
    History: '历史',
    'History & Classical Themes': '历史与古风题材',
    Illustration: '插画',
    'Illustration & Art': '插画与艺术',
    Infographic: '信息图',
    'Other Use Cases': '其他应用场景',
    Photography: '摄影',
    'Photography & Realism': '摄影与写实',
    Poster: '海报',
    'Posters & Typography': '海报与排版',
    Product: '商品',
    Products: '商品',
    'Products & E-commerce': '商品与电商',
    Realistic: '写实',
    Scenes: '场景',
    'Scenes & Storytelling': '场景与叙事',
    Social: '社媒',
    Story: '叙事',
    Tech: '科技',
    Travel: '旅行',
    UI: '界面',
    'UI & Interfaces': 'UI 与界面'
  }
};

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function textFor(value, language) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || value.zh || '';
}

function listFor(value, language) {
  const localized = value?.[language] || value?.en || value?.zh || [];
  return Array.isArray(localized) ? localized : [];
}

function compactText(value, maxLength = 180) {
  if (!value || value.length <= maxLength) return value || '';
  return `${value.slice(0, maxLength)}...`;
}

function localizeLabel(value, language, styleLibrary) {
  const libraryItems = [
    ...(styleLibrary?.categories || []),
    ...(styleLibrary?.styles || []),
    ...(styleLibrary?.scenes || [])
  ];
  const match = libraryItems.find((item) => item.value === value || item.id === value);
  if (match) return textFor(match.title, language);
  return labelMap[language]?.[value] || value;
}

function localizeTemplateTag(value, language, styleLibrary) {
  const tagLabel = styleLibrary?.tagLabels?.[value];
  if (tagLabel) return textFor(tagLabel, language);
  return localizeLabel(value, language, styleLibrary);
}

function orderByLibrary(values, libraryItems = []) {
  const order = new Map(libraryItems.map((item, index) => [item.value, index]));
  return [...values].sort((a, b) => {
    const aOrder = order.has(a) ? order.get(a) : Number.MAX_SAFE_INTEGER;
    const bOrder = order.has(b) ? order.get(b) : Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.localeCompare(b);
  });
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some embedded browsers block the async clipboard API. Fall back to the
      // older selection path so the copy button still works in local previews.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function useCopy() {
  const [copiedId, setCopiedId] = useState(null);

  async function copyText(text, id) {
    await copyToClipboard(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  async function copyPrompt(caseItem) {
    await copyText(caseItem.prompt, `case-${caseItem.id}`);
  }

  return { copiedId, copyPrompt, copyText };
}

function generationErrorMessage(error, language) {
  const t = copy[language];
  if (error === 'FREE_LIMIT_REACHED') return t.freeLimitReached;
  if (error === 'UPSTREAM_BUSY') return t.generationBusy;
  if (error === 'SERVER_NOT_CONFIGURED') return t.serverUnavailable;
  if (error === 'INVALID_PROMPT') return t.promptRequired;
  return t.generationFailed;
}

function formatTemplatePrompt(item, language, styleLibrary) {
  const title = textFor(item.title, language);
  const description = textFor(item.description, language);
  const useWhen = textFor(item.useWhen, language);
  const guidance = listFor(item.guidance, language);
  const pitfalls = listFor(item.pitfalls, language);
  const tags = [
    localizeLabel(item.category, language, styleLibrary),
    ...(item.styles || []).map((style) => localizeLabel(style, language, styleLibrary)),
    ...(item.scenes || []).map((scene) => localizeLabel(scene, language, styleLibrary)),
    ...(item.tags || []).map((tag) => localizeTemplateTag(tag, language, styleLibrary))
  ].filter(Boolean);
  const uniqueTags = [...new Set(tags)];

  if (language === 'zh') {
    return [
      `模板：${title}`,
      `用途：${useWhen || description}`,
      `视觉方向：${uniqueTags.join(' / ')}`,
      '',
      '请基于以下结构生成一条可直接用于 GPT Image 2 的图片 Prompt：',
      '- 主体：[要生成的产品、人物、空间、界面或信息主题]',
      '- 场景：[使用环境、叙事背景、受众语境]',
      '- 构图：[画面比例、镜头距离、主体位置、层级关系]',
      '- 风格：[材质、光线、色彩、时代感、品牌气质]',
      '- 文本：[必须准确显示的标题、标签、按钮或说明文字]',
      '- 细节：[关键装饰、辅助元素、信息标注、交互层]',
      '- 输出：[清晰度、比例、完成度、可读性要求]',
      '',
      '核心约束：',
      ...guidance.map((line) => `- ${line}`),
      '',
      '需要避免：',
      ...pitfalls.map((line) => `- ${line}`)
    ].join('\n');
  }

  return [
    `Template: ${title}`,
    `Use case: ${useWhen || description}`,
    `Visual direction: ${uniqueTags.join(' / ')}`,
    '',
    'Create a copy-ready GPT Image 2 prompt with this structure:',
    '- Subject: [product, person, space, interface, or information topic]',
    '- Scene: [context, audience, narrative setting]',
    '- Composition: [aspect ratio, camera distance, focal hierarchy, placement]',
    '- Style: [material, lighting, color, era, brand tone]',
    '- Text: [exact title, labels, buttons, or annotations that must be readable]',
    '- Details: [decorative elements, callouts, UI layers, supporting objects]',
    '- Output: [resolution, aspect ratio, polish level, readability requirements]',
    '',
    'Core constraints:',
    ...guidance.map((line) => `- ${line}`),
    '',
    'Avoid:',
    ...pitfalls.map((line) => `- ${line}`)
  ].join('\n');
}

function Hero({ latestCases, language, repoUrl, totalCases, categoryCount }) {
  const t = copy[language];

  return (
    <section className="hero">
      <div className="heroGlow heroGlowA" />
      <div className="heroGlow heroGlowB" />
      <div className="scanGrid" />
      <div className="heroCopy">
        <div className="eyebrow">
          <Sparkles size={16} />
          {t.eyebrow}
        </div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <div className="heroActions">
          <a className="primaryAction" href="#gallery">
            {t.explore}
            <ArrowUpRight size={18} />
          </a>
          <a className="secondaryAction" href={repoUrl} target="_blank" rel="noreferrer">
            <Github size={18} />
            {t.githubProject}
          </a>
        </div>
        <div className="metrics">
          <span><strong>{totalCases}</strong> {t.cases}</span>
          <span><strong>{categoryCount}</strong> {t.categories}</span>
          <span><strong>20+</strong> {t.templates}</span>
        </div>
      </div>
      <div className="heroDeck" aria-label="Latest GPT-Image2 cases">
        {latestCases.slice(0, 5).map((caseItem, index) => (
          <a
            className={`heroCard heroCard${index + 1}`}
            href={caseItem.githubUrl}
            target="_blank"
            rel="noreferrer"
            key={caseItem.id}
          >
            <img src={caseItem.image} alt={caseItem.imageAlt} />
            <span>{language === 'zh' ? '案例' : 'Case'} {caseItem.id}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button className={cx('filterPill', active && 'active')} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function LanguageSwitch({ language, setLanguage }) {
  return (
    <div className="languageSwitch" aria-label="Language switcher">
      <button
        className={cx(language === 'en' && 'active')}
        type="button"
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        className={cx(language === 'zh' && 'active')}
        type="button"
        onClick={() => setLanguage('zh')}
      >
        中文
      </button>
    </div>
  );
}

function SkillSection({ language, repoUrl }) {
  const t = copy[language];
  const [commandCopied, setCommandCopied] = useState(false);
  const installCommand =
    'npx skills add freestylefly/awesome-gpt-image-2 --skill gpt-image-2-style-library --agent claude-code codex --global --yes --copy';
  const skillSourceUrl = `${repoUrl}/tree/main/agents/skills/gpt-image-2-style-library`;
  const npmUrl = 'https://www.npmjs.com/package/gpt-image-2-style-library';

  async function handleCopyCommand() {
    await copyToClipboard(installCommand);
    setCommandCopied(true);
    window.setTimeout(() => setCommandCopied(false), 1600);
  }

  return (
    <section className="skillSection" id="agent-skill">
      <div className="skillGrid">
        <div className="skillCopy">
          <span className="eyebrow">
            <Bot size={16} />
            {t.skillEyebrow}
          </span>
          <h2>{t.skillTitle}</h2>
          <p>{t.skillSubtitle}</p>
          <div className="skillStats">
            {t.skillStats.map((item, index) => {
              const icons = [Bot, Terminal, PackageCheck];
              const Icon = icons[index] || Check;
              return (
                <span key={item}>
                  <Icon size={16} />
                  {item}
                </span>
              );
            })}
          </div>
          <div className="skillCommand">
            <div className="skillCommandHeader">
              <strong>{t.skillCommandLabel}</strong>
              <button type="button" onClick={handleCopyCommand}>
                {commandCopied ? <Check size={16} /> : <Copy size={16} />}
                {commandCopied ? t.skillCopied : t.skillCopyCommand}
              </button>
            </div>
            <code>{installCommand}</code>
          </div>
          <div className="skillPrompt">
            <span>{t.skillPromptLabel}</span>
            <code>{t.skillPrompt}</code>
          </div>
          <div className="skillActions">
            <a href={skillSourceUrl} target="_blank" rel="noreferrer">
              <Github size={18} />
              {t.skillOpenDocs}
            </a>
            <a href={npmUrl} target="_blank" rel="noreferrer">
              <PackageCheck size={18} />
              {t.skillNpm}
            </a>
          </div>
        </div>
        <figure className="skillPreview">
          <img src={skillExampleImage} alt={t.skillExampleAlt} loading="lazy" />
          <figcaption>
            <Sparkles size={15} />
            {t.skillExampleCaption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function TemplateSection({ language, styleLibrary, onOpenTemplate }) {
  const t = copy[language];
  const repoDocsUrl = `${styleLibrary.repository || fallbackRepoUrl}/blob/main/${styleLibrary.templateDocument}`;
  const templates = styleLibrary.templates || [];

  return (
    <section className="templateSection" id="templates">
      <div className="sectionHead templateHead">
        <div>
          <span className="eyebrow">{t.templateEyebrow}</span>
          <h2>{t.templateTitle}</h2>
          <p>{t.templateSubtitle}</p>
        </div>
        <a className="templateCta" href={`${repoDocsUrl}#section-templates`} target="_blank" rel="noreferrer">
          {t.openTemplate}
          <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="caseGrid templateCaseGrid">
        {templates.map((item, index) => {
          const title = textFor(item.title, language);
          const description = textFor(item.description, language);
          return (
            <article className="caseCard templateVisualCard" key={item.id}>
              <button
                className="caseImage imageButton templateImage"
                type="button"
                onClick={() => onOpenTemplate(item)}
              >
                <img src={item.cover} alt={title} loading="lazy" />
                <span className="caseBadge">
                  {language === 'zh' ? '模板' : 'Template'} {String(index + 1).padStart(2, '0')}
                </span>
                <span className="imageHint">
                  <Eye size={15} />
                  {t.viewDetails}
                </span>
              </button>
              <div className="caseBody">
                <div className="caseMeta">
                  <span>{t.templateKind}</span>
                  <span>{localizeLabel(item.category, language, styleLibrary)}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="tagRow">
                  {(item.tags || []).map((tag) => (
                    <span key={`${item.id}-${tag}`}>{localizeTemplateTag(tag, language, styleLibrary)}</span>
                  ))}
                </div>
                <div className="cardActions templateActions">
                  <button type="button" onClick={() => onOpenTemplate(item)}>
                    <Eye size={17} />
                    {t.viewDetails}
                  </button>
                  <a href={`${repoDocsUrl}#${item.anchor}`} target="_blank" rel="noreferrer">
                    {t.openTemplate}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PromptCard({ caseItem, copied, language, onCopy, onOpen, onGenerate, styleLibrary }) {
  const t = copy[language];
  const tags = [...new Set([...caseItem.styles, ...caseItem.scenes])].slice(0, 4);

  return (
    <article className="caseCard">
      <button className="caseImage imageButton" type="button" onClick={() => onOpen(caseItem)}>
        <img src={caseItem.image} alt={caseItem.imageAlt} loading="lazy" />
        <span className="caseBadge">{language === 'zh' ? '案例' : 'Case'} {caseItem.id}</span>
        <span className="imageHint">
          <Eye size={15} />
          {t.viewDetails}
        </span>
      </button>
      <div className="caseBody">
        <div className="caseMeta">
          <span>{localizeLabel(caseItem.category, language, styleLibrary)}</span>
          {caseItem.sourceUrl ? (
            <a href={caseItem.sourceUrl} target="_blank" rel="noreferrer">
              {caseItem.sourceLabel}
            </a>
          ) : (
            <span>{caseItem.sourceLabel}</span>
          )}
        </div>
        <h3>{caseItem.title}</h3>
        <p>{caseItem.promptPreview}</p>
        <div className="tagRow">
          {tags.map((tag) => (
            <span key={`${caseItem.id}-${tag}`}>{localizeLabel(tag, language, styleLibrary)}</span>
          ))}
        </div>
        <div className="cardActions caseActions">
          <button type="button" onClick={() => onCopy(caseItem)}>
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? t.copied : t.copyPrompt}
          </button>
          <button type="button" onClick={() => onOpen(caseItem)}>
            <Eye size={17} />
            {t.viewDetails}
          </button>
          <button type="button" onClick={() => onGenerate(caseItem)}>
            <ImageIcon size={17} />
            {t.generateTest}
          </button>
          <a href={caseItem.githubUrl} target="_blank" rel="noreferrer" aria-label={t.openOnGithub}>
            <Github size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

function PreviewDialog({
  preview,
  language,
  styleLibrary,
  copiedId,
  freeUsed,
  onClose,
  onCopyText,
  onFreeUsedChange
}) {
  const t = copy[language];
  const repoDocsUrl = `${styleLibrary.repository || fallbackRepoUrl}/blob/main/${styleLibrary.templateDocument}`;
  const [editablePrompt, setEditablePrompt] = useState('');
  const [generationState, setGenerationState] = useState({
    status: 'idle',
    image: '',
    message: ''
  });

  useEffect(() => {
    if (!preview) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [preview, onClose]);

  useEffect(() => {
    if (preview?.type !== 'case') return;
    setEditablePrompt(preview.item.prompt || '');
    setGenerationState({ status: 'idle', image: '', message: '' });
  }, [preview]);

  if (!preview) return null;

  const { type, item } = preview;
  const isTemplate = type === 'template';
  const title = isTemplate ? textFor(item.title, language) : item.title;
  const description = isTemplate ? textFor(item.description, language) : compactText(item.promptPreview);
  const image = isTemplate ? item.cover : item.image;
  const imageAlt = isTemplate ? title : item.imageAlt;
  const promptText = isTemplate ? formatTemplatePrompt(item, language, styleLibrary) : editablePrompt;
  const copyId = isTemplate ? `template-${item.id}` : `case-${item.id}`;
  const isCopied = copiedId === copyId;
  const primaryLink = isTemplate ? `${repoDocsUrl}#${item.anchor}` : item.githubUrl;
  const primaryLabel = isTemplate ? t.openTemplate : t.openOnGithub;
  const meta = isTemplate
    ? [t.templateKind, localizeLabel(item.category, language, styleLibrary)]
    : [
        `${language === 'zh' ? '案例' : 'Case'} ${item.id}`,
        localizeLabel(item.category, language, styleLibrary)
      ];
  const tags = isTemplate
    ? [...new Set([...(item.tags || []), ...(item.styles || []), ...(item.scenes || [])])].slice(0, 8)
    : [...new Set([...(item.styles || []), ...(item.scenes || [])])].slice(0, 8);
  const guidance = listFor(item.guidance, language);
  const pitfalls = listFor(item.pitfalls, language);
  const isGenerating = generationState.status === 'generating';

  async function handleGenerate() {
    if (isTemplate || isGenerating) return;
    const prompt = editablePrompt.trim();
    if (!prompt || prompt.length > 6000) {
      setGenerationState({ status: 'error', image: '', message: t.promptRequired });
      return;
    }
    if (freeUsed) {
      setGenerationState({ status: 'error', image: '', message: t.freeLimitReached });
      return;
    }

    setGenerationState({ status: 'generating', image: '', message: '' });

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: item.id,
          prompt
        })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.ok || !payload.image) {
        if (payload.error === 'FREE_LIMIT_REACHED') onFreeUsedChange(true);
        throw new Error(payload.error || 'GENERATION_FAILED');
      }

      onFreeUsedChange(true);
      setGenerationState({ status: 'success', image: payload.image, message: '' });
    } catch (error) {
      setGenerationState({
        status: 'error',
        image: '',
        message: generationErrorMessage(error.message, language)
      });
    }
  }

  return (
    <div
      className="previewOverlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="previewDialog" role="dialog" aria-modal="true" aria-labelledby="preview-title">
        <button className="previewClose" type="button" onClick={onClose} aria-label={t.closePreview}>
          <X size={20} />
        </button>
        <div className="previewMedia">
          <img src={image} alt={imageAlt} />
        </div>
        <div className="previewContent">
          <div className="previewMeta">
            {meta.map((itemMeta) => (
              <span key={itemMeta}>{itemMeta}</span>
            ))}
          </div>
          <h2 id="preview-title">{title}</h2>
          <p>{description}</p>
          <div className="tagRow previewTags">
            {tags.map((tag) => (
              <span key={`${type}-${item.id}-${tag}`}>
                {isTemplate
                  ? localizeTemplateTag(tag, language, styleLibrary)
                  : localizeLabel(tag, language, styleLibrary)}
              </span>
            ))}
          </div>
          {isTemplate && item.useWhen ? (
            <div className="previewSection compactSection">
              <h3>{t.useWhen}</h3>
              <p>{textFor(item.useWhen, language)}</p>
            </div>
          ) : null}
          <div className="previewActions">
            <button type="button" onClick={() => onCopyText(promptText, copyId)}>
              {isCopied ? <Check size={17} /> : <Copy size={17} />}
              {isCopied ? t.copied : isTemplate ? t.copyTemplatePrompt : t.copyPrompt}
            </button>
            {!isTemplate ? (
              <button type="button" onClick={handleGenerate} disabled={isGenerating || freeUsed}>
                {isGenerating ? <LoaderCircle className="spinIcon" size={17} /> : <ImageIcon size={17} />}
                {isGenerating ? t.generating : t.generateTest}
              </button>
            ) : null}
            <a href={primaryLink} target="_blank" rel="noreferrer">
              {primaryLabel}
              <ArrowUpRight size={17} />
            </a>
            {!isTemplate && item.sourceUrl ? (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                {t.source}
                <ArrowUpRight size={17} />
              </a>
            ) : null}
          </div>
          <div className="previewSection">
            <div className="sectionTitleRow">
              <h3>{isTemplate ? t.templatePrompt : t.editablePrompt}</h3>
              {!isTemplate ? (
                <button type="button" onClick={() => setEditablePrompt(item.prompt || '')}>
                  {t.resetPrompt}
                </button>
              ) : null}
            </div>
            {isTemplate ? (
              <pre className="promptBlock">{promptText}</pre>
            ) : (
              <textarea
                className="promptEditor"
                value={editablePrompt}
                onChange={(event) => setEditablePrompt(event.target.value)}
                maxLength={6000}
              />
            )}
          </div>
          {!isTemplate ? (
            <div className="generationPanel">
              <div className={cx('generationQuota', freeUsed && 'used')}>
                {freeUsed ? t.freeLimitReached : t.oneFreeGeneration}
              </div>
              <button type="button" onClick={handleGenerate} disabled={isGenerating || freeUsed}>
                {isGenerating ? <LoaderCircle className="spinIcon" size={17} /> : <ImageIcon size={17} />}
                {isGenerating ? t.generating : t.generateImage}
              </button>
              {generationState.status === 'error' ? (
                <p className="generationMessage">{generationState.message}</p>
              ) : null}
              {generationState.image ? (
                <figure className="generatedResult">
                  <img src={generationState.image} alt={t.generatedResult} />
                  <figcaption>{t.generatedResult}</figcaption>
                </figure>
              ) : null}
            </div>
          ) : null}
          {isTemplate && (guidance.length || pitfalls.length || item.exampleCases?.length) ? (
            <div className="previewColumns">
              {guidance.length ? (
                <div className="previewSection compactSection">
                  <h3>{t.guidance}</h3>
                  <ul>
                    {guidance.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {pitfalls.length ? (
                <div className="previewSection compactSection">
                  <h3>{t.pitfalls}</h3>
                  <ul>
                    {pitfalls.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.exampleCases?.length ? (
                <div className="previewSection compactSection">
                  <h3>{t.examples}</h3>
                  <div className="exampleCaseRow">
                    {item.exampleCases.map((caseId) => (
                      <a
                        href={`${styleLibrary.repository || fallbackRepoUrl}/blob/main/docs/gallery.md#case-${caseId}`}
                        target="_blank"
                        rel="noreferrer"
                        key={caseId}
                      >
                        #{caseId}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function App() {
  const [siteData, setSiteData] = useState(null);
  const [styleLibrary, setStyleLibrary] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [scene, setScene] = useState('All');
  const [preview, setPreview] = useState(null);
  const [freeUsed, setFreeUsed] = useState(false);
  const { copiedId, copyPrompt, copyText } = useCopy();
  const repoUrl = siteData?.repository || fallbackRepoUrl;
  const t = copy[language];

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/cases.json').then((response) => response.json()),
      fetch('/style-library.json').then((response) => response.json())
    ])
      .then(([payload, library]) => {
        if (!cancelled) {
          setSiteData(payload);
          setStyleLibrary(library);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/generate-image', { credentials: 'include' })
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled && payload?.ok) {
          setFreeUsed(Boolean(payload.freeUsed));
        }
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!siteData || !styleLibrary || !window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
    });
  }, [siteData, styleLibrary]);

  const latestCases = useMemo(() => {
    if (!siteData) return [];
    return [...siteData.cases].sort((a, b) => b.id - a.id);
  }, [siteData]);

  const filteredCases = useMemo(() => {
    if (!siteData) return [];
    const q = query.trim().toLowerCase();
    return siteData.cases.filter((item) => {
      const matchQuery =
        !q ||
        `${item.id} ${item.title} ${item.category} ${item.prompt} ${item.sourceLabel}`
          .toLowerCase()
          .includes(q);
      const matchCategory = category === 'All' || item.category === category;
      const matchStyle = style === 'All' || item.styles.includes(style);
      const matchScene = scene === 'All' || item.scenes.includes(scene);
      return matchQuery && matchCategory && matchStyle && matchScene;
    });
  }, [siteData, query, category, style, scene]);

  const orderedCategories = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.categories, styleLibrary.categories) : []),
    [siteData, styleLibrary]
  );
  const orderedStyles = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.styles, styleLibrary.styles) : []),
    [siteData, styleLibrary]
  );
  const orderedScenes = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.scenes, styleLibrary.scenes) : []),
    [siteData, styleLibrary]
  );

  const visibleCases = filteredCases.slice(0, 72);

  if (!siteData || !styleLibrary) {
    return (
      <main>
        <div className="loadingScreen">
          <WandSparkles size={28} />
          <span>{t.loading}</span>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#">
          <WandSparkles size={21} />
          {t.brand}
        </a>
        <div className="topbarControls">
          <nav>
            <a href="#agent-skill">{t.navSkill}</a>
            <a href="#templates">{t.navTemplates}</a>
            <a href="#gallery">{t.navCases}</a>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
          <LanguageSwitch language={language} setLanguage={setLanguage} />
        </div>
      </header>

      <Hero
        latestCases={latestCases}
        language={language}
        repoUrl={repoUrl}
        totalCases={siteData.totalCases}
        categoryCount={siteData.categories.length}
      />

      <section className="hotStrip">
        {latestCases.slice(0, 8).map((caseItem) => (
          <a href={caseItem.githubUrl} target="_blank" rel="noreferrer" key={caseItem.id}>
            <img src={caseItem.image} alt={caseItem.imageAlt} />
            <span>#{caseItem.id}</span>
          </a>
        ))}
      </section>

      <SkillSection language={language} repoUrl={repoUrl} />

      <TemplateSection
        language={language}
        styleLibrary={styleLibrary}
        onOpenTemplate={(item) => setPreview({ type: 'template', item })}
      />

      <section className="gallerySection" id="gallery">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">{t.sectionEyebrow}</span>
            <h2>{t.sectionTitle}</h2>
          </div>
          <div className="searchBox">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
            />
          </div>
        </div>

        <div className="filterPanel">
          <div>
            <strong>{t.category}</strong>
            <div className="filterRow">
              <FilterPill active={category === 'All'} onClick={() => setCategory('All')}>{t.all}</FilterPill>
              {orderedCategories.map((item) => (
                <FilterPill key={item} active={category === item} onClick={() => setCategory(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
          <div>
            <strong>{t.style}</strong>
            <div className="filterRow">
              <FilterPill active={style === 'All'} onClick={() => setStyle('All')}>{t.all}</FilterPill>
              {orderedStyles.map((item) => (
                <FilterPill key={item} active={style === item} onClick={() => setStyle(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
          <div>
            <strong>{t.scene}</strong>
            <div className="filterRow">
              <FilterPill active={scene === 'All'} onClick={() => setScene('All')}>{t.all}</FilterPill>
              {orderedScenes.map((item) => (
                <FilterPill key={item} active={scene === item} onClick={() => setScene(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>

        <div className="resultBar">
          <span>{language === 'zh' ? `${filteredCases.length} ${t.matching}` : `${filteredCases.length} ${t.matching}`}</span>
          <a href={repoUrl} target="_blank" rel="noreferrer">
            {t.openGithub}
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="caseGrid">
          {visibleCases.map((caseItem) => (
            <PromptCard
              caseItem={caseItem}
              copied={copiedId === `case-${caseItem.id}`}
              language={language}
              onCopy={copyPrompt}
              onOpen={(item) => setPreview({ type: 'case', item })}
              onGenerate={(item) => setPreview({ type: 'case', item })}
              styleLibrary={styleLibrary}
              key={caseItem.id}
            />
          ))}
        </div>

        {filteredCases.length > visibleCases.length && (
          <p className="limitNote">
            {t.limit(visibleCases.length)}
          </p>
        )}
      </section>
      <PreviewDialog
        preview={preview}
        language={language}
        styleLibrary={styleLibrary}
        copiedId={copiedId}
        freeUsed={freeUsed}
        onClose={() => setPreview(null)}
        onCopyText={copyText}
        onFreeUsedChange={setFreeUsed}
      />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
