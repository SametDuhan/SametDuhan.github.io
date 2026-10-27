// claude-done-pixel animasyonunun tarayıcıdaki birebir aktarımı (kaynak: claude-done.ps1).
// Zamanlama saniye, sprite koordinatları u (piksel birimi) cinsinden.

const T_RUN = 1.5, T_JUMP = 0.55, T_WAVE = 0.7, T_OUT = 1.6;
export const SURE = Math.round((T_RUN + 2 * T_JUMP + 2 * T_WAVE + T_OUT + 0.2) * 1000);

const RENK = {
  govde: 'rgb(217,119,87)', koyu: 'rgb(180,90,62)', goz: 'rgb(32,24,22)',
  sap: 'rgb(235,235,235)', yesil: 'rgb(46,204,64)', yesilKoyu: 'rgb(30,150,48)', golge: 'rgba(0,0,0,.55)',
};

export function kareDurumu(t, W, u) {
  const stopX = W * 0.46, startX = W + 2 * u;
  const a = T_RUN, b = a + 2 * T_JUMP, c = b + 2 * T_WAVE;
  let x, yOff = 0, look = 0, run = false, tilt = 0, armUp = false, air = false;
  if (t < a) {
    const p = 1 - Math.pow(1 - t / a, 2);
    x = startX + (stopX - startX) * p; look = -1; run = true;
  } else if (t < b) {
    x = stopX;
    const p = ((t - a) % T_JUMP) / T_JUMP;
    yOff = -Math.sin(p * Math.PI) * 12 * u; air = yOff < -u;
  } else if (t < c) {
    x = stopX;
    const p = ((t - b) % T_WAVE) / T_WAVE;
    armUp = true; tilt = Math.sin(p * Math.PI * 2) * 3.2; look = 1;
  } else {
    const p = Math.min(1, (t - c) / T_OUT) ** 2;
    x = stopX + (W - stopX + 6 * u) * p * 1.15; look = 1; run = true;
  }
  const legPhase = Math.floor(t * 9) % 2;
  if (run) yOff = -Math.abs(Math.sin(t * 9 * Math.PI)) * 1.2 * u;
  return { x, yOff, look, run, tilt, armUp, air, legPhase };
}

function karakter(ctx, d, ground, u, t) {
  const R = (cx, cy, x, y, w, h, renk) => { ctx.fillStyle = renk; ctx.fillRect(cx + x * u, cy + y * u, w * u, h * u); };
  const cx = Math.round(d.x), cy = ground - 11 * u + Math.round(d.yOff);
  const sw = d.air ? 8 : 10;
  ctx.fillStyle = RENK.golge;
  ctx.fillRect(cx + ((16 - sw) * u) / 2 + u, ground + u / 2, sw * u, u / 2 + 1);
  [4, 6, 9, 11].forEach((lx, i) => {
    let boy = 2;
    if (d.run) boy = (i + d.legPhase) % 2 === 0 ? 2 : 1;
    if (d.air) boy = 1;
    R(cx, cy, lx, 9, 1, boy, RENK.govde);
  });
  R(cx, cy, 3, 2, 10, 7, RENK.govde);
  R(cx, cy, 3, 8, 10, 1, RENK.koyu);
  R(cx, cy, 1, 5 + (d.run && d.legPhase ? 1 : 0), 2, 2, RENK.govde);
  R(cx, cy, 5 + d.look, 4, 1, 2, RENK.goz);
  R(cx, cy, 10 + d.look, 4, 1, 2, RENK.goz);
  const armY = d.armUp ? 2 : 5;
  R(cx, cy, 13, armY, 2, 2, RENK.govde);
  const poleBottom = armY + 3, poleLen = 11;
  for (let k = 0; k < poleLen; k++) R(cx, cy, 15 + Math.round((d.tilt * k) / (poleLen - 1)), poleBottom - k, 1, 1, RENK.sap);
  const ust = Math.round(d.tilt), fy = poleBottom - poleLen + 1;
  const sway = d.armUp ? Math.round(Math.sin(t * 14) * 0.9) : 0;
  R(cx, cy, 16 + ust, fy, 6, 4, RENK.yesil);
  R(cx, cy, 16 + ust, fy + 3, 6, 1, RENK.yesilKoyu);
  R(cx, cy, 22 + ust + (sway > 0 ? 1 : 0), fy + 1, 1, 2, RENK.yesil);
  R(cx, cy, 15 + ust, fy - 1, 1, 1, RENK.sap);
}

export function ciz(canvas, tMs) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const u = Math.max(3, Math.floor(H / 34));
  const ground = H - 3 * u;
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, W, H);
  const t = tMs / 1000;
  karakter(ctx, kareDurumu(t, W, u), ground, u, t);
}

let aktif = 0;

export function oynat(canvas) {
  const benim = ++aktif;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ciz(canvas, 3100);
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
