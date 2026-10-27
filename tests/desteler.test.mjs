import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { DESTELER, kartHTML } from '../js/desteler.js';

const destaYolu = (slug) => new URL(`../slaytlar/${slug}/index.html`, import.meta.url);

test('slug\'lar benzersiz ve URL güvenli', () => {
  const sluglar = DESTELER.map((d) => d.slug);
  assert.equal(new Set(sluglar).size, sluglar.length);
  for (const s of sluglar) assert.match(s, /^[a-z0-9-]+$/);
});

test('başlangıç desteleri listede', () => {
  assert.deepEqual(
    DESTELER.map((d) => d.slug).sort(),
    ['ai-ajani-nedir', 'claude-code-hook', 'skytrack-nasil-kurdum'],
  );
});

test('her destenin sayfası var', () => {
  for (const d of DESTELER) assert.ok(existsSync(destaYolu(d.slug)), `${d.slug} sayfası yok`);
});

test('slaytSayisi sayfadaki slayt sayısına eşit', () => {
  for (const d of DESTELER) {
    const html = readFileSync(destaYolu(d.slug), 'utf8');
    const sayi = (html.match(/<section class="slayt[" ]/g) || []).length;
    assert.equal(d.slaytSayisi, sayi, `${d.slug}: listede ${d.slaytSayisi}, sayfada ${sayi}`);
  }
});

test('kartHTML metni kaçışlar ve deste linkini verir', () => {
  const html = kartHTML({ slug: 'x', baslik: '<b>', etiket: 'Başlangıç', aciklama: 'a & b', slaytSayisi: 3, ornek: 'SkyTrack' });
  assert.ok(html.includes('&lt;b&gt;'));
  assert.ok(html.includes('a &amp; b'));
  assert.ok(html.includes('href="./x/"'));
  assert.ok(html.includes('3 slayt'));
  assert.ok(html.includes('örnek: SkyTrack'));
});
