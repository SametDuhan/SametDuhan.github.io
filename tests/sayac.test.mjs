import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { say, repolar, dosyaMetni } from '../araclar/sayac_guncelle.mjs';
import { SAYILAR } from '../js/sayilar.js';
import { PROJELER } from '../js/projeler.js';

const oku = (yol) => readFileSync(new URL(`../${yol}`, import.meta.url), 'utf8');

test('sayaç: Claude ortak yazarlı commit\'ler büyük/küçük harf duyarsız sayılır', () => {
  assert.deepEqual(say(['ilk', 'düzelt\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>', 'x\n\nco-authored-by: claude']), { commit: 3, claude: 2 });
  assert.deepEqual(say([]), { commit: 0, claude: 0 });
});

test('sayaç: her proje reposunun sayımı var; dosya üreticinin yazdığı biçimde', () => {
  assert.deepEqual(Object.keys(SAYILAR.repolar).sort(), repolar(PROJELER).sort());
  assert.match(SAYILAR.tarih, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(oku('js/sayilar.js'), dosyaMetni(SAYILAR.repolar, SAYILAR.tarih));
});

test('sayaç: GitHub Actions günde bir sayar, değişince commit\'ler ve Pages yayınını ister', () => {
  const yml = oku('.github/workflows/sayaclar.yml');
  assert.match(yml, /schedule:\s*\n\s*- cron:/);
  assert.match(yml, /workflow_dispatch/);
  assert.match(yml, /node araclar\/sayac_guncelle\.mjs/);
  assert.match(yml, /npm test/);
  assert.match(yml, /pages\/builds/);
});
