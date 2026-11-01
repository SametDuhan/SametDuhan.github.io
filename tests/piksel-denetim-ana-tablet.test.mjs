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
