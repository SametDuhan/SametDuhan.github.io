// Alt sayfaların başlığındaki şahin sahneleri (SVG iskeleti). Hareket css/site.css'te.
// Şahin çizimleri raster; kanat/uzuv oynamaz. Hareket eğilme, nefes ve sahne nesneleriyle verilir.

const TARAMA = (kimlik, aci = 40) => `<pattern id="${kimlik}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(${aci})"><line x1="0" y1="0" x2="0" y2="5" stroke="#33261a" stroke-width=".8"/></pattern>`;
// kablodan sarı elektrik geçer. Pozlar ve ölçüler js/sahne/iletisim.js'tedir (şahin 0.36 ölçekle, x+45 kaydırılmış).
// İletişim: şahin masasında, önünde döner kadranlı yeşil telefon. Tek hareket: telefon çalıyor (titreşim, css/site.css .cal).
export const iletisimSahnesi = (onek) => {
  const delik = Array.from({ length: 10 }, (_, i) => {
    const a = (45 + i * 27) * Math.PI / 180;   // kadran: 1 sağ üstte, 0 sağ altta; sağ altta durdurucu boşluk
    return `<circle cx="${(395 + 18.5 * Math.cos(a)).toFixed(1)}" cy="${(214 - 18.5 * Math.sin(a)).toFixed(1)}" r="4.1"/>`;
  }).join('');
  return `<svg viewBox="0 0 500 330" role="img" aria-label="Şahin masasında oturuyor; önündeki döner kadranlı telefon çalıyor" preserveAspectRatio="xMidYMax meet">
  <defs>
    ${TARAMA('iTar')}${TARAMA('iTar2', -35)}
    <clipPath id="iKirp"><rect x="-120" y="-60" width="740" height="386"/></clipPath>
  </defs>
  <path d="M0 328H500" stroke="#33261a" stroke-width="1.5"/>
  <g clip-path="url(#iKirp)"><g transform="translate(45 0) scale(.36)"><image href="${onek}img/sahin/on.webp" x="0" y="0" width="999" height="999"/></g></g>
  <!-- masa -->
  <g class="masa" stroke="#33261a" stroke-width="2">
    <path d="M30 232H470l22 18H8z" fill="#e2cfa6"/>
    <path d="M30 232H470l22 18H8z" fill="url(#iTar2)" opacity=".25" stroke="none"/>
    <path d="M8 250H492v78H8z" fill="#d3b987"/>
    <path d="M8 250H492v78H8z" fill="url(#iTar)" opacity=".22" stroke="none"/>
    <path d="M8 262H492" stroke-width="1.2" opacity=".6"/>
    <g fill="none" stroke-width="1.5"><rect x="30" y="272" width="196" height="46" rx="2"/><rect x="274" y="272" width="196" height="46" rx="2"/></g>
    <g fill="#c9893a" stroke-width="1.4"><circle cx="128" cy="295" r="5"/><circle cx="372" cy="295" r="5"/></g>
    <path d="M70 240h120M290 240h150" stroke-width="1" opacity=".35"/>
  </g>
  <!-- çalan işaretleri -->
  <g class="cal-isaret" fill="none" stroke="#33261a" stroke-width="2.2" stroke-linecap="round">
    <path d="M326 150q-9 12 0 24M316 143q-15 19 0 38M462 150q9 12 0 24M472 143q15 19 0 38"/>
  </g>
  <!-- döner kadranlı telefon (yeşil), ahize kancada, kablo solda -->
  <g class="cal" stroke="#33261a">
    <path d="M343 176C318 190 312 214 340 222" fill="none" stroke-width="4" stroke-linecap="round"/>
    <path d="M343 176C318 190 312 214 340 222" fill="none" stroke="#8c9669" stroke-width="1.7" stroke-linecap="round" stroke-dasharray="1.4 3.4"/>
    <path d="M338 244l4-58q1-13 14-13h78q13 0 14 13l4 58z" fill="#8c9669" stroke-width="2.2"/>
    <path d="M338 244l4-58q1-13 14-13h78q13 0 14 13l4 58z" fill="url(#iTar2)" opacity=".28" stroke="none"/>
    <path d="M378 173v-17h9v17M404 173v-17h9v17" fill="#8c9669" stroke-width="1.8"/>
    <circle cx="395" cy="214" r="30" fill="#a3ad7e" stroke-width="1.8"/>
    <circle cx="395" cy="214" r="26" fill="#f2e8d5" stroke-width="1.2"/>
    <g fill="#e9dcc2" stroke-width="1.2">
      ${delik}
      <circle cx="395" cy="214" r="9.5" fill="#f2e8d5"/>
      <path d="M395 214l9-5" stroke-width="1.6"/>
    </g>
    <path d="M413 226l7 4-4 5-6-5z" fill="#e9dcc2" stroke-width="1.4"/>
    <g class="cal-ahize" transform="translate(343 158)">
      <path d="M0 4Q0 -10 46 -10Q92 -10 92 4" fill="none" stroke-width="12" stroke-linecap="round"/>
      <path d="M0 4Q0 -10 46 -10Q92 -10 92 4" fill="none" stroke="#8c9669" stroke-width="8" stroke-linecap="round"/>
      <rect x="-14" y="-4" width="28" height="22" rx="7" fill="#8c9669" stroke-width="2"/>
      <rect x="78" y="-4" width="28" height="22" rx="7" fill="#8c9669" stroke-width="2"/>
      <rect x="-14" y="-4" width="28" height="22" rx="7" fill="url(#iTar)" opacity=".3" stroke="none"/>
      <rect x="78" y="-4" width="28" height="22" rx="7" fill="url(#iTar)" opacity=".3" stroke="none"/>
    </g>
  </g>
</svg>`;
};

// Ortak parçalar: yer çizgisi ve şahin (479 px'lik çizim 280 px'e küçülür, ayakları 312'ye oturur).
const YER = '<path d="M0 312H500" stroke="#33261a" stroke-width="1.5"/><path d="M0 319H500M0 326H500" stroke="#33261a" stroke-dasharray="2 8" opacity=".5"/>';
const SAHIN = (onek, poz, x) => `<image href="${onek}img/sahin/${poz}.webp" x="${x}" y="49" width="280" height="280"/>`;
const YAZI = (x, y, metin, boy = 9, ek = '') => `<text x="${x}" y="${y}" style="font:600 ${boy}px 'IBM Plex Mono',monospace;letter-spacing:.12em" fill="#33261a" ${ek}>${metin}</text>`;
const SVG = (etiket, icerik) => `<svg viewBox="0 0 500 330" role="img" aria-label="${etiket}" preserveAspectRatio="xMidYMax meet">
  <defs>${TARAMA('sTar')}${TARAMA('sTar2', -35)}</defs>
  ${YER}
${icerik}
</svg>`;

// Hakkımda: şahin kimlik kartına bakar; mühür kartı damgalar (css .muhur).
export const hakkimdaSahnesi = (onek) => SVG('Şahin bir kimlik kartına bakıyor; mühür kartı damgalıyor', `
  ${SAHIN(onek, 'ceyrek', 215)}
  <g stroke="#33261a" stroke-width="2.2" stroke-linecap="round"><path d="M118 244L70 312M118 244L166 312M118 244V312" fill="none"/></g>
  <g stroke="#33261a">
    <rect x="30" y="92" width="176" height="150" rx="3" fill="#f2e8d5" stroke-width="2.4"/>
    <rect x="30" y="92" width="176" height="20" fill="#33261a"/>
    <rect x="46" y="124" width="52" height="60" fill="#e9dcc2" stroke-width="1.6"/><rect x="46" y="124" width="52" height="60" fill="url(#sTar)" opacity=".3" stroke="none"/>
    <image href="${onek}img/sahin/logo.webp" x="51" y="134" width="42" height="42"/>
    <g stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M110 134H190M110 148H176M110 162H186M46 200H190M46 212H150"/></g>
    <g stroke-width="1.2" opacity=".6"><path d="M46 226V236M50 226V236M53 226V236M58 226V236M61 226V236M67 226V236M70 226V236M76 226V236M80 226V236"/></g>
  </g>
  ${YAZI(40, 106, 'KİMLİK KARTI', 8, 'fill="#f2e8d5"')}${YAZI(110, 128, 'SAMET DUHAN', 7)}
  <g class="muhur-iz" fill="none" stroke="#8e2f23"><circle cx="168" cy="204" r="22" stroke-width="2.4"/><circle cx="168" cy="204" r="16" stroke-width="1" stroke-dasharray="3 3"/><text x="168" y="209" text-anchor="middle" style="font:700 12px 'Fraunces',Georgia,serif" fill="#8e2f23" stroke="none">ŞHN</text></g>
  <g class="muhur"><rect x="146" y="214" width="44" height="9" rx="2" fill="#8e2f23" stroke="#33261a" stroke-width="2"/><rect x="161" y="190" width="14" height="24" fill="#a8432a" stroke="#33261a" stroke-width="2"/><ellipse cx="168" cy="184" rx="13" ry="9" fill="#5b3a21" stroke="#33261a" stroke-width="2"/></g>`);

// Projeler: şahin üretim listesine bakar; kutular tek tek işaretlenir (css .tik).
export const projelerSahnesi = (onek) => SVG('Şahin üretim listesine bakıyor; projeler tek tek işaretleniyor', `
  ${SAHIN(onek, 'sag', 0)}
  <g stroke="#33261a" stroke-width="2.2">
    <path d="M382 286h14v26h-14z" fill="#d3b987"/>
    <rect x="300" y="92" width="178" height="196" rx="4" fill="#d3b987"/><rect x="300" y="92" width="178" height="196" rx="4" fill="url(#sTar)" opacity=".2" stroke="none"/>
    <rect x="314" y="114" width="150" height="160" fill="#f2e8d5" stroke-width="1.6"/>
    <rect x="365" y="82" width="48" height="20" rx="3" fill="#c9893a"/>
  </g>
  ${YAZI(326, 134, 'ÜRETİM LİSTESİ', 9)}
  ${['SKYTRACK', 'PİKSEL', 'AJAN', 'DESTE'].map((ad, i) => {
    const y = 162 + i * 30;
    return `<rect x="326" y="${y - 12}" width="16" height="16" fill="none" stroke="#33261a" stroke-width="1.8"/>${YAZI(352, y, ad, 11)}<path class="tik tik${i + 1}" d="M329 ${y - 4}l5 6 10-13" fill="none" stroke="#3d6356" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="28"/>`;
  }).join('\n  ')}`);

// Slaytlar: şahin projeksiyon perdesine bakar; slaytlar çizilip değişir (css .slayt-a / .slayt-b).
export const slaytlarSahnesi = (onek) => SVG('Şahin bir sunum perdesine bakıyor; slaytlar çizilip değişiyor', `
  ${SAHIN(onek, 'sol', 215)}
  <g stroke="#33261a" stroke-width="2.4" stroke-linecap="round"><path d="M122 210V232M122 232L78 312M122 232L166 312M122 232V312" fill="none"/></g>
  <g stroke="#33261a"><rect x="24" y="68" width="196" height="136" rx="2" fill="#f7f0e0" stroke-width="2.6"/><path d="M24 68h196" stroke-width="5"/></g>
  <g class="slayt-a" fill="none" stroke-linecap="round">
    <path class="sl sl1" d="M42 92H150" stroke="#33261a" stroke-width="9" stroke-dasharray="108"/>
    <path class="sl sl2" d="M50 122H196" stroke="#76624c" stroke-width="5" stroke-dasharray="146"/>
    <path class="sl sl3" d="M50 144H176" stroke="#76624c" stroke-width="5" stroke-dasharray="126"/>
    <path class="sl sl4" d="M50 166H160" stroke="#76624c" stroke-width="5" stroke-dasharray="110"/>
    <circle cx="42" cy="122" r="2.6" fill="#d07a2a" stroke="none"/><circle cx="42" cy="144" r="2.6" fill="#d07a2a" stroke="none"/><circle cx="42" cy="166" r="2.6" fill="#d07a2a" stroke="none"/>
  </g>
  <g class="slayt-b" stroke="#33261a" stroke-width="1.6">
    <path d="M42 190V92M42 190H206" fill="none"/>
    <rect class="cubuk cb1" x="56" y="140" width="26" height="50" fill="#d07a2a"/><rect class="cubuk cb2" x="92" y="112" width="26" height="78" fill="#2f4a6b"/>
    <rect class="cubuk cb3" x="128" y="126" width="26" height="64" fill="#4f7d6e"/><rect class="cubuk cb4" x="164" y="100" width="26" height="90" fill="#a8432a"/>
  </g>`);

// 404: şahin sırtı dönük kayıp yolda; tabela sallanır, soru işaretleri yükselir (css .tabela, .soru).
export const hata404Sahnesi = (onek) => SVG('Şahin sırtı dönük duruyor; tabela sallanıyor, başının üstünde soru işaretleri yükseliyor', `
  ${SAHIN(onek, 'arka', 40)}
  <g stroke="#33261a" stroke-width="2.2"><rect x="410" y="104" width="12" height="208" fill="#d3b987"/><rect x="410" y="104" width="12" height="208" fill="url(#sTar)" opacity=".25" stroke="none"/></g>
  <g class="tabela tabela1" stroke="#33261a" stroke-width="2"><path d="M470 122H382l-18 16 18 16H470z" fill="#e9dcc2"/>${YAZI(398, 143, '404', 11)}</g>
  <g class="tabela tabela2" stroke="#33261a" stroke-width="2"><path d="M360 168H450l18 16-18 16H360z" fill="#e2cfa6"/>${YAZI(376, 189, '???', 11)}</g>
  ${[[166, 0], [200, 1], [234, 2]].map(([x, i]) => `<text class="soru soru${i + 1}" x="${x}" y="64" style="font:800 28px 'Fraunces',Georgia,serif" fill="#8e2f23">?</text>`).join('\n  ')}`);

export const SAHNELER = { iletisim: iletisimSahnesi, hakkimda: hakkimdaSahnesi, projeler: projelerSahnesi, slaytlar: slaytlarSahnesi, hata404: hata404Sahnesi };
