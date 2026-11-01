// 404, piksel görünüm: kayıp sayfa sahnesi. Bağlantısı kopmuş bir devre yolu: solda Claude Code pikseli yolun ucunda, kopukluğun öbür yanında kayıp sayfa uçuyor.
// Gözler imleci izler; tıklayınca (ya da klavyeyle) karakter atlar, yetişemez ve bir not söyler. Tek karakter. Hareketi azaltınca durağan kare.
import { pikselKarakter } from './piksel.js';
import { kapsayici, kapsayiciTemizle } from './piksel-404-yardim.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GEN = 560, YUK = 250, U = 5, RAY_Y = 182, KOP_A = 296, KOP_B = 392, KX = 130;
const NOTLAR = ['Burada yok ki…', 'Adres yanlış yazılmış olabilir.', 'Sayfa taşınmış olabilir.', 'Aşağıdaki öneriler işe yarayabilir.', 'Ana sayfaya dönelim mi?'];

export function sahneKur() {
  const k = kapsayici(); if (!k) return undefined;
  const kutu = document.createElement('button');
  kutu.type = 'button'; kutu.className = 'px-404-sahne';
  kutu.setAttribute('aria-label', 'Kayıp sayfa sahnesi: tıkla, Claude Code pikseli kayıp sayfaya yetişmeye çalışsın');
  kutu.innerHTML = '<span class="px-404-etiket" aria-hidden="true">bağlantı · kopuk</span><canvas aria-hidden="true"></canvas><span class="px-404-balon" role="status" aria-live="polite"></span>';
  k.prepend(kutu);
  const cv = kutu.querySelector('canvas'), balon = kutu.querySelector('.px-404-balon');
  const dpr = Math.min(devicePixelRatio || 1, 2); cv.width = GEN * dpr; cv.height = YUK * dpr; const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);

  let imlec = null, ustunde = false, atla = 0, sira = 0, balonZaman, durdu = false, goruyor = true;
  const takip = (e) => { imlec = { x: e.clientX, y: e.clientY }; }; addEventListener('pointermove', takip);
  for (const [o, f] of [['pointerenter', true], ['pointerleave', false], ['focus', true], ['blur', false]]) kutu.addEventListener(o, () => { ustunde = f; });
  kutu.addEventListener('click', () => {
    atla = performance.now() / 1000; balon.textContent = NOTLAR[sira++ % NOTLAR.length]; balon.classList.add('goster');
    clearTimeout(balonZaman); balonZaman = setTimeout(() => balon.classList.remove('goster'), 3600);
  });
  const gozlem = new IntersectionObserver(([e]) => { goruyor = e.isIntersecting; }, { threshold: 0 }); gozlem.observe(kutu);

  const sayfa = (x, y, t) => {                                     // kayıp sayfa: katlanmış köşeli belge, üstünde "?"
    c.fillStyle = '#f4efe8'; c.fillRect(x, y, 56, 70); c.fillStyle = '#c4b8ad'; c.fillRect(x + 40, y, 16, 16); c.fillStyle = '#201e1c'; c.fillRect(x + 40, y, 4, 16); c.fillRect(x + 40, y + 12, 16, 4);
    c.fillStyle = '#8b7f75'; for (let i = 0; i < 3; i++) c.fillRect(x + 8, y + 22 + i * 8, 30 - (i % 2) * 8, 3);
    c.fillStyle = '#d97757'; c.font = '700 24px "Chakra Petch", sans-serif'; c.textAlign = 'center'; c.fillText('?', x + 28, y + 64); c.textAlign = 'left';
    if (Math.floor(t * 2) % 2) { c.fillStyle = '#4a3128'; c.fillRect(x - 8, y + 70, 4, 4); c.fillRect(x + 62, y + 12, 4, 4); }   // küçük titreşim pikselleri
  };

  function ciz(now) {
    if (durdu) return;
    if (!goruyor || document.hidden) { requestAnimationFrame(ciz); return; }
    if (now - (ciz.son ?? 0) < 33) { requestAnimationFrame(ciz); return; }
    ciz.son = now; const t = now / 1000;
    c.clearRect(0, 0, GEN, YUK);
    c.fillStyle = '#262321'; for (let y = 20; y < YUK; y += 26) for (let x = 14; x < GEN; x += 26) c.fillRect(x, y, 2, 2);
    // devre yolu: solda canlı (turuncu), kopukluk, sağda sönük
    c.fillStyle = '#7a4a38'; c.fillRect(0, RAY_Y, KOP_A, 6); c.fillStyle = '#3a2d27'; c.fillRect(KOP_B, RAY_Y, GEN - KOP_B, 6);
    c.fillStyle = '#4a3128'; c.fillRect(0, RAY_Y + 14, KOP_A - 40, 4); c.fillRect(KOP_B + 40, RAY_Y + 14, GEN - KOP_B - 40, 4);
    for (const x of [KOP_A, KOP_B]) { c.fillStyle = '#191817'; c.fillRect(x - 9, RAY_Y - 6, 18, 18); c.strokeStyle = x === KOP_A ? '#d97757' : '#5b4337'; c.lineWidth = 3; c.strokeRect(x - 7.5, RAY_Y - 4.5, 15, 15); }
    if (!AZ && Math.floor(t * 6) % 3 !== 0) { c.fillStyle = ['#f09a78', '#d97757', '#fff4cf'][Math.floor(t * 9) % 3]; for (let i = 0; i < 4; i++) c.fillRect(KOP_A + 10 + ((i * 17 + Math.floor(t * 10) * 7) % 36), RAY_Y - 10 + ((i * 13) % 20), 4, 4); } // kopuk uçtan kıvılcımlar
    // kayıp sayfa uçar
    sayfa(Math.round(446 + (AZ ? 0 : Math.sin(t * .7) * 10)), Math.round(54 + (AZ ? 0 : Math.sin(t * 1.4) * 6)), t);
    // karakter
    const r = kutu.getBoundingClientRect(), mx = r.left + (KX + 8 * U) * (r.width / GEN);
    let look = 1; if (imlec) { const dx = imlec.x - mx; look = dx > 50 ? 1 : dx < -50 ? -1 : 0; }
    const d = { x: KX, yOff: -(Math.floor(t * 1.4) % 2) * 3, look, run: false, tilt: 0, armUp: ustunde, air: false, legPhase: Math.floor(t * 9) % 2 };
    if (ustunde) d.tilt = Math.sin(t * 8) * 3.2;
    if (atla) {
      const g = now / 1000 - atla, p = g / 1.1;
      if (p < 1) { d.x = KX + Math.sin(p * Math.PI * .5) * 110 * (p < .55 ? 1 : 1 - (p - .55) * 1.6); d.yOff = -Math.sin(p * Math.PI) * 6 * U; d.air = true; }
      else atla = 0;
    }
    pikselKarakter(c, d, RAY_Y - 3, U, t);
    requestAnimationFrame(ciz);
  }
  if (AZ) requestAnimationFrame((n) => { ciz(n); durdu = true; }); else requestAnimationFrame(ciz);
  return () => { durdu = true; removeEventListener('pointermove', takip); gozlem.disconnect(); clearTimeout(balonZaman); kutu.remove(); kapsayiciTemizle(); };
}
