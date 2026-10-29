// İletişim sayfası: konu seçimi, hazır mesaj şablonu, mail/Gmail bağlantıları, taslak, kişi kartı.
// Mail adresi kaynakta düz metin durmaz; sayfa açılınca parçalardan kurulur.
// Saf fonksiyonlar Node'da sınanır; baslat() tarayıcıya bağlar.

export function mailAdresi(kullanici, alan) {
  return `${kullanici}@${alan}`;
}

export function mailtoLinki(adres, konu, govde) {
  const ek = [konu && `subject=${encodeURIComponent(konu)}`, govde && `body=${encodeURIComponent(govde)}`].filter(Boolean);
  return ek.length ? `mailto:${adres}?${ek.join('&')}` : `mailto:${adres}`;
}

export function gmailLinki(adres, konu, govde) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(adres)}&su=${encodeURIComponent(konu)}&body=${encodeURIComponent(govde)}`;
}

export function bagla(el) {
  const adres = mailAdresi(el.dataset.k, el.dataset.a);
  el.href = `mailto:${adres}`;
  el.textContent = adres;
}

export const KONULAR = [
  { kod: 'is', ad: 'İş teklifi',
    sablon: 'Merhaba Samet,\n\n[Şirket / ekip adı] olarak sana bir fırsat için yazıyorum.\n\n• Rol: \n• Süre: \n• Çalışma şekli (uzaktan / ofis): \n\nUygun olduğun bir zaman yazarsan görüşelim.' },
  { kod: 'ortak', ad: 'Ortak proje',
    sablon: 'Merhaba Samet,\n\nŞöyle bir proje üzerinde çalışıyorum: \n\nSenden beklediğim katkı: \nBağlantı (varsa): \n\nİlgini çeker mi?' },
  { kod: 'soru', ad: 'Soru ya da öneri',
    sablon: 'Merhaba Samet,\n\n[Slaytlar / projeler / AI] hakkında şunu merak ediyorum: \n' },
  { kod: 'diger', ad: 'Diğer', sablon: 'Merhaba Samet,\n\n' },
];

// ?konu=ortak, ?konu=İş teklifi ya da #ortak: bilinmeyen değer ilk konuya düşer.
export function konuBul(deger) {
  const temiz = String(deger ?? '').replace(/^#/, '').toLocaleLowerCase('tr');
  return KONULAR.find((k) => k.kod === temiz || k.ad.toLocaleLowerCase('tr') === temiz) ?? KONULAR[0];
}

export const mesajGovdesi = (mesaj) => mesaj.replace(/\s+$/, '');

async function kopyala(metin) {
  try { await navigator.clipboard.writeText(metin); return true; } catch { /* eski tarayıcı: aşağıdaki yedek */ }
  try {
    const gecici = Object.assign(document.createElement('textarea'), { value: metin });
    gecici.style.cssText = 'position:fixed;opacity:0;top:0';
    document.body.append(gecici); gecici.select();
    const ok = document.execCommand('copy'); gecici.remove(); return ok;
  } catch { return false; }
}

export function baslat() {
  const al = (id) => document.getElementById(id);
  const mail = al('mail'), form = al('yazi-formu');
  const adres = mailAdresi(mail.dataset.k, mail.dataset.a);
  bagla(mail); mail.hidden = false;
  al('kime').textContent = adres;

  const kopyalaDugme = al('kopyala');
  kopyalaDugme.hidden = false;
  kopyalaDugme.addEventListener('click', async () => {
    kopyalaDugme.textContent = (await kopyala(adres)) ? 'kopyalandı ✓' : 'seçip kopyala';
    setTimeout(() => { kopyalaDugme.textContent = 'kopyala'; }, 2000);
  });

  // Mesaj formu: JS varsa açılır; yoksa konu bağlantıları doğrudan kanallara gider.
  form.hidden = false;
  const chipler = [...document.querySelectorAll('[data-konu]')];
  const mesaj = al('mesaj'), durum = al('durum');
  const mailAc = al('mail-ac'), gmailAc = al('gmail-ac'), metinDugme = al('metin-kopyala');
  let depo = null;
  try { depo = localStorage; } catch { /* engelli depo: taslak saklanmaz */ }
  const ANAHTAR = 'iletisim-taslak';
  const urldenGeldi = new URLSearchParams(location.search).has('konu') || KONULAR.some((k) => location.hash === `#${k.kod}`);
  let konu = konuBul(new URLSearchParams(location.search).get('konu') || location.hash);
  let kirli = false;

  try {
    const taslak = JSON.parse(depo?.getItem(ANAHTAR) ?? 'null');
    if (taslak && !urldenGeldi) { konu = konuBul(taslak.konu); mesaj.value = taslak.mesaj ?? ''; kirli = Boolean(taslak.kirli); }
  } catch { /* bozuk taslak yok sayılır */ }
  if (!mesaj.value) mesaj.value = konu.sablon;

  const durumYaz = (metin, uyari = false) => { durum.textContent = metin; durum.classList.toggle('uyari', uyari); };
  function guncelle() {
    chipler.forEach((c) => { c.setAttribute('role', 'button'); c.setAttribute('aria-pressed', String(c.dataset.konu === konu.ad)); });
    const govde = mesajGovdesi(mesaj.value);
    const link = mailtoLinki(adres, konu.ad, govde);
    mailAc.href = link;
    gmailAc.href = gmailLinki(adres, konu.ad, govde);
    durumYaz(link.length > 1900 ? 'Mesaj uzun: mail uygulaması kırpabilir. "Metni kopyala" daha güvenli.' : '', link.length > 1900);
    try { depo?.setItem(ANAHTAR, JSON.stringify({ konu: konu.kod, mesaj: mesaj.value, kirli })); } catch { /* depo dolu */ }
  }

  chipler.forEach((c) => c.addEventListener('click', (e) => {
    e.preventDefault();
    const eskiSablon = konu.sablon;
    konu = konuBul(c.dataset.konu);
    // Mesaja el sürülmediyse ya da hâlâ eski şablonsa yeni konunun şablonu otomatik gelir.
    if (!kirli || !mesaj.value.trim() || mesaj.value === eskiSablon) { mesaj.value = konu.sablon; kirli = false; }
    guncelle(); mesaj.focus(); mesaj.setSelectionRange(mesaj.value.length, mesaj.value.length);
  }));
  mesaj.addEventListener('input', () => { kirli = mesaj.value !== konu.sablon; guncelle(); });

  const hepsi = () => `Kime: ${adres}\nKonu: ${konu.ad}\n\n${mesajGovdesi(mesaj.value)}`;
  metinDugme.addEventListener('click', async () => {
    durumYaz((await kopyala(hepsi())) ? 'Kime, konu ve mesaj kopyalandı ✓' : 'Kopyalanamadı: metni seçip kopyala.');
  });
  // Mail uygulaması açılmazsa (pencere odağı bırakılmadıysa) metin kendiliğinden kopyalanır.
  mailAc.addEventListener('click', () => {
    let acildi = false;
    const birakildi = () => { acildi = true; };
    addEventListener('blur', birakildi, { once: true });
    setTimeout(async () => {
      removeEventListener('blur', birakildi);
      if (acildi || document.hidden) return;
      durumYaz((await kopyala(hepsi())) ? 'Mail uygulaması açılmadı: mesajını kopyaladım ✓ İstersen "Gmail\'de aç"ı dene.' : 'Mail uygulaması açılmadı. "Gmail\'de aç"ı dene.', true);
    }, 1600);
  });

  guncelle();
  if (urldenGeldi) { mesaj.focus(); mesaj.setSelectionRange(mesaj.value.length, mesaj.value.length); }
}
