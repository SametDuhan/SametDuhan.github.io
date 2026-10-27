// claude-done-pixel animasyonunun tarayıcı kopyası: sağdan gelir, iki kez zıplar,
// yeşil bayrağı iki kez sallar, sağdan çıkar. Karakter düz dikdörtgenlerle çizilir.

export const SURE = 6500;

const GELIS = 1500;
const ZIPLAMALAR = [[1500, 2000], [2200, 2700]];
const SALLAMA = [2700, 4700];

export function kareDurumu(t) {
  const bitti = t >= SURE;
  let x = 0;
  let y = 0;
  let kosuyor = false;
  if (t < GELIS) {
    const p = t / GELIS;
    x = 1.15 * (1 - p) * (1 - p);
    kosuyor = true;
  } else if (t >= SALLAMA[1]) {
    const p = Math.min(1, (t - SALLAMA[1]) / (SURE - SALLAMA[1]));
    x = 1.15 * p * p;
    kosuyor = true;
  }
  for (const [bas, son] of ZIPLAMALAR) {
    if (t > bas && t < son) y = Math.sin(Math.PI * ((t - bas) / (son - bas)));
  }
  const bayrak = t >= SALLAMA[0] && t < SALLAMA[1];
  const faz = bayrak ? Math.floor((t - SALLAMA[0]) / 500) % 2 : 0;
  const bacak = kosuyor ? Math.floor(t / 120) % 2 : 0;
  return { x, y, bayrak, faz, bacak, bitti };
}

const TURUNCU = '#d97757';
const KOYU = '#1e1e1e';

function karakter(ctx, ox, oy, s, d) {
  const kutu = (cx, cy, w, h, renk) => { ctx.fillStyle = renk; ctx.fillRect(ox + cx * s, oy + cy * s, w * s, h * s); };
  kutu(0, 0, 10, 6, TURUNCU);
  kutu(-1, 3, 1, 1, TURUNCU);
  kutu(2, 1, 1, 2, KOYU);
  kutu(7, 1, 1, 2, KOYU);
  const bacaklar = d.bacak ? [[1, 1], [3, 2], [6, 1], [8, 2]] : [[1, 2], [3, 1], [6, 2], [8, 1]];
  for (const [cx, h] of bacaklar) kutu(cx, 6, 1, d.y > 0 ? 1 : h, TURUNCU);
  if (d.bayrak) {
    kutu(10, 3, 1, 1, TURUNCU);
    kutu(11, -6, 1, 11, '#e6edf3');
    if (d.faz === 0) {
      kutu(12, -6, 6, 3, '#2fbf4a');
      kutu(18, -5, 1, 1, '#2fbf4a');
    } else {
      kutu(12, -6, 5, 2, '#2fbf4a');
      kutu(12, -4, 3, 1, '#2fbf4a');
      kutu(17, -6, 1, 1, '#2fbf4a');
    }
  }
}

export function ciz(canvas, t) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const s = Math.max(4, Math.round(H / 34));
  const d = kareDurumu(t);
  ctx.fillStyle = KOYU;
  ctx.fillRect(0, 0, W, H);
  const zemin = H - 3 * s;
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(W / 2 - 6 * s, zemin + 8 * s - s, 12 * s, s / 2);
  const ox = W / 2 - 5 * s + d.x * (W / 2 + 8 * s);
  const oy = zemin - 8 * s + s - d.y * 7 * s;
  karakter(ctx, ox, oy, s, d);
}

let aktif = 0;

export function oynat(canvas) {
  const benim = ++aktif;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ciz(canvas, 3000);
    return Promise.resolve();
  }
  return new Promise((bitir) => {
    const bas = performance.now();
    const kare = (simdi) => {
      if (benim !== aktif) return bitir();
      const t = simdi - bas;
      ciz(canvas, Math.min(t, SURE));
      if (t < SURE) requestAnimationFrame(kare);
      else bitir();
    };
    requestAnimationFrame(kare);
  });
}

export function durdur() {
  aktif++;
}
