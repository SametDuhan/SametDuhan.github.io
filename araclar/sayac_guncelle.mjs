// Sayaçlardaki commit sayılarını GitHub'dan sayar ve js/sayilar.js'i yazar.
// GitHub Actions günde bir çalıştırır (.github/workflows/sayaclar.yml); elle de çalışır: node araclar/sayac_guncelle.mjs
// GH_TOKEN ya da GITHUB_TOKEN varsa kullanılır (saatlik sınır yükselir); yoksa anonim istek yeter (birkaç istek).
// Bir repo okunamazsa dosyaya dokunmadan hata ile çıkar: eski doğru sayılar yerinde kalır.
// tarih: iş akışı yalnız sayılar değişince commit'ler; sayfadaki tarih sayıların son değiştiği gündür.
import { writeFileSync } from 'node:fs';
import { env, argv } from 'node:process';
import { fileURLToPath } from 'node:url';
import { PROJELER } from '../js/projeler.js';

const KOK = fileURLToPath(new URL('../', import.meta.url));
const SAHIP = 'SametDuhan';
const CLAUDE = /Co-Authored-By:\s*Claude/i;

// js/projeler.js'teki GitHub adreslerinden repo adları (airock, claude-done-pixel, ...)
export const repolar = (projeler = PROJELER) => projeler.map((p) => new URL(p.github).pathname.split('/')[2]);

// Varsayılan daldaki commit mesajları: ortak yazarı Claude olanları ayrıca sayar.
export const say = (mesajlar) => ({ commit: mesajlar.length, claude: mesajlar.filter((m) => CLAUDE.test(m)).length });

async function mesajlariAl(repo) {
  const token = env.GH_TOKEN || env.GITHUB_TOKEN;
  const basliklar = { Accept: 'application/vnd.github+json', 'User-Agent': 'sametduhan-sayac', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const mesajlar = [];
  for (let sayfa = 1; sayfa < 50; sayfa++) {
    const yanit = await fetch(`https://api.github.com/repos/${SAHIP}/${repo}/commits?per_page=100&page=${sayfa}`, { headers: basliklar });
    if (!yanit.ok) throw new Error(`${repo}: GitHub ${yanit.status} ${yanit.statusText}`);
    const liste = await yanit.json();
    mesajlar.push(...liste.map((c) => c.commit.message));
    if (liste.length < 100) return mesajlar;
  }
  throw new Error(`${repo}: 5000'den fazla commit, sayfalama sınırı`);
}

export const dosyaMetni = (sayilar, tarih) => `// Bu dosyayı araclar/sayac_guncelle.mjs yazar (GitHub Actions, günde bir). Elle düzenleme.
// Varsayılan daldaki commit'ler; "claude": mesajında "Co-Authored-By: Claude" olanlar.
export const SAYILAR = ${JSON.stringify({ tarih, repolar: sayilar }, null, 2)};
`;

if (import.meta.url === `file://${argv[1]}`) {
  const sayilar = {};
  for (const repo of repolar()) sayilar[repo] = say(await mesajlariAl(repo));
  // SkyTrack vitrinindeki "büyük çoğunluğu Claude ile" cümlesi doğru kalmalı; değilse insan baksın.
  const sky = sayilar.airock;
  if (sky && sky.claude * 2 <= sky.commit) throw new Error(`airock: ${sky.claude}/${sky.commit}; "büyük çoğunluğu Claude ile" cümlesi artık doğru değil`);
  const tarih = new Date().toISOString().slice(0, 10);
  writeFileSync(KOK + 'js/sayilar.js', dosyaMetni(sayilar, tarih));
  console.log(tarih, JSON.stringify(sayilar));
}
