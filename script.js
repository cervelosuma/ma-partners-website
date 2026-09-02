const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

button?.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    button?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  let ticking = false;
  const updateScroll = () => {
    const y = window.scrollY;
    const root = document.documentElement.style;
    root.setProperty('--scroll-grid', `${y * -0.035}px`);
    root.setProperty('--scroll-glow-a', `${y * -0.09}px`);
    root.setProperty('--scroll-glow-b', `${y * -0.045}px`);
    root.setProperty('--scroll-hero-grid', `${y * 0.06}px`);
    root.setProperty('--scroll-orb-a', `${y * 0.15}px`);
    root.setProperty('--scroll-orb-b', `${y * -0.08}px`);
    root.setProperty('--scroll-rotate', `${y * 0.01}deg`);
    root.setProperty('--scroll-track', `${y * -0.055}px`);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });
  updateScroll();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
} else {
  document.querySelectorAll('.reveal').forEach((section) => section.classList.add('in-view'));
}
