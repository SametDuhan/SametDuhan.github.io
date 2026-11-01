// Proje detay, piksel görünüm: (1) "Nasıl çalışıyor?" akışı: turuncu bir veri paketi adımlar arasında gider, bulunduğu adım vurgulanır; adıma gelince/odaklanınca/tıklayınca
// döngü durur ve o adım seçilir, ok tuşlarıyla gezilir. (2) Bölüm başlıkları ve "Neler yapıyor?" kart başlıkları görününce karışık harflerden çözülür.
// Metinler sayfanın kendisinden; hareketi azaltınca paket ve çözme yok (adımlar yine seçilebilir). Karakter yok.
const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HARF = 'ABCDEFGHIJKLMNOPRSTUVYZ0123456789<>/_{}#';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function coz(el, sure = 600) {
  const metin = el.dataset.pxMetin ??= el.textContent; if (AZ) return; const bas = performance.now();
  const f = (now) => { const p = clamp((now - bas) / sure, 0, 1); el.textContent = [...metin].map((ch, i) => (ch === ' ' || i < p * metin.length * 1.15 - 1) ? ch : HARF[Math.floor(Math.random() * HARF.length)]).join(''); if (p < 1) el._r = requestAnimationFrame(f); else el.textContent = metin; };
  cancelAnimationFrame(el._r); el._r = requestAnimationFrame(f);
}

export function akisKur() {
  const geri = [];
  // 1) akış
  const yol = document.querySelector('.akis-yol');
  const adimlar = yol ? [...yol.querySelectorAll('li')] : [];
  if (adimlar.length > 1) {
    const paket = document.createElement('i'); paket.className = 'px-paket'; paket.setAttribute('aria-hidden', 'true'); yol.append(paket); yol.classList.add('px-akis-var');
    let simdi = 0, zaman = 0, durduruldu = false, gorunur = false;
    const yerlestir = (i, ani = false) => {
      const li = adimlar[i];
      paket.style.transition = ani || AZ ? 'none' : '';
      paket.style.transform = `translate(${li.offsetLeft + li.offsetWidth / 2 - 6}px, ${li.offsetTop + li.offsetHeight - 4}px)`;
    };
    const sec = (i, { dur = false, ani = false } = {}) => {
      simdi = i; if (dur) { durduruldu = true; clearInterval(zaman); }
      adimlar.forEach((l, j) => { l.classList.toggle('px-aktif', j === i); if (j === i) l.setAttribute('aria-current', 'step'); else l.removeAttribute('aria-current'); });
      yerlestir(i, ani);
    };
    const don = () => { clearInterval(zaman); if (!AZ && !durduruldu && gorunur) zaman = setInterval(() => sec((simdi + 1) % adimlar.length), 1300); };
    const dinle = [];
    adimlar.forEach((l, i) => {
      l.tabIndex = 0;
      const a = () => sec(i, { dur: true }), tus = (e) => {
        const h = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? adimlar.length - 1 : null;
        if (h === null || h < 0 || h >= adimlar.length) return; e.preventDefault(); adimlar[h].focus(); sec(h, { dur: true });
      };
      l.addEventListener('pointerenter', a); l.addEventListener('focus', a); l.addEventListener('click', a); l.addEventListener('keydown', tus);
      dinle.push([l, a, tus]);
    });
    const io = new IntersectionObserver(([e]) => { gorunur = e.isIntersecting; if (gorunur) don(); else clearInterval(zaman); }, { threshold: .4 }); io.observe(yol);
    const olc = () => yerlestir(simdi, true); addEventListener('resize', olc);
    sec(0, { ani: true });
    geri.push(() => { clearInterval(zaman); io.disconnect(); removeEventListener('resize', olc); dinle.forEach(([l, a, tus]) => { l.removeEventListener('pointerenter', a); l.removeEventListener('focus', a); l.removeEventListener('click', a); l.removeEventListener('keydown', tus); l.removeAttribute('tabindex'); l.removeAttribute('aria-current'); l.classList.remove('px-aktif'); }); paket.remove(); yol.classList.remove('px-akis-var'); });
  }
  // 2) başlıklar
  const basliklar = [...document.querySelectorAll('.bolum-baslik, .ozellikler li b')];
  const gozlem = new IntersectionObserver((kayitlar) => kayitlar.forEach((k) => { if (k.isIntersecting) { gozlem.unobserve(k.target); coz(k.target); } }), { threshold: .6 });
  basliklar.forEach((b) => { b.setAttribute('aria-label', b.textContent.trim()); gozlem.observe(b); });
  geri.push(() => { gozlem.disconnect(); basliklar.forEach((b) => { cancelAnimationFrame(b._r); if (b.dataset.pxMetin) b.textContent = b.dataset.pxMetin; b.removeAttribute('aria-label'); delete b.dataset.pxMetin; }); });
  return () => geri.forEach((f) => f());
}
