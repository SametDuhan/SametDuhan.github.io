import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { oneriler, benzerlik, mesafe, rotaBasligi, gercekRotalar, YEDEK_ROTALAR } from '../js/piksel-404-oneri.js';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');
const ilk = (yol, rotalar = YEDEK_ROTALAR) => oneriler(yol, rotalar).map((x) => x.rota);

test('404 önerileri: yedek rota listesi sitemap.xml\'deki Türkçe sayfalarla aynı (yeni sayfa eklenince yedek de güncellenmeli)', () => {
  const xml = oku('sitemap.xml');
  const sayfalar = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p) => !p.startsWith('/en/') && p !== '/en');
  assert.deepEqual([...YEDEK_ROTALAR].sort(), [...new Set(sayfalar)].sort());
});

test('404 önerileri: harf hatası, eksik/fazla harf, Türkçe karakter, parça ve içerme eşleşmeleri doğru sayfayı bulur', () => {
  assert.equal(mesafe('kitten', 'sitting'), 3);
  assert.equal(benzerlik('Hakkımda', 'hakkimda'), 1);                       // Türkçe karakter sadeleştirme
  assert.equal(ilk('/hakimda')[0], '/hakkimda/');                           // eksik harf
  assert.equal(ilk('/iletsim/')[0], '/iletisim/');                          // eksik harf
  assert.equal(ilk('/projler')[0], '/projeler/');
  assert.equal(ilk('/proje')[0], '/projeler/');                             // içerme
  assert.equal(ilk('/slayt')[0], '/slaytlar/');
  assert.equal(ilk('/skytrak')[0], '/projeler/skytrack/');                  // alt sayfa, parça eşleşmesi
  assert.ok(!ilk('/skytrak').includes('/slaytlar/'), 'alakasız zayıf eşleşme gösterilmez');
  assert.equal(ilk('/slaytlar/ai-ajani')[0], '/slaytlar/ai-ajani-nedir/');   // her parça karşılanan rota, tek parça eşleşenin önünde
  assert.equal(ilk('/projeler/skytrak')[0], '/projeler/skytrack/');
  assert.equal(ilk('/slaytlar/ai-ajani')[0], '/slaytlar/ai-ajani-nedir/');
  assert.equal(ilk('/İletişim')[0], '/iletisim/');                          // büyük harf ve Türkçe karakter
  assert.equal(ilk('/hakkimda.html')[0], '/hakkimda/');                     // uzantı
  assert.ok(!ilk('/hakimda').includes('/'), 'ana sayfa öneri olarak dönmez');
});

test('404 önerileri: benzer sayfa yoksa boş döner (panel ana bölümleri gösterir); boş yol ve bozuk kodlama kırılmaz', () => {
  assert.deepEqual(ilk('/xyzqwv'), []);
  assert.deepEqual(ilk('/404.html'), []);
  assert.deepEqual(ilk('/'), []);
  assert.doesNotThrow(() => ilk('/%E0%A4%A'));                              // geçersiz yüzde kodlaması
  assert.equal(oneriler('/proje', YEDEK_ROTALAR, 2).length, 2);             // n sınırı
  const puanlar = oneriler('/proje', YEDEK_ROTALAR).map((x) => x.puan);
  assert.deepEqual(puanlar, [...puanlar].sort((a, b) => b - a));            // en iyiden başlar
});

test('404 önerileri: sayfa başlıkları sitedeki gerçek adlardan; sitemap okunamazsa yedek liste', async () => {
  assert.equal(rotaBasligi('/projeler/skytrack/'), 'SkyTrack');
  assert.equal(rotaBasligi('/slaytlar/ai-ajani-nedir/'), 'AI ajanı nedir?');
  assert.equal(rotaBasligi('/hakkimda/'), 'Hakkımda');
  assert.equal(rotaBasligi('/bilinmeyen-sayfa/'), 'bilinmeyen sayfa');
  const xml = oku('sitemap.xml');
  const gercek = await gercekRotalar(async () => ({ ok: true, text: async () => xml }));
  assert.ok(gercek.includes('/projeler/skytrack/') && !gercek.some((r) => r.startsWith('/en')));
  assert.deepEqual(await gercekRotalar(async () => { throw new Error('ağ yok'); }), YEDEK_ROTALAR);
  assert.deepEqual(await gercekRotalar(async () => ({ ok: false, status: 404 })), YEDEK_ROTALAR);
});

test('piksel 404: sayfa üreticiden işaretli; katman yalnız 404\'te; tek karakter; sahte hata satırı gerçek adresle değişir ve geri alınır', () => {
  const h = oku('404.html');
  assert.match(h, /<main id="icerik" data-sayfa="404">/);
  assert.match(h, /href="\/css\/piksel-404\.css"/);
  assert.match(h, /import\('\/js\/piksel-404\.js'\)\.then\(\(m\) => m\.baslat\(\)\)/);
  for (const yol of ['hakkimda/index.html', 'index.html']) assert.doesNotMatch(oku(yol), /piksel-404/, yol);
  const sahne = oku('js/piksel-404-sahne.js');
  assert.equal((sahne.match(/pikselKarakter\(c,/g) ?? []).length, 1, 'sahnede tek karakter');
  assert.match(sahne, /prefers-reduced-motion: reduce/);
  const liste = oku('js/piksel-404-liste.js');
  assert.match(liste, /eski\.textContent = eskiMetin/);                      // geri alma
  assert.match(liste, /location\.pathname/);
  assert.match(oku('js/piksel-404.js'), /dataset\.sayfa !== '404'/);
  assert.doesNotMatch(oku('js/piksel-404-yardim.js') + liste + sahne, /from '\.\/piksel-404\.js'/, 'döngüsel içe aktarma yok');
});
