/* ============================================================
   HANNES BRUNE — Main JavaScript
   ============================================================ */

/* ---- Scroll: Nav shrink ---- */
const nav = document.querySelector('.nav');
function onScroll() {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Mobile Nav ---- */
const burgerBtn  = document.getElementById('burgerBtn');
const mobileNav  = document.getElementById('mobileNav');
function toggleMobile() {
  const open = mobileNav.classList.toggle('open');
  burgerBtn.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
if (burgerBtn) burgerBtn.addEventListener('click', toggleMobile);
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      burgerBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Active Nav Link ---- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ---- Scroll Reveal (IntersectionObserver) ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ---- Page Transition ---- */
const veil = document.querySelector('.page-veil');
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
  if (href.endsWith('.html') || href === '' || href === '/') {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (veil) {
        veil.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 480);
      } else {
        window.location.href = href;
      }
    });
  }
});

/* ---- Parallax on Hero ghost text ---- */
const ghostText = document.querySelector('.hero__ghost-text');
if (ghostText) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    ghostText.style.transform = `translateY(calc(-50% + ${y * 0.12}px))`;
  }, { passive: true });
}

/* ---- Counter Animation ---- */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-counter]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));
}

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn--gold');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Nachricht gesendet ✓';
    btn.style.background = 'var(--gold-dim)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3500);
  });
}

/* ---- Keyboard: close mobile nav with ESC ---- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
    toggleMobile();
  }
});
