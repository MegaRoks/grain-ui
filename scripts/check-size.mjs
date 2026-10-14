#!/usr/bin/env node
// Бюджет бандла. Запускается после npm run build и в CI.
import { readFileSync, statSync } from 'node:fs';

const BUDGET = { 'dist/styles.css': 60 * 1024, 'dist/index.js': 120 * 1024 };
let failed = false;
const fail = (msg) => { console.error('✖ ' + msg); failed = true; };

for (const [file, max] of Object.entries(BUDGET)) {
  const size = statSync(file).size;
  const kb = (n) => (n / 1024).toFixed(1) + ' KB';
  if (size > max) fail(`${file}: ${kb(size)} > бюджета ${kb(max)}`);
  else console.log(`✔ ${file}: ${kb(size)} (бюджет ${kb(max)})`);
}

const css = readFileSync('dist/styles.css', 'utf8');
if (css.includes('base64')) fail('dist/styles.css содержит base64 — шрифты/картинки должны идти отдельными файлами (см. fonts.css).');

const js = readFileSync('dist/index.js', 'utf8');
if (/\bicons\b\s*[,}]/.test(js) && /from\s*["']lucide-react["']/.test(js) && /import\s*\{[^}]*\bicons\b/.test(js)) {
  fail('dist/index.js импортирует весь набор `icons` из lucide-react — используйте именованные импорты.');
}

process.exit(failed ? 1 : 0);
