// Slaytlar, piksel görünüm: arama kutusu ve etiket süzgeci (başlık, açıklama, etiket ve örnek proje içinde; iki dilde), "/" ile arama,
// 1-3 ile sunum açma. Süzülen kartlar gizlenir, sayfadaki içerik silinmez; görünüm değişince hepsi geri alınır.
import { DESTELER } from './desteler.js';
import { kartlariBekle } from './piksel-slaytlar-yardim.js';
import { t } from './dil.js';

const sade = (s) => String(s ?? '').toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '');
const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function araKur() {
  const kutu = document.getElementById('desteler'); if (!kutu) return undefined;
  return kartlariBekle(kutu, () => {
    const kartlar = [...kutu.querySelectorAll('.deste-karti')];
    const ogeler = kartlar.map((k) => { const slug = new URL(k.href, location.href).pathname.split('/').filter(Boolean).at(-1), d = DESTELER.find((x) => x.slug === slug);
      return { k, d, etiket: d?.etiket ?? '', ad: k.querySelector('.etiket')?.textContent.trim() ?? '', saman: sade(d ? `${d.baslik} ${d.aciklama} ${d.etiket} ${d.ornek ?? ''} ${d.en?.baslik ?? ''} ${d.en?.aciklama ?? ''} ${d.en?.etiket ?? ''}` : k.textContent) }; });
    const etiketler = [...new Map(ogeler.map((o) => [o.etiket, o.ad])).entries()];

    const bar = document.createElement('div'); bar.className = 'px-ara';
    bar.innerHTML = `<label class="px-ara-kutu"><span class="istem">$</span> grep <input type="search" autocomplete="off" spellcheck="false" placeholder="${t('sunum ara…', 'search decks…')}" aria-label="${t('Sunum ara', 'Search decks')}"><kbd aria-hidden="true">/</kbd></label>
      <div class="px-ara-chipler" role="group" aria-label="${t('Etikete göre süz', 'Filter by tag')}">${etiketler.map(([e, ad]) => `<button type="button" data-e="${e}" aria-pressed="false">${ad}</button>`).join('')}</div>
      <span class="px-ara-say" role="status" aria-live="polite"></span>`;
    const bos = document.createElement('p'); bos.className = 'px-ara-bos'; bos.hidden = true;
    bos.innerHTML = `<span class="istem">$</span> grep: ${t('eşleşme yok', 'no match')} <button type="button">${t('süzgeci temizle', 'clear filters')}</button>`;
    kutu.before(bar); kutu.after(bos);
    const giris = bar.querySelector('input'), say = bar.querySelector('.px-ara-say');
    let etiket = null;
    const uygula = () => {
      const q = sade(giris.value.trim()); let n = 0;
      ogeler.forEach((o) => { const gor = (!etiket || o.etiket === etiket) && (!q || o.saman.includes(q)); o.k.classList.toggle('px-gizli', !gor); if (gor) n++; });
      bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.e === etiket)));
      say.textContent = (q || etiket) ? t(`${n} / ${ogeler.length} sunum`, `${n} / ${ogeler.length} decks`) : t('tümü', 'all');
      bos.hidden = n > 0;
    };
    const temizle = () => { giris.value = ''; etiket = null; uygula(); };
    giris.addEventListener('input', uygula);
    bar.addEventListener('click', (e) => { const b = e.target.closest('button[data-e]'); if (!b) return; etiket = etiket === b.dataset.e ? null : b.dataset.e; uygula(); });
    bos.querySelector('button').addEventListener('click', () => { temizle(); giris.focus(); });
    giris.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (giris.value || etiket) temizle(); else giris.blur(); } });
    const tus = (e) => {
      if (document.documentElement.dataset.gorunum !== 'piksel' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.matches?.('input, textarea')) return;
      if (e.key === '/') { e.preventDefault(); giris.focus(); return; }
      if (e.key >= '1' && e.key <= '9') { const gorunen = ogeler.filter((o) => !o.k.classList.contains('px-gizli')); const o = gorunen[+e.key - 1]; if (o) o.k.click(); }
    };
    addEventListener('keydown', tus);
    uygula();
    return () => { removeEventListener('keydown', tus); ogeler.forEach((o) => o.k.classList.remove('px-gizli')); bar.remove(); bos.remove(); };
  });
}
