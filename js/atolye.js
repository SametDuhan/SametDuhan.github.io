import { ciz, oynat, durdur } from './piksel.js';

export function alarmDurumu(sure, esik) { return Number(sure) >= Number(esik); }

// Reading mode uses the original content; no second copy to keep in sync.
const deck = document.querySelector('.deste');
if (deck) {
  const slides = [...deck.querySelectorAll('section.slayt')];
  const toolbar = document.createElement('div'); toolbar.className = 'atolye-araclar';
  const read = document.createElement('button'); read.type = 'button'; read.className = 'dugme';
  const share = document.createElement('button'); share.type = 'button'; share.className = 'dugme'; share.textContent = 'Slayt bağlantısını kopyala';
  const contents = document.createElement('details'); contents.className = 'icerik-menusu';
  contents.innerHTML = '<summary>Bölümlere git</summary>';
  slides.forEach((s, i) => {
    s.dataset.sira = String(i + 1);
    const a = document.createElement('a'); a.href = `#${i + 1}`; a.textContent = `${String(i + 1).padStart(2, '0')} / ${s.querySelector('h1,h2')?.textContent || 'Bölüm'}`;
    a.addEventListener('click', () => { contents.open = false; if (deck.classList.contains('okuma')) s.scrollIntoView({ block: 'start' }); });
    contents.append(a);
  });
  let reading = new URLSearchParams(location.search).get('gorunum') === 'oku';
  function mode() {
    deck.classList.toggle('okuma', reading); read.textContent = reading ? 'Slayt görünümüne dön' : 'Tek sayfada oku'; read.setAttribute('aria-pressed', String(reading));
    const u = new URL(location.href); reading ? u.searchParams.set('gorunum', 'oku') : u.searchParams.delete('gorunum'); history.replaceState(null, '', u);
  }
  read.addEventListener('click', () => { reading = !reading; mode(); });
  share.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); share.textContent = 'Bağlantı kopyalandı ✓'; }
    catch { share.textContent = 'Adres çubuğundaki bağlantıyı kopyala'; }
  });
  toolbar.append(read, contents, share); deck.querySelector('.deste-ust').after(toolbar); mode();
}

for (const lab of document.querySelectorAll('[data-lab]')) {
  const type = lab.dataset.lab;
  const log = lab.querySelector('.terminal');
  if (type === 'ajan') {
    let step = 0;
    const tasks = [
      ['Bağlantı kontrolü: /proje adresi bulunamadı.', 'Plan: doğru adresi bul, bağlantıyı güncelle.', 'Dosya düzenlendi: href="/projeler/"', 'Kontrol: bağlantı açılıyor. Görev tamamlandı ✓'],
      ['Test sonucu: beklenen 4, gelen 3.', 'Plan: sınır değerini ve hesaplamayı incele.', 'Hesaplama düzeltildi; test yeniden çalıştırıldı.', 'Kontrol: test geçti. Görev tamamlandı ✓'],
      ['Proje açıklaması ve görseller incelendi.', 'Plan: amaç, demo, mimari ve öğrenilenler.', 'Sayfa hazırlandı, bağlantılar eklendi.', 'Kontrol: sayfa ve bağlantılar çalışıyor ✓']
    ];
    const select = lab.querySelector('select'); const button = lab.querySelector('[data-adim]');
    function reset() { step = 0; log.textContent = '$ görev bekleniyor…'; button.disabled = false; lab.querySelectorAll('.akis-adimlar span').forEach(n => n.classList.remove('aktif')); }
    select.addEventListener('change', reset); lab.querySelector('[data-reset]').addEventListener('click', reset);
    button.addEventListener('click', () => { if (step >= 4) return; lab.querySelectorAll('.akis-adimlar span').forEach((n,i) => n.classList.toggle('aktif', i <= step)); log.textContent += `\n${step + 1} > ${tasks[select.selectedIndex][step]}`; step++; button.disabled = step === 4; });
  }
  if (type === 'hook') {
    lab.querySelector('[data-bitir]').addEventListener('click', () => {
      const on = lab.querySelector('input').checked;
      lab.classList.remove('kutla'); void lab.offsetWidth; lab.classList.toggle('kutla', on);
      lab.querySelector('[data-durum]').textContent = on ? 'İş tamamlandı. Bildirim geldi ✓' : 'İş tamamlandı. Hook bağlı değil.';
      log.textContent = on ? '$ Stop alındı\n→ hook komutu çağrıldı\n→ PowerShell: piksel bildirimi gösterildi ✓' : '$ Stop alındı\n→ bağlı komut yok; bildirim gösterilmedi';
      lab.querySelectorAll('.akis-adimlar span').forEach((n,i) => n.classList.toggle('aktif', on || i < 2));
    });
  }
  if (type === 'alarm') {
    const range = lab.querySelector('input'); const select = lab.querySelector('select');
    const update = () => { const active = alarmDurumu(range.value, select.value); lab.querySelector('output').textContent = range.value; lab.querySelector('.alarm-sonuc').textContent = active ? '● Alarm tetiklenir. Sinyal seçilen eşiği geçti.' : '○ Alarm bekler. Bu süre seçilen eşikten kısa.'; lab.classList.toggle('alarm-aktif', active); };
    range.addEventListener('input', update); select.addEventListener('change', update); update();
  }
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
  } else {
    ciz(canvas, 3100); demo.querySelector('button').addEventListener('click', () => oynat(canvas));
  }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) durdur(); });

for (const video of document.querySelectorAll('video')) {
  video.closest('.slayt')?.addEventListener('gizle', () => video.pause());
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
}
