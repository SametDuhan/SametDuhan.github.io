// İletişim sayfasının başında "postacı" sahnesi: Claude Code pikseli ve posta kutusu. Tıklayınca bir mektup kutuya uçar, kutunun bayrağı kalkar ve
// sayfadaki gerçek bilgilerden biri söylenir (staj durumu, dönüş süresi, saat dilimi, çalışma şekli; hepsi sayfanın kendi metninden okunur).
// Altta Türkiye'de şu an saat kaç (Europe/Istanbul, GMT+3) ve senin saatinle farkı. Hiçbir şey gönderilmez: mektup yalnız bir oyundur, gerçek mesaj formdadır.
import { pikselKarakter } from './piksel.js';
import { t, EN } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GEN = 320, YUK = 206, U = 6, ZEMIN_Y = 172, KX = 22;
const KUTU = { x: 236, y: ZEMIN_Y - 112, w: 56, h: 34 };

function saatYazisi() {
  const tr = new Intl.DateTimeFormat(EN ? 'en-GB' : 'tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  const fark = (180 - (-new Date().getTimezoneOffset())) / 60;
  const yakin = fark === 0 ? t('senin saatinle aynı', 'same time as yours') : t(`senden ${fark > 0 ? '+' : ''}${fark} saat`, `${fark > 0 ? '+' : ''}${fark} h from you`);
  return { tr, yakin };
}

export function sahneKur() {
  const baslik = document.querySelector('.sayfa-basi');
  if (!baslik || innerWidth < 1150) return undefined;
  // sayfanın kendi bilgileri: tanıtımdaki kalın cümle ve bilgi maddeleri
  const bilgiler = [document.querySelector('.sayfa-basi .tanitim strong')?.textContent.trim(), ...[...document.querySelectorAll('.iletisim-bilgi li')].map((li) => li.textContent.trim())].filter(Boolean);
  if (!bilgiler.length) return undefined;

  const kutu = document.createElement('button');
  kutu.type = 'button'; kutu.className = 'px-posta';
  kutu.setAttribute('aria-label', t('Claude Code pikseli: tıkla, posta kutusuna bir mektup bıraksın', 'Claude Code pixel: click and it drops a letter into the mailbox'));
  kutu.innerHTML = `<span class="px-posta-etiket" aria-hidden="true">posta · ${t('canlı', 'live')}</span><canvas aria-hidden="true"></canvas><span class="px-posta-balon" role="status" aria-live="polite"></span><span class="px-posta-saat" aria-hidden="true"></span>`;
  baslik.append(kutu);
  const cv = kutu.querySelector('canvas'), balon = kutu.querySelector('.px-posta-balon'), saatEl = kutu.querySelector('.px-posta-saat');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = GEN * dpr; cv.height = YUK * dpr; const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);

  const saatGuncelle = () => { const s = saatYazisi(); saatEl.innerHTML = `<b>${s.tr}</b> ${t('Türkiye', 'Turkey')} · GMT+3 · ${s.yakin}`; };
  saatGuncelle(); const saatZaman = setInterval(saatGuncelle, 20000);

  let imlec = null, ustunde = false, sira = 0, mektup = null, bayrakAcik = 0, balonZaman, durdu = false, goruyor = true, kare = 0, gozKirp = 0;
  const takip = (e) => { imlec = { x: e.clientX, y: e.clientY }; };
  addEventListener('pointermove', takip);
  for (const [o, f] of [['pointerenter', true], ['pointerleave', false], ['focus', true], ['blur', false]]) kutu.addEventListener(o, () => { ustunde = f; });
  kutu.addEventListener('click', () => {
    mektup = { t0: performance.now() / 1000 };
    balon.textContent = bilgiler[sira++ % bilgiler.length];
    clearTimeout(balonZaman);
    setTimeout(() => { balon.classList.add('goster'); bayrakAcik = performance.now() / 1000; }, AZ ? 0 : 900);
    balonZaman = setTimeout(() => { balon.classList.remove('goster'); bayrakAcik = 0; }, 4800);
  });
  const gozlem = new IntersectionObserver(([e]) => { goruyor = e.isIntersecting; }, { threshold: 0 }); gozlem.observe(kutu);

  const posta = (tt) => {
    // direk ve kutu
    c.fillStyle = '#5a4a42'; c.fillRect(KUTU.x + KUTU.w / 2 - 5, KUTU.y + KUTU.h, 10, ZEMIN_Y + 6 - KUTU.y - KUTU.h);
    c.fillStyle = '#4a6a9a'; c.fillRect(KUTU.x, KUTU.y, KUTU.w, KUTU.h);
    c.fillStyle = '#8db1e3'; c.fillRect(KUTU.x, KUTU.y, KUTU.w, 8); c.fillStyle = '#35507a'; c.fillRect(KUTU.x, KUTU.y + KUTU.h - 6, KUTU.w, 6);
    c.fillStyle = '#161514'; c.fillRect(KUTU.x + 10, KUTU.y + 16, KUTU.w - 20, 6);               // mektup yuvası
    // bayrak: kalkınca yeşil, inikken kutuya yaslı
    const yukari = Boolean(bayrakAcik);
    c.fillStyle = '#d0d0d0'; c.fillRect(KUTU.x + KUTU.w + 2, KUTU.y + (yukari ? -22 : 6), 4, yukari ? 34 : 16);
    c.fillStyle = '#2ecc40'; c.fillRect(KUTU.x + KUTU.w + 6, KUTU.y + (yukari ? -22 : 6), 18, 12);
  };
  const zarf = (x, y) => { c.fillStyle = '#f4efe8'; c.fillRect(x, y, 26, 17); c.fillStyle = '#c4b8ad'; c.fillRect(x, y + 15, 26, 2); c.strokeStyle = '#8b7f75'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 1, y + 1); c.lineTo(x + 13, y + 10); c.lineTo(x + 25, y + 1); c.stroke(); c.fillStyle = '#d97757'; c.fillRect(x + 11, y + 8, 4, 4); };

  function ciz(now) {
    if (durdu) return;
    if (!goruyor || document.hidden) { requestAnimationFrame(ciz); return; }
    if (now - (ciz.son ?? 0) < 33) { requestAnimationFrame(ciz); return; }
    ciz.son = now; kare++;
    const tt = now / 1000;
    c.clearRect(0, 0, GEN, YUK);
    c.fillStyle = '#262321'; for (let y = 24; y < ZEMIN_Y - 8; y += 26) for (let x = 14; x < GEN; x += 28) c.fillRect(x, y, 2, 2);
    c.fillStyle = '#7a4a38'; c.fillRect(0, ZEMIN_Y + 8, GEN, 6); c.fillStyle = '#4a3128'; c.fillRect(0, ZEMIN_Y + 20, GEN, 4);
    posta(tt);
    const r = kutu.getBoundingClientRect(), mx = r.left + KX + 8 * U;
    let look = 1; if (imlec) { const dx = imlec.x - mx; look = dx > 60 ? 1 : dx < -60 ? -1 : 0; }
    const d = { x: KX, yOff: -(Math.floor(tt * 1.4) % 2) * 3, look, run: false, tilt: 0, armUp: ustunde, air: false, legPhase: Math.floor(tt * 9) % 2 };
    if (ustunde) d.tilt = Math.sin(tt * 8) * 3.2;
    // mektup uçuşu: elden kutu yuvasına yay çizerek
    if (mektup) {
      const g = performance.now() / 1000 - mektup.t0, p = AZ ? 1 : Math.min(1, g / .9);
      const bx = KX + 14 * U, by = ZEMIN_Y - 9 * U, ex = KUTU.x + 17, ey = KUTU.y + 12;
      const x = bx + (ex - bx) * p, y = by + (ey - by) * p - Math.sin(p * Math.PI) * 44;
      if (p < 1) { d.armUp = true; d.tilt = Math.sin(g * 9) * 3.2; zarf(x, y); } else if (g > 1.0 || AZ) mektup = null;
    }
    pikselKarakter(c, d, ZEMIN_Y, U, tt);
    if (kare > gozKirp) { if (Math.random() < .012) gozKirp = kare + 4; }
    if (kare < gozKirp) { const cy = ZEMIN_Y - 11 * U + Math.round(d.yOff); c.fillStyle = 'rgb(217,119,87)'; c.fillRect(KX + (5 + look) * U, cy + 4 * U, U, 2 * U); c.fillRect(KX + (10 + look) * U, cy + 4 * U, U, 2 * U); }
    requestAnimationFrame(ciz);
  }
  if (AZ) requestAnimationFrame((n) => { ciz(n); durdu = true; }); else requestAnimationFrame(ciz);

  return () => { durdu = true; removeEventListener('pointermove', takip); gozlem.disconnect(); clearInterval(saatZaman); clearTimeout(balonZaman); kutu.remove(); };
}
