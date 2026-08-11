import { storeConfig } from '../data/store-config.js';
import { getBestSellers } from '../services/productService.js';
import { ProductGrid } from '../components/ProductCard.js';
import { updateSEO } from '../utils/seo.js';
import { t } from '../services/i18nService.js';
import { escapeHtml } from '../utils/dom.js';

const highlightConfig = [
  { key: 'original', icon: 'shield' },
  { key: 'shipping', icon: 'truck' },
  { key: 'support', icon: 'headset' },
  { key: 'returns', icon: 'returns' },
];

const highlightIcons = {
  shield: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  truck: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  headset: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3z"/><path d="M21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3z"/><path d="M4 11V7a8 8 0 0 1 16 0v4"/></svg>',
  returns: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
};

export function HomePage() {
  updateSEO({ title: storeConfig.brandName, description: storeConfig.seo.defaultDescription });

  const bestSellers = getBestSellers(4);

  return `
    <main id="main-content" class="page-home">
      <section class="hero hero--sh" aria-label="${escapeHtml(t('nav.home'))}">
        <div class="hero__media" aria-hidden="true">
          <img
            src="/assets/hero/hero-athlete-modern.png"
            alt=""
            class="hero__media-img"
            width="1376"
            height="768"
            loading="eager"
          />
          <div class="hero__media-overlay"></div>
        </div>

        <div class="container hero__layout">
          <div class="hero__panel">
            <div class="hero__logo">
              <img
                src="/assets/logo.png"
                alt="${escapeHtml(storeConfig.brandName)}"
                class="hero__logo-img"
                width="304"
                height="320"
                loading="eager"
              />
            </div>
            <div class="hero__copy">
              <h1 class="hero__headline">
                <img
                  src="/assets/hero/fuel-your-potential.png"
                  alt="FUEL YOUR POTENTIAL"
                  class="hero__headline-img"
                  width="2200"
                  height="1061"
                  loading="eager"
                />
              </h1>
              <div class="hero__actions">
                <a href="#/shop" class="hero__cta hero__cta--primary">${escapeHtml(t('hero.shopNow'))}</a>
                <a href="#/shop" class="hero__cta hero__cta--ghost">${escapeHtml(t('hero.browse'))}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="highlights">
        <div class="container highlights__grid">
          ${highlightConfig.map((h) => `
            <div class="highlight-card">
              <span class="highlight-card__icon">${highlightIcons[h.icon]}</span>
              <div class="highlight-card__text">
                <strong>${escapeHtml(t(`highlights.${h.key}.title`))}</strong>
                <span>${escapeHtml(t(`highlights.${h.key}.sub`))}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="section section--bestsellers">
        <div class="container">
          <div class="section__header section__header--bestsellers">
            <h2 class="section__title section__title--underline">${escapeHtml(t('sections.bestSellers'))}</h2>
            <a href="#/shop?sort=best-selling" class="section__link section__link--corner">${escapeHtml(t('sections.viewAll'))}</a>
          </div>
          ${ProductGrid(bestSellers, { showQuickView: false, variant: 'home' })}
        </div>
      </section>
    </main>
  `;
}
