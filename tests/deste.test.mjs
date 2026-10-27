import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sikistir, hashtenKonum, tusEylemi, kaydirmaYonu, soruSonucu } from '../js/deste.js';

test('sikistir aralığın dışına çıkmaz', () => {
  assert.equal(sikistir(-1, 6), 0);
  assert.equal(sikistir(3, 6), 3);
  assert.equal(sikistir(9, 6), 5);
});

test('hashtenKonum 1 tabanlı hash\'i okur, bozuk ya da aralık dışı değeri sıkıştırır', () => {
  assert.equal(hashtenKonum('#3', 6), 2);
  assert.equal(hashtenKonum('', 6), 0);
  assert.equal(hashtenKonum('#abc', 6), 0);
  assert.equal(hashtenKonum('#0', 6), 0);
  assert.equal(hashtenKonum('#99', 6), 5);
});

test('tusEylemi klavye tuşlarını eyleme çevirir', () => {
  assert.equal(tusEylemi('ArrowRight'), 'ileri');
  assert.equal(tusEylemi('PageDown'), 'ileri');
  assert.equal(tusEylemi(' '), 'ileri');
  assert.equal(tusEylemi('ArrowLeft'), 'geri');
  assert.equal(tusEylemi('PageUp'), 'geri');
  assert.equal(tusEylemi('Home'), 'basa');
  assert.equal(tusEylemi('End'), 'sona');
  assert.equal(tusEylemi('f'), 'tamekran');
  assert.equal(tusEylemi('F'), 'tamekran');
  assert.equal(tusEylemi('?'), 'yardim');
  assert.equal(tusEylemi('Escape'), 'kapat');
  assert.equal(tusEylemi('x'), null);
});

test('kaydirmaYonu yalnız yeterince uzun yatay kaydırmayı sayar', () => {
  assert.equal(kaydirmaYonu(-80, 10), 'ileri');
  assert.equal(kaydirmaYonu(80, 10), 'geri');
  assert.equal(kaydirmaYonu(30, 0), null);
  assert.equal(kaydirmaYonu(-80, 120), null);
});

test('soruSonucu seçilenle doğruyu karşılaştırır', () => {
  assert.equal(soruSonucu('b', 'b'), true);
  assert.equal(soruSonucu('a', 'b'), false);
});
