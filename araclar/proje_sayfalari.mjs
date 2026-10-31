// Proje detay sayfaları: araclar/sayfa_yap.mjs gibi üretilir (npm run sayfalar). Hikâye metinleri aşağıda;
// kartlar ve sayaçlar js/projeler.js'ten gelir. Her bilgi README'den ya da commit geçmişinden.
import { mkdirSync, writeFileSync } from 'node:fs';
import { bas, menu, son } from './sayfa_yap.mjs';
import { disBaglantilar } from './dis-baglanti.mjs';
import { PROJELER, medyaHTML, sayacHTML, repoSayisi } from '../js/projeler.js';

const stories = {
  skytrack: {
    amac: 'Canlı uçuş verisini harita üzerinde anlaşılır bir deneyime dönüştürmek. Masaüstü uygulaması açık ADS-B verisiyle çalışır; tarayıcı demosu ise simüle edilmiş uçuşlar kullanır.',
    akis: ['ADS-B verisi', 'Uçuş işleme', 'Leaflet haritası', 'Electron arayüzü'],
    karar: 'Bir acil durum kodunu görür görmez bildirim göndermek yerine, kodun 45 saniye kesintisiz sürmesini bekleyen bir kural seçtim. Böylece kısa süreli kod geçişlerinin yanlış alarm üretmesini azaltmayı hedefledim.',
    hata: 'Fotoğraf görüntüleyicideki bir yorum satırı açılışı bozdu. Düzeltmenin yanına bütün betiklerin sözdizimini kontrol eden bir test eklendi. Sunumda bu örneğin commit mesajını ve zaman çizelgesini inceleyebilirsin.',
    ai: '27 Ekim 2026 tarihli sayımda 208 commit’in 191’inde Claude ortak yazar kaydı var. Bu, kod satırlarının yüzde 92’sinin AI tarafından yazıldığı anlamına gelmez; ortak yazarlık kaydı olan commit sayısını gösterir.',
    gelecek: 'Bir sonraki adım olarak önce veri akışını, hata durumlarını ve alarm davranışını küçük bir prototipte doğrulayıp dil ve masaüstü paketlerini bu temel üzerine eklemek değerlendirilebilir.',
  },
  'claude-done-pixel': {
    amac: 'Claude Code uzun bir görevi bitirdiğinde terminali tekrar tekrar kontrol etme ihtiyacını azaltmak. Ekranın köşesindeki kısa bir piksel animasyonu işin tamamlandığını gösterir.',
    akis: ['Claude Code', 'Stop hook', 'PowerShell', 'Piksel bildirimi'],
    karar: 'Bildirimin odağı çalmaması ve tıklamaları engellememesi önemliydi. Görünür bir işaret verirken kullanıcının o sırada yaptığı işi kesmemesini hedefledim.',
    hata: 'Burada SkyTrack’teki gibi belgelenmiş belirli bir hata öyküsü paylaşmıyorum. Tasarımda kontrol edilmesi gereken durumlar; ayarların korunması, art arda bildirimler ve pencerenin kullanıcı etkileşimine etkisi.',
    ai: 'Bu projede önemli olan olay ile görüntüyü ayırmak: Stop hook olayı tetikler, PowerShell animasyonu gösterir. AI ile geliştirme anlatımında da ortaya çıkan dosyalar kadar bu bağlantıyı açıklıyorum.',
    gelecek: 'Bir sonraki adım olarak önce basit bir bildirimle olayın doğru yakalandığını doğrulayıp karakter animasyonunu daha sonra eklemek değerlendirilebilir.',
  },
  'chatgpt-done-pixel': {
    amac: 'Codex bir turu tamamladığında, Windows masaüstünde saatin üzerinde kısa bir piksel animasyonuyla haber vermek. Proje Windows ve WSL kullanımını destekler.',
    akis: ['Codex', 'agent-turn-complete', 'Windows bildirimi', 'Piksel animasyonu'],
    karar: 'Bildirim için sohbet metnini kaydetmeye veya ağ isteği göndermeye gerek yok. Proje, tamamlanma olayına odaklanır.',
    hata: 'Bu sayfada doğrulanmamış bir hata hikâyesi üretmiyorum. Windows ve WSL arasındaki tetikleme yolu ile art arda tamamlanan görevlerin davranışı, proje incelenirken özellikle bakılabilecek noktalar.',
    ai: 'Claude sürümündeki temel fikir burada farklı bir tamamlanma olayına bağlanıyor. İki projeyi karşılaştırınca aynı arayüz fikrinin farklı ajanlarla nasıl çalıştırılabildiği görülebilir.',
    gelecek: 'Olay alma ve animasyon katmanlarını ayrı doğrulamak; farklı ortamları aynı küçük bildirim sözleşmesiyle birleştirmek değerlendirilebilir.',
  },
};

// Küçük çizgi ikonlar (24x24); özellik kartlarında kullanılır.
const IKON = {
  ucak: '<path d="M2 14l9-3 3-8 2 1-1 7 6 2-.5 2-7-1-4 5-2-.5 1.5-6z"/>',
  dalga: '<path d="M2 8q3-4 5 0t5 0 5 0 5 0M2 13q3-4 5 0t5 0 5 0 5 0M2 18q3-4 5 0t5 0 5 0 5 0"/>',
  can: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21a2 2 0 0 0 4 0"/>',
  gunes: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  kure: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3q-5 9 0 18M12 3q5 9 0 18"/>',
  cihaz: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
  kanca: '<path d="M10 3v9a4 4 0 1 0 8 0V9M14 9h8M6 3h8"/>',
  bayrak: '<path d="M6 21V3M6 4h12l-3 4 3 4H6"/>',
  pencere: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M7 6.5h.1M10 6.5h.1"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M7 10l3 2-3 2M12 15h5"/>',
  saat: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  kilit: '<rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};

// Sayfa başına: sayaçlar, özellik kartları, görsel bölümü
const EK = {
  skytrack: {
    kisa: 'Canlı uçak takibi',
    sayilar: [{ say: repoSayisi(PROJELER[0]).commit, etiket: 'commit' }, { say: repoSayisi(PROJELER[0]).claude, etiket: 'Claude ile ortak yazıldı' }, { say: 15, etiket: 'dil desteği' }, { say: 9, etiket: 'gün: ilk dosyadan v0.7.9\'a' }],
    ozellikler: [
      ['ucak', 'Canlı uçak takibi', 'Açık ADS-B verisiyle; hesap ya da API anahtarı istemez.'],
      ['dalga', 'Türbülans', 'Rota üzerindeki türbülansı gösterir.'],
      ['can', 'Uçuş uyarısı', 'İzlenen uçuş için uyarı verir.'],
      ['gunes', 'Koltuk önerisi', 'Güneşin hangi tarafta olduğuna göre koltuk önerir.'],
      ['kure', '15 dil', 'Tarayıcıda çalışan bir web demosu da var.'],
      ['cihaz', 'Her masaüstünde', 'Windows, macOS ve Linux; Electron ve Leaflet ile.'],
    ],
    gorselBaslik: 'Uygulamayı yakından',
    gorselNot: 'Aşağıdaki ekran görüntüsünde numaralı noktalar sırayla vurgulanır; birine tıklayınca durur.',
    pinler: [
      [0.893, 0.6, 'Uçuş kartı', 'Seçilen uçuşun yüksekliği, hızı, yakıt tahmini ve koltuk ipucu bir kartta.'],
      [0.57, 0.5, 'Uçuş rotası', 'Uçuşun nereden nereye gittiği haritada çizgi olarak görünür.'],
      [0.12, 0.52, 'Harita katmanları', 'Havalimanları, radar, türbülans, rüzgâr, bulut ve gece katmanları tek tıkla açılır.'],
      [0.58, 0.955, 'Canlı ve geçmiş', 'Zaman çubuğuyla canlı görüntü ile geçmiş arasında gezinilir.'],
    ],
  },
  'claude-done-pixel': {
    kisa: 'Piksel bildirim',
    sayilar: [{ say: 2, etiket: 'kez zıplar' }, { say: 2, etiket: 'kez bayrak sallar' }, { say: 8, etiket: 'animasyon karesi' }, { say: 4, etiket: 'adımlık akış' }],
    ozellikler: [
      ['kanca', 'Stop hook\'u ile çalışır', 'Claude Code işini bitirince tetiklenir.'],
      ['bayrak', 'Koşar, zıplar, bayrak sallar', 'Ekranın köşesinde turuncu piksel karakter, yeşil bayrak.'],
      ['pencere', 'Tıklamaları geçirir', 'Klavye odağını çalmaz; yazdığın şey yarıda kalmaz.'],
      ['terminal', 'PowerShell, ek paket yok', 'Windows\'ta ek bir şey kurmadan çalışır.'],
    ],
    gorselBaslik: 'Animasyonun kareleri',
    gorselNot: 'Gerçek proje görselindeki sekiz kare; vurgulanan kare animasyonun o anıdır.',
    hucre: [4, 2],
    sheet: 'img/claude-done.png', sheetAlt: 'claude-done-pixel animasyon kareleri: turuncu piksel karakterin koşup zıpladığı ve yeşil bayrak salladığı sekiz kare', sheetBoy: [1680, 456],
  },
  'chatgpt-done-pixel': {
    kisa: 'Piksel bildirim',
    sayilar: [{ say: 2, etiket: 'kez zıplar' }, { say: 2, etiket: 'yeşil bayrak sallar' }, { say: 6, etiket: 'animasyon karesi' }, { say: 4, etiket: 'adımlık akış' }],
    ozellikler: [
      ['kanca', 'agent-turn-complete', 'Codex bir turu bitirince gelen bildirimle çalışır.'],
      ['saat', 'Saatin üstünde', 'Piksel logo iki kez zıplar, iki yeşil bayrak sallar.'],
      ['kilit', 'Ağ isteği yapmaz', 'Sohbet metnini kaydetmez.'],
      ['cihaz', 'Windows ve WSL', 'İki ortamda da kullanılabilir.'],
    ],
    gorselBaslik: 'Animasyonun kareleri',
    gorselNot: 'Gerçek proje görselindeki altı kare: geliş, iki zıplama, iki bayrak, kutlama.',
    hucre: [6, 1],
    sheet: 'img/chatgpt-done.png', sheetAlt: 'chatgpt-done-pixel animasyon kareleri: geliş, iki zıplama, iki bayrak, kutlama', sheetBoy: [1920, 308],
  },
};

const NOTLAR = [['karar', 'Verdiğim karar', '01'], ['hata', 'Sorunlar ve kontroller', '02'], ['ai', 'AI\'ın rolü', '03'], ['gelecek', 'Bir sonraki geliştirme için', '04']];
const kacis = (s) => String(s).replace(/&(?!amp;)/g, '&amp;').replace(/</g, '&lt;');

for (const p of PROJELER) {
  const slug = p.ad.toLowerCase(), t = stories[slug], e = EK[slug], yol = `projeler/${slug}/`;
  const k = '../../';
  const baglantilar = [
    `<a class="dugme ana" href="${p.github}">Kaynak kod ↗</a>`,
    p.site ? `<a class="dugme" href="${p.site}">${p.ad} sitesi ↗</a>` : '',
    p.demo ? `<a class="dugme" href="${p.demo}">▶ Web demo</a>` : '',
    p.deste ? `<a class="dugme" href="${k}${p.deste}">Nasıl yaptım →</a>` : `<a class="dugme" href="${k}slaytlar/claude-code-hook/">İlgili sunum →</a>`,
  ].join('\n        ');

  // Görsel bölümü: SkyTrack'te numaralı vurgulu ekran görüntüsü, piksel projelerinde kare şeridi
  let gorsel;
  if (e.pinler) {
    gorsel = `<div class="p-sahne" data-pinler>
        <img src="${k}img/skytrack-1440.jpg" srcset="${k}img/skytrack-960.jpg 960w, ${k}img/skytrack-1440.jpg 1440w" sizes="(max-width: 900px) 100vw, 860px" alt="SkyTrack ekran görüntüsü: harita üzerinde canlı uçaklar, seçili uçuşun rotası ve uçuş kartı" width="1440" height="810" loading="lazy">
        ${e.pinler.map(([x, y, ad], i) => `<button type="button" class="pin" data-i="${i}" style="--x:${x};--y:${y}" aria-label="${i + 1}. ${ad}">${i + 1}<em>${ad}</em></button>`).join('\n        ')}
      </div>
      <ol class="pin-liste">
        ${e.pinler.map(([, , ad, metin], i) => `<li data-i="${i}"><b>${ad}</b><span>${metin}</span></li>`).join('\n        ')}
      </ol>`;
  } else {
    gorsel = `<div class="p-kareler" data-hucre="${e.hucre.join('x')}" style="--c:${e.hucre[0]};--r:${e.hucre[1]}">
        <img class="piksel" src="${k}${e.sheet}" alt="${e.sheetAlt}" width="${e.sheetBoy[0]}" height="${e.sheetBoy[1]}" loading="lazy">
        <i class="kare-vurgu" aria-hidden="true"></i>
      </div>`;
  }

  const govde = `${bas({ baslik: `${p.ad} · Samet Duhan`, aciklama: p.ozet, yol, onek: k, kapak: slug, ekCss: '\n  <link rel="stylesheet" href="../../css/vitrin.css">\n  <link rel="stylesheet" href="../../css/proje.css">' })}${menu('projeler', k, yol)}
  <main id="icerik" data-sayfalama="kaydir">
    <a class="geri-baglanti" href="../">← Tüm projeler</a>

    <section class="p-kahraman belir p-${p.pigment}">
      <div class="p-metin">
        <p class="v-komut">PROJE · ${e.kisa.toUpperCase()}</p>
        <h1>${p.ad}</h1>
        <p class="v-etiketler">${p.etiketler.map((x) => `<span>${x}</span>`).join('')}</p>
        <p class="p-ozet">${p.ozet}</p>
        <div class="linkler">
        ${baglantilar}
        </div>
      </div>
      <div class="v-medya" data-medya="${p.medya}">${medyaHTML(p, k)}</div>
    </section>

    <div class="sayaclar belir" aria-label="Rakamlarla ${p.ad}">${sayacHTML(e.sayilar)}</div>

    <section class="bolum belir p-${p.pigment}" aria-labelledby="neler">
      <h2 id="neler" class="bolum-baslik">Neler yapıyor?</h2>
      <p class="p-amac">${t.amac}</p>
      <ul class="ozellikler">
        ${e.ozellikler.map(([ikon, baslik, metin], i) => `<li style="--i:${i}"><svg viewBox="0 0 24 24" aria-hidden="true">${IKON[ikon]}</svg><b>${baslik}</b><span>${metin}</span></li>`).join('\n        ')}
      </ul>
    </section>

    <section class="bolum belir p-${p.pigment}" aria-labelledby="yakindan">
      <h2 id="yakindan" class="bolum-baslik">${e.gorselBaslik}</h2>
      <p class="p-not">${e.gorselNot}</p>
      ${gorsel}
    </section>

    <section class="bolum belir p-${p.pigment}" aria-labelledby="nasil">
      <h2 id="nasil" class="bolum-baslik">Nasıl çalışıyor?</h2>
      <ol class="akis-yol" aria-label="Veri ve olay akışı">
        ${t.akis.map((s, i) => `<li style="--i:${i}"><span class="a-no">0${i + 1}</span>${s}</li>`).join('\n        ')}
      </ol>
    </section>

    <section class="bolum" aria-labelledby="hikaye">
      <h2 id="hikaye" class="bolum-baslik">Geliştirme hikâyesi</h2>
      <div class="p-notlar">
        ${NOTLAR.map(([a, baslik, no]) => `<article class="p-nota belir p-${p.pigment}"><span class="nota-no">${no}</span><h3>${baslik}</h3><p>${t[a]}</p></article>`).join('\n        ')}
      </div>
    </section>

    <section class="bolum" aria-labelledby="kaynak">
      <h2 id="kaynak" class="bolum-baslik">Kaynaklar ve devamı</h2>
      <p class="p-not">Projenin güncel kurulum adımları, sürümleri ve değişiklikleri GitHub'da.</p>
      <div class="linkler">
        <a class="dugme ana" href="${p.github}#readme">README</a>
        <a class="dugme" href="${p.github}/commits">Değişiklik geçmişi</a>
        <a class="dugme" href="${p.github}/releases">Sürümler</a>${p.deste ? `\n        <a class="dugme" href="${k}${p.deste}?gorunum=oku">Geliştirme anlatımını oku →</a>` : ''}
        <a class="dugme" href="${k}iletisim/">Soru veya öneri gönder</a>
      </div>
    </section>

    <footer class="vitrin-son belir">
      <div class="v-medya" data-medya="video"><video class="v-kapanis" muted loop playsinline preload="metadata" poster="${k}img/sahin/video-poster.webp" aria-label="Kanatlarını açıp kapatan şahin çizimi (animasyon)"><source src="${k}video/sahin.mp4" type="video/mp4"></video></div>
      <p><strong>Diğer projelere de göz at.</strong> Hepsinin kodu açık.</p>
      <a class="dugme ana" href="../">tüm projeler →</a>
    </footer>
  </main>${son(k)}
  <script type="module">
    import { baslat } from '../../js/vitrin.js';
    import { projeBaslat } from '../../js/proje.js';
    baslat();
    projeBaslat();
  </script>
</body>
</html>
`;
  mkdirSync(yol, { recursive: true });
  writeFileSync(yol + 'index.html', disBaglantilar(govde));
}
