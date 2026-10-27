import { test } from 'node:test';
import assert from 'node:assert/strict';
import { noktaSayisi, baglantilar, izgaraYataylari, cizimModu } from '../js/arkaplan.js';

test('noktaSayisi ekran alanıyla ölçeklenir ve [20, 70] aralığında kalır', () => {
  assert.equal(noktaSayisi(375, 812), 20);
  assert.equal(noktaSayisi(1920, 1080), 70);
  assert.equal(noktaSayisi(1280, 720), 51);
});

test('noktaSayisi kare gibi küçük alanlar için sınır alır', () => {
  assert.equal(noktaSayisi(370, 277, { min: 8, max: 24 }), 8);
  assert.equal(noktaSayisi(2000, 2000, { min: 8, max: 24 }), 24);
});

test('baglantilar yalnız eşikten yakın çiftleri, uzaklıkla sönen alfayla verir', () => {
  const sonuc = baglantilar([{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 500, y: 0 }], 110);
  assert.equal(sonuc.length, 1);
  assert.equal(sonuc[0].a, 0);
  assert.equal(sonuc[0].b, 1);
  assert.ok(Math.abs(sonuc[0].alfa - 0.1909) < 0.001, `alfa ${sonuc[0].alfa}`);
});

test('izgaraYataylari artan sırada, ufuk ile alt kenar arasında', () => {
  const ys = izgaraYataylari(800, 440, 0);
  assert.ok(ys.length > 0);
  for (let i = 0; i < ys.length; i++) {
    assert.ok(ys[i] >= 440 && ys[i] <= 800, `sınır dışı: ${ys[i]}`);
    if (i) assert.ok(ys[i] > ys[i - 1], 'artan değil');
  }
});

test('izgaraYataylari zamanla aşağı akar', () => {
  assert.ok(izgaraYataylari(800, 440, 10)[0] > izgaraYataylari(800, 440, 0)[0]);
});

test('cizimModu hareketi azalt tercihinde tek kare çizer', () => {
  assert.equal(cizimModu(true), 'tek-kare');
  assert.equal(cizimModu(false), 'animasyon');
});
