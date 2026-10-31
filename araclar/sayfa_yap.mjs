// Alt sayfaları ortak iskeletle üretir (menü, ikon, paylaşım etiketleri, alt bilgi).
// Kullanım: npm run sayfalar        → sayfaları yazar
//           node araclar/sayfa_yap.mjs --kontrol → yazmadan karşılaştırır (testler kullanır)
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PROJELER, projeVitrinHTML, sayacHTML, medyaHTML } from '../js/projeler.js';
import { FABRIKA_SVG } from './fabrika.mjs';
import { SAHNELER } from './sahneler.mjs';
import { dilSecici, dilEtiketleri } from './dil-baglanti.mjs';
import { disBaglantilar } from './dis-baglanti.mjs';

const KOK = fileURLToPath(new URL('../', import.meta.url));
const KONTROL = process.argv.includes('--kontrol');
const farkli = [];
const URL_KOK = 'https://sametduhan.github.io/';
export const IKON = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='3' fill='%23f2e8d5'/%3E%3Crect x='1.5' y='1.5' width='29' height='29' rx='2' fill='none' stroke='%2333261a' stroke-width='1.5'/%3E%3Ctext x='16' y='23' text-anchor='middle' font-family='Georgia,serif' font-weight='700' font-size='19' fill='%2333261a'%3E%C5%9E%3C/text%3E%3C/svg%3E">`;

export const bas = ({ baslik, aciklama, yol, onek = '../', ekCss = '', kapak = yol === '404.html' ? 'projeler' : yol.split('/')[0] || 'projeler' }) => `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${baslik}</title>
  <meta name="description" content="${aciklama}">
  <meta property="og:title" content="${baslik}">
  <meta property="og:description" content="${aciklama}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${URL_KOK}${yol}">
  <meta property="og:image" content="${URL_KOK}img/paylasim/${kapak}.png">
  <meta name="theme-color" content="#f2e8d5">
  <meta name="twitter:card" content="summary_large_image">
  ${yol === '404.html' ? '' : `${dilEtiketleri(yol)}\n  `}${IKON}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800;9..144,900&family=IBM+Plex+Mono:wght@400;600&family=Public+Sans:wght@400;600&display=swap">
  <link rel="stylesheet" href="${onek}css/tema.css">
  <link rel="stylesheet" href="${onek}css/site.css">${ekCss}
  <link rel="stylesheet" href="${onek}css/ekran.css">
</head>
<body>
  <a class="atla" href="#icerik">İçeriğe geç</a>`;

// Sol menü: ikonlu bağlantılar (üzerine gelince kısa açıklama açılır) + altta şahin, kısa tanım ve hızlı bağlantılar.
const BOLUMLER = [
  ['hakkimda', 'Hakkımda', 'ben kimim, ne yapıyorum', 'kehribar', '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 18c1-3 9-3 10 0"/>'],
  ['projeler', 'Projeler', 'canlı demolar, açık kaynak', 'civit', '<path d="M3 21V10l6-4v4l6-4v4l6-4v15zM8 21v-5h3v5"/>'],
  ['slaytlar', 'Slaytlar', 'AI\'ı sıfırdan öğren', 'bakir', '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8M7 9h6M7 12h9"/>'],
  ['iletisim', 'İletişim', 'iş, proje ya da soru', 'kiremit', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/>'],
];
export const menu = (aktif, onek = '../', yol = aktif ? `${aktif}/` : null) => `
  <nav class="yan-menu" aria-label="Site">
    <a class="logo" href="${onek}"><img src="${onek}img/sahin/logo.webp" alt="" width="40" height="40"><span><b>SAMET<br>DUHAN</b></span></a>
    <div class="menu-linkler">
${BOLUMLER.map(([h, ad, alt, pig, ikon], i) => `      <a class="p-${pig}" href="${onek}${h}/"${h === aktif ? ' aria-current="page"' : ''}><svg viewBox="0 0 24 24" aria-hidden="true">${ikon}</svg><span class="m-ad"><i>0${i + 1}</i>${ad}</span><small>${alt}</small></a>`).join('\n')}
    </div>
    ${yol ? dilSecici(yol, 'tr') : ''}
  </nav>`;

// Sayfa başı: numaralı etiket + damga, serif başlık, tanıtım ve sayfanın şahin pozu.
export const sayfaBasi = ({ no, etiket, damga, baslik, tanitim, poz, onek = '../', ek = '', alt = '', sinif = '', cizim = '', sahne = '' }) => `
    <header class="sayfa-basi${sinif ? ` ${sinif}` : ''}">${cizim ? `
      <div class="bant-cizim" aria-hidden="true">${cizim}</div>` : ''}
      ${sahne ? `<div class="sayfa-sahne" data-sahne="${sahne}">${SAHNELER[sahne](onek)}</div>` : `<img class="sayfa-sahin" src="${onek}img/sahin/${poz}.webp" alt="" width="240" height="240">`}
      <div class="sayfa-metin">
        <p class="etiket"><span class="no">${no}</span>${etiket}<span class="damga">${damga}</span></p>
        <h1>${baslik}</h1>${ek}
        <p class="tanitim">${tanitim}</p>${alt}
      </div>
    </header>`;

export const son = (onek = '../') => `
  <footer class="alt-bilgi">
    <span>samet duhan · 2026</span>
    <span><a href="https://github.com/SametDuhan">GitHub</a> · <a href="https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/">LinkedIn</a> · <a href="${onek}iletisim/">iletişim</a></span>
  </footer>
  <script type="module">
    import { baslatSayfa } from '${onek}js/ekrana-sigdir.js';
    baslatSayfa();
  </script>`;

const yaz = (yol, ham) => {
  const html = disBaglantilar(ham);
  if (!KONTROL) return writeFileSync(KOK + yol, html);
  if (readFileSync(KOK + yol, 'utf8') !== html) farkli.push(yol);
};

// --- Hakkımda
const ARAC_GRUPLARI = [
  ['AI ile çalışma', ['Claude Code', 'Codex']],
  ['Diller', ['JavaScript', 'Python', 'Go', 'C', 'Bash', 'PowerShell']],
  ['Altyapı', ['Node.js', 'Electron', 'Git', 'GitHub Actions']],
];
// Rota: tarihler GitHub'daki ilk commit / sürüm tarihlerinden (AI başlangıcı Samet'in kendi beyanı).
const ROTA = [
  { tarih: 'Eylül 2026', baslik: 'Python ve Go', metin: 'Ders depoları: btk-python-dersleri, go_daily_work.' },
  { tarih: '30 Eylül', baslik: 'SkyTrack başladı', metin: 'İlk commit; canlı uçak takibi fikri.', link: '../projeler/#skytrack' },
  { tarih: '2 Ekim', baslik: 'AI öğrenmeye başladım', metin: 'O günden beri projeler üretiyorum.', vurgu: true },
  { tarih: '8 Ekim', baslik: 'SkyTrack v0.7.9', metin: 'Aynı gün claude-done-pixel yayında.', link: '../projeler/#claude-done-pixel' },
  { tarih: '11 Ekim', baslik: 'chatgpt-done-pixel', metin: 'Aynı fikir Codex için.', link: '../projeler/#chatgpt-done-pixel' },
  { tarih: '27 Ekim', baslik: 'Bu site', metin: 'Açık repoda, testleriyle.', link: 'https://github.com/SametDuhan/SametDuhan.github.io' },
];
const ILKELER = [
  { baslik: 'AI hızlandırır, kararı ben veririm.', metin: 'Neyin yanlış olduğunu fark etmek ve kuralı koymak insanın işi.', cizim: '<svg class="ilke-cizim" viewBox="0 0 120 64" aria-hidden="true"><text x="2" y="19">AI</text><rect class="iz" x="26" y="11" width="92" height="9" rx="4.5"/><rect class="hizli" x="26" y="11" width="92" height="9" rx="4.5"/><text x="2" y="51">sen</text><rect class="iz" x="26" y="43" width="92" height="9" rx="4.5"/><g class="karar"><circle cx="106" cy="47.5" r="10"/><path d="M101 47.5l4 4 8-9"/></g></svg>' },
  { baslik: 'Test yazdırırım.', metin: 'AI\'ın yaptığı bir hata bir kez düzelir; test sayesinde bir daha gelmez.', cizim: '<svg class="ilke-cizim" viewBox="0 0 120 64" aria-hidden="true"><g class="hata"><circle cx="16" cy="32" r="10"/><path d="M11 27l10 10M21 27l-10 10"/></g><g class="testler"><circle cx="42" cy="32" r="7"/><circle cx="62" cy="32" r="7"/><circle cx="82" cy="32" r="7"/><circle cx="102" cy="32" r="7"/></g><g class="tikler"><path d="M38 32l3 3 5-6"/><path d="M58 32l3 3 5-6"/><path d="M78 32l3 3 5-6"/><path d="M98 32l3 3 5-6"/></g></svg>' },
  { baslik: 'Kaynağa dayanırım.', metin: 'Bu sitedeki her sayı ve iddia bir README\'ye ya da commit geçmişine dayanıyor.', cizim: '<svg class="ilke-cizim" viewBox="0 0 120 64" aria-hidden="true"><rect class="satir" x="4" y="10" width="86" height="6" rx="3"/><rect class="vurgu-seridi" x="4" y="26" width="64" height="9" rx="2"/><rect class="satir kalin" x="4" y="28" width="64" height="5" rx="2.5"/><rect class="satir" x="4" y="46" width="72" height="6" rx="3"/><g class="kaynak"><rect x="74" y="22" width="44" height="17" rx="3"/><text x="96" y="34" text-anchor="middle">README</text></g></svg>' },
];

yaz('hakkimda/index.html', `${bas({ baslik: 'Hakkımda · Samet Duhan', aciklama: 'Samet Duhan: AI ile sistem kuran geliştirici, bilgisayar mühendisliği öğrencisi. Ne yaptığı, nasıl çalıştığı ve kullandığı araçlar.', yol: 'hakkimda/', ekCss: '\n  <link rel="stylesheet" href="../css/vitrin.css">\n  <link rel="stylesheet" href="../css/hakkimda.css">' })}${menu('hakkimda')}
  <main id="icerik" data-sayfalama="kaydir">
${sayfaBasi({ no: '01', etiket: 'KİMLİK KARTI', damga: 'STAJA AÇIK', baslik: 'Hakkımda', poz: 'ceyrek', sahne: 'hakkimda',
      ek: '\n        <p class="kimlik">&gt; AI ile sistem kuran geliştirici</p>',
      tanitim: `Bilgisayar mühendisliği 3. sınıf öğrencisiyim. AI'ı sohbet etmek için değil, iş bitiren sistemler kurmak
      için kullanıyorum: kodu birlikte yazdığım ajanlar, kendi kendine haber veren araçlar, açık veriyle çalışan
      uygulamalar. Yapay zeka da ilgi alanım.`,
      alt: `
        <dl class="kimlik-bilgi">
          <div class="staj"><dt>Durum</dt><dd><strong>Staj arıyorum, hemen başlayabilirim.</strong> <a href="../iletisim/">staj için yaz →</a></dd></div>
          <div><dt>Çalışma</dt><dd>Uzaktan ya da yerinde</dd></div>
          <div><dt>Okuyor</dt><dd>Bilgisayar mühendisliği, 3. sınıf</dd></div>
          <div><dt>Diller</dt><dd>Türkçe (ana dil) · İngilizce (B1)</dd></div>
          <div><dt>Açık kaynak</dt><dd><a href="../projeler/#skytrack">SkyTrack</a> · <a href="../projeler/#claude-done-pixel">claude-done-pixel</a> · <a href="../projeler/#chatgpt-done-pixel">chatgpt-done-pixel</a></dd></div>
          <div><dt>Bağlantılar</dt><dd><a href="https://github.com/SametDuhan">GitHub</a> · <a href="https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/">LinkedIn</a> · <a href="../iletisim/">iletişim</a></dd></div>
        </dl>` })}

    <section class="bolum" aria-labelledby="ne-baslik">
      <h2 id="ne-baslik" class="bolum-baslik">Ne yapıyorum</h2>
      <div class="yap-kartlar">
        <article class="yap-kart belir p-kehribar">
          <div class="v-medya" data-medya="video">${medyaHTML(PROJELER[0], '../')}</div>
          <p class="v-komut">./uygulamalar</p>
          <h3><a href="../projeler/#skytrack">Açık veriyle uygulamalar</a></h3>
          <p>SkyTrack: canlı uçak takibi, türbülans uyarısı, 15 dil. Windows, macOS ve Linux.</p>
        </article>
        <article class="yap-kart belir p-civit">
          <div class="v-medya" data-medya="claude">${medyaHTML(PROJELER[1], '../')}</div>
          <p class="v-komut">./otomasyon</p>
          <h3><a href="../slaytlar/claude-code-hook/">AI ajanlarına araç ve otomasyon</a></h3>
          <p>Claude Code hook'u ve Codex bildirimiyle: ajan işini bitirince bilgisayar kendiliğinden haber verir.</p>
        </article>
        <article class="yap-kart belir p-bakir">
          <div class="v-pencere"><div class="v-bar"><i></i><i></i><i></i><span>canlı çizim · sunum</span></div><div class="yap-sahne">${SAHNELER.slaytlar('../')}</div></div>
          <p class="v-komut">./ogretmek</p>
          <h3><a href="../slaytlar/">Öğretmek</a></h3>
          <p>AI'ı sıfırdan anlatan, projelerimden örnek veren interaktif sunumlar.</p>
        </article>
      </div>
    </section>

    <section class="bolum" aria-labelledby="rota-baslik">
      <h2 id="rota-baslik" class="bolum-baslik">Rota</h2>
      <ol class="rota belir">
${ROTA.map((d) => `        <li${d.vurgu ? ' class="vurgu"' : ''}><time>${d.tarih}</time><b>${d.link ? `<a href="${d.link}">${d.baslik}</a>` : d.baslik}</b><span>${d.metin}</span></li>`).join('\n')}
      </ol>
    </section>

    <section class="bolum" aria-labelledby="nasil-baslik">
      <h2 id="nasil-baslik" class="bolum-baslik">Nasıl çalışıyorum</h2>
      <ol class="ilkeler-kart">
${ILKELER.map((i, n) => `        <li class="ilke belir">${i.cizim}<span class="ilke-no">0${n + 1}</span><div><strong>${i.baslik}</strong><span>${i.metin}</span></div></li>`).join('\n')}
      </ol>
    </section>

    <section class="bolum" aria-labelledby="arac-baslik">
      <h2 id="arac-baslik" class="bolum-baslik">Araçlar</h2>
      <div class="alet-gruplari">
${ARAC_GRUPLARI.map(([grup, liste], g) => `        <div class="alet-grup"><h3>${grup}</h3><ul class="aletler belir">${liste.map((a, i) => `<li${a === 'Codex' ? '' : ' class="cc"'} style="--i:${i + g * 2}">${a}</li>`).join('')}</ul></div>`).join('\n')}
      </div>
    </section>
    <section class="bolum" aria-labelledby="yol-baslik">
      <h2 id="yol-baslik" class="bolum-baslik">Ne arıyorsun?</h2>
      <div class="yollar iki">
        <a class="yol belir y-kehribar" href="../projeler/"><span class="yol-ikon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg></span><b>Yaptıklarımı görmek</b><span>Projeler, canlı demolar ve kodlar</span><em aria-hidden="true">→</em></a>
        <a class="yol belir y-civit" href="../slaytlar/ai-ajani-nedir/"><span class="yol-ikon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 6l9-3 9 3-9 3z"/><path d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4"/></svg></span><b>AI'ı öğrenmek</b><span>Sıfırdan anlatan, etkileşimli sunumlar</span><em aria-hidden="true">→</em></a>
      </div>
    </section>


    <footer class="vitrin-son belir">
      <div class="v-medya" data-medya="video"><video class="v-kapanis" muted loop playsinline preload="metadata" poster="../img/sahin/video-poster.webp" aria-label="Kanatlarını açıp kapatan şahin çizimi (animasyon)"><source src="../video/sahin.mp4" type="video/mp4"></video></div>
      <p><strong>Staj arıyorum.</strong> Bir yer, bir proje ya da sadece bir soru: yaz, konuşalım.</p>
      <a class="dugme ana" href="../iletisim/">iletişime geç →</a>
    </footer>
  </main>${son()}
  <script type="module">
    import { baslat } from '../js/vitrin.js';
    baslat();
  </script>
</body>
</html>
`);

// --- Projeler
yaz('projeler/index.html', `${bas({ baslik: 'Projeler · Samet Duhan', aciklama: 'SkyTrack, claude-done-pixel ve chatgpt-done-pixel: Samet Duhan\'ın AI ile kurduğu projeler, demoları ve kodları.', yol: 'projeler/', ekCss: '\n  <link rel="stylesheet" href="../css/vitrin.css">' })}${menu('projeler')}
  <main id="icerik" data-sayfalama="kendi">
${sayfaBasi({ no: '02', etiket: 'ÜRETİM HATTI', damga: 'HEPSİ AÇIK KAYNAK', baslik: 'Projeler', poz: 'calisan', sahne: 'projeler', sinif: 'bant', cizim: FABRIKA_SVG,
      tanitim: 'Hepsinin kodu GitHub\'da, nasıl yapıldığı slaytlarda.' })}
    <div class="sayaclar" aria-label="Rakamlarla">${sayacHTML()}</div>
    <div class="gorunum" role="group" aria-label="Proje görünümü">
      <button type="button" class="gorunum-dugme" data-gorunum="buyuk" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="6" rx="1"/><rect x="3" y="13" width="18" height="6" rx="1"/></svg>Büyük</button>
      <button type="button" class="gorunum-dugme" data-gorunum="kucuk" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="5" height="7" rx="1"/><rect x="9.5" y="4" width="5" height="7" rx="1"/><rect x="16" y="4" width="5" height="7" rx="1"/><rect x="3" y="13" width="5" height="7" rx="1"/><rect x="9.5" y="13" width="5" height="7" rx="1"/></svg>Küçük</button>
    </div>
    <div class="vitrinler" id="projeler">
${PROJELER.map((p) => projeVitrinHTML(p, '../')).join('\n')}
    </div>
    <footer class="vitrin-son belir">
      <div class="v-medya" data-medya="video"><video class="v-kapanis" muted loop playsinline preload="metadata" poster="../img/sahin/video-poster.webp" aria-label="Kanatlarını açıp kapatan şahin çizimi (animasyon)"><source src="../video/sahin.mp4" type="video/mp4"></video></div>
      <p><strong>Daha fazlası GitHub'da.</strong> Yeni projeler önce orada görünür.</p>
      <a class="dugme ana" href="https://github.com/SametDuhan">github.com/SametDuhan ↗</a>
    </footer>
    <p class="not">claude-done-pixel ve chatgpt-done-pixel resmî olmayan hayran projeleridir; Anthropic ve OpenAI ile bağlantısı yok.</p>
  </main>${son()}
  <script type="module">
    import { baslat } from '../js/vitrin.js';
    baslat();
  </script>
</body>
</html>
`);

// --- Slaytlar
yaz('slaytlar/index.html', `${bas({ baslik: 'Slaytlar · Samet Duhan', aciklama: 'AI\'ı sıfırdan öğreten, Samet Duhan\'ın projelerinden örnek veren interaktif sunumlar. Tarayıcıda açılır, kurulum istemez.', yol: 'slaytlar/', ekCss: '\n  <link rel="stylesheet" href="../css/atolye.css">' })}${menu('slaytlar')}
  <main id="icerik" data-sayfalama="kendi">
${sayfaBasi({ no: '03', etiket: 'DERS NOTLARI', damga: 'KURULUM YOK', baslik: 'Slaytlar', poz: 'ogretmen', sahne: 'slaytlar',
      tanitim: 'Merak ettiğin konuyu seç. Her sunum tarayıcıda açılır, kurulum istemez ve örneklerini benim projelerimden verir. AI\'a yeni başlıyorsan <a href="./ai-ajani-nedir/">AI ajanı nedir?</a> ile başla.' })}
    <p class="ipucu">→ ve ← ile gez · F tam ekran · telefonda kaydır · kaldığın yer bu tarayıcıda hatırlanır</p>
    <div class="desteler" id="desteler">
      <noscript>
        <a class="deste-karti" href="./ai-ajani-nedir/"><h2>AI ajanı nedir?</h2></a>
        <a class="deste-karti" href="./claude-code-hook/"><h2>Claude Code hook'u ile otomasyon</h2></a>
        <a class="deste-karti" href="./skytrack-nasil-kurdum/"><h2>SkyTrack'i AI ile nasıl kurdum</h2></a>
      </noscript>
    </div>
  </main>${son()}

  <script type="module">
    import { DESTELER, kartHTML, kartHareketi } from '../js/desteler.js';
    import { ilerlemeOku } from '../js/ilerleme.js';
    let depo = null;
    try { depo = localStorage; } catch {}
    // Tüm sunumlar tek listede; kaldığın yer rozetiyle gelir.
    const kutu = document.getElementById('desteler');
    kutu.innerHTML = DESTELER.map((d) => kartHTML(d, ilerlemeOku(depo, d.slug))).join('');
    kartHareketi(kutu);
  </script>
</body>
</html>
`);

// --- İletişim
yaz('iletisim/index.html', `${bas({ baslik: 'İletişim · Samet Duhan', aciklama: 'Samet Duhan ile iletişim: iş teklifi, ortak proje ya da soru için mail, GitHub ve LinkedIn.', yol: 'iletisim/' })}${menu('iletisim')}
  <main id="icerik" data-sayfalama="kendi">
${sayfaBasi({ no: '04', etiket: 'POSTA', damga: 'MAİL · GITHUB · LINKEDIN', baslik: 'İletişim', poz: 'postaci', sahne: 'iletisim',
      tanitim: 'Konuyu seç, mesajını yaz, gönder. Mail uygulaman açılmazsa mesajın kendiliğinden kopyalanır.' })}

    <div class="iletisim-yerlesim">
      <section class="kanal-kart" aria-labelledby="dogrudan-baslik">
        <h2 id="dogrudan-baslik" class="bolum-baslik">Doğrudan</h2>
        <ul class="kanallar">
          <li class="kanal kanal-mail">
            <span class="kanal-ikon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/></svg></span>
            <div class="kanal-metin">
              <span class="kanal-ad">mail</span>
              <a id="mail" data-k="16sametduhan16" data-a="gmail.com" hidden>mail</a>
              <noscript><span class="kanal-adres">16sametduhan16 [at] gmail [dot] com</span></noscript>
            </div>
            <button type="button" class="dugme" id="kopyala" hidden>kopyala</button>
          </li>
          <li class="kanal kanal-github">
            <span class="kanal-ikon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14"/></svg></span>
            <div class="kanal-metin"><span class="kanal-ad">GitHub</span><a class="kanal-adres" href="https://github.com/SametDuhan">github.com/SametDuhan</a></div>
            <span class="kanal-git" aria-hidden="true">↗</span>
          </li>
          <li class="kanal kanal-linkedin">
            <span class="kanal-ikon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13c0-1.5 1-2.5 2.5-2.5S17 11.5 17 13v4"/></svg></span>
            <div class="kanal-metin"><span class="kanal-ad">LinkedIn</span><a class="kanal-adres" href="https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/">Samet Duhan Şahin</a></div>
            <span class="kanal-git" aria-hidden="true">↗</span>
          </li>
        </ul>
      </section>

      <section class="yaz-kart" aria-labelledby="yaz-baslik">
        <h2 id="yaz-baslik" class="bolum-baslik">Mesaj yaz</h2>
        <div class="konular" id="konular" role="group" aria-label="Konu">
          <a class="konu" data-konu="İş teklifi" href="#dogrudan-baslik">İş teklifi</a>
          <a class="konu" data-konu="Ortak proje" href="#dogrudan-baslik">Ortak proje</a>
          <a class="konu" data-konu="Soru ya da öneri" href="#dogrudan-baslik">Soru ya da öneri</a>
          <a class="konu" data-konu="Diğer" href="#dogrudan-baslik">Diğer</a>
        </div>
        <form class="yazi-formu" id="yazi-formu" hidden onsubmit="return false">
          <label class="gizli" for="mesaj">Mesajın</label>
          <textarea id="mesaj" rows="7"></textarea>
          <p class="kime"><span>Kime</span><output id="kime"></output></p>
          <div class="eylemler">
            <a class="dugme ana" id="mail-ac" href="#">Mail uygulamasında aç →</a>
            <a class="dugme" id="gmail-ac" href="#" target="_blank" rel="noopener noreferrer">Gmail'de aç ↗</a>
            <button type="button" class="dugme" id="metin-kopyala">Metni kopyala</button>
          </div>
          <p class="durum" id="durum" role="status" aria-live="polite"></p>
        </form>
      </section>
    </div>
  </main>${son()}

  <script type="module">
    import { baslat } from '../js/iletisim.js';
    baslat();
  </script>
</body>
</html>
`);

// --- 404
yaz('404.html', `${bas({ baslik: 'Sayfa bulunamadı · Samet Duhan', aciklama: 'Aradığın sayfa yok. Ana sayfaya, projelere ya da slaytlara dön.', yol: '404.html', onek: '/' })}${menu('', '/')}
  <main id="icerik">
${sayfaBasi({ no: '404', etiket: 'KAYIP SAYFA', damga: 'BULUNAMADI', baslik: '404', poz: 'arka', sahne: 'hata404', onek: '/',
      ek: '\n        <p class="kimlik">bash: cd: bu-sayfa: Böyle bir dosya ya da dizin yok</p>',
      tanitim: 'Aradığın sayfa taşınmış ya da hiç olmamış olabilir.' })}
    <div class="linkler"><a class="dugme ana" href="/">./ana-sayfa →</a><a class="dugme" href="/projeler/">projeler</a><a class="dugme" href="/slaytlar/">slaytlar</a></div>
  </main>${son('/')}
</body>
</html>
`);
if (KONTROL) {
  if (farkli.length) {
    console.error(`elle değişmiş ya da eski: ${farkli.join(', ')} — npm run sayfalar`);
    process.exit(1);
  }
  console.log('sayfalar güncel');
} else {
  console.log('sayfalar yazıldı');
}
