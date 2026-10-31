import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROJELER, projeVitrinHTML, sayacHTML, SAYACLAR } from '../js/projeler.js';
import { sayfala, SAYFA_BOYU } from '../js/sayfala.js';
import { DESTELER, desteAra } from '../js/desteler.js';
import { ilerlemeKaydet, ilerlemeOku, ilerlemeSifirla } from '../js/ilerleme.js';
import { mailtoLinki } from '../js/iletisim.js';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');

test('projeVitrinHTML metni kaçışlar, GitHub linkini ve bilgi maddelerini verir', () => {
  const html = projeVitrinHTML({ ad: '<x>', komut: './x', ozet: 'a & b', gorsel: 'img/a.png', alt: 'a', github: 'https://github.com/SametDuhan/x', etiketler: ['AI aracı'], bilgiler: ['bir', 'iki'], medya: 'claude', pigment: 'civit' });
  assert.ok(html.includes('&lt;x&gt;'));
  assert.ok(html.includes('a &amp; b'));
  assert.ok(html.includes('href="https://github.com/SametDuhan/x"'));
  assert.equal((html.match(/<li>/g) || []).length, 2);
  assert.ok(html.includes('data-ad="&lt;x&gt;"'), 'vitrin adıyla eşleşmeli');
});

test('projeVitrinHTML medya türüne göre video ya da canlı piksel tuvali verir', () => {
  const video = projeVitrinHTML(PROJELER[0], '../');
  assert.match(video, /<video class="v-ekran" muted loop playsinline[^>]*poster="\.\.\/img\/skytrack-960\.jpg"/);
  assert.doesNotMatch(video, /\bcontrols\b/);
  assert.match(video, /src="\.\.\/video\/skytrack-demo\.webm"/);
  for (const p of PROJELER.slice(1)) assert.match(projeVitrinHTML(p, '../'), /<canvas class="v-ekran v-piksel"/, p.ad);
});

test('sayaçlar projelerin sayısını ve üç projenin toplamlarını gösterir', () => {
  assert.equal(SAYACLAR[0].say, PROJELER.length);
  const html = sayacHTML();
  for (const sayi of ['211', '192', '2']) assert.ok(html.includes(`data-say="${sayi}"`), sayi);
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
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

test('ilerlemeSifirla bitmiş desteyi de sıfırlar; hatalı depoda sessiz kalır', () => {
  const depo = sahteDepo();
  ilerlemeKaydet(depo, 'x', 8, 9);
  ilerlemeSifirla(depo, 'x');
  assert.equal(ilerlemeOku(depo, 'x'), null);
  assert.doesNotThrow(() => ilerlemeSifirla({ removeItem() { throw new Error('engelli'); } }, 'x'));
  assert.doesNotThrow(() => ilerlemeSifirla(null, 'x'));
});

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

test('alt sayfalarda dört bölümlük sol menü var ve bulunduğu sayfa işaretli', () => {
  for (const [yol, href] of [['hakkimda/index.html', 'hakkimda'], ['projeler/index.html', 'projeler'], ['slaytlar/index.html', 'slaytlar'], ['iletisim/index.html', 'iletisim']]) {
    const s = oku(yol);
    assert.match(s, /<nav class="yan-menu"/, `${yol}: menü yok`);
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
    assert.match(s, /<meta name="twitter:card" content="summary_large_image">/, `${yol}: X önizlemesi yok`);
  }
});

test('site haritası her sayfayı listeler, robots.txt haritayı gösterir', () => {
  const harita = oku('sitemap.xml');
  for (const yol of ['', 'hakkimda/', 'projeler/', 'slaytlar/', 'iletisim/', ...DESTELER.map((d) => `slaytlar/${d.slug}/`)]) {
    assert.ok(harita.includes(`<loc>https://sametduhan.github.io/${yol}</loc>`), `haritada yok: /${yol}`);
  }
  assert.match(oku('robots.txt'), /Sitemap: https:\/\/sametduhan\.github\.io\/sitemap\.xml/);
});

test('hakkımda sayfası işverenin aradığı linkleri en üstte verir', () => {
  const s = oku('hakkimda/index.html');
  const ust = s.slice(0, s.indexOf('id="ne-baslik"'));
  for (const url of ['https://github.com/SametDuhan"', 'https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/', 'href="../iletisim/"']) {
    assert.ok(ust.includes(url), `üstte yok: ${url}`);
  }
});

test('giriş ekranında dört kutu canlı mini sahne taşır; ipucu ve yönlendirme satırı yok', () => {
  const s = oku('index.html');
  assert.equal((s.match(/<svg class="mini"/g) || []).length, 4);
  assert.doesNotMatch(s, /class="yonlendirme"|class="kisayol-ipucu"/);
  // 1–4 tuşları kutuları hâlâ açar
  assert.match(s, /'1234'\.indexOf\(e\.key\)/);
});

test('slaytlar sayfası yeni başlayanı ilk sunuma yönlendirir', () => {
  const s = oku('slaytlar/index.html');
  assert.ok(s.includes('<a href="./ai-ajani-nedir/">AI ajanı nedir?</a> ile başla'));
  assert.ok(!s.includes('onerilen-sira'));
});

test('JS kapalıyken deste içeriği gizlenmez ya da soluk kalmaz', () => {
  const css = oku('css/deste.css');
  for (const kural of ['.adim-kod .satir {', '.soru .aciklama {']) {
    const i = css.indexOf(kural.replace(' {', ''));
    assert.ok(i >= 0, kural);
    const satir = css.slice(css.lastIndexOf('\n', i) + 1, css.indexOf('\n', i));
    assert.ok(satir.startsWith('.js-hazir '), `JS'e bağlı olmalı: ${satir}`);
  }
  assert.match(oku('js/deste.js'), /classList\.add\('js-hazir'\)/);
});

test('iletişim konu bağlantıları JS kapalıyken doğrudan iletişim bölümüne gider', () => {
  const s = oku('iletisim/index.html');
  assert.equal((s.match(/data-konu="[^"]+" href="#dogrudan-baslik"/g) || []).length, 5, 'Staj, İş teklifi, Ortak proje, Soru, Diğer');
});

test('alt sayfalar üreticiyle güncel (elle düzenleme yok; değişiklik araclar/sayfa_yap.mjs içinde)', async () => {
  const { execFileSync } = await import('node:child_process');
  const cikti = execFileSync(process.execPath, [new URL('../araclar/sayfa_yap.mjs', import.meta.url).pathname, '--kontrol'], { encoding: 'utf8' });
  assert.match(cikti, /güncel/);
});

test('her proje kartının doğrudan linklenebilir bir kimliği var', () => {
  const s = oku('projeler/index.html');
  for (const id of ['skytrack', 'claude-done-pixel', 'chatgpt-done-pixel']) assert.ok(s.includes(`id="${id}"`), id);
  assert.ok(oku('hakkimda/index.html').includes('href="../projeler/#skytrack"'));
});

test('destelerin son slaytı projelere ve iletişime doğrudan gider', () => {
  for (const d of DESTELER) {
    const s = oku(`slaytlar/${d.slug}/index.html`);
    const son = s.slice(s.lastIndexOf('<section class="slayt'));
    assert.ok(son.includes('href="../../projeler/"') && son.includes('href="../../iletisim/"'), d.slug);
  }
});

test('yazdırma görünümü menüleri gizler, beyaz zemine siyah yazı basar', () => {
  const css = oku('css/site.css');
  const i = css.indexOf('@media print');
  assert.ok(i >= 0, '@media print yok');
  const blok = css.slice(i);
  assert.match(blok, /\.yan-menu/);
  assert.match(blok, /background: #fff/);
});

test('proje vitrini kendi pigmentini taşır', () => {
  assert.match(projeVitrinHTML(PROJELER[0]), /<article class="vitrin belir p-kehribar"/);
  assert.deepEqual(PROJELER.map((p) => p.pigment), ['kehribar', 'civit', 'bakir']);
});

test('listeler sayfa başına 5; fazlası sonraki sayfaya geçer, sayfa aralığa sıkıştırılır', () => {
  assert.equal(SAYFA_BOYU, 5);
  const liste = Array.from({ length: 7 }, (_, i) => i);
  assert.deepEqual(sayfala(liste, 1), { ogeler: [0, 1, 2, 3, 4], sayfa: 1, adet: 2 });
  assert.deepEqual(sayfala(liste, 2), { ogeler: [5, 6], sayfa: 2, adet: 2 });
  assert.deepEqual(sayfala(liste, 9).sayfa, 2);
  assert.deepEqual(sayfala(liste, 0).sayfa, 1);
  assert.deepEqual(sayfala(liste, 'x').sayfa, 1);
  assert.deepEqual(sayfala([1, 2, 3], 1), { ogeler: [1, 2, 3], sayfa: 1, adet: 1 });
  assert.deepEqual(sayfala([], 1), { ogeler: [], sayfa: 1, adet: 1 });
});

test('projeler, slaytlar ve iletişim genel sütun sayfalamasını kullanmaz; listeler kendi sayfalamasıyla', () => {
  for (const yol of ['projeler/index.html', 'slaytlar/index.html', 'iletisim/index.html']) {
    assert.match(oku(yol), /<main id="icerik" data-sayfalama="kendi">/, yol);
  }
  assert.doesNotMatch(oku('slaytlar/index.html'), /class="filtre"|id="ara"|liste-sayfalar|deste-sayac/, 'slaytlar: arama, konu düğmeleri ve sayfalama yok');
  assert.doesNotMatch(oku('projeler/index.html'), /liste-sayfalar|class="filtre"/, 'projeler tek akış, filtre ve sayfalama yok');
  assert.match(oku('js/ekrana-sigdir.js'), /dataset\.sayfalama === 'kendi'/);
});

test('hakkımda ikiye bölünmez: tek sayfada kaydırılır', () => {
  assert.match(oku('hakkimda/index.html'), /<main id="icerik" data-sayfalama="kaydir">/);
  assert.match(oku('js/ekrana-sigdir.js'), /dataset\.sayfalama === 'kaydir'/);
});

test('SkyTrack vitrininde ana düğme web demosu; proje sitesi ikincil bağlantıda; siteyi olmayan projede yok', () => {
  const sky = projeVitrinHTML(PROJELER[0], '../');
  assert.match(sky, /<a class="dugme ana" href="https:\/\/sametduhan\.github\.io\/airock\/app\/">▶ web demoyu dene<\/a>/);
  assert.ok(sky.indexOf('web demoyu dene') < sky.indexOf('projeyi keşfet') && sky.indexOf('projeyi keşfet') < sky.indexOf('GitHub ↗'));
  assert.ok(sky.indexOf('GitHub ↗') < sky.indexOf('SkyTrack sitesi'), 'site ikincil bağlantılarda');
  for (const p of PROJELER.slice(1)) assert.match(projeVitrinHTML(p, '../'), /class="dugme ana"[^>]*>projeyi keşfet/, p.ad);
  assert.ok(sky.includes('href="https://sametduhan.github.io/airock/"'));
  for (const p of PROJELER.slice(1)) assert.doesNotMatch(projeVitrinHTML(p, '../'), /sitesi ↗/, p.ad);
});
