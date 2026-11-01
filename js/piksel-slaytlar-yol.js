// Slaytlar, piksel görünüm: "kaldığın yer" yolu. Her kartta slayt sayısı kadar kare; bitirdiğin slaytlar dolu, Claude Code pikseli kaldığın
// slaytta bekler (kartın üstüne gelince bayrak sallar). İlerleme yalnız bu tarayıcıda saklı (js/ilerleme.js, sunumların kullandığı kayıt); hiçbir yere gönderilmez.
import { DESTELER } from './desteler.js';
import { ilerlemeOku } from './ilerleme.js';
import { pikselKarakter } from './piksel.js';
import { kartlariBekle } from './piksel-slaytlar-yardim.js';
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const U = 2, KG = 48, KY = 40;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function yolKur() {
  const kutu = document.getElementById('desteler'); if (!kutu) return undefined;
  let depo = null; try { depo = localStorage; } catch {}
  return kartlariBekle(kutu, () => {
    const kartlar = [...kutu.querySelectorAll('.deste-karti')], ogeler = [], temizle = [];
    let biten = 0, toplam = 0, tamam = 0;
    kartlar.forEach((k) => {
      const slug = new URL(k.href, location.href).pathname.split('/').filter(Boolean).at(-1);
      const d = DESTELER.find((x) => x.slug === slug); if (!d) return;
      const n = d.slaytSayisi, ilr = ilerlemeOku(depo, slug);
      const bitti = Boolean(ilr?.bitti), baslamis = Boolean(ilr) && ilr.konum > 0 || bitti;
      const konum = bitti ? n - 1 : baslamis ? clamp(ilr.konum, 0, n - 1) : 0;
      const dolu = bitti ? n : baslamis ? konum : 0;           // bitirilen slayt sayısı (üzerinde durduğun slayt sayılmaz)
      toplam += n; biten += dolu; if (bitti) tamam++;
      const iz = document.createElement('span');
      iz.className = 'px-iz'; iz.setAttribute('role', 'img');
      iz.setAttribute('aria-label', bitti ? t(`Tamamlandı: ${n} / ${n} slayt`, `Completed: ${n} / ${n} slides`) : baslamis ? t(`Kaldığın yer: ${konum + 1}. slayt, ${n} slayttan`, `Where you left off: slide ${konum + 1} of ${n}`) : t('Henüz başlamadın', 'Not started yet'));
      iz.innerHTML = `<canvas width="${KG}" height="${KY}" aria-hidden="true"></canvas><span class="px-iz-kareler" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i class="${i < dolu ? 'on' : ''}${i === konum && !bitti ? ' simdi' : ''}"></i>`).join('')}</span>`;
      const alt = k.querySelector('.alt'); alt ? alt.before(iz) : k.append(iz);
      const cv = iz.querySelector('canvas'); cv.style.left = ((konum + .5) / n * 100) + '%';
      ogeler.push({ k, iz, c: cv.getContext('2d'), mavi: false });
      const a = () => { ogeler.find((o) => o.k === k).mavi = true; }, b = () => { ogeler.find((o) => o.k === k).mavi = false; };
      k.addEventListener('pointerenter', a); k.addEventListener('pointerleave', b); k.addEventListener('focus', a); k.addEventListener('blur', b);
      temizle.push(() => { k.removeEventListener('pointerenter', a); k.removeEventListener('pointerleave', b); k.removeEventListener('focus', a); k.removeEventListener('blur', b); iz.remove(); });
    });

    // toplam ilerleme satırı: kartların üstünde
    const sat = document.createElement('p'); sat.className = 'px-toplam';
    const ilkHref = kartlar[0]?.getAttribute('href') ?? './';
    sat.innerHTML = biten || tamam
      ? `<span class="istem">$</span> cat ~/.slaytlar/ilerleme <b>${biten} / ${toplam}</b> ${t('slayt', 'slides')}${tamam ? ` · ${tamam} ${t('sunum tamamlandı', 'decks completed')}` : ''}`
      : `<span class="istem">$</span> cat ~/.slaytlar/ilerleme <b>0 / ${toplam}</b> ${t('slayt', 'slides')} · <a href="${ilkHref}">${t('buradan başla', 'start here')} →</a>`;
    kutu.before(sat); temizle.push(() => sat.remove());

    const ciz = () => {
      if (document.hidden) return; const tt = performance.now() / 1000;
      ogeler.forEach((o) => { const d = { x: 0, yOff: -(Math.floor(tt * 1.4) % 2) * 2, look: 1, run: false, tilt: 0, armUp: o.mavi, air: false, legPhase: 0 }; if (o.mavi) d.tilt = Math.sin(tt * 8) * 3.2; o.c.clearRect(0, 0, KG, KY); pikselKarakter(o.c, d, KY - 4, U, tt); });
    };
    ciz();
    const sal = AZ ? null : setInterval(ciz, 90);
    return () => { clearInterval(sal); temizle.forEach((f) => f()); };
  });
}
