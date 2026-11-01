// Projeler, piksel görünüm: "mini kartlar". Her proje için küçük, az ayrıntılı bir kart (ad, etiketler, kısa özet); satırda en çok 3 kart.
// Her şey sayfanın kendi proje kartlarından okunur (iki dilde de çalışır); karta tıklayınca aşağıdaki ayrıntılı projeye kayar.
import { t } from './dil.js';

const RENKLER = ['var(--vurgu)', 'var(--civit)', 'var(--bakir)'];

export function miniKur() {
  const not = document.querySelector('.sayac-not'), liste = document.querySelector('.vitrinler');
  if (!not || !liste) return undefined;
  const maddeler = [...liste.querySelectorAll('.vitrin[id]')]; if (!maddeler.length) return undefined;

  const kap = document.createElement('section');
  kap.className = 'px-mini'; kap.setAttribute('aria-label', t('Projelere kısa bakış', 'Projects at a glance'));
  const ul = document.createElement('ul'); ul.className = 'px-mini-liste';
  maddeler.forEach((m, i) => {
    const ad = m.querySelector('.v-govde h2')?.dataset.pxMetin ?? m.querySelector('.v-govde h2')?.textContent ?? m.dataset.ad;
    const ozet = m.querySelector('.v-ozet')?.textContent ?? '';
    const li = document.createElement('li'), a = document.createElement('a');
    a.className = 'px-mini-kart'; a.href = '#' + m.id; a.style.setProperty('--c', RENKLER[i % RENKLER.length]);
    a.setAttribute('aria-label', t(`${ad}: ayrıntıya git`, `${ad}: go to details`));
    const baslik = document.createElement('span'); baslik.className = 'px-mini-ad'; baslik.textContent = ad;
    const et = document.createElement('span'); et.className = 'px-mini-et';
    [...m.querySelectorAll('.v-etiketler span')].forEach((s) => { const e = document.createElement('i'); e.textContent = s.textContent.trim(); et.append(e); });
    const oz = document.createElement('span'); oz.className = 'px-mini-oz'; oz.textContent = ozet;
    const ok = document.createElement('span'); ok.className = 'px-mini-ok'; ok.setAttribute('aria-hidden', 'true'); ok.textContent = '↓';
    a.append(baslik, et, oz, ok); li.append(a); ul.append(li);
  });
  kap.append(ul);
  not.after(kap);
  return () => kap.remove();
}
