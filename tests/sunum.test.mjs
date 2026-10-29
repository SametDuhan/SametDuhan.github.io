import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DESTELER, kartHTML } from '../js/desteler.js';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');
const DESTE_SAYFALARI = DESTELER.map((d) => `slaytlar/${d.slug}/index.html`);

test('her deste ortak görsel katmanı yükler', () => {
  for (const yol of DESTE_SAYFALARI) {
    const s = oku(yol);
    assert.match(s, /css\/deste-gorsel\.css/, yol);
    assert.match(s, /js\/deste-gorsel\.js/, yol);
  }
});

test('video kendiliğinden, sessiz ve döngüde oynar; kontrol çubuğu yok', () => {
  for (const yol of DESTE_SAYFALARI) {
    for (const [etiket] of oku(yol).matchAll(/<video[^>]*>/g)) {
      assert.doesNotMatch(etiket, /\bcontrols\b/, `${yol}: video kontrol çubuğu`);
      assert.match(etiket, /\bmuted\b/, yol);
      assert.match(etiket, /\bloop\b/, yol);
    }
  }
  assert.match(oku('js/atolye.js'), /video\.play\(\)/);
});

test('alarm deneyinde kaydırıcı yok; süre kendiliğinden akar', () => {
  const s = oku('slaytlar/skytrack-nasil-kurdum/index.html');
  assert.doesNotMatch(s, /type="range"/);
  assert.match(s, /alarm-iz/);
});

test('slayt içi sayfalama yok: sığmayan slayt kaydırılır', () => {
  const js = oku('js/deste.js');
  assert.doesNotMatch(js, /ekranaSigdir/);
  assert.match(oku('css/ekran.css'), /\.deste\.js-hazir > \.slayt \{[^}]*overflow-y:auto/);
});

test('animasyonla gizlenen içerik yazdırmada ve hareketi azaltınca görünür', () => {
  const css = oku('css/deste-gorsel.css');
  assert.match(css, /@media print \{[\s\S]*\.dene code \.tl[\s\S]*opacity: 1 !important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  for (const yol of ['css/skytrack-gorsel.css', 'css/ajan-gorsel.css', 'css/hook-gorsel.css']) {
    assert.match(oku(yol), /@media \(prefers-reduced-motion: reduce\)/, yol);
  }
});

test('her destenin liste kartında canlı küçük görsel var', () => {
  for (const d of DESTELER) {
    assert.ok(d.gorsel, `${d.slug}: gorsel yok`);
    assert.match(kartHTML(d), /class="mini-gorsel"/, d.slug);
  }
});

test('slayttaki animasyonlar slayt açılınca başlar, kapanınca durur', () => {
  const js = oku('js/atolye.js');
  assert.match(js, /export function slaytaBagla/);
  assert.match(js, /addEventListener\('goster'/);
  assert.match(js, /addEventListener\('gizle'/);
});

test('projeler sayfası vitrin stilini ve betiğini yükler; hareketi azaltınca vitrinler görünür kalır', () => {
  const s = oku('projeler/index.html');
  assert.match(s, /css\/vitrin\.css/);
  assert.match(s, /js\/vitrin\.js/);
  const css = oku('css/vitrin.css');
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[^]*opacity: 1/);
  assert.match(oku('js/vitrin.js'), /prefers-reduced-motion/);
});

test('hakkımda: ne arıyorsun yolları, canlı kartlar, ilkeler ve araçlar; tüm animasyonlar hareketi azaltınca durur', () => {
  const s = oku('hakkimda/index.html');
  for (const h of ['../projeler/"', '../slaytlar/ai-ajani-nedir/"', '../iletisim/"']) assert.ok(s.includes(`class="yol belir`) && s.includes(`href="${h}`), h);
  assert.equal((s.match(/class="ilke belir"/g) || []).length, 3);
  assert.equal((s.match(/<li style="--i:\d+">/g) || []).length, 12);
  assert.match(s, /data-medya="video"/);
  assert.match(s, /data-medya="claude"/);
  assert.match(s, /css\/hakkimda\.css/);
  assert.match(oku('css/hakkimda.css'), /@media \(prefers-reduced-motion: reduce\)[^]*animation: none !important/);
});

test('ana sayfa terminali dil değiştirerek döner ve komutu yazıp çıktısını verir', async () => {
  const { SATIRLAR, gorunen, sure, KOMUT_MS } = await import('../js/terminal.js');
  assert.deepEqual(SATIRLAR.map((s) => s.dil), ['tr', 'en', 'tr', 'en']);
  const s = SATIRLAR[0];
  assert.deepEqual(gorunen(s, 0), { komut: '', cikti: '' });
  assert.equal(gorunen(s, 3 * KOMUT_MS).komut, s.komut.slice(0, 3));
  assert.equal(gorunen(s, 3 * KOMUT_MS).cikti, '');
  assert.equal(gorunen(s, sure(s)).komut, s.komut);
  assert.equal(gorunen(s, sure(s)).cikti, s.cikti);
  assert.match(oku('index.html'), /class="alt terminal"/);
});

test('projeler ve hakkımda sayfalarının altında şahin videosu (sessiz, döngü, kontrolsüz) oynar', () => {
  for (const yol of ['projeler/index.html', 'hakkimda/index.html']) {
    const s = oku(yol);
    const kapanis = s.slice(s.indexOf('class="vitrin-son'));
    assert.match(kapanis, /<video class="v-kapanis" muted loop playsinline/, yol);
    assert.doesNotMatch(kapanis, /\bcontrols\b|kanat-kucuk/, yol);
    assert.match(kapanis, /video\/sahin\.mp4/, yol);
  }
});

test('proje detay sayfaları: kahraman, sayaçlar, özellikler, görsel, akış ve hikâye; boş açılış yok', () => {
  for (const slug of ['skytrack', 'claude-done-pixel', 'chatgpt-done-pixel']) {
    const s = oku(`projeler/${slug}/index.html`);
    assert.match(s, /<main id="icerik" data-sayfalama="kaydir">/, slug);
    assert.match(s, /class="p-kahraman belir/, slug);
    assert.match(s, /class="sayaclar belir"/, slug);
    assert.ok((s.match(/<li style="--i:\d">\s*<svg/g) || []).length >= 4, `${slug}: özellik kartları`);
    assert.equal((s.match(/class="p-nota belir/g) || []).length, 4, slug);
    assert.match(s, /<ol class="akis-yol"/, slug);
    assert.match(s, /data-pinler|data-hucre/, `${slug}: vurgulu görsel`);
    assert.match(s, /css\/proje\.css/, slug);
    assert.match(s, /js\/proje\.js/, slug);
    assert.doesNotMatch(s, /liste-sayfalar|ekran-gezinme/, slug);
  }
  assert.equal((oku('projeler/skytrack/index.html').match(/class="pin"/g) || []).length, 4);
  assert.ok(oku('projeler/skytrack/index.html').includes('href="https://sametduhan.github.io/airock/"'));
});

test('proje sayfası betiği: sıra döngüsü ve hareketi azaltınca durur', async () => {
  const { sonraki } = await import('../js/proje.js');
  assert.equal(sonraki(0, 4), 1);
  assert.equal(sonraki(3, 4), 0);
  assert.match(oku('js/proje.js'), /prefers-reduced-motion/);
  assert.match(oku('css/proje.css'), /@media \(prefers-reduced-motion: reduce\)/);
});

test('sol menü: yalnız ikonlu dört bölüm bağlantısı; hover boyutu değiştirmez, hareketi azaltınca geçiş yok', () => {
  for (const yol of ['hakkimda/index.html', 'projeler/index.html', 'slaytlar/index.html', 'iletisim/index.html', '404.html']) {
    const s = oku(yol);
    assert.equal((s.match(/<a class="p-(kehribar|civit|bakir|kiremit)" href="[^"]*(hakkimda|projeler|slaytlar|iletisim)\/"[^>]*><svg/g) || []).length, 4, yol);
    assert.doesNotMatch(s, /menu-alt|menu-sahin|menu-hizli/, `${yol}: menü alt bölümü kaldırıldı`);
  }
  const css = oku('css/site.css');
  assert.doesNotMatch(css, /\.menu-alt|\.menu-sahin|\.menu-hizli/);
  assert.match(css, /\.menu-linkler a:hover, \.menu-linkler a:focus-visible \{ color:/);
  assert.doesNotMatch(css, /\.menu-linkler a:hover[^}]*(padding|transform|max-height)/, 'hover boyutu değiştirmez');
});

test('sunum kartları: rozet akışta, çizimler kendiliğinden döner, hareketi azaltınca kartHareketi uçağı durdurur', async () => {
  const { kartHTML, DESTELER } = await import('../js/desteler.js');
  const html = kartHTML(DESTELER[0], { konum: 8, n: 9, bitti: true });
  assert.match(html, /<div class="kart-ust"><span class="etiket">[^<]+<\/span><span class="rozet bitti">/);
  const css = oku('css/site.css');
  assert.doesNotMatch(css, /\.deste-karti \.rozet \{[^}]*position: absolute/);
  assert.match(css, /\.deste-karti:hover, \.deste-karti:focus-visible \{ transform: translate/);
  assert.match(css, /^\.mini-iz \{ animation: bant-serit/m, 'çizgi akışı boşta da çalışır');
  assert.doesNotMatch(css, /\.deste-karti:hover \.mini-(iz|dugum|kutu)/, 'animasyon hover koşuluna bağlı değil');
  assert.match(oku('js/desteler.js'), /export function kartHareketi/);
  assert.doesNotMatch(oku('js/desteler.js'), /<animateMotion dur="(4\.5|5)s"/, 'halka ve zincirde SMIL noktası yok');
});

test('projeler: büyük/küçük görünüm düğmesi, küçük görünümde satırda 3 proje, projeler arasında ayırıcı', () => {
  const html = oku('projeler/index.html');
  assert.match(html, /class="gorunum-dugme" data-gorunum="buyuk" aria-pressed="true"/);
  assert.match(html, /class="gorunum-dugme" data-gorunum="kucuk" aria-pressed="false"/);
  const css = oku('css/vitrin.css');
  assert.match(css, /\.vitrinler\[data-gorunum="kucuk"\] \{ grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.vitrin \+ \.vitrin::before/);
  assert.match(css, /\.js-vitrin \.gorunum \{ display: flex; \}/, 'düğme yalnız JS varken görünür');
  assert.match(oku('js/vitrin.js'), /export function gorunumBagla/);
});

test('sol menü: başlıkta Samet Duhan, altındaki yazı yok; sayfalar arasında kesikli çizgi', () => {
  const html = oku('hakkimda/index.html');
  assert.match(html, /<b>SAMET<br>DUHAN<\/b>/);
  assert.doesNotMatch(html, /AÇIKTA KURULUR<\/small>/);
  assert.match(oku('css/site.css'), /\.menu-linkler a \{[^}]*border-top: 1px dashed var\(--kenar\)/);
});
