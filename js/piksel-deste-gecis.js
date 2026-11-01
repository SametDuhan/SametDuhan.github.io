// Sunum, piksel görünüm: slayt geçişi. Deste motoru her slayta "goster" olayı yollar; bu olayda (1) ekranı turuncu pikselli bir tarama çizgisi geçer
// (ilerlerken soldan sağa, geri giderken sağdan sola), (2) slayt başlığı karışık harflerden çözülür, (3) slaytın doğrudan alt öğeleri sırayla yerine gelir.
// Kendi animasyonu olan öğelere dokunulmaz (slaytların kendi çizimleri bozulmasın). Hareketi azaltınca hiçbiri çalışmaz.
import { hazirOlunca } from './piksel-deste.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HARF = 'ABCDEFGHIJKLMNOPRSTUVYZ0123456789<>/_{}#';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function coz(el, sure = 520) {
  const metin = el.dataset.pxMetin ??= el.textContent; const bas = performance.now();
  const f = (now) => { const p = clamp((now - bas) / sure, 0, 1); el.textContent = [...metin].map((ch, i) => (ch === ' ' || i < p * metin.length * 1.15 - 1) ? ch : HARF[Math.floor(Math.random() * HARF.length)]).join(''); if (p < 1) el._r = requestAnimationFrame(f); else el.textContent = metin; };
  cancelAnimationFrame(el._r); el._r = requestAnimationFrame(f);
}

export function gecisKur() {
  if (AZ) return undefined;
  return hazirOlunca('.deste section.slayt', (slaytlar) => {
    const deste = slaytlar[0].closest('.deste');
    const tarama = document.createElement('div'); tarama.className = 'px-tarama'; tarama.setAttribute('aria-hidden', 'true'); deste.append(tarama);
    const dinleyiciler = [];
    const t0 = performance.now();
    slaytlar.forEach((s) => {
      const f = () => {
        if (performance.now() - t0 < 300) return;                       // katman bağlanırken gelen olay değil, kullanıcının slayt değişimi
        tarama.className = 'px-tarama'; void tarama.offsetWidth; tarama.classList.add(s.dataset.yon === 'geri' ? 'geri' : 'ileri');
        const baslik = s.querySelector('h1, h2'); if (baslik) coz(baslik);
        let k = 0;
        for (const e of s.children) { if (getComputedStyle(e).animationName !== 'none') continue; e.style.setProperty('--k', k++); }
        s.classList.remove('px-giris'); void s.offsetWidth; s.classList.add('px-giris');
        clearTimeout(s._z); s._z = setTimeout(() => s.classList.remove('px-giris'), 1000);
      };
      s.addEventListener('goster', f); dinleyiciler.push([s, f]);
    });
    return () => {
      dinleyiciler.forEach(([s, f]) => { s.removeEventListener('goster', f); clearTimeout(s._z); s.classList.remove('px-giris'); [...s.children].forEach((e) => e.style.removeProperty('--k')); const b = s.querySelector('h1, h2'); if (b?.dataset.pxMetin) { cancelAnimationFrame(b._r); b.textContent = b.dataset.pxMetin; delete b.dataset.pxMetin; } });
      tarama.remove();
    };
  });
}
