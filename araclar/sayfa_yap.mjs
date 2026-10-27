// Alt sayfaları ortak iskeletle üretir (menü, ikon, paylaşım etiketleri, alt bilgi).
// Kullanım: npm run sayfalar        → sayfaları yazar
//           node araclar/sayfa_yap.mjs --kontrol → yazmadan karşılaştırır (testler kullanır)
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PROJELER, projeKartiHTML } from '../js/projeler.js';

const KOK = fileURLToPath(new URL('../', import.meta.url));
const KONTROL = process.argv.includes('--kontrol');
const farkli = [];
const URL_KOK = 'https://sametduhan.github.io/';
export const IKON = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23070b12'/%3E%3Cpath d='M8 10l6 6-6 6' stroke='%235ccfff' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Crect x='16' y='20' width='9' height='3' rx='1.5' fill='%235ccfff'/%3E%3C/svg%3E">`;

export const bas = ({ baslik, aciklama, yol, onek = '../', ekCss = '' }) => `<!doctype html>
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
  <meta property="og:image" content="${URL_KOK}img/skytrack-1440.jpg">
  <meta name="theme-color" content="#070b12">
  <meta name="twitter:card" content="summary_large_image">
  ${IKON}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap">
  <link rel="stylesheet" href="${onek}css/tema.css">
  <link rel="stylesheet" href="${onek}css/site.css">${ekCss}
</head>
<body>
  <a class="atla" href="#icerik">İçeriğe geç</a>`;

const BOLUMLER = [['hakkimda', 'hakkımda'], ['projeler', 'projeler'], ['slaytlar', 'slaytlar'], ['iletisim', 'iletişim']];
export const menu = (aktif, onek = '../') => `
  <nav class="ust-menu" aria-label="Site">
    <a class="logo" href="${onek}">~/samet</a>
    <div class="menu-linkler">
${BOLUMLER.map(([h, ad]) => `      <a href="${onek}${h}/"${h === aktif ? ' aria-current="page"' : ''}>${ad}</a>`).join('\n')}
    </div>
  </nav>`;

export const son = (onek = '../') => `
  <footer class="alt-bilgi">
    <span>samet duhan · 2026</span>
    <span><a href="https://github.com/SametDuhan">GitHub</a> · <a href="https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/">LinkedIn</a> · <a href="${onek}iletisim/">iletişim</a></span>
  </footer>`;

const yaz = (yol, html) => {
  if (!KONTROL) return writeFileSync(KOK + yol, html);
  if (readFileSync(KOK + yol, 'utf8') !== html) farkli.push(yol);
};

// --- Hakkımda
yaz('hakkimda/index.html', `${bas({ baslik: 'Hakkımda · Samet Duhan', aciklama: 'Samet Duhan: AI ile sistem kuran geliştirici, bilgisayar mühendisliği öğrencisi. Ne yaptığı, nasıl çalıştığı ve kullandığı araçlar.', yol: 'hakkimda/' })}${menu('hakkimda')}
  <main id="icerik">
    <p class="komut">~/samet $ <b>cat hakkimda.md</b></p>
    <h1>Hakkımda</h1>
    <p class="kimlik">&gt; AI ile sistem kuran geliştirici<span class="imlec" aria-hidden="true"></span></p>
    <p class="tanitim">
      Bilgisayar mühendisliği 3. sınıf öğrencisiyim. AI'ı sohbet etmek için değil, iş bitiren sistemler kurmak
      için kullanıyorum: kodu birlikte yazdığım ajanlar, kendi kendine haber veren araçlar, açık veriyle çalışan
      uygulamalar. Siber güvenlik de ilgi alanım.
    </p>
    <div class="linkler hizli">
      <a class="dugme" href="https://github.com/SametDuhan">GitHub</a>
      <a class="dugme" href="https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/">LinkedIn</a>
      <a class="dugme" href="../iletisim/">iletişim</a>
    </div>

    <section class="bolum" aria-labelledby="ne-baslik">
      <h2 id="ne-baslik" class="bolum-baslik">Ne yapıyorum</h2>
      <div class="uclu">
        <a class="kutu" href="../projeler/#skytrack">
          <span class="kutu-komut">./uygulamalar</span>
          <strong>Açık veriyle uygulamalar</strong>
          <span>SkyTrack: canlı uçak takibi, türbülans uyarısı, 15 dil. Windows, macOS ve Linux.</span>
        </a>
        <a class="kutu" href="../slaytlar/claude-code-hook/">
          <span class="kutu-komut">./otomasyon</span>
          <strong>AI ajanlarına araç ve otomasyon</strong>
          <span>Claude Code hook'u ve Codex bildirimiyle: ajan işini bitirince bilgisayar kendiliğinden haber verir.</span>
        </a>
        <a class="kutu" href="../slaytlar/">
          <span class="kutu-komut">./ogretmek</span>
          <strong>Öğretmek</strong>
          <span>AI'ı sıfırdan anlatan, projelerimden örnek veren interaktif sunumlar.</span>
        </a>
      </div>
    </section>

    <section class="bolum" aria-labelledby="nasil-baslik">
      <h2 id="nasil-baslik" class="bolum-baslik">Nasıl çalışıyorum</h2>
      <ol class="ilkeler">
        <li><strong>AI hızlandırır, kararı ben veririm.</strong> Neyin yanlış olduğunu fark etmek ve kuralı koymak insanın işi.</li>
        <li><strong>Test yazdırırım.</strong> AI'ın yaptığı bir hata bir kez düzelir; test sayesinde bir daha gelmez.</li>
        <li><strong>Kaynağa dayanırım.</strong> Bu sitedeki her sayı ve iddia bir README'ye ya da commit geçmişine dayanıyor.</li>
      </ol>
    </section>

    <section class="bolum" aria-labelledby="arac-baslik">
      <h2 id="arac-baslik" class="bolum-baslik">Araçlar</h2>
      <ul class="rozetler">
        <li>Claude Code</li><li>Codex</li><li>JavaScript</li><li>Node.js</li><li>Electron</li><li>Python</li>
        <li>PowerShell</li><li>Go</li><li>C</li><li>Bash</li><li>Git</li><li>GitHub Actions</li>
      </ul>
    </section>

    <section class="bolum cagri">
      <h2 class="bolum-baslik">Birlikte bir şey kuralım</h2>
      <p>İş teklifi, ortak proje ya da sadece bir soru: yaz, konuşalım.</p>
      <div class="linkler">
        <a class="dugme ana" href="../iletisim/">./iletisim →</a>
        <a class="dugme" href="../projeler/">projelere bak</a>
      </div>
    </section>
  </main>${son()}
</body>
</html>
`);

// --- Projeler
yaz('projeler/index.html', `${bas({ baslik: 'Projeler · Samet Duhan', aciklama: 'SkyTrack, claude-done-pixel ve chatgpt-done-pixel: Samet Duhan\'ın AI ile kurduğu projeler, demoları ve kodları.', yol: 'projeler/' })}${menu('projeler')}
  <main id="icerik">
    <p class="komut">~/samet $ <b>ls ./projeler</b></p>
    <h1>Projeler</h1>
    <p class="tanitim">Hepsi açık kaynak. Kodlarına GitHub'dan bakabilir, nasıl yapıldıklarını slaytlardan öğrenebilirsin.</p>
    <div class="filtre" role="group" aria-label="Projeleri süz">
      <button type="button" data-etiket="hepsi" aria-pressed="true">hepsi</button>
      <button type="button" data-etiket="AI aracı" aria-pressed="false">AI aracı</button>
      <button type="button" data-etiket="Uygulama" aria-pressed="false">uygulama</button>
      <span class="sayac-yazi" id="proje-sayac" aria-live="polite"></span>
    </div>
    <div class="projeler" id="projeler">
${PROJELER.map((p) => projeKartiHTML(p, '../')).join('\n')}
    </div>
    <p class="not">claude-done-pixel ve chatgpt-done-pixel resmî olmayan hayran projeleridir; Anthropic ve OpenAI ile bağlantısı yok.</p>
  </main>${son()}

  <script type="module">
    import { PROJELER, projeleriSuz } from '../js/projeler.js';
    const kartlar = [...document.querySelectorAll('#projeler .kart')];
    const sayac = document.getElementById('proje-sayac');
    const dugmeler = [...document.querySelectorAll('.filtre button')];
    // Filtre adreste durur: ?etiket=… ile paylaşılabilir.
    function suz(etiket, adresiGuncelle = true) {
      if (adresiGuncelle) {
        const u = new URL(location.href);
        if (etiket === 'hepsi') u.searchParams.delete('etiket'); else u.searchParams.set('etiket', etiket);
        history.replaceState(null, '', u);
      }
      const gorunur = new Set(projeleriSuz(PROJELER, etiket).map((p) => p.ad));
      kartlar.forEach((k) => { k.hidden = !gorunur.has(k.dataset.ad); });
      dugmeler.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.etiket === etiket)));
      sayac.textContent = \`\${gorunur.size} proje\`;
    }
    dugmeler.forEach((b) => b.addEventListener('click', () => suz(b.dataset.etiket)));
    const istenen = new URLSearchParams(location.search).get('etiket');
    // Kartta görünen her etiket adresle süzülebilir (ör. ?etiket=Codex); bilinmeyen etiket → hepsi.
    suz(PROJELER.some((p) => p.etiketler.includes(istenen)) ? istenen : 'hepsi', false);
  </script>
</body>
</html>
`);

// --- Slaytlar
yaz('slaytlar/index.html', `${bas({ baslik: 'Slaytlar · Samet Duhan', aciklama: 'AI\'ı sıfırdan öğreten, Samet Duhan\'ın projelerinden örnek veren interaktif sunumlar. Tarayıcıda açılır, kurulum istemez.', yol: 'slaytlar/' })}${menu('slaytlar')}
  <main id="icerik">
    <p class="komut">~/samet $ <b>ls ./slaytlar</b></p>
    <h1>Slaytlar</h1>
    <p class="tanitim">Merak ettiğin konuyu seç. Her sunum tarayıcıda açılır, kurulum istemez ve örneklerini benim projelerimden verir. AI'a yeni başlıyorsan <a href="./ai-ajani-nedir/">AI ajanı nedir?</a> ile başla.</p>
    <ol class="onerilen-sira" aria-label="Önerilen sıra">
      <li><a href="./ai-ajani-nedir/">AI ajanı nedir?</a></li>
      <li><a href="./claude-code-hook/">Claude Code hook'u ile otomasyon</a></li>
      <li><a href="./skytrack-nasil-kurdum/">SkyTrack'i AI ile nasıl kurdum</a></li>
    </ol>
    <p class="ipucu">→ ve ← ile gez · F tam ekran · telefonda kaydır · kaldığın yer bu tarayıcıda hatırlanır</p>
    <div class="filtre" role="search">
      <label class="arama"><span class="gizli">Sunumlarda ara</span><input type="search" id="ara" placeholder="ara: hook, ajan, SkyTrack…" autocomplete="off"></label>
      <div class="cipler" role="group" aria-label="Konu">
        <button type="button" data-etiket="hepsi" aria-pressed="true">hepsi</button>
        <button type="button" data-etiket="Başlangıç" aria-pressed="false">başlangıç</button>
        <button type="button" data-etiket="Claude Code" aria-pressed="false">Claude Code</button>
        <button type="button" data-etiket="Proje" aria-pressed="false">proje</button>
      </div>
      <span class="sayac-yazi" id="deste-sayac" aria-live="polite"></span>
    </div>
    <div class="desteler" id="desteler">
      <noscript>
        <a class="deste-karti" href="./ai-ajani-nedir/"><h2>AI ajanı nedir?</h2></a>
        <a class="deste-karti" href="./claude-code-hook/"><h2>Claude Code hook'u ile otomasyon</h2></a>
        <a class="deste-karti" href="./skytrack-nasil-kurdum/"><h2>SkyTrack'i AI ile nasıl kurdum</h2></a>
      </noscript>
    </div>
    <p class="bos" id="bos" hidden>Bu aramayla eşleşen sunum yok. <button type="button" class="dugme" id="temizle">aramayı temizle</button></p>
  </main>${son()}

  <script type="module">
    import { DESTELER, kartHTML, desteAra } from '../js/desteler.js';
    import { ilerlemeOku } from '../js/ilerleme.js';
    let depo = null;
    try { depo = localStorage; } catch {}
    const kutu = document.getElementById('desteler'), ara = document.getElementById('ara'), sayac = document.getElementById('deste-sayac'), bos = document.getElementById('bos');
    const cipler = [...document.querySelectorAll('.cipler button')];
    // Arama ve konu adreste durur: ?ara=…&konu=… ile paylaşılabilir.
    const sorgu = new URLSearchParams(location.search);
    let etiket = cipler.some((b) => b.dataset.etiket === sorgu.get('konu')) ? sorgu.get('konu') : 'hepsi';
    ara.value = sorgu.get('ara') || '';
    function adres() {
      const u = new URL(location.href);
      if (ara.value.trim()) u.searchParams.set('ara', ara.value.trim()); else u.searchParams.delete('ara');
      if (etiket !== 'hepsi') u.searchParams.set('konu', etiket); else u.searchParams.delete('konu');
      history.replaceState(null, '', u);
    }
    function goster() {
      const liste = desteAra(DESTELER, ara.value, etiket);
      kutu.innerHTML = liste.map((d) => kartHTML(d, ilerlemeOku(depo, d.slug))).join('');
      cipler.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.etiket === etiket)));
      sayac.textContent = \`\${liste.length} sunum\`;
      bos.hidden = liste.length > 0;
    }
    ara.addEventListener('input', () => { goster(); adres(); });
    cipler.forEach((b) => b.addEventListener('click', () => { etiket = b.dataset.etiket; goster(); adres(); }));
    document.getElementById('temizle').addEventListener('click', () => { ara.value = ''; etiket = 'hepsi'; goster(); adres(); ara.focus(); });
    goster();
  </script>
</body>
</html>
`);

// --- İletişim
yaz('iletisim/index.html', `${bas({ baslik: 'İletişim · Samet Duhan', aciklama: 'Samet Duhan ile iletişim: iş teklifi, ortak proje ya da soru için mail, GitHub ve LinkedIn.', yol: 'iletisim/' })}${menu('iletisim')}
  <main id="icerik">
    <p class="komut">~/samet $ <b>./iletisim</b></p>
    <h1>İletişim</h1>
    <p class="tanitim">En hızlı mail ile ulaşırsın. Ne için yazdığını seç; konu satırı hazır gelsin.</p>

    <div class="uclu" id="konular">
      <a class="kutu" data-konu="İş teklifi" href="#dogrudan-baslik">
        <span class="kutu-komut">./is-teklifi</span>
        <strong>İş teklifi</strong>
        <span>Staj, yarı zamanlı ya da proje bazlı iş.</span>
      </a>
      <a class="kutu" data-konu="Ortak proje" href="#dogrudan-baslik">
        <span class="kutu-komut">./ortak-proje</span>
        <strong>Ortak proje</strong>
        <span>Birlikte bir şey kurmak, katkı vermek ya da almak.</span>
      </a>
      <a class="kutu" data-konu="Soru" href="#dogrudan-baslik">
        <span class="kutu-komut">./soru</span>
        <strong>Soru ya da öneri</strong>
        <span>Slaytlar, projeler ya da AI hakkında.</span>
      </a>
    </div>

    <section class="bolum" aria-labelledby="dogrudan-baslik">
      <h2 id="dogrudan-baslik" class="bolum-baslik">Doğrudan</h2>
      <ul class="kanallar">
        <li>
          <span class="kanal-ad">mail</span>
          <a id="mail" data-k="16sametduhan16" data-a="gmail.com" hidden>mail</a>
          <noscript><span>16sametduhan16 [at] gmail [dot] com</span></noscript>
          <button type="button" class="dugme" id="kopyala" hidden>adresi kopyala</button>
        </li>
        <li><span class="kanal-ad">GitHub</span><a href="https://github.com/SametDuhan">github.com/SametDuhan</a><span class="kanal-not">kodlar ve projeler</span></li>
        <li><span class="kanal-ad">LinkedIn</span><a href="https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/">Samet Duhan Şahin</a><span class="kanal-not">iş ve kariyer</span></li>
      </ul>
    </section>
  </main>${son()}

  <script type="module">
    import { mailAdresi, mailtoLinki, bagla } from '../js/iletisim.js';
    const mail = document.getElementById('mail');
    const adres = mailAdresi(mail.dataset.k, mail.dataset.a);
    bagla(mail);
    mail.hidden = false;
    for (const k of document.querySelectorAll('[data-konu]')) k.href = mailtoLinki(adres, k.dataset.konu);
    const kopyala = document.getElementById('kopyala');
    kopyala.hidden = false;
    kopyala.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(adres); kopyala.textContent = 'kopyalandı ✓'; }
      catch { kopyala.textContent = 'seçip kopyala'; }
      setTimeout(() => { kopyala.textContent = 'adresi kopyala'; }, 2000);
    });
  </script>
</body>
</html>
`);

// --- 404
yaz('404.html', `${bas({ baslik: 'Sayfa bulunamadı · Samet Duhan', aciklama: 'Aradığın sayfa yok. Ana sayfaya, projelere ya da slaytlara dön.', yol: '404.html', onek: '/' })}${menu('', '/')}
  <main id="icerik">
    <p class="komut">~/samet $ <b>cd bu-sayfa</b></p>
    <h1>404</h1>
    <p class="kimlik">bash: cd: bu-sayfa: Böyle bir dosya ya da dizin yok<span class="imlec" aria-hidden="true"></span></p>
    <p class="tanitim">Aradığın sayfa taşınmış ya da hiç olmamış olabilir.</p>
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
