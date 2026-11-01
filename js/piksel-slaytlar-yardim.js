// Slaytlar parçalarının ortak yardımcısı.
// Kartlar ekrana JS ile geldiği için: kartlar varsa hemen, yoksa gelince çalıştır (ortak yardımcı).
export function kartlariBekle(kutu, calis) {
  if (kutu.querySelector('.deste-karti')) return calis();
  let temizle = () => {};
  const mo = new MutationObserver(() => { if (kutu.querySelector('.deste-karti')) { mo.disconnect(); temizle = calis() ?? (() => {}); } });
  mo.observe(kutu, { childList: true });
  return () => { mo.disconnect(); temizle(); };
}
