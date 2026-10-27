import { mkdirSync, writeFileSync } from 'node:fs';
import { bas, menu, son } from './sayfa_yap.mjs';
import { PROJELER } from '../js/projeler.js';
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
for (const p of PROJELER) {
 const slug=p.ad.toLowerCase(), t=stories[slug], path=`projeler/${slug}/`;
 const demo = p.piksel ? `<div class="piksel-demo" data-piksel-demo="${slug.startsWith('chatgpt') ? 'codex' : 'claude'}"><p>Proje animasyonunun hareketli önizlemesi</p><canvas width="720" height="220" role="img" aria-label="İş tamamlanma bildiriminin animasyonlu örneği">Piksel karakter koşar, zıplar ve bayrak sallar.</canvas><button class="dugme" type="button">▶ Animasyonu oynat</button>${slug.startsWith('chatgpt') ? '<p class="not">Gerçek proje görselindeki animasyon karelerinden hazırlanmış önizleme.</p>' : ''}</div>` : `<section class="bolum"><h2>Önce izle, sonra dene</h2><video class="proje-video" controls playsinline preload="none" poster="../../img/skytrack-960.jpg" aria-label="SkyTrack tarayıcı demosunun ekran kaydı; uçuşlar simülasyondur"><source src="../../video/skytrack-demo.webm" type="video/webm">Tarayıcın videoyu desteklemiyor. Aşağıdaki demo bağlantısını kullanabilirsin.</video><p>Tarayıcı demosunda simüle edilmiş uçuşlar ve türbülans alanları kullanılır.</p><a class="dugme ana" href="${p.demo}">Tarayıcı demosunu aç ↗</a></section>`;
 const body = `${bas({baslik:p.ad+' · Samet Duhan',aciklama:p.ozet,yol:path,onek:'../../',kapak:slug,ekCss:'\n<link rel="stylesheet" href="../../css/atolye.css">'})}${menu('projeler','../../')}
<main id="icerik"><a href="../">← Tüm projeler</a><div class="proje-kapak"><div><p class="komut">PROJE / GELİŞTİRME HİKÂYESİ</p><h1>${p.ad}</h1><p class="tanitim">${p.ozet}</p><div class="linkler"><a class="dugme" href="${p.github}">Kaynak kod ↗</a>${p.deste?`<a class="dugme" href="../../${p.deste}">İnteraktif anlatımı aç →</a>`:'<a class="dugme" href="../../slaytlar/claude-code-hook/">İlgili otomasyon sunumu →</a>'}</div></div><img src="../../${p.gorsel}" alt="${p.alt}" width="960" height="540"></div>
<section class="bolum"><h2>Neden yaptım?</h2><p>${t.amac}</p></section>${demo}
<section class="bolum"><h2>Nasıl çalışıyor?</h2><div class="mimari" aria-label="Veri ve olay akışı">${t.akis.map((s,i)=>`${i?' → ':''}<span>${s}</span>`).join('')}</div></section>
<div class="proje-notlar bolum"><section><h2>Verdiğim karar</h2><p>${t.karar}</p></section><section><h2>Sorunlar ve kontroller</h2><p>${t.hata}</p></section><section><h2>AI’ın rolü</h2><p>${t.ai}</p></section><section><h2>Bir sonraki geliştirme için</h2><p>${t.gelecek}</p></section></div>
<section class="bolum"><h2>Kaynaklar ve devamı</h2><p>Projenin güncel kurulum adımları, sürümleri ve değişiklikleri GitHub’da.</p><div class="linkler"><a class="dugme" href="${p.github}#readme">README</a><a class="dugme" href="${p.github}/commits">Değişiklik geçmişi</a><a class="dugme" href="${p.github}/releases">Sürümler</a>${p.deste?`<a class="dugme" href="../../${p.deste}?gorunum=oku">Geliştirme anlatımını oku →</a>`:''}<a class="dugme" href="../../iletisim/">Soru veya öneri gönder</a></div></section>
</main>${son('../../')}<script type="module" src="../../js/atolye.js"></script></body></html>`;
 mkdirSync(path,{recursive:true});writeFileSync(path+'index.html',body);
}
