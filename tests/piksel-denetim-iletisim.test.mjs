import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('piksel İletişim: klavye kısayolu ipucu dokunmatik telefonda gizli', () => {
  assert.match(oku('css/piksel-iletisim.css'), /@media \(max-width: 760px\) \{ & \.px-ipucu \{ display: none; \} \}/);
});
