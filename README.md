# sametduhan.github.io

Samet Duhan'ın kişisel sitesi: **AI ile sistem kuran geliştirici**. Projeler ve AI'ı sıfırdan öğreten interaktif slaytlar.

Canlı: <https://sametduhan.github.io/>

Derleme adımı yok: sade HTML, CSS ve ES modülleri. GitHub Pages `main` dalını olduğu gibi yayınlar.

## Yerelde çalıştırma

```bash
python3 -m http.server 8765    # http://127.0.0.1:8765/
npm test                       # bağımlılık yok, Node 20+ yeter
```

## Yapı

| Yol | Ne |
|---|---|
| `index.html` | Giriş: tünekte nefes alan şahin, seyir haritası ve dört kutu (hakkımda, projeler, slaytlar, iletişim) |
| `hakkimda/`, `projeler/`, `slaytlar/`, `iletisim/`, `404.html` | `araclar/sayfa_yap.mjs` üretir, **elle düzenleme** |
| `slaytlar/<slug>/index.html` | Desteler; `js/deste.js` gezdirir |
| `js/projeler.js` | Proje verisi ve kart HTML'i |
| `js/desteler.js` | Deste listesi, arama |
| `js/ilerleme.js` | "Kaldığın yer" (yalnız ziyaretçinin tarayıcısında) |
| `js/sahin.js` | Şahin: poz verisi, göz kırpma kararları, sahneye bağlama |
| `js/piksel.js` | claude-done-pixel karakteri (`claude-done.ps1`'in birebir aktarımı) |
| `css/tema.css` | Kâğıt teması: renk tokenları, yazı tipleri, kâğıt dokusu, ortak etiket/damga/düğme/köşe |
| `css/giris.css`, `css/site.css`, `css/deste.css` | Ana sayfa, alt sayfalar, desteler |
| `css/deste-gorsel.css`, `js/deste-gorsel.js` | Tüm desteler: giriş animasyonu, sayaç, çubuk dolumu, yazdırma/hareketi azalt kuralları |
| `css/skytrack-gorsel.css`, `css/ajan-gorsel.css`, `css/hook-gorsel.css` | Deste başına görseller ve animasyonlar |
| `araclar/sahneler.mjs` | Alt sayfa başlıklarındaki şahin sahneleri (SVG); `araclar/sayfa_yap.mjs` yerleştirir |
| `araclar/fabrika.mjs` | Projeler sayfasının tuğla fabrika ve konveyör bandı (SVG) |
| `img/sahin/` | Şahin pozları (WebP); her alt sayfanın başında bir poz |
| `araclar/ingilizce.mjs`, `araclar/en-sozluk.txt` | İngilizce sayfaları üretir; çeviri sözlüğü |
| `js/dil.js` | Betik metinleri için `t(tr, en)` |
| `js/sayilar.js`, `araclar/sayac_guncelle.mjs` | Projeler sayaçlarının commit sayıları; `.github/workflows/sayaclar.yml` her gün GitHub'dan sayar, değiştiyse sayfaları üretip commit'ler (elle: Actions → sayaclar → Run workflow) |
| `tests/` | `node:test`; sayfaların üreticiyle güncel olduğunu da denetler |

## Görünümler

Sitenin üç tasarımı var; seçici her sayfada (ana sayfada üst şeritte, alt sayfalarda sol menüde) ve seçim tarayıcıda saklanır. `<html data-gorunum="retro|modern|piksel">`: ilk değeri `js/gorunum-erken.js` koyar (ilk açılışta **piksel**), seçici `araclar/gorunum-secici.mjs` + `js/gorunum.js`. Adreste `?gorunum=retro|modern|piksel` varsa o seçilir.

- **Kâğıt** (`css/tema.css`) ve **Modern** (`css/modern.css`): ilk iki tasarım, olduğu gibi duruyor.
- **Piksel** (1 Kasım 2026): koyu devre kartı, Claude turuncusu, koşan Claude Code pikseli. Modern'in yerleşim bloklarını paylaşır (`html:is([data-gorunum="modern"], [data-gorunum="piksel"])`), renk/yazı tipi/köşe `css/piksel.css`'te değişir. Her sayfada en son yüklenir.

Piksel katmanı **ek parçalardır**: sayfanın kendi içeriği (HTML) ve mantığı olduğu gibi kalır; piksel seçiliyken parçalar eklenir, başka görünüme geçilince kaldırılır (her parça bir `kur()` işlevi, kaldırma işlevi döndürür). Hareketi azaltınca animasyonlar kapanır. Tek sayfada az karakter: yeni parçada karakter eklemeden önce sayfadakilere bak.

| Yol | Ne |
|---|---|
| `css/piksel.css` | Piksel temanın jetonları, yazı tipleri, kartlar, düğmeler, sayfa geçişi perdesi |
| `js/piksel-ana.js`, `-ana-kanvas.js`, `-ana-konsol.js`, `-ana-sahin.js`, `css/piksel-ana.css` | Ana sayfa: `<piksel-ana>` bileşeni (gölge DOM): devre kartı, en çok 1 koşan karakter, tünemiş şahin, konsol, commit ızgarası |
| `js/piksel-gecis.js` | Sayfa geçişi: ince turuncu çizgi ve hafif solma |
| `js/piksel-hakkimda*.js`, `css/piksel-hakkimda.css` | Hakkımda: karakter sahnesi, Rota yol haritası, başlık çözme, araç yuvaları |
| `js/piksel-projeler*.js`, `css/piksel-projeler.css` | Projeler: commit hattı, ilerleme rayı, etiket süzgeci, git clone kopyalama |
| `js/piksel-slaytlar*.js`, `css/piksel-slaytlar.css` | Slaytlar: içindekiler (sunum sayfalarından), kaldığın yer yolu, arama |
| `js/piksel-iletisim*.js`, `css/piksel-iletisim.css` | İletişim: postacı sahnesi ve Türkiye saati, zarf uçuşu, kısayollar |
| `js/piksel-deste*.js`, `css/piksel-deste.css` | Sunumlar: slayt yolu, geçiş efekti, bitiş kutlaması ve sıradaki sunum (`js/atolye.js` yükler) |
| `js/piksel-proje*.js`, `css/piksel-proje.css` | Proje detay: bölüm rayı, commit hattı, akış paketi, ekran görüntüsü nişanı (karakter yok) |

Piksel parçalarının testleri `tests/piksel-*.test.mjs`; `tests/piksel-denetim-*.test.mjs` denetimde bulunan hataların tekrarını engeller (kontrast taraması dahil).

## İngilizce sürüm

Türkçe sayfalar kaynaktır; `en/` altındaki İngilizce sayfalar **elle düzenlenmez**, `node araclar/ingilizce.mjs` üretir. Metinler `araclar/en-sozluk.txt` sözlüğünden gelir (`TR ::: EN` satırları; `= metin` çevrilmeden kalır; `H:` satır içi işaretli cümle; `J:` satır içi betik metni). Türkçe sayfaya yeni bir metin eklenip sözlüğe girilmezse üretim durur ve eksikleri listeler, testler de başarısız olur. Betik dosyalarındaki metinler `js/dil.js`'teki `t(tr, en)` ile seçilir. Her sayfada TR | EN seçici ve `hreflang` bağlantıları var. 404 sayfası tek dilli (Türkçe) kalır.

## Yeni proje eklemek

1. `js/projeler.js` içindeki `PROJELER` listesine bir kayıt ekle. Her madde README ya da commit geçmişine dayansın.
2. Görseli `img/` altına koy.
3. `npm run sayfalar`, sonra `npm test`.

## Sunumlarda animasyonlar

- Slayt açılınca `deste.js` slayta `goster`, kapanınca `gizle` olayı gönderir. Animasyonlar bunu dinler: `js/atolye.js` içindeki `slaytaBagla(oge, baslat, durdur)` slayt görünürken çalıştırır, gizlenince ya da sekme arka plana geçince durdurur.
- Video slayt açılınca kendiliğinden, sessiz ve döngüde oynar (kontrol çubuğu yok, tıklayınca durur). Alarm, ajan ve hook deneyleri ile `data-otomatik` işaretli piksel demoları da kendiliğinden çalışır.
- Slayt sığmazsa içinde kaydırılır; "1/2" sayfalaması yok.
- Her yeni animasyon `prefers-reduced-motion` ve yazdırma görünümünde anlamlı bir karede kalmalı (`css/deste-gorsel.css` sonundaki kurallar).

## Yeni deste eklemek

1. `slaytlar/<slug>/index.html` oluştur. Var olan bir desteyi kopyala; her slayt bir `<section class="slayt">`.
2. `js/desteler.js` içindeki `DESTELER` listesine bir satır ekle (`slaytSayisi` sayfadaki slayt sayısına eşit olmalı; `gorsel` kartın üstündeki küçük çizimi seçer; test ikisini de denetler).
3. `sitemap.xml`'e adresini ekle, `npm test`.

Slayt içi bileşenler: `.soru` (mini soru), `pre.adim-kod` (satır satır kod), `.dene` (kopyalanabilir komut), `.demo` (canlı demo; `goster`/`gizle` olaylarını dinler).

## Kurallar

- Gizli bilgi yok: özel repo adları, dosya yolları, anahtarlar `tests/statik.test.mjs` ile denetlenir.
- Mail adresi kaynakta düz metin durmaz; `js/iletisim.js` sayfa açılınca birleştirir.
- `prefers-reduced-motion` açıkken animasyonlar durur.

claude-done-pixel ve chatgpt-done-pixel resmî olmayan hayran projeleridir; Anthropic ve OpenAI ile bağlantısı yoktur.

## İnteraktif anlatımlar ve proje sayfaları

- `npm run sayfalar` ortak bölüm sayfalarını ve üç proje detayını birlikte üretir.
- Proje hikâyeleri: `araclar/proje_sayfalari.mjs`. Kartlar: `js/projeler.js`.
- `css/atolye.css` sunumların ve detay sayfalarının görsel tasarımıdır; ana sayfaya yüklenmez.
- `js/atolye.js` ajan/hook/alarm deneylerini, paylaşımı ve sayfalı okuma görünümünü bağlar.
- `?gorunum=oku` sunumu dar okuma görünümünde açar; `#3` gibi bağlantılar bir slaydı paylaşır.
- Paylaşım kapaklarının kaynakları ve 1200×630 PNG çıktıları `img/paylasim/` içindedir.
- Deneyler tarayıcıda simülasyon olarak çalışır. Gerçek bir ajan ya da PowerShell komutu çalıştırmaz.
- Yeni proje için detay hikâyesini de ekle; bilgileri README/commit kayıtlarıyla doğrula.

## Tek ekran gezinme

`css/ekran.css` görünümü pencereye sığdırır; `js/ekrana-sigdir.js` uzun içeriği yatay sayfalara böler. İçerik silinmez; önceki/sonraki düğmeleriyle tamamına ulaşılır. Sunumda sayaçtaki ikinci sayı aynı slaydın devam sayfasıdır. Kaydırma yerine ok tuşları da kullanılabilir. JavaScript kapalıyken ve yazdırırken doğal belge akışı korunur.

## Git dışı yerel dosyalar

`.gitignore` şunları dışarıda tutar: `node_modules/`, `ekran/` (önizleme görüntüleri), `.superpowers/`, `.impeccable/` ve `PRODUCT.md` (yerel tasarım notları). Bunlar depoda yoktur; klonlayınca çıkmaz, siteyi çalıştırmak için gerekmez.
