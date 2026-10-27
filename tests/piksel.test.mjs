import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kareDurumu, SURE } from '../slaytlar/claude-code-hook/piksel.js';

// x: 0 = sahne ortası, 1 = sağ kenarın dışı. y: 0 = yer, pozitif = havada.

test('animasyon sağ kenarın dışından başlar ve ~6,5 sn sürer', () => {
  assert.equal(SURE, 6500);
  assert.ok(kareDurumu(0).x >= 1);
  assert.equal(kareDurumu(0).bitti, false);
});

test('iki kez zıplar: zıplama aralığında havada, aralarda yerde', () => {
  assert.ok(kareDurumu(1800).y > 0, 'ilk zıplama');
  assert.equal(kareDurumu(2100).y, 0, 'iki zıplama arası yer');
  assert.ok(kareDurumu(2400).y > 0, 'ikinci zıplama');
});

test('bayrak yalnız sallama aralığında açık ve iki kez sallanır', () => {
  assert.equal(kareDurumu(2000).bayrak, false);
  assert.equal(kareDurumu(3000).bayrak, true);
  const fazlar = new Set([2800, 3300, 3800, 4300].map((t) => kareDurumu(t).faz));
  assert.equal(fazlar.size, 2);
});

test('sonunda sağdan çıkar ve biter', () => {
  assert.ok(kareDurumu(6400).x > 0.8);
  assert.equal(kareDurumu(6500).bitti, true);
});
