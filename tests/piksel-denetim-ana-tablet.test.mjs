import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel ana sayfa: 1100 pikselden dar ekranda (tablet dahil) tek sütun; CSS ve kanvas aynı eşiği kullanır', () => {
  const css = oku('css/piksel-ana.css'), js = oku('js/piksel-ana-kanvas.js');
  assert.ok((css.match(/@media \(max-width:1100px\)\{/g) ?? []).length >= 4);
  assert.match(css, /margin:56px auto 0;/);                              // tek sütun ortalanır (en çok 860 px)
  assert.match(js, /const dar = W <= 1100/);
  assert.match(js, /if \(W <= 1100\) via\(p\.x, p\.y\)/);
  assert.doesNotMatch(js, /onizleme/);                                    // projelerin üstüne gelince açılan önizleme kaldırıldı
  const ana = readFileSync(join(KOK, 'js/piksel-ana.js'), 'utf8');
  assert.doesNotMatch(ana, /onizleme/);
  assert.match(ana, /<a class="durum" href="\$\{K\}iletisim\/\?konu=staj">/);   // staj durumu iletişimdeki staj konusuna götürür
  assert.match(js, /KOMUT = 'cat hakkimda.txt'/);                          // terminal hakkımda üç satırı yazar ve kalır
});

test('piksel ana sayfa sağ panel: yalnız commit ızgarası (dönen görünüm, geçiş animasyonu ve perde yok); sayılar GitHub sayımından', () => {
  const ana = oku('js/piksel-ana.js'), k = oku('js/piksel-ana-konsol.js'), css = oku('css/piksel-ana.css');
  assert.equal((ana.match(/class="kanit-slayt/g) || []).length, 0);
  assert.doesNotMatch(ana, /kanit-nokta|class="perde"|class="kicker"|class="tanit"|class="ipucu"|k-adim/);
  assert.doesNotMatch(k, /GECISLER|perdeGecisi|degistir\(/);
  assert.doesNotMatch(css, /\.perde|\.gecis-kanvas|\.kanit-nokta|\.kicker|\.tanit/);
  assert.match(ana, /id="k-izgara"/);
  assert.match(k, /SAYILAR\.repolar/);                                   // kare sayısı gerçek commit sayısı
});

test('piksel ana sayfa şahin: tek piksel şahin tüner, bölüm bağlantısına gelince iskeleye uçar, ayrılınca döner; dar ekranda ve hareketi azaltınca uçmaz', () => {
  const s = oku('js/piksel-ana-sahin.js'), kanvas = oku('js/piksel-ana-kanvas.js');
  assert.match(s, /prefers-reduced-motion/);
  assert.match(s, /if \(dar\)/);
  assert.match(kanvas, /gel\(i, sol\(i\), Infinity\)/);                 // bölüm bağlantısı: Claude gelir, şahin yanına
  assert.match(kanvas, /sahin\.iskele\(\{ x: hx/);
  assert.match(kanvas, /pointerleave', cik/);
  assert.match(kanvas, /addEventListener\('blur', cik\)/);              // klavyeyle de çalışır
  assert.match(kanvas, /sahin\.icinde\(e\.clientX/);                    // tıklayınca balon
});
