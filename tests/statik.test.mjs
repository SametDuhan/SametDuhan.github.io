import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const ATLA = new Set(['tests', '.git', '.superpowers', 'node_modules']);

function dosyalar(dizin = KOK) {
  return readdirSync(dizin, { withFileTypes: true }).flatMap((g) => {
    if (ATLA.has(g.name)) return [];
    const yol = join(dizin, g.name);
    return g.isDirectory() ? dosyalar(yol) : [yol];
  });
}

const metinDosyalari = () => dosyalar().filter((f) => /\.(html|css|js|mjs|json|md)$/.test(f));
const htmlDosyalari = () => dosyalar().filter((f) => f.endsWith('.html'));

const YASAK = [
  'SametDuhan/sds', 'SametDuhan/tekrar', 'SametDuhan/ajanlar', 'a-sirketi', 'selmakcby',
  'ikinci-beyin', 'kulup-etkinlik', '/home/', '.env', 'chat_id', 'TELEGRAM_', 'avenox', '🍋',
];

test('yasak dizge yok', () => {
  const bulunan = [];
  for (const f of metinDosyalari()) {
    const icerik = readFileSync(f, 'utf8').toLowerCase();
    for (const y of YASAK) if (icerik.includes(y.toLowerCase())) bulunan.push(`${relative(KOK, f)}: ${y}`);
  }
  assert.deepEqual(bulunan, []);
});

test('mail düz metin değil', () => {
  const bulunan = metinDosyalari().filter((f) => readFileSync(f, 'utf8').includes('16sametduhan16@gmail.com'));
  assert.deepEqual(bulunan.map((f) => relative(KOK, f)), []);
});

test('iç linkler çözülür', () => {
  const kirik = [];
  for (const f of htmlDosyalari()) {
    const html = readFileSync(f, 'utf8');
    for (const [, deger] of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
      if (/^(https?:|mailto:|#|data:)/.test(deger) || deger === '') continue;
      let hedef = join(dirname(f), deger.split(/[?#]/)[0]);
      if (existsSync(hedef) && statSync(hedef).isDirectory()) hedef = join(hedef, 'index.html');
      if (!existsSync(hedef)) kirik.push(`${relative(KOK, f)} → ${deger}`);
    }
  }
  assert.deepEqual(kirik, []);
});

test('her sayfada lang=tr ve viewport; sayfa geneli arka plan efekti yok', () => {
  const sayfalar = htmlDosyalari();
  assert.ok(sayfalar.length > 0, 'hiç HTML sayfası yok');
  for (const f of sayfalar) {
    const html = readFileSync(f, 'utf8');
    const ad = relative(KOK, f);
    assert.match(html, /<html lang="tr">/, `${ad}: lang=tr yok`);
    assert.match(html, /name="viewport"/, `${ad}: viewport yok`);
    assert.doesNotMatch(html, /id="arkaplan"/, `${ad}: sayfa geneli arka plan efekti kaldırılacaktı`);
  }
});
