import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');
const parlaklik = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
// SkyTrack sunumundaki yorum/yut kutusunda sabit açık satır renkleri (css/skytrack-gorsel.css)
const SATIR_RENKLERI = ['#a6dcc5', '#f0b878', '#ffa98d', '#b0a08a', '#f2e8d5'];

test('piksel: SkyTrack sunumundaki yorum/yut kod kutusu koyu zeminde okunur', () => {
  const piksel = oku('css/piksel.css');
  assert.match(piksel, /& \.yorum-yut \{ --yazi: #1f1e1d; --zemin: #f2e8d5; \}/);
  for (const renk of SATIR_RENKLERI) assert.ok(kontrast(renk, '#1f1e1d') >= 4.5, renk);
});
