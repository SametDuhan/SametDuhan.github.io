// Piksel görünüm: proje detay sayfalarının (projeler/<proje>/) etkileşimli katmanı. Sayfanın kendi içeriği (HTML) olduğu gibi kalır; piksel görünüm
// seçiliyken üstüne parçalar eklenir, başka görünüme geçilince kaldırılır (js/piksel-hakkimda.js ile aynı kalıp). Bu sayfalarda karakter eklenmez.
import { akisKur } from './piksel-proje-akis.js';
import { ekranKur } from './piksel-proje-ekran.js';

const kok = document.documentElement;
const PARCALAR = [akisKur, ekranKur];
let kaldirlar = [];

function guncelle() {
  if (kok.dataset.gorunum === 'piksel') { if (!kaldirlar.length) kaldirlar = PARCALAR.map((kur) => kur()).filter(Boolean); }
  else { kaldirlar.forEach((k) => k()); kaldirlar = []; }
}

export function baslat() {
  if (!document.querySelector('.p-kahraman')) return; // yalnız proje detay sayfaları
  new MutationObserver(guncelle).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
  guncelle();
  let bekle; addEventListener('resize', () => { clearTimeout(bekle); bekle = setTimeout(() => { kaldirlar.forEach((k) => k()); kaldirlar = []; guncelle(); }, 200); });
}
