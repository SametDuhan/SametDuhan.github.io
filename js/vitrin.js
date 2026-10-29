// Projeler ve Hakkımda sayfaları: .belir öğeleri görününce belirir, sayaçlar sayar, medya görünürken oynar (video, piksel animasyonları).
import { ciz, oynat, durdur } from './piksel.js';

const az = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const bekle = (ms) => new Promise((bitti) => setTimeout(bitti, ms));
const yumusat = (t) => 1 - (1 - t) ** 3;

// Öğe ekranda göründüğü sürece baslat(), görünmeyince ya da sekme gizlenince durdur() çağrılır.
export function gorunurken(oge, baslat, durdurFn, esik = 0.4) {
  let gorunur = false, calisiyor = false;
  const guncelle = () => {
    const ac = gorunur && !document.hidden;
    if (ac && !calisiyor) { calisiyor = true; baslat(); }
    else if (!ac && calisiyor) { calisiyor = false; durdurFn(); }
  };
  new IntersectionObserver(([g]) => { gorunur = g.isIntersecting; guncelle(); }, { threshold: esik }).observe(oge);
  document.addEventListener('visibilitychange', guncelle);
}

export function sayiSay(el, sure = 1300) {
  const hedef = Number(el.dataset.say);
  if (az()) { el.textContent = hedef; return; }
  const bas = performance.now();
  const adim = (t) => {
    const p = Math.min(1, (t - bas) / sure);
    el.textContent = Math.round(hedef * yumusat(p));
    if (p < 1) requestAnimationFrame(adim);
  };
  requestAnimationFrame(adim);
}

function codexCiz(canvas, img, kare) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#111919'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!img.complete || !img.naturalWidth) return;
  ctx.imageSmoothingEnabled = false;
  const yuk = canvas.height * 0.8, gen = yuk * (320 / 270);
  ctx.drawImage(img, kare * 320, 0, 320, 270, (canvas.width - gen) / 2, (canvas.height - yuk) / 2, gen, yuk);
}

export function medyaBagla(kutu) {
  const tur = kutu.dataset.medya;
  if (tur === 'video') {
    const v = kutu.querySelector('video');
    v.muted = true; v.loop = true;
    v.addEventListener('click', () => (v.paused ? v.play().catch(() => {}) : v.pause()));
    if (!az()) gorunurken(kutu, () => v.play().catch(() => {}), () => v.pause());
    return;
  }
  const canvas = kutu.querySelector('canvas');
  let jeton = 0;
  if (tur === 'claude') {
    ciz(canvas, 3100);
    if (az()) return;
    gorunurken(kutu, async () => {
      const ben = ++jeton;
      while (ben === jeton) { await oynat(canvas); if (ben !== jeton) return; await bekle(1400); }
    }, () => { jeton++; durdur(); });
    return;
  }
  const img = new Image(); img.src = new URL('../img/chatgpt-done.png', import.meta.url).href;
  const ilk = () => codexCiz(canvas, img, 5);
  img.addEventListener('load', ilk); ilk();
  if (az()) return;
  gorunurken(kutu, async () => {
    const ben = ++jeton;
    while (ben === jeton) {
      for (let k = 0; k < 6 && ben === jeton; k++) { codexCiz(canvas, img, k); await bekle(650); }
      await bekle(1400);
    }
  }, () => { jeton++; });
}

export function baslat() {
  const kok = document.getElementById('icerik');
  if (!kok) return;
  kok.classList.add('js-vitrin');
  if (az()) document.querySelectorAll('.sayfa-sahne svg').forEach((v) => v.pauseAnimations?.());
  const gozle = (secici, ac, esik = 0.18) => {
    const io = new IntersectionObserver((kayitlar) => kayitlar.forEach((k) => { if (k.isIntersecting) { ac(k.target); io.unobserve(k.target); } }), { threshold: esik });
    document.querySelectorAll(secici).forEach((e) => io.observe(e));
  };
  gozle('.belir', (e) => e.classList.add('gorundu'));
  gozle('.sayaclar', (e) => { e.classList.add('gorundu'); e.querySelectorAll('[data-say]').forEach((b) => sayiSay(b)); }, 0.5);
  document.querySelectorAll('.v-medya').forEach(medyaBagla);
}
