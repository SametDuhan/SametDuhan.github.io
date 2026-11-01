// Proje detay, piksel görünüm: ekran görüntüsü / kare bölümü. (1) SkyTrack: numaralı noktalar pikselli kareler olur; seçili noktaya nişan çizgileri (yatay ve dikey kesikli çizgi) çizilir;
// alttaki açıklama kartları odaklanabilir (Enter/Boşluk), bölüm görünürken 1-4 tuşları noktayı seçer. Hepsi sayfanın kendi düğmelerine tıklanarak yapılır
// (js/proje.js'in kendi yolu: tıklayınca otomatik gezinti durur). (2) Piksel projelerinde: animasyon karelerinin zaman şeridi ve "kare n / N" göstergesi (yalnız gösterir).
// Karakter yok; hareketi azaltınca nişan çizgisi geçişsiz.
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (etiket, sinif) => Object.assign(document.createElement(etiket), { className: sinif });

export function ekranKur() {
  const geri = [];
  const sahne = document.querySelector('[data-pinler]');
  if (sahne) {
    const pinler = [...sahne.querySelectorAll('.pin')], liste = [...sahne.parentElement.querySelectorAll('.pin-liste li')];
    const yatay = el('i', 'px-hedef px-hedef-yatay'), dikey = el('i', 'px-hedef px-hedef-dikey');
    yatay.setAttribute('aria-hidden', 'true'); dikey.setAttribute('aria-hidden', 'true'); sahne.append(yatay, dikey);
    const guncelle = () => {
      const p = pinler.find((x) => x.hasAttribute('aria-current')); if (!p) return;
      dikey.style.left = `${parseFloat(p.style.getPropertyValue('--x')) * 100}%`; yatay.style.top = `${parseFloat(p.style.getPropertyValue('--y')) * 100}%`;
    };
    const mo = new MutationObserver(guncelle); mo.observe(sahne, { attributes: true, attributeFilter: ['aria-current'], subtree: true }); guncelle();
    const dinle = [];
    liste.forEach((li, i) => {
      li.tabIndex = 0; li.setAttribute('role', 'button');
      const tus = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); li.click(); } };
      li.addEventListener('keydown', tus); dinle.push([li, tus]);
    });
    let gorunur = false;
    const io = new IntersectionObserver(([e]) => { gorunur = e.isIntersecting; }, { threshold: .3 }); io.observe(sahne);
    const tus = (e) => {
      if (!gorunur || document.documentElement.dataset.gorunum !== 'piksel' || e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      if (e.key >= '1' && e.key <= '9' && pinler[+e.key - 1]) pinler[+e.key - 1].click();
    };
    addEventListener('keydown', tus);
    const ipucu = el('p', 'px-pin-ipucu'); ipucu.setAttribute('aria-hidden', 'true'); ipucu.innerHTML = `<kbd>1</kbd>–<kbd>${pinler.length}</kbd> ${t('noktayı seç', 'pick a point')}`; sahne.after(ipucu);
    geri.push(() => { mo.disconnect(); io.disconnect(); removeEventListener('keydown', tus); dinle.forEach(([li, f]) => { li.removeEventListener('keydown', f); li.removeAttribute('tabindex'); li.removeAttribute('role'); }); yatay.remove(); dikey.remove(); ipucu.remove(); });
  }

  const kutu = document.querySelector('[data-hucre]');
  if (kutu) {
    const [c, r] = kutu.dataset.hucre.split('x').map(Number), n = c * r;
    const serit = el('div', 'px-zaman'); serit.setAttribute('aria-hidden', 'true');
    serit.innerHTML = `<span class="px-zaman-yazi"></span><span class="px-zaman-kareler">${Array.from({ length: n }, () => '<i></i>').join('')}</span>`;
    kutu.after(serit);
    const kareler = [...serit.querySelectorAll('i')], yazi = serit.querySelector('.px-zaman-yazi');
    const guncelle = () => { const i = (parseInt(kutu.style.getPropertyValue('--ri'), 10) || 0) * c + (parseInt(kutu.style.getPropertyValue('--ci'), 10) || 0); kareler.forEach((k, j) => k.classList.toggle('simdi', j === i)); yazi.textContent = t(`kare ${i + 1} / ${n}`, `frame ${i + 1} / ${n}`); };
    const mo = new MutationObserver(guncelle); mo.observe(kutu, { attributes: true, attributeFilter: ['style'] }); guncelle();
    geri.push(() => { mo.disconnect(); serit.remove(); });
  }
  return geri.length ? () => geri.forEach((f) => f()) : undefined;
}
