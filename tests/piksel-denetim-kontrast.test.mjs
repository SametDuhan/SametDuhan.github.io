import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const parlaklik = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

// Piksel görünümün koyu zeminleri; koyu renkli yazılar (turuncu/yeşil dolgu üstünde) ayrıca doğrulanır.
const ZEMINLER = ['#191817', '#201e1c', '#141312', '#1c1a18'];
const DOLGULAR = { '#1a1210': ['#d97757', '#f09a78', '#e8916f'], '#0d2a12': ['#2ecc40'] };

test('piksel css dosyalarında elle yazılan her yazı rengi okunur (koyu zeminde ≥4,5:1; koyu yazı dolgusunun üstünde ≥4,5:1)', () => {
  const dosyalar = readdirSync(join(KOK, 'css')).filter((f) => /^piksel.*\.css$/.test(f));
  assert.ok(dosyalar.length >= 8);
  const dusuk = [];
  for (const f of dosyalar) {
    const css = readFileSync(join(KOK, 'css', f), 'utf8');
    for (const m of css.matchAll(/(?<![-\w])color:\s*(#[0-9a-fA-F]{6})/g)) {
      const renk = m[1].toLowerCase();
      if (DOLGULAR[renk]) { for (const d of DOLGULAR[renk]) if (kontrast(renk, d) < 4.5) dusuk.push(`${f}: ${renk} / ${d}`); continue; }
      for (const z of ZEMINLER) if (kontrast(renk, z) < 4.5) dusuk.push(`${f}: ${renk} / ${z} = ${kontrast(renk, z).toFixed(2)}`);
    }
  }
  assert.deepEqual([...new Set(dusuk)], []);
});
