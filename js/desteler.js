// Yeni deste = bu listeye bir satır + slaytlar/<slug>/index.html. En yeni en üstte.
export const DESTELER = [
  {
    slug: 'ai-ajani-nedir',
    baslik: 'AI ajanı nedir?',
    etiket: 'Başlangıç',
    aciklama: 'Sohbet botuyla iş bitiren ajan arasındaki fark. Hiç bilmeyen için, sıfırdan.',
    slaytSayisi: 9,
  },
  {
    slug: 'claude-code-hook',
    baslik: 'Claude Code hook\'u ile otomasyon',
    etiket: 'Claude Code',
    aciklama: '"Şu olunca şunu çalıştır": AI işini bitirince ekranda zıplayan bir karakter nasıl yapılır.',
    slaytSayisi: 1,
    ornek: 'claude-done-pixel',
  },
  {
    slug: 'skytrack-nasil-kurdum',
    baslik: 'SkyTrack\'i AI ile nasıl kurdum',
    etiket: 'Proje',
    aciklama: 'Canlı uçak takip uygulaması, commit commit: AI neyi hızlandırdı, kararları kim verdi.',
    slaytSayisi: 1,
    ornek: 'SkyTrack',
  },
];

const kacis = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function kartHTML(d) {
  const ornek = d.ornek ? ` · örnek: ${kacis(d.ornek)}` : '';
  return `<a class="deste-karti" href="./${kacis(d.slug)}/">
  <span class="etiket">${kacis(d.etiket)}</span>
  <h2>${kacis(d.baslik)}</h2>
  <p>${kacis(d.aciklama)}</p>
  <span class="alt">${d.slaytSayisi} slayt${ornek} →</span>
</a>`;
}
