import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');
const parlaklik = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('piksel: sunumdaki sabit açık yazılı pencere ve onay etiketi koyu zeminde okunur', () => {
  const piksel = oku('css/piksel.css');
  assert.match(piksel, /& \.pencere \{ background: #141312; border-color: var\(--kenar\); \}/);
  assert.match(piksel, /& \.kapi \.onay text \{ fill: #10201a; \}/);
  for (const yazi of ['#f2e8d5', '#e9b982', '#e7d9bf']) assert.ok(kontrast(yazi, '#141312') >= 4.5, yazi);
  assert.ok(kontrast('#10201a', '#7cc1a8') >= 4.5);      // piksel jetonları --iyi: #7cc1a8
  assert.match(piksel, /--iyi: #7cc1a8/);
});
