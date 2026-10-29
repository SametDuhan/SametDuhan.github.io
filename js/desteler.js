import { t, EN } from './dil.js';
// Yeni deste = bu listeye bir satır (en: İngilizce başlık, etiket, açıklama) + slaytlar/<slug>/index.html. En yeni en üstte.
export const DESTELER = [
  {
    slug: 'ai-ajani-nedir',
    baslik: 'AI ajanı nedir?',
    etiket: 'Başlangıç',
    aciklama: 'Sohbet botuyla iş bitiren ajan arasındaki fark. Hiç bilmeyen için, sıfırdan.',
    slaytSayisi: 9,
    dakika: 8,
    gorsel: 'halka',
    en: { baslik: 'What is an AI agent?', etiket: 'Beginner', aciklama: 'The difference between a chatbot and an agent that gets work done. For complete beginners, from scratch.' },
  },
  {
    slug: 'claude-code-hook',
    baslik: 'Claude Code hook\'u ile otomasyon',
    etiket: 'Claude Code',
    aciklama: '"Şu olunca şunu çalıştır": AI işini bitirince ekranda zıplayan bir karakter nasıl yapılır.',
    slaytSayisi: 9,
    dakika: 8,
    ornek: 'claude-done-pixel',
    gorsel: 'zincir',
    en: { baslik: 'Automation with a Claude Code hook', etiket: 'Claude Code', aciklama: '"When this happens, run that": how to build a character that jumps on screen when AI finishes its job.' },
  },
  {
    slug: 'skytrack-nasil-kurdum',
    baslik: 'SkyTrack\'i AI ile nasıl kurdum',
    etiket: 'Proje',
    aciklama: 'Canlı uçak takip uygulaması, commit commit: AI neyi hızlandırdı, kararları kim verdi.',
    slaytSayisi: 9,
    dakika: 10,
    ornek: 'SkyTrack',
    gorsel: 'rota',
    en: { baslik: 'How I built SkyTrack with AI', etiket: 'Project', aciklama: 'A live flight tracking app, commit by commit: what AI sped up and who made the decisions.' },
  },
];

// Sayfanın diline göre deste yazısı: İngilizce sayfada d.en varsa o, yoksa Türkçesi.
const yazi = (d, alan) => (EN && d.en?.[alan]) || d[alan];

const sade = (s) => String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function desteAra(liste, sorgu, etiket) {
  const q = sade(sorgu.trim());
  return liste.filter((d) => (etiket === 'hepsi' || d.etiket === etiket)
    && (!q || sade(`${d.baslik} ${d.aciklama} ${d.etiket} ${d.ornek || ''}`).includes(q)));
}

const kacis = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Kartların üstündeki küçük canlı çizim: sunumun kapağındaki motifin sadeleşmiş hali (hareket css/site.css'te).
const MINI = {
  // Dört adımlı halka: düğümler sırayla yanar, çizgi akar (css/site.css .mini-*)
  halka: '<svg viewBox="0 0 240 64" aria-hidden="true"><circle class="mini-iz" cx="120" cy="32" r="24"/><circle class="mini-dugum d1" cx="120" cy="8" r="5"/><circle class="mini-dugum d2" cx="144" cy="32" r="5"/><circle class="mini-dugum d3" cx="120" cy="56" r="5"/><circle class="mini-dugum d4" cx="96" cy="32" r="5"/></svg>',
  // Dört kutulu zincir: kutular soldan sağa sırayla yanar, aralardaki çizgi akar
  zincir: '<svg viewBox="0 0 240 64" aria-hidden="true"><path class="mini-iz" d="M52 32H66M110 32H124M168 32H182"/><rect class="mini-kutu k1" x="8" y="20" width="44" height="24" rx="5"/><rect class="mini-kutu k2" x="66" y="20" width="44" height="24" rx="5"/><rect class="mini-kutu k3" x="124" y="20" width="44" height="24" rx="5"/><rect class="mini-kutu k4" x="182" y="20" width="44" height="24" rx="5"/></svg>',
  // Rota: uçak rota boyunca uçar (SMIL)
  rota: '<svg viewBox="0 0 240 64" aria-hidden="true"><path id="mini-rota" class="mini-iz" d="M18 52C70 2 150 2 222 46"/><circle class="mini-dugum" cx="18" cy="52" r="4.5"/><circle class="mini-dugum" cx="120" cy="14" r="4.5"/><circle class="mini-dugum" cx="222" cy="46" r="4.5"/><path class="mini-ucak" d="M9 0L-6 -6L-3 0L-6 6Z"><animateMotion dur="3.4s" repeatCount="indefinite" rotate="auto"><mpath href="#mini-rota"/></animateMotion></path></svg>',
};

// Kart çizimindeki SMIL animasyonu (uçak) kendiliğinden döner; hareketi azaltınca durur.
export function kartHareketi(kutu) {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const svg of kutu.querySelectorAll('.mini-gorsel svg')) svg.pauseAnimations();
}

export function kartHTML(d, ilerleme = null) {
  const ornek = d.ornek ? ` · ${t('örnek', 'example')}: ${kacis(d.ornek)}` : '';
  const devam = ilerleme && !ilerleme.bitti && ilerleme.konum > 0;
  const rozet = ilerleme?.bitti ? `<span class="rozet bitti">${t('✓ tamamlandı', '✓ completed')}</span>`
    : devam ? `<span class="rozet">${t('kaldığın yer', 'where you left off')}: ${ilerleme.konum + 1}/${ilerleme.n}</span>` : '';
  const href = devam ? `./${kacis(d.slug)}/#${ilerleme.konum + 1}` : `./${kacis(d.slug)}/`;
  const gorsel = MINI[d.gorsel] ? `<div class="mini-gorsel">${MINI[d.gorsel]}</div>\n  ` : '';
  return `<a class="deste-karti" href="${href}">
  ${gorsel}<div class="kart-ust"><span class="etiket">${kacis(yazi(d, 'etiket'))}</span>${rozet}</div>
  <h2>${kacis(yazi(d, 'baslik'))}</h2>
  <p>${kacis(yazi(d, 'aciklama'))}</p>
  <span class="alt">${d.slaytSayisi} ${t('slayt', 'slides')} · ~${d.dakika} ${t('dk', 'min')}${ornek} ${devam ? t('· devam et', '· continue') : ''} →</span>
</a>`;
}
