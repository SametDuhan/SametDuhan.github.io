import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel görünüm: sunum içi şahin çizimleri piksel karakterle değişir, krem kapanış kartı ve pencere içi şahin gizlenir; öbür görünümler etkilenmez', () => {
  const css = oku('css/piksel.css');
  assert.match(css, /& \.slayt img\[src\*="img\/sahin\/"\] \{ content: url\("data:image\/svg\+xml/);
  assert.match(css, /& \.vitrin-son \.v-medya, & \.yap-sahne image \{ display: none; \}/);
  // kural yalnız html[data-gorunum="piksel"] içinde (üst düzey blok): modern ve kâğıt görünüm şahini aynen gösterir
  const i = css.indexOf('& .slayt img[src*="img/sahin/"]');
  const bloklar = css.slice(0, i).split('\nhtml[data-gorunum="piksel"] {');
  assert.ok(bloklar.length >= 2, 'kural piksel bloğunun içinde olmalı');
  // gerçek sunumlarda değiştirilecek şahin görselleri var (kural boşa yazılmamış)
  for (const slug of ['ai-ajani-nedir', 'claude-code-hook', 'skytrack-nasil-kurdum']) assert.match(oku(`slaytlar/${slug}/index.html`), /<img[^>]+src="\.\.\/\.\.\/img\/sahin\//, slug);
});
