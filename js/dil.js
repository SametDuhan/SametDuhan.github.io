// Sayfanın dili (<html lang>): Türkçe sayfalar kökte, İngilizce sürümler /en/ altında. Betik metinleri t(tr, en) ile seçilir.
export const EN = typeof document !== 'undefined' && document.documentElement.lang === 'en';
export const t = (tr, en) => (EN ? en : tr);
