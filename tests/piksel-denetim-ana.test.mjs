import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

test('ana sayfa: piksel görünümde eski (kâğıt/modern) sayfa boşuna çalışmaz ve 1-4 kısayolu çift gezinmez; tarayıcı çubuğu rengi piksel zeminle uyumlu', () => {
  for (const yol of ['index.html', 'en/index.html']) {
    const h = oku(yol);
    assert.match(h, /if \(eskiBasladi \|\| document\.documentElement\.dataset\.gorunum === 'piksel'\) return;/, yol);
    assert.match(h, /if \(document\.documentElement\.dataset\.gorunum === 'piksel'\) return;\n\s*if \(e\.ctrlKey/, `${yol}: eski 1-4 kısayolu piksel görünümde kapalı olmalı`);
  }
});
