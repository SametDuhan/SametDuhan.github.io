import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mailAdresi } from '../js/iletisim.js';

const anaSayfa = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('mailAdresi parçaları birleştirir', () => {
  assert.equal(mailAdresi('16sametduhan16', 'gmail.com'), '16sametduhan16@gmail.com');
});

test('JS kapalıyken mail noscript içinde gizlenmiş biçimde okunur', () => {
  assert.match(anaSayfa, /<noscript>[^]*16sametduhan16 \[at\] gmail \[dot\] com[^]*<\/noscript>/);
});

test('ana sayfa üç projeyi, LinkedIn ve GitHub profilini ve slaytlar girişini içerir', () => {
  for (const url of [
    'https://github.com/SametDuhan/airock',
    'https://sametduhan.github.io/airock/app/',
    'https://github.com/SametDuhan/claude-done-pixel',
    'https://github.com/SametDuhan/chatgpt-done-pixel',
    'https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/',
    'https://github.com/SametDuhan"',
    'href="slaytlar/"',
  ]) assert.ok(anaSayfa.includes(url), `eksik: ${url}`);
});

test('kimlik cümlesi birebir', () => {
  assert.ok(anaSayfa.includes('AI ile sistem kuran geliştirici'));
});
