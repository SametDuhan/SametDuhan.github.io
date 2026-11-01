// Hakkımda sayfasının başında büyük, etkileşimli Claude Code pikseli: gözleri imleci izler, üzerine gelince bayrak sallar,
// tıklayınca iki kez zıplayıp sitedeki gerçek bilgilerden birini söyler. Dokunmatik ve klavye için tüm sahne bir düğmedir.
import { pikselKarakter } from './piksel.js';
import { SAYILAR } from './sayilar.js';
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GEN = 320, YUK = 280, U = 9, ZEMIN_Y = 222;

const bilgiler = () => {
  const sky = SAYILAR.repolar.airock;
  return [
    t('AI’ı 2 Ekim 2026’da öğrenmeye başladım.', 'I started learning AI on October 2, 2026.'),
    t(`SkyTrack’in ${sky.commit} commit’inin ${sky.claude}’i Claude ile ortak yazıldı.`, `${sky.claude} of SkyTrack’s ${sky.commit} commits were co-authored with Claude.`),
    t('Test yazdırırım: AI’ın bir hatası bir kez düzelir, bir daha gelmez.', 'I have tests written: an AI mistake gets fixed once and never comes back.'),
    t('Genelde 1 gün içinde dönerim.', 'I usually reply within a day.'),
    t('Staj arıyorum, hemen başlayabilirim.', 'Looking for an internship, available now.'),
  ];
};

export function sahneKur() {
  const baslik = document.querySelector('.sayfa-basi');
  if (!baslik || innerWidth < 1150) return undefined;
  const kutu = document.createElement('button');
  kutu.type = 'button'; kutu.className = 'px-sahne';
  kutu.setAttribute('aria-label', t('Claude Code pikseli: tıkla, bir bilgi söylesin', 'Claude Code pixel: click and it tells you a fact'));
  kutu.innerHTML = `<span class="px-sahne-etiket" aria-hidden="true">claude-code · ${t('canlı', 'live')}</span><canvas aria-hidden="true"></canvas><span class="px-balon" role="status" aria-live="polite"></span><span class="px-sahne-ipucu" aria-hidden="true">${t('tıkla', 'click')}</span>`;
  baslik.append(kutu);
  const cv = kutu.querySelector('canvas'), balon = kutu.querySelector('.px-balon'), ipucu = kutu.querySelector('.px-sahne-ipucu');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = GEN * dpr; cv.height = YUK * dpr; const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);

  let imlec = null, ustunde = false, mod = 'bos', t0 = 0, sira = 0, balonZaman, goruyor = true, durdu = false, kare = 0, gozKirp = 0;
  const bil = bilgiler();
  const takip = (e) => { imlec = { x: e.clientX, y: e.clientY }; };
  addEventListener('pointermove', takip);
  kutu.addEventListener('pointerenter', () => { ustunde = true; });
  kutu.addEventListener('pointerleave', () => { ustunde = false; });
  kutu.addEventListener('focus', () => { ustunde = true; }); kutu.addEventListener('blur', () => { ustunde = false; });
  kutu.addEventListener('click', () => {
    mod = 'zipla'; t0 = performance.now() / 1000; ipucu.remove();
    balon.textContent = bil[sira++ % bil.length]; balon.classList.add('goster');
    clearTimeout(balonZaman); balonZaman = setTimeout(() => balon.classList.remove('goster'), 3800);
  });
  const gozlem = new IntersectionObserver(([e]) => { goruyor = e.isIntersecting; }, { threshold: 0 }); gozlem.observe(kutu);

  function ciz(now) {
    if (durdu) return;
    if (!goruyor || document.hidden) { requestAnimationFrame(ciz); return; }
    if (now - (ciz.son ?? 0) < 33) { requestAnimationFrame(ciz); return; }
    ciz.son = now; kare++;
    const tt = now / 1000;
    c.clearRect(0, 0, GEN, YUK);
    // zemin: devre izi, via'lar, noktalar
    c.fillStyle = '#262321'; for (let y = 18; y < ZEMIN_Y - 10; y += 28) for (let x = 14; x < GEN; x += 28) c.fillRect(x, y, 2, 2);
    c.fillStyle = '#7a4a38'; c.fillRect(0, ZEMIN_Y + 10, GEN, 6);
    c.fillStyle = '#4a3128'; c.fillRect(0, ZEMIN_Y + 24, GEN, 4); c.fillRect(0, ZEMIN_Y + 38, GEN, 4);
    c.strokeStyle = '#d97757'; c.lineWidth = 3; for (const x of [40, 190, 280]) { c.fillStyle = '#191817'; c.fillRect(x - 8, ZEMIN_Y + 5, 16, 16); c.strokeRect(x - 6.5, ZEMIN_Y + 6.5, 13, 13); }
    // veri paketi
    const p = (tt * .35) % 1; c.fillStyle = '#f09a78'; c.fillRect(Math.round(p * GEN / 6) * 6, ZEMIN_Y + 11, 14, 4);
    // yıldızlar
    for (let i = 0; i < 6; i++) { c.fillStyle = `rgba(244,239,232,${.25 + .35 * ((Math.sin(tt * 1.4 + i * 2.1) + 1) / 2)})`; c.fillRect(30 + i * 52, 30 + (i * 37) % 70, 3, 3); }
    // karakter
    const r = kutu.getBoundingClientRect(), mx = r.left + 60 + 8 * U, my = r.top + ZEMIN_Y - 6 * U;
    let look = 0; if (imlec) { const dx = imlec.x - mx; look = dx > 60 ? 1 : dx < -60 ? -1 : 0; }
    const d = { x: 60, yOff: -(Math.floor(tt * 1.4) % 2) * 3, look, run: false, tilt: 0, armUp: false, air: false, legPhase: Math.floor(tt * 9) % 2 };
    if (mod === 'zipla') {
      const g = performance.now() / 1000 - t0;
      if (g < 1.1) { d.yOff = -Math.sin(((g % .55) / .55) * Math.PI) * 5 * U; d.air = true; }
      else if (g < 2.9) { d.armUp = true; d.tilt = Math.sin((g - 1.1) * 9) * 3.2; }
      else mod = 'bos';
    } else if (ustunde) { d.armUp = true; d.tilt = Math.sin(tt * 8) * 3.2; }
    pikselKarakter(c, d, ZEMIN_Y, U, tt);
    // göz kırpma: gözlerin üzerini gövde rengiyle kapat
    if (kare > gozKirp) { if (Math.random() < .012) gozKirp = kare + 4; }
    if (kare < gozKirp) { const cy = ZEMIN_Y - 11 * U + Math.round(d.yOff); c.fillStyle = 'rgb(217,119,87)'; c.fillRect(60 + (5 + look) * U, cy + 4 * U, U, 2 * U); c.fillRect(60 + (10 + look) * U, cy + 4 * U, U, 2 * U); }
    requestAnimationFrame(ciz);
  }
  if (AZ) requestAnimationFrame((n) => { ciz(n); durdu = true; }); else requestAnimationFrame(ciz);

  return () => { durdu = true; removeEventListener('pointermove', takip); gozlem.disconnect(); clearTimeout(balonZaman); kutu.remove(); };
}
