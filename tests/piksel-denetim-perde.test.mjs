import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
  const doku = oku('js/piksel-perde-doku.js');                             // ana sayfa panelinin perdesi hâlâ bunu kullanır
  assert.match(doku, /export const rastgele = \(tohum\)/);
  assert.match(doku, /SATIRLAR = \['SAMET DUHAN', 'ŞAHİN'\]/);
  assert.match(oku('js/piksel-ana-konsol.js'), /dokuCiz\(dk\.getContext\('2d'\)/);
  const k = oku('js/piksel-karakter.js');
  assert.match(k, /const \{ x = 0, y = 0, u = 4, kol = 0, temizle = true \} = o/);
  assert.match(k, /if \(temizle\) ctx\.clearRect/);
});
