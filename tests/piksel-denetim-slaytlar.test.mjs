import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel Slaytlar: tek sayfada tek karakter, yalnız seçili kartta görünür', () => {
  const css = oku('css/piksel-slaytlar.css');
  assert.match(css, /\.px-iz canvas \{[^}]*opacity: 0;/);
  assert.match(css, /\.deste-karti\.px-secili \.px-iz canvas \{ opacity: 1; \}/);
  assert.match(oku('js/piksel-slaytlar-icindekiler.js'), /classList\.toggle\('px-secili'/);   // seçili kartı işaretleyen parça gerçekten var
});
