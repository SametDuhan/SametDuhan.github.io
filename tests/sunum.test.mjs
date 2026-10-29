import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DESTELER, kartHTML } from '../js/desteler.js';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');
const DESTE_SAYFALARI = DESTELER.map((d) => `slaytlar/${d.slug}/index.html`);

test('her deste ortak görsel katmanı yükler', () => {
  for (const yol of DESTE_SAYFALARI) {
    const s = oku(yol);
    assert.match(s, /css\/deste-gorsel\.css/, yol);
    assert.match(s, /js\/deste-gorsel\.js/, yol);
  }
});

test('video kendiliğinden, sessiz ve döngüde oynar; kontrol çubuğu yok', () => {
  for (const yol of DESTE_SAYFALARI) {
    for (const [etiket] of oku(yol).matchAll(/<video[^>]*>/g)) {
      assert.doesNotMatch(etiket, /\bcontrols\b/, `${yol}: video kontrol çubuğu`);
      assert.match(etiket, /\bmuted\b/, yol);
      assert.match(etiket, /\bloop\b/, yol);
    }
  }
  assert.match(oku('js/atolye.js'), /video\.play\(\)/);
});

test('alarm deneyinde kaydırıcı yok; süre kendiliğinden akar', () => {
  const s = oku('slaytlar/skytrack-nasil-kurdum/index.html');
  assert.doesNotMatch(s, /type="range"/);
  assert.match(s, /alarm-iz/);
});

test('slayt içi sayfalama yok: sığmayan slayt kaydırılır', () => {
  const js = oku('js/deste.js');
  assert.doesNotMatch(js, /ekranaSigdir/);
  assert.match(oku('css/ekran.css'), /\.deste\.js-hazir > \.slayt \{[^}]*overflow-y:auto/);
});

test('animasyonla gizlenen içerik yazdırmada ve hareketi azaltınca görünür', () => {
  const css = oku('css/deste-gorsel.css');
  assert.match(css, /@media print \{[\s\S]*\.dene code \.tl[\s\S]*opacity: 1 !important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  for (const yol of ['css/skytrack-gorsel.css', 'css/ajan-gorsel.css', 'css/hook-gorsel.css']) {
    assert.match(oku(yol), /@media \(prefers-reduced-motion: reduce\)/, yol);
  }
});

test('her destenin liste kartında canlı küçük görsel var', () => {
  for (const d of DESTELER) {
    assert.ok(d.gorsel, `${d.slug}: gorsel yok`);
    assert.match(kartHTML(d), /class="mini-gorsel"/, d.slug);
  }
});

test('slayttaki animasyonlar slayt açılınca başlar, kapanınca durur', () => {
  const js = oku('js/atolye.js');
  assert.match(js, /export function slaytaBagla/);
  assert.match(js, /addEventListener\('goster'/);
  assert.match(js, /addEventListener\('gizle'/);
});
