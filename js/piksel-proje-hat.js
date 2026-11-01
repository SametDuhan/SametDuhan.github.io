// Proje detay, piksel görünüm: (1) projenin kendi commit hattı: her commit bir kare, Claude ile ortak yazılanlar turuncu (sayılar js/sayilar.js'ten, GitHub Actions
// günde bir günceller); (2) kahraman bölümünde "git clone" komutu: tıklayınca projenin GitHub adresinden kurulan komut panoya kopyalanır. Karakter yok.
import { SAYILAR } from './sayilar.js';
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;

async function kopyala(metin) {
  try { await navigator.clipboard.writeText(metin); return true; } catch {}
  const a = document.createElement('textarea'); a.value = metin; a.style.cssText = 'position:fixed;opacity:0'; document.body.append(a); a.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch {} a.remove(); return ok;
}

export function hatKur() {
  const kahraman = document.querySelector('.p-kahraman'), sayaclar = document.querySelector('.sayaclar');
  const gh = kahraman?.querySelector('a[href*="github.com/SametDuhan/"]');
  if (!kahraman || !gh) return undefined;
  const repo = new URL(gh.href).pathname.split('/').filter(Boolean)[1];
  const geri = [];

  // 1) commit hattı
  const r = SAYILAR.repolar[repo];
  if (r && sayaclar) {
    const kap = document.createElement('div'); kap.className = 'px-phat';
    kap.setAttribute('role', 'img'); kap.setAttribute('aria-label', t(`${repo}: ${r.commit} commit, ${r.claude} tanesi Claude ile ortak yazıldı`, `${repo}: ${r.commit} commits, ${r.claude} co-authored with Claude`));
    kap.innerHTML = `<p class="px-phat-ust"><span class="istem">$</span> git log --oneline <b>${repo}</b><span class="px-phat-say"><b>${r.claude}</b> / ${r.commit} ${t('commit Claude ile ortak yazıldı', 'commits co-authored with Claude')}</span></p><div class="px-phat-kareler" aria-hidden="true"></div>`;
    const kutu = kap.querySelector('.px-phat-kareler');
    for (let n = 0; n < r.commit; n++) { const q = document.createElement('i'); q.className = n < r.claude ? 'on' : 'el'; q.style.setProperty('--n', n); kutu.append(q); }
    sayaclar.after(kap); geri.push(() => kap.remove());
    if (AZ) kap.classList.add('gor'); else { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { kap.classList.add('gor'); io.disconnect(); } }, { threshold: .4 }); io.observe(kap); geri.push(() => io.disconnect()); }
  }

  // 2) git clone komutu
  const linkler = kahraman.querySelector('.linkler');
  if (linkler) {
    const komut = `git clone ${gh.href.replace(/\/$/, '')}.git`;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'px-clone';
    b.innerHTML = `<span class="istem">$</span> <code></code><span class="px-clone-not">${t('kopyala', 'copy')}</span>`; b.querySelector('code').textContent = komut;
    b.setAttribute('aria-label', t(`Kopyala: ${komut}`, `Copy: ${komut}`));
    let z; const not = b.querySelector('.px-clone-not');
    const git = async () => { not.textContent = (await kopyala(komut)) ? t('✓ kopyalandı', '✓ copied') : t('seçip kopyala', 'select and copy'); b.classList.add('px-kopya'); clearTimeout(z); z = setTimeout(() => { not.textContent = t('kopyala', 'copy'); b.classList.remove('px-kopya'); }, 1800); };
    b.addEventListener('click', git); linkler.after(b);
    geri.push(() => { clearTimeout(z); b.remove(); });
  }
  return () => geri.forEach((f) => f());
}
