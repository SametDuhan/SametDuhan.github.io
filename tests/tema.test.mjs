import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FABRIKA_SVG } from '../araclar/fabrika.mjs';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const ATLA = new Set(['tests', '.git', '.superpowers', 'node_modules']);
const siteDosyalari = (dizin = KOK) => readdirSync(dizin, { withFileTypes: true }).flatMap((g) => {
  if (ATLA.has(g.name)) return [];
  const yol = join(dizin, g.name);
  return g.isDirectory() ? siteDosyalari(yol) : /\.(html|css|js|mjs)$/.test(g.name) ? [yol] : [];
});
const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');

test('şahin görselleri var ve web boyutunda', () => {
  const sinir = { on: 260e3, ceyrek: 90e3, sag: 90e3, sol: 90e3, arka: 90e3, 'kanat-kucuk': 90e3, logo: 12e3 };
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

test('ana sayfa: şahin önden başlar, kanat pozu yok, süs olduğu için ekran okuyucudan gizli', () => {
  const s = oku('index.html');
  assert.match(s, /<g class="poz aktif" data-poz="on">/);
  assert.doesNotMatch(s, /data-poz="kanat"/);
  assert.doesNotMatch(s, /data-poz="(sol|sag|arka|ceyrek)/);
  assert.match(s, /id="sahin" aria-hidden="true"/);
  assert.doesNotMatch(s, /id="sahin"[^>]*(tabindex|role="button")/);
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
  for (const [yol, poz] of [['hakkimda/index.html', 'ceyrek'], ['projeler/index.html', 'calisan'], ['slaytlar/index.html', 'ogretmen'], ['iletisim/index.html', 'postaci'], ['404.html', 'arka']]) {
    const s = oku(yol);
    // Sahneli sayfalarda şahin, sayfaya uygun nesnelerle aynı SVG'nin içinde durur.
    assert.match(s, new RegExp(`class="sayfa-sahin" src="[^"]*img/sahin/${poz}\\.webp"|class="sayfa-sahne"[^>]*>.*<image[^>]*href="[^"]*img/sahin/${poz}\\.webp"`, 's'), yol);
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

test('fabrika bandı: tuğla fabrika, çalışan saat, tek duman grubu, dişli yok', () => {
  assert.equal((FABRIKA_SVG.match(/<animateTransform /g) || []).length, 2);
  assert.doesNotMatch(FABRIKA_SVG, /disli|dondur|fab-b|Demir-cam/);
  for (const ad of ['SKYTRACK', 'PİKSEL', 'AJAN', 'DESTE', 'ATÖLYE Nº 1', 'ÜRETİM HATTI']) assert.ok(FABRIKA_SVG.includes(ad), ad);
  assert.equal((FABRIKA_SVG.match(/<g class="duman/g) || []).length, 1);
  assert.ok(oku('projeler/index.html').includes('ATÖLYE Nº 1'));
});

test('eski mavi hiçbir site dosyasında kalmadı', () => {
  const bulunan = siteDosyalari().filter((f) => /5ccfff|92, ?207, ?255/i.test(readFileSync(f, 'utf8')));
  assert.deepEqual(bulunan.map((f) => relative(KOK, f)), []);
});

test('tanımı kalkmış renk değişkeni kullanılmıyor', () => {
  const bulunan = siteDosyalari().filter((f) => readFileSync(f, 'utf8').includes('--vurgu-rgb'));
  assert.deepEqual(bulunan.map((f) => relative(KOK, f)), []);
});

// WCAG göreli parlaklık ve kontrast oranı
const parlaklik = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('yazılar zeminleriyle en az 4,5:1 kontrastta (pigment etiketleri dahil)', () => {
  const tema = oku('css/tema.css');
  const tok = Object.fromEntries([...tema.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, k, v]) => [k, v.toLowerCase()]));
  // pigment sınıfları --p, --p-dolgu, --p-ust tanımlar; kural pigmentsizse varsayılanlar geçer
  const pigmentler = [...tema.matchAll(/\.p-(\w+)\s*\{([^}]*)\}/g)].map(([, ad, govde]) => ({ ad, govde }));
  const coz = (deger, pig) => {
    let v = deger.trim();
    for (let i = 0; i < 4; i++) {
      const m = v.match(/^var\(--([\w-]+)(?:,\s*(.+))?\)$/);
      if (!m) break;
      const yerel = pig && pig.govde.match(new RegExp(`--${m[1]}:\\s*([^;]+)`));
      v = yerel ? yerel[1].trim() : tok[m[1]] ?? (m[2] ?? '').trim();
    }
    return /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : null;
  };
  // ebeveyni koyu mürekkep zeminli: <pre> içindeki kod, menüde seçili bağlantının numarası
  const KOD_ICI = new Set(['.slayt pre code', '.menu-linkler a[aria-current="page"] i']);
  const dusuk = [];
  const kaynaklar = ['css/tema.css', 'css/giris.css', 'css/site.css', 'css/deste.css', 'css/atolye.css', 'css/ekran.css', 'css/vitrin.css', 'css/hakkimda.css', 'css/proje.css', ...['ai-ajani-nedir', 'claude-code-hook', 'skytrack-nasil-kurdum'].map((d) => `slaytlar/${d}/index.html`)];
  for (const yol of kaynaklar) {
    for (const [, secici, govde] of oku(yol).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const renk = govde.match(/(?:^|;)\s*color:\s*([^;!]+)/);
      if (!renk || KOD_ICI.has(secici.trim())) continue;
      const zemin = govde.match(/background(?:-color)?:\s*([^;!]+)/);
      for (const pig of [null, ...pigmentler]) {
        const y = coz(renk[1], pig), z = zemin ? coz(zemin[1], pig) : tok.zemin;
        if (!y || !z) continue;
        const k = kontrast(y, z);
        if (k < 4.5) dusuk.push(`${yol} ${secici.trim()}${pig ? ` [p-${pig.ad}]` : ''}: ${k.toFixed(2)}`);
      }
    }
  }
  assert.deepEqual([...new Set(dusuk)], []);
});

test('hareketi azaltınca sandıklar bantta yerinde durur', () => {
  const sandiklar = FABRIKA_SVG.match(/<g class="sandik" style="[^"]*"/g) || [];
  assert.equal(sandiklar.length, 4);
  for (const s of sandiklar) assert.match(s, /--x:\s*\d+px/);
  assert.match(oku('css/site.css'), /\.sandik\s*\{[^}]*transform:\s*translate\(var\(--x\),\s*850px\)/);
});

test('ana sayfadaki süs yazıları ekran okuyucudan gizli', () => {
  const s = oku('index.html');
  assert.doesNotMatch(s, /olcu-yazi/, 'ölçü yazıları kaldırıldı');
  assert.match(s, /<g class="tunek" aria-hidden="true">/);
  assert.match(s, /<!-- teknik çizim kılavuzları -->\s*<g aria-hidden="true"/);
});
