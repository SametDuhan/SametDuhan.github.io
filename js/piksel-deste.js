// Piksel görünüm: sunum sayfalarının (slaytlar/<sunum>/) etkileşimli katmanı. Deste motoru (js/deste.js) ve slayt içerikleri olduğu gibi çalışır;
// piksel görünüm seçiliyken stil dosyası bağlanır ve parçalar eklenir, başka görünüme geçilince hepsi kaldırılır (js/piksel-hakkimda.js ile aynı kalıp).
// js/atolye.js (tüm sunumlarda yüklü) bu modülü yükler; sayfa HTML'ine dokunulmaz.
import { yolKur } from './piksel-deste-yol.js';

const kok = document.documentElement;
const PARCALAR = [yolKur];
let kaldirlar = [], css = null;

function guncelle() {
  if (kok.dataset.gorunum === 'piksel') {
    if (!css) { css = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: new URL('../css/piksel-deste.css', import.meta.url).href }); document.head.append(css); }
    if (!kaldirlar.length) kaldirlar = PARCALAR.map((kur) => kur()).filter(Boolean);
  } else { kaldirlar.forEach((k) => k()); kaldirlar = []; css?.remove(); css = null; }
}

export function baslat() {
  if (!document.querySelector('.deste')) return; // yalnız sunum sayfaları
  new MutationObserver(guncelle).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
  guncelle();
}

// Deste motoru gezinme öğelerini JS ile ekler: hazır olana dek bekle (en çok ~5 sn), hazırsa çalıştır. Döndürdüğü işlev iptal/temizlik yapar.
export function hazirOlunca(secici, calis) {
  let iptal = false, temizle = () => {}, sayac = 0;
  const dene = () => {
    if (iptal) return;
    const e = document.querySelectorAll(secici);
    if (e.length) { temizle = calis([...e]) ?? (() => {}); return; }
    if (++sayac < 50) setTimeout(dene, 100);
  };
  dene();
  return () => { iptal = true; temizle(); };
}
