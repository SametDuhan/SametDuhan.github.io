// Piksel görünümün ana sayfası: <piksel-ana> bileşeni (gölge DOM, stil çakışması yok). index.html yalnız piksel görünüm seçiliyken yükler.
// Devre kartı zemini ve koşan Claude Code karakterleri js/piksel-ana-kanvas.js'te, konsol ve paneller js/piksel-ana-konsol.js'te.
import { t, EN } from './dil.js';
import { baslatKanvas } from './piksel-ana-kanvas.js';
import { baslatKonsol } from './piksel-ana-konsol.js';

const kok = document.documentElement;
const K = EN ? '/en/' : '/';              // bu dildeki sitenin kökü
const kacis = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const LIMANLAR = [
  ['hakkimda', t('Hakkımda', 'About'), t('ben kimim, ne yapıyorum.', 'who I am, what I do.'), '54%', '17%', '.5s'],
  ['projeler', t('Projeler', 'Projects'), t('canlı demolar, açık kaynak.', 'live demos, open source.'), '60%', '38%', '.7s'],
  ['slaytlar', t('Slaytlar', 'Slides'), t('AI’ı sıfırdan öğren.', 'Learn AI from scratch.'), '57%', '59%', '.9s'],
  ['iletisim', t('İletişim', 'Contact'), t('iş, proje ya da soru.', 'work, projects, or questions.'), '62%', '80%', '1.1s'],
];
const GORUNUMLER = [['retro', t('Kâğıt', 'Paper')], ['modern', 'Modern'], ['piksel', t('Piksel', 'Pixel')]];

const sablon = () => `
<link rel="stylesheet" href="/css/piksel-ana.css">
<canvas id="zemin" aria-hidden="true"></canvas>
<canvas id="hareket" aria-hidden="true"></canvas>

<header class="serit">
  <a class="marka" href="${K}" aria-label="${t('Samet Duhan Şahin, ana sayfa', 'Samet Duhan Şahin, home')}">SAMET DUHAN <span class="soyad">ŞAHİN</span></a>
  <nav class="hizli" aria-label="${t('Bağlantılar', 'Links')}">
    <a href="https://github.com/SametDuhan" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    <a href="https://www.linkedin.com/in/samet-duhan-%C5%9Fahin-96662131b/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
  </nav>
  <div class="gorunum" role="group" aria-label="${t('Görünüm', 'Design')}">${GORUNUMLER.map(([k, ad]) => `<button type="button" data-g="${k}" aria-pressed="${k === 'piksel'}">${ad}</button>`).join('')}</div>
  <div class="dil-sec" role="group" aria-label="${t('Dil', 'Language')}"><a href="/" lang="tr" hreflang="tr"${EN ? '' : ' aria-current="true"'}>TR</a><a href="/en/" lang="en" hreflang="en"${EN ? ' aria-current="true"' : ''}>EN</a></div>
</header>

<main id="icerik">
  <div class="kolon">
    <section class="levha">
      <h1 aria-label="SAMET DUHAN"><span class="satir" aria-hidden="true">SAMET</span><span class="satir" aria-hidden="true">DUHAN</span></h1>
      <p class="terminal" role="img" aria-label="${t('Samet Duhan Şahin, Atatürk Üniversitesi bilgisayar mühendisliği 3. sınıf, AI ile sistem kuran geliştirici', 'Samet Duhan Şahin, 3rd-year computer engineering student at Atatürk University, developer who builds systems with AI')}"><span class="istem">samet@sahin:~$</span> <span class="komut" data-yaz></span><i class="imlec"></i><span class="cikti" data-cikti><span></span><span></span><span></span></span></p>
      <a class="durum" href="${K}iletisim/?konu=staj"><i aria-hidden="true"></i><span>${t('Staj arıyorum, hemen başlayabilirim.', 'Looking for an internship, available now.')}</span><b aria-hidden="true">→</b></a>
    </section>
    <section class="konsol" aria-label="${t('Etkileşimli konsol', 'Interactive console')}">
      <div class="k-bar"><span class="k-baslik">claude-code · demo</span></div>
      <div class="k-log" id="k-log" role="log" aria-live="polite"></div>
      <form class="k-form" id="k-form"><label for="k-in" class="gizli">${t('Komut', 'Command')}</label><span class="istem">samet@sahin:~$</span><input id="k-in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${kacis(t('help yaz, ya da claude "bir görev"', 'type help, or claude "a task"'))}"></form>
    </section>
  </div>

  <aside class="kanit" aria-label="${t('Projelerde Claude ile ortak yazılan commit sayıları', 'Commits co-authored with Claude, per project')}">
    <p class="kanit-baslik"><span class="istem">$</span> git log --stat</p>
    <p class="kanit-ana"><b class="k-commit">0</b> <span>commit</span></p>
    <p class="kanit-alt"><b class="k-claude">0</b> ${t('tanesi', '')} <strong>${t('Claude ile ortak yazıldı', 'co-authored with Claude')}</strong> <span class="k-yuzde"></span></p>
    <div class="kanit-izgara" id="k-izgara" role="img" aria-label="${t('Her kare bir commit; turuncu olanlar Claude ile ortak yazılanlar', 'Each square is a commit; orange ones were co-authored with Claude')}"></div>
    <div class="kanit-oz"><button type="button" data-g="claude"><i class="n t"></i>${t('Claude ile', 'with Claude')}</button><button type="button" data-g="el"><i class="n g"></i>${t('tek başıma', 'on my own')}</button></div>
    <p class="kanit-not k-not"></p>
  </aside>

  <nav class="limanlar" aria-label="${t('Bölümler', 'Sections')}">
${LIMANLAR.map(([yol, ad, aciklama, x, y, d], i) => `    <a class="liman" href="${K}${yol}/" style="--x:${x};--y:${y};--d:${d}" data-i="${i}"><span class="iskele" aria-hidden="true"></span><span class="etiket"><span class="yol">~/${yol}</span><b class="baslik">${ad}</b><span class="acik">${aciklama}</span><i class="ok" aria-hidden="true">→</i></span></a>`).join('\n')}
  </nav>
</main>
<div class="balon" id="balon" role="status" aria-live="polite"></div>
`;

class PikselAna extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = sablon();
    root.querySelector('.gorunum').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-g]'); if (!b || b.dataset.g === 'piksel') return;
      try { localStorage.setItem('gorunum', b.dataset.g); } catch {}
      kok.dataset.gorunum = b.dataset.g;
    });
    // gölge DOM'un stili <link> ile gelir: yüklenmeden ölçüm yapılırsa limanlar konumlanmamış görünür (devre yolları kayar). Hazır olana dek gizli.
    const bag = root.querySelector('link[rel="stylesheet"]');
    this.style.visibility = 'hidden';
    new Promise((tamam) => { if (bag.sheet) tamam(); else { bag.addEventListener('load', tamam); bag.addEventListener('error', tamam); } }).then(() => {
      this.style.visibility = '';
      baslatKanvas(root, { kok: K });
      baslatKonsol(root, { kok: K });
    });
  }
}
if (!customElements.get('piksel-ana')) customElements.define('piksel-ana', PikselAna);
