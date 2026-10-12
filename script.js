document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  navigation?.classList.toggle('is-open', !open);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', (event) => {
  if (navigation?.classList.contains('is-open') && !navigation.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 5, 4) * 65}ms`;
    observer.observe(item);
  });
  window.setTimeout(() => revealItems.forEach((item) => item.classList.add('is-visible')), 3800);
}

const heroStage = document.querySelector('.hero-stage');
const heroPhoto = document.querySelector('.hero-photo');
if (heroStage && heroPhoto && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  heroStage.addEventListener('pointermove', (event) => {
    const bounds = heroStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroPhoto.style.translate = `${-x * 6}px ${-y * 5}px`;
  }, { passive: true });
  heroStage.addEventListener('pointerleave', () => { heroPhoto.style.translate = '0 0'; }, { passive: true });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
