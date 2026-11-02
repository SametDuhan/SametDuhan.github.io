// Hakkımda, piksel görünüm: araçlar envanter yuvası gibi tıklanınca "kuşanılır"
// (turuncu dolar, piksel parıltı, alttaki sayaç değişir). Yalnız etkileşim ve görünüm; metinlerin hepsi sayfanın kendisinden gelir.
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function detayKur() {
  const temizle = [];
  // araçlar: yuvaya tıkla → kuşan
  const yuvalar = [...document.querySelectorAll('.aletler li')];
  if (yuvalar.length) {
    const sayac = document.createElement('p'); sayac.className = 'px-envanter-sayac'; sayac.setAttribute('aria-live', 'polite');
    const kapsayici = document.querySelector('.alet-gruplari'); kapsayici.after(sayac);
    const guncelle = () => { const n = yuvalar.filter((y) => y.classList.contains('px-kusanildi')).length; sayac.textContent = n ? t(`${n} / ${yuvalar.length} araç kuşanıldı`, `${n} / ${yuvalar.length} tools equipped`) : t('bir yuvaya tıkla: kuşan', 'click a slot to equip'); };
    guncelle();
    const tikla = (y) => () => { y.classList.toggle('px-kusanildi'); y.setAttribute('aria-pressed', y.classList.contains('px-kusanildi')); if (!AZ) { y.classList.remove('px-pop'); void y.offsetWidth; y.classList.add('px-pop'); } guncelle(); };
    const anahtar = (y) => (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); y.click(); } };
    yuvalar.forEach((y) => { const k = tikla(y), a = anahtar(y); y.tabIndex = 0; y.setAttribute('role', 'button'); y.setAttribute('aria-pressed', 'false'); y.addEventListener('click', k); y.addEventListener('keydown', a); y._px = [k, a]; });
    temizle.push(() => { sayac.remove(); yuvalar.forEach((y) => { y.removeEventListener('click', y._px[0]); y.removeEventListener('keydown', y._px[1]); y.removeAttribute('tabindex'); y.removeAttribute('role'); y.removeAttribute('aria-pressed'); y.classList.remove('px-kusanildi', 'px-pop'); }); });
  }
  return () => temizle.forEach((f) => f());
}
