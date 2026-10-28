import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';

test('şahin görselleri var ve web boyutunda', () => {
  const sinir = { on: 260e3, kanat: 300e3, ceyrek: 90e3, sag: 90e3, sol: 90e3, arka: 90e3, 'kanat-kucuk': 90e3, logo: 12e3 };
  for (const [ad, enFazla] of Object.entries(sinir)) {
    const yol = new URL(`../img/sahin/${ad}.webp`, import.meta.url);
    assert.ok(existsSync(yol), `${ad}.webp yok`);
    assert.ok(statSync(yol).size <= enFazla, `${ad}.webp çok büyük: ${statSync(yol).size}`);
    assert.equal(readFileSync(yol).subarray(8, 12).toString(), 'WEBP');
  }
});
