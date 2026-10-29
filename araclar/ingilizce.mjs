// Türkçe sayfalardan İngilizce sürümü üretir (en/ altına). Metinler araclar/en-sozluk.mjs'teki sözlükten gelir;
// sözlükte olmayan bir metin bulunursa üretim durur ve eksikleri listeler (Türkçeye eklenen metin çevrilmeden yayına çıkmaz).
// Kullanım: node araclar/ingilizce.mjs            → en/ sayfalarını yazar
//           node araclar/ingilizce.mjs --kontrol  → yazmadan karşılaştırır (testler kullanır)
//           node araclar/ingilizce.mjs --rapor    → çevrilmemiş metinleri listeler
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { SOZLUK, AYNI, HTML_PARCALARI, JS_PARCALARI } from './en-sozluk.mjs';
import { dilSecici, enAdresi } from './dil-baglanti.mjs';

const KOK = fileURLToPath(new URL('../', import.meta.url));
const ARGS = process.argv.slice(2);

// Türkçe kaynak sayfalar: ana sayfa, bölüm sayfaları, proje sayfaları, sunumlar. (404 tek dilli kalır; GitHub Pages yalnızca kökteki 404.html'i sunar.)
export function kaynakSayfalar() {
  const alt = (dizin) => readdirSync(KOK + dizin, { withFileTypes: true }).filter((d) => d.isDirectory() && existsSync(`${KOK}${dizin}${d.name}/index.html`)).map((d) => `${dizin}${d.name}/index.html`);
  return ['index.html', 'hakkimda/index.html', 'projeler/index.html', 'slaytlar/index.html', 'iletisim/index.html', ...alt('projeler/'), ...alt('slaytlar/')];
}

const coz = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const kacis = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const kacisOz = (s) => kacis(s).replace(/"/g, '&quot;');
const anahtar = (s) => coz(s).replace(/\s+/g, ' ').trim();
const harfVar = (s) => /\p{L}{2}/u.test(s);
const AYNI_KUME = new Set(AYNI);

// Göreli varlık yollarına bir seviye ekler (en/ bir seviye derin): css/, js/, img/, video/ ile başlayanlar.
const VARLIK = /^((?:\.{1,2}\/)*)((?:css|js|img|video)\/)/;
const yolDuzelt = (u) => (VARLIK.test(u) ? `../${u}` : u);
const srcsetDuzelt = (v) => v.split(',').map((p) => { const t = p.trim().split(/\s+/); t[0] = yolDuzelt(t[0]); return t.join(' '); }).join(', ');
const betikDuzelt = (js) => JS_PARCALARI.reduce((g, [tr, en]) => g.split(tr).join(en), js).replace(/(['"`])((?:\.{1,2}\/)*(?:css|js|img|video)\/)/g, (m, q, u) => `${q}../${u}`);

export function cevir(html, yol, eksik = new Map()) {
  const not = (s, ne) => { if (!eksik.has(s)) eksik.set(s, new Set()); eksik.get(s).add(`${yol} (${ne})`); };
  const cevirMetin = (ham, ne) => {
    const k = anahtar(ham);
    if (!harfVar(k)) return null;
    if (Object.hasOwn(SOZLUK, k)) return SOZLUK[k];
    if (AYNI_KUME.has(k)) return null;
    not(k, ne);
    return null;
  };
  // 1) satır içi işaretli uzun parçalar (bağlantı, vurgu içeren cümleler): belirteçle sakla, sonda yerine koy
  const parcalar = [];
  let g = html.replace(/<!--dil-->[\s\S]*?<!--\/dil-->/, '\u0002DIL\u0002');
  for (const [tr, en] of HTML_PARCALARI) {
    // kaynakta satır sonu ve girinti farklı olabilir: boşluk dizileri \s+ ile eşlenir
    const desen = new RegExp(tr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g');
    g = g.replace(desen, () => `\u0001${parcalar.push(en) - 1}\u0001`);
  }
  // 2) belirteç, etiket, betik, stil ve yorumlara göre böl
  const bolek = g.split(/(<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/);
  const cikti = bolek.map((b, i) => {
    if (i % 2 === 0) {                                  // metin
      const m = b.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const parcasiz = m[2].replace(/\u0001\d+\u0001/g, '').replace(/\u0002DIL\u0002/g, '');
      if (!parcasiz.trim()) return b;
      if (/\u0001\d+\u0001|\u0002DIL\u0002/.test(m[2])) {                  // parça belirteciyle karışık metin: yalnız belirteç dışı kısımlar denetlenir
        m[2].split(/(\u0001\d+\u0001|\u0002DIL\u0002)/).forEach((p, j) => { if (j % 2 === 0 && harfVar(p)) cevirMetin(p, 'parça kenarı'); });
        return b;
      }
      const en = cevirMetin(m[2], 'metin');
      return en === null ? b : `${m[1]}${kacis(en)}${m[3]}`;
    }
    if (b.startsWith('<!--')) return b;
    if (/^<script\b/i.test(b)) return b.replace(/^(<script\b[^>]*>)([\s\S]*?)(<\/script>)$/i, (_, a, js, z) => `${a.replace(/\ssrc="([^"]*)"/, (mm, u) => ` src="${yolDuzelt(u)}"`)}${betikDuzelt(js)}${z}`);
    if (/^<style\b/i.test(b)) return b;
    // etiket: öznitelikler
    return b.replace(/\s([\w:-]+)="([^"]*)"/g, (tam, ad, deger) => {
      const kucuk = ad.toLowerCase();
      if (['href', 'src', 'poster', 'data-src'].includes(kucuk)) return ` ${ad}="${yolDuzelt(deger)}"`;
      if (kucuk === 'srcset') return ` ${ad}="${srcsetDuzelt(deger)}"`;
      if (['alt', 'title', 'aria-label', 'placeholder', 'data-son'].includes(kucuk) || (kucuk === 'content' && /(?:name="(?:description|twitter:(?:title|description))"|property="og:(?:title|description|site_name)")/.test(b))) {
        const en = cevirMetin(deger, `öznitelik ${ad}`);
        const [, bas, , son] = deger.match(/^(\s*)([\s\S]*?)(\s*)$/);
        return en === null ? tam : ` ${ad}="${bas}${kacisOz(en)}${son}"`;
      }
      if (kucuk === 'content' && /property="og:url"/.test(b)) return ` ${ad}="${enAdresi(yol === 'index.html' ? '' : yol.replace(/index\.html$/, ''))}"`;
      if (kucuk === 'lang' && deger === 'tr') return ' lang="en"';
      return tam;
    });
  }).join('');
  return cikti
    .replace(/\u0001(\d+)\u0001/g, (_, n) => parcalar[+n])
    .replace('\u0002DIL\u0002', dilSecici(yol === 'index.html' ? '' : yol.replace(/index\.html$/, ''), 'en'));
}

export function uret({ kontrol = false } = {}) {
  const eksik = new Map();
  const farkli = [];
  for (const yol of kaynakSayfalar()) {
    const en = cevir(readFileSync(KOK + yol, 'utf8'), yol, eksik);
    const hedef = `en/${yol}`;
    if (kontrol) { if (!existsSync(KOK + hedef) || readFileSync(KOK + hedef, 'utf8') !== en) farkli.push(hedef); continue; }
    if (eksik.size === 0) { mkdirSync(dirname(KOK + hedef), { recursive: true }); writeFileSync(KOK + hedef, en); }
  }
  return { eksik, farkli };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { eksik, farkli } = uret({ kontrol: ARGS.includes('--kontrol') });
  if (eksik.size) {
    console.error(`${eksik.size} metin çevrilmedi (araclar/en-sozluk.mjs):`);
    for (const [s, dosyalar] of eksik) console.error(`  ${JSON.stringify(s)}   ← ${[...dosyalar][0]}${dosyalar.size > 1 ? ` +${dosyalar.size - 1}` : ''}`);
    process.exit(1);
  }
  if (farkli.length) { console.error('en/ sayfaları güncel değil:', farkli.join(', ')); process.exit(1); }
  console.log(ARGS.includes('--kontrol') ? 'en/ sayfaları güncel' : 'en/ sayfaları yazıldı');
}
