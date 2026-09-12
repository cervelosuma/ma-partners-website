const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

// Representative profile: route each language homepage to its matching profile page.
const pageLang = document.documentElement.lang || 'ja';
const profileConfig = pageLang.startsWith('ko')
  ? {
      url: '/ko/atsushi-sugita/',
      navLabel: '대표 프로필',
      rowLabels: ['대표이사'],
      ariaLabel: '스기타 아츠시 대표이사 프로필 보기'
    }
  : pageLang.startsWith('zh')
    ? {
        url: '/zh/atsushi-sugita/',
        navLabel: '代表简介',
        rowLabels: ['代表董事'],
        ariaLabel: '查看杉田笃代表董事简介'
      }
    : pageLang.startsWith('en')
      ? {
          url: '/en/atsushi-sugita/',
          navLabel: 'CEO Profile',
          rowLabels: ['CEO'],
          ariaLabel: 'View Atsushi Sugita profile'
        }
      : {
          url: '/atsushi-sugita/',
          navLabel: '代表プロフィール',
          rowLabels: ['代表取締役'],
          ariaLabel: '代表取締役 杉田 篤のプロフィールを見る'
        };

const profileUrl = profileConfig.url;

if (nav && !nav.querySelector(`a[href="${profileUrl}"]`)) {
  const companyLink = nav.querySelector('a[href="#company"]');
  const profileLink = document.createElement('a');
  profileLink.href = profileUrl;
  profileLink.textContent = profileConfig.navLabel;
  companyLink?.insertAdjacentElement('afterend', profileLink);
}

const portrait = document.querySelector('.message-portrait');
if (portrait) {
  if (portrait.tagName === 'A') {
    portrait.href = profileUrl;
    portrait.setAttribute('aria-label', profileConfig.ariaLabel);
  } else {
    const photoFrame = portrait.querySelector('.message-photo-frame');
    const caption = portrait.querySelector('figcaption');

    if (photoFrame && !photoFrame.closest('a')) {
      const photoLink = document.createElement('a');
      photoLink.href = profileUrl;
      photoLink.setAttribute('aria-label', profileConfig.ariaLabel);
      photoFrame.parentNode.insertBefore(photoLink, photoFrame);
      photoLink.appendChild(photoFrame);
    } else if (photoFrame?.closest('a')) {
      photoFrame.closest('a').href = profileUrl;
    }

    if (caption && !caption.closest('a')) {
      const captionLink = document.createElement('a');
      captionLink.href = profileUrl;
      captionLink.setAttribute('aria-label', profileConfig.ariaLabel);
      caption.parentNode.insertBefore(captionLink, caption);
      captionLink.appendChild(caption);
    } else if (caption?.closest('a')) {
      caption.closest('a').href = profileUrl;
    }
  }
}

const representativeRow = Array.from(document.querySelectorAll('.company-table > div')).find((row) => {
  const label = row.querySelector('dt')?.textContent.trim();
  return profileConfig.rowLabels.includes(label);
});

if (representativeRow) {
  const dd = representativeRow.querySelector('dd');
  if (dd) {
    const existingLink = dd.querySelector('a');
    if (existingLink) {
      existingLink.href = profileUrl;
      existingLink.setAttribute('aria-label', profileConfig.ariaLabel);
    } else {
      const link = document.createElement('a');
      link.href = profileUrl;
      link.textContent = dd.textContent.trim();
      link.setAttribute('aria-label', profileConfig.ariaLabel);
      dd.textContent = '';
      dd.appendChild(link);
    }
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
