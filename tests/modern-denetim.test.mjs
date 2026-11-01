import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');
const parlaklik = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('modern koyu: sunumdaki sabit açık yazılı pencere ve onay etiketi okunur (krem-üstüne-krem ve açık yeşil-üstüne-krem kalmaz)', () => {
  const hook = oku('css/hook-gorsel.css'), ajan = oku('css/ajan-gorsel.css'), modern = oku('css/modern.css');
  // sorunun kaynağı: zemin jetonlardan, yazı sabit açık
  assert.match(hook, /\.pencere \{[^}]*background: var\(--yazi\)/);
  assert.match(hook, /\.pencere-ic \{[^}]*color: #f2e8d5/);
  assert.match(ajan, /\.kapi \.onay rect \{ fill: var\(--iyi\); \}/);
  assert.match(ajan, /\.kapi \.onay text \{[^}]*fill: #f2e8d5/);
  // düzeltme: koyu temada hem açıkça seçilmiş (data-tema=koyu) hem cihaz koyuyken
  assert.match(modern, /html\[data-gorunum="modern"\]\[data-tema="koyu"\] \{ & \.pencere \{ background: #1f1e1d;/);
  assert.match(modern, /prefers-color-scheme: dark\) \{\n  html\[data-gorunum="modern"\]:not\(\[data-tema="acik"\]\) \{ & \.pencere \{ background: #1f1e1d;/);
  // sayılar: yeni zeminde sabit açık yazılar ≥4,5:1; koyu onay yazısı modern koyu --iyi üstünde ≥4,5:1
  for (const yazi of ['#f2e8d5', '#e9b982', '#e7d9bf']) assert.ok(kontrast(yazi, '#1f1e1d') >= 4.5, yazi);
  assert.ok(kontrast('#10201a', '#7cc1a8') >= 4.5);
  // açık tema ve Kâğıt'a dokunulmadı: düzeltme yalnız koyu seçicilerde
  assert.doesNotMatch(modern.split('modern koyu: sunumlardaki')[1] ?? '', /data-tema="acik"\] \{ & \.pencere/);
});
