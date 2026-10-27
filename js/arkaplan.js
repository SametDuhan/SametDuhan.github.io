// Efekt: altta perspektifli ışıklı ızgara, üstünde fareyi izleyen ajan ağı.
// Saf fonksiyonlar DOM'a dokunmaz; Node'da sınanır. baslat() bir canvas'ı kutusuna bağlar.

const ESIK = 110;
const VURGU = '92,207,255';

export function noktaSayisi(w, h, { min = 20, max = 70 } = {}) {
  return Math.min(max, Math.max(min, Math.round((w * h) / 18000)));
}

export function baglantilar(noktalar, esik) {
  const sonuc = [];
  for (let a = 0; a < noktalar.length; a++) {
    for (let b = a + 1; b < noktalar.length; b++) {
      const d = Math.hypot(noktalar[a].x - noktalar[b].x, noktalar[a].y - noktalar[b].y);
      if (d < esik) sonuc.push({ a, b, alfa: (1 - d / esik) * 0.35 });
    }
  }
  return sonuc;
}

export function izgaraYataylari(h, ufuk, t) {
  const kayma = (t * 0.6) % 30;
  const ys = [];
  for (let k = 0; ; k++) {
    const y = ufuk + Math.pow((k * 30 + kayma) / 360, 2) * (h - ufuk);
    if (y > h) break;
    ys.push(y);
  }
  return ys;
}

export function cizimModu(azHareket) {
  return azHareket ? 'tek-kare' : 'animasyon';
}

function izgaraCiz(ctx, w, h, t) {
  const ufuk = h * 0.55;
  const isik = ctx.createRadialGradient(w / 2, ufuk, 0, w / 2, ufuk, Math.max(w, h) * 0.6);
  isik.addColorStop(0, `rgba(${VURGU},${0.16 + 0.06 * Math.sin(t * 0.02)})`);
  isik.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = isik;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = `rgba(${VURGU},0.16)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = -16; i <= 16; i++) {
    ctx.moveTo(w / 2 + i * 10, ufuk);
    ctx.lineTo(w / 2 + i * (w / 14), h);
  }
  for (const y of izgaraYataylari(h, ufuk, t)) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
}

function agCiz(ctx, noktalar, fare) {
  const hepsi = fare ? noktalar.concat([fare]) : noktalar;
  for (const { a, b, alfa } of baglantilar(hepsi, ESIK)) {
    ctx.strokeStyle = `rgba(${VURGU},${alfa})`;
    ctx.beginPath();
    ctx.moveTo(hepsi[a].x, hepsi[a].y);
    ctx.lineTo(hepsi[b].x, hepsi[b].y);
    ctx.stroke();
  }
  ctx.fillStyle = `rgba(${VURGU},0.7)`;
  for (const n of noktalar) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function baslat(canvas, sinir = { min: 14, max: 30 }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const kap = canvas.parentElement;
  const mod = cizimModu(matchMedia('(prefers-reduced-motion: reduce)').matches);
  let w = 0, h = 0, t = 0, kare = 0, fare = null, noktalar = [];

  function boyutla() {
    const oran = Math.min(devicePixelRatio || 1, 2);
    const kutu = kap.getBoundingClientRect();
    w = Math.max(1, kutu.width);
    h = Math.max(1, kutu.height);
    canvas.width = w * oran;
    canvas.height = h * oran;
    ctx.setTransform(oran, 0, 0, oran, 0, 0);
    const n = noktaSayisi(w, h, sinir);
    noktalar = Array.from({ length: n }, (_, i) => noktalar[i] || {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    });
    // Kutu küçülünce dışarıda kalan noktalar içeri alınır; yoksa kenarda titreşip takılırlar.
    for (const n of noktalar) {
      n.x = Math.min(w, Math.max(0, n.x));
      n.y = Math.min(h, Math.max(0, n.y));
    }
  }

  function ciz() {
    ctx.clearRect(0, 0, w, h);
    izgaraCiz(ctx, w, h, t);
    agCiz(ctx, noktalar, fare);
  }

  function adim() {
    t++;
    for (const n of noktalar) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    ciz();
    kare = requestAnimationFrame(adim);
  }

  const fareHareket = (e) => {
    const kutu = canvas.getBoundingClientRect();
    fare = { x: e.clientX - kutu.left, y: e.clientY - kutu.top };
  };
  const fareCikti = () => { fare = null; };
  const gozlemci = new ResizeObserver(() => { boyutla(); if (mod === 'tek-kare') ciz(); });
  const gorunurluk = () => {
    cancelAnimationFrame(kare);
    if (!document.hidden && mod === 'animasyon') kare = requestAnimationFrame(adim);
  };

  boyutla();
  gozlemci.observe(kap);
  if (mod === 'animasyon') {
    kap.addEventListener('pointermove', fareHareket);
    kap.addEventListener('pointerleave', fareCikti);
    document.addEventListener('visibilitychange', gorunurluk);
    kare = requestAnimationFrame(adim);
  } else {
    ciz();
  }

  return () => {
    cancelAnimationFrame(kare);
    gozlemci.disconnect();
    kap.removeEventListener('pointermove', fareHareket);
    kap.removeEventListener('pointerleave', fareCikti);
    document.removeEventListener('visibilitychange', gorunurluk);
  };
}
