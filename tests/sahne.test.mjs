import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SENARYOLAR, turSuresi, sonrakiSenaryo, yazilanSatirlar, rotalar } from '../js/sahne.js';
import { pikselKarakter } from '../js/piksel.js';

test('altı senaryo var, hepsi "✓ Claude bitti" ile biter', () => {
  assert.equal(SENARYOLAR.length, 6);
  for (const s of SENARYOLAR) {
    assert.ok(Array.isArray(s) && s.length > 3);
    assert.equal(s.at(-1), '✓ Claude bitti');
  }
});

test('tur süresi 4–10 sn arasında', () => {
  assert.equal(turSuresi(0), 4000);
  assert.equal(turSuresi(0.5), 7000);
  assert.ok(turSuresi(0.999) < 10000);
});

test('aynı senaryo arka arkaya gelmez', () => {
  for (let onceki = 0; onceki < 6; onceki++) {
    for (let r = 0; r < 1; r += 0.05) {
      const s = sonrakiSenaryo(onceki, r, 6);
      assert.ok(s !== onceki && s >= 0 && s < 6, `onceki=${onceki} r=${r} → ${s}`);
    }
  }
});

test('yazilanSatirlar karakter sayısına göre satırları keser (satır sonu da sayılır)', () => {
  assert.deepEqual(yazilanSatirlar(['ab', 'cd'], 0), []);
  assert.deepEqual(yazilanSatirlar(['ab', 'cd'], 2), ['ab']);
  assert.deepEqual(yazilanSatirlar(['ab', 'cd'], 4), ['ab', 'c']);
  assert.deepEqual(yazilanSatirlar(['ab', 'cd'], 99), ['ab', 'cd']);
});

test('rotalar: kablo soketten başlar; üst kareler dış kenardan, alt kareler alttan girilir', () => {
  const r = rotalar({ soket: { x: 100, y: 300 }, kareler: { x: 400, y: 100, w: 420, h: 220 }, bosluk: 20, zemin: 500 });
  assert.ok(r.kablo.startsWith('M103 300'));
  const satH = (220 - 20) / 2, sutW = (420 - 20) / 2;
  assert.deepEqual(r.uclar[0], { x: 400, y: 100 + satH / 2 });
  assert.deepEqual(r.uclar[1], { x: 820, y: 100 + satH / 2 });
  assert.deepEqual(r.uclar[2], { x: 400 + sutW / 2, y: 320 });
  assert.deepEqual(r.uclar[3], { x: 820 - sutW / 2, y: 320 });
  assert.equal(r.hatlar.length, 4);
  assert.equal(r.bar.y, 336);
});

test('piksel karakter çizimi dışa açık', () => {
  assert.equal(typeof pikselKarakter, 'function');
});

test('giriş sayfasında monitör, ekran, kablo ve dört kare var', () => {
  const s = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(s, /class="crt"/);
  assert.match(s, /<canvas id="ekran"/);
  assert.match(s, /<svg class="kablo"/);
  assert.equal((s.match(/<a class="kare"/g) || []).length, 4);
  assert.doesNotMatch(s, /kare-efekt/);
});
