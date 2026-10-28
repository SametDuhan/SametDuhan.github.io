// Ana sayfadaki şahin: poz verisi, zamanlama kararları ve sahneye bağlama.
// Ölçüler 1254×1254'lük kaynak çizimlere göre; kesim ve ölçüm araçları tasarım prototipinde.

// Ön pozun ayak hizası ve boyu: diğer pozlar buna oturtulur.
export const ON = { ayakX: 629.5, alt: 1190, boy: 1100 };

export const POZLAR = {
  on: { ...ON, dosya: 'on' },
  kanat: { dosya: 'kanat', ayakX: 624, alt: 1105, boy: 894 },
};

// Atkının kiremit boyası için alanlar (her pozun kendi çiziminde).
export const ATKI = {
  on: [[455, 345], [520, 318], [600, 345], [700, 328], [782, 352], [798, 420], [784, 470], [792, 560], [788, 700], [792, 850], [778, 918], [722, 884], [690, 822], [655, 700], [648, 600], [660, 482], [600, 470], [520, 462], [460, 422]],
  kanat: [[490, 455], [520, 435], [600, 440], [680, 432], [745, 440], [752, 480], [750, 560], [752, 700], [770, 860], [760, 875], [700, 860], [665, 860], [652, 800], [655, 700], [650, 600], [648, 540], [600, 530], [540, 530], [500, 525], [488, 490]],
};

export const KANAT_MS = 1900;
export const GECIS_MS = 160;
const DEPO_ANAHTARI = 'sahin-kanat';

export function pozDonusumu(poz) {
  if (poz.ayakX === ON.ayakX && poz.alt === ON.alt && poz.boy === ON.boy) return '';
  const s = Math.round((ON.boy / poz.boy) * 1e4) / 1e4;
  return `translate(${ON.ayakX} ${ON.alt}) scale(${s}) translate(${-poz.ayakX} ${-poz.alt})`;
}

export const noktalar = (liste) => liste.map(([x, y]) => `${x},${y}`).join(' ');

export const kirpmaGecikmesi = (r) => 2400 + r * 3800;
export const ciftKirpar = (r) => r < 0.25;
export const kendiligindenKanat = (az) => !az;

// Kanat ilk açılışta oturum başına bir kez açılır; depo yoksa ya da hata verirse her açılışta.
export function ilkKanatGerekli(depo) {
  try {
    if (!depo || depo.getItem(DEPO_ANAHTARI)) return !depo;
    depo.setItem(DEPO_ANAHTARI, '1');
    return true;
  } catch {
    return true;
  }
}

export function baslatSahin(kok, {
  az = matchMedia('(prefers-reduced-motion: reduce)').matches,
  depo = (() => { try { return sessionStorage; } catch { return null; } })(),
} = {}) {
  const govde = kok.querySelector('#sahin');
  const pozlar = Object.fromEntries([...kok.querySelectorAll('[data-poz]')].map((p) => [p.dataset.poz, p]));
  const kapaklar = [kok.querySelector('#kapakSol'), kok.querySelector('#kapakSag')].filter(Boolean);
  let kanatta = false;

  const goster = (ad) => {
    for (const [k, p] of Object.entries(pozlar)) p.classList.toggle('aktif', k === ad);
  };

  function kanatAc() {
    if (kanatta || !pozlar.kanat) return;
    kanatta = true;
    goster('kanat');
    setTimeout(() => { goster('on'); kanatta = false; }, KANAT_MS);
  }

  function kirp() {
    for (const k of kapaklar) { k.classList.remove('kirp'); void k.getBBox(); k.classList.add('kirp'); }
  }

  if (!az) {
    (function kirpDongu() {
      if (!kanatta) {
        kirp();
        if (ciftKirpar(Math.random())) setTimeout(kirp, 260);
      }
      setTimeout(kirpDongu, kirpmaGecikmesi(Math.random()));
    })();
  }

  if (kendiligindenKanat(az) && ilkKanatGerekli(depo)) setTimeout(kanatAc, 900);

  govde.addEventListener('click', kanatAc);
  govde.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); kanatAc(); }
  });
  return { kanatAc };
}
