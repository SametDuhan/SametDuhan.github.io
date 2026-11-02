// İletişim, piksel görünüm: eylemler. (1) "Mail uygulamasında aç", "Gmail'de aç", "Metni kopyala" ve adres "kopyala" düğmesine basınca pikselli bir zarf mesaj
// kutusundan düğmeye uçar ve piksel parıltı çıkar (yalnız görsel geri bildirim: düğmenin kendi işi aynen çalışır, hiçbir şey engellenmez ya da gönderilmez);
// (2) klavye: 1-5 konu seçer, "/" mesaja odaklanır, Ctrl+Enter mail uygulamasında açar; (3) bölüm başlıkları görününce karışık harflerden çözülür.
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HARF = 'ABCDEFGHIJKLMNOPRSTUVYZ0123456789<>/_{}#';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function zarfCiz() {
  const k = document.createElement('canvas'); k.width = 26; k.height = 17; k.className = 'px-zarf'; k.setAttribute('aria-hidden', 'true');
  const c = k.getContext('2d');
  c.fillStyle = '#f4efe8'; c.fillRect(0, 0, 26, 17); c.fillStyle = '#c4b8ad'; c.fillRect(0, 15, 26, 2);
  c.strokeStyle = '#8b7f75'; c.lineWidth = 2; c.beginPath(); c.moveTo(1, 1); c.lineTo(13, 10); c.lineTo(25, 1); c.stroke();
  c.fillStyle = '#d97757'; c.fillRect(11, 8, 4, 4);
  return k;
}

function uc(kaynak, hedef) {
  if (AZ) return;
  const a = kaynak.getBoundingClientRect(), b = hedef.getBoundingClientRect();
  const x0 = a.left + a.width / 2 - 13, y0 = a.top + a.height / 2 - 8, x1 = b.left + b.width / 2 - 13, y1 = b.top + b.height / 2 - 8;
  const z = zarfCiz(); document.body.append(z);
  const bas = performance.now(), SURE = 650;
  const adim = (now) => {
    const p = clamp((now - bas) / SURE, 0, 1), e = 1 - (1 - p) ** 3;
    z.style.transform = `translate(${x0 + (x1 - x0) * e}px, ${y0 + (y1 - y0) * e - Math.sin(p * Math.PI) * 70}px) scale(${1 - p * .35})`; z.style.opacity = p > .85 ? (1 - p) / .15 : 1;
    if (p < 1) requestAnimationFrame(adim); else { z.remove(); parilti(b.left + b.width / 2, b.top + b.height / 2); }
  };
  requestAnimationFrame(adim);
}
function parilti(x, y) {
  if (AZ) return;
  for (let i = 0; i < 10; i++) {
    const q = document.createElement('i'); q.className = 'px-kivilcim'; q.setAttribute('aria-hidden', 'true');
    const a = (i / 10) * Math.PI * 2, d = 26 + (i % 3) * 8;
    q.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d)}px`;
    document.body.append(q); setTimeout(() => q.remove(), 620);
  }
}
function coz(el, sure = 650) {
  const metin = el.dataset.pxMetin ??= el.textContent; if (AZ) return; const bas = performance.now();
  const f = (now) => { const p = clamp((now - bas) / sure, 0, 1); el.textContent = [...metin].map((ch, i) => (ch === ' ' || i < p * metin.length * 1.15 - 1) ? ch : HARF[Math.floor(Math.random() * HARF.length)]).join(''); if (p < 1) el._r = requestAnimationFrame(f); else el.textContent = metin; };
  cancelAnimationFrame(el._r); el._r = requestAnimationFrame(f);
}

export function eylemKur() {
  const mesaj = document.getElementById('mesaj'); if (!mesaj) return undefined;
  const geri = [];
  // 1) zarf uçuşu: tıklanan düğmeye
  for (const id of ['mail-ac', 'gmail-ac', 'metin-kopyala', 'kopyala']) {
    const dugme = document.getElementById(id); if (!dugme) continue;
    const kaynak = id === 'kopyala' ? document.getElementById('mail') ?? dugme : mesaj;
    const f = () => uc(kaynak, dugme);
    dugme.addEventListener('click', f); geri.push(() => dugme.removeEventListener('click', f));
  }
  // 2) klavye kısayolları (1–5 konu, / mesaj, Ctrl+Enter); ekranda ipucu yazısı yok
  const konular = document.querySelector('#konular');
  const tus = (e) => {
    if (document.documentElement.dataset.gorunum !== 'piksel' || e.altKey || e.metaKey) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.activeElement === mesaj) { e.preventDefault(); document.getElementById('mail-ac')?.click(); return; }
    if (e.ctrlKey) return;
    if (e.target.matches?.('input, textarea, select, [contenteditable]')) return;
    if (e.key === '/') { e.preventDefault(); mesaj.focus(); return; }
    if (e.key >= '1' && e.key <= '5') { document.querySelectorAll('[data-konu]')[+e.key - 1]?.click(); }
  };
  addEventListener('keydown', tus); geri.push(() => removeEventListener('keydown', tus));
  // 3) başlıklar çözülür
  const basliklar = [...document.querySelectorAll('.bolum-baslik')];
  const gozlem = new IntersectionObserver((kayitlar) => kayitlar.forEach((k) => { if (k.isIntersecting) { gozlem.unobserve(k.target); coz(k.target); } }), { threshold: .6 });
  basliklar.forEach((b) => { b.setAttribute('aria-label', b.textContent.trim()); gozlem.observe(b); });
  geri.push(() => { gozlem.disconnect(); basliklar.forEach((b) => { cancelAnimationFrame(b._r); if (b.dataset.pxMetin) b.textContent = b.dataset.pxMetin; b.removeAttribute('aria-label'); delete b.dataset.pxMetin; }); });
  return () => geri.forEach((f) => f());
}
