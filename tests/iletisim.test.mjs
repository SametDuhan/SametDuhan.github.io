import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mailtoLinki, gmailLinki, konuBul, mesajGovdesi, KONULAR } from '../js/iletisim.js';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');

test('mailtoLinki konu ve gövdeyi kodlar, boşsa eklemez', () => {
  assert.equal(mailtoLinki('a@b.com', 'Soru', 'Merhaba\nSamet'), 'mailto:a@b.com?subject=Soru&body=Merhaba%0ASamet');
  assert.equal(mailtoLinki('a@b.com', '', 'x'), 'mailto:a@b.com?body=x');
  assert.equal(mailtoLinki('a@b.com'), 'mailto:a@b.com');
});

test('gmailLinki yeni ileti penceresini açar', () => {
  assert.equal(gmailLinki('a@b.com', 'İş teklifi', 'Selam'), 'https://mail.google.com/mail/?view=cm&fs=1&to=a%40b.com&su=%C4%B0%C5%9F%20teklifi&body=Selam');
});

test('konuBul kod, ad ve #hash ile bulur; bilinmeyen değer ilk konuya düşer', () => {
  assert.equal(konuBul('ortak').ad, 'Ortak proje');
  assert.equal(konuBul('#soru').kod, 'soru');
  assert.equal(konuBul('İş teklifi').kod, 'is');
  assert.equal(konuBul('yok').kod, KONULAR[0].kod);
  assert.equal(konuBul(null).kod, KONULAR[0].kod);
});

test('mesaj gövdesinin sondaki boşlukları kırpılır', () => {
  assert.equal(mesajGovdesi('Selam  \n'), 'Selam');
});

test('her konunun hazır şablonu "Merhaba Samet" ile başlar', () => {
  for (const k of KONULAR) assert.match(k.sablon, /^Merhaba Samet,/, k.kod);
});

test('iletişim sayfasında mail adresi düz metin olarak durmaz', () => {
  const s = oku('iletisim/index.html') + oku('js/iletisim.js');
  assert.ok(!s.includes('16sametduhan16@gmail.com'));
});
