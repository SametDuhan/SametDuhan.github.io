import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kareDurumu, SURE } from '../slaytlar/claude-code-hook/piksel.js';

// claude-done.ps1 ile birebir: T_RUN 1,5 · 2×T_JUMP 0,55 · 2×T_WAVE 0,7 · T_OUT 1,6 (+0,2) saniye.
// Sahne genişliği W=100, piksel birimi u=1: duruş noktası 0,46·W, başlangıç W+2u.

test('toplam süre orijinal betikteki gibi 5,8 sn', () => {
  assert.equal(SURE, 5800);
});

test('sağ kenarın dışından sola bakarak koşarak girer, 1,5 sn\'de durur', () => {
  const ilk = kareDurumu(0, 100, 1);
  assert.equal(ilk.x, 102);
  assert.equal(ilk.look, -1);
  assert.equal(ilk.run, true);
  assert.equal(kareDurumu(1.5, 100, 1).x, 46);
});

test('iki kez zıplar; havadayken bacaklar toplanır', () => {
  for (const t of [1.5 + 0.275, 1.5 + 0.55 + 0.275]) {
    const d = kareDurumu(t, 100, 1);
    assert.ok(d.yOff < -11, `t=${t} yOff=${d.yOff}`);
    assert.equal(d.air, true);
  }
});

test('bayrağı sallarken kol yukarıda, sap eğiliyor ve sağa bakıyor', () => {
  const d = kareDurumu(2.6 + 0.175, 100, 1);
  assert.equal(d.armUp, true);
  assert.equal(d.look, 1);
  assert.ok(Math.abs(d.tilt) > 3, `tilt=${d.tilt}`);
});

test('sağa doğru hızlanarak çıkar', () => {
  assert.ok(kareDurumu(5.6, 100, 1).x > 100);
  assert.equal(kareDurumu(5.6, 100, 1).look, 1);
});
