// Deste motoru: section.slayt'ları tek tek gösterir; klavye, kaydırma, hash ve slayt içi bileşenler.
// Saf fonksiyonlar Node'da sınanır; bagla() tarayıcıya bağlar.

import { ilerlemeKaydet, ilerlemeOku, ilerlemeSifirla } from './ilerleme.js';

export function sikistir(i, n) {
  return Math.min(n - 1, Math.max(0, i));
}

export function hashtenKonum(hash, n) {
  const sayi = parseInt(String(hash).replace(/^#/, ''), 10);
  return Number.isNaN(sayi) ? 0 : sikistir(sayi - 1, n);
}

const TUSLAR = {
  ArrowRight: 'ileri', PageDown: 'ileri', ' ': 'ileri',
  ArrowLeft: 'geri', PageUp: 'geri',
  Home: 'basa', End: 'sona',
  f: 'tamekran', F: 'tamekran',
  '?': 'yardim', Escape: 'kapat',
};

export function tusEylemi(key) {
  return TUSLAR[key] ?? null;
}

export function kaydirmaYonu(dx, dy) {
  if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return null;
  return dx < 0 ? 'ileri' : 'geri';
}

export function soruSonucu(secilen, dogru) {
  return secilen === dogru;
}

function sorulariBagla(kok) {
  for (const soru of kok.querySelectorAll('.soru')) {
    soru.addEventListener('click', (e) => {
      const dugme = e.target.closest('button[data-secenek]');
      if (!dugme) return;
      const dogruMu = soruSonucu(dugme.dataset.secenek, soru.dataset.dogru);
      for (const b of soru.querySelectorAll('button[data-secenek]')) b.classList.remove('dogru', 'yanlis');
      dugme.classList.add(dogruMu ? 'dogru' : 'yanlis');
      soru.classList.add('cevaplandi');
      const sonuc = soru.querySelector('.sonuc');
      if (sonuc) sonuc.textContent = dogruMu ? '✓ Doğru.' : '✗ Tekrar dene.';
    });
  }
}

function adimKodlariBagla(kok) {
  for (const pre of kok.querySelectorAll('pre.adim-kod')) {
    const satirlar = [...pre.querySelectorAll('.satir')];
    const not = document.createElement('p');
    not.className = 'adim-not';
    not.setAttribute('aria-live', 'polite');
    const dugme = document.createElement('button');
    dugme.type = 'button';
    dugme.className = 'dugme';
    let acik = 0;
    const guncelle = () => {
      satirlar.forEach((s, i) => s.classList.toggle('acik', i < acik));
      satirlar.forEach((s, i) => s.classList.toggle('simdi', i === acik - 1));
      not.textContent = acik ? satirlar[acik - 1].dataset.not || '' : 'Satır satır açmak için düğmeye bas.';
      dugme.textContent = acik < satirlar.length ? `sonraki satır (${acik}/${satirlar.length}) ↓` : 'baştan ↺';
    };
    dugme.addEventListener('click', () => { acik = acik < satirlar.length ? acik + 1 : 0; guncelle(); });
    pre.after(dugme, not);
    guncelle();
  }
}

function deneKutulariBagla(kok) {
  for (const kutu of kok.querySelectorAll('.dene')) {
    const dugme = kutu.querySelector('button');
    const kod = kutu.querySelector('code');
    if (!dugme || !kod) continue;
    dugme.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(kod.textContent);
        dugme.textContent = 'kopyalandı ✓';
      } catch {
        dugme.textContent = 'seçip kopyala';
      }
      setTimeout(() => { dugme.textContent = 'kopyala'; }, 2000);
    });
  }
}

export function bagla(kok) {
  kok.classList.add('js-hazir');
  const slaytlar = [...kok.querySelectorAll('section.slayt')];
  const n = slaytlar.length;
  let konum = -1;
  const slug = location.pathname.split('/').filter(Boolean).pop() || '';
  let depo = null;
  try { depo = localStorage; } catch { /* engelli depo: ilerleme hatırlanmaz */ }

  const sayac = kok.querySelector('.sayac');
  const alt = document.createElement('nav');
  alt.className = 'deste-alt';
  alt.setAttribute('aria-label', 'Slayt gezinmesi');
  const geri = Object.assign(document.createElement('button'), { type: 'button', className: 'dugme', textContent: '← önceki' });
  const ileri = Object.assign(document.createElement('button'), { type: 'button', className: 'dugme', textContent: 'sonraki →' });
  const noktalar = document.createElement('div');
  noktalar.className = 'noktalar';
  const noktaDugmeleri = slaytlar.map((_, i) => {
    const b = Object.assign(document.createElement('button'), { type: 'button', className: 'nokta' });
    b.setAttribute('aria-label', `Slayt ${i + 1}`);
    b.addEventListener('click', () => git(i));
    noktalar.append(b);
    return b;
  });
  alt.append(geri, noktalar, ileri);
  kok.append(alt);

  const cubuk = document.createElement('div');
  cubuk.className = 'deste-ilerleme';
  cubuk.setAttribute('aria-hidden', 'true');
  cubuk.append(document.createElement('i'));
  kok.prepend(cubuk);
  if (sayac) sayac.setAttribute('aria-live', 'polite');

  const yardim = document.createElement('dialog');
  yardim.className = 'yardim';
  yardim.setAttribute('aria-label', 'Klavye kısayolları');
  yardim.innerHTML = `<h2>Kısayollar</h2>
<dl>
  <dt>→ · Boşluk · PageDown</dt><dd>sonraki slayt</dd>
  <dt>← · PageUp</dt><dd>önceki slayt</dd>
  <dt>Home · End</dt><dd>ilk · son slayt</dd>
  <dt>F</dt><dd>tam ekran</dd>
  <dt>?</dt><dd>bu yardım</dd>
  <dt>telefonda</dt><dd>sola / sağa kaydır</dd>
</dl>
<p>Kaldığın yer bu tarayıcıda hatırlanır.</p>
<button type="button" class="dugme">kapat (Esc)</button>`;
  yardim.querySelector('button').addEventListener('click', () => yardim.close());
  yardim.addEventListener('click', (e) => { if (e.target === yardim) yardim.close(); });
  kok.append(yardim);
  const ust = kok.querySelector('.deste-ust');
  if (ust) {
    const soru = Object.assign(document.createElement('button'), { type: 'button', className: 'yardim-dugme', textContent: '?' });
    soru.setAttribute('aria-label', 'Klavye kısayolları');
    soru.addEventListener('click', () => yardim.showModal());
    ust.append(soru);
  }

  function git(i) {
    const yeni = sikistir(i, n);
    if (yeni === konum) return;
    const eski = slaytlar[konum];
    if (eski) {
      // Gizlenen slayttaki düğme odakta kalırsa Boşluk tuşu onu tıklamaya devam eder.
      if (eski.contains(document.activeElement)) document.activeElement.blur();
      eski.hidden = true;
      eski.dispatchEvent(new CustomEvent('gizle'));
    }
    konum = yeni;
    const s = slaytlar[konum];
    s.hidden = false;
    s.dispatchEvent(new CustomEvent('goster'));
    noktaDugmeleri.forEach((b, j) => (j === konum ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
    cubuk.firstChild.style.width = `${((konum + 1) / n) * 100}%`;
    if (sayac) sayac.textContent = `${konum + 1} / ${n}`;
    // Devre dışı kalan düğmede odak kaybolmasın: karşıdaki düğmeye geç.
    const odak = document.activeElement;
    geri.disabled = konum === 0;
    ileri.disabled = konum === n - 1;
    if (odak === ileri && ileri.disabled) geri.focus();
    if (odak === geri && geri.disabled) ileri.focus();
    history.replaceState(null, '', `#${konum + 1}`);
    // Daha ileride kayıtlı bir yer varsa, ziyaretçi onu geçene ya da "baştan" diyene kadar ezilmez.
    if (bekleyen && konum >= onceki.konum) { bekleyen = false; bildirim.hidden = true; }
    if (!bekleyen) ilerlemeKaydet(depo, slug, konum, n);
  }

  const eylem = {
    ileri: () => git(konum + 1),
    geri: () => git(konum - 1),
    basa: () => git(0),
    sona: () => git(n - 1),
    yardim: () => (yardim.open ? yardim.close() : yardim.showModal()),
    kapat: () => yardim.open && yardim.close(),
    tamekran: () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())?.catch?.(() => {}),
  };

  geri.addEventListener('click', eylem.geri);
  ileri.addEventListener('click', eylem.ileri);

  addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest?.('button, a, input, textarea, select') && (e.key === ' ' || e.key === 'Enter')) return;
    const ad = tusEylemi(e.key);
    if (!ad || (yardim.open && ad !== 'yardim' && ad !== 'kapat')) return;
    e.preventDefault();
    eylem[ad]();
  });

  let bas = null;
  kok.addEventListener('touchstart', (e) => { bas = e.touches[0]; }, { passive: true });
  kok.addEventListener('touchend', (e) => {
    if (!bas) return;
    const son = e.changedTouches[0];
    const ad = kaydirmaYonu(son.clientX - bas.clientX, son.clientY - bas.clientY);
    bas = null;
    if (ad && !yardim.open && !e.target.closest('pre, .demo')) eylem[ad]();
  });

  addEventListener('hashchange', () => git(hashtenKonum(location.hash, n)));

  sorulariBagla(kok);
  adimKodlariBagla(kok);
  deneKutulariBagla(kok);

  // Doğrudan açılan sunumda kaldığın yer varsa öner; açılış kendisi kayıtlı ilerlemeyi ezmesin.
  const onceki = ilerlemeOku(depo, slug);
  let bekleyen = Boolean(onceki && !onceki.bitti && onceki.konum > hashtenKonum(location.hash, n));
  let bildirim = null;
  if (bekleyen) {
    bildirim = document.createElement('div');
    bildirim.className = 'devam-bildirim';
    bildirim.setAttribute('role', 'status');
    bildirim.innerHTML = `<span>Kaldığın yer: <b>${Math.min(onceki.konum, n - 1) + 1}/${n}</b></span>
<button type="button" class="dugme" data-devam>devam et →</button>
<button type="button" class="dugme" data-bastan>baştan başla</button>`;
    bildirim.querySelector('[data-devam]').addEventListener('click', () => { git(onceki.konum); ileri.focus(); });
    bildirim.querySelector('[data-bastan]').addEventListener('click', () => {
      bekleyen = false;
      bildirim.hidden = true;
      ilerlemeSifirla(depo, slug);
      git(0);
      ilerlemeKaydet(depo, slug, konum, n);
      ileri.focus();
    });
    kok.append(bildirim);
  }

  slaytlar.forEach((s) => { s.hidden = true; });
  git(hashtenKonum(location.hash, n));
  return { git, get konum() { return konum; } };
}
