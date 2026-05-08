import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillName = 'gpt-image-2-style-library';
const source = join(root, 'agents', 'skills', skillName);
const codexHome = process.env.CODEX_HOME || join(homedir(), '.codex');
const targetRoot = join(codexHome, 'skills');
const target = join(targetRoot, skillName);

if (!existsSync(join(source, 'SKILL.md'))) {
  throw new Error(`Skill source is missing: ${source}`);
}

mkdirSync(targetRoot, { recursive: true });
rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

console.log(`Installed ${skillName} to ${target}`);
