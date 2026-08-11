const REVEAL_SELECTORS = [
  '.hero__copy',
  '.highlight-card',
  '.section__header',
  '.section__header--bestsellers',
  '.product-card',
  '.category-card',
  '.page-header',
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
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  document.querySelectorAll(STAGGER_PARENTS).forEach((parent) => {
    const isListing = Boolean(parent.closest('.shop-page, .categories-page'));
    const step = isListing && isMobile ? 0.06 : 0.16;
    const max = isListing && isMobile ? 0.36 : 0.96;

    Array.from(parent.children).forEach((child, index) => {
      const delay = `${Math.min(index * step, max)}s`;
      if (child.classList.contains('reveal-listing') || child.classList.contains('reveal')) {
        child.style.setProperty('--reveal-delay', delay);
      }
    });
  });
}

function revealListingCards() {
  document.querySelectorAll('.reveal-listing').forEach((el) => {
    el.classList.add('reveal-listing--play');
  });
}

function scheduleListingReveal() {
  if (!document.querySelector('.shop-page, .categories-page')) return;

  const run = () => {
    void document.getElementById('main-content')?.offsetHeight;
    revealListingCards();
  };

  requestAnimationFrame(() => requestAnimationFrame(run));
  setTimeout(run, 80);
  setTimeout(run, 320);
}

function setupRevealElements() {
  const seen = new Set();

  REVEAL_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);

      if (el.closest('.shop-page') && el.classList.contains('product-card')) {
        el.classList.remove('reveal', 'reveal--visible', 'reveal-listing');
        el.classList.add('reveal-listing');
        return;
      }

      if (el.closest('.categories-page') && el.classList.contains('category-card')) {
        el.classList.remove('reveal', 'reveal--visible', 'reveal-listing');
        el.classList.add('reveal-listing');
        return;
      }

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

function revealElementsInViewport() {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  document.querySelectorAll('.reveal:not(.reveal--visible)').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.94 && rect.bottom > 0) {
      el.classList.add('reveal--visible');
      revealObserver?.unobserve(el);
    }
  });
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
      threshold: 0.01,
      rootMargin: '0px 0px 10% 0px',
    }
  );

  document.querySelectorAll('.reveal:not(.reveal--visible)').forEach((el) => {
    revealObserver.observe(el);
  });

  const revealAboveFold = () => {
    document.querySelectorAll('.hero .reveal, .page-header.reveal').forEach((el) => {
      el.classList.add('reveal--visible');
    });
    revealElementsInViewport();
  };

  requestAnimationFrame(revealAboveFold);
  setTimeout(revealAboveFold, 80);
  setTimeout(revealAboveFold, 320);
  setTimeout(revealAboveFold, 720);
}

export function initPageAnimations({ languageSwitch = false } = {}) {
  if (prefersReducedMotion()) {
    document.body.classList.add('motion-reduced');
    markVisibleImmediately(REVEAL_SELECTORS.join(', '));
    document.querySelectorAll('.reveal-listing').forEach((el) => {
      el.classList.add('reveal-listing--play');
    });
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
    document.querySelectorAll('.reveal-listing').forEach((el) => {
      el.classList.add('reveal-listing--play');
    });
    return;
  }

  observeRevealElements();
  scheduleListingReveal();
}

export function destroyPageAnimations() {
  revealObserver?.disconnect();
  revealObserver = null;
}
