import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mailAdresi } from '../js/iletisim.js';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');

test('giriş ekranı dört kareyle dört sayfaya gider ve kimlik cümlesini taşır', () => {
  const giris = oku('index.html');
  for (const href of ['hakkimda/', 'projeler/', 'slaytlar/', 'iletisim/']) {
    assert.match(giris, new RegExp(`<a class="kare [^"]*" href="${href}"`), `kare yok: ${href}`);
  }
  assert.equal((giris.match(/<a class="kare /g) || []).length, 4);
  assert.ok(giris.includes('AI ile sistem kuran geliştirici'));
});

test('hakkımda sayfası kimlik cümlesini ve tanıtımı içerir', () => {
  const s = oku('hakkimda/index.html');
  assert.ok(s.includes('AI ile sistem kuran geliştirici'));
  assert.ok(s.includes('iş bitiren sistemler'));
});

test('projeler sayfası üç projeyi ve demoyu bağlar', () => {
  const s = oku('projeler/index.html');
  for (const url of [
    'https://github.com/SametDuhan/airock',
    'https://sametduhan.github.io/airock/app/',
    'https://github.com/SametDuhan/claude-done-pixel',
    'https://github.com/SametDuhan/chatgpt-done-pixel',
  ]) assert.ok(s.includes(url), `eksik: ${url}`);
});

test('projeler sayfası README ile çelişmez ve resmî olmadığını söyler', () => {
  const s = oku('projeler/index.html');
  assert.ok(!s.includes('kurulum gerektirmez'), 'claude-done-pixel install.ps1 ile kuruluyor');
  assert.match(s, /Anthropic ve OpenAI ile bağlantısı yok/);
});

test('iletişim sayfası mail, GitHub ve LinkedIn verir; JS kapalıyken mail okunur', () => {
  const s = oku('iletisim/index.html');
  assert.match(s, /<noscript>[^]*16sametduhan16 \[at\] gmail \[dot\] com[^]*<\/noscript>/);
  assert.ok(s.includes('https://github.com/SametDuhan"'));
  assert.ok(s.includes('https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/'));
  assert.match(s, /id="mail"[^>]*hidden/, 'JS yokken ölü mail düğmesi gizli olmalı');
});

test('mailAdresi parçaları birleştirir', () => {
  assert.equal(mailAdresi('16sametduhan16', 'gmail.com'), '16sametduhan16@gmail.com');
});

test('SkyTrack destesi commit\'in söylemediğini söylemez', () => {
  assert.ok(!oku('slaytlar/skytrack-nasil-kurdum/index.html').includes('İlk sürüm: kodu gören her uçak'));
});
