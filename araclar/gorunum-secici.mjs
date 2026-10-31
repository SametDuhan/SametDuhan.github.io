// Görünüm seçici: sitenin iki tasarımı bir tarih akışında (27 Ekim kâğıt, 31 Ekim modern); her durakta tasarımın küçük önizlemesi (CSS),
// modern için koyu/açık anahtarı.
// Ana sayfada solda dikey şerit (index.html, elle; tests/gorunum.test.mjs aynı olduğunu denetler), alt sayfalarda sol menünün altında.
// Seçimi js/gorunum.js uygular; sayfa çizilmeden önceki değer js/gorunum-erken.js'ten gelir.
export const GORUNUMLER = [
  { kod: 'retro', tarih: '2026-10-27', gun: '27 Ekim', ad: 'Kâğıt' },
  { kod: 'modern', tarih: '2026-10-31', gun: '31 Ekim', ad: 'Modern' },
];

const GUNES = '<svg class="ikon-gunes" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const AY = '<svg class="ikon-ay" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';

export const gorunumSecici = () => `<div class="gorunum-sec" role="group" aria-label="Görünüm">
      <span class="gs-baslik" aria-hidden="true">görünüm</span>
      <ol class="gs-akis">
${GORUNUMLER.map((g) => `        <li><button type="button" data-gorunum-sec="${g.kod}"><span class="gs-onizleme" aria-hidden="true"></span><span class="gs-yazi"><time datetime="${g.tarih}">${g.gun}</time><b>${g.ad}</b></span></button></li>`).join('\n')}
      </ol>
      <button type="button" class="tema-dugme" data-tema-dugme aria-label="Koyu tema"><span class="tema-ray" aria-hidden="true">${GUNES}${AY}</span></button>
    </div>`;
