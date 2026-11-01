// Proje detay, piksel görünüm: bölüm rayı. Kenarda ince bir devre yolu; her bölüm (Neler yapıyor, ekran görüntüsü, Nasıl çalışıyor, Geliştirme hikâyesi, Kaynaklar)
// bir durak. Kaydırdıkça ilerleme dolar ve bulunduğun bölüm vurgulanır; durağa tıklayınca o bölüme kayar. Konumlar bölümlerin sayfadaki gerçek yerlerinden hesaplanır.
// Bu rayda karakter yoktur (sayfada zaten başka görseller var).
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function rayKur() {
  const bolumler = [...document.querySelectorAll('main section.bolum[aria-labelledby]')].filter((b) => document.getElementById(b.getAttribute('aria-labelledby')));
  const menu = document.querySelector('.yan-menu'), ilk = document.querySelector('.p-kahraman');
  if (bolumler.length < 3 || !ilk || innerWidth < 1000) return undefined;
  const adlar = bolumler.map((b) => document.getElementById(b.getAttribute('aria-labelledby')).dataset.pxMetin ?? document.getElementById(b.getAttribute('aria-labelledby')).textContent.trim());

  const ray = document.createElement('nav');
  ray.className = 'px-pray'; ray.setAttribute('aria-label', t('Sayfa bölümleri', 'Page sections'));
  ray.innerHTML = `<span class="px-pray-cizgi" aria-hidden="true"><i></i></span><ol>${bolumler.map((b, i) => `<li><button type="button" data-i="${i}" aria-label="${adlar[i]}"><span class="px-pdurak" aria-hidden="true"></span><span class="px-pdurak-ad" aria-hidden="true">${adlar[i]}</span></button></li>`).join('')}</ol>`;
  document.body.append(ray);
  const dolgu = ray.querySelector('.px-pray-cizgi i'), lis = [...ray.querySelectorAll('li')], dugmeler = [...ray.querySelectorAll('button')];
  let oran = [];

  function olc() {
    const m = menu ? menu.getBoundingClientRect().right : 0, l = ilk.getBoundingClientRect().left;
    ray.style.left = (m + (l - m) / 2) + 'px'; ray.style.top = innerHeight * .2 + 'px'; ray.style.height = innerHeight * .6 + 'px';
    const ust = bolumler[0].getBoundingClientRect().top, alt = bolumler.at(-1).getBoundingClientRect().bottom, yuk = Math.max(1, alt - ust);
    oran = bolumler.map((b) => { const r = b.getBoundingClientRect(); return clamp(((r.top + r.height / 2) - ust) / yuk, 0, 1); });
    lis.forEach((li, i) => { li.style.top = oran[i] * 100 + '%'; });
  }
  function kaydir() {
    const vh = innerHeight, ust = bolumler[0].getBoundingClientRect().top, alt = bolumler.at(-1).getBoundingClientRect().bottom;
    const p = clamp((vh * .4 - ust) / Math.max(1, alt - ust), 0, 1);
    ray.classList.toggle('acik', ust < vh * .75 && alt > vh * .25);
    dolgu.style.height = p * 100 + '%';
    let aktif = 0; bolumler.forEach((b, i) => { if (b.getBoundingClientRect().top <= vh * .45) aktif = i; });
    dugmeler.forEach((b, i) => { b.toggleAttribute('data-aktif', i === aktif); b.setAttribute('aria-current', i === aktif ? 'true' : 'false'); });
  }
  dugmeler.forEach((b, i) => b.addEventListener('click', () => bolumler[i].scrollIntoView({ behavior: AZ ? 'auto' : 'smooth', block: 'start' })));
  const guncelle = () => { olc(); kaydir(); };
  addEventListener('scroll', kaydir, { passive: true, capture: true });
  addEventListener('resize', guncelle);
  const ro = new ResizeObserver(guncelle); ro.observe(document.querySelector('main'));
  document.fonts?.ready.then(guncelle);
  guncelle();
  return () => { removeEventListener('scroll', kaydir, { capture: true }); removeEventListener('resize', guncelle); ro.disconnect(); ray.remove(); };
}
