// Hakkımda, piksel görünüm: bölüm başlıkları ekrana girince karışık harflerden çözülür; araçlar envanter yuvası gibi tıklanınca "kuşanılır"
// (turuncu dolar, piksel parıltı, alttaki sayaç değişir). Yalnız etkileşim ve görünüm; metinlerin hepsi sayfanın kendisinden gelir.
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HARF = 'ABCDEFGHIJKLMNOPRSTUVYZ0123456789<>/_{}#';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function coz(el, sure = 700) {
  const metin = el.dataset.pxMetin ??= el.textContent; if (AZ) return;
  const bas = performance.now();
  const f = (now) => { const p = clamp((now - bas) / sure, 0, 1); el.textContent = [...metin].map((ch, i) => (ch === ' ' || i < p * metin.length * 1.15 - 1) ? ch : HARF[Math.floor(Math.random() * HARF.length)]).join(''); if (p < 1) el._r = requestAnimationFrame(f); else el.textContent = metin; };
  cancelAnimationFrame(el._r); el._r = requestAnimationFrame(f);
}

export function detayKur() {
  const temizle = [];
  // 1) bölüm başlıkları: görününce çözülür (ilk görünüşte; ekrandaki asıl metin ekran okuyucuya aria-label ile korunur)
  const basliklar = [...document.querySelectorAll('.bolum-baslik')];
  const gozlem = new IntersectionObserver((kayitlar) => kayitlar.forEach((k) => { if (k.isIntersecting) { gozlem.unobserve(k.target); coz(k.target); } }), { threshold: .6 });
  basliklar.forEach((b) => { b.setAttribute('aria-label', b.textContent.trim()); gozlem.observe(b); });
  temizle.push(() => { gozlem.disconnect(); basliklar.forEach((b) => { cancelAnimationFrame(b._r); if (b.dataset.pxMetin) b.textContent = b.dataset.pxMetin; b.removeAttribute('aria-label'); delete b.dataset.pxMetin; }); });

  // 2) araçlar: yuvaya tıkla → kuşan
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
