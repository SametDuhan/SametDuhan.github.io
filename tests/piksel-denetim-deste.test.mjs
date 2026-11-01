import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel sunumlar: koyulaştırılan kod/terminal kutularında yazı rengi de açık (sunumun kendi kuralı koyu yazı varsayar)', () => {
  const deste = oku('css/deste.css');
  assert.match(deste, /\.slayt pre code \{[^}]*color: var\(--zemin\)/);      // sorunun kaynağı: açık kâğıt kutu varsayımı
  assert.match(oku('css/atolye.css'), /\.laboratuvar \.terminal \{[^}]*color:var\(--zemin\)/);
  const piksel = oku('css/piksel-deste.css');
  assert.match(piksel, /pre code[^{]*\.laboratuvar \.terminal[^{]*\{ color: var\(--yazi\); \}/);
  assert.match(piksel, /pre\.terminal, & pre\.adim-kod, & \.dene code, & pre \{ background: #141312/);  // koyu zemin ile açık yazı birlikte
});
