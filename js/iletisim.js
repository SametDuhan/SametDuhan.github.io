// Mail adresi kaynakta düz metin durmaz; sayfa açılınca parçalardan kurulur.

export function mailAdresi(kullanici, alan) {
  return `${kullanici}@${alan}`;
}

export function bagla(el) {
  const adres = mailAdresi(el.dataset.k, el.dataset.a);
  el.href = `mailto:${adres}`;
  el.textContent = adres;
}
