// Sayfa çizilmeden önce görünümü (retro = kâğıt, modern, piksel), modern temanın koyu/açık seçimini ve ana sayfa panelinin
// küçültülüp küçültülmediğini <html>'e koyar; ilk açılışta piksel (yeni tasarım).
// Adreste ?gorunum=retro|modern|piksel varsa o seçilir ve saklanır (paylaşılan bağlantı için). Seçici: js/gorunum.js.
// Piksel görünümde sayfa geçişi perdesi: önceki sayfa perdeyi indirdiyse (sessionStorage) yeni sayfa perdeli açılır, perde kalkar.
(function () {
  var kok = document.documentElement, gorunum = null, tema = null;
  try {
    var istek = new URLSearchParams(location.search).get('gorunum');
    if (istek === 'retro' || istek === 'modern' || istek === 'piksel') localStorage.setItem('gorunum', istek);
    gorunum = localStorage.getItem('gorunum');
    tema = localStorage.getItem('tema');
    if (localStorage.getItem('gorunumPanel') === 'kapali') kok.setAttribute('data-gorunum-panel', 'kapali');
  } catch (e) {}
  if (!gorunum && istek) gorunum = istek; // depo engelliyse adresteki görünüm yine uygulanır (paylaşılan bağlantı)
  var secili = gorunum === 'retro' || gorunum === 'modern' ? gorunum : 'piksel';
  kok.setAttribute('data-gorunum', secili);
  if (tema === 'acik' || tema === 'koyu') kok.setAttribute('data-tema', tema);
  if (secili === 'piksel') {
    try { if (sessionStorage.getItem('pxGecis') === '1') { sessionStorage.removeItem('pxGecis'); kok.setAttribute('data-px-gecis', ''); } } catch (e) {} // depo engelliyse yalnız perde atlanır
    try {
      var renk = document.querySelector('meta[name="theme-color"]'); if (renk) renk.setAttribute('content', '#191817'); // tarayıcı çubuğu piksel temanın koyu zeminiyle uyumlu
      var ikon = document.querySelector('link[rel="icon"]');
      if (ikon) ikon.setAttribute('href', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' shape-rendering='crispEdges'%3E%3Crect width='32' height='32' fill='%23191817'/%3E%3Cpath fill='%23d97757' d='M8 8h16v12H8z M4 14h4v4H4z M24 14h4v4h-4z M10 20h2v4h-2z M14 20h2v4h-2z M18 20h2v4h-2z M22 20h2v4h-2z'/%3E%3Cpath fill='%23201816' d='M12 12h2v4h-2z M18 12h2v4h-2z'/%3E%3C/svg%3E");
    } catch (e) {}
  }
})();
