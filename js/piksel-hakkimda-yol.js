// Hakkımda "Rota" bölümü, piksel görünümde tıklanabilir yol haritası: Claude Code pikseli duraklar arasında koşar, seçilen duraktan
// sayfanın kendi rota içeriği (tarih, başlık, metin, bağlantı) bir terminal kutusunda yazılır. İçerik .rota listesinden okunur (tek kaynak);
// liste yerinde kalır (JS yoksa ya da başka görünümde olduğu gibi görünür). Dar ekranda kurulmaz.
import { pikselKarakter } from './piksel.js';
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const U = 3, ZEMIN = 62, KAR_GEN = 84, KAR_YUK = 72, SURE = 850;
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

export function yolKur() {
  const rota = document.querySelector('.rota');
  if (!rota || innerWidth < 760) return undefined;
  const bolum = rota.closest('.bolum');
  const ogeler = [...rota.querySelectorAll('li')].map((li) => ({
    tarih: li.querySelector('time').textContent.trim(), baslik: li.querySelector('b').textContent.trim(), metin: li.querySelector('span').textContent.trim(),
    href: li.querySelector('b a')?.getAttribute('href') ?? null, vurgu: li.classList.contains('vurgu'),
  }));
  if (!ogeler.length) return undefined;
  const vurguSira = Math.max(0, ogeler.findIndex((o) => o.vurgu));

  const kap = document.createElement('div');
  kap.className = 'px-yol';
  kap.innerHTML = `<div class="px-yol-hat"><canvas class="px-yol-kar" width="${KAR_GEN}" height="${KAR_YUK}" aria-hidden="true"></canvas>
    <ol class="px-yol-dugumler" style="--n:${ogeler.length};--p:0" aria-label="${t('Rota: bir durağı seç', 'Route: pick a stop')}"><span class="px-yol-cizgi" aria-hidden="true"><i></i></span>
    ${ogeler.map((o, i) => `<li><button type="button" data-i="${i}" aria-label="${o.tarih}: ${o.baslik}"><span class="px-dugum" aria-hidden="true"></span><time>${o.tarih}</time></button></li>`).join('')}</ol></div>
    <div class="px-yol-detay" role="region" aria-live="polite" aria-label="${t('Seçilen durak', 'Selected stop')}"></div>`;
  bolum.querySelector('.bolum-baslik').after(kap);
  bolum.classList.add('px-yol-var');
  const ol = kap.querySelector('ol'), dugmeler = [...kap.querySelectorAll('button')], kar = kap.querySelector('canvas'), hat = kap.querySelector('.px-yol-hat'), detay = kap.querySelector('.px-yol-detay');
  const c = kar.getContext('2d');

  /* ---- karakter ---- */
  let sira = 0, hareketli = false, yon = 1, vardi = 0, kapali = false, yazZaman;
  const x = (i) => { const r = dugmeler[i].getBoundingClientRect(), h = hat.getBoundingClientRect(); return r.left - h.left + r.width / 2 - 8 * U; };
  const cizKar = () => {
    if (document.hidden) return;
    const tt = performance.now() / 1000, g = (performance.now() - vardi) / 1000;
    const d = { x: 0, yOff: 0, look: yon, run: hareketli, tilt: 0, armUp: false, air: false, legPhase: Math.floor(tt * 9) % 2 };
    if (hareketli) d.yOff = -Math.abs(Math.sin(tt * 9 * Math.PI)) * 1.2 * U;
    else if (g < 1.3) { d.armUp = true; d.tilt = Math.sin(g * 9) * 3.2; }
    else d.yOff = -(Math.floor(tt * 1.4) % 2) * 2;
    c.clearRect(0, 0, KAR_GEN, KAR_YUK);
    pikselKarakter(c, d, ZEMIN, U, tt);
  };
  const sal = setInterval(cizKar, 90);

  /* ---- ayrıntı kutusu ---- */
  function goster(i) {
    const o = ogeler[i]; clearInterval(yazZaman);
    detay.innerHTML = `<p class="px-detay-komut"><span class="istem">$</span> git show <b>${slug(o.tarih)}</b></p><p class="px-detay-tarih"><time></time></p><h3></h3><p class="px-detay-metin"></p>${o.href ? `<a class="px-detay-link" href="${o.href}">${t('ilgili sayfa', 'related page')} →</a>` : ''}`;
    detay.querySelector('time').textContent = o.tarih; detay.querySelector('h3').textContent = o.baslik;
    const m = detay.querySelector('.px-detay-metin');
    if (AZ) { m.textContent = o.metin; return; }
    let k = 0; yazZaman = setInterval(() => { m.textContent = o.metin.slice(0, ++k); if (k >= o.metin.length) clearInterval(yazZaman); }, 16);
  }

  async function sec(i, { git = true } = {}) {
    if (i < 0 || i >= ogeler.length || kapali) return;
    const once = sira; sira = i;
    dugmeler.forEach((b, n) => { b.toggleAttribute('data-gecti', n < i); b.setAttribute('aria-current', n === i ? 'step' : 'false'); b.classList.toggle('secili', n === i); });
    ol.style.setProperty('--p', ogeler.length > 1 ? (i / (ogeler.length - 1)).toFixed(3) : 0);
    goster(i);
    yon = i >= once ? 1 : -1;
    const hedef = x(i);
    if (!git || AZ) { kar.style.transition = 'none'; kar.style.left = hedef + 'px'; vardi = performance.now(); cizKar(); return; }
    kar.style.transition = ''; kar.style.left = hedef + 'px'; hareketli = true;
    await bekle(SURE);
    if (kapali || sira !== i) return;
    hareketli = false; vardi = performance.now(); cizKar();
  }

  dugmeler.forEach((b, i) => b.addEventListener('click', () => sec(i)));
  ol.addEventListener('keydown', (e) => {
    const i = dugmeler.indexOf(document.activeElement); if (i < 0) return;
    const hedef = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? ogeler.length - 1 : null;
    if (hedef === null || hedef < 0 || hedef >= ogeler.length) return;
    e.preventDefault(); dugmeler[hedef].focus(); sec(hedef);
  });

  // başlangıç: ilk durak; bölüm görününce karakter durakları tek tek geçip vurgulu durağa (AI öğrenmeye başladım) varır
  kar.style.transition = 'none'; sec(0, { git: false });
  let basladi = false;
  const gozlem = new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting || basladi) return; basladi = true; gozlem.disconnect();
    if (AZ) { sec(vurguSira, { git: false }); return; }
    for (let i = 1; i <= vurguSira; i++) { await sec(i); if (kapali) return; await bekle(380); }
  }, { threshold: .55 });
  gozlem.observe(kap);
  addEventListener('resize', yerlestir);
  function yerlestir() { kar.style.transition = 'none'; kar.style.left = x(sira) + 'px'; }

  return () => { kapali = true; clearInterval(sal); clearInterval(yazZaman); gozlem.disconnect(); removeEventListener('resize', yerlestir); bolum.classList.remove('px-yol-var'); kap.remove(); };
}
