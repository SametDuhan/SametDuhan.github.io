// Ana sayfadaki canlı terminal satırı: komut yazılır, çıktısı gelir, silinir, sıradaki (dil değişerek) başlar.
export const ISTEM = 'samet@sahin:~$';

// Sırayla Türkçe, İngilizce, Türkçe, İngilizce. Metinler sitedeki mevcut cümlelerden.
export const SATIRLAR = [
  { dil: 'tr', komut: 'echo "Sistemler. Açıkta kurulur."', cikti: 'Sistemler. Açıkta kurulur.' },
  { dil: 'en', komut: 'echo "Systems. Built in the open."', cikti: 'Systems. Built in the open.' },
  { dil: 'tr', komut: 'cat hakkimda.txt', cikti: 'AI ile sistem kuran geliştirici.' },
  { dil: 'en', komut: 'cat about.txt', cikti: 'Developer building systems with AI.' },
];

export const KOMUT_MS = 58, CIKTI_MS = 24, BEKLE_MS = 2600, ARA_MS = 420;

// t ms sonra ekranda görünen komut ve çıktı (saf; testlerde kullanılır)
export function gorunen(satir, t) {
  const komutBitis = satir.komut.length * KOMUT_MS;
  const komut = satir.komut.slice(0, Math.min(satir.komut.length, Math.floor(t / KOMUT_MS)));
  const c0 = komutBitis + ARA_MS;
  const cikti = t < c0 ? '' : satir.cikti.slice(0, Math.min(satir.cikti.length, Math.floor((t - c0) / CIKTI_MS) + 1));
  return { komut, cikti };
}
export const sure = (satir) => satir.komut.length * KOMUT_MS + ARA_MS + satir.cikti.length * CIKTI_MS + BEKLE_MS;

export function baslat(kok, { az = matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const komutEl = kok.querySelector('.komut'), ciktiEl = kok.querySelector('.cikti');
  if (!komutEl || !ciktiEl) return;
  if (az) { const s = SATIRLAR[1]; komutEl.textContent = s.komut; ciktiEl.textContent = s.cikti; return; }
  let i = 0, bas = null, kare = 0;
  const adim = (zaman) => {
    if (document.hidden) { bas = null; kare = requestAnimationFrame(adim); return; }
    bas ??= zaman;
    const s = SATIRLAR[i], t = zaman - bas, g = gorunen(s, t);
    if (komutEl.textContent !== g.komut) komutEl.textContent = g.komut;
    if (ciktiEl.textContent !== g.cikti) ciktiEl.textContent = g.cikti;
    kok.classList.toggle('yaziyor', g.cikti === '' && g.komut.length < s.komut.length);
    if (t >= sure(s)) { i = (i + 1) % SATIRLAR.length; bas = zaman; }
    kare = requestAnimationFrame(adim);
  };
  kare = requestAnimationFrame(adim);
}
