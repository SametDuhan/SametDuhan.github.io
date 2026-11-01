// Slaytlar, piksel görünüm: "içindekiler" paneli. Bir sunumu seç (sekme ya da kartın üstüne gel/odaklan): sunum sayfasının kendisinden
// slayt başlıkları çekilir ve terminal kutusunda listelenir; her satır o slayta gider (sunum adresi #n). Çekilemezse sunuma bağlantı kalır.
import { kartlariBekle } from './piksel-slaytlar-yardim.js';
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const onbellek = new Map();

async function slaytlariOku(slug) {
  if (onbellek.has(slug)) return onbellek.get(slug);
  const yanit = await fetch(new URL(`./${slug}/`, location.href)); if (!yanit.ok) throw new Error(yanit.status);
  const dok = new DOMParser().parseFromString(await yanit.text(), 'text/html');
  const liste = [...dok.querySelectorAll('.slayt')].map((s, i) => ({ n: i + 1, kicker: s.querySelector('.kucuk-baslik')?.textContent.trim() ?? '', baslik: s.querySelector('h1, h2')?.textContent.trim() ?? '' })).filter((s) => s.baslik);
  onbellek.set(slug, liste); return liste;
}

export function icindekilerKur() {
  const kutu = document.getElementById('desteler'); if (!kutu) return undefined;
  return kartlariBekle(kutu, () => {
    const kartlar = [...kutu.querySelectorAll('.deste-karti')];
    const veri = kartlar.map((k) => ({ kart: k, slug: new URL(k.href, location.href).pathname.split('/').filter(Boolean).at(-1), baslik: k.querySelector('h2')?.textContent.trim() ?? '' })).filter((v) => v.slug);
    if (!veri.length) return undefined;

    const panel = document.createElement('section');
    panel.className = 'px-ic';
    panel.innerHTML = `<div class="px-ic-sek" role="tablist" aria-label="${t('Sunum seç', 'Pick a deck')}">${veri.map((v, i) => `<button type="button" role="tab" id="px-ic-t${i}" aria-controls="px-ic-p" aria-selected="false" data-i="${i}">${v.baslik}</button>`).join('')}</div>
      <div class="px-ic-govde" id="px-ic-p" role="tabpanel" aria-live="polite"></div>`;
    kutu.after(panel);
    const sekmeler = [...panel.querySelectorAll('button')], govde = panel.querySelector('.px-ic-govde');
    let sira = -1, jeton = 0, hoverZaman;

    async function sec(i, { odak = false } = {}) {
      if (i === sira || i < 0 || i >= veri.length) return; sira = i; const ben = ++jeton, v = veri[i];
      sekmeler.forEach((b, n) => { b.setAttribute('aria-selected', String(n === i)); b.tabIndex = n === i ? 0 : -1; });
      veri.forEach((x, n) => x.kart.classList.toggle('px-secili', n === i));
      if (odak) sekmeler[i].focus();
      govde.setAttribute('aria-labelledby', `px-ic-t${i}`);
      govde.innerHTML = `<p class="px-ic-komut"><span class="istem">$</span> ls slaytlar/<b>${v.slug}</b>/</p><p class="px-ic-yukle">${t('yükleniyor…', 'loading…')}</p>`;
      try {
        const slaytlar = await slaytlariOku(v.slug); if (ben !== jeton) return;
        govde.innerHTML = `<p class="px-ic-komut"><span class="istem">$</span> ls slaytlar/<b>${v.slug}</b>/ <span class="px-ic-say">${slaytlar.length} ${t('slayt', 'slides')}</span></p>
          <ol class="px-ic-liste">${slaytlar.map((s, k) => `<li style="--k:${k}"><a href="./${v.slug}/#${s.n}"><span class="n">${String(s.n).padStart(2, '0')}</span><span class="y"><em></em><b></b></span></a></li>`).join('')}</ol>
          <a class="px-ic-ac" href="./${v.slug}/">${t('sunumu baştan aç', 'open the deck from the start')} →</a>`;
        govde.querySelectorAll('li').forEach((li, k) => { li.querySelector('em').textContent = slaytlar[k].kicker; li.querySelector('b').textContent = slaytlar[k].baslik; });
        if (AZ) govde.classList.add('px-ic-hazir'); else { govde.classList.remove('px-ic-hazir'); void govde.offsetWidth; govde.classList.add('px-ic-hazir'); }
      } catch {
        if (ben !== jeton) return;
        govde.innerHTML = `<p class="px-ic-komut"><span class="istem">$</span> ls slaytlar/<b>${v.slug}</b>/</p><p class="px-ic-yukle">${t('İçindekiler şimdi yüklenemedi.', 'The contents could not be loaded right now.')}</p><a class="px-ic-ac" href="./${v.slug}/">${t('sunumu aç', 'open the deck')} →</a>`;
      }
    }

    const dinleyiciler = [];
    sekmeler.forEach((b, i) => b.addEventListener('click', () => sec(i)));
    panel.querySelector('.px-ic-sek').addEventListener('keydown', (e) => {
      const i = sira, hedef = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? veri.length - 1 : null;
      if (hedef === null || hedef < 0 || hedef >= veri.length) return; e.preventDefault(); sec(hedef, { odak: true });
    });
    veri.forEach((v, i) => {
      const ac = () => { clearTimeout(hoverZaman); hoverZaman = setTimeout(() => sec(i), 140); };
      v.kart.addEventListener('pointerenter', ac); v.kart.addEventListener('focus', ac); dinleyiciler.push([v.kart, ac]);
    });
    sec(0);
    return () => { clearTimeout(hoverZaman); jeton++; dinleyiciler.forEach(([k, f]) => { k.removeEventListener('pointerenter', f); k.removeEventListener('focus', f); k.classList.remove('px-secili'); }); panel.remove(); };
  });
}
