// Kod, robot ve logolar karışık gelir; piksel karakter yalnız kod tamamlanınca kutlar.
import { ekranSanati } from './ekran-sanat.js';
import { kareDurumu, pikselKarakter, SURE as PIKSEL_SURE } from './piksel.js';

export const SENARYOLAR = [
`$ claude "sunum motorunu geliştir"
# proje dosyaları okunuyor...
export function bagla(kok) {
  const slaytlar = [...kok.children];
  let konum = 0;
  function git(i) {
    const son = slaytlar.length - 1;
    konum = Math.max(0, Math.min(i, son));
    slaytlar.forEach((s, j) => {
      s.hidden = j !== konum;
    });
  }
  kok.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      git(konum + 1);
    }
  });
  git(0);
}
$ npm test
✓ klavye gezinmesi çalışıyor
✓ slaytlar ekrana sığıyor
✓ testler geçti
✓ Claude bitti`,
`$ claude "kırık bağlantıyı düzelt"
# ajan görevi aldı
→ bak: index.html okunuyor
→ bak: bağlantılar çıkarılıyor
const linkler = [...document.links];
for (const link of linkler) {
  const url = new URL(link.href);
  if (url.origin !== location.origin) {
    continue;
  }
  const sonuc = await fetch(url);
  console.log(url.pathname, sonuc.status);
}
# /projelr adresi bulunamadı
→ karar: doğru adres /projeler/
→ yap: bağlantı güncellendi
→ kontrol: sayfa yeniden açıldı
$ npm test
✓ iç bağlantılar çözüldü
✓ klavye odağı korundu
✓ mobil görünüm kontrol edildi
✓ görev tamam, rapor yazıldı
✓ Claude bitti`,
`$ python robot.py
# ROBOT-7 başlatılıyor...
class Robot:
    def __init__(self):
        self.batarya = 100
        self.hazir = False

    def baslat(self):
        self.sensorleri_kontrol_et()
        self.hazir = True

    def ilerle(self, mesafe):
        if self.hazir and mesafe > 20:
            return "yol açık"
        return "dur ve yeniden bak"

→ kamera ............ hazır
→ mesafe sensörü .... hazır
→ sol motor ......... hazır
→ sağ motor ......... hazır
→ batarya ........... %100
> merhaba insan.
✓ sensör kontrolleri geçti
✓ Claude bitti`,
`$ claude "ajan döngüsü oluştur"
# hedef: bak, planla, yap, kontrol et
async function calistir(gorev) {
  const plan = await planla(gorev);
  for (const adim of plan) {
    const gozlem = await oku(adim);
    const karar = await degerlendir(gozlem);
    if (karar.duzeltmeGerekli) {
      await duzenle(karar);
    }
    const test = await kontrolEt(adim);
    if (!test.basarili) {
      await yenidenDene(adim);
    }
  }
  return raporla(gorev);
}
→ dosyalar incelendi
→ plan hazırlandı
→ değişiklikler uygulandı
→ testler çalıştırıldı
✓ görev kontrol edildi
✓ sonuç raporu hazır
✓ Claude bitti`,
`$ claude "harita verisini işle"
# uçuş verisi alınıyor...
const ucuslar = await veriAl();
const harita = new Map();
for (const ucus of ucuslar) {
  if (!ucus.konum) continue;
  harita.set(ucus.id, {
    enlem: ucus.konum.enlem,
    boylam: ucus.konum.boylam,
    irtifa: ucus.irtifa,
  });
}
function guncelle(ucus) {
  const isaret = harita.get(ucus.id);
  if (!isaret) return;
  isaret.irtifa = ucus.irtifa;
  rotayiCiz(ucus.rota);
}
→ geçersiz konumlar ayıklandı
→ harita işaretleri güncellendi
→ rota katmanı hazır
$ npm test
✓ veri dönüşümü kontrol edildi
✓ Claude bitti`,
`$ python egit.py
# örnek eğitim akışı başlıyor
veri = veriyi_oku("ornekler.json")
egitim, kontrol = ayir(veri)
model = Model(katmanlar=[32, 16, 8])
for tur in range(1, 6):
    kayip = model.egit(egitim)
    sonuc = model.degerlendir(kontrol)
    print(tur, kayip, sonuc)
    if sonuc.iyilesti:
        model.kaydet("model.pt")

→ veriler okundu
→ eğitim ve kontrol ayrıldı
tur 1  [██░░░░░░░░]
tur 2  [████░░░░░░]
tur 3  [██████░░░░]
tur 4  [████████░░]
tur 5  [██████████]
# model kaydedildi: model.pt
→ örnek tahminler kontrol ediliyor
✓ kontrol tamamlandı
✓ rapor oluşturuldu
✓ Claude bitti`
].map((m) => m.split('\n'));

export function turSuresi(r) {
  return 14000 + r * 8000;
}

export function sonrakiSenaryo(onceki, r, n) {
  // önceki hariç n-1 seçenekten birini seç
  const i = Math.floor(r * (n - 1));
  return i >= onceki ? i + 1 : i;
}

export function yazilanSatirlar(satirlar, yazilan) {
  const sonuc = [];
  let kalan = Math.floor(yazilan);
  for (const s of satirlar) {
    if (kalan <= 0) break;
    sonuc.push(s.slice(0, kalan));
    kalan -= s.length + 1;
  }
  return sonuc;
}

export const EKRAN_SAHNELERI = ['kod', 'robot', 'anthropic', 'openai', 'gemini'];
// Kod ve robot baskın; üç şirket logosu birlikte küçük bir ağırlık taşır.
const SAHNE_AGIRLIKLARI = { kod: 48, robot: 46, anthropic: 2, openai: 2, gemini: 2 };
export function sonrakiSahne(onceki, r) {
  const secenekler = EKRAN_SAHNELERI.filter(s => s !== onceki);
  const toplam = secenekler.reduce((n, s) => n + SAHNE_AGIRLIKLARI[s], 0);
  let secim = Math.max(0, Math.min(1, r)) * toplam;
  for (const s of secenekler) {
    secim -= SAHNE_AGIRLIKLARI[s];
    if (secim < 0) return s;
  }
  return secenekler.at(-1);
}
const VURGU = '92,207,255';
export function baslatSahne(kok) {
  const sanatCiz = ekranSanati();
  const az = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ekran = kok.querySelector('#ekran'), ec = ekran.getContext('2d');
  let EW = 0, EH = 0, senaryo = 0, satirlar = SENARYOLAR[0], hiz = 0, yazilan = 0;
  let faz = 'sanat', sanatIndeksi = 0, fazBas = performance.now(), sahne = 'robot';
  let son = performance.now(), kare = 0;
  function yeniTur(r = Math.random()) {
    senaryo = sonrakiSenaryo(senaryo, Math.random(), SENARYOLAR.length);
    satirlar = SENARYOLAR[senaryo]; hiz = satirlar.join('\n').length / turSuresi(r); yazilan = 0;
  }
  function sec(simdi) {
    sahne = sonrakiSahne(sahne, Math.random()); fazBas = simdi;
    faz = sahne === 'kod' ? 'kod' : 'sanat';
    sanatIndeksi = ['robot', 'anthropic', 'openai', 'gemini'].indexOf(sahne);
    if (faz === 'kod') yeniTur();
    ekran.dataset.sahne = sahne;
  }
  function boyutla() {
    const o = Math.min(devicePixelRatio || 1, 2), e = ekran.getBoundingClientRect();
    EW = e.width; EH = e.height; ekran.width = EW * o; ekran.height = EH * o; ec.setTransform(o, 0, 0, o, 0, 0);
    if (az) ekranCiz(0);
  }
  function ekranCiz(simdi) {
    ec.fillStyle = '#04070b';
    ec.fillRect(0, 0, EW, EH);
    if (faz === 'sanat') { sanatCiz(ec, EW, EH, sanatIndeksi, simdi - fazBas, az); return; }
    const fs = Math.max(8, EW / 36), sat = fs * 1.45;
    const u = Math.max(2, Math.floor((EH * 0.52) / 31));
    const sigan = Math.max(1, Math.floor((EH - 31 * u - fs * 0.6) / sat));
    ec.font = `${fs}px 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace`;
    ec.textBaseline = 'top';
    const gorunen = yazilanSatirlar(satirlar, yazilan), ilk = Math.max(0, gorunen.length - sigan);
    ec.shadowColor = `rgba(${VURGU},.6)`;
    ec.shadowBlur = 6;
    gorunen.slice(ilk).forEach((s, i) => {
      ec.fillStyle = s.startsWith('✓') ? '#7ee787' : s.startsWith('$') ? '#e6edf3' : s.startsWith('#') ? 'rgba(160,175,190,.75)' : s.startsWith('>') ? '#ffd27a' : `rgba(${VURGU},.9)`;
      ec.fillText(s, fs * 0.8, fs * 0.6 + i * sat);
    });
    ec.shadowBlur = 0;
    if (faz === 'kod' && Math.floor(simdi / 450) % 2) {
      const sonSatir = gorunen.at(-1) || '', i = Math.max(0, gorunen.length - 1 - ilk);
      ec.fillStyle = `rgba(${VURGU},.9)`;
      ec.fillRect(fs * 0.8 + ec.measureText(sonSatir).width + 2, fs * 0.6 + i * sat, fs * 0.55, fs);
    }
    const zem = EH - 2 * u;
    ec.fillStyle = `rgba(${VURGU},.12)`;
    ec.fillRect(0, zem + u, EW, 1);
    if (faz === 'piksel') {
      const t = (simdi - fazBas) / 1000;
      pikselKarakter(ec, kareDurumu(t, EW, u), zem, u, t);
    }
  }


  function adim(simdi) {
    const dt = Math.min(64, simdi - son); son = simdi;
    if (faz === 'kod') {
      yazilan += dt * hiz;
      if (yazilan >= satirlar.join('\n').length) {
        faz = 'piksel'; fazBas = simdi;
        ekran.dataset.sahne = 'piksel';
      }
    } else if (simdi - fazBas > (faz === 'piksel' ? PIKSEL_SURE + 300 : 4600)) sec(simdi);
    ekranCiz(simdi); kare = requestAnimationFrame(adim);
  }
  sec(performance.now()); boyutla(); new ResizeObserver(boyutla).observe(kok);
  if (az) { faz = 'sanat'; sanatIndeksi = 0; ekranCiz(0); return; }
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(kare);
    if (!document.hidden) { son = performance.now(); fazBas = son; kare = requestAnimationFrame(adim); }
  });
  kare = requestAnimationFrame(adim);
}
