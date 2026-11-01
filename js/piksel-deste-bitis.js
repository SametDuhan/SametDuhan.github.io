// Sunum, piksel görünüm: bitiş ve kısayollar. (1) Son slayta kullanıcı ilerleyerek varınca pikselli konfeti ve "sunum tamamlandı" bildirimi (deste motoru son slayta
// varmayı zaten "tamamlandı" sayıp kaydeder; burada yalnız gösterilir). (2) Son slaytın sonuna "sıradaki sunum" kartı: sunum listesinden (js/desteler.js) bir sonraki
// sunum, sonuncuysa tüm sunumlar. (3) 1-9 tuşları o numaralı slayta gider (adres #n, motorun kendi hashchange yolu); yardım penceresine satır eklenir.
import { DESTELER } from './desteler.js';
import { hazirOlunca } from './piksel-deste.js';
import { t, EN } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function bitisKur() {
  return hazirOlunca('.deste section.slayt', (slaytlar) => {
    const geri = [], son = slaytlar.at(-1), n = slaytlar.length;
    const slug = location.pathname.split('/').filter(Boolean).at(-1), sira = DESTELER.findIndex((d) => d.slug === slug);
    const t0 = performance.now();

    // 2) sıradaki sunum kartı
    const sonraki = sira >= 0 ? DESTELER[(sira + 1) % DESTELER.length] : null;
    const kart = document.createElement('div'); kart.className = 'px-sirada';
    const baslik = (d) => (EN && d.en?.baslik) || d.baslik;
    kart.innerHTML = sonraki && sonraki.slug !== slug
      ? `<p class="px-sirada-komut"><span class="istem">$</span> cat ~/.slaytlar/${t('sirada', 'next')}</p><a class="px-sirada-ac" href="../${sonraki.slug}/"><b></b><span>${sonraki.slaytSayisi} ${t('slayt', 'slides')} · ~${sonraki.dakika} ${t('dk', 'min')}</span><i aria-hidden="true">→</i></a>`
      : `<p class="px-sirada-komut"><span class="istem">$</span> ls ~/.slaytlar</p><a class="px-sirada-ac" href="../"><b>${t('Tüm sunumlar', 'All decks')}</b><span></span><i aria-hidden="true">→</i></a>`;
    if (sonraki && sonraki.slug !== slug) kart.querySelector('b').textContent = baslik(sonraki);
    son.append(kart); geri.push(() => kart.remove());

    // 1) kutlama: son slayta kullanıcı varınca
    const f = () => {
      if (performance.now() - t0 < 300) return;
      const b = document.createElement('div'); b.className = 'px-tamam'; b.setAttribute('role', 'status'); b.textContent = t(`✓ Sunum tamamlandı: ${n} / ${n} slayt`, `✓ Deck completed: ${n} / ${n} slides`);
      document.body.append(b); setTimeout(() => b.remove(), 3600);
      if (AZ) return;
      for (let i = 0; i < 34; i++) {
        const q = document.createElement('i'); q.className = 'px-konfeti'; q.setAttribute('aria-hidden', 'true');
        q.style.cssText = `left:${45 + Math.random() * 10}%;--dx:${Math.round((Math.random() - .5) * 560)}px;--dy:${-Math.round(180 + Math.random() * 280)}px;--d:${Math.round(Math.random() * 180)}ms;--r:${['#d97757', '#2ecc40', '#f09a78', '#f4efe8'][i % 4]}`;
        document.body.append(q); setTimeout(() => q.remove(), 1700);
      }
    };
    son.addEventListener('goster', f); geri.push(() => son.removeEventListener('goster', f));

    // 3) 1-9: slayta git + yardım penceresine satır
    const tus = (e) => {
      if (document.documentElement.dataset.gorunum !== 'piksel' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest?.('input, textarea, select, [contenteditable]') || document.querySelector('dialog[open]')) return;
      if (e.key >= '1' && e.key <= '9' && +e.key <= n) { e.preventDefault(); location.hash = `#${e.key}`; }
    };
    addEventListener('keydown', tus); geri.push(() => removeEventListener('keydown', tus));
    const dl = document.querySelector('dialog.yardim dl');
    if (dl) { const dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = '1–9'; dd.textContent = t('o numaralı slayta git', 'go to that slide'); dt.className = dd.className = 'px-yardim-satir'; dl.append(dt, dd); geri.push(() => { dt.remove(); dd.remove(); }); }
    return () => geri.forEach((g) => g());
  });
}
