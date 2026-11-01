// 404, piksel görünüm: öneri paneli. İstenen adresi gösterir ("bash: cd: …: Böyle bir dosya ya da dizin yok"), siteye gerçekten ait en yakın sayfaları
// ("Bunu mu demek istedin?") dosya listesi gibi sıralar; benzer yoksa ana bölümleri önerir. Sayfanın eski sahte hata satırı gerçek adresle değiştirilir (geri alınır).
import { oneriler, gercekRotalar, rotaBasligi } from './piksel-404-oneri.js';
import { kapsayici, kapsayiciTemizle } from './piksel-404-yardim.js';

const BOLUMLER = ['/hakkimda/', '/projeler/', '/slaytlar/', '/iletisim/'];

export function oneriKur() {
  const k = kapsayici(); if (!k) return undefined;
  const yol = location.pathname;
  const kap = document.createElement('section'); kap.className = 'px-404-oneri'; kap.setAttribute('aria-label', 'Öneriler');
  kap.innerHTML = '<p class="px-404-komut"><span class="istem">$</span> cd <b></b></p><p class="px-404-hata"></p><p class="px-404-baslik" role="status"></p><ul class="px-404-liste"></ul>';
  k.append(kap);
  kap.querySelector('b').textContent = yol;
  kap.querySelector('.px-404-hata').textContent = `bash: cd: ${yol}: Böyle bir dosya ya da dizin yok`;
  const eski = document.querySelector('.sayfa-basi .kimlik'), eskiMetin = eski?.textContent;
  if (eski) eski.textContent = `bash: cd: ${yol}: Böyle bir dosya ya da dizin yok`;
  const baslik = kap.querySelector('.px-404-baslik'), liste = kap.querySelector('ul');
  let iptal = false;
  const yaz = (rotalar, yakin) => {
    if (iptal) return;
    baslik.textContent = yakin ? 'Bunu mu demek istedin?' : 'Buralara bakabilirsin:';
    liste.innerHTML = rotalar.map((r) => `<li><a href="${r}"><span class="px-404-mod" aria-hidden="true">${r === '/' || r.split('/').filter(Boolean).length < 2 ? 'drwxr-xr-x' : '-rw-r--r--'}</span><b></b><em></em></a></li>`).join('');
    liste.querySelectorAll('li').forEach((li, i) => { li.querySelector('b').textContent = rotaBasligi(rotalar[i]); li.querySelector('em').textContent = rotalar[i]; });
  };
  baslik.textContent = 'Yakın sayfalar aranıyor…';
  gercekRotalar().then((rotalar) => { const o = oneriler(yol, rotalar); yaz(o.length ? o.map((x) => x.rota) : BOLUMLER.filter((r) => rotalar.includes(r)), o.length > 0); });
  return () => { iptal = true; if (eski) eski.textContent = eskiMetin; kap.remove(); kapsayiciTemizle(); };
}
