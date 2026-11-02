import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');
const parlaklik = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('piksel: sayfa numarası rozeti koyu yazılı; aktif menü numarası (--vurgu-koyu) koyu zeminde okunur', () => {
  const piksel = oku('css/piksel.css');
  assert.match(piksel, /& \.etiket \.no \{ color: var\(--p-ust, #1a1916\); \}/);
  assert.ok(kontrast('#1a1916', '#d97757') >= 4.5);
  assert.match(piksel, /--vurgu-koyu: #f09a78/);
  assert.ok(kontrast('#f09a78', '#2a2724') >= 4.5);
});
