import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { cevir, uret, kaynakSayfalar } from '../araclar/ingilizce.mjs';
import { dilSecici, dilEtiketleri } from '../araclar/dil-baglanti.mjs';
import { t, EN } from '../js/dil.js';
import { DESTELER } from '../js/desteler.js';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');

test('her Türkçe sayfanın İngilizce karşılığı var ve güncel; çevrilmemiş metin yok', () => {
  const { eksik, farkli } = uret({ kontrol: true });
  assert.deepEqual([...eksik.keys()], [], 'araclar/en-sozluk.txt eksik');
  assert.deepEqual(farkli, [], 'node araclar/ingilizce.mjs ile yeniden üret');
  for (const yol of kaynakSayfalar()) assert.ok(existsSync(new URL(`../en/${yol}`, import.meta.url)), `en/${yol} yok`);
});

test('İngilizce sayfada Türkçe kalmaz: başlık, menü ve içerik İngilizce', () => {
  const html = oku('en/hakkimda/index.html');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>About · Samet Duhan<\/title>/);
  assert.match(html, /<span class="m-ad"><i>01<\/i>About<\/span>/);
  assert.doesNotMatch(html, /<h1>Hakkımda<\/h1>|İçeriğe geç/);
  assert.match(oku('en/projeler/index.html'), /<h1>Projects<\/h1>/);
});

test('varlık yolları bir seviye derinleşir; sayfalar arası bağlantılar en/ içinde kalır', () => {
  const tr = '<link rel="stylesheet" href="../css/site.css"><a href="../projeler/">Projeler</a><img src="../../img/a.webp" alt=""><script type="module">import { b } from \'../js/b.js\';</script>';
  const en = cevir(tr, 'hakkimda/index.html', new Map());
  assert.match(en, /href="\.\.\/\.\.\/css\/site\.css"/);
  assert.match(en, /href="\.\.\/projeler\/"/, 'sayfa bağlantısı değişmez (en/ içinde kalır)');
  assert.match(en, /src="\.\.\/\.\.\/\.\.\/img\/a\.webp"/);
  assert.match(en, /from '\.\.\/\.\.\/js\/b\.js'/);
});

test('dil seçici: Türkçe sayfada TR geçerli, EN karşılığına; İngilizce sayfada tersi', () => {
  const tr = dilSecici('slaytlar/ai-ajani-nedir/', 'tr');
  assert.match(tr, /<a href="\.\/" lang="tr" hreflang="tr" aria-current="true">TR<\/a><a href="\.\.\/\.\.\/en\/slaytlar\/ai-ajani-nedir\/" lang="en" hreflang="en">EN<\/a>/);
  const en = dilSecici('slaytlar/ai-ajani-nedir/', 'en');
  assert.match(en, /<a href="\.\.\/\.\.\/\.\.\/slaytlar\/ai-ajani-nedir\/" lang="tr" hreflang="tr">TR<\/a><a href="\.\/" lang="en" hreflang="en" aria-current="true">EN<\/a>/);
  assert.match(dilSecici('', 'tr'), /href="en\/"/);
  assert.match(dilSecici('', 'en'), /href="\.\.\/" lang="tr"/);
  assert.match(dilEtiketleri('hakkimda/'), /hreflang="en" href="https:\/\/sametduhan\.github\.io\/en\/hakkimda\/"/);
});

test('Türkçe ve İngilizce sayfalar birbirine hreflang ile bağlı; og:url İngilizce adreste', () => {
  assert.match(oku('hakkimda/index.html'), /hreflang="en" href="https:\/\/sametduhan\.github\.io\/en\/hakkimda\/"/);
  assert.match(oku('en/hakkimda/index.html'), /<meta property="og:url" content="https:\/\/sametduhan\.github\.io\/en\/hakkimda\/">/);
  assert.match(oku('index.html'), /hreflang="en" href="https:\/\/sametduhan\.github\.io\/en\/"/);
  assert.match(oku('en/index.html'), /og:url" content="https:\/\/sametduhan\.github\.io\/en\/"/);
});

test('sitemap iki dili de listeler', () => {
  const x = oku('sitemap.xml');
  for (const yol of ['', 'hakkimda/', 'projeler/', 'slaytlar/', 'iletisim/', 'slaytlar/ai-ajani-nedir/', 'projeler/skytrack/']) {
    assert.ok(x.includes(`<loc>https://sametduhan.github.io/${yol}</loc>`), `tr ${yol}`);
    assert.ok(x.includes(`<loc>https://sametduhan.github.io/en/${yol}</loc>`), `en ${yol}`);
  }
});

test('betik metinleri: t() Node\'da Türkçe seçer; sunum kartlarının İngilizce metni tam', () => {
  assert.equal(EN, false);
  assert.equal(t('merhaba', 'hello'), 'merhaba');
  for (const d of DESTELER) for (const alan of ['baslik', 'etiket', 'aciklama']) assert.ok(d.en?.[alan], `${d.slug}.en.${alan} yok`);
});

test('dış bağlantılar (GitHub, LinkedIn, proje siteleri) yeni sekmede açılır; mailto ve sayfa içi bağlantılar değişmez', async () => {
  const { disBaglantilar, eksikDisBaglantilar } = await import('../araclar/dis-baglanti.mjs');
  const ham = '<a href="https://github.com/x">g</a> <a href="mailto:a@b.c">m</a> <a href="../projeler/">p</a> <a href="https://x.y" target="_self">k</a>';
  const son = disBaglantilar(ham);
  assert.match(son, /<a href="https:\/\/github\.com\/x" target="_blank" rel="noopener noreferrer">/);
  assert.match(son, /<a href="mailto:a@b\.c">/);
  assert.match(son, /<a href="\.\.\/projeler\/">/);
  assert.match(son, /target="_self"/, 'elle verilen hedef korunur');
  const { readdirSync, statSync } = await import('node:fs');
  const gez = (d) => readdirSync(new URL(`../${d}`, import.meta.url), { withFileTypes: true }).flatMap((g) => (g.isDirectory() ? (['tests', 'araclar', 'js', 'css', 'img', 'video', 'docs', 'node_modules'].includes(g.name) ? [] : gez(`${d}${g.name}/`)) : (g.name.endsWith('.html') ? [`${d}${g.name}`] : [])));
  const eksik = gez('').flatMap((f) => eksikDisBaglantilar(oku(f)).filter((u) => !/^https?:\/\/(sametduhan\.github\.io\/(en\/)?$)/.test(u)).map((u) => `${f} → ${u}`));
  assert.deepEqual(eksik, [], 'bu dış bağlantılar target="_blank" almamış');
});
