import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('erken betik: tarayıcı çubuğu rengi piksel zeminle uyumlu', () => {
  assert.match(oku('js/gorunum-erken.js'), /theme-color[\s\S]{0,60}#191817/);
});

test('erken betik: depo engelliyken de adresteki ?gorunum= uygulanır; sessionStorage engelliyken favicon/tema rengi yine ayarlanır', async () => {
  const { default: vm } = await import('node:vm');
  const oz = {}, ikon = {}, renk = {};
  const kokEl = { setAttribute: (a, d) => { oz[a] = d; } };
  const doc = { documentElement: kokEl, querySelector: (s) => (s.includes('icon') ? { setAttribute: (a, d) => { ikon[a] = d; } } : { setAttribute: (a, d) => { renk[a] = d; } }) };
  const baglam = (arama) => ({ document: doc, location: { search: arama }, URLSearchParams, get localStorage() { throw new Error('engelli'); }, get sessionStorage() { throw new Error('engelli'); } });
  vm.runInNewContext(oku('js/gorunum-erken.js'), baglam('?gorunum=retro'));
  assert.equal(oz['data-gorunum'], 'retro');
  for (const k of Object.keys(oz)) delete oz[k];
  vm.runInNewContext(oku('js/gorunum-erken.js'), baglam(''));
  assert.equal(oz['data-gorunum'], 'piksel');
  assert.match(ikon.href ?? '', /^data:image\/svg\+xml/);
  assert.equal(renk.content, '#191817');
});
