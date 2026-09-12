const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

// Representative profile: make it reachable directly from the homepage.
const profileUrl = '/atsushi-sugita/';
if (nav && !nav.querySelector(`a[href="${profileUrl}"]`)) {
  const companyLink = nav.querySelector('a[href="#company"]');
  const profileLink = document.createElement('a');
  profileLink.href = profileUrl;
  profileLink.textContent = '代表プロフィール';
  companyLink?.insertAdjacentElement('afterend', profileLink);
}

const portrait = document.querySelector('.message-portrait');
if (portrait && !portrait.querySelector(`a[href="${profileUrl}"]`)) {
  const photoFrame = portrait.querySelector('.message-photo-frame');
  const caption = portrait.querySelector('figcaption');
  if (photoFrame) {
    const photoLink = document.createElement('a');
    photoLink.href = profileUrl;
    photoLink.setAttribute('aria-label', '代表取締役 杉田 篤のプロフィールを見る');
    photoFrame.parentNode.insertBefore(photoLink, photoFrame);
    photoLink.appendChild(photoFrame);
  }
  if (caption) {
    const captionLink = document.createElement('a');
    captionLink.href = profileUrl;
    captionLink.setAttribute('aria-label', '代表取締役 杉田 篤のプロフィールを見る');
    caption.parentNode.insertBefore(captionLink, caption);
    captionLink.appendChild(caption);
  }
}

const representativeRow = Array.from(document.querySelectorAll('.company-table > div')).find((row) => row.querySelector('dt')?.textContent.trim() === '代表取締役');
if (representativeRow) {
  const dd = representativeRow.querySelector('dd');
  if (dd && !dd.querySelector('a')) {
    const link = document.createElement('a');
    link.href = profileUrl;
    link.textContent = dd.textContent.trim();
    link.setAttribute('aria-label', '杉田 篤のプロフィールを見る');
    dd.textContent = '';
    dd.appendChild(link);
  }
}

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

// Google Analytics: track clicks that express contact intent.
document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || typeof window.gtag !== 'function') return;

  const href = link.getAttribute('href') || '';
  const text = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100);
  const isContact = href.startsWith('mailto:') || href === '#contact' || href.endsWith('#contact');

  if (isContact) {
    window.gtag('event', 'contact_click', {
      link_url: link.href,
      link_text: text,
      page_path: window.location.pathname,
      language: document.documentElement.lang || ''
    });
  }
});
