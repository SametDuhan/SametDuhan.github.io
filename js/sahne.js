// Giriş sahnesi: tüplü monitörde akan senaryolar, ardından claude-done-pixel; monitörün kablosu
// karelerin altındaki şeride gider, mini karakterler bu yoldan karelere yürür.
// Saf fonksiyonlar Node'da sınanır; baslatSahne() tarayıcıya bağlar.

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

export function rotalar({ soket, kareler, bosluk, zemin }) {
  const { x: kx, y: ky, w: kw, h: kh } = kareler;
  const sutW = (kw - bosluk) / 2, satH = (kh - bosluk) / 2;
  const barY = ky + kh + 16, barL = kx - 16, barR = kx + kw + 16;
  // Kablo soketten zemine sarkar, yazı sütununun solundan şeridin sol ucuna alttan bağlanır.
  const a = soket.x + 3, orta = (a + barL) / 2;
  const kablo = `M${a} ${soket.y} C ${a + 28} ${soket.y}, ${orta - 14} ${zemin}, ${orta} ${zemin} `
    + `C ${orta + 14} ${zemin}, ${barL} ${zemin - 10}, ${barL} ${barY + 3}`;
  const ust = ky + satH / 2;
  const hat = [
    [kx - 8, [[kx - 8, ust], [kx, ust]]],
    [kx + kw + 8, [[kx + kw + 8, ust], [kx + kw, ust]]],
    [kx + sutW / 2, [[kx + sutW / 2, ky + kh]]],
    [kx + kw - sutW / 2, [[kx + kw - sutW / 2, ky + kh]]],
  ];
  const yol = (son) => son.map(([x, y]) => `L ${x} ${y}`).join(' ');
  return {
    kablo,
    bar: { x: barL, y: barY, w: barR - barL },
    hatlar: hat.map(([hx, son]) => ({ x: hx, d: `M${hx} ${barY} ${yol(son)}` })),
    rotalar: hat.map(([hx, son]) => `${kablo} L ${hx} ${barY} ${yol(son)}`),
    uclar: hat.map(([, son]) => ({ x: son.at(-1)[0], y: son.at(-1)[1] })),
  };
}

const VURGU = '92,207,255';
const NS = 'http://www.w3.org/2000/svg';

export function baslatSahne(kok) {
  const az = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ekran = kok.querySelector('#ekran'), ec = ekran.getContext('2d');
  const mini = kok.querySelector('.mini'), mc = mini.getContext('2d');
  const svg = kok.querySelector('svg.kablo'), kar = kok.querySelector('.kareler');
  const kareler = [...kar.querySelectorAll('.kare')];
  const g = (id) => svg.querySelector(`#${id}`);
  const yap = (p, ad, at) => { const e = document.createElementNS(NS, ad); for (const a in at) e.setAttribute(a, at[a]); p.append(e); return e; };
  const yan = (e, ms) => { e.classList.add('yan'); setTimeout(() => e.classList.remove('yan'), ms); };

  let EW = 0, EH = 0, SW = 0, SH = 0, ROTA = [], L_ROTA = [], SOKETCIK = [], kabloAcik = false;
  let senaryo = 0, satirlar = SENARYOLAR[0], hiz = 0, yazilan = 0, faz = 'kod', fazBas = 0, miniCikti = false;
  let minis = [], akim = [], sonrakiAkim = 0, son = performance.now(), kare = 0;

  function yeniTur(r = Math.random()) {
    senaryo = sonrakiSenaryo(senaryo, Math.random(), SENARYOLAR.length);
    satirlar = SENARYOLAR[senaryo];
    hiz = satirlar.join('\n').length / turSuresi(r);
    yazilan = 0;
  }

  function boyutla() {
    const o = Math.min(devicePixelRatio || 1, 2);
    const e = ekran.getBoundingClientRect();
    EW = e.width; EH = e.height;
    ekran.width = EW * o; ekran.height = EH * o; ec.setTransform(o, 0, 0, o, 0, 0);
    const s = kok.getBoundingClientRect();
    SW = s.width; SH = s.height;
    mini.width = SW * o; mini.height = SH * o; mc.setTransform(o, 0, 0, o, 0, 0);
    kabloAcik = getComputedStyle(svg).display !== 'none';
    if (kabloAcik) kabloKur(s);
  }

  function kabloKur(s) {
    const kasa = kok.querySelector('.kasa').getBoundingClientRect(), k = kar.getBoundingClientRect();
    const r = rotalar({
      soket: { x: kasa.right - s.left + 3, y: kasa.bottom - s.top - 34 },
      kareler: { x: k.left - s.left, y: k.top - s.top, w: k.width, h: k.height },
      bosluk: parseFloat(getComputedStyle(kar).rowGap) || 20,
      zemin: s.height - 24,
    });
    const so = g('soket');
    so.setAttribute('x', kasa.right - s.left - 1); so.setAttribute('y', kasa.bottom - s.top - 41);
    const b = g('bar');
    b.setAttribute('x', r.bar.x); b.setAttribute('y', r.bar.y - 3); b.setAttribute('width', r.bar.w);
    g('kablo-yol').setAttribute('d', r.kablo);
    for (const id of ['hatlar', 'soketler', 'rotalar']) g(id).replaceChildren();
    SOKETCIK = r.hatlar.map((h) => {
      yap(g('hatlar'), 'path', { class: 'hat', d: h.d });
      return yap(g('soketler'), 'rect', { class: 'soketcik', x: h.x - 3, y: r.bar.y - 1.5, width: 6, height: 3, rx: 1 });
    });
    ROTA = r.rotalar.map((d) => yap(g('rotalar'), 'path', { d, fill: 'none', stroke: 'none' }));
    L_ROTA = ROTA.map((p) => p.getTotalLength());
  }

  function ekranCiz(simdi) {
    ec.fillStyle = '#04070b';
    ec.fillRect(0, 0, EW, EH);
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

  function miniGonder() {
    if (!kabloAcik) return;
    const n = 1 + Math.floor(Math.random() * 3), hedef = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    for (let i = 0; i < n; i++) minis.push({ d: 0, bekle: i * 520, hedef: hedef[i] });
  }

  function miniAdim(dt, simdi) {
    mc.clearRect(0, 0, SW, SH);
    const um = 1.5, t = simdi / 1000;
    minis = minis.filter((m) => {
      if (m.bekle > 0) { m.bekle -= dt; return true; }
      const r = ROTA[m.hedef], L = L_ROTA[m.hedef];
      m.d = Math.min(L, m.d + dt * 0.17);
      const p = r.getPointAtLength(m.d), q = r.getPointAtLength(Math.min(L, m.d + 2));
      const dx = q.x - p.x, dikey = Math.abs(dx) < 0.4;
      const bob = -Math.abs(Math.sin(t * 9 * Math.PI)) * 1.2 * um;
      pikselKarakter(mc, { x: p.x - 9 * um, yOff: bob, look: dikey ? 0 : dx > 0 ? 1 : -1, run: true, tilt: 0, armUp: false, air: false, legPhase: Math.floor(t * 9) % 2 }, p.y - (dikey ? 0 : 3), um, t);
      if (m.d >= L) { yan(kareler[m.hedef], 420); yan(SOKETCIK[m.hedef], 420); return false; }
      return true;
    });
  }

  function akimAdim(dt, simdi) {
    if (simdi > sonrakiAkim) {
      sonrakiAkim = simdi + 1600 + Math.random() * 1600;
      akim.push({ i: Math.floor(Math.random() * 4), d: 0, c: yap(g('akimlar'), 'circle', { class: 'darbe', r: 2 }) });
    }
    akim = akim.filter((a) => {
      a.d += dt * 0.28;
      if (a.d >= L_ROTA[a.i]) { a.c.remove(); yan(SOKETCIK[a.i], 220); return false; }
      const p = ROTA[a.i].getPointAtLength(a.d);
      a.c.setAttribute('cx', p.x); a.c.setAttribute('cy', p.y);
      return true;
    });
  }

  function adim(simdi) {
    const dt = Math.min(64, simdi - son);
    son = simdi;
    if (faz === 'kod') {
      yazilan += dt * hiz;
      if (yazilan >= satirlar.join('\n').length) { faz = 'piksel'; fazBas = simdi; }
    } else {
      const t = simdi - fazBas;
      if (!miniCikti && t > PIKSEL_SURE - 900) { miniCikti = true; miniGonder(); }
      if (t > PIKSEL_SURE + 600) { faz = 'kod'; miniCikti = false; yeniTur(); }
    }
    ekranCiz(simdi);
    if (kabloAcik) { miniAdim(dt, simdi); akimAdim(dt, simdi); }
    kare = requestAnimationFrame(adim);
  }

  boyutla();
  new ResizeObserver(boyutla).observe(kok);
  if (az) {
    yazilan = Infinity;
    ekranCiz(0);
    return;
  }
  yeniTur();
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(kare);
    if (!document.hidden) { son = performance.now(); kare = requestAnimationFrame(adim); }
  });
  kare = requestAnimationFrame(adim);
}
