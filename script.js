const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

// Keep the Japanese strengths headline on one line on desktop.
if (window.location.pathname === '/' && window.innerWidth > 800) {
  const strengthsHeading = document.querySelector('#strengths .dark-heading h2');
  if (strengthsHeading) {
    strengthsHeading.style.whiteSpace = 'nowrap';
    strengthsHeading.style.fontSize = 'clamp(34px, 4.1vw, 54px)';
    strengthsHeading.style.lineHeight = '1.15';
    strengthsHeading.style.letterSpacing = '-.04em';
  }
}

// Representative profile: route each language homepage to its matching profile page.
const path = window.location.pathname;
const pageLang = path.startsWith('/ko/') ? 'ko' : path.startsWith('/zh/') ? 'zh-Hans' : path.startsWith('/en/') ? 'en' : (document.documentElement.lang || 'ja');
const profileConfig = pageLang.startsWith('ko') ? {url:'/ko/atsushi-sugita/',navLabel:'대표 프로필',rowLabels:['대표이사'],ariaLabel:'스기타 아츠시 대표이사 프로필 보기'} : pageLang.startsWith('zh') ? {url:'/zh/atsushi-sugita/',navLabel:'代表简介',rowLabels:['代表董事'],ariaLabel:'查看杉田笃代表董事简介'} : pageLang.startsWith('en') ? {url:'/en/atsushi-sugita/',navLabel:'CEO Profile',rowLabels:['CEO'],ariaLabel:'View Atsushi Sugita profile'} : {url:'/atsushi-sugita/',navLabel:'代表プロフィール',rowLabels:['代表取締役'],ariaLabel:'代表取締役 杉田 篤のプロフィールを見る'};
const profileUrl = profileConfig.url;
if (nav) {
  const existingProfileLink = Array.from(nav.querySelectorAll('a')).find((link) => { const href=link.getAttribute('href')||''; const text=(link.textContent||'').trim(); return href.includes('atsushi-sugita')||text==='代表プロフィール'; });
  if (existingProfileLink) { existingProfileLink.href=profileUrl; existingProfileLink.textContent=profileConfig.navLabel; existingProfileLink.setAttribute('aria-label',profileConfig.ariaLabel); }
  else { const companyLink=nav.querySelector('a[href="#company"]'); const profileLink=document.createElement('a'); profileLink.href=profileUrl; profileLink.textContent=profileConfig.navLabel; profileLink.setAttribute('aria-label',profileConfig.ariaLabel); companyLink?.insertAdjacentElement('afterend',profileLink); }
}
const portrait=document.querySelector('.message-portrait');
if(portrait){if(portrait.tagName==='A'){portrait.href=profileUrl;portrait.setAttribute('aria-label',profileConfig.ariaLabel);}else{const photoFrame=portrait.querySelector('.message-photo-frame');const caption=portrait.querySelector('figcaption');if(photoFrame&&!photoFrame.closest('a')){const a=document.createElement('a');a.href=profileUrl;a.setAttribute('aria-label',profileConfig.ariaLabel);photoFrame.parentNode.insertBefore(a,photoFrame);a.appendChild(photoFrame);}else if(photoFrame?.closest('a')){photoFrame.closest('a').href=profileUrl;photoFrame.closest('a').setAttribute('aria-label',profileConfig.ariaLabel);}if(caption&&!caption.closest('a')){const a=document.createElement('a');a.href=profileUrl;a.setAttribute('aria-label',profileConfig.ariaLabel);caption.parentNode.insertBefore(a,caption);a.appendChild(caption);}else if(caption?.closest('a')){caption.closest('a').href=profileUrl;caption.closest('a').setAttribute('aria-label',profileConfig.ariaLabel);}}}
const representativeRow=Array.from(document.querySelectorAll('.company-table > div')).find((row)=>profileConfig.rowLabels.includes(row.querySelector('dt')?.textContent.trim()));
if(representativeRow){const dd=representativeRow.querySelector('dd');if(dd){const existingLink=dd.querySelector('a');if(existingLink){existingLink.href=profileUrl;existingLink.setAttribute('aria-label',profileConfig.ariaLabel);}else{const link=document.createElement('a');link.href=profileUrl;link.textContent=dd.textContent.trim();link.setAttribute('aria-label',profileConfig.ariaLabel);dd.textContent='';dd.appendChild(link);}}}
button?.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open);document.body.style.overflow=open?'':'hidden';});
nav?.querySelectorAll('a').forEach((link)=>{link.addEventListener('click',()=>{button?.setAttribute('aria-expanded','false');nav.classList.remove('open');document.body.style.overflow='';});});
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion){let ticking=false;const updateScroll=()=>{const y=window.scrollY;const root=document.documentElement.style;root.setProperty('--scroll-grid',`${y*-.035}px`);root.setProperty('--scroll-glow-a',`${y*-.09}px`);root.setProperty('--scroll-glow-b',`${y*-.045}px`);root.setProperty('--scroll-hero-grid',`${y*.06}px`);root.setProperty('--scroll-orb-a',`${y*.15}px`);root.setProperty('--scroll-orb-b',`${y*-.08}px`);root.setProperty('--scroll-rotate',`${y*.01}deg`);root.setProperty('--scroll-track',`${y*-.055}px`);ticking=false;};window.addEventListener('scroll',()=>{if(!ticking){window.requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});updateScroll();const observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});document.querySelectorAll('.reveal').forEach((section)=>observer.observe(section));}else{document.querySelectorAll('.reveal').forEach((section)=>section.classList.add('in-view'));}
document.addEventListener('click',(event)=>{const link=event.target.closest('a');if(!link||typeof window.gtag!=='function')return;const href=link.getAttribute('href')||'';const text=(link.textContent||'').trim().replace(/\s+/g,' ').slice(0,100);const isContact=href.startsWith('mailto:')||href==='#contact'||href.endsWith('#contact');if(isContact){window.gtag('event','contact_click',{link_url:link.href,link_text:text,page_path:window.location.pathname,language:document.documentElement.lang||''});}});
