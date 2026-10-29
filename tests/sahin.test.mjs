import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  POZLAR, ATKI, VIDEO_ARALIK_MS,
  pozDonusumu, noktalar, kirpmaGecikmesi, ciftKirpar, videoDestekliMi, sahneKutusu,
} from '../js/sahin.js';

test('ön poz dönüşümsüz; kanat pozu kalmadı', () => {
  assert.equal(pozDonusumu(POZLAR.on), '');
  assert.equal(POZLAR.kanat, undefined);
  assert.equal(ATKI.kanat, undefined);
});

test('atkı noktaları SVG polygon biçiminde', () => {
  assert.equal(noktalar([[1, 2], [3, 4]]), '1,2 3,4');
  assert.ok(ATKI.on.length > 10);
});

test('kırpma 2,4–6,2 sn arasında; çeyrek ihtimalle çift', () => {
  assert.equal(kirpmaGecikmesi(0), 2400);
  assert.equal(kirpmaGecikmesi(1), 6200);
  assert.equal(ciftKirpar(0.2), true);
  assert.equal(ciftKirpar(0.3), false);
});

test('kanat videosu 8 sn\'de bir başlar', () => {
  assert.equal(VIDEO_ARALIK_MS, 8000);
});

test('video yalnız alfa destekleyen tarayıcıda oynar; Safari ve desteksiz tarayıcıda oynamaz', () => {
  const chrome = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
  const firefox = 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0';
  const safari = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
  const iosChrome = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0 Mobile/15E148 Safari/604.1';
  assert.equal(videoDestekliMi(chrome, 'probably'), true);
  assert.equal(videoDestekliMi(firefox, 'maybe'), true);
  assert.equal(videoDestekliMi(safari, 'probably'), false);
  assert.equal(videoDestekliMi(chrome, ''), false);
  assert.equal(videoDestekliMi(iosChrome, 'probably'), true);
});

test('ana sayfada video dosyası var ve şahin sahnesine bağlı', () => {
  assert.ok(existsSync(new URL('../video/sahin-sahne.webm', import.meta.url)));
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<video class="sahin-video" id="sahinVideo" muted playsinline[^>]*src="video\/sahin-sahne\.webm"/);
  assert.doesNotMatch(html, /kanat\.webp|data-poz="kanat"/);
});

test('video katmanı sahne kutusuna oturur: kutu sahneden genişse yanlarda, yüksekse altta üstte boşluk kalır', () => {
  const ana = { left: 100, top: 50 };
  // 550×1560 kutu: ölçek yüksekliğe değil genişliğe bağlı (0,5), sahne 550×780 olur ve dikeyde ortalanır
  assert.deepEqual(sahneKutusu({ left: 100, top: 50, width: 550, height: 1560 }, ana), { left: 0, top: 390, width: 550, height: 780 });
  // 2200×1560 kutu: ölçek yüksekliğe bağlı (1), sahne 1100 genişliğinde yatayda ortalanır
  assert.deepEqual(sahneKutusu({ left: 100, top: 50, width: 2200, height: 1560 }, ana), { left: 550, top: 0, width: 1100, height: 1560 });
});
