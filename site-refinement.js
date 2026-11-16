(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const menu = header.querySelector('.menu-button');
  let pending = false;
  let lastY = Math.max(0, window.scrollY);
  let direction = 0;
  let travel = 0;
  const reveal = () => header.classList.remove('is-hidden');
  const update = () => {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const y = Math.max(0, Math.min(window.scrollY, maxY));
    const delta = y - lastY;
    const nextDirection = Math.sign(delta);
    header.classList.toggle('is-scrolled', y > 24);
    if (y <= header.offsetHeight || menu?.getAttribute('aria-expanded') === 'true' || header.matches(':has(:focus-visible)')) {
      reveal();
      travel = 0;
    } else if (nextDirection) {
      travel = nextDirection === direction ? travel + Math.abs(delta) : Math.abs(delta);
      direction = nextDirection;
      if (direction > 0 && travel >= 14) header.classList.add('is-hidden');
      if (direction < 0 && travel >= 6) reveal();
    }
    lastY = y;
    pending = false;
  };
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }, { passive: true });
  header.addEventListener('focusin', reveal);
  menu?.addEventListener('click', reveal);
  window.addEventListener('pageshow', () => { lastY = Math.max(0, window.scrollY); travel = 0; reveal(); update(); });
  window.addEventListener('resize', () => { lastY = Math.max(0, window.scrollY); travel = 0; reveal(); });
  update();
})();
