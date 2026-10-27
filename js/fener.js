// Nokta ızgarasının üstünde fareyi izleyen fener. Izgaranın kendisi CSS'te (tema.css), JS'siz de görünür.
// gezin: fare yokken fener ekranda yavaşça dolaşır (giriş sayfası).

export function baslatFener({ gezin = false } = {}) {
  const kok = document.documentElement;
  const az = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let fare = false, kare = 0;
  const yaz = (x, y) => { kok.style.setProperty('--fx', `${x}px`); kok.style.setProperty('--fy', `${y}px`); };

  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    fare = true;
    yaz(e.clientX, e.clientY);
  }, { passive: true });
  kok.addEventListener('mouseleave', () => {
    fare = false;
    if (!gezin || az) yaz(-999, -999);
  });

  if (!gezin || az) return;
  const dolas = (t) => {
    if (!fare) yaz(innerWidth * (0.5 + Math.cos(t * 0.00036) * 0.3), innerHeight * (0.5 + Math.sin(t * 0.00048) * 0.3));
    kare = requestAnimationFrame(dolas);
  };
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(kare);
    if (!document.hidden) kare = requestAnimationFrame(dolas);
  });
  kare = requestAnimationFrame(dolas);
}
