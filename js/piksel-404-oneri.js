// 404, piksel görünüm: "Bunu mu demek istedin?" önerileri. Yanlış adresi sitenin gerçek sayfalarıyla karşılaştırır (sitemap.xml'den; okunamazsa yedek liste).
// Saf işlevler (DOM yok): Node'da test edilir. Türkçe karakterler sadeleştirilir; harf hatası (Levenshtein), parça eşleşmesi ve içerme puanlanır.
import { PROJELER } from './projeler.js';
import { DESTELER } from './desteler.js';

// Sitedeki Türkçe sayfalar (sitemap.xml okunamazsa bu liste kullanılır; test sitemap ile aynı olduğunu denetler).
export const YEDEK_ROTALAR = ['/', '/hakkimda/', '/projeler/', '/slaytlar/', '/iletisim/', '/slaytlar/ai-ajani-nedir/', '/slaytlar/claude-code-hook/', '/slaytlar/skytrack-nasil-kurdum/', '/projeler/skytrack/', '/projeler/claude-done-pixel/', '/projeler/chatgpt-done-pixel/'];

const BASLIKLAR = { '/': 'Ana sayfa', '/hakkimda/': 'Hakkımda', '/projeler/': 'Projeler', '/slaytlar/': 'Slaytlar', '/iletisim/': 'İletişim' };
export function rotaBasligi(rota) {
  if (BASLIKLAR[rota]) return BASLIKLAR[rota];
  const slug = rota.split('/').filter(Boolean).at(-1) ?? '';
  const deste = DESTELER.find((d) => d.slug === slug); if (deste) return deste.baslik;
  const proje = PROJELER.find((p) => p.ad.toLowerCase() === slug); if (proje) return proje.ad;
  return slug.replace(/-/g, ' ');
}

export const sade = (s) => String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '');

export function mesafe(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
export function benzerlik(a, b) {
  a = sade(a); b = sade(b); if (!a || !b) return 0; if (a === b) return 1;
  let s = 1 - mesafe(a, b) / Math.max(a.length, b.length);
  if (a.length >= 3 && (b.includes(a) || a.includes(b))) s = Math.max(s, .75);
  return s;
}

// yol: istenen adres (ör. "/proje", "/skytrak/"); rotalar: gerçek sayfalar; en iyi n öneri [{ rota, puan }] (puan ≥ eşik), en iyiden başlayarak.
export function oneriler(yol, rotalar, n = 3, esik = .55) {
  let temiz; try { temiz = decodeURIComponent(yol); } catch { temiz = yol; }
  const parca = sade(temiz).replace(/\.(html?|php)$/, '').split(/[\/_\-\s.]+/).filter(Boolean);
  if (!parca.length) return [];
  const tam = parca.join('-');
  return rotalar.filter((r) => r !== '/').map((rota) => {
    const rp = sade(rota).split(/[\/-]+/).filter(Boolean), rt = rp.join('-');
    // istenen adresin her parçası rotanın en iyi parçasıyla eşleşir; puan bunların ortalaması (hepsi karşılanan rota öne geçer:
    // "/slaytlar/ai-ajani" için "/slaytlar/" değil "/slaytlar/ai-ajani-nedir/"), ya da tüm adresin bütün olarak benzerliği
    const ortalama = parca.reduce((t, p) => t + Math.max(...rp.map((q) => benzerlik(p, q))) * (p.length < 4 ? .6 : .9), 0) / parca.length;
    const puan = Math.max(benzerlik(tam, rt), ortalama);
    return { rota, puan };
  }).filter((x) => x.puan >= esik).sort((x, y) => y.puan - x.puan || x.rota.length - y.rota.length).slice(0, n);
}

// sitemap.xml'den Türkçe sayfaları okur (/en/ olmayanlar); olmazsa yedek liste.
export async function gercekRotalar(fetchFn = (typeof fetch === 'function' ? fetch : null)) {
  try {
    const yanit = await fetchFn('/sitemap.xml'); if (!yanit.ok) throw new Error(yanit.status);
    const xml = await yanit.text();
    const liste = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p) => !p.startsWith('/en/') && p !== '/en');
    return liste.length ? [...new Set(liste)] : YEDEK_ROTALAR;
  } catch { return YEDEK_ROTALAR; }
}
