import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

const parlaklik = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('piksel renkleri koyu zeminde en az 4,5:1', () => {
  const css = oku('css/piksel.css');
  const i = css.indexOf('html[data-gorunum="piksel"] {'); assert.ok(i >= 0);
  const blok = css.slice(i, css.indexOf('}', i));
  const t = Object.fromEntries([...blok.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, k, v]) => [k, v.toLowerCase()]));
  const dusuk = [];
  for (const yazi of ['yazi', 'soluk', 'vurgu-koyu', 'ceviz', 'civit', 'bakir-koyu', 'kiremit', 'iyi']) for (const zemin of ['zemin', 'panel', 'kart']) if (kontrast(t[yazi], t[zemin]) < 4.5) dusuk.push(`${yazi}/${zemin}`);
  if (kontrast('#1a1210', t.vurgu) < 4.5) dusuk.push('turuncu dolgu üstünde koyu yazı');
  assert.deepEqual(dusuk, []);
});

test('piksel ana sayfa bileşeni: index.html yalnız piksel seçiliyken yükler; gölge DOM, iki dil, hareketi azalt', () => {
  const ana = oku('index.html');
  assert.match(ana, /<piksel-ana><\/piksel-ana>/);
  assert.match(ana, /dataset\.gorunum === 'piksel'\) import\('\.\/js\/piksel-ana\.js'\)/);
  assert.ok(oku('en/index.html').includes('<piksel-ana></piksel-ana>'));
  const bilesen = oku('js/piksel-ana.js');
  assert.match(bilesen, /attachShadow\(\{ mode: 'open' \}\)/);
  assert.match(bilesen, /import \{ t, EN \} from '\.\/dil\.js'/);
  assert.match(bilesen, /Staj arıyorum, hemen başlayabilirim\./);
  for (const js of ['js/piksel-ana-kanvas.js', 'js/piksel-ana-konsol.js', 'js/piksel-gecis.js', 'js/piksel-sayfa.js']) assert.match(oku(js), /prefers-reduced-motion: reduce/, js);
  assert.ok(existsSync(join(KOK, 'css/piksel-ana.css')));
});

test('piksel ana sayfa: aynı anda en çok iki karakter; fare izi yok; konsol simülasyonu açıkça yazılı', () => {
  const kanvas = oku('js/piksel-ana-kanvas.js');
  assert.match(kanvas, /ENFAZLA = 2/);
  assert.doesNotMatch(kanvas, /izler\.push/);
  assert.match(oku('js/piksel-ana-konsol.js'), /demo simülasyonu: gerçek bir model çağrılmıyor/);
});

test('piksel sayfa geçişi: perde iner, yeni sayfa perdeli açılır; erken betik bayrağı koyar; yazdırmada gizli', () => {
  const gecis = oku('js/piksel-gecis.js');
  assert.match(gecis, /sessionStorage\.setItem\('pxGecis', '1'\)/);
  assert.match(oku('js/gorunum-erken.js'), /sessionStorage\.getItem\('pxGecis'\)/);
  const css = oku('css/piksel.css');
  assert.match(css, /html\[data-px-gecis\]::after/);
  assert.match(css, /@media print \{ \.pxg/);
  assert.match(oku('js/gorunum.js'), /import '\.\/piksel-gecis\.js'/);
});

test('piksel görünüm modern düzeniyle ortak: yerleşim blokları ikisine birden uygulanır', () => {
  const modern = oku('css/modern.css');
  assert.ok((modern.match(/html:is\(\[data-gorunum="modern"\], \[data-gorunum="piksel"\]\) \{/g) ?? []).length >= 3);
});
