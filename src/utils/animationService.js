const REVEAL_SELECTORS = [
  '.hero__copy',
  '.highlight-card',
  '.section__header',
  '.section__header--bestsellers',
  '.product-card',
  '.category-card',
  '.page-header',
  '.shop-layout',
  '.cart-layout',
  '.checkout-layout',
  '.cart-item',
  '.footer__col',
  '.content-block',
  '.contact-card',
  '.benefit-card',
  '.product-detail',
  '.order-confirm__header',
  '.order-confirm__section',
  '.empty-state',
];

const STAGGER_PARENTS = '.product-grid, .category-grid, .highlights__grid, .footer__grid';

let revealObserver;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function markVisibleImmediately(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add('reveal', 'reveal--visible');
  });
}

function applyStaggerDelays() {
  document.querySelectorAll(STAGGER_PARENTS).forEach((parent) => {
    Array.from(parent.children).forEach((child, index) => {
      if (!child.classList.contains('reveal')) return;
      child.style.setProperty('--reveal-delay', `${Math.min(index * 0.16, 0.96)}s`);
    });
  });
}

function setupRevealElements() {
  const seen = new Set();

  REVEAL_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.remove('reveal--visible');
      el.classList.add('reveal');
    });
  });

  document.querySelectorAll('.hero__logo').forEach((el) => {
    el.classList.add('reveal', 'reveal--scale');
  });

  document.querySelectorAll('.hero__copy, .hero__headline').forEach((el) => {
    el.classList.add('reveal', 'reveal--slide-end');
  });

  applyStaggerDelays();
}

function observeRevealElements() {
  if (revealObserver) revealObserver.disconnect();

  if (prefersReducedMotion()) {
    markVisibleImmediately('.reveal');
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -2% 0px',
    }
  );

  document.querySelectorAll('.reveal:not(.reveal--visible)').forEach((el) => {
    revealObserver.observe(el);
  });

  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal, .page-header.reveal').forEach((el) => {
      el.classList.add('reveal--visible');
    });
  });
}

export function initPageAnimations({ languageSwitch = false } = {}) {
  if (prefersReducedMotion()) {
    document.body.classList.add('motion-reduced');
    markVisibleImmediately(REVEAL_SELECTORS.join(', '));
    return;
  }

  document.body.classList.add('page-is-ready');

  const main = document.getElementById('main-content');
  if (main && !languageSwitch) {
    main.classList.remove('page-enter');
    void main.offsetWidth;
    main.classList.add('page-enter');
  }

  if (!languageSwitch) {
    document.querySelector('.topbar')?.classList.add('chrome-enter');
    document.querySelector('.navbar')?.classList.add('chrome-enter');
  }

  setupRevealElements();

  if (languageSwitch) {
    markVisibleImmediately('.reveal');
    return;
  }

  observeRevealElements();
}

export function destroyPageAnimations() {
  revealObserver?.disconnect();
  revealObserver = null;
}
