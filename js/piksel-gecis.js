// Piksel görünüm: sayfa geçişi. Bir bağlantıya tıklayınca tam ekran bir perde yukarıdan iner; perdenin kenarı düz çizgi değil, rastgele pikselli damlalar ve
// dağılmış tek tek piksellerdir, ucuna ekran genişliğine göre çok sayıda Claude Code pikseli asılıdır (perde büyük olduğu için). Yeni sayfa perdeli açılır
// (html[data-px-gecis]: ilk boyamada düz perde, js/ilk açılışta aynı perdenin canvas'ı devralır) ve perde yukarı kalkar. Hareketi azaltınca geçiş yok.
import { asiliKarakter } from './piksel-karakter.js';

const kok = document.documentElement;
const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const P = 12;                                    // kenar karelerinin boyu (px)
const SERIT = ['#8a3f2a', '#94442e', '#a24b33', '#ad5337', '#bd5e3e'];   // kumaşın pikselleri: şerit yok, her kare rastgele bir tondan
const HARF = { S: '01111 10000 10000 01110 00001 00001 11110', A: '01110 10001 10001 11111 10001 10001 10001', M: '10001 11011 10101 10101 10001 10001 10001', E: '11111 10000 10000 11110 10000 10000 11111', T: '11111 00100 00100 00100 00100 00100 00100', D: '11110 10001 10001 10001 10001 10001 11110', U: '10001 10001 10001 10001 10001 10001 01110', H: '10001 10001 10001 11111 10001 10001 10001', N: '10001 11001 10101 10101 10011 10001 10001' };
const TURUNCU = ['#d97757', '#f09a78', '#d97757', '#b45a3e'];
let aktif = false, perde = null;

// sabit tohumlu rastgele: aynı genişlikte iki sayfada aynı kenar çıkar
const rastgele = (tohum) => { let s = (tohum >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; };

// W x H'lik perde: üstte düz şeritli kumaş (H yüksekliğine kadar), altında rastgele derinlikte damlalar, dağılmış pikseller ve asılı karakterler.
export function perdeKur(W, H) {
  const u = W < 700 ? 3 : W < 1300 ? 4 : 5, r = rastgele(W * 31 + 7), kolSon = 4;
  const sutun = Math.ceil(W / P), n = Math.max(4, Math.floor(W / (35 * u)));
  const EK = 6 * P + (kolSon + 20) * u + 40;                    // damla derinliği + kol + karakter boyu + pay
  const derin = []; let v = 3;
  for (let i = 0; i < sutun; i++) { const adim = r(); v += adim < .38 ? -1 : adim < .76 ? 1 : 0; if (r() < .12) v += r() < .5 ? -2 : 2; v = Math.max(1, Math.min(5, v)); derin.push(v); }
  const dagin = [];                                              // damlalardan kopmuş, havada duran tek pikseller
  for (let i = 0; i < sutun; i++) if (r() < .22) { const kat = 1 + Math.floor(r() * 3); dagin.push({ i, sat: derin[i] + kat, renk: TURUNCU[Math.floor(r() * 4)] }); }
  const vurgu = derin.map(() => TURUNCU[Math.floor(r() * 4)]);   // her damlanın uç karesi
  const karakterler = [];
  for (let k = 0; k < n; k++) { const sut = Math.min(sutun - 1, Math.max(0, Math.round((k + .5 + (r() - .5) * .5) * sutun / n))); karakterler.push({ sut, kol: Math.floor(r() * (kolSon + 1)), faz: r() * 6 }); }
  const dokuma = derin.map((d) => Array.from({ length: d }, () => SERIT[Math.floor(r() * 5)]));
  const kumas = document.createElement('canvas'); kumas.width = W; kumas.height = H; const k2 = kumas.getContext('2d');
  for (let y = 0; y < H; y += P) for (let x = 0; x < W; x += P) { k2.fillStyle = SERIT[Math.floor(r() * 5)]; k2.fillRect(x, y, P, P); }   // dağınık kare dokusu
  const hu = Math.max(4, Math.min(14, Math.floor(W * .8 / 65))), yaz = 'SAMET DUHAN', gen = yaz.length * 6 * hu - hu, bx = Math.round((W - gen) / 2), by = Math.round(H * .42 - 3.5 * hu);
  [[hu * .6, '#3a1a10'], [0, '#fbe9dc']].forEach(([ofs, renk]) => { k2.fillStyle = renk; [...yaz].forEach((ch, j) => { (HARF[ch] || '').split(' ').forEach((sat, y) => [...sat].forEach((v, x) => { if (v === '1') k2.fillRect(Math.round(bx + (j * 6 + x) * hu + ofs), Math.round(by + y * hu + ofs), hu, hu); })); }); });
  const kv = document.createElement('canvas'); kv.width = W; kv.height = H + EK; kv.className = 'pxg'; kv.setAttribute('aria-hidden', 'true');
  kv.style.cssText = `width:${W}px;height:${H + EK}px`;
  const c = kv.getContext('2d');
  const ciz = (t) => {
    c.clearRect(0, 0, W, H + EK);
    c.drawImage(kumas, 0, 0);                                                                                  // sabit kumaş + isim
    const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(0,0,0,.28)'); g.addColorStop(.07, 'rgba(0,0,0,0)'); g.addColorStop(.93, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.28)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (let i = 0; i < sutun; i++) {                                                                          // damlalar: kumaş şeridi renginde, ucu turuncu
      for (let s = 0; s < derin[i]; s++) { c.fillStyle = s === derin[i] - 1 ? vurgu[i] : dokuma[i][s]; c.fillRect(i * P, H + s * P, P, P); }
    }
    for (const d of dagin) { c.fillStyle = d.renk; c.fillRect(d.i * P + 2, H + d.sat * P + 2, P - 4, P - 4); }  // dağılmış pikseller (biraz küçük)
    for (const k of karakterler) asiliKarakter(c, t + k.faz, { x: Math.round(k.sut * P + P / 2 - 14 * u), y: H + derin[k.sut] * P, u, kol: k.kol, temizle: false });
  };
  return { kv, ciz, toplam: H + EK };
}

function perdeEkle(W, H) { const p = perdeKur(W, H); p.kv.style.cssText += ';position:fixed;left:0;top:0;z-index:2147483000;pointer-events:none;image-rendering:pixelated;will-change:transform'; document.body.append(p.kv); p.ciz(0); return p; }

function git(adres) {
  if (aktif) return; aktif = true;
  const W = innerWidth, H = innerHeight, p = perdeEkle(W, H); perde = p.kv;
  const bas = performance.now(), sal = setInterval(() => p.ciz((performance.now() - bas) / 1000), 90);
  const a = p.kv.animate([{ transform: `translateY(-${p.toplam}px)` }, { transform: 'translateY(0)' }], { duration: 850, easing: 'cubic-bezier(.5,0,.85,.55)', fill: 'forwards' });
  let gitti = false;
  const sonra = () => { if (gitti) return; gitti = true; try { sessionStorage.setItem('pxGecis', '1'); } catch {} clearInterval(sal); location.href = adres; };
  a.finished.then(sonra, sonra); setTimeout(sonra, 1600);
  setTimeout(() => { aktif = false; clearInterval(sal); perde?.remove(); }, 5000); // gezinme olmazsa (ör. indirme) perde kalkar
}

// yeni sayfa perdeli açıldıysa (önceki sayfa perdeyi indirmişti): ilk boyamada CSS düz perdesi örter; burada aynı perde canvas olarak devralır ve kalkar
function karsila() {
  if (AZ || !kok.hasAttribute('data-px-gecis')) return;
  const W = innerWidth, H = innerHeight, p = perdeEkle(W, H);
  kok.removeAttribute('data-px-gecis');                       // CSS perdesi kalkar, canvas yerini alır (aynı görünüm)
  const bas = performance.now(), sal = setInterval(() => p.ciz((performance.now() - bas) / 1000), 90);
  setTimeout(() => {
    const a = p.kv.animate([{ transform: 'translateY(0)' }, { transform: `translateY(-${p.toplam}px)` }], { duration: 950, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    const bitti = () => { clearInterval(sal); p.kv.remove(); }; a.finished.then(bitti, bitti);
  }, 140);
}
if (document.body) karsila(); else addEventListener('DOMContentLoaded', karsila);

document.addEventListener('click', (e) => {
  if (AZ || kok.dataset.gorunum !== 'piksel' || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.composedPath().find((n) => n instanceof HTMLAnchorElement && n.href);
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const u = new URL(a.href, location.href);
  if (!/^https?:$/.test(u.protocol) || u.origin !== location.origin) return;
  if (u.pathname === location.pathname && u.search === location.search) return; // sayfa içi bağlantı
  e.preventDefault();
  git(u.href);
});
addEventListener('pageshow', (e) => { if (e.persisted) { aktif = false; document.querySelectorAll('canvas.pxg').forEach((p) => p.remove()); } });
