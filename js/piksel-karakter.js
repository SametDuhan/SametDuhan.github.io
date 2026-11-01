// Piksel görünüm: perdeye elinden asılı, bacakları sallanan Claude Code pikseli (js/piksel.js'teki karakterle aynı renkler).
// Ana sayfa panelinin perdesi (varsayılan 72x68 canvas, kendi canvas'ını temizler) ve sayfa geçişi perdesi (büyük tek canvas üzerinde çok karakter) kullanır.
// o: { x, y, u, kol, temizle }: (x, y) karakterin perdeye tutunduğu yerin sol üstü; u piksel birimi; kol karakterin perdeden ne kadar aşağıda
// asıldığı (birim; kol uzar); temizle=false ise canvas silinmez (aynı canvas'a birden çok karakter çizilirken).
export const ASILI_GENISLIK = 72, ASILI_YUKSEKLIK = 68;
export function asiliKarakter(ctx, t, o = {}) {
  const { x = 0, y = 0, u = 4, kol = 0, temizle = true } = o;
  if (temizle) ctx.clearRect(0, 0, ASILI_GENISLIK, ASILI_YUKSEKLIK);
  const kay = Math.round(Math.sin(t * 6));
  const R = (a, b, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + (a + kay) * u, y + (b + kol) * u, w * u, h * u); };
  const G = 'rgb(217,119,87)', K = 'rgb(180,90,62)', Z = 'rgb(32,24,22)', sal = Math.floor(t * 7) % 2;
  ctx.fillStyle = G; ctx.fillRect(x + (14 + kay) * u, y, u, (5 + kol) * u);   // kol perde ucundan ele uzanır (kol uzadıkça uzar)
  R(13, 4, 2, 2, G);                                                           // el
  [4, 6, 9, 11].forEach((lx, i) => R(lx, 12, 1, (i + sal) % 2 ? 3 : 2, G));    // bacaklar sallanır
  R(3, 5, 10, 7, G); R(3, 11, 10, 1, K); R(1, 8, 2, 2, G);
  R(5, 7, 1, 2, Z); R(10, 7, 1, 2, Z);
}
