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
  assert.match(js, /\['whoami'/);                                          // terminal gerçek bilgileri sırayla yazar
});

test('piksel ana sayfa sağ panel: beş geçiş animasyonu sırayla döner (perde, mozaik, koşucu, eski TV, bantlar); altı görünüm: kimlik, projeler, git log, toplam, slaytlar, araçlar; sekme arka plandayken takılmaz', () => {
  const k = oku('js/piksel-ana-konsol.js');
  assert.match(k, /const GECISLER = \[perdeGecisi, mozaik, kosucu, tv, bantlar\]/);
  assert.match(k, /GECISLER\[sira\+\+ % GECISLER\.length\]/);
  assert.match(k, /setTimeout\(son, ms \+ 400\)/);                       // rAF durursa geçiş zaman aşımıyla biter
  assert.match(k, /if \(AZ \|\| !perdeli\)/);                            // hareketi azaltınca geçiş yok
  assert.match(oku('css/piksel-ana.css'), /\.gecis-kanvas\{/);
});

test('piksel ana sayfa sağ panel: kimlik, projeler, slaytlar ve araçlar görünümleri gerçek veriden; araçlar kullanıcının söylediği beş araç', () => {
  const ana = oku('js/piksel-ana.js'), k = oku('js/piksel-ana-konsol.js');
  for (const a of ['Claude Code', 'Codex', 'Hermes Agent', 'Abacus AI', 'Herdr']) assert.match(ana, new RegExp(`<li>${a}</li>`));
  assert.match(ana, /Atatürk Üniversitesi/);
  assert.equal((ana.match(/<button type="button" data-g="\d"/g) || []).length >= 6, true);
  assert.match(k, /DESTELER\.forEach/);                                   // slaytlar listesi desteler.js'ten
  assert.match(k, /\(gorunum \+ 1\) % slaytlar\.length/);                 // altı görünüm sırayla
  assert.match(k, /\.catch\(\(\) => \{ sonEl\.remove\(\); \}\)/);           // GitHub'a ulaşılamazsa son commit satırı kalkar
});
