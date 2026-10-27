import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROJELER, projeleriSuz, projeKartiHTML } from '../js/projeler.js';
import { DESTELER, desteAra } from '../js/desteler.js';
import { ilerlemeKaydet, ilerlemeOku } from '../js/ilerleme.js';
import { mailtoLinki } from '../js/iletisim.js';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');

test('projeleriSuz etikete göre süzer, "hepsi" tümünü verir', () => {
  assert.equal(projeleriSuz(PROJELER, 'hepsi').length, PROJELER.length);
  const ai = projeleriSuz(PROJELER, 'AI aracı');
  assert.ok(ai.length > 0 && ai.every((p) => p.etiketler.includes('AI aracı')));
  assert.deepEqual(projeleriSuz(PROJELER, 'yok-boyle-etiket'), []);
});

test('projeKartiHTML metni kaçışlar, GitHub linkini ve bilgi maddelerini verir', () => {
  const html = projeKartiHTML({ ad: '<x>', komut: './x', ozet: 'a & b', gorsel: 'img/a.png', alt: 'a', github: 'https://github.com/SametDuhan/x', etiketler: ['AI aracı'], bilgiler: ['bir', 'iki'] });
  assert.ok(html.includes('&lt;x&gt;'));
  assert.ok(html.includes('a &amp; b'));
  assert.ok(html.includes('href="https://github.com/SametDuhan/x"'));
  assert.equal((html.match(/<li>/g) || []).length, 2);
});

test('desteAra başlık, açıklama ve etikette büyük/küçük harf ve Türkçe karakter duyarsız arar', () => {
  assert.deepEqual(desteAra(DESTELER, 'HOOK', 'hepsi').map((d) => d.slug), ['claude-code-hook']);
  assert.deepEqual(desteAra(DESTELER, 'ajanı', 'hepsi').map((d) => d.slug), ['ai-ajani-nedir']);
  assert.deepEqual(desteAra(DESTELER, 'İLETİŞİM', 'hepsi'), []);
  assert.equal(desteAra(DESTELER, '', 'hepsi').length, DESTELER.length);
  assert.deepEqual(desteAra(DESTELER, '', 'Proje').map((d) => d.slug), ['skytrack-nasil-kurdum']);
});

test('her destenin tahmini süresi var', () => {
  for (const d of DESTELER) assert.ok(Number.isInteger(d.dakika) && d.dakika > 0, d.slug);
});

function sahteDepo() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
}

test('ilerleme kaydedilir ve okunur; son slaytta bitti sayılır', () => {
  const depo = sahteDepo();
  assert.equal(ilerlemeOku(depo, 'x'), null);
  ilerlemeKaydet(depo, 'x', 3, 9);
  assert.deepEqual(ilerlemeOku(depo, 'x'), { konum: 3, n: 9, bitti: false });
  ilerlemeKaydet(depo, 'x', 8, 9);
  assert.equal(ilerlemeOku(depo, 'x').bitti, true);
});

test('ilerleme: depo yoksa ya da hata verirse sessizce null döner', () => {
  const bozuk = { getItem() { throw new Error('engelli'); }, setItem() { throw new Error('engelli'); } };
  assert.doesNotThrow(() => ilerlemeKaydet(bozuk, 'x', 1, 9));
  assert.equal(ilerlemeOku(bozuk, 'x'), null);
  assert.equal(ilerlemeOku(null, 'x'), null);
  const cop = sahteDepo();
  cop.setItem('deste:x', '{bozuk');
  assert.equal(ilerlemeOku(cop, 'x'), null);
});

test('mailtoLinki konuyu kodlar', () => {
  assert.equal(mailtoLinki('a@b.com', 'İş teklifi & soru'), 'mailto:a@b.com?subject=%C4%B0%C5%9F%20teklifi%20%26%20soru');
  assert.equal(mailtoLinki('a@b.com'), 'mailto:a@b.com');
});

test('alt sayfalarda dört bölümlük üst menü var ve bulunduğu sayfa işaretli', () => {
  for (const [yol, href] of [['hakkimda/index.html', 'hakkimda'], ['projeler/index.html', 'projeler'], ['slaytlar/index.html', 'slaytlar'], ['iletisim/index.html', 'iletisim']]) {
    const s = oku(yol);
    assert.match(s, /<nav class="ust-menu"/, `${yol}: menü yok`);
    for (const h of ['hakkimda', 'projeler', 'slaytlar', 'iletisim']) assert.ok(s.includes(`href="../${h}/"`), `${yol}: ${h} linki yok`);
    assert.match(s, new RegExp(`href="../${href}/" aria-current="page"`), `${yol}: kendi sayfası işaretli değil`);
  }
});

test('her sayfada açıklama ve paylaşım önizlemesi etiketleri var', () => {
  for (const yol of ['index.html', 'hakkimda/index.html', 'projeler/index.html', 'slaytlar/index.html', 'iletisim/index.html', '404.html']) {
    const s = oku(yol);
    assert.match(s, /<meta name="description"/, `${yol}: description yok`);
    assert.match(s, /<meta property="og:title"/, `${yol}: og:title yok`);
    assert.match(s, /<link rel="icon"/, `${yol}: ikon yok`);
  }
});
