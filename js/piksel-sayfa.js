// Piksel görünüm: alt sayfaların başında ince devre yolu ve üzerinde koşan tek Claude Code karakteri (zıplar, bayrak sallar, çıkar).
// Yalnız piksel görünümde ve .sayfa-basi olan sayfalarda; görünüm değişince kaldırılır. Animasyon js/piksel.js'in (claude-done-pixel) birebir aktarımı.
import { kareDurumu, pikselKarakter } from './piksel.js';

const kok = document.documentElement;
const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DONGU = 13, ANIM = 5.8; // sn: her 13 saniyede bir tur
let kutu = null, kanvas = null, ctx = null, calisiyor = false;

function kur() {
  const baslik = document.querySelector('.sayfa-basi');
  if (!baslik || kutu) return;
  kutu = document.createElement('div'); kutu.className = 'px-devre'; kutu.setAttribute('aria-hidden', 'true');
  kanvas = document.createElement('canvas'); kutu.append(kanvas);
  baslik.before(kutu); ctx = kanvas.getContext('2d');
  olc(); if (!calisiyor) { calisiyor = true; requestAnimationFrame(ciz); }
}
function kaldir() { kutu?.remove(); kutu = kanvas = ctx = null; }
function olc() { if (!kanvas) return; kanvas.width = kutu.clientWidth; kanvas.height = kutu.clientHeight; }
function kare(tt) {
  ctx.clearRect(0, 0, kanvas.width, kanvas.height);
  const u = 3, zemin = kanvas.height - 8;
  pikselKarakter(ctx, kareDurumu(tt, kanvas.width, u), zemin, u, tt);
}
let son = 0;
function ciz(now) {
  if (!kutu || kok.dataset.gorunum !== 'piksel') { calisiyor = false; return; }
  if (now - son > 33 && !document.hidden) {
    son = now;
    const tt = (now / 1000) % DONGU;
    if (AZ) kare(3.1); else if (tt < ANIM) kare(tt); else ctx.clearRect(0, 0, kanvas.width, kanvas.height);
  }
  requestAnimationFrame(ciz);
}
function guncelle() { if (kok.dataset.gorunum === 'piksel') kur(); else kaldir(); }

new MutationObserver(guncelle).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
addEventListener('resize', olc);
guncelle();
