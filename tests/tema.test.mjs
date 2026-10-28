import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');

test('şahin görselleri var ve web boyutunda', () => {
  const sinir = { on: 260e3, kanat: 300e3, ceyrek: 90e3, sag: 90e3, sol: 90e3, arka: 90e3, 'kanat-kucuk': 90e3, logo: 12e3 };
  for (const [ad, enFazla] of Object.entries(sinir)) {
    const yol = new URL(`../img/sahin/${ad}.webp`, import.meta.url);
    assert.ok(existsSync(yol), `${ad}.webp yok`);
    assert.ok(statSync(yol).size <= enFazla, `${ad}.webp çok büyük: ${statSync(yol).size}`);
    assert.equal(readFileSync(yol).subarray(8, 12).toString(), 'WEBP');
  }
});

test('ana sayfa dosyalarında eski mavi yok', () => {
  for (const yol of ['index.html', 'css/tema.css', 'css/giris.css']) {
    for (const m of ['5ccfff', '92, 207, 255']) assert.ok(!oku(yol).includes(m), `${yol}: ${m}`);
  }
});

test('tema tokenları kâğıt paletinde', () => {
  const css = oku('css/tema.css');
  for (const d of ['--zemin: #f2e8d5', '--yazi: #33261a', '--vurgu: #d07a2a', '--civit: #2f4a6b', '--bakir: #4f7d6e', '--kiremit: #a8432a', '--muhur: #8e2f23']) assert.ok(css.includes(d), d);
  assert.match(css, /'Fraunces'/);
});

test('ana sayfa: şahin önden başlar, kanat pozu gizli, klavyeyle erişilir', () => {
  const s = oku('index.html');
  assert.match(s, /<g class="poz aktif" data-poz="on">/);
  assert.match(s, /<g class="poz" data-poz="kanat" transform="translate\(629\.5 1190\) scale\(1\.2304\)/);
  assert.doesNotMatch(s, /data-poz="(sol|sag|arka|ceyrek)/);
  assert.match(s, /id="sahin" tabindex="0" role="button" aria-label="[^"]+"/);
  assert.equal((s.match(/<a class="kare /g) || []).length, 4);
  for (const p of ['p-kehribar', 'p-civit', 'p-bakir', 'p-kiremit']) assert.ok(s.includes(p), p);
  assert.match(s, /class="seyir-haritasi"/);
  assert.match(s, /ATÖLYE/);
  assert.doesNotMatch(s, /class="crt"|<canvas id="ekran"|sahne\.js|fener\.js/);
});

test('ana sayfa CSS: yana kaymaz, hareketi azaltınca durur, odak görünür', () => {
  const css = oku('css/giris.css');
  assert.match(css, /\.giris\s*\{[^}]*overflow-x:\s*clip/);
  const az = css.slice(css.indexOf('prefers-reduced-motion'));
  for (const sec of ['.govde', '.seyir-haritasi', '.duman']) assert.ok(az.includes(sec), sec);
  assert.match(css, /\.kare:focus-visible/);
});

test('her alt sayfada kendi şahin pozu var, terminal kalıntısı ve fener yok', () => {
  for (const [yol, poz] of [['hakkimda/index.html', 'ceyrek'], ['projeler/index.html', 'sag'], ['slaytlar/index.html', 'sol'], ['iletisim/index.html', 'kanat-kucuk'], ['404.html', 'arka']]) {
    const s = oku(yol);
    assert.match(s, new RegExp(`class="sayfa-sahin" src="[^"]*img/sahin/${poz}\\.webp"`), yol);
    assert.doesNotMatch(s, /fener\.js|~\/samet \$/, yol);
    assert.match(s, /family=Fraunces/, `${yol}: yazı tipi linki yok`);
    assert.match(s, /<meta name="theme-color" content="#f2e8d5">/, `${yol}: theme-color eski`);
  }
});

test('alt sayfa şahini yalnız nefes alır ve hareketi azaltınca durur', () => {
  const css = oku('css/site.css');
  assert.match(css, /\.sayfa-sahin\s*\{[^}]*animation:\s*nefes/);
  assert.ok(css.slice(css.indexOf('prefers-reduced-motion')).includes('.sayfa-sahin'));
});
