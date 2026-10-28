// Liste sayfaları (projeler, slaytlar) tek ekrandır: sayfa başına en fazla SAYFA_BOYU öğe; fazlası sonraki sayfaya geçer.
export const SAYFA_BOYU = 5;

export function sayfala(liste, sayfa, boyut = SAYFA_BOYU) {
  const adet = Math.max(1, Math.ceil(liste.length / boyut));
  const s = Math.min(adet, Math.max(1, Math.trunc(Number(sayfa)) || 1));
  return { ogeler: liste.slice((s - 1) * boyut, s * boyut), sayfa: s, adet };
}

// <nav class="liste-sayfalar"> içine "← önceki · 1 / 2 · sonraki →" kurar; tek sayfada gizli kalır.
// git(n) yeni sayfayı ister; dönen goster(durum) sayfalama sonucunu yansıtır.
export function sayfaGezinmesi(nav, git) {
  const onceki = Object.assign(document.createElement('button'), { type: 'button', className: 'dugme', textContent: '← önceki' });
  const sonraki = Object.assign(document.createElement('button'), { type: 'button', className: 'dugme', textContent: 'sonraki →' });
  const durum = document.createElement('span');
  durum.setAttribute('aria-live', 'polite');
  nav.replaceChildren(onceki, durum, sonraki);
  let simdi = { sayfa: 1, adet: 1 };
  onceki.addEventListener('click', () => git(simdi.sayfa - 1));
  sonraki.addEventListener('click', () => git(simdi.sayfa + 1));
  return function goster(sonuc) {
    simdi = sonuc;
    nav.hidden = sonuc.adet <= 1;
    onceki.disabled = sonuc.sayfa <= 1;
    sonraki.disabled = sonuc.sayfa >= sonuc.adet;
    durum.textContent = `${sonuc.sayfa} / ${sonuc.adet}`;
  };
}
