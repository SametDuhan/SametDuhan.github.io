import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');
const parlaklik = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('modern: koyu temada sayfa numarası rozeti koyu yazılı (turuncu zeminde ≥4,5:1); açık temada aktif kehribar menü numarası koyu turuncu', () => {
  const modern = oku('css/modern.css'), tema = oku('css/tema.css');
  assert.match(tema, /\.etiket \.no \{[^}]*color: var\(--p-ust, var\(--yazi\)\)/);            // sorunun kaynağı: --p-ust yoksa --yazi (koyu temada açık)
  assert.match(modern, /html\[data-gorunum="modern"\]\[data-tema="koyu"\] \{[^\n]*& \.etiket \.no \{ color: var\(--p-ust, #1a1916\); \}/);
  assert.match(modern, /:not\(\[data-tema="acik"\]\) \{[^\n]*& \.etiket \.no \{ color: var\(--p-ust, #1a1916\); \}/);
  assert.ok(kontrast('#1a1916', '#d97757') >= 4.5);                                             // rozet: koyu yazı turuncu zeminde
  assert.match(modern, /\.menu-linkler a\.p-kehribar\[aria-current="page"\] i \{ color: var\(--vurgu-koyu\); \}/);
  assert.ok(kontrast('#a9461f', '#ffffff') >= 4.5);                                              // modern açık: --vurgu-koyu beyaz kartta
  assert.ok(kontrast('#e8916f', '#201f1b') >= 4.5);                                              // modern koyu: kart zemininde
});
