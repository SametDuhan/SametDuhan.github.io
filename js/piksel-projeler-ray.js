// Projeler, piksel görünüm: kenarda ilerleme rayı. Sayfa kaydıkça Claude Code pikseli rayda aşağı kayar; her proje bir durak
// (tıklayınca oraya kayar), karakter bir durağın yanına gelince bayrak sallar. Konumlar sayfadaki projelerin gerçek yerlerinden hesaplanır.
import { pikselKarakter } from './piksel.js';
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const U = 2, KG = 48, KY = 40;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function rayKur() {
  const liste = document.querySelector('.vitrinler'), menu = document.querySelector('.yan-menu');
  const maddeler = liste ? [...liste.querySelectorAll('.vitrin')] : [];
  if (!maddeler.length || innerWidth < 1000) return undefined;

  const ray = document.createElement('nav');
  ray.className = 'px-ray'; ray.setAttribute('aria-label', t('Projeler arasında gezin', 'Move between projects'));
  ray.innerHTML = `<span class="px-ray-cizgi" aria-hidden="true"><i></i></span><canvas class="px-ray-kar" width="${KG}" height="${KY}" aria-hidden="true"></canvas>
    <ol>${maddeler.map((m, i) => `<li><button type="button" data-i="${i}" aria-label="${m.dataset.ad ?? m.id}"><span class="px-durak" aria-hidden="true"></span><span class="px-durak-ad" aria-hidden="true">${m.dataset.ad ?? m.id}</span></button></li>`).join('')}</ol>`;
  document.body.append(ray);
  const c = ray.querySelector('canvas').getContext('2d'), dolgu = ray.querySelector('.px-ray-cizgi i');
  const dugmeler = [...ray.querySelectorAll('button')], lis = [...ray.querySelectorAll('li')];

  let yerlesim = { sol: 0, ust: 0, yuk: 0 }, oran = [], hedefY = 0, y = 0, hareketli = false, kapali = false, p = 0;
  function olc() {
    const m = menu ? menu.getBoundingClientRect().right : 0, l = liste.getBoundingClientRect().left;
    yerlesim = { sol: m + (l - m) / 2, ust: innerHeight * .16, yuk: innerHeight * .68 };
    ray.style.left = yerlesim.sol + 'px'; ray.style.top = yerlesim.ust + 'px'; ray.style.height = yerlesim.yuk + 'px';
    const lr = liste.getBoundingClientRect();
    oran = maddeler.map((e) => { const r = e.getBoundingClientRect(); return clamp(((r.top + r.height / 2) - lr.top) / lr.height, 0, 1); });
    lis.forEach((li, i) => { li.style.top = (oran[i] * 100) + '%'; });
  }
  function kaydir() {
    const lr = liste.getBoundingClientRect(), vh = innerHeight;
    p = clamp((vh * .45 - lr.top) / lr.height, 0, 1);
    hedefY = p * yerlesim.yuk;
    const gorunur = lr.top < vh * .7 && lr.bottom > vh * .3;
    ray.classList.toggle('acik', gorunur);
    let yakin = 0, fark = 9; oran.forEach((o, i) => { const f = Math.abs(o - p); if (f < fark) { fark = f; yakin = i; } });
    dugmeler.forEach((b, i) => { b.toggleAttribute('data-aktif', i === yakin); b.setAttribute('aria-current', i === yakin ? 'true' : 'false'); });
    dolgu.style.height = p * 100 + '%';
    ray._yakin = fark < .045;
  }

  function ciz() {
    if (kapali) return;
    const onceki = y; y += (hedefY - y) * (AZ ? 1 : .16); hareketli = Math.abs(hedefY - y) > .6;
    ray.querySelector('canvas').style.transform = `translate(-50%, ${Math.round(y - KY + 4)}px)`;
    const tt = performance.now() / 1000;
    const d = { x: 0, yOff: 0, look: 1, run: hareketli, tilt: 0, armUp: !hareketli && ray._yakin, air: false, legPhase: Math.floor(tt * 9) % 2 };
    if (d.armUp) d.tilt = Math.sin(tt * 8) * 3.2;
    c.clearRect(0, 0, KG, KY); pikselKarakter(c, d, KY - 4, U, tt);
    requestAnimationFrame(ciz);
  }

  dugmeler.forEach((b, i) => b.addEventListener('click', () => maddeler[i].scrollIntoView({ behavior: AZ ? 'auto' : 'smooth', block: 'center' })));
  const guncelle = () => { olc(); kaydir(); };
  addEventListener('scroll', kaydir, { passive: true, capture: true });
  addEventListener('resize', guncelle);
  const ro = new ResizeObserver(guncelle); ro.observe(liste);
  document.fonts?.ready.then(guncelle);
  guncelle(); y = hedefY;
  requestAnimationFrame(ciz);
  return () => { kapali = true; removeEventListener('scroll', kaydir, { capture: true }); removeEventListener('resize', guncelle); ro.disconnect(); ray.remove(); };
}
