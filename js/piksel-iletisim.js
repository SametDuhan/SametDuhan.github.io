// Piksel görünüm: İletişim sayfasının etkileşimli katmanı. Sayfanın formu ve mantığı (js/iletisim.js) olduğu gibi çalışır; piksel görünüm
// seçiliyken üstüne parçalar eklenir, başka görünüme geçilince kaldırılır (js/piksel-hakkimda.js ile aynı kalıp). Yalnız İletişim sayfasında çalışır.
import { sahneKur } from './piksel-iletisim-sahne.js';
import { eylemKur } from './piksel-iletisim-eylem.js';

const kok = document.documentElement;
const PARCALAR = [sahneKur, eylemKur];
let kaldirlar = [];

function guncelle() {
  if (kok.dataset.gorunum === 'piksel') { if (!kaldirlar.length) kaldirlar = PARCALAR.map((kur) => kur()).filter(Boolean); }
  else { kaldirlar.forEach((k) => k()); kaldirlar = []; }
}

export function baslat() {
  if (!document.getElementById('yazi-formu')) return; // yalnız İletişim
  new MutationObserver(guncelle).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
  guncelle();
  let bekle; addEventListener('resize', () => { clearTimeout(bekle); bekle = setTimeout(() => { kaldirlar.forEach((k) => k()); kaldirlar = []; guncelle(); }, 200); });
}
