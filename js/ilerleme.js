// Destelerde kalınan yeri tarayıcıda hatırlar. Depo yoksa ya da engelliyse sessizce vazgeçer.
const anahtar = (slug) => `deste:${slug}`;

export function ilerlemeOku(depo, slug) {
  try {
    const ham = depo?.getItem(anahtar(slug));
    if (!ham) return null;
    const { konum, n, bitti } = JSON.parse(ham);
    if (!Number.isInteger(konum) || !Number.isInteger(n)) return null;
    return { konum, n, bitti: Boolean(bitti) || konum >= n - 1 };
  } catch {
    return null;
  }
}

export function ilerlemeKaydet(depo, slug, konum, n) {
  try {
    const onceki = ilerlemeOku(depo, slug);
    depo?.setItem(anahtar(slug), JSON.stringify({ konum, n, bitti: Boolean(onceki?.bitti) || konum >= n - 1 }));
  } catch {
    // depo dolu ya da engelli: ilerleme hatırlanmaz, sunum yine çalışır
  }
}

export function ilerlemeSifirla(depo, slug) {
  try {
    depo?.removeItem(anahtar(slug));
  } catch {
    // engelli depo: yapılacak bir şey yok
  }
}
