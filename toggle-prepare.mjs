import { readFileSync, writeFileSync } from 'fs';

const mode = process.argv[2];
if (mode !== 'disable' && mode !== 'enable') {
  console.error('usage: toggle-prepare.mjs <disable|enable>');
  process.exit(1);
}

const PREPARE_SCRIPT = 'husky';
const path = 'package.json';
const raw = readFileSync(path, 'utf-8');
const indentMatch = /^[ \t]+/m.exec(raw);
const indent = indentMatch ? indentMatch[0] : 2;
const pkg = JSON.parse(raw);

if (mode === 'disable') {
  delete pkg.scripts?.prepare;
} else {
  pkg.scripts = { ...pkg.scripts, prepare: PREPARE_SCRIPT };
}

writeFileSync(path, JSON.stringify(pkg, null, indent) + '\n');
