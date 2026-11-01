// 404, piksel görünüm: mini terminal komutlarının çözümü (saf işlev, DOM yok; Node'da test edilir). Sonuç bir eylemdir:
// { yaz: [satırlar] } | { git: rota, yaz?: [...] } | { temizle: true } | { geri: true }
import { oneriler, sade, rotaBasligi } from './piksel-404-oneri.js';

const YARDIM = ['komutlar:', '  ls [yol]      sitedeki sayfaları listele', '  cd <sayfa>    sayfaya git (ör. cd projeler, cd slaytlar/claude-code-hook)', '  cd ..         ana sayfaya git', '  pwd           şu anki (yanlış) adres', '  back          geldiğin sayfaya dön', '  clear         ekranı temizle'];

// "cd projeler", "cd /projeler/", "cd Projeler/SkyTrack" → tam eşleşen gerçek rota; yoksa undefined
export function rotaBul(arg, rotalar) {
  const temiz = sade(arg).replace(/^\.?\/+/, '').replace(/\/+$/, '');
  if (!temiz) return '/';
  return rotalar.find((r) => sade(r).replace(/^\/+|\/+$/g, '') === temiz);
}

export function komutCoz(girdi, rotalar, yol) {
  const parca = String(girdi).trim().split(/\s+/).filter(Boolean);
  if (!parca.length) return { yaz: [] };
  const [komut, ...arg] = parca, ad = komut.toLowerCase(), hedef = arg.join(' ');
  if (ad === 'help' || ad === 'yardim' || ad === '?') return { yaz: YARDIM };
  if (ad === 'clear' || ad === 'cls') return { temizle: true };
  if (ad === 'pwd') return { yaz: [yol] };
  if (ad === 'back' || ad === 'geri') return { geri: true };
  if (ad === 'ls' || ad === 'dir') {
    const on = hedef ? sade(hedef).replace(/^\/+|\/+$/g, '') : '';
    const liste = rotalar.filter((r) => r !== '/' && sade(r).replace(/^\/+|\/+$/g, '').startsWith(on));
    return { yaz: liste.length ? liste.map((r) => `${r.split('/').filter(Boolean).length < 2 ? 'drwxr-xr-x' : '-rw-r--r--'}  ${r.padEnd(34)}${rotaBasligi(r)}`) : [`ls: '${hedef}' diye bir dizin yok`] };
  }
  if (ad === 'cd' || ad === 'open') {
    if (!hedef || hedef === '..' || hedef === '~' || hedef === '/' || hedef === '../..') return { git: '/', yaz: ['/ açılıyor…'] };
    const rota = rotaBul(hedef, rotalar);
    if (rota) return { git: rota, yaz: [`${rota} açılıyor…`] };
    const yakin = oneriler(hedef, rotalar, 3, .5);
    return { yaz: [`bash: ${ad}: ${hedef}: Böyle bir dosya ya da dizin yok`, ...(yakin.length ? [`bunu mu demek istedin: ${yakin.map((x) => x.rota).join('  ')}`] : ['ls yazarak sayfaları görebilirsin'])] };
  }
  return { yaz: [`bash: ${komut}: komut bulunamadı (help yaz)`] };
}
