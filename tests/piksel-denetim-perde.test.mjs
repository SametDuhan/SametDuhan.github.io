import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel sayfa geçişi: sade turuncu çizgi (perde ve asılı karakter yok); yeni sayfa çizgiyle açılır; betik gelmezse çizgi kendiliğinden kalkar', () => {
  const g = oku('js/piksel-gecis.js');
  assert.doesNotMatch(g, /asiliKarakter|perdeKur|dokuCiz|canvas/);        // piksel perde ve karakterler kalktı
  assert.match(g, /\.animate\(\[\{ transform: 'scaleX\(0\)' \}, \{ transform: 'scaleX\(1\)' \}\]/);
  assert.match(g, /sessionStorage\.setItem\('pxGecis', '1'\)/);
  assert.match(g, /kok\.removeAttribute\('data-px-gecis'\)/);
  assert.match(g, /if \(AZ\b/);                                           // hareketi azaltınca geçiş yok
  const css = oku('css/piksel.css');
  assert.match(css, /html\[data-px-gecis\]::after \{[^}]*height: 3px[^}]*animation: px-cizgi-kalk \.4s/s);
  assert.ok(!existsSync(join(KOK, 'js/piksel-perde-doku.js')) && !existsSync(join(KOK, 'js/piksel-karakter.js')));   // ana sayfa panel perdesi kalktı
});
