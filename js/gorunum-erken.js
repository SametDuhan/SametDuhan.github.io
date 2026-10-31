// Sayfa çizilmeden önce görünümü (retro = kâğıt, modern), modern temanın koyu/açık seçimini ve ana sayfa panelinin
// küçültülüp küçültülmediğini <html>'e koyar; ilk açılışta modern.
// Adreste ?gorunum=retro|modern varsa o seçilir ve saklanır (paylaşılan bağlantı için). Seçici: js/gorunum.js.
(function () {
  var kok = document.documentElement, gorunum = null, tema = null;
  try {
    var istek = new URLSearchParams(location.search).get('gorunum');
    if (istek === 'retro' || istek === 'modern') localStorage.setItem('gorunum', istek);
    gorunum = localStorage.getItem('gorunum');
    tema = localStorage.getItem('tema');
    if (localStorage.getItem('gorunumPanel') === 'kapali') kok.setAttribute('data-gorunum-panel', 'kapali');
  } catch (e) {}
  kok.setAttribute('data-gorunum', gorunum === 'retro' ? 'retro' : 'modern');
  if (tema === 'acik' || tema === 'koyu') kok.setAttribute('data-tema', tema);
})();
