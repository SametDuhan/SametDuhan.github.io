// Projeler, piksel görünüm: vitrin etkileşimleri. (1) etiketlere göre süzme çubuğu; (2) proje komutuna tıklayınca "git clone" komutu panoya kopyalanır;
// (3) özellik maddeleri proje görününce yazılarak gelir; (4) proje başlıkları görününce karışık harflerden çözülür.
// Tüm metinler sayfanın kendisinden okunur; görünüm değişince hepsi geri alınır.
import { t } from './dil.js';

const AZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HARF = 'ABCDEFGHIJKLMNOPRSTUVYZ0123456789<>/_{}#';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function coz(el, sure = 650) {
  const metin = el.dataset.pxMetin ??= el.textContent; if (AZ) return; const bas = performance.now();
  const f = (now) => { const p = clamp((now - bas) / sure, 0, 1); el.textContent = [...metin].map((ch, i) => (ch === ' ' || ch === '-' || i < p * metin.length * 1.15 - 1) ? ch : HARF[Math.floor(Math.random() * HARF.length)]).join(''); if (p < 1) el._r = requestAnimationFrame(f); else el.textContent = metin; };
  cancelAnimationFrame(el._r); el._r = requestAnimationFrame(f);
}
async function panoyaKopyala(metin) {
  try { await navigator.clipboard.writeText(metin); return true; } catch {}
  const a = document.createElement('textarea'); a.value = metin; a.style.cssText = 'position:fixed;opacity:0'; document.body.append(a); a.select();
  let tamam = false; try { tamam = document.execCommand('copy'); } catch {} a.remove(); return tamam;
}

export function vitrinKur() {
  const liste = document.querySelector('.vitrinler'); if (!liste) return undefined;
  const maddeler = [...liste.querySelectorAll('.vitrin')]; if (!maddeler.length) return undefined;
  const geri = [];

  // 1) etiket süzgeci
  const etiketler = (m) => [...m.querySelectorAll('.v-etiketler span')].map((s) => s.textContent.trim());
  const hepsi = [...new Set(maddeler.flatMap(etiketler))];
  const bar = document.createElement('div'); bar.className = 'px-suz';
  bar.innerHTML = `<span class="px-suz-baslik"><span class="istem">$</span> grep -l</span><div class="px-suz-chipler" role="group" aria-label="${t('Etikete göre süz', 'Filter by tag')}">${hepsi.map((e) => `<button type="button" data-e="${e}" aria-pressed="false">${e}</button>`).join('')}</div><span class="px-suz-say" role="status" aria-live="polite"></span>`;
  liste.before(bar);
  const say = bar.querySelector('.px-suz-say'); let secili = null;
  const uygula = () => {
    let n = 0;
    maddeler.forEach((m) => { const gizli = secili && !etiketler(m).includes(secili); m.classList.toggle('px-gizli', !!gizli); if (!gizli) { n++; if (secili && !AZ) { m.classList.remove('px-gel'); void m.offsetWidth; m.classList.add('px-gel'); } } });
    bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.e === secili)));
    say.textContent = secili ? t(`${n} / ${maddeler.length} proje`, `${n} / ${maddeler.length} projects`) : t('tümü', 'all');
  };
  const suz = (e) => { const b = e.target.closest('button[data-e]'); if (!b) return; secili = secili === b.dataset.e ? null : b.dataset.e; uygula(); };
  bar.addEventListener('click', suz); uygula();
  geri.push(() => { bar.remove(); maddeler.forEach((m) => m.classList.remove('px-gizli', 'px-gel')); });

  // 2) komuta tıkla: git clone komutunu kopyala
  maddeler.forEach((m) => {
    const komut = m.querySelector('.v-komut'), gh = m.querySelector('a[href*="github.com/SametDuhan/"]'); if (!komut || !gh) return;
    const cl = `git clone ${gh.href}.git`, asil = komut.textContent;
    komut.tabIndex = 0; komut.setAttribute('role', 'button'); komut.setAttribute('aria-label', t(`${asil}: git clone komutunu kopyala`, `${asil}: copy the git clone command`));
    komut.title = t('tıkla: git clone komutunu kopyala', 'click to copy the git clone command');
    let z; const git = async () => { const ok = await panoyaKopyala(cl); komut.textContent = ok ? t('✓ kopyalandı', '✓ copied') : cl; komut.classList.add('px-kopya'); clearTimeout(z); z = setTimeout(() => { komut.textContent = asil; komut.classList.remove('px-kopya'); }, 1800); };
    const tus = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); git(); } };
    komut.addEventListener('click', git); komut.addEventListener('keydown', tus);
    geri.push(() => { clearTimeout(z); komut.removeEventListener('click', git); komut.removeEventListener('keydown', tus); komut.textContent = asil; ['tabindex', 'role', 'aria-label', 'title'].forEach((a) => komut.removeAttribute(a)); komut.classList.remove('px-kopya'); });
  });

  // 3) özellik maddeleri yazılarak gelir; 4) başlıklar çözülür
  if (!AZ) {
    const io = new IntersectionObserver((kayitlar) => kayitlar.forEach((k) => {
      if (!k.isIntersecting) return; io.unobserve(k.target);
      const h2 = k.target.querySelector('.v-govde h2'); if (h2) coz(h2);
      [...k.target.querySelectorAll('.v-bilgiler li')].forEach((li, i) => {
        const metin = li.dataset.pxMetin ??= li.textContent; li.setAttribute('aria-label', metin); li.textContent = '';
        setTimeout(() => { let n = 0; const s = setInterval(() => { li.textContent = metin.slice(0, ++n); if (n >= metin.length) clearInterval(s); }, 14); li._s = s; }, 350 + i * 260);
      });
    }), { threshold: .35 });
    maddeler.forEach((m) => io.observe(m));
    geri.push(() => { io.disconnect(); maddeler.forEach((m) => { const h2 = m.querySelector('.v-govde h2'); if (h2?.dataset.pxMetin) { cancelAnimationFrame(h2._r); h2.textContent = h2.dataset.pxMetin; } m.querySelectorAll('.v-bilgiler li').forEach((li) => { clearInterval(li._s); if (li.dataset.pxMetin) { li.textContent = li.dataset.pxMetin; li.removeAttribute('aria-label'); } }); }); });
  }
  return () => geri.forEach((f) => f());
}
