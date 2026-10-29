// Proje detay sayfaları: SkyTrack'te numaralı noktalar sırayla vurgulanır (tıklayınca durur),
// piksel projelerinde animasyon karelerinin üzerinde vurgu gezer. Yalnız görünürken çalışır.
import { gorunurken } from './vitrin.js';

const az = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const sonraki = (i, n) => (i + 1) % n;

function pinleriBagla(sahne) {
  const pinler = [...sahne.querySelectorAll('.pin')];
  const liste = [...sahne.parentElement.querySelectorAll('.pin-liste li')];
  let simdi = 0, sayac = 0, durduruldu = false;
  const sec = (i) => {
    simdi = i;
    pinler.forEach((p, j) => p.toggleAttribute('aria-current', j === i));
    liste.forEach((l, j) => l.toggleAttribute('aria-current', j === i));
  };
  pinler.forEach((p, i) => p.addEventListener('click', () => { durduruldu = true; clearInterval(sayac); sec(i); }));
  liste.forEach((l, i) => l.addEventListener('click', () => { durduruldu = true; clearInterval(sayac); sec(i); }));
  sec(0);
  if (az()) return;
  gorunurken(sahne, () => { if (!durduruldu) sayac = setInterval(() => sec(sonraki(simdi, pinler.length)), 3400); }, () => clearInterval(sayac), 0.3);
}

function kareleriBagla(kutu) {
  const [c, r] = kutu.dataset.hucre.split('x').map(Number);
  let simdi = 0, sayac = 0;
  const goster = (i) => { simdi = i; kutu.style.setProperty('--ci', i % c); kutu.style.setProperty('--ri', Math.floor(i / c)); };
  goster(0);
  if (az()) return;
  gorunurken(kutu, () => { sayac = setInterval(() => goster(sonraki(simdi, c * r)), 650); }, () => clearInterval(sayac), 0.3);
}

export function projeBaslat() {
  document.querySelectorAll('[data-pinler]').forEach(pinleriBagla);
  document.querySelectorAll('[data-hucre]').forEach(kareleriBagla);
}
