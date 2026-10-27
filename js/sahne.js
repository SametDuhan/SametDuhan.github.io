// Monitör: kod, robot, logolar ve piksel karakter birbirinden bağımsız karışık gelir.
import { ekranSanati } from './ekran-sanat.js';
import { kareDurumu, pikselKarakter, SURE as PIKSEL_SURE } from './piksel.js';

export const SENARYOLAR = [
`export function bagla(kok) {
  const slaytlar = [...kok.querySelectorAll('section.slayt')];
  let konum = -1;
  function git(i) {
    const yeni = sikistir(i, slaytlar.length);
    if (yeni === konum) return;
    konum = yeni;
  }
}
$ npm test
✓ testler geçti
✓ Claude bitti`,
`$ claude "sayfadaki kırık linki düzelt"
# ajan görevi aldı
→ bak: sayfada 4 link var
→ bak: /projelr adresi açılmıyor
→ karar ver: doğrusu /projeler olmalı
→ yap: index.html düzenlendi
→ kontrol et: link açılıyor
✓ görev tamam, rapor yazıldı
✓ Claude bitti`,
`# ROBOT-7 açılıyor...
→ kamera ............ hazır
→ mesafe sensörü .... hazır
→ sol motor ......... hazır
→ sağ motor ......... hazır
→ batarya ........... %100

     [o_o]
    /|___|\\
     d   b
> merhaba insan.
✓ Claude bitti`,
`$ claude "robot nedir?"
# Robot: çevresini algılayan,
# karar veren ve hareket eden makine.
$ claude "AI ajanı nedir?"
# Aynı şeyi yazılımda yapar:
# bak → karar ver → yap → kontrol et.
# Araçları: dosya, komut, arama.
✓ Claude bitti`,
`# Asimov'un Üç Robot Yasası (1942)
1. Robot bir insana zarar veremez,
   hareketsiz kalıp zarar görmesine
   de izin veremez.
2. Robot, 1. yasayla çelişmedikçe
   insanların emirlerine uyar.
3. Robot, ilk iki yasayla çelişmedikçe
   kendi varlığını korur.
✓ Claude bitti`,
`$ python egit.py
# model eğitiliyor...
tur 1  [██░░░░░░░░]
tur 2  [████░░░░░░]
tur 3  [██████░░░░]
tur 4  [████████░░]
tur 5  [██████████]
# model kaydedildi: model.pt
✓ Claude bitti`,
].map((m) => m.split('\n'));

export function turSuresi(r) {
  return 4000 + r * 6000;
}

export function sonrakiSenaryo(onceki, r, n) {
  // önceki hariç n-1 seçenekten birini seç
  const i = Math.floor(r * (n - 1));
  return i >= onceki ? i + 1 : i;
}

export function yazilanSatirlar(satirlar, yazilan) {
  const sonuc = [];
  let kalan = Math.floor(yazilan);
  for (const s of satirlar) {
    if (kalan <= 0) break;
    sonuc.push(s.slice(0, kalan));
    kalan -= s.length + 1;
  }
  return sonuc;
}

export const EKRAN_SAHNELERI = ['kod', 'robot', 'anthropic', 'openai', 'gemini', 'piksel'];
export function sonrakiSahne(onceki, r) {
  const i = Math.min(EKRAN_SAHNELERI.length - 2, Math.floor(r * (EKRAN_SAHNELERI.length - 1)));
  const secenekler = EKRAN_SAHNELERI.filter(s => s !== onceki);
  return secenekler[i];
}
const VURGU = '92,207,255';
export function baslatSahne(kok) {
  const sanatCiz = ekranSanati();
  const az = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ekran = kok.querySelector('#ekran'), ec = ekran.getContext('2d');
  let EW = 0, EH = 0, senaryo = 0, satirlar = SENARYOLAR[0], hiz = 0, yazilan = 0;
  let faz = 'sanat', sanatIndeksi = 0, fazBas = performance.now(), sahne = 'robot';
  let son = performance.now(), kare = 0;
  function yeniTur(r = Math.random()) {
    senaryo = sonrakiSenaryo(senaryo, Math.random(), SENARYOLAR.length);
    satirlar = SENARYOLAR[senaryo]; hiz = satirlar.join('\n').length / turSuresi(r); yazilan = 0;
  }
  function sec(simdi) {
    sahne = sonrakiSahne(sahne, Math.random()); fazBas = simdi;
    faz = sahne === 'kod' || sahne === 'piksel' ? sahne : 'sanat';
    sanatIndeksi = ['robot', 'anthropic', 'openai', 'gemini'].indexOf(sahne);
    if (faz === 'kod') yeniTur();
    if (faz === 'piksel') yazilan = 0;
    ekran.dataset.sahne = sahne;
  }
  function boyutla() {
    const o = Math.min(devicePixelRatio || 1, 2), e = ekran.getBoundingClientRect();
    EW = e.width; EH = e.height; ekran.width = EW * o; ekran.height = EH * o; ec.setTransform(o, 0, 0, o, 0, 0);
    if (az) ekranCiz(0);
  }
  function ekranCiz(simdi) {
    ec.fillStyle = '#04070b';
    ec.fillRect(0, 0, EW, EH);
    if (faz === 'sanat') { sanatCiz(ec, EW, EH, sanatIndeksi, simdi - fazBas, az); return; }
    const fs = Math.max(8, EW / 36), sat = fs * 1.45;
    const u = Math.max(2, Math.floor((EH * 0.52) / 31));
    const sigan = Math.max(1, Math.floor((EH - 31 * u - fs * 0.6) / sat));
    ec.font = `${fs}px 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace`;
    ec.textBaseline = 'top';
    const gorunen = yazilanSatirlar(satirlar, yazilan), ilk = Math.max(0, gorunen.length - sigan);
    ec.shadowColor = `rgba(${VURGU},.6)`;
    ec.shadowBlur = 6;
    gorunen.slice(ilk).forEach((s, i) => {
      ec.fillStyle = s.startsWith('✓') ? '#7ee787' : s.startsWith('$') ? '#e6edf3' : s.startsWith('#') ? 'rgba(160,175,190,.75)' : s.startsWith('>') ? '#ffd27a' : `rgba(${VURGU},.9)`;
      ec.fillText(s, fs * 0.8, fs * 0.6 + i * sat);
    });
    ec.shadowBlur = 0;
    if (faz === 'kod' && Math.floor(simdi / 450) % 2) {
      const sonSatir = gorunen.at(-1) || '', i = Math.max(0, gorunen.length - 1 - ilk);
      ec.fillStyle = `rgba(${VURGU},.9)`;
      ec.fillRect(fs * 0.8 + ec.measureText(sonSatir).width + 2, fs * 0.6 + i * sat, fs * 0.55, fs);
    }
    const zem = EH - 2 * u;
    ec.fillStyle = `rgba(${VURGU},.12)`;
    ec.fillRect(0, zem + u, EW, 1);
    if (faz === 'piksel') {
      const t = (simdi - fazBas) / 1000;
      pikselKarakter(ec, kareDurumu(t, EW, u), zem, u, t);
    }
  }


  function adim(simdi) {
    const dt = Math.min(64, simdi - son); son = simdi;
    if (faz === 'kod') {
      yazilan += dt * hiz;
      if (yazilan >= satirlar.join('\n').length && simdi - fazBas > 5000) sec(simdi);
    } else if (simdi - fazBas > (faz === 'piksel' ? PIKSEL_SURE + 300 : 4600)) sec(simdi);
    ekranCiz(simdi); kare = requestAnimationFrame(adim);
  }
  sec(performance.now()); boyutla(); new ResizeObserver(boyutla).observe(kok);
  if (az) { faz = 'sanat'; sanatIndeksi = 0; ekranCiz(0); return; }
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(kare);
    if (!document.hidden) { son = performance.now(); fazBas = son; kare = requestAnimationFrame(adim); }
  });
  kare = requestAnimationFrame(adim);
}
