// Logos: Simple Icons v15 (CC0); pixel rendering stays local and needs no external requests.
export const EKRAN_KARTLARI = [
  { ad: 'ROBOT-7', dosya: null, renk: '#5ccfff' },
  { ad: 'ANTHROPIC', dosya: 'anthropic', renk: '#d9a58b' },
  { ad: 'OPENAI', dosya: 'openai', renk: '#8de2c0' },
  { ad: 'GEMINI', dosya: 'googlegemini', renk: '#a2b4ff' },
];

export function ekranSanati() {
  const desenler = new Map();
  for (const kart of EKRAN_KARTLARI.filter(k => k.dosya)) {
    fetch(new URL(`../img/markalar/${kart.dosya}.svg`, import.meta.url))
      .then(r => { if (!r.ok) throw Error('Logo yüklenemedi'); return r.text(); })
      .then(svg => {
        const path = new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('path');
        if (!path) return;
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 48;
        const c = canvas.getContext('2d'); c.scale(2, 2);
        if (kart.dosya === 'googlegemini') {
          const gradient = c.createLinearGradient(0, 24, 24, 0);
          gradient.addColorStop(0, '#6e9eff'); gradient.addColorStop(.5, '#a394fb'); gradient.addColorStop(1, '#edb8dc'); c.fillStyle = gradient;
        } else c.fillStyle = kart.renk;
        c.fill(new Path2D(path.getAttribute('d'))); desenler.set(kart.dosya, canvas);
      }).catch(() => { /* The label still identifies the card if its asset cannot load. */ });
  }

  return function ciz(c, W, H, indeks, zaman, az = false) {
    const kart = EKRAN_KARTLARI[indeks % EKRAN_KARTLARI.length];
    const px = Math.max(1, Math.floor(Math.min(W / 70, H / 62)));
    const size = 48 * px, x = Math.floor((W - size) / 2), y = Math.floor((H - size) / 2) - 3 * px;
    c.save(); c.imageSmoothingEnabled = false;
    c.fillStyle = '#102433';
    for (let gy = 9; gy < H; gy += 12) for (let gx = 9; gx < W; gx += 12) c.fillRect(gx, gy, 1, 1);
    const rect = (rx, ry, rw, rh, color) => { c.fillStyle = color; c.fillRect(x + rx * px, y + ry * px, rw * px, rh * px); };
    if (!kart.dosya) {
      const blink = !az && zaman % 3300 > 3050;
      rect(23, 3, 2, 7, '#3c788d'); rect(21, 1, 6, 3, '#7ee787');
      rect(7, 12, 34, 26, '#234657'); rect(10, 9, 28, 32, '#234657');
      rect(10, 13, 28, 23, '#0b1823');
      rect(3, 20, 4, 10, '#5ccfff'); rect(41, 20, 4, 10, '#5ccfff');
      rect(14, blink ? 24 : 20, 6, blink ? 1 : 6, '#7ee787'); rect(28, blink ? 24 : 20, 6, blink ? 1 : 6, '#7ee787');
      rect(19, 31, 10, 2, '#5ccfff'); rect(22, 38, 4, 5, '#3c788d');
      rect(16, 43, 16, 3, '#234657');
      if (!az) rect(16 + Math.floor(zaman / 240) % 14, 31, 2, 2, '#d5f6ff');
    } else {
      const image = desenler.get(kart.dosya);
      if (image) c.drawImage(image, x, y, size, size);
    }
    const fs = Math.max(8, W / 30);
    c.font = `bold ${fs}px ui-monospace, monospace`; c.textAlign = 'center'; c.textBaseline = 'bottom'; c.fillStyle = kart.renk;
    c.fillText(kart.ad, W / 2, H - 11, W - 20);
    c.font = `${Math.max(6, fs * .7)}px ui-monospace, monospace`; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillStyle = '#7d9aa9'; c.fillText('SD-86 / PIXEL GALLERY', 10, 8);
    // Slow scan band stays behind the CRT's existing scanline overlay.
    if (!az) { c.fillStyle = 'rgba(160,220,255,.035)'; c.fillRect(0, (zaman / 40) % H, W, 6); }
    c.restore();
  };
}
