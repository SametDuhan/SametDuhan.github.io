// Görünüm seçici (araclar/gorunum-secici.mjs): Kâğıt ↔ Modern ve modern temada koyu/açık.
// Başlangıç değerlerini js/gorunum-erken.js koyar; burada tıklamalar, kayıt ve aria-pressed.
const kok = document.documentElement;
const koyuSorgu = matchMedia('(prefers-color-scheme: dark)');
const sakla = (ad, deger) => { try { localStorage.setItem(ad, deger); } catch {} };
export const koyuMu = () => (kok.dataset.tema ? kok.dataset.tema === 'koyu' : koyuSorgu.matches);

function isaretle() {
  for (const b of document.querySelectorAll('[data-gorunum-sec]')) b.setAttribute('aria-pressed', String(b.dataset.gorunumSec === kok.dataset.gorunum));
  for (const b of document.querySelectorAll('[data-tema-dugme]')) b.setAttribute('aria-pressed', String(koyuMu()));
}

// İki görünüm arasında yumuşak geçiş (destekleyen tarayıcıda); hareketi azaltınca anında.
const gec = (degistir) => {
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(degistir);
  else degistir();
};

export function baslatGorunum() {
  document.addEventListener('click', (e) => {
    const secim = e.target.closest('[data-gorunum-sec]');
    if (secim && secim.dataset.gorunumSec !== kok.dataset.gorunum) {
      const yeni = secim.dataset.gorunumSec;
      sakla('gorunum', yeni);
      gec(() => { kok.dataset.gorunum = yeni; isaretle(); });
    }
    const panel = e.target.closest('[data-panel]');
    if (panel) {
      const gizle = panel.dataset.panel === 'gizle';
      sakla('gorunumPanel', gizle ? 'kapali' : 'acik');
      if (gizle) kok.dataset.gorunumPanel = 'kapali'; else delete kok.dataset.gorunumPanel;
      // odak kaybolmasın: kapatınca açma düğmesine, açınca kapatma düğmesine geçer
      document.querySelector(`[data-panel="${gizle ? 'goster' : 'gizle'}"]`)?.focus();
    }
    if (e.target.closest('[data-tema-dugme]')) {
      const yeni = koyuMu() ? 'acik' : 'koyu';
      sakla('tema', yeni);
      gec(() => { kok.dataset.tema = yeni; isaretle(); });
    }
  });
  koyuSorgu.addEventListener('change', isaretle);
  isaretle();
}
