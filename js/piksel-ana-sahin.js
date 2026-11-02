// Piksel ana sayfa: tek bir piksel şahin (soyadım). Konsolun üst kenarında, kimlik kutusuyla arasında tüner; bir bölüm bağlantısının üstüne
// gelince (fare ya da klavye) o bölümün iskelesine uçar, ayrılınca eve döner. Karakter sayısı: bu şahin + en çok 1 koşan Claude.
const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const P = { o: '#d97757', d: '#a24b33', w: '#f4efe8', k: '#1a1210', y: '#f09a78' };
// 16 sütun x 13 satır, sağa bakar: koyu başlık, krem yanak ve göğüs, turuncu sırt, kancalı sarı gaga, koyu kuyruk
const GOVDE = [
  '......dddd......',
  '.....dddddd.....',
  '....ddddkddy....',
  '....dddddddyy...',
  '....dddwwddy....',
  '...ddooowwwo....',
  '..dooooowwwoo...',
  '..dooooowwwoo...',
  '.doooooowwwo....',
  '.dooooodwwdo....',
  'dooooodddddd....',
  'ddodd...yy.yy...',
  'dd......yy.yy...',
];
// kanat çırpma: gövdenin sırtından yukarı ya da aşağı uzanan koyu kanat
const KANAT_YUKARI = ['.........d......', '........dd......', '.......ddd......', '......dddd......', '.....ddddd......'];
const KANAT_ASAGI = ['.......ddddd.....', '......dddddd.....', '.....ddddd.......'];
const AA = 1.0;        // uçuş süresi (sn)
const ease = (p) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);   // yavaş kalkar, hızlanır, yavaş konar

export function sahinKur(root) {
  const konsol = root.querySelector('.konsol');
  const s = { x: 0, y: 0, bx: 0, by: 0, t0: -9, hedef: null, ucuyor: false, ev: true, bekle: 0, kutu: null };
  const eve = (U) => { const r = konsol.getBoundingClientRect(); return { x: r.right - 10 * U, y: r.top + 1 }; };   // ayak noktası: konsolun üst kenarı, sağ köşeye yakın
  const ayni = (a, b) => Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1;
  function git(hedef, tt) {
    if (s.hedef && ayni(s.hedef, hedef) && !s.ucuyor) return;
    if (AZ) { s.x = hedef.x; s.y = hedef.y; s.hedef = hedef; return; }
    s.bx = s.x; s.by = s.y; s.hedef = hedef; s.t0 = tt; s.ucuyor = true;
  }
  return {
    // bir iskeleye geç (p) ya da bırakınca eve dön (p yok); dar ekranda iskele yoktur, şahin yerinde kalır
    iskele(p, tt) { if (p) { s.ev = false; git({ x: p.x, y: p.y - 11 }, tt); } else { s.ev = true; s.bekle = tt + 1.6; } },
    ciz(hc, tt, U, dar) {
      if (dar) { s.kutu = null; return; }   // tek sütun düzende tuval sabit, sayfa kayar: şahin yok
      const ev = eve(U);
      if (!s.hedef) { s.x = ev.x; s.y = ev.y; s.hedef = ev; s.ev = true; }
      if (s.ev && !s.ucuyor) { if (tt > s.bekle) git(ev, tt); if (!s.ucuyor) { s.x = ev.x; s.y = ev.y; s.hedef = ev; } }
      let yOff = 0, kanat = -1;
      if (!s.ucuyor && s.indi && tt - s.indi < .3) yOff = -Math.sin((tt - s.indi) / .3 * Math.PI) * 5;   // konunca küçük sıçrama
      if (s.ucuyor) {
        const p = Math.min(1, (tt - s.t0) / AA);
        s.x = s.bx + (s.hedef.x - s.bx) * ease(p); s.y = s.by + (s.hedef.y - s.by) * ease(p);
        yOff = -Math.sin(p * Math.PI) * 46; kanat = Math.floor(tt * (p < .3 || p > .8 ? 18 : 9)) % 2;   // kalkış ve konuşta hızlı çırpar, süzülürken yavaş
        if (p >= 1) { s.ucuyor = false; s.x = s.hedef.x; s.y = s.hedef.y; s.indi = tt; }
      }
      const u = Math.max(3, Math.round(U * 1.1));
      const ox = Math.round(s.x - 9 * u), oy = Math.round(s.y + yOff - GOVDE.length * u);
      const bak = s.ucuyor ? 0 : (Math.floor(tt * .6) % 7 === 0 ? 1 : 0);   // yerdeyken ara sıra başını çevirir (göz kısılır)
      const kare = (satir, ex, ey) => satir.split('').forEach((c, i) => { if (c === '.' || !P[c]) return; hc.fillStyle = P[c]; hc.fillRect(ox + (ex + i) * u, oy + ey * u, u, u); });
      GOVDE.forEach((r, j) => kare(bak && j === 2 ? r.replace('k', 'o') : r, 0, j));
      if (kanat === 0) KANAT_YUKARI.forEach((r, j) => kare(r, 0, j - 3));
      else if (kanat === 1) KANAT_ASAGI.forEach((r, j) => kare(r, 0, j + 6));
      s.kutu = { x1: ox, x2: ox + 16 * u, y1: oy, y2: oy + GOVDE.length * u };
    },
    icinde(x, y) { const k = s.kutu; return !!k && x >= k.x1 && x <= k.x2 && y >= k.y1 - 6 && y <= k.y2; },
    kutu: () => s.kutu,
  };
}
