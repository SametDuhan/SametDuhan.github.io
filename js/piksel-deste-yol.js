// Sunum, piksel görünüm: slayt yolu. Alttaki slayt noktaları pikselli kareler olur (geçtiklerin dolu, bulunduğun parlak); Claude Code pikseli
// kareler üstünde bulunduğun slayta yürür, bir slayttan öbürüne giderken koşar, son slaytta bayrak sallar. Noktalar deste motorunun kendi düğmeleridir
// (tıklamayla slayta gidilir); yalnız görünümü ve bir karakter eklenir. Hareketi azaltınca karakter anında yer değiştirir.
import { pikselKarakter } from './piksel.js';
import { hazirOlunca } from './piksel-deste.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const U = 2, KG = 48, KY = 40;

export function yolKur() {
  return hazirOlunca('.deste .noktalar .nokta', (noktalar) => {
    const yol = noktalar[0].parentElement;
    const kar = document.createElement('canvas'); kar.className = 'px-yol-kar'; kar.width = KG; kar.height = KY; kar.setAttribute('aria-hidden', 'true');
    yol.append(kar); yol.classList.add('px-yol-var');
    const c = kar.getContext('2d');
    let x = null, hedef = 0, kapali = false, simdi = 0;

    function ol() {
      simdi = Math.max(0, noktalar.findIndex((b) => b.hasAttribute('aria-current')));
      noktalar.forEach((b, i) => b.classList.toggle('px-gecti', i < simdi));
      const r = noktalar[simdi].getBoundingClientRect(), y = yol.getBoundingClientRect();
      hedef = r.left - y.left + r.width / 2;
      if (x === null || AZ) x = hedef;
    }
    const mo = new MutationObserver(ol); mo.observe(yol, { attributes: true, attributeFilter: ['aria-current'], subtree: true });
    addEventListener('resize', ol);

    function ciz() {
      if (kapali) return;
      const kosuyor = Math.abs(hedef - x) > 1.5;
      x += (hedef - x) * (AZ ? 1 : .16); if (!kosuyor) x = hedef;
      kar.style.left = Math.round(x) + 'px';
      const tt = performance.now() / 1000, son = simdi === noktalar.length - 1;
      const d = { x: 0, yOff: kosuyor ? -Math.abs(Math.sin(tt * 9 * Math.PI)) * 1.2 * U : -(Math.floor(tt * 1.4) % 2) * 2, look: hedef >= x ? 1 : -1, run: kosuyor, tilt: 0, armUp: !kosuyor && son, air: false, legPhase: Math.floor(tt * 9) % 2 };
      if (d.armUp) d.tilt = Math.sin(tt * 8) * 3.2;
      c.clearRect(0, 0, KG, KY); pikselKarakter(c, d, KY - 4, U, tt);
      requestAnimationFrame(ciz);
    }
    ol(); x = hedef;
    requestAnimationFrame(ciz);
    return () => { kapali = true; mo.disconnect(); removeEventListener('resize', ol); noktalar.forEach((b) => b.classList.remove('px-gecti')); yol.classList.remove('px-yol-var'); kar.remove(); };
  });
}
