// İletişim, piksel görünüm: mesaj yardımcısı. Mesaj kutusundaki şablonun boş alanlarını (• Pozisyon: , [Şirket / ekip adı], satır sonunda ":" ile biten sorular)
// canlı bir kontrol listesine çevirir; bir alana tıklayınca imleç o alana gider. "(varsa)" gibi isteğe bağlı alanlar mesajı engellemez.
// Hepsi hazır olunca "Mail uygulamasında aç" düğmesi nabız atar ve posta kutusunun bayrağı kalkar. Mesaj kutusuna yalnız okunur/imleç konur; yazı değiştirilmez.
import { t } from './dil.js';

const ISTEGE_BAGLI = /\((varsa|opsiyonel|if any|optional)\)/i;

// Mesajdan alanları çıkarır (saf işlev: testlenebilir). Her alan: { etiket, bos, zorunlu, basla, bitis } (basla-bitis: seçilecek aralık)
export function alanlariBul(metin) {
  const alanlar = [], gorulen = new Set();
  const ekle = (etiket, bos, basla, bitis) => { const e = etiket.replace(/\s+/g, ' ').trim().slice(0, 34); if (!e || gorulen.has(e)) return; gorulen.add(e); alanlar.push({ etiket: e, bos, zorunlu: !ISTEGE_BAGLI.test(e), basla, bitis }); };
  let konum = 0;
  for (const satir of metin.split('\n')) {
    const bas = konum; konum += satir.length + 1;
    const ik = satir.indexOf(':');
    if (/^\s*[•\-*]\s*/.test(satir) && ik > 0) {            // madde: "• Pozisyon: değer"
      const etiket = satir.slice(0, ik).replace(/^\s*[•\-*]\s*/, ''), deger = satir.slice(ik + 1);
      ekle(etiket, !deger.trim() || /^\s*\[.*\]\s*$/.test(deger), bas + ik + 1, bas + satir.length);
    } else if (ik > 0 && /:\s*$/.test(satir)) {            // soru: "Senden beklediğim katkı: "
      ekle(satir.slice(0, ik), true, bas + satir.length, bas + satir.length);
    }
    for (const m of satir.matchAll(/\[([^\]]+)\]/g)) ekle(m[1], true, bas + m.index, bas + m.index + m[0].length); // yer tutucu: [Şirket / ekip adı]
  }
  return alanlar;
}

// Hazır mı: zorunlu alanların hepsi dolu ve selamlamadan sonra en az 10 karakterlik içerik var.
export function hazirMi(metin, alanlar) {
  const icerik = metin.split('\n').slice(1).join('\n').replace(/\[[^\]]*\]/g, '').trim();
  return alanlar.filter((a) => a.zorunlu && a.bos).length === 0 && icerik.length >= 10;
}

export function yardimKur() {
  const mesaj = document.getElementById('mesaj'), kime = document.querySelector('.yaz-kart .kime'), eylemler = document.querySelector('.yaz-kart .eylemler');
  if (!mesaj || !kime) return undefined;

  const kap = document.createElement('div');
  kap.className = 'px-yardim';
  kap.innerHTML = `<p class="px-yardim-ust"><span class="istem">$</span> ${t('eksik alanlar', 'missing fields')} <span class="px-yardim-say" aria-hidden="true"></span><span class="px-karakter" aria-hidden="true"></span></p>
    <ul class="px-yardim-liste" aria-label="${t('Mesajdaki doldurulacak alanlar', 'Fields to fill in the message')}"></ul>
    <p class="px-yardim-durum" role="status" aria-live="polite"></p>`;
  kime.before(kap);
  const liste = kap.querySelector('ul'), say = kap.querySelector('.px-yardim-say'), kar = kap.querySelector('.px-karakter'), durum = kap.querySelector('.px-yardim-durum');
  let sonMetin = null, alanlar = [], hazir = null;

  function yenile() {
    const metin = mesaj.value; if (metin === sonMetin) return; sonMetin = metin;
    alanlar = alanlariBul(metin);
    liste.innerHTML = alanlar.map((a, i) => `<li><button type="button" data-i="${i}" class="px-alan ${a.bos ? 'bos' : 'dolu'}${a.zorunlu ? '' : ' istege'}"><i aria-hidden="true"></i><span>${a.etiket}${a.zorunlu ? '' : ` <em>${t('isteğe bağlı', 'optional')}</em>`}</span><span class="sr-only">${a.bos ? t('boş', 'empty') : t('dolu', 'filled')}</span></button></li>`).join('');
    const eksik = alanlar.filter((a) => a.zorunlu && a.bos).length;
    say.textContent = alanlar.length ? `${alanlar.length - alanlar.filter((a) => a.bos).length} / ${alanlar.length}` : '';
    kar.textContent = t(`${metin.trim().length} karakter`, `${metin.trim().length} characters`);
    const h = hazirMi(metin, alanlar);
    durum.textContent = h ? t('Hazır: gönderebilirsin ✓', 'Ready: you can send it ✓') : eksik ? t(`${eksik} boş alan kaldı`, `${eksik} empty field${eksik > 1 ? 's' : ''} left`) : t('Selamdan sonra biraz içerik yaz', 'Write a little after the greeting');
    durum.classList.toggle('hazir', h);
    eylemler?.classList.toggle('px-hazir', h);
    if (h !== hazir) { hazir = h; dispatchEvent(new CustomEvent('px-mesaj-hazir', { detail: h })); }
  }
  liste.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]'); if (!b) return; const a = alanlar[+b.dataset.i]; if (!a) return;
    mesaj.focus(); const bas = a.bos && a.basla === a.bitis ? a.bitis : a.basla; mesaj.setSelectionRange(bas, a.bitis);
  });
  mesaj.addEventListener('input', yenile);
  const sal = setInterval(yenile, 200);            // konu değişince mesaj kutusu kodla doldurulur (input olayı yok)
  yenile();
  return () => { clearInterval(sal); mesaj.removeEventListener('input', yenile); eylemler?.classList.remove('px-hazir'); dispatchEvent(new CustomEvent('px-mesaj-hazir', { detail: false })); kap.remove(); };
}
