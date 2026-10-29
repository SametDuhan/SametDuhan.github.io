// Dil seçici ve dil adresleri. Türkçe sayfalar kökte, İngilizce sürümleri aynı yolla /en/ altında durur.
export const URL_KOK = 'https://sametduhan.github.io/';
const derinlik = (yol) => yol.split('/').filter(Boolean).length;

// yol: sayfanın Türkçe adresi (kökten, '' ana sayfa, 'hakkimda/', 'slaytlar/ai-ajani-nedir/').
export const trAdresi = (yol) => `${URL_KOK}${yol}`;
export const enAdresi = (yol) => `${URL_KOK}en/${yol}`;

// <head> içine: aynı sayfanın öbür dildeki karşılığı (arama motorları için)
export const dilEtiketleri = (yol) => `<link rel="alternate" hreflang="tr" href="${trAdresi(yol)}">
  <link rel="alternate" hreflang="en" href="${enAdresi(yol)}">
  <link rel="alternate" hreflang="x-default" href="${trAdresi(yol)}">`;

// Sayfadaki TR | EN seçici. dil: sayfanın kendi dili. Bağlantılar sayfadan sayfaya göredir.
export function dilSecici(yol, dil) {
  const d = derinlik(yol);
  const trHref = dil === 'tr' ? './' : `${'../'.repeat(d + 1)}${yol}`;
  const enHref = dil === 'en' ? './' : `${'../'.repeat(d)}en/${yol}`;
  const etiket = dil === 'tr' ? 'Dil' : 'Language';
  return `<!--dil--><div class="dil-sec" role="group" aria-label="${etiket}"><a href="${trHref}" lang="tr" hreflang="tr"${dil === 'tr' ? ' aria-current="true"' : ''}>TR</a><a href="${enHref}" lang="en" hreflang="en"${dil === 'en' ? ' aria-current="true"' : ''}>EN</a></div><!--/dil-->`;
}
