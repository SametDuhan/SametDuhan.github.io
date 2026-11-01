// Piksel perde kumaşı: şeritsiz, her karesi rastgele tonda bir mozaik + üzerine pikselle yazılmış ad ve soyad.
// Hem sayfa geçişi perdesi (piksel-gecis.js) hem ana sayfadaki sağ panel perdesi (piksel-ana-konsol.js) bunu kullanır.
export const TON = ['#8a3f2a', '#94442e', '#a24b33', '#ad5337', '#bd5e3e'];
export const rastgele = (tohum) => { let s = (tohum >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; };

// 5 sütun; gövde 7 satır, üstte 2 satır (nokta), altta 2 satır (çengel: Ş) boşluğu
const G = (g) => g.split(' ');
const HARF = {
  S: G('01111 10000 10000 01110 00001 00001 11110'), A: G('01110 10001 10001 11111 10001 10001 10001'), M: G('10001 11011 10101 10101 10001 10001 10001'),
  E: G('11111 10000 10000 11110 10000 10000 11111'), T: G('11111 00100 00100 00100 00100 00100 00100'), D: G('11110 10001 10001 10001 10001 10001 11110'),
  U: G('10001 10001 10001 10001 10001 10001 01110'), H: G('10001 10001 10001 11111 10001 10001 10001'), N: G('10001 11001 10101 10101 10011 10001 10001'),
  I: G('01110 00100 00100 00100 00100 00100 01110'),
};
const EK = { 'İ': { ust: ['00100', '00000'] }, 'Ş': { alt: ['00100', '01100'], taban: 'S' } };
const govde = (ch) => HARF[EK[ch]?.taban || (ch === 'İ' ? 'I' : ch)];

export const SATIRLAR = ['SAMET DUHAN', 'ŞAHİN'];

// W x H alana mozaiği çizer; ctx üzerinde. Adı iki satır olarak (SAMET DUHAN / ŞAHİN) ortalar.
export function dokuCiz(c, W, H, tohum, sacak = false) {
  const r = rastgele(tohum), P = 12;
  for (let y = 0; y < H; y += P) for (let x = 0; x < W; x += P) { c.fillStyle = TON[Math.floor(r() * 5)]; c.fillRect(x, y, P, P); }
  if (sacak) {                                                      // alt kenar: rastgele derinlikte pikselli damlalar, uçları turuncu
    let v = 2;
    for (let x = 0; x < W; x += P) { const a = r(); v = Math.max(1, Math.min(4, v + (a < .4 ? -1 : a < .8 ? 1 : 0))); for (let k = 0; k < v; k++) { c.fillStyle = k === v - 1 ? ['#d97757', '#f09a78'][Math.floor(r() * 2)] : TON[Math.floor(r() * 5)]; c.fillRect(x, H + k * P, P, P); } }
  }
  const uz = Math.max(...SATIRLAR.map((s) => s.length)) * 6;
  const hu = Math.max(3, Math.min(14, Math.floor(Math.min(W * .8 / uz, H * .5 / 22)))), aralik = 11 * hu;
  const by = Math.round(H * .4 - (aralik + 7 * hu) / 2);
  [[hu * .6, '#3a1a10'], [0, '#fbe9dc']].forEach(([ofs, renk]) => {
    c.fillStyle = renk;
    SATIRLAR.forEach((yaz, l) => {
      const gen = yaz.length * 6 * hu - hu, bx = (W - gen) / 2, oy = by + l * aralik;
      [...yaz].forEach((ch, j) => {
        if (ch === ' ') return;
        const e = EK[ch] || {}, satirlar = [...(e.ust || []), ...govde(ch), ...(e.alt || [])], ilk = e.ust ? -e.ust.length : 0;
        satirlar.forEach((sat, y) => [...sat].forEach((v, x) => { if (v === '1') c.fillRect(Math.round(bx + (j * 6 + x) * hu + ofs), Math.round(oy + (y + ilk) * hu + ofs), hu, hu); }));
      });
    });
  });
}
