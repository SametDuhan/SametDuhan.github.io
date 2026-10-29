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

export function pozDonusumu(poz) {
  if (poz.ayakX === ON.ayakX && poz.alt === ON.alt && poz.boy === ON.boy) return '';
  const s = Math.round((ON.boy / poz.boy) * 1e4) / 1e4;
  return `translate(${ON.ayakX} ${ON.alt}) scale(${s}) translate(${-poz.ayakX} ${-poz.alt})`;
}

export const noktalar = (liste) => liste.map(([x, y]) => `${x},${y}`).join(' ');

export const kirpmaGecikmesi = (r) => 2400 + r * 3800;
export const ciftKirpar = (r) => r < 0.25;

export function baslatSahin(kok, {
  az = matchMedia('(prefers-reduced-motion: reduce)').matches,
} = {}) {
  const kapaklar = [kok.querySelector('#kapakSol'), kok.querySelector('#kapakSag')].filter(Boolean);

  function kirp() {
    for (const k of kapaklar) { k.classList.remove('kirp'); void k.getBBox(); k.classList.add('kirp'); }
  }

  if (!az) {
    (function kirpDongu() {
      kirp();
      if (ciftKirpar(Math.random())) setTimeout(kirp, 260);
      setTimeout(kirpDongu, kirpmaGecikmesi(Math.random()));
    })();
  }
}
