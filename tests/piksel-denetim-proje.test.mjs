import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel proje detay: kahraman sütunu telefonda taşmaz; klavye ipucu telefonda gizli', () => {
  const css = oku('css/piksel-proje.css');
  assert.match(css, /\.p-kahraman > \*, & \.p-metin \{ min-width: 0; \}/);
  assert.match(css, /@media \(max-width: 760px\) \{ & \.px-pin-ipucu \{ display: none; \} \}/);
});
