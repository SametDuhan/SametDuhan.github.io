import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  POZLAR, ATKI,
  pozDonusumu, noktalar, kirpmaGecikmesi, ciftKirpar,
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

test('ana sayfada kanat videosu ve kanat pozu yok; şahin yalnız nefes alır, göz kırpar', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /<video|sahinVideo|video-sahne|kanat\.webp|data-poz="kanat"/);
  assert.ok(!existsSync(new URL('../video/sahin-sahne.webm', import.meta.url)));
});
