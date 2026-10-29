// Ana sayfadaki şahin: poz verisi, zamanlama kararları ve sahneye bağlama.
// Ölçüler 1254×1254'lük kaynak çizimlere göre; kesim ve ölçüm araçları tasarım prototipinde.

// Ön pozun ayak hizası ve boyu: diğer pozlar buna oturtulur.
export const ON = { ayakX: 629.5, alt: 1190, boy: 1100 };

export const POZLAR = {
  on: { ...ON, dosya: 'on' },
};

// Atkının kiremit boyası için alanlar (her pozun kendi çiziminde).
export const ATKI = {
  on: [[455, 345], [520, 318], [600, 345], [700, 328], [782, 352], [798, 420], [784, 470], [792, 560], [788, 700], [792, 850], [778, 918], [722, 884], [690, 822], [655, 700], [648, 600], [660, 482], [600, 470], [520, 462], [460, 422]],
};

// Kanat videosu (video/sahin-sahne.webm, ~5 sn, şeffaf zeminli) her 8 sn'de bir başlar; bitince şahin yine düz durur.
export const VIDEO_ARALIK_MS = 8000;
export const VIDEO_SURE_MS = 5042;

export function pozDonusumu(poz) {
  if (poz.ayakX === ON.ayakX && poz.alt === ON.alt && poz.boy === ON.boy) return '';
  const s = Math.round((ON.boy / poz.boy) * 1e4) / 1e4;
  return `translate(${ON.ayakX} ${ON.alt}) scale(${s}) translate(${-poz.ayakX} ${-poz.alt})`;
}

export const noktalar = (liste) => liste.map(([x, y]) => `${x},${y}`).join(' ');

export const kirpmaGecikmesi = (r) => 2400 + r * 3800;
export const ciftKirpar = (r) => r < 0.25;

// Şeffaf zeminli WebM (VP9 alfa) Chrome, Edge ve Firefox'ta çalışır; Safari alfayı yok sayıp zemini siyah çizer, orada video hiç oynamaz.
export function videoDestekliMi(ua, oynatilabilir) {
  const safari = /safari/i.test(ua) && !/chrome|chromium|crios|fxios|edg|android/i.test(ua);
  return Boolean(oynatilabilir) && !safari;
}

// Video katmanı, şahin sahnesinin (viewBox 1100×1560, ortalanmış, gerekirse yanlarda boşluklu) çizildiği dikdörtgene oturur.
export const SAHNE = { genislik: 1100, yukseklik: 1560 };
export function sahneKutusu(kutu, ana) {
  const olcek = Math.min(kutu.width / SAHNE.genislik, kutu.height / SAHNE.yukseklik);
  const w = SAHNE.genislik * olcek, h = SAHNE.yukseklik * olcek;
  return { left: kutu.left - ana.left + (kutu.width - w) / 2, top: kutu.top - ana.top + (kutu.height - h) / 2, width: w, height: h };
}

export function baslatSahin(kok, {
  az = matchMedia('(prefers-reduced-motion: reduce)').matches,
  ua = navigator.userAgent,
} = {}) {
  const govde = kok.querySelector('#sahin');
  const video = kok.parentElement.querySelector('#sahinVideo');
  const katman = video?.parentElement;
  const olcu = kok.parentElement.querySelector('svg');
  const kapaklar = [kok.querySelector('#kapakSol'), kok.querySelector('#kapakSag')].filter(Boolean);
  const videoVar = Boolean(video) && !az && videoDestekliMi(ua, video.canPlayType('video/webm; codecs="vp9"'));
  let oynuyor = false;
  let guvenlik = 0;

  function videoBitti() {
    clearTimeout(guvenlik);
    kok.classList.remove('video-oynuyor');
    oynuyor = false;
  }

  function videoOynat() {
    if (!videoVar || oynuyor || document.hidden) return;
    oynuyor = true;
    video.currentTime = 0;
    video.play().catch(videoBitti);
    // Video takılırsa şahin sonsuza dek kanat açık kalmasın: süre + 2 sn sonra düz poza döner.
    guvenlik = setTimeout(() => { video.pause(); videoBitti(); }, VIDEO_SURE_MS + 2000);
  }

  function kirp() {
    for (const k of kapaklar) { k.classList.remove('kirp'); void k.getBBox(); k.classList.add('kirp'); }
  }

  if (!az) {
    (function kirpDongu() {
      if (!oynuyor) {
        kirp();
        if (ciftKirpar(Math.random())) setTimeout(kirp, 260);
      }
      setTimeout(kirpDongu, kirpmaGecikmesi(Math.random()));
    })();
  }

  function yerlestir() {
    const k = sahneKutusu(olcu.getBoundingClientRect(), kok.parentElement.getBoundingClientRect());
    Object.assign(katman.style, { left: `${k.left}px`, top: `${k.top}px`, width: `${k.width}px`, height: `${k.height}px` });
  }

  if (videoVar) {
    yerlestir();
    new ResizeObserver(yerlestir).observe(olcu);
    // İlk kare ekrana gelince ayaktaki şahin maskelenir; böylece boş kare görünmez.
    video.addEventListener('playing', () => kok.classList.add('video-oynuyor'));
    video.addEventListener('ended', videoBitti);
    video.addEventListener('error', videoBitti);
    setInterval(videoOynat, VIDEO_ARALIK_MS);
  }

  govde.addEventListener('click', videoOynat);
  govde.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); videoOynat(); }
  });
  return { videoOynat };
}
