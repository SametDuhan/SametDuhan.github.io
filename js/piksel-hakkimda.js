// Piksel görünüm: Hakkımda sayfasının etkileşimli katmanı. Sayfanın kendi içeriği (HTML) olduğu gibi kalır; piksel görünüm seçiliyken
// üstüne parçalar eklenir, başka görünüme geçilince kaldırılır. Her parça bir kur() işlevidir ve kaldırma işlevi döndürür.
import { sahneKur } from './piksel-hakkimda-sahne.js';
import { yolKur } from './piksel-hakkimda-yol.js';
import { detayKur } from './piksel-hakkimda-detay.js';

const kok = document.documentElement;
const PARCALAR = [sahneKur, yolKur, detayKur];
let kaldirlar = [];

function guncelle() {
  if (kok.dataset.gorunum === 'piksel') { if (!kaldirlar.length) kaldirlar = PARCALAR.map((kur) => kur()).filter(Boolean); }
  else { kaldirlar.forEach((k) => k()); kaldirlar = []; }
}

export function baslat() {
  if (!document.getElementById('rota-baslik')) return; // yalnız Hakkımda
  new MutationObserver(guncelle).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
  guncelle();
  // pencere genişleyip daralınca (ör. sahne yalnız geniş ekranda) parçalar yeniden kurulur
  let bekle; addEventListener('resize', () => { clearTimeout(bekle); bekle = setTimeout(() => { kaldirlar.forEach((k) => k()); kaldirlar = []; guncelle(); }, 200); });
}
