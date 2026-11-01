import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel sayfa geçişi perdesi: kenar düz çizgi değil rastgele pikselli damla ve dağılmış piksel; ekran genişliğiyle artan çok karakter; yeni sayfada canvas devralır', () => {
  const g = oku('js/piksel-gecis.js');
  // rastgele damlalar ve dağılmış pikseller; sabit tohum (aynı genişlikte aynı kenar)
  assert.match(g, /const rastgele = \(tohum\)/);
  assert.match(g, /derin\.push\(v\)/);                     // sütun başına rastgele damla derinliği
  assert.match(g, /v = Math\.max\(1, Math\.min\(5, v\)\)/); // en az 1 kare: düz çizgi hiç kalmaz
  assert.match(g, /const dagin = \[\]/);                   // dağılmış tek pikseller
  // karakter sayısı genişlikle artar, en az 4
  assert.match(g, /const n = Math\.max\(4, Math\.floor\(W \/ \(35 \* u\)\)\)|n = Math\.max\(4, Math\.floor\(W \/ \(35 \* u\)\)\)/);
  assert.match(g, /for \(const k of karakterler\) asiliKarakter\(c, t \+ k\.faz/);
  // perde canvas'ı; indirme web animasyonuyla, bitince gezinir; yeni sayfada devralma
  assert.match(g, /\.animate\(\[\{ transform: `translateY\(-\$\{p\.toplam\}px\)` \}/);
  assert.match(g, /sessionStorage\.setItem\('pxGecis', '1'\)/);
  assert.match(g, /kok\.removeAttribute\('data-px-gecis'\)/);
  assert.match(g, /if \(AZ\b/);                            // hareketi azaltınca perde yok
  // eski düz çizgili kenar (css kenarlık + düzenli saçak + tek karakter) kalktı
  const css = oku('css/piksel.css');
  assert.doesNotMatch(css, /\.pxg-kar|\.pxg::after|repeating-linear-gradient\(90deg, #f09a78/);
  // betik gelmezse perde sayfada kalmaz (css yedek kalkışı)
  assert.match(css, /html\[data-px-gecis\]::after \{[^}]*animation: px-perde-kalk \.9s[^}]*2\.4s both/);
  // asılı karakter çizimi birden çok karakterle de çalışır (konum, uzun kol, silmeme)
  const k = oku('js/piksel-karakter.js');
  assert.match(k, /const \{ x = 0, y = 0, u = 4, kol = 0, temizle = true \} = o/);
  assert.match(k, /if \(temizle\) ctx\.clearRect/);
});
