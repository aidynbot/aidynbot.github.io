// ==========================================================================
// Общий скрипт: мобильное меню, эффект печати, появление карточек при скролле
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Мобильное меню ---- */
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---- Эффект печати в теглайне (только на Home) ---- */
  const typeEl = document.querySelector('[data-typewriter]');
  if (typeEl && !reduceMotion) {
    const fullText = typeEl.textContent.trim();
    typeEl.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    typeEl.after(cursor);

    let i = 0;
    const speed = 28;
    const tick = () => {
      if (i <= fullText.length) {
        typeEl.textContent = fullText.slice(0, i);
        i++;
        setTimeout(tick, speed);
      }
    };
    tick();
  } else if (typeEl) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    typeEl.after(cursor);
  }

  /* ---- Появление карточек при скролле ---- */
  const cards = document.querySelectorAll('.card, .repo-item');
  if (cards.length && !reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach((card) => card.classList.add('is-visible'));
  }
});
