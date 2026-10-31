import { t } from './dil.js';
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

// ad: sayfadaki konu bağlantılarının data-konu değeri (arama anahtarı, hep Türkçe); baslik: mailin konu satırı (sayfanın diliyle)
export const KONULAR = [
  { kod: 'staj', ad: 'Staj', baslik: t('Staj', 'Internship'),
    sablon: t('Merhaba Samet,\n\n[Şirket / ekip adı] olarak staj için yazıyorum.\n\n• Pozisyon: \n• Başlangıç tarihi: \n• Süre: \n• Çalışma şekli (uzaktan / yerinde): \n\nUygun olduğun bir zaman yazarsan görüşelim.', 'Hi Samet,\n\n[Company / team name] here, and I am writing to you about an internship.\n\n• Position: \n• Start date: \n• Duration: \n• Work arrangement (remote / on-site): \n\nIf you tell me a time that works for you, let us talk.') },
  { kod: 'is', ad: 'İş teklifi', baslik: t('İş teklifi', 'Job offer'),
    sablon: t('Merhaba Samet,\n\n[Şirket / ekip adı] olarak sana bir fırsat için yazıyorum.\n\n• Rol: \n• Süre: \n• Çalışma şekli (uzaktan / ofis): \n\nUygun olduğun bir zaman yazarsan görüşelim.', 'Hi Samet,\n\n[Company / team name] here, and I am writing to you about an opportunity.\n\n• Role: \n• Duration: \n• Work arrangement (remote / office): \n\nIf you tell me a time that works for you, let us talk.') },
  { kod: 'ortak', ad: 'Ortak proje', baslik: t('Ortak proje', 'Joint project'),
    sablon: t('Merhaba Samet,\n\nŞöyle bir proje üzerinde çalışıyorum: \n\nSenden beklediğim katkı: \nBağlantı (varsa): \n\nİlgini çeker mi?', 'Hi Samet,\n\nI am working on a project like this: \n\nThe contribution I am hoping for from you: \nLink (if any): \n\nWould you be interested?') },
  { kod: 'soru', ad: 'Soru ya da öneri', baslik: t('Soru ya da öneri', 'Question or suggestion'),
    sablon: t('Merhaba Samet,\n\n[Slaytlar / projeler / AI] hakkında şunu merak ediyorum: \n', 'Hi Samet,\n\nI am curious about this regarding [slides / projects / AI]: \n') },
  { kod: 'diger', ad: 'Diğer', baslik: t('Diğer', 'Other'), sablon: t('Merhaba Samet,\n\n', 'Hi Samet,\n\n') },
];

// ?konu=ortak, ?konu=İş teklifi ya da #ortak: bilinmeyen değer ilk konuya düşer.
export function konuBul(deger) {
  const temiz = String(deger ?? '').replace(/^#/, '').toLocaleLowerCase('tr');
  return KONULAR.find((k) => k.kod === temiz || k.ad.toLocaleLowerCase('tr') === temiz) ?? KONULAR[0];
}

export const mesajGovdesi = (mesaj) => mesaj.replace(/\s+$/, '');

// Kayıtlı taslaktan geri gelecek mesaj: yalnız elle yazılmış (kirli) metin geri gelir. Dokunulmamış şablon her açılışta
// sayfanın dilindeki şablondan yeniden kurulur (Türkçe sayfada kalan şablon İngilizce sayfada Türkçe görünmesin).
export const taslakMesaji = (taslak, konu) => (taslak?.kirli && taslak.mesaj ? taslak.mesaj : konu.sablon);

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
    kopyalaDugme.textContent = (await kopyala(adres)) ? t('kopyalandı ✓', 'copied ✓') : t('seçip kopyala', 'select and copy');
    setTimeout(() => { kopyalaDugme.textContent = t('kopyala', 'copy'); }, 2000);
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
    if (taslak && !urldenGeldi) { konu = konuBul(taslak.konu); mesaj.value = taslakMesaji(taslak, konu); kirli = mesaj.value !== konu.sablon; }
  } catch { /* bozuk taslak yok sayılır */ }
  if (!mesaj.value) mesaj.value = konu.sablon;

  const boyla = () => { mesaj.style.height = 'auto'; mesaj.style.height = `${mesaj.scrollHeight + 4}px`; };
  const durumYaz = (metin, uyari = false) => { durum.textContent = metin; durum.classList.toggle('uyari', uyari); };
  function guncelle() {
    boyla();
    chipler.forEach((c) => { c.setAttribute('role', 'button'); c.setAttribute('aria-pressed', String(c.dataset.konu === konu.ad)); });
    const govde = mesajGovdesi(mesaj.value);
    const link = mailtoLinki(adres, konu.baslik, govde);
    mailAc.href = link;
    gmailAc.href = gmailLinki(adres, konu.baslik, govde);
    durumYaz(link.length > 1900 ? t('Mesaj uzun: mail uygulaması kırpabilir. "Metni kopyala" daha güvenli.', 'The message is long: your mail app may trim it. "Copy text" is safer.') : '', link.length > 1900);
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

  const hepsi = () => `${t('Kime', 'To')}: ${adres}\n${t('Konu', 'Subject')}: ${konu.baslik}\n\n${mesajGovdesi(mesaj.value)}`;
  metinDugme.addEventListener('click', async () => {
    durumYaz((await kopyala(hepsi())) ? t('Kime, konu ve mesaj kopyalandı ✓', 'Recipient, subject, and message copied ✓') : t('Kopyalanamadı: metni seçip kopyala.', 'Could not copy: select the text and copy it.'));
  });
  // Mail uygulaması açılmazsa (pencere odağı bırakılmadıysa) metin kendiliğinden kopyalanır.
  mailAc.addEventListener('click', () => {
    let acildi = false;
    const birakildi = () => { acildi = true; };
    addEventListener('blur', birakildi, { once: true });
    setTimeout(async () => {
      removeEventListener('blur', birakildi);
      if (acildi || document.hidden) return;
      durumYaz((await kopyala(hepsi())) ? t('Mail uygulaması açılmadı: mesajını kopyaladım ✓ İstersen "Gmail\'de aç"ı dene.', 'The mail app did not open: I copied your message ✓ You can try "Open in Gmail".') : t('Mail uygulaması açılmadı. "Gmail\'de aç"ı dene.', 'The mail app did not open. Try "Open in Gmail".'), true);
    }, 1600);
  });

  guncelle();
  if (urldenGeldi) { mesaj.focus(); mesaj.setSelectionRange(mesaj.value.length, mesaj.value.length); }
}
