// Piksel ana sayfa: devre kartı zemini, ışınlar (kutuya varınca sarı yanar), dokunulan yere koşup şahinle yan yana duran Claude Code (kendiliğinden gelmez), bölüm başlığı çözme animasyonu,
// karakter balonları, Projeler önizlemesi ve klavye kısayolları. js/piksel-ana.js bileşeninin içinden çalışır (root = gölge DOM).
import { pikselKarakter } from './piksel.js';
import { SAYILAR } from './sayilar.js';
import { t, EN } from './dil.js';
import { sahinKur, sahinBoyu } from './piksel-ana-sahin.js';

const kok = document.documentElement;
const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SERIT = 56, ENFAZLA = 1;
const SARI = '255,216,74';   // ışın kutuya varınca yanan sarı
const C = { zemin: '#211f1c', nokta: '#2f2c28', soluk: '#4a3128', orta: '#7a4a38', turuncu: '#d97757', cip: '#322e2a' };
const ease = (p) => 1 - Math.pow(1 - p, 3);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const piksel = () => kok.dataset.gorunum === 'piksel';

export function baslatKanvas(root, yollar) {
  const zemin = root.getElementById('zemin'), hareket = root.getElementById('hareket');
  const zc = zemin.getContext('2d'), hc = hareket.getContext('2d');
  const baslangic = performance.now();
  const sahin = sahinKur(root);
  let W, H, U, X0, pads = [], kar = [], dalgalar = [], son = 0;

  /* ---------- ölçü ve statik devre kartı ---------- */
  function olc() {
    if (!piksel()) return;
    W = innerWidth; H = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    for (const c of [zemin, hareket]) { c.width = W * dpr; c.height = H * dpr; }
    zc.setTransform(dpr, 0, 0, dpr, 0, 0); hc.setTransform(dpr, 0, 0, dpr, 0, 0);
    U = Math.max(3, Math.round(W / 290));
    const dar = W <= 1100, alan = H - SERIT;  // 1100 pikselden dar ekranda ana sayfa tek sütun (css/piksel-ana.css ile aynı eşik)
    X0 = W * .355;
    const sabit = [[.54, .17], [.60, .38], [.57, .59], [.62, .80]];
    pads = [...root.querySelectorAll('.liman')].map((a, i) => dar ? { x: sabit[i][0] * W, y: SERIT + sabit[i][1] * alan } : { x: a.offsetLeft, y: SERIT + a.offsetTop });
    const yeni = () => ({ phase: 'rest0', t0: 0, x: X0, xs: X0, kalUntil: 0 });   // Claude kendiliğinden gelmez: yalnız dokunulunca
    kar = pads.map((p, i) => Object.assign(kar[i] ?? yeni(), { hedef: sol(i, p) }));
    boya();
  }
  // Claude'un duracağı sol kenar: dar ekranda iskelenin hemen önü; geniş ekranda şahine de yer kalacak kadar geri (Claude 24U + boşluk 2U + şahin 16 piksel)
  const sol = (i, p = pads[i]) => W <= 1100 ? p.x - 25 * U : Math.max(X0 + 2 * U, p.x - 48 * U);
  const kare = (x, y, w, h, renk) => { zc.fillStyle = renk; zc.fillRect(Math.round(x), Math.round(y), w, h); };
  function via(x, y) { const r = U * 2; kare(x - r, y - r, r * 2, r * 2, C.zemin); zc.strokeStyle = C.turuncu; zc.lineWidth = 3; zc.strokeRect(Math.round(x - r) + 1.5, Math.round(y - r) + 1.5, r * 2 - 3, r * 2 - 3); }
  function boya() {
    zc.fillStyle = C.zemin; zc.fillRect(0, 0, W, H);
    const G = U * 8;
    for (let y = SERIT + G / 2; y < H; y += G) for (let x = G / 2; x < W; x += G) kare(x, y, 2, 2, C.nokta);
    const iz = U * 1.2;
    const yatay = (x1, x2, y, r = C.soluk) => kare(Math.min(x1, x2), y - iz / 2, Math.abs(x2 - x1), iz, r);
    const dikey = (x, y1, y2, r = C.soluk) => kare(x - iz / 2, Math.min(y1, y2), iz, Math.abs(y2 - y1), r);
    const ys = pads.map((p) => p.y);
    dikey(X0, Math.min(...ys) - 70, Math.max(...ys) + 70, C.orta);
    dikey(X0 - iz * 2.4, Math.min(...ys) - 40, Math.max(...ys) + 40, C.soluk);
    pads.forEach((p) => { yatay(X0, p.x, p.y, C.orta); yatay(X0 - iz * 2.4, X0, p.y - iz * 2, C.soluk); via(X0, p.y); if (W <= 1100) via(p.x, p.y); }); // geniş ekranda uç noktayı DOM'daki iskele çizer (iki kare üst üste binmesin)
  }

  /* ---------- koşan karakterler: en çok biri aynı anda görünür ---------- */
  const D_IN = 2.0, D_OUT = 1.8, T_JUMP = .55, T_WAVE = 1.5;
  const basla = (k, faz, tt) => { k.phase = faz; k.t0 = tt; k.xs = k.x; };
  function adim(k, tt, i) {
    const gecen = tt - k.t0;
    if (k.phase === 'rest0') { k.x = X0; return { kapali: true }; }
    if (k.phase === 'sol') { const p = clamp(gecen / .35, 0, 1); if (p >= 1) basla(k, 'rest0', tt); return { sol: p, look: 1 }; }
    if (k.phase === 'in') { const p = clamp(gecen / clamp(Math.abs(k.hedef - k.xs) / (30 * U), .4, D_IN), 0, 1); k.x = k.xs + (k.hedef - k.xs) * ease(p); if (p >= 1) basla(k, 'jump', tt); return { run: p < 1, look: k.hedef >= k.xs ? 1 : -1 }; }
    if (k.phase === 'jump') { const p = (gecen % T_JUMP) / T_JUMP; if (gecen > 2 * T_JUMP) basla(k, 'wave', tt); return { yOff: -Math.sin(p * Math.PI) * 5 * U, air: true, look: 1 }; }
    if (k.phase === 'wave') { const p = (gecen % .7) / .7; if (gecen > T_WAVE) basla(k, 'dur', tt); return { armUp: true, tilt: Math.sin(p * Math.PI * 2) * 3.2, look: 1 }; }
    if (k.phase === 'dur') { if (tt > k.kalUntil) { basla(k, 'out', tt); if (W > 1100) sahin.iskele(null, tt); } return { look: 1 }; }   // Claude giderken şahin de eve döner
    if (k.phase === 'out') { const p = clamp(gecen / D_OUT, 0, 1); k.x = k.xs + (X0 - k.xs) * ease(p); if (p >= 1) basla(k, 'rest0', tt); return { run: true, look: -1 }; }
    return {};
  }
  const simdi = () => (performance.now() - baslangic) / 1000;
  function yerAc(i, tt) {
    const baskalari = kar.map((k, n) => [k, n]).filter(([k, n]) => n !== i && k.phase !== 'rest0' && k.phase !== 'sol');
    while (kar.filter((k, n) => n !== i && k.phase !== 'rest0').length >= ENFAZLA && baskalari.length) { const [k] = baskalari.shift(); basla(k, 'sol', tt); }
  }
  // i. hatta, hx noktasına gel ve tut sn saniye (Infinity: bırakılana dek); geniş ekranda şahin hemen sağında durur
  function gel(i, hx, tut) {
    const k = kar[i], tt = simdi(); if (!k) return;
    k.hedef = hx; k.kalUntil = tt + tut;
    if (['dur', 'wave', 'jump'].includes(k.phase) && Math.abs(k.x - hx) < 2 * U) { if (k.phase === 'dur') basla(k, 'jump', tt); }
    else { yerAc(i, tt); basla(k, 'in', tt); }
    if (W > 1100) { const u = sahinBoyu(U); sahin.iskele({ x: hx + 26 * U + 9 * u, y: pads[i].y - U * .6 - 1 }, tt); }
  }

  function ciz(now) {
    if (!piksel()) { setTimeout(() => requestAnimationFrame(ciz), 400); return; }
    if (now - son < 33) { requestAnimationFrame(ciz); return; }
    son = now;
    const tt = (now - baslangic) / 1000, intro = AZ ? 1 : clamp(tt / 1.6, 0, 1), iz = U * 1.2;
    hc.clearRect(0, 0, W, H);
    pads.forEach((p, i) => {
      const L = p.x - X0, sp = .12 * (1 + i * .1), bw = W <= 1100 ? U * 4 : 22, xmax = p.x - bw / 2, qv = (xmax - U * 2.2 - X0) / L;   // xmax: kutunun sol kenarı, ışın burada biter
      const parca = (x1, x2, r) => { const a = Math.max(x1, X0), b = Math.min(x2, xmax); if (b > a) { hc.fillStyle = r; hc.fillRect(Math.round(a), Math.round(p.y - iz / 2), Math.round(b) - Math.round(a), iz); } };
      let yan = 0;
      for (let k = 0; k < 3; k++) { const q = ((tt * sp + k / 3 + i * .17) % 1), x = X0 + L * q;
        if (x < X0 + L * intro) { parca(x, x + U * 2.2, 'rgba(240,154,120,.95)'); parca(x - U * 2.2, x, 'rgba(240,154,120,.35)'); }
        if (intro >= 1 && tt > 2.4) { const s = ((q - qv) % 1 + 1) % 1 / sp; if (s < .6) yan = Math.max(yan, Math.min(1, s / .05) * (1 - s / .6)); } }   // ışının ucu kutuya değince kutu sarı yanar, sönerek biter
      if (yan > 0.02 && kar[i]?.kalUntil !== Infinity) {   // üzerine gelinen kutu döner, yanmaz
        hc.fillStyle = `rgba(${SARI},${(yan * .92).toFixed(2)})`; hc.fillRect(Math.round(p.x - bw / 2), Math.round(p.y - bw / 2), bw, bw);
        const g = Math.round(2 + (1 - yan) * 8); hc.strokeStyle = `rgba(${SARI},${(yan * .55).toFixed(2)})`; hc.lineWidth = 3; hc.strokeRect(Math.round(p.x - bw / 2) - g, Math.round(p.y - bw / 2) - g, bw + g * 2, bw + g * 2); }
      const k = kar[i]; if (!k) return;
      const d = Object.assign({ x: k.x, yOff: 0, look: 1, run: false, tilt: 0, armUp: false, air: false, legPhase: Math.floor(tt * 9) % 2 }, adim(k, tt, i));
      if (d.kapali) return; d.x = k.x;
      const alfa = clamp((k.x - X0) / (10 * U), 0, 1) * (d.sol !== undefined ? 1 - d.sol : 1);
      if (alfa <= 0 || tt < .6 + i * .15) return;
      hc.globalAlpha = alfa; pikselKarakter(hc, d, p.y - iz / 2 - 1, U, tt); hc.globalAlpha = 1;
    });
    sahin.ciz(hc, tt, U, W <= 1100);
    const n = performance.now();
    dalgalar = dalgalar.filter((q) => n - q.t < 900);
    for (const q of dalgalar) {   // tıklama kıvılcımı: ortada küçülen kare, çevrede yerçekimiyle düşen piksel parçacıklar
      const p = (n - q.t) / 900, sn = (n - q.t) / 1000;
      const c = Math.round(U * 2 * (1 - ease(Math.min(1, p * 3))) + U);
      hc.globalAlpha = Math.max(0, 1 - p * 3); hc.strokeStyle = '#f09a78'; hc.lineWidth = 3; hc.strokeRect(q.x - c, q.y - c, c * 2, c * 2);
      for (const k of q.parca) {
        const x = q.x + k.vx * ease(Math.min(1, p * 1.6)) * U, y = q.y + k.vy * ease(Math.min(1, p * 1.6)) * U + 30 * U * sn * sn;
        hc.globalAlpha = Math.max(0, 1 - p * p); hc.fillStyle = k.r;
        hc.fillRect(Math.round(x / U) * U, Math.round(y / U) * U, k.b * U, k.b * U);   // her parça ızgaraya oturur
      }
    }
    hc.globalAlpha = 1;
    requestAnimationFrame(ciz);
  }

  /* ---------- yazı animasyonları ---------- */
  const HARF = 'ABCDEFGHIJKLMNOPRSTUVYZ0123456789<>/_{}#';
  function coz(el, sure = 900) {
    if (AZ || !el) return;
    const hedefler = el.querySelector('.satir') ? [...el.querySelectorAll('.satir')] : [el];
    hedefler.forEach((h, n) => {
      if (!h.dataset.metin) h.dataset.metin = h.textContent;
      const metin = h.dataset.metin, bas = performance.now() + n * 160;
      cancelAnimationFrame(h._r);
      const yaz = (now) => { const p = clamp((now - bas) / sure, 0, 1);
        h.textContent = [...metin].map((ch, i) => (ch === ' ' || i < p * metin.length * 1.15 - 1) ? ch : HARF[Math.floor(Math.random() * HARF.length)]).join('');
        if (p < 1) h._r = requestAnimationFrame(yaz); else h.textContent = metin; };
      h._r = requestAnimationFrame(yaz);
    });
  }
  const daktilo = (el, hiz = 38, gecikme = 900) => { if (AZ || !el) return; const metin = el.textContent; el.textContent = '';
    setTimeout(() => { let i = 0; const s = setInterval(() => { el.textContent = metin.slice(0, ++i); if (i >= metin.length) clearInterval(s); }, hiz); }, gecikme); };

  root.querySelectorAll('.liman').forEach((a, i) => {
    const b = a.querySelector('.baslik');
    const gir = () => { gel(i, sol(i), Infinity); coz(b, 520); };
    const cik = () => { const k = kar[i]; if (k && k.kalUntil === Infinity) k.kalUntil = simdi() + 1.2; };   // bırakınca kısa süre kalır, sonra Claude ve şahin birlikte gider
    a.addEventListener('pointerenter', gir); a.addEventListener('focus', gir); a.addEventListener('pointerleave', cik); a.addEventListener('blur', cik);
  });
  // terminal: "cat hakkimda.txt" yazılır, hakkımda üç satır sırayla gelir ve kalır (döngü yok)
  const KOMUT = 'cat hakkimda.txt';
  const SATIRLAR = [
    t('Atatürk Üniversitesi · Bilgisayar Müh. 3. sınıf', 'Atatürk University · Comp. Eng. · 3rd year'),
    t('AI ile sistem kuruyorum: ajanlar, açık kaynak araçlar', 'I build systems with AI: agents, open-source tools'),
    'skytrack  claude-done-pixel  chatgpt-done-pixel',
  ];
  const komutEl = root.querySelector('[data-yaz]'), satirEl = [...root.querySelectorAll('[data-cikti] > span')];
  if (komutEl && satirEl.length) {
    if (AZ) { komutEl.textContent = KOMUT; satirEl.forEach((el, i) => { el.textContent = SATIRLAR[i]; }); }
    else (async () => {
      const dur = (ms) => new Promise((r) => setTimeout(r, ms));
      await dur(700);
      for (let j = 1; j <= KOMUT.length; j++) { komutEl.textContent = KOMUT.slice(0, j); await dur(34 + Math.random() * 46); }   // insan gibi: aralıklar değişir
      await dur(320);
      for (let i = 0; i < satirEl.length; i++) {
        const el = satirEl[i], m = SATIRLAR[i];
        el.style.opacity = '1';
        for (let j = 1; j <= m.length; j++) { el.textContent = m.slice(0, j); await dur(9); }
        await dur(180);
      }
    })();
  }

  /* ---------- karakterlere tıkla: gerçek bilgilerle balon; klavye ---------- */
  const balon = root.getElementById('balon');
  const toplam = Object.values(SAYILAR.repolar).reduce((a, r) => a + r.commit, 0);
  const sky = SAYILAR.repolar.airock;
  const SOZLER = [
    t('AI’ı 2 Ekim 2026’da öğrenmeye başladım.', 'I started learning AI on October 2, 2026.'),
    t(`SkyTrack’in ${sky.commit} commit’inin ${sky.claude}’i Claude ile ortak yazıldı.`, `${sky.claude} of SkyTrack’s ${sky.commit} commits were co-authored with Claude.`),
    t('Slaytlar AI’ı sıfırdan öğretir; hepsi tarayıcıda açılır.', 'The slides teach AI from scratch; they all run in the browser.'),
    t('Genelde 1 gün içinde dönerim.', 'I usually reply within a day.'),
  ];
  const KUTU = (i) => { const k = kar[i], p = pads[i], yer = p.y - U * .6 - 1; return { x1: k.x, x2: k.x + 24 * U, y1: yer - 15 * U, y2: yer + 6 }; };
  const karakterde = (x, y) => { for (let i = 0; i < kar.length; i++) { if (kar[i].phase === 'rest0') continue; const b = KUTU(i); if (x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2) return i; } return -1; };
  const barda = (x, y) => { for (let i = 0; i < pads.length; i++) { const p = pads[i]; if (y >= p.y - 4 * U && y <= p.y + 4 * U && x >= X0 && x <= p.x) return i; } return -1; };   // yatay çubuğun yakını
  let balonZaman;
  function konus(i) {
    const k = kar[i], tt = simdi(), b = KUTU(i);
    if (k.phase === 'dur' || k.phase === 'wave') { basla(k, 'jump', tt); k.kalUntil = Math.max(k.kalUntil, tt + 6); } else if (k.phase === 'out' || k.phase === 'sol') gel(i, k.hedef, 7);
    balon.textContent = SOZLER[i];
    const w = Math.min(260, innerWidth - 24);
    balon.style.left = Math.max(12, Math.min(innerWidth - w - 12, b.x1 - 6)) + 'px';
    balon.style.top = Math.max(64, b.y1 - balon.offsetHeight - 10) + 'px';
    balon.classList.add('goster'); clearTimeout(balonZaman); balonZaman = setTimeout(() => balon.classList.remove('goster'), 3600);
  }
  function sahinKonus() {
    const k = sahin.kutu(); if (!k) return;
    balon.textContent = t('Soyadım Şahin: kimlikte tünerim, bölümlere uçarım.', 'My surname means falcon: I perch on the card and fly to the sections.');
    const w = Math.min(260, innerWidth - 24);
    balon.style.left = Math.max(12, Math.min(innerWidth - w - 12, k.x1 - 6)) + 'px';
    balon.style.top = Math.max(64, k.y1 - balon.offsetHeight - 10) + 'px';
    balon.classList.add('goster'); clearTimeout(balonZaman); balonZaman = setTimeout(() => balon.classList.remove('goster'), 3600);
  }
  root.addEventListener('pointerdown', (e) => {
    if (e.composedPath().some((n) => n.matches?.('a,button,input,.konsol,.kanit'))) return;
    if (sahin.icinde(e.clientX, e.clientY)) { sahinKonus(); return; }
    const i = karakterde(e.clientX, e.clientY);
    if (i >= 0) { konus(i); return; }
    const b = barda(e.clientX, e.clientY);
    if (b >= 0) gel(b, clamp(e.clientX - 12 * U, X0 + 2 * U, Math.max(X0 + 2 * U, sol(b))), 7);   // dokunulan yere gel, şahin yanında durur
    if (!AZ) dalgalar.push({ x: Math.round(e.clientX / U) * U, y: Math.round(e.clientY / U) * U, t: performance.now(), parca: Array.from({ length: 14 }, (_, k) => { const a = (k / 14) * Math.PI * 2 + Math.random() * .4, v = 8 + Math.random() * 14; return { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, b: Math.random() < .3 ? 2 : 1, r: ['#d97757', '#f09a78', '#f4efe8', '#a24b33'][k % 4] }; }) });
  });
  root.addEventListener('pointermove', (e) => {
    const ustu = e.composedPath().some((n) => n.matches?.('a,button,input'));
    zemin.style.cursor = (!ustu && (sahin.icinde(e.clientX, e.clientY) || karakterde(e.clientX, e.clientY) >= 0 || barda(e.clientX, e.clientY) >= 0)) ? 'pointer' : '';
  });
  addEventListener('kutla', () => {
    gel(0, sol(0), 7);   // konsolda kutlama komutu: kullanıcı istedi, ilk hatta gelir
  });
  addEventListener('keydown', (e) => {
    if (!piksel() || e.composedPath()[0]?.matches?.('input,textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key >= '1' && e.key <= '4') { root.querySelectorAll('.liman')[+e.key - 1].click(); }
    if (e.key === '/') { e.preventDefault(); root.getElementById('k-in')?.focus(); }
  });

  let bekle; addEventListener('resize', () => { clearTimeout(bekle); bekle = setTimeout(olc, 120); });
  document.fonts?.ready.then(olc);
  new MutationObserver(() => { if (piksel()) olc(); }).observe(kok, { attributes: true, attributeFilter: ['data-gorunum'] });
  olc();
  requestAnimationFrame(ciz);
}
