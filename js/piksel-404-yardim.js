// 404 parçalarının ortak yardımcısı.
// Parçalar ortak bir kapsayıcıya girer (sol sahne, sağ öneriler); ilk gelen kapsayıcıyı kurar, son giden kaldırır.
export function kapsayici() {
  let k = document.querySelector('.px-404');
  if (!k) { const baslik = document.querySelector('.sayfa-basi'); if (!baslik) return null; k = document.createElement('div'); k.className = 'px-404'; baslik.after(k); }
  return k;
}
export function kapsayiciTemizle() { const k = document.querySelector('.px-404'); if (k && !k.children.length) k.remove(); }
