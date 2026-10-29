// Projeler sayfasının başlık bandı: tuğla fabrika (çalışan saat, iki baca dumanı) ve konveyör bant.
// Sandıklarda projeler akar. Animasyon stilleri css/site.css'te (.bant-cizim).
export const FABRIKA_SVG = `<svg viewBox="380 420 1060 480" preserveAspectRatio="xMaxYMax meet">
<defs>
      <pattern id="aTar" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="6" stroke="#33261a" stroke-width="1"/></pattern>
      <pattern id="aTar2" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="4" stroke="#33261a" stroke-width=".9"/></pattern>
    <filter id="bulut" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter><pattern id="tugla" width="18" height="9" patternUnits="userSpaceOnUse"><rect width="18" height="9" fill="#e4d3b4"/><path d="M0 .5H18M0 5H18M6 .5V5M15 5V9" stroke="#33261a" stroke-width=".8" opacity=".7"/></pattern></defs>
<!-- ===== A: FABRİKA ===== -->
    <g>
      <path d="M-1500 792H1440" stroke="#33261a" stroke-width="1.5"/>
      <path d="M-1500 800H1440M-1500 808H1440" stroke="#33261a" stroke-dasharray="2 8" opacity=".6"/>
      <!-- tuğla fabrika -->
      <g class="fabrika">
        <!-- arkadaki ince baca -->
        <path d="M1172 640V548h20v92" fill="url(#tugla)" stroke="#33261a" stroke-width="1.6"/><path d="M1168 548h28M1168 556h28" stroke="#33261a" stroke-width="2"/>
        <!-- ana bina: alınlıklı -->
        <path d="M880 792V646h320v146z" fill="url(#tugla)" stroke="#33261a" stroke-width="2"/>
        <path d="M870 646h340l-170-92z" fill="#e9dcc2" stroke="#33261a" stroke-width="2"/>
        <path d="M896 640h288l-144-78z" fill="url(#aTar2)" stroke="#33261a" stroke-width="1.2" opacity=".55"/>
        <path d="M866 646h348M870 652h340" stroke="#33261a" stroke-width="2"/>
        <circle cx="1040" cy="610" r="24" fill="#f2e8d5" stroke="#33261a" stroke-width="2"/><g transform="translate(1040 610)" stroke="#33261a" stroke-width="1.3"><path d="M0 -21V-16" transform="rotate(0)"/><path d="M0 -19V-16" transform="rotate(30)"/><path d="M0 -19V-16" transform="rotate(60)"/><path d="M0 -21V-16" transform="rotate(90)"/><path d="M0 -19V-16" transform="rotate(120)"/><path d="M0 -19V-16" transform="rotate(150)"/><path d="M0 -21V-16" transform="rotate(180)"/><path d="M0 -19V-16" transform="rotate(210)"/><path d="M0 -19V-16" transform="rotate(240)"/><path d="M0 -21V-16" transform="rotate(270)"/><path d="M0 -19V-16" transform="rotate(300)"/><path d="M0 -19V-16" transform="rotate(330)"/></g>
        <g transform="translate(1040 610)"><path d="M0 0V-10" stroke="#33261a" stroke-width="2.4"><animateTransform attributeName="transform" type="rotate" from="40" to="400" dur="120s" repeatCount="indefinite"/></path><path d="M0 0V-16" stroke="#33261a" stroke-width="1.5"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite"/></path></g>
        <circle cx="1040" cy="610" r="2.5" fill="#33261a"/>
        <rect x="992" y="660" width="96" height="18" fill="#f2e8d5" stroke="#33261a" stroke-width="1.4"/>
        <text x="1040" y="673" text-anchor="middle" class="bg-yazi" style="font-size:10px">ATÖLYE Nº 1</text>
        <path d="M898 762V706.0a16.0 16.0 0 0 1 32 0V762z" fill="#e9dcc2" stroke="#33261a" stroke-width="1.6"/><path d="M914.0 690V762M898 730h32M898 746h32" stroke="#33261a" stroke-width="1"/><path d="M894 762h40" stroke="#33261a" stroke-width="3"/><path d="M944 762V706.0a16.0 16.0 0 0 1 32 0V762z" fill="#e9dcc2" stroke="#33261a" stroke-width="1.6"/><path d="M960.0 690V762M944 730h32M944 746h32" stroke="#33261a" stroke-width="1"/><path d="M940 762h40" stroke="#33261a" stroke-width="3"/>
        <path d="M1104 762V706.0a16.0 16.0 0 0 1 32 0V762z" fill="#e9dcc2" stroke="#33261a" stroke-width="1.6"/><path d="M1120.0 690V762M1104 730h32M1104 746h32" stroke="#33261a" stroke-width="1"/><path d="M1100 762h40" stroke="#33261a" stroke-width="3"/><path d="M1150 762V706.0a16.0 16.0 0 0 1 32 0V762z" fill="#e9dcc2" stroke="#33261a" stroke-width="1.6"/><path d="M1166.0 690V762M1150 730h32M1150 746h32" stroke="#33261a" stroke-width="1"/><path d="M1146 762h40" stroke="#33261a" stroke-width="3"/>
        <path d="M1004 792V722a36 36 0 0 1 72 0V792z" fill="url(#aTar)" stroke="#33261a" stroke-width="2"/>
        <path d="M1040 686v36M1004 722h72" stroke="#33261a" stroke-width="1.2"/>
        <path d="M996 722a44 44 0 0 1 88 0" fill="none" stroke="#33261a" stroke-width="3"/>
        <path d="M880 700h320M880 784h320" stroke="#33261a" stroke-width="1.2" stroke-dasharray="1 3"/>
        <!-- yan kanat -->
        <path d="M1200 792V692h120v100z" fill="url(#tugla)" stroke="#33261a" stroke-width="2"/>
        <path d="M1196 692h128v-8h-128z" fill="#e9dcc2" stroke="#33261a" stroke-width="1.6"/>
        <path d="M1204 684v-6h8v6M1224 684v-6h8v6M1244 684v-6h8v6M1264 684v-6h8v6M1284 684v-6h8v6M1304 684v-6h8v6" fill="none" stroke="#33261a"/>
        <g fill="#e9dcc2" stroke="#33261a" stroke-width="1.4"><rect x="1214" y="710" width="26" height="34"/><rect x="1250" y="710" width="26" height="34"/><rect x="1286" y="710" width="26" height="34"/></g>
        <path d="M1227 710v34M1263 710v34M1299 710v34M1214 727h26M1250 727h26M1286 727h26" stroke="#33261a"/>
        <rect x="1236" y="752" width="48" height="40" fill="url(#aTar)" stroke="#33261a" stroke-width="1.6"/>
        <!-- büyük konik baca -->
        <path d="M1346 792l8-318h22l8 318z" fill="url(#tugla)" stroke="#33261a" stroke-width="2"/>
        <path d="M1348 700h34M1350 600h30M1352 520h26" stroke="#33261a" stroke-width="3"/>
        <path d="M1348 474h34v-10h-34z" fill="#e9dcc2" stroke="#33261a" stroke-width="2"/>
      </g>
      <g class="duman" fill="#76624c" filter="url(#bulut)">
        <circle cx="1365" cy="458" r="16"/><circle cx="1365" cy="458" r="16"/><circle cx="1365" cy="458" r="16"/><circle cx="1365" cy="458" r="16"/>
        <circle cx="1182" cy="540" r="9"/><circle cx="1182" cy="540" r="9"/><circle cx="1182" cy="540" r="9"/>
      </g>
      
<!-- konveyör bant -->
      <g stroke="#33261a">
        <rect x="-1500" y="850" width="2950" height="16" rx="8" fill="none" stroke-width="2"/>
        <path class="bant-serit" d="M-1500 850H1440M-1500 866H1440" stroke-width="2" stroke-dasharray="10 14"/>
        <g fill="#f2e8d5" stroke-width="1.5">
          <circle cx="-1340" cy="858" r="6"/><circle cx="-1140" cy="858" r="6"/><circle cx="-940" cy="858" r="6"/><circle cx="-740" cy="858" r="6"/><circle cx="-540" cy="858" r="6"/><circle cx="-340" cy="858" r="6"/><circle cx="-140" cy="858" r="6"/><circle cx="60" cy="858" r="6"/><circle cx="260" cy="858" r="6"/><circle cx="460" cy="858" r="6"/><circle cx="660" cy="858" r="6"/><circle cx="860" cy="858" r="6"/><circle cx="1060" cy="858" r="6"/><circle cx="1260" cy="858" r="6"/>
        </g>
        <path d="M-1180 866l-30 34M-780 866l-30 34M-380 866l-30 34M120 866l-30 34M1320 866l30 34M700 866v34" stroke-width="2"/>
      </g>
      <g class="sandiklar">
        <g class="sandik" style="--g:0s;--x:520px"><rect x="-70" y="-46" width="140" height="46" fill="#e9dcc2" stroke="#33261a" stroke-width="2"/><path d="M-70 -46l20 -14h140l-20 14M70 0l20 -14v-46l-20 14z" fill="#ddcdb0" stroke="#33261a" stroke-width="1.5"/><path d="M-70 -46l20 -14h140l-20 14M70 0l20 -14v-46l-20 14z" fill="url(#aTar2)" stroke="#33261a" stroke-width="1.5"/><text y="-17" text-anchor="middle" class="bg-yazi koyu">SKYTRACK</text></g>
        <g class="sandik" style="--g:-12.75s;--x:820px"><rect x="-60" y="-46" width="120" height="46" fill="#e9dcc2" stroke="#33261a" stroke-width="2"/><path d="M-60 -46l20 -14h120l-20 14M60 0l20 -14v-46l-20 14z" fill="#ddcdb0" stroke="#33261a" stroke-width="1.5"/><path d="M-60 -46l20 -14h120l-20 14M60 0l20 -14v-46l-20 14z" fill="url(#aTar2)" stroke="#33261a" stroke-width="1.5"/><text y="-17" text-anchor="middle" class="bg-yazi koyu">PİKSEL</text></g>
        <g class="sandik" style="--g:-25.5s;--x:1120px"><rect x="-55" y="-46" width="110" height="46" fill="#e9dcc2" stroke="#33261a" stroke-width="2"/><path d="M-55 -46l20 -14h110l-20 14M55 0l20 -14v-46l-20 14z" fill="#ddcdb0" stroke="#33261a" stroke-width="1.5"/><path d="M-55 -46l20 -14h110l-20 14M55 0l20 -14v-46l-20 14z" fill="url(#aTar2)" stroke="#33261a" stroke-width="1.5"/><text y="-17" text-anchor="middle" class="bg-yazi koyu">AJAN</text></g>
        <g class="sandik" style="--g:-38.25s;--x:1360px"><rect x="-58" y="-46" width="116" height="46" fill="#e9dcc2" stroke="#33261a" stroke-width="2"/><path d="M-58 -46l20 -14h116l-20 14M58 0l20 -14v-46l-20 14z" fill="#ddcdb0" stroke="#33261a" stroke-width="1.5"/><path d="M-58 -46l20 -14h116l-20 14M58 0l20 -14v-46l-20 14z" fill="url(#aTar2)" stroke="#33261a" stroke-width="1.5"/><text y="-17" text-anchor="middle" class="bg-yazi koyu">DESTE</text></g>
      </g>
      <text x="716" y="892" class="bg-yazi">ÜRETİM HATTI — FİKİR → KOD → ÇALIŞAN SİSTEM</text>
    </g>
</svg>`;
