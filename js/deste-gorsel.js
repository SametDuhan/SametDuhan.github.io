// Sunumlarda slayt açılınca: giriş animasyonu (.canli), sayaçlar ([data-say]) ve SMIL çizimleri.
import { slaytaBagla } from './atolye.js';

const az = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const yumusat = (t) => 1 - (1 - t) ** 3;
const yaz = (el, p) => { el.textContent = `${Math.round(Number(el.dataset.say) * p)}${el.dataset.son ?? ''}`; };

if (az()) for (const svg of document.querySelectorAll('.deste svg')) svg.pauseAnimations?.();

for (const slayt of document.querySelectorAll('.deste section.slayt')) {
  const sayilar = [...slayt.querySelectorAll('[data-say]')];
  let kare = 0;
  slaytaBagla(slayt, () => {
    slayt.classList.remove('canli');
    void slayt.offsetWidth;
    slayt.classList.add('canli');
    cancelAnimationFrame(kare);
    if (az()) { sayilar.forEach((e) => yaz(e, 1)); return; }
    const bas = performance.now();
    const adim = (t) => {
      const p = Math.min(1, (t - bas) / 1300);
      sayilar.forEach((e) => yaz(e, yumusat(p)));
      if (p < 1) kare = requestAnimationFrame(adim);
    };
    kare = requestAnimationFrame(adim);
  }, () => { cancelAnimationFrame(kare); slayt.classList.remove('canli'); });
}
