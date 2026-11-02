// Piksel ana sayfa: etkileşimli konsol (ajan döngüsü demosu, komutlar, GitHub'dan canlı commit'ler) ve sağdaki
// commit ızgarası paneli (gerçek GitHub sayımı).
import { SAYILAR } from './sayilar.js';
import { PROJELER } from './projeler.js';
import { t, EN } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bekle = (ms) => new Promise((r) => setTimeout(r, AZ ? 0 : ms));
const repoAdi = (p) => new URL(p.github).pathname.split('/')[2];

export function baslatKonsol(root, yollar) {
  const log = root.getElementById('k-log'), form = root.getElementById('k-form'), giris = root.getElementById('k-in');

  /* ---------- sağ panel: tek görünüm, gerçek GitHub sayımı (her kare bir commit) ---------- */
  const repolar = Object.values(SAYILAR.repolar);
  const toplam = repolar.reduce((a, r) => a + r.commit, 0), claude = repolar.reduce((a, r) => a + r.claude, 0);
  const sayiBas = (el, hedef, sure) => { if (AZ) { el.textContent = hedef; return; } const bas = performance.now(); const f = (n) => { const p = Math.min(1, (n - bas) / sure); el.textContent = Math.round(hedef * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  setTimeout(() => { root.querySelectorAll('.k-commit').forEach((el) => sayiBas(el, toplam, 1600)); root.querySelectorAll('.k-claude').forEach((el) => sayiBas(el, claude, 1600)); }, 900);
  root.querySelectorAll('.k-yuzde').forEach((el) => { el.textContent = `(%${Math.round(claude / toplam * 100)})`; });
  const tarih = new Date(SAYILAR.tarih + 'T00:00').toLocaleDateString(EN ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  root.querySelector('.k-not').textContent = t(`${PROJELER.length} açık kaynak projenin toplamı, ${tarih}. Her kare bir commit; turuncular Claude ile ortak yazıldı. Her gün otomatik güncellenir.`, `Total across ${PROJELER.length} open-source projects, ${tarih}. Each square is a commit; orange ones were co-authored with Claude. Updated daily.`);
  const izgara = root.getElementById('k-izgara');
  for (let i = 0; i < toplam; i++) { const q = document.createElement('i'); q.title = i < claude ? t('Claude ile ortak yazıldı', 'Co-authored with Claude') : t('tek başıma', 'on my own'); q.className = i < claude ? 'on' : 'el'; izgara.append(q); }
  if (!AZ) { const sut = 16; [...izgara.children].forEach((q, i) => q.style.setProperty('--d', (i % sut) + Math.floor(i / sut))); }   // köşegen dalga
  root.querySelectorAll('.kanit-oz button').forEach((b) => {
    const ac = () => izgara.classList.add('sec-' + b.dataset.g), kapat = () => izgara.classList.remove('sec-' + b.dataset.g);
    b.addEventListener('pointerenter', ac); b.addEventListener('pointerleave', kapat); b.addEventListener('focus', ac); b.addEventListener('blur', kapat);
  });

  /* ---------- konsol ---------- */
  const satir = (metin, sinif = '') => { const p = document.createElement('p'); if (sinif) p.className = sinif; p.textContent = metin; log.append(p); log.scrollTop = log.scrollHeight; return p; };
  const gezin = { hakkimda: 'hakkimda/', projeler: 'projeler/', slaytlar: 'slaytlar/', iletisim: 'iletisim/', about: 'hakkimda/', projects: 'projeler/', slides: 'slaytlar/', contact: 'iletisim/' };
  let calisiyor = false, gecmis = [], gi = 0, kullanildi = false;

  async function ajan(gorev) {
    calisiyor = true;
    const kisa = gorev.length > 42 ? gorev.slice(0, 41) + '…' : gorev;
    const plan = [
      ['bak', t('kod tabanı okunuyor', 'reading the codebase'), 900],
      ['karar', t('plan hazır, 3 adım', 'plan ready, 3 steps'), 900],
      ['yap', t(`“${kisa}” uygulanıyor`, `applying “${kisa}”`), 1300],
      ['kontrol', t('testler çalışıyor… hepsi geçti', 'running tests… all passed'), 1000],
    ];
    for (const [ad, ileti, sure] of plan) { satir(`● ${ad.padEnd(8)}${ileti}`, 'ad'); await bekle(sure); }
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
    if (anahtar === 'clear') { log.textContent = ''; return; }
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
