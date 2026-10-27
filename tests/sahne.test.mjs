import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SENARYOLAR, turSuresi, sonrakiSenaryo, yazilanSatirlar, sonrakiSahne, EKRAN_SAHNELERI } from '../js/sahne.js';
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

test('monitör sahneleri sabit sıraya bağlı değildir ve aynı sahne tekrarlanmaz', () => {
  for (const onceki of EKRAN_SAHNELERI) {
    const secimler = new Set();
    for (let i = 0; i < 100; i++) {
      const s = sonrakiSahne(onceki, i / 100);
      assert.notEqual(s, onceki);
      assert.ok(EKRAN_SAHNELERI.includes(s));
      secimler.add(s);
    }
    assert.equal(secimler.size, EKRAN_SAHNELERI.length - 1);
  }
});

test('piksel karakter çizimi dışa açık', () => {
  assert.equal(typeof pikselKarakter, 'function');
});

test('giriş sayfasında monitör, ekran ve dört kare var; kablo yok', () => {
  const s = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(s, /class="crt"/);
  assert.match(s, /<canvas id="ekran"/);
  assert.doesNotMatch(s, /<svg class="kablo"/);
  assert.doesNotMatch(s, /<canvas class="mini"/);
  assert.equal((s.match(/<a class="kare"/g) || []).length, 4);
  assert.doesNotMatch(s, /kare-efekt/);
});
