// Projeler sayfasının verisi. Her bilgi ilgili reponun README'sinden ya da commit geçmişinden.
export const PROJELER = [
  {
    ad: 'SkyTrack',
    pigment: 'kehribar',
    komut: './skytrack',
    ozet: 'Açık ADS-B verisiyle canlı uçak takibi. Hesap ya da API anahtarı istemez; rota üzerindeki türbülansı gösterir, izlenen uçuş için uyarı verir, güneşin hangi tarafta olduğuna göre koltuk önerir.',
    gorsel: 'img/skytrack-960.jpg',
    srcset: 'img/skytrack-960.jpg 960w, img/skytrack-1440.jpg 1440w, img/skytrack.jpg 2880w',
    alt: 'SkyTrack: harita üzerinde canlı uçaklar, rüzgar okları ve seçili uçuşun rotası',
    piksel: false,
    medya: 'video',
    video: 'video/skytrack-demo.webm',
    etiketler: ['Uygulama', 'Açık veri'],
    bilgiler: [
      'Windows, macOS ve Linux; Electron ve Leaflet ile',
      '15 dil ve tarayıcıda çalışan bir web demosu',
      'Her push\'ta GitHub Actions ile testler',
      '208 commit\'in 191\'i Claude ile ortak yazıldı',
    ],
    site: 'https://sametduhan.github.io/airock/',
    github: 'https://github.com/SametDuhan/airock',
    demo: 'https://sametduhan.github.io/airock/app/',
    deste: 'slaytlar/skytrack-nasil-kurdum/',
  },
  {
    ad: 'claude-done-pixel',
    pigment: 'civit',
    komut: './claude-done-pixel',
    ozet: 'Claude Code işini bitirince ekranın köşesinde bir piksel karakter koşup zıplar ve yeşil bayrak sallar; terminali kontrol etmeye son.',
    gorsel: 'img/claude-done.png',
    alt: 'Turuncu piksel karakterin koşup zıpladığı ve yeşil bayrak salladığı kareler',
    piksel: true,
    medya: 'claude',
    etiketler: ['AI aracı', 'Claude Code'],
    bilgiler: [
      'Claude Code\'un Stop hook\'u ile çalışır',
      'Windows; PowerShell, ek paket gerektirmez',
      'Tıklamaları geçirir, klavye odağını çalmaz',
    ],
    github: 'https://github.com/SametDuhan/claude-done-pixel',
    deste: 'slaytlar/claude-code-hook/',
  },
  {
    ad: 'chatgpt-done-pixel',
    pigment: 'bakir',
    komut: './chatgpt-done-pixel',
    ozet: 'Aynı fikir Codex için: iş bitince piksel logo saatin üstünde iki kez zıplar, iki yeşil bayrak sallar.',
    gorsel: 'img/chatgpt-done.png',
    alt: 'Piksel logo kareleri: geliş, iki zıplama, iki bayrak, kutlama',
    piksel: true,
    medya: 'codex',
    etiketler: ['AI aracı', 'Codex'],
    bilgiler: [
      'Codex\'in agent-turn-complete bildirimiyle çalışır',
      'Windows ve WSL',
      'Ağ isteği yapmaz, sohbet metnini kaydetmez',
    ],
    github: 'https://github.com/SametDuhan/chatgpt-done-pixel',
  },
];

const kacis = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Sayfanın üstündeki sayaçlar: her sayı SkyTrack README'sinden ve commit geçmişinden (bkz. slaytlar/skytrack-nasil-kurdum).
export const SAYACLAR = [
  { say: PROJELER.length, etiket: 'açık kaynak proje' },
  { say: 208, etiket: 'commit, SkyTrack' },
  { say: 191, etiket: 'Claude ile ortak yazıldı' },
  { say: 15, etiket: 'dil desteği, SkyTrack' },
];

export const sayacHTML = (liste = SAYACLAR) => liste.map((c) => `<div class="sayac"><b data-say="${c.say}">${c.say}</b><span>${kacis(c.etiket)}</span></div>`).join('');

// Her proje büyük bir vitrin satırı: solda canlı medya (video ya da canlı piksel animasyonu), sağda yazı. Satırlar sırayla yer değiştirir.
const MEDYA_ETIKET = { video: 'canlı demo · sessiz ekran kaydı', claude: 'canlı önizleme · piksel animasyonu', codex: 'canlı önizleme · piksel animasyonu' };

export function medyaHTML(p, kok = '') {
  const cerceve = (ic) => `<div class="v-pencere"><div class="v-bar"><i></i><i></i><i></i><span>${kacis(MEDYA_ETIKET[p.medya] ?? p.ad)}</span></div>${ic}</div>`;
  if (p.medya === 'video') {
    return cerceve(`<video class="v-ekran" muted loop playsinline preload="metadata" poster="${kacis(kok + p.gorsel)}" aria-label="${kacis(p.alt)}"><source src="${kacis(kok + p.video)}" type="video/webm"></video>`);
  }
  return cerceve(`<canvas class="v-ekran v-piksel" width="640" height="400" role="img" aria-label="${kacis(p.alt)}"></canvas>`);
}

export function projeVitrinHTML(p, kok = '') {
  const ikincil = [
    p.demo ? `<a href="${kacis(p.demo)}">▶ web demo</a>` : '',
    p.deste ? `<a href="${kacis(kok + p.deste)}">nasıl yaptım →</a>` : '',
  ].filter(Boolean).join('');
  return `<article class="vitrin belir p-${kacis(p.pigment)}" id="${kacis(p.ad.toLowerCase())}" data-ad="${kacis(p.ad)}">
  <div class="v-medya" data-medya="${kacis(p.medya)}">${medyaHTML(p, kok)}</div>
  <div class="v-govde">
    <p class="v-komut">${kacis(p.komut)}</p>
    <h2>${kacis(p.ad)}</h2>
    <p class="v-etiketler">${p.etiketler.map((e) => `<span>${kacis(e)}</span>`).join('')}</p>
    <p class="v-ozet">${kacis(p.ozet)}</p>
    <ul class="v-bilgiler">${p.bilgiler.map((b) => `<li>${kacis(b)}</li>`).join('')}</ul>
    <div class="linkler">
      <a class="dugme ana" href="${kacis(kok + 'projeler/' + p.ad.toLowerCase() + '/')}">projeyi keşfet →</a>${p.site ? `
      <a class="dugme" href="${kacis(p.site)}">${kacis(p.ad)} sitesi ↗</a>` : ''}
      <a class="dugme" href="${kacis(p.github)}">GitHub ↗</a>
    </div>${ikincil ? `\n    <p class="v-ek">${ikincil}</p>` : ''}
  </div>
</article>`;
}
