// Dış sitelere (http/https) giden bağlantılar yeni sekmede açılır. Sayfa içi bağlantılara ve mailto'ya dokunmaz.
// Kullanım: üreticiler çıktıyı bu fonksiyondan geçirir; elle yazılan dosyalar için testler denetler (tests/dil.test.mjs).
export const YENI_SEKME = ' target="_blank" rel="noopener noreferrer"';

export function disBaglantilar(html) {
  return html.replace(/<a\b([^>]*?)>/g, (tam, oz) => {
    if (!/\shref="https?:\/\//.test(` ${oz}`) || /\starget=/.test(` ${oz}`)) return tam;
    return `<a${oz}${YENI_SEKME}>`;
  });
}

// Denetim: hedefi olmayan dış bağlantıları listeler.
export function eksikDisBaglantilar(html) {
  return [...html.matchAll(/<a\b([^>]*?)>/g)]
    .filter((m) => /\shref="https?:\/\//.test(` ${m[1]}`) && !/\starget="_blank"/.test(m[1]))
    .map((m) => (m[1].match(/href="([^"]*)"/) || [])[1]);
}
