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
| `index.html` | Giriş: tüplü monitör sahnesi ve dört kare (hakkımda, projeler, slaytlar, iletişim) |
| `hakkimda/`, `projeler/`, `slaytlar/`, `iletisim/`, `404.html` | `araclar/sayfa_yap.mjs` üretir, **elle düzenleme** |
| `slaytlar/<slug>/index.html` | Desteler; `js/deste.js` gezdirir |
| `js/projeler.js` | Proje verisi ve kart HTML'i |
| `js/desteler.js` | Deste listesi, arama |
| `js/ilerleme.js` | "Kaldığın yer" (yalnız ziyaretçinin tarayıcısında) |
| `js/sahne.js` | Giriş sahnesi: tüplü monitör, akan senaryolar, kablo, mini karakterler |
| `js/piksel.js` | claude-done-pixel karakteri (`claude-done.ps1`'in birebir aktarımı) |
| `js/fener.js` | Nokta ızgarasında imleci izleyen fener (ızgara `css/tema.css`'te) |
| `tests/` | `node:test`; sayfaların üreticiyle güncel olduğunu da denetler |

## Yeni proje eklemek

1. `js/projeler.js` içindeki `PROJELER` listesine bir kayıt ekle. Her madde README ya da commit geçmişine dayansın.
2. Görseli `img/` altına koy.
3. `npm run sayfalar`, sonra `npm test`.

## Yeni deste eklemek

1. `slaytlar/<slug>/index.html` oluştur. Var olan bir desteyi kopyala; her slayt bir `<section class="slayt">`.
2. `js/desteler.js` içindeki `DESTELER` listesine bir satır ekle (`slaytSayisi` sayfadaki slayt sayısına eşit olmalı; test denetler).
3. `sitemap.xml`'e adresini ekle, `npm test`.

Slayt içi bileşenler: `.soru` (mini soru), `pre.adim-kod` (satır satır kod), `.dene` (kopyalanabilir komut), `.demo` (canlı demo; `goster`/`gizle` olaylarını dinler).

## Kurallar

- Gizli bilgi yok: özel repo adları, dosya yolları, anahtarlar `tests/statik.test.mjs` ile denetlenir.
- Mail adresi kaynakta düz metin durmaz; `js/iletisim.js` sayfa açılınca birleştirir.
- `prefers-reduced-motion` açıkken animasyonlar durur.

claude-done-pixel ve chatgpt-done-pixel resmî olmayan hayran projeleridir; Anthropic ve OpenAI ile bağlantısı yoktur.
