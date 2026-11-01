// Projeler, piksel görünüm: "commit hattı". Her projenin commit'leri bir kare; Claude ile ortak yazılanlar projenin renginde, kalanlar sönük.
// Sayılar js/sayilar.js'ten (GitHub Actions günde bir günceller): uydurma değil. Satıra tıklayınca projeye gidilir; gösterge düğmeleri grupları öne çıkarır.
import { SAYILAR } from './sayilar.js';
import { PROJELER } from './projeler.js';
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const repoAdi = (p) => new URL(p.github).pathname.split('/')[2];
const RENKLER = ['var(--vurgu)', 'var(--civit)', 'var(--bakir)'];

export function hatKur() {
  const not = document.querySelector('.sayac-not'), liste = document.querySelector('.vitrinler');
  if (!not || !liste) return undefined;
  const veri = PROJELER.map((p, i) => ({ p, r: SAYILAR.repolar[repoAdi(p)] ?? { commit: 0, claude: 0 }, renk: RENKLER[i % RENKLER.length] }));
  const toplam = veri.reduce((a, v) => a + v.r.commit, 0), claude = veri.reduce((a, v) => a + v.r.claude, 0);

  const kap = document.createElement('section');
  kap.className = 'px-hat'; kap.setAttribute('aria-label', t('Commit hattı: her kare bir commit', 'Commit line: each square is a commit'));
  kap.innerHTML = `<div class="px-hat-ust"><p class="px-hat-baslik"><span class="istem">$</span> git log --all --oneline</p>
      <div class="px-hat-oz" role="group" aria-label="${t('Gösterge', 'Legend')}"><button type="button" data-g="claude"><i class="n t"></i>${t('Claude ile ortak', 'co-authored with Claude')}</button><button type="button" data-g="el"><i class="n g"></i>${t('tek başıma', 'on my own')}</button></div></div>
    <ul class="px-hat-liste">${veri.map((v, i) => `<li><a class="px-hat-satir" href="#${v.p.ad.toLowerCase()}" style="--c:${v.renk}" aria-label="${t(`${v.p.ad}: ${v.r.commit} commit, ${v.r.claude} tanesi Claude ile ortak yazıldı. Projeye git`, `${v.p.ad}: ${v.r.commit} commits, ${v.r.claude} co-authored with Claude. Go to project`)}">
      <span class="px-hat-ad">${v.p.ad}</span><span class="px-hat-say"><b>${v.r.claude}</b> / ${v.r.commit} commit</span><span class="px-hat-kareler" aria-hidden="true"></span></a></li>`).join('')}</ul>
    <p class="px-hat-not">${t(`Toplam ${toplam} commit, ${claude} tanesi Claude ile ortak yazıldı.`, `${toplam} commits in total, ${claude} co-authored with Claude.`)}</p>`;
  not.after(kap);
  kap.querySelectorAll('.px-hat-satir').forEach((a, i) => {
    const v = veri[i], kutu = a.querySelector('.px-hat-kareler');
    for (let n = 0; n < v.r.commit; n++) { const q = document.createElement('i'); q.className = n < v.r.claude ? 'on' : 'el'; q.style.setProperty('--n', n); kutu.append(q); }
  });
  const oz = kap.querySelector('.px-hat-oz');
  const ac = (g) => kap.classList.add('sec-' + g), kapat = (g) => kap.classList.remove('sec-' + g);
  const oz_dinle = [];
  oz.querySelectorAll('button').forEach((b) => {
    const a = () => ac(b.dataset.g), k = () => kapat(b.dataset.g);
    b.addEventListener('pointerenter', a); b.addEventListener('pointerleave', k); b.addEventListener('focus', a); b.addEventListener('blur', k);
    oz_dinle.push([b, a, k]);
  });
  // görününce kareler soldan sağa dolar
  let io;
  if (AZ) kap.classList.add('gor');
  else { io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { kap.classList.add('gor'); io.disconnect(); } }, { threshold: .3 }); io.observe(kap); }
  return () => { io?.disconnect(); oz_dinle.forEach(([b, a, k]) => { b.removeEventListener('pointerenter', a); b.removeEventListener('pointerleave', k); b.removeEventListener('focus', a); b.removeEventListener('blur', k); }); kap.remove(); };
}
