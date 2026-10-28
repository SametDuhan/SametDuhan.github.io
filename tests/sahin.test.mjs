import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  POZLAR, ATKI, KANAT_MS, GECIS_MS,
  pozDonusumu, noktalar, kirpmaGecikmesi, ciftKirpar, ilkKanatGerekli, kendiligindenKanat,
} from '../js/sahin.js';

test('ön poz dönüşümsüz, kanat pozu ayak hizasına oturur', () => {
  assert.equal(pozDonusumu(POZLAR.on), '');
  assert.equal(pozDonusumu(POZLAR.kanat), 'translate(629.5 1190) scale(1.2304) translate(-624 -1105)');
});

test('atkı noktaları SVG polygon biçiminde', () => {
  assert.equal(noktalar([[1, 2], [3, 4]]), '1,2 3,4');
  assert.ok(ATKI.on.length > 10 && ATKI.kanat.length > 10);
});

test('kırpma 2,4–6,2 sn arasında; çeyrek ihtimalle çift', () => {
  assert.equal(kirpmaGecikmesi(0), 2400);
  assert.equal(kirpmaGecikmesi(1), 6200);
  assert.equal(ciftKirpar(0.2), true);
  assert.equal(ciftKirpar(0.3), false);
});

test('ilk kanat oturumda bir kez; depo bozuksa yine açar', () => {
  const m = new Map();
  const depo = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  assert.equal(ilkKanatGerekli(depo), true);
  assert.equal(ilkKanatGerekli(depo), false);
  assert.equal(ilkKanatGerekli({ getItem() { throw new Error('kapalı'); } }), true);
  assert.equal(ilkKanatGerekli(null), true);
});

test('hareketi azalt açıkken kendiliğinden kanat yok', () => {
  assert.equal(kendiligindenKanat(true), false);
  assert.equal(kendiligindenKanat(false), true);
});

test('kanat 1,9 sn; geçiş 0,16 sn', () => {
  assert.equal(KANAT_MS, 1900);
  assert.equal(GECIS_MS, 160);
});
