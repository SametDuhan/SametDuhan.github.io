import { ciz, oynat, durdur } from './piksel.js';
import { t } from './dil.js';

export function alarmDurumu(sure, esik) { return Number(sure) >= Number(esik); }

// Reading mode uses the original content; no second copy to keep in sync.
const deck = document.querySelector('.deste');
if (deck) {
  const slides = [...deck.querySelectorAll('section.slayt')];
  const toolbar = document.createElement('div'); toolbar.className = 'atolye-araclar';
  const read = document.createElement('button'); read.type = 'button'; read.className = 'dugme';
  const share = document.createElement('button'); share.type = 'button'; share.className = 'dugme'; share.textContent = t('Bağlantıyı kopyala', 'Copy link');
  const contents = document.createElement('details'); contents.className = 'icerik-menusu';
  contents.innerHTML = `<summary>${t('Bölümler', 'Sections')} ▾</summary>`;
  slides.forEach((s, i) => {
    s.dataset.sira = String(i + 1);
    const a = document.createElement('a'); a.href = `#${i + 1}`; a.textContent = `${String(i + 1).padStart(2, '0')} / ${s.querySelector('h1,h2')?.textContent || t('Bölüm', 'Section')}`;
    a.addEventListener('click', () => { contents.open = false; });
    contents.append(a);
  });
  let reading = new URLSearchParams(location.search).get('gorunum') === 'oku';
  function mode() {
    deck.classList.toggle('anlatim', reading); read.textContent = reading ? t('Sunum görünümü', 'Slide view') : t('Okuma görünümü', 'Reading view'); read.setAttribute('aria-pressed', String(reading));
    const u = new URL(location.href); reading ? u.searchParams.set('gorunum', 'oku') : u.searchParams.delete('gorunum'); history.replaceState(null, '', u);
    deck.dispatchEvent(new CustomEvent('gorunum-degisti'));
  }
  read.addEventListener('click', () => { reading = !reading; mode(); });
  share.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); share.textContent = t('Bağlantı kopyalandı ✓', 'Link copied ✓'); }
    catch { share.textContent = t('Adres çubuğundaki bağlantıyı kopyala', 'Copy the link from the address bar'); }
  });
  // Okuma görünümü ve bağlantı kopyalama "⋯" menüsünde: üst çubuk sade kalır, telefonda da erişilir.
  const more = document.createElement('details'); more.className = 'icerik-menusu diger-menu';
  more.innerHTML = `<summary aria-label="${t('Diğer seçenekler', 'More options')}">⋯</summary>`;
  read.classList.add('menu-oge'); share.classList.add('menu-oge');
  more.append(read, share);
  // aynı anda tek menü açık
  for (const [a, b] of [[contents, more], [more, contents]]) a.addEventListener('toggle', () => { if (a.open) b.open = false; });
  toolbar.append(contents, more); (deck.querySelector('.deste-ust .sayac') ?? deck.querySelector('.deste-ust')).after(toolbar); mode();
}

const az = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const bekle = (ms) => new Promise((bitti) => setTimeout(bitti, ms));

// Slayttaki animasyonlar slayt açılınca kendiliğinden başlar, slayt kapanınca ya da sekme gizlenince durur
// (deste.js slayta 'goster' / 'gizle' olayı gönderir). Slayt dışındaki sayfalarda hemen başlar.
export function slaytaBagla(oge, baslat, durdur) {
  const slayt = oge.closest('.slayt');
  if (!slayt) { baslat(); return; }
  let calisiyor = false;
  const ac = () => { if (!calisiyor && !document.hidden) { calisiyor = true; baslat(); } };
  const kapat = () => { if (calisiyor) { calisiyor = false; durdur(); } };
  slayt.addEventListener('goster', ac);
  slayt.addEventListener('gizle', kapat);
  document.addEventListener('visibilitychange', () => (document.hidden ? kapat() : !slayt.hidden && ac()));
  if (!slayt.hidden && slayt.closest('.deste')?.classList.contains('js-hazir')) ac();
  return { get calisiyor() { return calisiyor; } };
}

for (const lab of document.querySelectorAll('[data-lab]')) {
  const type = lab.dataset.lab;
  const log = lab.querySelector('.terminal');
  const adimlar = [...lab.querySelectorAll('.akis-adimlar span')];
  let jeton = 0;
  let durum = null;
  const yenidenBaslat = () => { if (durum?.calisiyor) oyna(); else if (az()) oyna(); };
  let oyna = () => {};
  if (type === 'ajan') {
    const tasks = t([
      ['Bağlantı kontrolü: /proje adresi bulunamadı.', 'Plan: doğru adresi bul, bağlantıyı güncelle.', 'Dosya düzenlendi: href="/projeler/"', 'Kontrol: bağlantı açılıyor. Görev tamamlandı ✓'],
      ['Test sonucu: beklenen 4, gelen 3.', 'Plan: sınır değerini ve hesaplamayı incele.', 'Hesaplama düzeltildi; test yeniden çalıştırıldı.', 'Kontrol: test geçti. Görev tamamlandı ✓'],
      ['Proje açıklaması ve görseller incelendi.', 'Plan: amaç, demo, mimari ve öğrenilenler.', 'Sayfa hazırlandı, bağlantılar eklendi.', 'Kontrol: sayfa ve bağlantılar çalışıyor ✓']
    ], [
      ['Link check: the /proje address was not found.', 'Plan: find the right address and update the link.', 'File edited: href="/projeler/"', 'Check: the link opens. Task complete ✓'],
      ['Test result: expected 4, got 3.', 'Plan: inspect the boundary value and the calculation.', 'Calculation fixed; test run again.', 'Check: the test passed. Task complete ✓'],
      ['Project description and images reviewed.', 'Plan: purpose, demo, architecture, and lessons learned.', 'Page prepared, links added.', 'Check: the page and links work ✓']
    ]);
    const select = lab.querySelector('select');
    oyna = async () => {
      const ben = ++jeton;
      const gorev = () => tasks[select.selectedIndex];
      if (az()) { adimlar.forEach((n) => n.classList.add('aktif')); log.textContent = gorev().map((t, i) => `${i + 1} > ${t}`).join('\n'); return; }
      while (ben === jeton) {
        log.textContent = t('$ görev bekleniyor…', '$ waiting for a task…'); adimlar.forEach((n) => n.classList.remove('aktif'));
        await bekle(900);
        for (let adim = 0; adim < 4; adim++) {
          if (ben !== jeton) return;
          adimlar.forEach((n, i) => n.classList.toggle('aktif', i <= adim));
          log.textContent += `\n${adim + 1} > ${gorev()[adim]}`;
          await bekle(1500);
        }
        await bekle(2800);
      }
    };
    select.addEventListener('change', yenidenBaslat);
  }
  if (type === 'hook') {
    const kutu = lab.querySelector('input'), metin = lab.querySelector('[data-durum]');
    oyna = async () => {
      const ben = ++jeton;
      do {
        const bagli = kutu.checked;
        lab.classList.remove('kutla'); adimlar.forEach((n) => n.classList.remove('aktif'));
        metin.textContent = t('Görev çalışıyor…', 'Task running…'); log.textContent = t('$ Stop olayını bekliyor…', '$ waiting for the Stop event…');
        if (!az()) await bekle(1500);
        if (ben !== jeton) return;
        void lab.offsetWidth;
        lab.classList.toggle('kutla', bagli);
        metin.textContent = bagli ? t('İş tamamlandı. Bildirim geldi ✓', 'Job complete. The notification arrived ✓') : t('İş tamamlandı. Hook bağlı değil.', 'Job complete. The hook is not connected.');
        log.textContent = bagli ? t('$ Stop alındı\n→ hook komutu çağrıldı\n→ PowerShell: piksel bildirimi gösterildi ✓', '$ Stop received\n→ hook command called\n→ PowerShell: pixel notification shown ✓') : t('$ Stop alındı\n→ bağlı komut yok; bildirim gösterilmedi', '$ Stop received\n→ no connected command; no notification shown');
        for (let i = 0; i < (bagli ? 4 : 2); i++) { adimlar[i].classList.add('aktif'); if (!az()) await bekle(450); }
        if (az()) return;
        await bekle(4200);
      } while (ben === jeton);
    };
    kutu.addEventListener('change', yenidenBaslat);
  }
  if (type === 'alarm') {
    const select = lab.querySelector('select'), cikti = lab.querySelector('[data-sure]'), sonuc = lab.querySelector('.alarm-sonuc');
    const dolum = lab.querySelector('[data-dolum]'), isaret = lab.querySelector('[data-isaret]');
    const EN_COK = 60;
    const goster = (sure) => {
      const aktif = alarmDurumu(sure, select.value);
      cikti.textContent = Math.round(sure);
      dolum.style.transform = `scaleX(${sure / EN_COK})`;
      isaret.style.left = `${(Number(select.value) / EN_COK) * 100}%`;
      sonuc.textContent = aktif ? t('● Alarm tetiklenir. Sinyal seçilen eşiği geçti.', '● The alarm fires. The signal passed the chosen threshold.') : t('○ Alarm bekler. Bu süre seçilen eşikten kısa.', '○ The alarm waits. This duration is shorter than the chosen threshold.');
      lab.classList.toggle('alarm-aktif', aktif);
    };
    // Süre kendiliğinden akar (yaklaşık 10 sn'de 60 saniye); eşiği geçince alarm çalar, sonra baştan başlar.
    oyna = async () => {
      const ben = ++jeton;
      if (az()) { goster(EN_COK); return; }
      while (ben === jeton) {
        const bas = performance.now();
        let sure = 1;
        while (ben === jeton && sure < EN_COK) { goster(sure); await bekle(100); sure = Math.min(EN_COK, 1 + ((performance.now() - bas) / 1000) * 6); }
        if (ben !== jeton) return;
        goster(EN_COK);
        await bekle(2600);
      }
    };
    select.addEventListener('change', yenidenBaslat);
  }
  durum = slaytaBagla(lab, () => oyna(), () => { jeton++; });
  if (az()) oyna();
}

for (const demo of document.querySelectorAll('[data-piksel-demo]')) {
  const canvas = demo.querySelector('canvas');
  if (demo.dataset.pikselDemo === 'codex') {
    const img = new Image(); img.src = new URL('../img/chatgpt-done.png', import.meta.url).href;
    const ctx = canvas.getContext('2d'); let token = 0;
    const draw = (frame) => { ctx.fillStyle = '#111919'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.imageSmoothingEnabled = false; ctx.drawImage(img, frame * 320, 0, 320, 270, (canvas.width - 260) / 2, 0, 260, 220); };
    img.addEventListener('load', () => draw(5));
    demo.querySelector('button').addEventListener('click', () => {
      if (!img.complete || !img.naturalWidth) return;
      const id = ++token, start = performance.now();
      const tick = now => { if (id !== token || document.hidden) return; const t = now - start; draw(matchMedia('(prefers-reduced-motion: reduce)').matches ? 5 : Math.min(5, Math.floor(t / 650))); if (t < 3900 && !matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    // data-otomatik: slayt açılınca animasyon kendiliğinden başlar ve döngüde tekrarlanır.
    if (demo.hasAttribute('data-otomatik')) {
      let dongu = 0;
      slaytaBagla(demo, () => {
        const ben = ++dongu;
        const tekrar = () => { if (ben !== dongu) return; demo.querySelector('button').click(); if (!az()) setTimeout(tekrar, 5600); };
        tekrar();
      }, () => { dongu++; token++; });
    }
  } else {
    ciz(canvas, 3100);
    demo.querySelector('button')?.addEventListener('click', () => oynat(canvas));
    // data-otomatik: slayt açılınca animasyon kendiliğinden başlar ve döngüde tekrarlanır.
    if (demo.hasAttribute('data-otomatik')) {
      let jeton = 0;
      const dongu = async () => {
        const ben = ++jeton;
        while (ben === jeton) { await oynat(canvas); if (ben !== jeton || az()) return; await bekle(1400); }
      };
      slaytaBagla(demo, dongu, () => { jeton++; durdur(); });
    }
  }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) durdur(); });

// Videolar slayt açılınca kendiliğinden, sessiz ve döngüde oynar; kontrol çubuğu yok, tıklayınca durur/başlar.
// Hareketi azalt tercihinde kendiliğinden oynamaz (poster görünür), tıklayınca oynar.
for (const video of document.querySelectorAll('video')) {
  video.muted = true; video.loop = true; video.removeAttribute('controls');
  video.title = t('Durdurmak ya da oynatmak için tıkla', 'Click to pause or play');
  video.addEventListener('click', () => (video.paused ? video.play().catch(() => {}) : video.pause()));
  slaytaBagla(video, () => { if (!az()) { video.currentTime = 0; video.play().catch(() => {}); } }, () => video.pause());
}
