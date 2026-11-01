// Piksel görünüm: sayfa geçişi. Bir bağlantıya tıklayınca turuncu perde yukarıdan iner (ucuna asılı Claude pikseli çeker),
// yeni sayfa perdeli açılır ve perde kalkar (kalkış CSS'te: html[data-px-gecis], css/piksel.css). Hareketi azaltınca geçiş yok.
import { asiliKarakter, ASILI_GENISLIK, ASILI_YUKSEKLIK } from './piksel-karakter.js';

const kok = document.documentElement;
const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
let perde = null, aktif = false;

function perdeKur() {
  perde = document.createElement('div');
  perde.className = 'pxg'; perde.setAttribute('aria-hidden', 'true');
  const kar = document.createElement('canvas'); kar.width = ASILI_GENISLIK; kar.height = ASILI_YUKSEKLIK; kar.className = 'pxg-kar';
  perde.append(kar); document.body.append(perde);
  return kar.getContext('2d');
}

function git(adres) {
  if (aktif) return; aktif = true;
  const c = perdeKur(); const bas = performance.now();
  const sal = setInterval(() => asiliKarakter(c, (performance.now() - bas) / 1000), 90); asiliKarakter(c, 0);
  perde.getBoundingClientRect();               // başlangıç konumu işlensin
  perde.classList.add('in');
  setTimeout(() => { try { sessionStorage.setItem('pxGecis', '1'); } catch {} clearInterval(sal); location.href = adres; }, 820);
  setTimeout(() => { aktif = false; perde?.remove(); }, 4000); // gezinme olmazsa (ör. indirme) perde kalkar
}

document.addEventListener('click', (e) => {
  if (AZ || kok.dataset.gorunum !== 'piksel' || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.composedPath().find((n) => n instanceof HTMLAnchorElement && n.href);
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const u = new URL(a.href, location.href);
  if (!/^https?:$/.test(u.protocol) || u.origin !== location.origin) return;
  if (u.pathname === location.pathname && u.search === location.search) return; // sayfa içi bağlantı
  e.preventDefault();
  git(u.href);
});
addEventListener('pageshow', (e) => { if (e.persisted) { aktif = false; document.querySelectorAll('.pxg').forEach((p) => p.remove()); } });
