// Piksel görünüm: 404 sayfasının etkileşimli katmanı. Sayfanın kendi içeriği (404, açıklama, düğmeler) olduğu gibi kalır; piksel görünüm seçiliyken
// üstüne parçalar eklenir, başka görünüme geçilince kaldırılır (js/piksel-hakkimda.js ile aynı kalıp). Yalnız 404 sayfasında çalışır.
import { sahneKur } from './piksel-404-sahne.js';
import { oneriKur } from './piksel-404-liste.js';
import { konsolKur } from './piksel-404-konsol.js';

const kok = document.documentElement;
const PARCALAR = [sahneKur, oneriKur, konsolKur];
let kaldirlar = [];

function guncelle() {
  if (kok.dataset.gorunum === 'piksel') { if (!kaldirlar.length) kaldirlar = PARCALAR.map((kur) => kur()).filter(Boolean); }
  else { kaldirlar.forEach((k) => k()); kaldirlar = []; }
}

export function baslat() {
  if (document.getElementById('icerik')?.dataset.sayfa !== '404') return;
  new MutationObserver(guncelle).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
  guncelle();
}
