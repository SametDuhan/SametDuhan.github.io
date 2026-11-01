import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const oku = (yol) => readFileSync(join(KOK, yol), 'utf8');

const parlaklik = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => { const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('piksel renkleri koyu zeminde en az 4,5:1', () => {
  const css = oku('css/piksel.css');
  const i = css.indexOf('html[data-gorunum="piksel"] {'); assert.ok(i >= 0);
  const blok = css.slice(i, css.indexOf('}', i));
  const t = Object.fromEntries([...blok.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, k, v]) => [k, v.toLowerCase()]));
  const dusuk = [];
  for (const yazi of ['yazi', 'soluk', 'vurgu-koyu', 'ceviz', 'civit', 'bakir-koyu', 'kiremit', 'iyi']) for (const zemin of ['zemin', 'panel', 'kart']) if (kontrast(t[yazi], t[zemin]) < 4.5) dusuk.push(`${yazi}/${zemin}`);
  if (kontrast('#1a1210', t.vurgu) < 4.5) dusuk.push('turuncu dolgu üstünde koyu yazı');
  assert.deepEqual(dusuk, []);
});

test('piksel ana sayfa bileşeni: index.html yalnız piksel seçiliyken yükler; gölge DOM, iki dil, hareketi azalt', () => {
  const ana = oku('index.html');
  assert.match(ana, /<piksel-ana><\/piksel-ana>/);
  assert.match(ana, /dataset\.gorunum === 'piksel'\) import\('\.\/js\/piksel-ana\.js'\)/);
  assert.ok(oku('en/index.html').includes('<piksel-ana></piksel-ana>'));
  const bilesen = oku('js/piksel-ana.js');
  assert.match(bilesen, /attachShadow\(\{ mode: 'open' \}\)/);
  assert.match(bilesen, /import \{ t, EN \} from '\.\/dil\.js'/);
  assert.match(bilesen, /Staj arıyorum, hemen başlayabilirim\./);
  for (const js of ['js/piksel-ana-kanvas.js', 'js/piksel-ana-konsol.js', 'js/piksel-gecis.js', 'js/piksel-sayfa.js']) assert.match(oku(js), /prefers-reduced-motion: reduce/, js);
  assert.ok(existsSync(join(KOK, 'css/piksel-ana.css')));
});

test('piksel ana sayfa: aynı anda en çok iki karakter; fare izi yok; konsol simülasyonu açıkça yazılı', () => {
  const kanvas = oku('js/piksel-ana-kanvas.js');
  assert.match(kanvas, /ENFAZLA = 2/);
  assert.doesNotMatch(kanvas, /izler\.push/);
  assert.match(oku('js/piksel-ana-konsol.js'), /demo simülasyonu: gerçek bir model çağrılmıyor/);
});

test('piksel sayfa geçişi: perde iner, yeni sayfa perdeli açılır; erken betik bayrağı koyar; yazdırmada gizli', () => {
  const gecis = oku('js/piksel-gecis.js');
  assert.match(gecis, /sessionStorage\.setItem\('pxGecis', '1'\)/);
  assert.match(oku('js/gorunum-erken.js'), /sessionStorage\.getItem\('pxGecis'\)/);
  const css = oku('css/piksel.css');
  assert.match(css, /html\[data-px-gecis\]::after/);
  assert.match(css, /@media print \{ \.pxg/);
  assert.match(oku('js/gorunum.js'), /import '\.\/piksel-gecis\.js'/);
});

test('piksel görünüm modern düzeniyle ortak: yerleşim blokları ikisine birden uygulanır', () => {
  const modern = oku('css/modern.css');
  assert.ok((modern.match(/html:is\(\[data-gorunum="modern"\], \[data-gorunum="piksel"\]\) \{/g) ?? []).length >= 3);
});

test('piksel Hakkımda: etkileşimli katman yalnız Hakkımda sayfasında yüklenir; karakter sahnesi imleci izler, tıklayınca gerçek bilgi söyler', () => {
  for (const yol of ['hakkimda/index.html', 'en/hakkimda/index.html']) {
    const h = oku(yol);
    assert.match(h, /piksel-hakkimda\.css/, yol);
    assert.match(h, /import \{ baslat as pikselHakkimda \} from '\.\.\/(\.\.\/)?js\/piksel-hakkimda\.js'/, yol);
  }
  assert.doesNotMatch(oku('projeler/index.html'), /piksel-hakkimda/);
  const sahne = oku('js/piksel-hakkimda-sahne.js');
  assert.match(sahne, /imlec/);
  assert.match(sahne, /SAYILAR\.repolar\.airock/);
  assert.match(sahne, /prefers-reduced-motion: reduce/);
  assert.match(oku('js/piksel-hakkimda.js'), /getElementById\('rota-baslik'\)/);
});

test('piksel Hakkımda: Rota yol haritası içeriği .rota listesinden okur (tek kaynak), listeyi silmez, klavyeyle gezilir', () => {
  const yol = oku('js/piksel-hakkimda-yol.js');
  assert.match(yol, /querySelector\('\.rota'\)/);
  assert.match(yol, /li\.querySelector\('time'\)/);
  assert.match(yol, /ArrowRight/);
  assert.match(yol, /prefers-reduced-motion: reduce/);
  assert.match(oku('js/piksel-hakkimda.js'), /const PARCALAR = \[[^\]]*\byolKur\b[^\]]*\]/);
  assert.match(oku('css/piksel-hakkimda.css'), /\.px-yol-var \.rota \{ display: none; \}/);
  assert.match(oku('hakkimda/index.html'), /<ol class="rota belir">/); // kaynak liste sayfada duruyor
});

test('piksel Hakkımda: başlık çözme ve araç yuvaları sayfanın kendi metninden çalışır, görünüm değişince geri alınır, klavyeyle kullanılır', () => {
  const d = oku('js/piksel-hakkimda-detay.js');
  assert.match(d, /aria-label/);                       // çözülürken ekran okuyucu asıl metni okur
  assert.match(d, /e\.key === 'Enter' \|\| e\.key === ' '/); // yuvalar klavyeyle
  assert.match(d, /prefers-reduced-motion: reduce/);
  assert.match(d, /return \(\) => temizle\.forEach/);   // kaldırma işlevi
  assert.match(oku('js/piksel-hakkimda.js'), /PARCALAR = \[sahneKur, yolKur, detayKur\]/);
  assert.match(oku('css/piksel-hakkimda.css'), /\.aletler li\.px-kusanildi/);
});

test('piksel Projeler: etkileşimli katman yalnız proje listesinde; commit hattı gerçek sayıları js/sayilar.js ve projeler listesinden alır', () => {
  for (const yol of ['projeler/index.html', 'en/projeler/index.html']) {
    const h = oku(yol);
    assert.match(h, /piksel-projeler\.css/, yol);
    assert.match(h, /import \{ baslat as pikselProjeler \} from '\.\.\/(\.\.\/)?js\/piksel-projeler\.js'/, yol);
  }
  for (const yol of ['projeler/skytrack/index.html', 'hakkimda/index.html']) assert.doesNotMatch(oku(yol), /piksel-projeler/, yol);
  const hat = oku('js/piksel-hakkimda.js') && oku('js/piksel-projeler-hat.js');
  assert.match(hat, /SAYILAR\.repolar\[repoAdi\(p\)\]/);
  assert.match(hat, /PROJELER\.map/);
  assert.match(hat, /prefers-reduced-motion: reduce/);
  assert.match(oku('js/piksel-projeler.js'), /querySelector\('\.vitrinler'\)/);
});

test('piksel Projeler: ilerleme rayı projelerin gerçek yerlerinden hesaplanır, tıklanır, kaydırma kapsayıcısından bağımsızdır', () => {
  const ray = oku('js/piksel-projeler-ray.js');
  assert.match(ray, /getBoundingClientRect/);
  assert.match(ray, /scrollIntoView/);
  assert.match(ray, /capture: true/);
  assert.match(ray, /prefers-reduced-motion: reduce/);
  assert.match(oku('js/piksel-projeler.js'), /PARCALAR = \[[^\]]*\brayKur\b[^\]]*\]/);
  assert.match(oku('css/piksel-projeler.css'), /@media print \{ \.px-ray \{ display: none !important; \} \}/);
});

test('piksel Projeler: süzgeç, komut kopyalama ve yazılarak gelen maddeler sayfanın kendi metninden çalışır; klavyeyle kullanılır; geri alınır', () => {
  const v = oku('js/piksel-projeler-vitrin.js');
  assert.match(v, /querySelectorAll\('\.v-etiketler span'\)/);   // etiketler sayfadan okunur
  assert.match(v, /git clone \$\{gh\.href\}\.git/);              // kopyalanan komut projenin GitHub adresinden
  assert.match(v, /e\.key === 'Enter' \|\| e\.key === ' '/);
  assert.match(v, /aria-label/);
  assert.match(v, /prefers-reduced-motion: reduce/);
  assert.match(v, /return \(\) => geri\.forEach/);
  assert.match(oku('js/piksel-projeler.js'), /PARCALAR = \[[^\]]*\bvitrinKur\b[^\]]*\]/);
  assert.match(oku('css/piksel-projeler.css'), /\.vitrin\.px-gizli \{ display: none; \}/);
});

test('piksel Slaytlar: etkileşimli katman yalnız Slaytlar listesinde; içindekiler slayt başlıklarını sunum sayfalarından okur ve sunum adresinin #n biçimine bağlanır', () => {
  for (const yol of ['slaytlar/index.html', 'en/slaytlar/index.html']) {
    const h = oku(yol);
    assert.match(h, /piksel-slaytlar\.css/, yol);
    assert.match(h, /import\('\.\.\/(\.\.\/)?js\/piksel-slaytlar\.js'\)\.then\(\(m\) => m\.baslat\(\)\)/, yol);
  }
  for (const yol of ['projeler/index.html', 'slaytlar/ai-ajani-nedir/index.html']) assert.doesNotMatch(oku(yol), /piksel-slaytlar/, yol);
  const ic = oku('js/piksel-slaytlar-icindekiler.js');
  assert.match(ic, /querySelectorAll\('\.slayt'\)/);          // başlıklar sunum sayfasının kendisinden
  assert.match(ic, /\.\/\$\{v\.slug\}\/#\$\{s\.n\}/);          // sunum adresi #n (js/deste.js hashtenKonum ile aynı)
  assert.match(ic, /ArrowRight/);
  assert.match(ic, /prefers-reduced-motion: reduce/);
  assert.match(oku('js/piksel-slaytlar.js'), /PARCALAR = \[[^\]]*\bicindekilerKur\b[^\]]*\]/);
  // gerçek sunumlarda her slayt bölümünün bir başlığı var (içindekiler boş çıkmasın)
  for (const slug of ['ai-ajani-nedir', 'claude-code-hook', 'skytrack-nasil-kurdum']) {
    const dosya = oku(`slaytlar/${slug}/index.html`);
    const bolumler = dosya.split('<section class="slayt').slice(1);
    assert.ok(bolumler.length >= 5, slug);
    for (const b of bolumler) assert.match(b, /<h[12][\s>]/, `${slug}: başlıksız slayt`);
  }
});
