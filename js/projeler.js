// Projeler sayfasının verisi. Her bilgi ilgili reponun README'sinden ya da commit geçmişinden.
export const PROJELER = [
  {
    ad: 'SkyTrack',
    komut: './skytrack',
    ozet: 'Açık ADS-B verisiyle canlı uçak takibi. Hesap ya da API anahtarı istemez; rota üzerindeki türbülansı gösterir, izlenen uçuş için uyarı verir, güneşin hangi tarafta olduğuna göre koltuk önerir.',
    gorsel: 'img/skytrack-960.jpg',
    srcset: 'img/skytrack-960.jpg 960w, img/skytrack-1440.jpg 1440w, img/skytrack.jpg 2880w',
    alt: 'SkyTrack: harita üzerinde canlı uçaklar, rüzgar okları ve seçili uçuşun rotası',
    piksel: false,
    etiketler: ['Uygulama', 'Açık veri'],
    bilgiler: [
      'Windows, macOS ve Linux; Electron ve Leaflet ile',
      '15 dil ve tarayıcıda çalışan bir web demosu',
      'Her push\'ta GitHub Actions ile testler',
      '208 commit\'in 191\'i Claude ile ortak yazıldı',
    ],
    github: 'https://github.com/SametDuhan/airock',
    demo: 'https://sametduhan.github.io/airock/app/',
    deste: 'slaytlar/skytrack-nasil-kurdum/',
  },
  {
    ad: 'claude-done-pixel',
    komut: './claude-done-pixel',
    ozet: 'Claude Code işini bitirince ekranın köşesinde bir piksel karakter koşup zıplar ve yeşil bayrak sallar; terminali kontrol etmeye son.',
    gorsel: 'img/claude-done.png',
    alt: 'Turuncu piksel karakterin koşup zıpladığı ve yeşil bayrak salladığı kareler',
    piksel: true,
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
    komut: './chatgpt-done-pixel',
    ozet: 'Aynı fikir Codex için: iş bitince piksel logo saatin üstünde iki kez zıplar, iki yeşil bayrak sallar.',
    gorsel: 'img/chatgpt-done.png',
    alt: 'Piksel logo kareleri: geliş, iki zıplama, iki bayrak, kutlama',
    piksel: true,
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

export function projeleriSuz(liste, etiket) {
  return etiket === 'hepsi' ? liste : liste.filter((p) => p.etiketler.includes(etiket));
}

export function projeKartiHTML(p, kok = '') {
  const linkler = [
    p.demo ? `<a class="dugme" href="${kacis(p.demo)}">▶ canlı demo</a>` : '',
    `<a class="dugme" href="${kacis(p.github)}">GitHub</a>`,
    p.deste ? `<a class="dugme" href="${kacis(kok + p.deste)}">nasıl yaptım →</a>` : '',
  ].join('');
  return `<article class="kart" id="${kacis(p.ad.toLowerCase())}" data-ad="${kacis(p.ad)}">
  <img${p.piksel ? ' class="piksel"' : ''} src="${kacis(kok + p.gorsel)}"${p.srcset ? ` srcset="${kacis(p.srcset.split(', ').map((g) => kok + g).join(', '))}" sizes="(max-width: 700px) 100vw, 340px"` : ''} alt="${kacis(p.alt)}" loading="lazy">
  <div class="kart-govde">
    <p class="kart-komut">${kacis(p.komut)}</p>
    <h2>${kacis(p.ad)}</h2>
    <p class="etiketler">${p.etiketler.map((e) => `<span>${kacis(e)}</span>`).join('')}</p>
    <p>${kacis(p.ozet)}</p>
    <ul class="bilgiler">${p.bilgiler.map((b) => `<li>${kacis(b)}</li>`).join('')}</ul>
    <div class="linkler">${linkler}</div>
  </div>
</article>`;
}
