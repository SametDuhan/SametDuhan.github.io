// Piksel ana sayfa: etkileşimli konsol (ajan döngüsü demosu, komutlar, GitHub'dan canlı commit'ler) ve sağdaki
// "git log" paneli (gerçek commit sayıları: proje proje ↔ toplam, 7 saniyede bir perdeyle değişir).
import { SAYILAR } from './sayilar.js';
import { PROJELER } from './projeler.js';
import { DESTELER } from './desteler.js';
import { t, EN } from './dil.js';
import { dokuCiz, TON } from './piksel-perde-doku.js';
import { pikselKarakter } from './piksel.js';
import { asiliKarakter, ASILI_GENISLIK, ASILI_YUKSEKLIK } from './piksel-karakter.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bekle = (ms) => new Promise((r) => setTimeout(r, AZ ? 0 : ms));
const repoAdi = (p) => new URL(p.github).pathname.split('/')[2];

export function baslatKonsol(root, yollar) {
  const log = root.getElementById('k-log'), form = root.getElementById('k-form'), giris = root.getElementById('k-in');
  const adimlar = Object.fromEntries([...root.querySelectorAll('.k-adim li')].map((li) => [li.dataset.a, li]));

  /* ---------- kanıt paneli: gerçek GitHub sayımı ---------- */
  const repolar = Object.values(SAYILAR.repolar);
  const toplam = repolar.reduce((a, r) => a + r.commit, 0), claude = repolar.reduce((a, r) => a + r.claude, 0);
  const sayiBas = (el, hedef, sure) => { if (AZ) { el.textContent = hedef; return; } const bas = performance.now(); const f = (n) => { const p = Math.min(1, (n - bas) / sure); el.textContent = Math.round(hedef * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  setTimeout(() => { root.querySelectorAll('.k-commit').forEach((el) => sayiBas(el, toplam, 1600)); root.querySelectorAll('.k-claude').forEach((el) => sayiBas(el, claude, 1600)); }, 1500);
  root.querySelectorAll('.k-yuzde').forEach((el) => { el.textContent = `(%${Math.round(claude / toplam * 100)})`; });
  const tarih = new Date(SAYILAR.tarih + 'T00:00').toLocaleDateString(EN ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const notlar = root.querySelectorAll('.k-not');
  notlar[0].textContent = t(`Her projenin GitHub sayımı, ${tarih}. Commit mesajındaki “Co-Authored-By: Claude” satırından sayılır; her gün otomatik güncellenir.`, `GitHub counts per project, ${tarih}. Counted from the “Co-Authored-By: Claude” line in commit messages; updated automatically every day.`);
  notlar[1].textContent = t(`${PROJELER.length} açık kaynak projenin toplamı, ${tarih}. Her kare bir commit.`, `Total across ${PROJELER.length} open-source projects, ${tarih}. Each square is one commit.`);

  /* ---------- kimlik paneli görünümleri: ne yaptım, slaytlar, son commit ---------- */
  const NE = { 'SkyTrack': t('Canlı uçak takibi, açık ADS-B verisiyle', 'Live flight tracking from open ADS-B data'), 'claude-done-pixel': t('Claude Code işini bitirince zıplayan piksel karakter', 'A pixel character that jumps when Claude Code finishes'), 'chatgpt-done-pixel': t('Aynı fikir Codex için', 'The same idea for Codex') };
  const neListe = root.getElementById('k-ne');
  PROJELER.forEach((pr) => { const li = document.createElement('li'), a = document.createElement('a'); a.href = `${yollar.kok}projeler/#${pr.ad.toLowerCase()}`; a.innerHTML = '<b></b><span></span>'; a.firstChild.textContent = pr.ad; a.lastChild.textContent = NE[pr.ad] || ''; li.append(a); neListe.append(li); });
  const slListe = root.getElementById('k-sl');
  DESTELER.forEach((d) => { const li = document.createElement('li'), a = document.createElement('a'), ad = EN && d.en ? d.en.baslik : d.baslik; a.href = `${yollar.kok}slaytlar/${d.slug}/`; a.innerHTML = '<b></b><span></span>'; a.firstChild.textContent = ad; a.lastChild.textContent = `${d.slaytSayisi} ${t('slayt', 'slides')} · ~${d.dakika} ${t('dk', 'min')}`; li.append(a); slListe.append(li); });
  const sonEl = root.getElementById('k-son');
  const gunOnce = (iso) => { const gun = Math.round((Date.now() - new Date(iso)) / 864e5); return gun <= 0 ? t('bugün', 'today') : t(`${gun} gün önce`, `${gun} days ago`); };
  fetch(`https://api.github.com/repos/SametDuhan/${repoAdi(PROJELER[0])}/commits?per_page=1`, { headers: { Accept: 'application/vnd.github+json' } }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then(([c]) => {
    const m = c.commit.message.split('\n')[0]; sonEl.textContent = t('son commit: ', 'latest commit: ') + (m.length > 44 ? m.slice(0, 43) + '…' : m) + ' · ' + gunOnce(c.commit.author.date);
  }).catch(() => { sonEl.remove(); });

  const liste = root.getElementById('k-liste');
  PROJELER.forEach((pr, s) => {
    const r = SAYILAR.repolar[repoAdi(pr)] ?? { commit: 0, claude: 0 };
    const dolu = r.claude === 0 ? 0 : Math.max(1, Math.round(r.claude / r.commit * 20));
    const li = document.createElement('li'), a = document.createElement('a');
    a.href = `${yollar.kok}projeler/#${pr.ad.toLowerCase()}`;
    a.innerHTML = '<span class="p-ust"><span class="p-ad"></span><span class="p-say"><b></b> / <span></span> commit</span></span><span class="p-cubuk" aria-hidden="true"></span>';
    a.querySelector('.p-ad').textContent = pr.ad; a.querySelector('.p-say b').textContent = r.claude; a.querySelector('.p-say > span').textContent = r.commit;
    a.setAttribute('aria-label', t(`${pr.ad}: ${r.commit} commit, ${r.claude} tanesi Claude ile ortak yazıldı`, `${pr.ad}: ${r.commit} commits, ${r.claude} co-authored with Claude`));
    const cubuk = a.querySelector('.p-cubuk');
    for (let i = 0; i < 20; i++) { const q = document.createElement('i'); q.style.setProperty('--n', i); cubuk.append(q); if (i < dolu) setTimeout(() => q.classList.add('on'), AZ ? 0 : 1700 + s * 250 + i * 35); }
    li.append(a); liste.append(li);
  });
  const izgara = root.getElementById('k-izgara');
  for (let i = 0; i < toplam; i++) { const q = document.createElement('i'); q.title = i < claude ? t('Claude ile ortak yazıldı', 'Co-authored with Claude') : t('tek başıma', 'on my own'); q.className = i < claude ? 'on' : 'el'; izgara.append(q); }
  root.querySelectorAll('.kanit-oz button').forEach((b) => {
    const ac = () => izgara.classList.add('sec-' + b.dataset.g), kapat = () => izgara.classList.remove('sec-' + b.dataset.g);
    b.addEventListener('pointerenter', ac); b.addEventListener('pointerleave', kapat); b.addEventListener('focus', ac); b.addEventListener('blur', kapat);
  });

  // perde: Claude pikseli perdenin ucuna asılıp aşağı çeker; kapanınca görünüm değişir
  const panel = root.querySelector('.kanit'), perde = panel.querySelector('.perde'), slaytlar = [...panel.querySelectorAll('.kanit-slayt')], noktalar = [...panel.querySelectorAll('.kanit-nokta button')];
  const pc = perde.querySelector('.perde-kar').getContext('2d'), dk = perde.querySelector('.perde-doku');
  // 1) perde: Claude pikseli perdenin ucuna asılıp aşağı çeker
  const perdeGecisi = async (goster) => {
    dk.width = perde.offsetWidth || 400; const h = perde.offsetHeight || 400; dk.height = h + 48; dokuCiz(dk.getContext('2d'), dk.width, h, 91, true);
    const cizici = setInterval(() => asiliKarakter(pc, performance.now() / 1000), 90); asiliKarakter(pc, 0);
    perde.className = 'perde in'; await bekle(1200);
    goster(); perde.className = 'perde out'; await bekle(1000);
    perde.className = 'perde'; clearInterval(cizici);
  };
  const ic = panel.querySelector('.kanit-ic'), gk = document.createElement('canvas'); gk.className = 'gecis-kanvas'; gk.setAttribute('aria-hidden', 'true'); ic.append(gk);
  const kare = (ms, fn) => new Promise((res) => { const b = performance.now(); let bitti = false; const son = () => { if (bitti) return; bitti = true; fn(1); res(); }; const d = (now) => { if (bitti) return; const p = Math.min(1, (now - b) / ms); fn(p); p < 1 ? requestAnimationFrame(d) : son(); }; requestAnimationFrame(d); setTimeout(son, ms + 400); });  // sekme arka plandaysa rAF durur: zaman aşımı geçişi yine bitirir
  const boyutla = () => { gk.width = ic.offsetWidth || 300; gk.height = ic.offsetHeight || 300; return gk.getContext('2d'); };
  // 2) mozaik: kareler rastgele sırayla panelin üstünü örter, görünüm değişir, kareler yine rastgele dağılır
  const mozaik = async (goster) => {
    const c = boyutla(), W = gk.width, H = gk.height, P = 12, sut = Math.ceil(W / P), n = sut * Math.ceil(H / P);
    const sira2 = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [sira2[i], sira2[j]] = [sira2[j], sira2[i]]; }
    const renk = sira2.map(() => TON[Math.floor(Math.random() * TON.length)]), yer = (i) => [(i % sut) * P, Math.floor(i / sut) * P];
    let k = 0; await kare(650, (p) => { for (const h = Math.floor(p * n); k < h; k++) { const i = sira2[k]; c.fillStyle = renk[i]; c.fillRect(...yer(i), P, P); } });
    goster(); await bekle(150);
    k = 0; await kare(650, (p) => { for (const h = Math.floor(p * n); k < h; k++) c.clearRect(...yer(sira2[k]), P, P); });
    c.clearRect(0, 0, W, H);
  };
  // 3) koşucu: Claude pikseli soldan sağa koşarak perdeyi serer, geri dönüp aynı yoldan kaldırır
  const kosucu = async (goster) => {
    const c = boyutla(), W = gk.width, H = gk.height, u = Math.max(2, Math.round(H / 110)), zemin = H * .5 + 6 * u, off = document.createElement('canvas'); off.width = W; off.height = H; dokuCiz(off.getContext('2d'), W, H, 91);
    const kos = (kapla) => kare(750, (p) => {
      const x = -16 * u + (W + 32 * u) * p, e = Math.max(0, Math.min(W, x + 8 * u)); c.clearRect(0, 0, W, H);
      if (kapla) c.drawImage(off, 0, 0, e, H, 0, 0, e, H); else c.drawImage(off, e, 0, W - e, H, e, 0, W - e, H);
      pikselKarakter(c, { x, yOff: -Math.abs(Math.sin(p * 40)) * 1.2 * u, look: 1, run: true, tilt: 0, armUp: false, air: false, legPhase: Math.floor(p * 26) % 2 }, zemin, u, p * 3);
    });
    await kos(true); c.drawImage(off, 0, 0); goster(); await bekle(120); await kos(false); c.clearRect(0, 0, W, H);
  };
  // 4) eski TV: panel ince bir çizgiye çöker, çizgi yatayda söner, yeni görünüm çizgiden açılır
  const tv = async (goster) => {
    const bit = (a) => Promise.race([a.finished.catch(() => {}), new Promise((r) => setTimeout(r, a.effect.getTiming().duration + 400))]);
    const a = ic.animate([{ transform: 'scaleY(1)', filter: 'brightness(1)' }, { transform: 'scaleY(.012)', filter: 'brightness(2.4)', offset: .8 }, { transform: 'scale(0,.012)', filter: 'brightness(3)' }], { duration: 480, easing: 'cubic-bezier(.6,0,.9,.4)', fill: 'forwards' });
    await bit(a); goster();
    const b = ic.animate([{ transform: 'scale(0,.012)', filter: 'brightness(3)' }, { transform: 'scale(1,.012)', filter: 'brightness(2.4)', offset: .4 }, { transform: 'scale(1,1)', filter: 'brightness(1)' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    await bit(b); a.cancel(); b.cancel();
  };
  // 5) bantlar: panel yatay bantlara bölünür, bantlar sırayla sağdan ve soldan kayarak örter, sonra kayıp gider
  const bantlar = async (goster) => {
    const c = boyutla(), W = gk.width, H = gk.height, off = document.createElement('canvas'); off.width = W; off.height = H; dokuCiz(off.getContext('2d'), W, H, 91);
    const n = 8, bh = Math.ceil(H / n), kay = (p, yonA) => { c.clearRect(0, 0, W, H); for (let i = 0; i < n; i++) { const yon = (i % 2 ? 1 : -1) * yonA, d = Math.max(0, Math.min(1, p * 1.5 - i * .07)); c.drawImage(off, 0, i * bh, W, bh, Math.round(yon * W * (yonA > 0 ? 1 - d : d) / 12) * 12, i * bh, W, bh); } };
    await kare(650, (p) => kay(p, 1)); c.drawImage(off, 0, 0); goster(); await bekle(150);
    await kare(650, (p) => kay(p, -1));
    c.clearRect(0, 0, W, H);
  };
  const GECISLER = [perdeGecisi, mozaik, kosucu, tv, bantlar]; let sira = 0;
  let gorunum = 0, mesgul = false, durak = false;
  async function degistir(hedef, perdeli = true) {
    if (mesgul || hedef === gorunum) return; mesgul = true;
    const goster = () => { slaytlar.forEach((s, i) => { s.classList.toggle('acik', i === hedef); s.toggleAttribute('inert', i !== hedef); s.setAttribute('aria-hidden', i === hedef ? 'false' : 'true'); }); noktalar.forEach((n, i) => n.classList.toggle('on', i === hedef)); gorunum = hedef; };
    if (AZ || !perdeli) { goster(); mesgul = false; return; }
    dk.width = perde.offsetWidth || 400; const h = perde.offsetHeight || 400; dk.height = h + 48; dokuCiz(dk.getContext('2d'), dk.width, h, 91, true);
    const g = GECISLER[sira++ % GECISLER.length];
    await g(goster);
    mesgul = false;
  }
  noktalar.forEach((n, i) => n.addEventListener('click', () => degistir(i)));
  panel.addEventListener('pointerenter', () => { durak = true; }); panel.addEventListener('pointerleave', () => { durak = false; });
  panel.addEventListener('focusin', () => { durak = true; }); panel.addEventListener('focusout', () => { durak = false; });
  (async function dongu() {
    if (AZ) return;
    await bekle(7500);
    for (;;) { await bekle(7000); while (durak || document.hidden || mesgul || document.documentElement.dataset.gorunum !== 'piksel') await bekle(500); await degistir((gorunum + 1) % slaytlar.length); }
  })();

  /* ---------- konsol ---------- */
  const satir = (metin, sinif = '') => { const p = document.createElement('p'); if (sinif) p.className = sinif; p.textContent = metin; log.append(p); log.scrollTop = log.scrollHeight; return p; };
  const gezin = { hakkimda: 'hakkimda/', projeler: 'projeler/', slaytlar: 'slaytlar/', iletisim: 'iletisim/', about: 'hakkimda/', projects: 'projeler/', slides: 'slaytlar/', contact: 'iletisim/' };
  let calisiyor = false, gecmis = [], gi = 0, kullanildi = false;
  const adimSifirla = () => Object.values(adimlar).forEach((li) => { li.className = ''; });

  async function ajan(gorev) {
    calisiyor = true; adimSifirla();
    const kisa = gorev.length > 42 ? gorev.slice(0, 41) + '…' : gorev;
    const plan = [
      ['bak', t('kod tabanı okunuyor', 'reading the codebase'), 900],
      ['karar', t('plan hazır, 3 adım', 'plan ready, 3 steps'), 900],
      ['yap', t(`“${kisa}” uygulanıyor`, `applying “${kisa}”`), 1300],
      ['kontrol', t('testler çalışıyor… hepsi geçti', 'running tests… all passed'), 1000],
    ];
    for (const [ad, ileti, sure] of plan) { adimlar[ad].className = 'aktif'; satir(`● ${ad.padEnd(8)}${ileti}`, 'ad'); await bekle(sure); adimlar[ad].className = 'bitti'; }
    satir('● hook    Stop → claude-done.ps1', 'ad'); await bekle(500);
    satir(t('✓ bitti. Yeşil bayrak kalktı.', '✓ done. Green flag is up.'), 'ok'); dispatchEvent(new Event('kutla'));
    satir(t('Bu bir demo simülasyonu: gerçek bir model çağrılmıyor. Gerçeği: github.com/SametDuhan/claude-done-pixel', 'This is a demo simulation: no real model is called. The real thing: github.com/SametDuhan/claude-done-pixel'), 'sol');
    calisiyor = false;
  }

  const goreli = (iso) => { const sn = (new Date(iso) - Date.now()) / 1000, a = Math.abs(sn), f = new Intl.RelativeTimeFormat(EN ? 'en' : 'tr', { numeric: 'auto' });
    if (a < 3600) return f.format(Math.round(sn / 60), 'minute'); if (a < 86400) return f.format(Math.round(sn / 3600), 'hour');
    if (a < 2592000) return f.format(Math.round(sn / 86400), 'day'); if (a < 31536000) return f.format(Math.round(sn / 2592000), 'month');
    return f.format(Math.round(sn / 31536000), 'year'); };
  async function canliGit() {
    satir(t('GitHub’dan son commit’ler çekiliyor…', 'Fetching the latest commits from GitHub…'), 'sol');
    const sonuc = await Promise.allSettled(PROJELER.map((p) => fetch(`https://api.github.com/repos/SametDuhan/${repoAdi(p)}/commits?per_page=2`, { headers: { Accept: 'application/vnd.github+json' } }).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })));
    let var_ = false;
    sonuc.forEach((s, i) => { if (s.status !== 'fulfilled') return; var_ = true; s.value.forEach((c) => { const m = c.commit.message.split('\n')[0]; satir(`${repoAdi(PROJELER[i]).slice(0, 12).padEnd(13)}${c.sha.slice(0, 7)}  ${m.length > 40 ? m.slice(0, 39) + '…' : m}  (${goreli(c.commit.author.date)})`); }); });
    if (!var_) { satir(t('GitHub’a ulaşılamadı; kayıtlı sayılar:', 'Could not reach GitHub; saved counts:'), 'sol'); Object.entries(SAYILAR.repolar).forEach(([ad, r]) => satir(`${ad.padEnd(20)} ${String(r.commit).padStart(3)} commit · ${r.claude} ${t('Claude ile ortak', 'with Claude')}`)); }
  }

  const KOMUTLAR = {
    help: () => EN
      ? ['commands:', '  ls                 list sections', '  open <section>     about, projects, slides, contact', '  projects           summarize projects', '  git log            latest commits (live from GitHub)', '  whoami             who I am', '  claude "task"      agent loop demo', '  lang tr            Türkçe', '  clear              clear the screen']
      : ['komutlar:', '  ls                 bölümleri listele', '  open <bölüm>       hakkimda, projeler, slaytlar, iletisim', '  projeler           projeleri özetle', '  git log            son commit’ler (GitHub’dan canlı)', '  whoami             ben kimim', '  claude "görev"     ajan döngüsü demosu', '  lang en            English', '  clear              ekranı temizle'],
    ls: () => ['hakkimda/  projeler/  slaytlar/  iletisim/'],
    whoami: () => [t('Samet Duhan: AI ile sistem kuran geliştirici.', 'Samet Duhan: developer who builds systems with AI.'), t('Ajanlar, açık kaynak araçlar ve günlük hayatta karşılığı olan uygulamalar.', 'Agents, open-source tools, and apps that solve everyday problems.')],
    projeler: () => PROJELER.map((p) => `${p.ad}\n  ${p.ozet.split('. ')[0].replace(/\.$/, '')}.`),
  };
  KOMUTLAR.projects = KOMUTLAR.projeler;

  async function calistir(ham) {
    const girdi = ham.trim(); if (!girdi) return;
    satir(`samet@sahin:~$ ${girdi}`, 'c');
    if (calisiyor) { satir(t('ajan çalışıyor, bitmesini bekle.', 'the agent is running, wait for it to finish.'), 'sol'); return; }
    const m = girdi.match(/^claude\s*(.*)$/i);
    if (m) { const gorev = m[1].replace(/^["“']|["”']$/g, '').trim(); if (!gorev) { satir(t('kullanım: claude "bir görev yaz"', 'usage: claude "type a task"'), 'sol'); return; } return ajan(gorev); }
    const [komut, ...arg] = girdi.split(/\s+/), anahtar = komut.toLowerCase();
    if (anahtar === 'clear') { log.textContent = ''; adimSifirla(); return; }
    if (anahtar === 'git') { if ((arg[0] || '').toLowerCase() === 'log') return canliGit(); satir(t('git: yalnız "git log" destekleniyor', 'git: only "git log" is supported'), 'sol'); return; }
    if (['open', 'cd', 'cat'].includes(anahtar)) {
      const hedef = (arg[0] || '').replace(/\/$/, '').toLowerCase().replace('ı', 'i').replace('ş', 's');
      if (gezin[hedef]) { satir(`${yollar.kok}${gezin[hedef]} ${t('açılıyor…', 'opening…')}`, 'ok'); await bekle(500); location.href = yollar.kok + gezin[hedef]; } else satir(t(`bulunamadı: ${arg[0] || ''}. ls yaz.`, `not found: ${arg[0] || ''}. type ls.`), 'sol'); return;
    }
    if (anahtar === 'lang') { const d = (arg[0] || '').toLowerCase(); if (d === 'en' || d === 'tr') { satir(d === 'en' ? 'English → /en/' : 'Türkçe → /', 'ok'); await bekle(400); location.href = d === 'en' ? '/en/' : '/'; } else satir(t('lang en', 'lang tr'), 'sol'); return; }
    const f = KOMUTLAR[anahtar];
    if (f) { for (const s of f(arg)) { satir(s); await bekle(40); } } else satir(t(`komut bulunamadı: ${komut}. help yaz.`, `command not found: ${komut}. type help.`), 'sol');
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); const v = giris.value; giris.value = ''; kullanildi = true; if (v.trim()) { gecmis.push(v); gi = gecmis.length; } calistir(v); });
  giris.addEventListener('keydown', (e) => { if (e.key === 'ArrowUp' && gi > 0) { giris.value = gecmis[--gi]; e.preventDefault(); } if (e.key === 'ArrowDown') { giris.value = gecmis[++gi] ?? ''; e.preventDefault(); } if (e.key === 'Escape') giris.blur(); });
  giris.addEventListener('focus', () => { kullanildi = true; });

  satir(t('Hoş geldin. help yaz ya da izle:', 'Welcome. Type help, or just watch:'), 'sol');
  (async function acilis() {
    const gorev = t('yeni bir proje ekle', 'add a new project');
    if (AZ) { satir(`samet@sahin:~$ claude "${gorev}"`, 'c'); return ajan(gorev); }
    await bekle(3600); if (kullanildi) return;
    const komut = `claude "${gorev}"`, p = satir('samet@sahin:~$ ', 'c');
    for (const ch of komut) { if (kullanildi) return; p.textContent += ch; log.scrollTop = log.scrollHeight; await bekle(55); }
    await bekle(300); if (kullanildi) return;
    ajan(gorev);
  })();
}
