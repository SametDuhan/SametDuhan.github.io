// Piksel görünüm: perdeye elinden asılı, bacakları sallanan Claude Code pikseli.
// Ana sayfa panelinin perdesi ve sayfa geçişi perdesi aynı çizimi kullanır (js/piksel.js'teki karakterle aynı renkler).
export const ASILI_GENISLIK = 72, ASILI_YUKSEKLIK = 68;
export function asiliKarakter(ctx, t) {
  const u = 4, kay = Math.round(Math.sin(t * 6));
  ctx.clearRect(0, 0, ASILI_GENISLIK, ASILI_YUKSEKLIK);
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect((x + kay) * u, y * u, w * u, h * u); };
  const G = 'rgb(217,119,87)', K = 'rgb(180,90,62)', Z = 'rgb(32,24,22)', sal = Math.floor(t * 7) % 2;
  R(14, 0, 1, 5, G); R(13, 4, 2, 2, G);                      // kol perde ucuna uzanır
  [4, 6, 9, 11].forEach((lx, i) => R(lx, 12, 1, (i + sal) % 2 ? 3 : 2, G)); // bacaklar sallanır
  R(3, 5, 10, 7, G); R(3, 11, 10, 1, K); R(1, 8, 2, 2, G);
  R(5, 7, 1, 2, Z); R(10, 7, 1, 2, Z);
}
