// 404, piksel görünüm: öneri panelinin altında mini terminal. Komutlar js/piksel-404-komut.js'te çözülür (help, ls, cd, pwd, back, clear); sayfaya gitmek için
// geçici bir bağlantıya tıklanır (böylece sayfa geçişi perdesi de çalışır). "/" tuşu terminale odaklanır. Karakter yok.
import { gercekRotalar } from './piksel-404-oneri.js';
import { komutCoz } from './piksel-404-komut.js';

export function konsolKur() {
  const panel = document.querySelector('.px-404-oneri'); if (!panel) return undefined;
  const kap = document.createElement('div'); kap.className = 'px-404-konsol';
  kap.innerHTML = '<div class="px-404-log" role="log" aria-live="polite"></div><form class="px-404-form"><label class="gizli" for="px-404-giris">Komut</label><span class="istem">samet@sahin:~$</span><input id="px-404-giris" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="help yaz"></form>';
  panel.append(kap);
  const log = kap.querySelector('.px-404-log'), form = kap.querySelector('form'), giris = kap.querySelector('input');
  let rotalar = [], gecmis = [], gi = 0, iptal = false;
  gercekRotalar().then((r) => { if (!iptal) rotalar = r; });
  const satir = (metin, sinif = '') => { const p = document.createElement('p'); if (sinif) p.className = sinif; p.textContent = metin; log.append(p); log.scrollTop = log.scrollHeight; };
  const gec = (rota) => { const a = document.createElement('a'); a.href = rota; document.body.append(a); a.click(); a.remove(); };

  form.addEventListener('submit', (e) => {
    e.preventDefault(); const v = giris.value; giris.value = ''; if (!v.trim()) return;
    gecmis.push(v); gi = gecmis.length; satir(`samet@sahin:~$ ${v}`, 'c');
    const s = komutCoz(v, rotalar, location.pathname);
    if (s.temizle) { log.textContent = ''; return; }
    (s.yaz ?? []).forEach((l) => satir(l));
    if (s.geri) { satir('geri dönülüyor…'); setTimeout(() => (history.length > 1 ? history.back() : gec('/')), 300); }
    if (s.git) setTimeout(() => gec(s.git), 250);
  });
  giris.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && gi > 0) { giris.value = gecmis[--gi]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { giris.value = gecmis[++gi] ?? ''; e.preventDefault(); }
    if (e.key === 'Escape') giris.blur();
  });
  const tus = (e) => { if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest?.('input, textarea, select, [contenteditable]')) { e.preventDefault(); giris.focus(); } };
  addEventListener('keydown', tus);
  return () => { iptal = true; removeEventListener('keydown', tus); kap.remove(); };
}
