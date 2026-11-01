// Piksel görünüm: Slaytlar sayfasının etkileşimli katmanı. Sayfanın kendi içeriği (kartlar) olduğu gibi kalır; piksel görünüm seçiliyken
// üstüne parçalar eklenir, başka görünüme geçilince kaldırılır (js/piksel-hakkimda.js ile aynı kalıp). Yalnız Slaytlar listesinde çalışır.
// Kartlar sayfada JS ile çizilir (js/desteler.js); parçalar kartlar gelene dek bekler.
import { icindekilerKur } from './piksel-slaytlar-icindekiler.js';
import { yolKur } from './piksel-slaytlar-yol.js';

const kok = document.documentElement;
const PARCALAR = [icindekilerKur, yolKur];
let kaldirlar = [];

function guncelle() {
  if (kok.dataset.gorunum === 'piksel') { if (!kaldirlar.length) kaldirlar = PARCALAR.map((kur) => kur()).filter(Boolean); }
  else { kaldirlar.forEach((k) => k()); kaldirlar = []; }
}

export function baslat() {
  if (!document.getElementById('desteler')) return; // yalnız Slaytlar listesi
  new MutationObserver(guncelle).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
  guncelle();
}
