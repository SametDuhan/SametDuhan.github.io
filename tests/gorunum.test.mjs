import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { gorunumSecici, gorunumPaneli, GORUNUMLER } from '../araclar/gorunum-secici.mjs';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');
const htmller = (dizin = KOK) => readdirSync(dizin, { withFileTypes: true }).flatMap((g) => {
  if (['tests', '.git', 'node_modules', '.superpowers'].includes(g.name)) return [];
  const yol = join(dizin, g.name);
  return g.isDirectory() ? htmller(yol) : g.name.endsWith('.html') ? [yol] : [];
});

test('her sayfa modern.css ve gorunum-erken.js yükler (başlıkta, sayfa çizilmeden)', () => {
  for (const f of htmller()) {
    const bas = readFileSync(f, 'utf8').split('</head>')[0];
    const ad = relative(KOK, f);
    assert.match(bas, /href="[./]*css\/modern\.css"/, `${ad}: modern.css yok`);
    assert.match(bas, /<script src="[./]*js\/gorunum-erken\.js"><\/script>/, `${ad}: gorunum-erken.js yok`);
    // modern.css son stil dosyası: aynı özgüllükte kâğıt kurallarını ezer
    const stiller = [...bas.matchAll(/rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
    assert.match(stiller.at(-1), /css\/modern\.css$/, `${ad}: modern.css en son yüklenmeli`);
  }
});

test('görünüm seçici ana sayfada, her menülü alt sayfada ve sunumlarda aynı; iki durak tarih sırasında', () => {
  // girinti sayfaya göre değişir; karşılaştırma boşluklar teke indirilerek
  const sade = (m) => m.replace(/\s+/g, ' ');
  const tr = sade(gorunumSecici());
  assert.ok(sade(oku('index.html')).includes(sade(gorunumPaneli())), 'index.html elle değişmiş: araclar/gorunum-secici.mjs ile aynı olmalı');
  assert.doesNotMatch(tr, /<time|Ekim/, 'seçicide tarih yazısı yok');
  for (const yol of ['hakkimda/index.html', 'projeler/index.html', 'slaytlar/index.html', 'iletisim/index.html', 'projeler/skytrack/index.html', '404.html', 'slaytlar/ai-ajani-nedir/index.html', 'slaytlar/claude-code-hook/index.html', 'slaytlar/skytrack-nasil-kurdum/index.html']) assert.ok(sade(oku(yol)).includes(tr), yol);
  assert.deepEqual(GORUNUMLER.map((g) => g.kod), ['retro', 'modern']);
  assert.ok(GORUNUMLER[0].tarih < GORUNUMLER[1].tarih);
  assert.ok(oku('en/index.html').includes('data-gorunum-sec="modern"'));
});

const erken = (depo = {}, arama = '') => {
  const oz = {};
  const baglam = {
    document: { documentElement: { setAttribute: (a, d) => { oz[a] = d; } } },
    location: { search: arama },
    URLSearchParams,
    localStorage: { getItem: (k) => depo[k] ?? null, setItem: (k, d) => { depo[k] = d; } },
  };
  vm.runInNewContext(oku('js/gorunum-erken.js'), baglam);
  return { oz, depo };
};

test('ilk açılış modern; saklanan seçim ve ?gorunum= adresi uygulanır', () => {
  assert.equal(erken().oz['data-gorunum'], 'modern');
  assert.equal(erken({ gorunum: 'retro' }).oz['data-gorunum'], 'retro');
  assert.equal(erken({ gorunum: 'bozuk' }).oz['data-gorunum'], 'modern');
  const { oz, depo } = erken({}, '?gorunum=retro');
  assert.equal(oz['data-gorunum'], 'retro');
  assert.equal(depo.gorunum, 'retro');
  assert.equal(erken({ tema: 'koyu' }).oz['data-tema'], 'koyu');
  assert.equal(erken({ tema: 'mor' }).oz['data-tema'], undefined);
  assert.equal(erken({ gorunumPanel: 'kapali' }).oz['data-gorunum-panel'], 'kapali');
  assert.equal(erken().oz['data-gorunum-panel'], undefined);
});

test('localStorage kapalıyken de sayfa modern açılır', () => {
  const oz = {};
  vm.runInNewContext(oku('js/gorunum-erken.js'), {
    document: { documentElement: { setAttribute: (a, d) => { oz[a] = d; } } },
    location: { search: '' }, URLSearchParams,
    get localStorage() { throw new Error('engelli'); },
  });
  assert.equal(oz['data-gorunum'], 'modern');
});

// WCAG kontrast
const parlaklik = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('modern renkler açık ve koyu temada en az 4,5:1', () => {
  const css = oku('css/modern.css');
  const blok = (bas) => { const i = css.indexOf(bas); assert.ok(i >= 0, bas); return css.slice(i, css.indexOf('}', i)); };
  const tokenlar = (metin) => Object.fromEntries([...metin.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, k, v]) => [k, v.toLowerCase()]));
  const acik = tokenlar(blok('html[data-gorunum="modern"] {\n  --zemin'));
  const koyu = { ...acik, ...tokenlar(blok('html[data-gorunum="modern"][data-tema="koyu"]')) };
  // cihaz koyuyken uygulanan blok, seçilen koyu blokla aynı olmalı
  assert.deepEqual(tokenlar(blok('html[data-gorunum="modern"]:not([data-tema="acik"])')), tokenlar(blok('html[data-gorunum="modern"][data-tema="koyu"]')));
  const dusuk = [];
  for (const [ad, t] of [['açık', acik], ['koyu', koyu]]) {
    for (const yazi of ['yazi', 'soluk', 'vurgu-koyu', 'ceviz', 'civit', 'bakir-koyu', 'kiremit', 'iyi']) {
      for (const zemin of ['zemin', 'panel', 'kart']) if (kontrast(t[yazi], t[zemin]) < 4.5) dusuk.push(`${ad} ${yazi}/${zemin}`);
    }
    // dolgulu etiketler: turuncu üstünde koyu yazı (.p-kehribar), öbür pigmentlerde zemin rengi
    if (kontrast('#1a1916', t.vurgu) < 4.5) dusuk.push(`${ad} turuncu dolgu`);
    for (const dolgu of ['civit', 'bakir-koyu', 'kiremit']) if (kontrast(t.zemin, t[dolgu]) < 4.5) dusuk.push(`${ad} ${dolgu} dolgu`);
  }
  assert.deepEqual(dusuk, []);
  assert.match(css, /\.p-kehribar \{ --p-ust: #1a1916; \}/);
});

test('modern görünüm hareketi azaltınca yıldızı durdurur; seçici yazdırmada gizli', () => {
  const css = oku('css/modern.css');
  assert.match(css, /prefers-reduced-motion: reduce\) \{ & \.cc-yildiz[^}]*animation: none/);
  assert.match(css, /@media print \{ \.gorunum-ray, \.gorunum-sec \{ display: none !important; \} \}/);
});

test('sunumlarda seçici çalışır; telefonda "⋯" menüsüne taşınır', () => {
  const js = oku('js/atolye.js');
  assert.match(js, /import \{ baslatGorunum \} from '\.\/gorunum\.js'/);
  assert.match(js, /matchMedia\('\(max-width: 700px\)'\)/);
  assert.match(js, /more\.append\(secici\)/);
});

test('ana sayfa paneli "−" ile gizlenir, küçük düğmeyle geri açılır; seçim saklanır', () => {
  const p = gorunumPaneli();
  assert.match(p, /class="gs-kapat" data-panel="gizle" aria-label="[^"]+"/);
  assert.match(p, /class="gs-ac" data-panel="goster" aria-label="[^"]+"/);
  const js = oku('js/gorunum.js');
  assert.match(js, /sakla\('gorunumPanel'/);
  assert.match(js, /\.focus\(\)/);
  assert.match(oku('css/modern.css'), /html\[data-gorunum-panel="kapali"\] \.gs-ac \{ display: grid; \}/);
});
