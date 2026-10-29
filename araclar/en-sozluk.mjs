// İngilizce çeviri sözlüğü: araclar/en-sozluk.txt dosyasını okur.
//   TR ::: EN           bir metnin ya da özniteliğin çevirisi (boşluklar teke inmiş, HTML kaçışları çözülmüş hâliyle)
//   = metin             çevrilmeden aynen kalan metin (özel ad, kod, sayı)
//   H: TR ::: EN        satır içi işaretli (bağlantı, vurgu) bir HTML parçasının çevirisi; kaynakta birebir geçmeli
//   J: TR ::: EN        satır içi betiklerdeki (<script>) birebir metin parçası; tırnaklarıyla birlikte yazılır, EN içinde kaçış gerektiren tırnak kullanılmaz
//   # ...               yorum
import { readFileSync } from 'node:fs';

const satirlar = readFileSync(new URL('./en-sozluk.txt', import.meta.url), 'utf8').split('\n');
export const SOZLUK = {};
export const AYNI = [];
export const HTML_PARCALARI = [];
export const JS_PARCALARI = [];
for (const [i, ham] of satirlar.entries()) {
  const s = ham.trim();
  if (!s || s.startsWith('#')) continue;
  if (s.startsWith('= ')) { AYNI.push(s.slice(2).trim()); continue; }
  const html = s.startsWith('H: ');
  const js = s.startsWith('J: ');
  const [tr, en] = (html || js ? s.slice(3) : s).split(' ::: ').map((x) => x.trim());
  if (!tr || en === undefined || en === '') throw new Error(`en-sozluk.txt satır ${i + 1}: "TR ::: EN" biçimi bekleniyordu`);
  if (js) JS_PARCALARI.push([tr, en]);
  else if (html) HTML_PARCALARI.push([tr, en]);
  else {
    if (Object.hasOwn(SOZLUK, tr) && SOZLUK[tr] !== en) throw new Error(`en-sozluk.txt satır ${i + 1}: aynı metin iki farklı çevrilmiş: ${tr}`);
    SOZLUK[tr] = en;
  }
}
// uzun parçalar önce: kısa bir parça uzun olanın içinde kalmasın
HTML_PARCALARI.sort((a, b) => b[0].length - a[0].length);
JS_PARCALARI.sort((a, b) => b[0].length - a[0].length);
