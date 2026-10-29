// Fixed-height columns keep every paragraph reachable with previous/next controls.
export function ekranaSigdir(root, degisti = () => {}) {
  if (root.ekranPager) return root.ekranPager;
  root.classList.add('ekran-cerceve');
  const strip = document.createElement('div'); strip.className = 'ekran-serit';
  strip.append(...root.childNodes); root.append(strip);
  let page = 0, count = 1, step = 1, frame = 0;
  const api = {
    get konum() { return page; }, get adet() { return count; },
    git(i) { page = Math.min(count - 1, Math.max(0, i)); root.scrollLeft = page * step; degisti(api); },
    ileri() { if (page >= count - 1) return false; api.git(page + 1); return true; },
    geri() { if (page <= 0) return false; api.git(page - 1); return true; },
    yenile() {
      if (!root.clientHeight || !root.clientWidth) return;
      const width = root.clientWidth; step = width + 32;
      strip.style.columnWidth = `${width}px`;
      // A rare oversized indivisible demo is fitted; text flows into further columns.
      for (const e of strip.querySelectorAll('.laboratuvar, .kapak-sahne, .demo, .soru, .kart, .proje-kapak, .piksel-demo')) {
        e.style.zoom = '';
        if (e.offsetHeight > root.clientHeight) e.style.zoom = String(Math.min(1, (root.clientHeight - 4) / e.offsetHeight));
      }
      count = Math.max(1, Math.ceil((strip.scrollWidth + 32 - 2) / step));
      api.git(page);
    },
  };
  root.ekranPager = api;
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => api.yenile()); };
  new ResizeObserver(schedule).observe(root);
  // Only content mutations: our own dimensions and scroll do not retrigger this observer.
  new MutationObserver(schedule).observe(strip, { subtree: true, childList: true, characterData: true });
  strip.addEventListener('load', schedule, true);
  root.addEventListener('focusin', () => { const next = Math.round(root.scrollLeft / step); if (next !== page) { page = next; degisti(api); } });
  document.fonts?.ready.then(schedule);
  api.yenile();
  return api;
}

export function baslatSayfa() {
  const root = document.querySelector('main#icerik');
  if (!root) return;
  document.body.classList.add('tek-ekran');
  // Liste sayfaları kendi sayfalamasını yapar (js/sayfala.js): içerik tek sütunda, ilk ekranda kalır.
  // Uzun, bölünmemesi gereken sayfalar (hakkımda) tek parça kalır; main içinde kaydırılır.
  if (root.dataset.sayfalama === 'kendi' || root.dataset.sayfalama === 'kaydir') { document.body.classList.add('kendi-sayfa'); return; }
  const nav = document.createElement('nav'); nav.className = 'ekran-gezinme'; nav.setAttribute('aria-label', 'Sayfa bölümleri');
  const prev = Object.assign(document.createElement('button'), { type: 'button', className: 'dugme', textContent: '← önceki' });
  const next = Object.assign(document.createElement('button'), { type: 'button', className: 'dugme', textContent: 'sonraki →' });
  const status = document.createElement('span'); status.setAttribute('aria-live', 'polite');
  nav.append(prev, status, next); root.after(nav);
  const pager = ekranaSigdir(root, p => { prev.disabled = p.konum === 0; next.disabled = p.konum === p.adet - 1; status.textContent = `${p.konum + 1} / ${p.adet}`; });
  prev.addEventListener('click', () => pager.geri()); next.addEventListener('click', () => pager.ileri());
  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input,select,textarea,[contenteditable]')) return;
    if (['ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); pager.ileri(); }
    if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); pager.geri(); }
    if (e.key === 'Home') { e.preventDefault(); pager.git(0); }
    if (e.key === 'End') { e.preventDefault(); pager.git(pager.adet - 1); }
  });
  let touch = null;
  root.addEventListener('touchstart', e => { touch = e.touches[0]; }, { passive: true });
  root.addEventListener('touchend', e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.clientX, dy = e.changedTouches[0].clientY - touch.clientY; touch = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy) || e.target.closest('input,select,button,pre,video,canvas')) return;
    dx < 0 ? pager.ileri() : pager.geri();
  }, { passive: true });
  function anchor() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (!target || !root.contains(target)) return;
    const x = target.getBoundingClientRect().left - root.getBoundingClientRect().left + root.scrollLeft;
    pager.git(Math.floor((x + 1) / (root.clientWidth + 32)));
  }
  requestAnimationFrame(anchor);
  addEventListener('hashchange', () => requestAnimationFrame(anchor));
  root.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    requestAnimationFrame(() => { const i = Math.round(root.scrollLeft / (root.clientWidth + 32)); pager.git(i); });
  });
}
