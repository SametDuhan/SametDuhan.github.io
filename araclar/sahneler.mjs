// Alt sayfaların başlığındaki şahin sahneleri (SVG iskeleti). Hareket css/site.css'te.
// Şahin çizimleri raster; kanat/uzuv oynamaz. Hareket eğilme, nefes ve sahne nesneleriyle verilir.

const TARAMA = (kimlik, aci = 40) => `<pattern id="${kimlik}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(${aci})"><line x1="0" y1="0" x2="0" y2="5" stroke="#33261a" stroke-width=".8"/></pattern>`;
// İletişim: şahin masasında, önünde döner kadranlı yeşil telefon. Tek hareket: telefon çalıyor (titreşim, css/site.css .cal).
export const iletisimSahnesi = (onek) => {
  // Kadran: 10 delik, her birinde rakam; 1 sağ üstte, 0 sağ altta, parmak durdurucusu için sağ altta boşluk.
  const delik = Array.from({ length: 10 }, (_, i) => {
    const a = (48 + i * 27) * Math.PI / 180, x = 400 + 21.5 * Math.cos(a), y = 213 - 21.5 * Math.sin(a);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#e9dcc2" stroke-width="1"/><text x="${x.toFixed(1)}" y="${(y + 2).toFixed(1)}" text-anchor="middle" style="font:600 5.6px 'IBM Plex Mono',monospace" fill="#33261a" stroke="none">${(i + 1) % 10}</text>`;
  }).join('');
  return `<svg viewBox="0 0 500 330" role="img" aria-label="Şahin masasında oturuyor; önündeki döner kadranlı telefon çalıyor" preserveAspectRatio="xMidYMax meet">
  <defs>
    ${TARAMA('iTar')}${TARAMA('iTar2', -35)}
    <linearGradient id="iZeytin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9b383"/><stop offset=".55" stop-color="#8c9669"/><stop offset="1" stop-color="#6f7a52"/></linearGradient>
    <linearGradient id="iZeytinK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#95a070"/><stop offset="1" stop-color="#6a754e"/></linearGradient>
    <clipPath id="iKirp"><rect x="-120" y="-60" width="740" height="386"/></clipPath>
  </defs>
  <path d="M0 328H500" stroke="#33261a" stroke-width="1.5"/>
  <g clip-path="url(#iKirp)"><g transform="translate(45 0) scale(.36)"><image href="${onek}img/sahin/postaci.webp" x="0" y="0" width="999" height="999"/></g></g>
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
    <path d="M320 154q-9 12 0 24M310 147q-15 19 0 38M480 154q9 12 0 24M490 147q15 19 0 38"/>
  </g>
  <!-- döner kadranlı telefon (zeytin yeşili): ışık-gölge, rakamlı kadran, sarmal kablo; ahize yatakta -->
  <ellipse cx="400" cy="247" rx="72" ry="5" fill="#33261a" opacity=".2"/>
  <g class="cal" stroke="#33261a">
    <path d="M356 177C316 184 302 216 334 230" fill="none" stroke-width="7.4" stroke-linecap="round"/>
    <path d="M356 177C316 184 302 216 334 230" fill="none" stroke="#8c9669" stroke-width="5.2" stroke-linecap="round"/>
    <path d="M356 177C316 184 302 216 334 230" fill="none" stroke-width="5.4" stroke-linecap="round" stroke-dasharray="1.1 3.7"/>
    <path d="M330 246Q327 238 331 228L343 192Q348 178 366 178H434Q452 178 457 192L469 228Q473 238 470 246Z" fill="url(#iZeytin)" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M428 178H434Q452 178 457 192L469 228Q473 238 470 246H416Z" fill="url(#iTar2)" opacity=".34" stroke="none"/>
    <path d="M346 193Q351 183 366 183H398" fill="none" stroke="#f2e8d5" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>
    <path d="M331 237H469" fill="none" stroke-width="1.3" opacity=".7"/>
    <rect x="341" y="244" width="16" height="4" rx="2" fill="#33261a" stroke="none"/><rect x="443" y="244" width="16" height="4" rx="2" fill="#33261a" stroke="none"/>
    <path d="M374 181V160Q374 155 379 155H383Q388 155 388 160V181ZM412 181V160Q412 155 417 155H421Q426 155 426 160V181Z" fill="url(#iZeytinK)" stroke-width="1.9" stroke-linejoin="round"/>
    <circle cx="400" cy="213" r="32.5" fill="#bdb69a" stroke-width="2"/>
    <circle cx="400" cy="213" r="29.5" fill="#f2e8d5" stroke-width="1.2"/>
    <g stroke="#33261a">${delik}</g>
    <circle cx="400" cy="213" r="11" fill="#f2e8d5" stroke-width="1.3"/>
    <text x="400" y="215.2" text-anchor="middle" style="font:700 5.6px 'Fraunces',Georgia,serif;letter-spacing:.06em" fill="#8e2f23" stroke="none">ŞHN</text>
    <path d="M421 229q9 3 9 11l-5 1q0-5-6-6z" fill="#d9ccae" stroke-width="1.4" stroke-linejoin="round"/>
    <g class="cal-ahize" transform="translate(354 158)">
      <path d="M0 6Q-2 -14 46 -14Q94 -14 92 6" fill="none" stroke-width="13.5" stroke-linecap="round"/>
      <path d="M0 6Q-2 -14 46 -14Q94 -14 92 6" fill="none" stroke="url(#iZeytinK)" stroke-width="9.6" stroke-linecap="round"/>
      <path d="M0 6Q-2 -14 46 -14Q94 -14 92 6" fill="none" stroke="url(#iTar2)" stroke-width="9.6" stroke-linecap="round" opacity=".3"/>
      <path d="M6 -6Q12 -12 46 -12Q76 -12 86 -6" fill="none" stroke="#f2e8d5" stroke-width="2" stroke-linecap="round" opacity=".6"/>
      <rect x="-15" y="-5" width="30" height="24" rx="8" fill="url(#iZeytin)" stroke-width="2"/>
      <rect x="77" y="-5" width="30" height="24" rx="8" fill="url(#iZeytin)" stroke-width="2"/>
      <ellipse cx="0" cy="17" rx="9" ry="2.6" fill="#33261a" opacity=".55" stroke="none"/>
      <g fill="#f2e8d5" stroke="none" opacity=".85"><circle cx="86" cy="15.5" r="1"/><circle cx="92" cy="16.5" r="1"/><circle cx="98" cy="15.5" r="1"/><circle cx="89" cy="11.5" r="1"/><circle cx="95" cy="11.5" r="1"/></g>
      <path d="M-9 -1Q-9 -3 -6 -3" fill="none" stroke="#f2e8d5" stroke-width="1.6" stroke-linecap="round" opacity=".6"/><path d="M83 -1Q83 -3 86 -3" fill="none" stroke="#f2e8d5" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>
    </g>
  </g>
</svg>`;
};

// Ortak parçalar: yer çizgisi ve şahin (479 px'lik çizim 280 px'e küçülür, ayakları 312'ye oturur).
const YER = '<path d="M0 312H500" stroke="#33261a" stroke-width="1.5"/><path d="M0 319H500M0 326H500" stroke="#33261a" stroke-dasharray="2 8" opacity=".5"/>';
const SAHIN = (onek, poz, x) => `<image href="${onek}img/sahin/${poz}.webp" x="${x}" y="49" width="280" height="280"/>`;
const YAZI = (x, y, metin, boy = 9, ek = '') => `<text x="${x}" y="${y}" style="font:600 ${boy}px 'IBM Plex Mono',monospace;letter-spacing:.12em"${/\bfill=/.test(ek) ? '' : ' fill="#33261a"'} ${ek}>${metin}</text>`;
const SVG = (etiket, icerik) => `<svg viewBox="0 0 500 330" role="img" aria-label="${etiket}" preserveAspectRatio="xMidYMax meet">
  <defs>${TARAMA('sTar')}${TARAMA('sTar2', -35)}</defs>
  ${YER}
${icerik}
</svg>`;

// Hakkımda: şahin sunum perdesine bakar; perdede dört kart sırayla döner (css .hk-k1…4, 28 sn):
// kimlik kartı mühürlenir, araçlar çantaya düşer, kilit açılıp kapanır, ajan döngüsü döner.
// Araç çantası: iki sıra çip (sıra, ad, genişlik, renk); sıralar çantanın içinde ortalanır, ikinci sıra öne biner.
const HK_CIP = [[0, 'Claude Code', 48, '#d07a2a'], [0, 'Codex', 32, '#4f7d6e'], [0, 'Node.js', 36, '#2f4a6b'], [1, 'Python', 36, '#a8432a'], [1, 'Go', 22, '#c9893a'], [1, 'Git', 26, '#5b3a21']];
const HK_CIP_SVG = (() => {
  const bosluk = 5, ic = [60, 184], y = [163, 175];
  const toplam = [0, 1].map((r) => HK_CIP.filter((c) => c[0] === r).reduce((t, c) => t + c[2], 0) + bosluk * (HK_CIP.filter((c) => c[0] === r).length - 1));
  const imlec = [ic[0] + (ic[1] - ic[0] - toplam[0]) / 2, ic[0] + (ic[1] - ic[0] - toplam[1]) / 2];
  return HK_CIP.map(([sira, ad, w, renk], i) => {
    const x = imlec[sira]; imlec[sira] += w + bosluk;
    return `<g class="hk-cip hk-cip${i + 1}"><rect x="${x}" y="${y[sira]}" width="${w}" height="10" rx="5" fill="${renk}" stroke="#33261a" stroke-width="1.3"/>${YAZI(x + w / 2, y[sira] + 7.2, ad, 5, 'fill="#f7f0e0" text-anchor="middle"')}</g>`;
  }).join('\n    ');
})();
const HK_BASLIK = (metin) => `<rect x="36" y="80" width="172" height="17" fill="#33261a"/>${YAZI(44, 92, metin, 8, 'fill="#f2e8d5"')}`;
export const hakkimdaSahnesi = (onek) => SVG('Şahin bir sunum perdesine bakıyor; perdede sırayla kimlik kartı mühürleniyor, araçlar çantaya doluyor, yapay zeka çipi onaylanıyor ve ajan döngüsü dönüyor', `
  <defs>
    <filter id="hkKaba" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.7"/></filter>
    <path id="hkHalka" d="M0 -17a17 17 0 1 1 -.1 0"/>
    <path id="hkYol" d="M122 120A40 40 0 1 1 121.9 120"/>
  </defs>
  ${SAHIN(onek, 'ceyrek', 215)}
  <g stroke="#33261a" stroke-width="2.4" stroke-linecap="round"><path d="M122 246L74 312M122 246L170 312M122 246V312" fill="none"/></g>
  <rect x="24" y="70" width="196" height="176" rx="3" fill="#f7f0e0" stroke="#33261a" stroke-width="2.6"/><path d="M24 70h196" stroke="#33261a" stroke-width="5"/>

  <!-- 1 · kimlik kartı + mühür -->
  <g class="hk hk-k1">
    ${HK_BASLIK('KİMLİK KARTI')}
    <rect x="46" y="106" width="46" height="54" fill="#e9dcc2" stroke="#33261a" stroke-width="1.6"/><rect x="46" y="106" width="46" height="54" fill="url(#sTar)" opacity=".3"/>
    <image href="${onek}img/sahin/logo.webp" x="50" y="114" width="38" height="38"/>
    ${YAZI(100, 116, 'SAMET DUHAN', 8.2)}${YAZI(100, 128, 'AI İLE SİSTEM', 6.4, 'fill="#76624c"')}${YAZI(100, 138, 'KURAN GELİŞTİRİCİ', 6.4, 'fill="#76624c"')}
    <g stroke="#cdb894" stroke-width="1.6" stroke-linecap="round"><path d="M100 148H160M100 156H146M46 176H194M46 186H170"/></g>
    <g stroke="#33261a" stroke-width="1.2" opacity=".65"><path d="M46 206V222M50 206V222M53 206V222M58 206V222M61 206V222M67 206V222M70 206V222M76 206V222M80 206V222M85 206V222M88 206V222"/></g>
    <g class="hk-iz" transform="translate(166 198) rotate(-14)" filter="url(#hkKaba)">
      <circle r="25" fill="none" stroke="#8e2f23" stroke-width="2.8"/><circle r="12.5" fill="none" stroke="#8e2f23" stroke-width="1.1"/>
      <text style="font:600 5.4px 'IBM Plex Mono',monospace;letter-spacing:.2px" fill="#8e2f23"><textPath href="#hkHalka" transform="scale(1.3)" startOffset="0" textLength="102" lengthAdjust="spacing">AÇIKTA KURULUR · MMXXVI ·</textPath></text>
      <text y="4.2" text-anchor="middle" style="font:800 10.5px 'Fraunces',Georgia,serif" fill="#8e2f23">ŞHN</text>
      <path d="M-8 9.5h16" stroke="#8e2f23" stroke-width="1"/><path d="M0 -21l1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="#8e2f23" transform="translate(0 40) scale(.8)"/>
      <g fill="#f7f0e0"><circle cx="-14" cy="-12" r="1.1"/><circle cx="9" cy="-19" r=".9"/><circle cx="17" cy="6" r="1.2"/><circle cx="-6" cy="19" r="1"/><circle cx="-19" cy="3" r=".8"/><circle cx="12" cy="15" r="1.1"/></g>
    </g>
    <g class="hk-damga" transform="translate(166 198)">
      <ellipse cx="0" cy="2" rx="26" ry="5" fill="#8e2f23" opacity=".3"/>
      <rect x="-27" y="-17" width="54" height="17" rx="4" fill="#5b3a21" stroke="#33261a" stroke-width="2"/><path d="M-24 -13H24" stroke="#c9893a" stroke-width="1.6" opacity=".8"/>
      <rect x="-24" y="-3" width="48" height="5" rx="2" fill="#8e2f23" stroke="#33261a" stroke-width="1.4"/>
      <path d="M-7 -17v-26h14v26" fill="#8a5a33" stroke="#33261a" stroke-width="2" stroke-linejoin="round"/><path d="M-3 -40v18" stroke="#c9893a" stroke-width="2" opacity=".7"/>
      <ellipse cx="0" cy="-46" rx="15" ry="9" fill="#5b3a21" stroke="#33261a" stroke-width="2"/><ellipse cx="-4" cy="-49" rx="6" ry="2.6" fill="#c9893a" opacity=".55"/>
    </g>
  </g>

  <!-- 2 · araç çantası: açık çantaya çipler düşer, ön duvarın arkasında kalır, kapak kapanır -->
  <g class="hk hk-k2">
    ${HK_BASLIK('ARAÇ ÇANTASI')}
    <g class="hk-lid-ac" stroke="#33261a" stroke-width="2"><rect x="52" y="128" width="140" height="32" rx="3" fill="#d3b987"/><rect x="52" y="128" width="140" height="32" rx="3" fill="url(#sTar2)" opacity=".28" stroke="none"/><path d="M60 136H184" stroke="#cdb894" stroke-width="1.4" fill="none"/></g>
    <g class="hk-canta" stroke="#33261a" stroke-width="2"><path d="M52 186L58 160H186L192 186Z" fill="#9c7a4e" stroke-linejoin="round"/><path d="M58 160H186" stroke="#33261a" stroke-width="2.4"/></g>
    ${HK_CIP_SVG}
    <g class="hk-canta" stroke="#33261a" stroke-width="2"><rect x="46" y="186" width="152" height="46" rx="3" fill="#d3b987"/><rect x="46" y="186" width="152" height="46" rx="3" fill="url(#sTar2)" opacity=".28" stroke="none"/><path d="M46 196H198" stroke-width="1.4" fill="none"/><rect x="113" y="190" width="20" height="10" rx="2" fill="#c9893a" stroke-width="1.4"/><rect x="119.5" y="193" width="7" height="4" rx="1" fill="#5b3a21" stroke="none"/>
      <g class="hk-lid-kapali"><path d="M50 187L58 158H186L194 187Z" fill="#d9bf8d" stroke-linejoin="round"/><path d="M50 187L58 158H186L194 187Z" fill="url(#sTar2)" opacity=".26" stroke="none"/><path d="M104 170Q104 150 122 150Q140 150 140 170" fill="none" stroke-width="3.4" stroke-linecap="round"/></g>
    </g>
  </g>

  <!-- 3 · yapay zeka: çip, veri akışı ve onay -->
  <g class="hk hk-k3">
    ${HK_BASLIK('YAPAY ZEKA')}
    <g stroke="#cdb894" stroke-width="1.2" stroke-linecap="round" font-family="'IBM Plex Mono',monospace" fill="#cdb894"><text x="42" y="116" style="font-size:6px" stroke="none">A3 F1 09 7C</text><text x="42" y="130" style="font-size:6px" stroke="none">1F 4B E2 00</text><text x="42" y="144" style="font-size:6px" stroke="none">C8 5D 3A 91</text><text x="164" y="204" style="font-size:6px" stroke="none">0x7E 22 B0</text><text x="164" y="218" style="font-size:6px" stroke="none">D4 18 6F A5</text></g>
    <g stroke="#33261a" stroke-width="2" stroke-linecap="round"><path d="M104 122v-8M114 122v-8M124 122v-8M134 122v-8M144 122v-8M104 170v8M114 170v8M124 170v8M134 170v8M144 170v8M92 134h-8M92 146h-8M92 158h-8M152 134h8M152 146h8M152 158h8" fill="none"/><rect x="92" y="122" width="60" height="48" rx="6" fill="#e9dcc2"/><rect x="99" y="129" width="46" height="34" rx="3" fill="none" stroke="#cdb894" stroke-width="1.4"/></g>
    ${YAZI(122, 153, 'AI', 17, 'text-anchor="middle" font-weight="800"')}
    <g class="hk-onay"><circle cx="158" cy="176" r="11" fill="#4f7d6e" stroke="#33261a" stroke-width="1.8"/><path d="M152.5 176l4 4 7-8" fill="none" stroke="#f2e8d5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>
    <rect class="hk-tara" x="38" y="104" width="168" height="5" fill="#d07a2a" opacity=".55"/>
    ${YAZI(122, 226, 'İLGİ ALANI ✓', 6.6, 'text-anchor="middle" fill="#76624c"')}
  </g>

  <!-- 4 · AI ile sistem: bak → karar → yap → kontrol -->
  <g class="hk hk-k4">
    ${HK_BASLIK('AI İLE SİSTEM')}
    <path class="hk-yol" d="M122 120A40 40 0 1 1 121.9 120" fill="none" stroke="#76624c" stroke-width="1.6" stroke-dasharray="4 5"/>
    <g stroke="#33261a" stroke-width="1.8"><circle class="hk-dugum hk-d1" cx="122" cy="120" r="8" fill="#f7f0e0"/><circle class="hk-dugum hk-d2" cx="162" cy="160" r="8" fill="#f7f0e0"/><circle class="hk-dugum hk-d3" cx="122" cy="200" r="8" fill="#f7f0e0"/><circle class="hk-dugum hk-d4" cx="82" cy="160" r="8" fill="#f7f0e0"/></g>
    ${YAZI(122, 108, 'bak', 6.6, 'text-anchor="middle"')}${YAZI(174, 163, 'karar', 6.6, 'text-anchor="start"')}${YAZI(122, 220, 'yap', 6.6, 'text-anchor="middle"')}${YAZI(70, 163, 'kontrol', 6.6, 'text-anchor="end"')}
    <circle r="5" fill="#d07a2a" stroke="#f7f0e0" stroke-width="1.4"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#hkYol"/></animateMotion></circle>
    ${YAZI(122, 160, 'AI', 14, 'text-anchor="middle" font-weight="800"')}
  </g>

  <g class="hk-nokta-sira" fill="#cdb894" stroke="#33261a" stroke-width="1"><circle cx="104" cy="238" r="2.6"/><circle cx="114" cy="238" r="2.6"/><circle cx="124" cy="238" r="2.6"/><circle cx="134" cy="238" r="2.6"/></g>
  <g class="hk-nokta-acik" fill="#d07a2a"><circle class="hk-n1" cx="104" cy="238" r="2.6"/><circle class="hk-n2" cx="114" cy="238" r="2.6"/><circle class="hk-n3" cx="124" cy="238" r="2.6"/><circle class="hk-n4" cx="134" cy="238" r="2.6"/></g>`);

// Projeler: şahin üretim listesine bakar; kutular tek tek işaretlenir (css .tik).
export const projelerSahnesi = (onek) => SVG('Şahin üretim listesine bakıyor; projeler tek tek işaretleniyor', `
  ${SAHIN(onek, 'calisan', 0)}
  <g stroke="#33261a" stroke-width="2.2">
    <path d="M382 286h14v26h-14z" fill="#d3b987"/>
    <rect x="300" y="92" width="178" height="196" rx="4" fill="#d3b987"/><rect x="300" y="92" width="178" height="196" rx="4" fill="url(#sTar)" opacity=".2" stroke="none"/>
    <rect x="314" y="114" width="150" height="160" fill="#f2e8d5" stroke-width="1.6"/>
    <rect x="365" y="82" width="48" height="20" rx="3" fill="#c9893a"/>
  </g>
  ${YAZI(326, 134, 'ÜRETİM LİSTESİ', 9)}
  ${['SKYTRACK', 'CLAUDE PİKSEL', 'CODEX PİKSEL', 'SIRADA…'].map((ad, i) => {
    const y = 162 + i * 30;
    return `<rect x="326" y="${y - 12}" width="16" height="16" fill="none" stroke="#33261a" stroke-width="1.8"/>${YAZI(352, y, ad, 11)}${i < 3 ? `<path class="tik tik${i + 1}" d="M329 ${y - 4}l5 6 10-13" fill="none" stroke="#3d6356" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="28"/>` : ''}`; // sonuncusu sıradaki iş: işaretsiz
  }).join('\n  ')}`);

// Slaytlar: şahin projeksiyon perdesine bakar; slaytlar çizilip değişir (css .slayt-a / .slayt-b).
export const slaytlarSahnesi = (onek) => SVG('Şahin bir sunum perdesine bakıyor; slaytlar çizilip değişiyor', `
  ${SAHIN(onek, 'ogretmen', 215)}
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
