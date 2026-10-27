// Yeni deste = bu listeye bir satır + slaytlar/<slug>/index.html. En yeni en üstte.
export const DESTELER = [
  {
    slug: 'ai-ajani-nedir',
    baslik: 'AI ajanı nedir?',
    etiket: 'Başlangıç',
    aciklama: 'Sohbet botuyla iş bitiren ajan arasındaki fark. Hiç bilmeyen için, sıfırdan.',
    slaytSayisi: 9,
    dakika: 8,
  },
  {
    slug: 'claude-code-hook',
    baslik: 'Claude Code hook\'u ile otomasyon',
    etiket: 'Claude Code',
    aciklama: '"Şu olunca şunu çalıştır": AI işini bitirince ekranda zıplayan bir karakter nasıl yapılır.',
    slaytSayisi: 9,
    dakika: 8,
    ornek: 'claude-done-pixel',
  },
  {
    slug: 'skytrack-nasil-kurdum',
    baslik: 'SkyTrack\'i AI ile nasıl kurdum',
    etiket: 'Proje',
    aciklama: 'Canlı uçak takip uygulaması, commit commit: AI neyi hızlandırdı, kararları kim verdi.',
    slaytSayisi: 9,
    dakika: 10,
    ornek: 'SkyTrack',
  },
];

const sade = (s) => String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function desteAra(liste, sorgu, etiket) {
  const q = sade(sorgu.trim());
  return liste.filter((d) => (etiket === 'hepsi' || d.etiket === etiket)
    && (!q || sade(`${d.baslik} ${d.aciklama} ${d.etiket} ${d.ornek || ''}`).includes(q)));
}

const kacis = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function kartHTML(d, ilerleme = null) {
  const ornek = d.ornek ? ` · örnek: ${kacis(d.ornek)}` : '';
  const devam = ilerleme && !ilerleme.bitti && ilerleme.konum > 0;
  const rozet = ilerleme?.bitti ? '<span class="rozet bitti">✓ tamamlandı</span>'
    : devam ? `<span class="rozet">kaldığın yer: ${ilerleme.konum + 1}/${ilerleme.n}</span>` : '';
  const href = devam ? `./${kacis(d.slug)}/#${ilerleme.konum + 1}` : `./${kacis(d.slug)}/`;
  return `<a class="deste-karti" href="${href}">
  <span class="etiket">${kacis(d.etiket)}</span>${rozet}
  <h2>${kacis(d.baslik)}</h2>
  <p>${kacis(d.aciklama)}</p>
  <span class="alt">${d.slaytSayisi} slayt · ~${d.dakika} dk${ornek} ${devam ? '· devam et' : ''} →</span>
</a>`;
}
