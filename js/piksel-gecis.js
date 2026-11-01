// Piksel görünüm: sayfa geçişi. Sade: bir bağlantıya tıklayınca ekranın üstünde ince turuncu bir çizgi soldan sağa dolar (~0,3 sn), sayfa hafif solar.
// Yeni sayfa açılırken aynı çizgi (html[data-px-gecis]::after, css/piksel.css) sağa doğru çekilip kaybolur. Hareketi azaltınca geçiş yok.
const kok = document.documentElement;
const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
let aktif = false, cizgi = null;

function git(adres) {
  if (aktif) return; aktif = true;
  cizgi = document.createElement('div'); cizgi.className = 'pxg-cizgi'; cizgi.setAttribute('aria-hidden', 'true'); document.body.append(cizgi);
  const a = cizgi.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
  document.body.animate([{ opacity: 1 }, { opacity: .35 }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
  let gitti = false;
  const sonra = () => { if (gitti) return; gitti = true; try { sessionStorage.setItem('pxGecis', '1'); } catch {} location.href = adres; };
  a.finished.then(sonra, sonra); setTimeout(sonra, 700);
  setTimeout(() => { aktif = false; cizgi?.remove(); document.body.getAnimations().forEach((x) => x.cancel()); }, 4000); // gezinme olmazsa (ör. indirme) eski hâline döner
}

// yeni sayfa çizgiyle açıldıysa: CSS çizgisi kendi kendine çekilip kalkar; burada yalnız bayrak kaldırılır
function karsila() {
  if (!kok.hasAttribute('data-px-gecis')) return;
  setTimeout(() => kok.removeAttribute('data-px-gecis'), 900);
}
if (document.body) karsila(); else addEventListener('DOMContentLoaded', karsila);

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
