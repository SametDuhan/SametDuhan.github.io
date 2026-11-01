// Piksel görünüm: Projeler sayfasının etkileşimli katmanı. Sayfanın kendi içeriği (HTML) olduğu gibi kalır; piksel görünüm seçiliyken
// üstüne parçalar eklenir, başka görünüme geçilince kaldırılır (js/piksel-hakkimda.js ile aynı kalıp). Yalnız Projeler listesi sayfasında çalışır.
import { miniKur } from './piksel-projeler-mini.js';
import { rayKur } from './piksel-projeler-ray.js';
import { vitrinKur } from './piksel-projeler-vitrin.js';

const kok = document.documentElement;
const PARCALAR = [miniKur, rayKur, vitrinKur];
let kaldirlar = [];

function guncelle() {
  if (kok.dataset.gorunum === 'piksel') { if (!kaldirlar.length) kaldirlar = PARCALAR.map((kur) => kur()).filter(Boolean); }
  else { kaldirlar.forEach((k) => k()); kaldirlar = []; }
}

export function baslat() {
  if (!document.querySelector('.vitrinler')) return; // proje detay sayfalarında yok
  new MutationObserver(guncelle).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
  guncelle();
  let bekle; addEventListener('resize', () => { clearTimeout(bekle); bekle = setTimeout(() => { kaldirlar.forEach((k) => k()); kaldirlar = []; guncelle(); }, 200); });
}
