import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { komutCoz, rotaBul } from '../js/piksel-404-komut.js';
import { YEDEK_ROTALAR as R } from '../js/piksel-404-oneri.js';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('404 mini terminal: cd gerçek rotaya gider (büyük/küçük harf, Türkçe karakter, eğik çizgi fark etmez); olmayana gitmez ve öneri verir', () => {
  assert.equal(rotaBul('projeler', R), '/projeler/');
  assert.equal(rotaBul('/Projeler/', R), '/projeler/');
  assert.equal(rotaBul('İletişim', R), '/iletisim/');
  assert.equal(rotaBul('Projeler/SkyTrack', R), '/projeler/skytrack/');
  assert.equal(rotaBul('', R), '/');
  assert.equal(rotaBul('yok-boyle-sayfa', R), undefined);
  assert.equal(komutCoz('cd projeler', R, '/x').git, '/projeler/');
  assert.equal(komutCoz('open slaytlar/claude-code-hook', R, '/x').git, '/slaytlar/claude-code-hook/');
  for (const g of ['cd', 'cd ..', 'cd ~', 'cd /']) assert.equal(komutCoz(g, R, '/x').git, '/', g);
  const yanlis = komutCoz('cd projler', R, '/x');
  assert.equal(yanlis.git, undefined);                                         // yakın ama tam değil: gitmez, önerir
  assert.match(yanlis.yaz.join('\n'), /Böyle bir dosya ya da dizin yok/);
  assert.match(yanlis.yaz.join('\n'), /\/projeler\//);
  assert.match(komutCoz('cd xyz', R, '/x').yaz.join('\n'), /ls yazarak/);
});

test('404 mini terminal: ls, ls <önek>, pwd, back, clear, help, bilinmeyen komut, boş girdi', () => {
  const ls = komutCoz('ls', R, '/x').yaz;
  assert.equal(ls.length, R.length - 1);                                        // ana sayfa hariç hepsi
  assert.ok(ls.some((l) => /\/projeler\/skytrack\/\s+SkyTrack/.test(l)));
  assert.ok(komutCoz('ls projeler', R, '/x').yaz.every((l) => /\/projeler\//.test(l)));
  assert.match(komutCoz('ls yok', R, '/x').yaz[0], /diye bir dizin yok/);
  assert.deepEqual(komutCoz('pwd', R, '/bu/yanlis').yaz, ['/bu/yanlis']);
  assert.equal(komutCoz('back', R, '/x').geri, true);
  assert.equal(komutCoz('clear', R, '/x').temizle, true);
  assert.match(komutCoz('help', R, '/x').yaz.join('\n'), /cd <sayfa>/);
  assert.match(komutCoz('foo', R, '/x').yaz[0], /komut bulunamadı/);
  assert.deepEqual(komutCoz('   ', R, '/x').yaz, []);
  assert.deepEqual(komutCoz('LS', R, '/x').yaz, komutCoz('ls', R, '/x').yaz);   // büyük harf
});

test('piksel 404 terminal: sayfaya geçici bağlantıya tıklayarak gider (perde çalışsın), "/" odaklar, görünüm değişince kaldırılır; karakter yok', () => {
  const k = oku('js/piksel-404-konsol.js');
  assert.match(k, /a\.click\(\)/);
  assert.match(k, /e\.key === '\/'/);
  assert.match(k, /return \(\) => \{ iptal = true; removeEventListener\('keydown', tus\); kap\.remove\(\); \}/);
  assert.doesNotMatch(k, /pikselKarakter|location\.href\s*=/);
  assert.match(oku('js/piksel-404.js'), /PARCALAR = \[sahneKur, oneriKur, konsolKur\]/);
});
