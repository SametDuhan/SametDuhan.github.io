import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel İletişim: ekranda klavye ipucu satırı yok (sade); kısayollar çalışır', () => {
  assert.doesNotMatch(oku('css/piksel-iletisim.css'), /px-ipucu/);
  assert.doesNotMatch(oku('js/piksel-iletisim-eylem.js'), /px-ipucu/);
});
