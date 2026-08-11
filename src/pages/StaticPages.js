import { storeConfig } from '../data/store-config.js';
import { getProducts } from '../services/productService.js';
import { getFavoriteIds } from '../services/favoritesService.js';
import { ProductGrid } from '../components/ProductCard.js';
import { EmptyState } from '../components/UI.js';
import { updateSEO } from '../utils/seo.js';
import { t } from '../services/i18nService.js';
import { escapeHtml } from '../utils/dom.js';

export function FavoritesPage() {
  updateSEO({ title: t('favorites.title') });
  const favIds = getFavoriteIds();
  const products = getProducts().filter((p) => favIds.includes(p.id));

  return `
    <main id="main-content" class="container page-content">
      <h1 class="page-title">${escapeHtml(t('favorites.title'))}</h1>
      ${products.length ? ProductGrid(products) : EmptyState({ icon: '♥', title: t('favorites.empty'), message: t('favorites.emptyMsg'), ctaText: t('favorites.browse'), ctaHref: '#/shop' })}
    </main>
  `;
}

export function AboutPage() {
  updateSEO({ title: t('about.title'), description: storeConfig.aboutText });

  return `
    <main id="main-content" class="about-page">
      <section class="page-hero">
        <div class="container">
          <h1 class="page-title">${escapeHtml(t('about.title'))} ${escapeHtml(storeConfig.brandName)}</h1>
          <p class="page-subtitle">${escapeHtml(storeConfig.brandTagline)}</p>
        </div>
      </section>
      <section class="section">
        <div class="container content-block">
          <p>${escapeHtml(storeConfig.aboutText)}</p>
          <p class="disclaimer">${escapeHtml(storeConfig.disclaimer)}</p>
        </div>
      </section>
      <section class="section section--dark">
        <div class="container">
          <h2 class="section__title">${escapeHtml(t('about.values'))}</h2>
          <div class="benefits-grid">
            ${['original', 'shipping', 'support', 'returns'].map((key) => `
              <div class="benefit-card">
                <h3 class="benefit-card__title">${escapeHtml(t(`highlights.${key}.title`))}</h3>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </main>
  `;
}

export function ContactPage() {
  updateSEO({ title: t('contact.title') });

  return `
    <main id="main-content" class="contact-page">
      <section class="page-hero">
        <div class="container">
          <h1 class="page-title">${escapeHtml(t('contact.title'))}</h1>
          <p class="page-subtitle">${escapeHtml(t('contact.subtitle'))}</p>
        </div>
      </section>
      <section class="section">
        <div class="container contact-grid">
          <div class="contact-card">
            <h3>${escapeHtml(t('contact.whatsappTitle'))}</h3>
            <p>${escapeHtml(t('contact.whatsappDesc'))}</p>
            <a href="${escapeHtml(storeConfig.social.whatsapp)}" target="_blank" rel="noopener" class="btn btn--primary">${escapeHtml(t('contact.whatsappCta'))}</a>
          </div>
          <div class="contact-card">
            <h3>${escapeHtml(t('contact.phone'))}</h3>
            <p><a href="tel:${escapeHtml(storeConfig.phone)}">${escapeHtml(storeConfig.phone)}</a></p>
          </div>
          <div class="contact-card">
            <h3>${escapeHtml(t('contact.email'))}</h3>
            <p><a href="mailto:${escapeHtml(storeConfig.email)}">${escapeHtml(storeConfig.email)}</a></p>
          </div>
          <div class="contact-card">
            <h3>${escapeHtml(t('contact.hours'))}</h3>
            <p>${escapeHtml(storeConfig.workingHours)}</p>
          </div>
          <div class="contact-card">
            <h3>${escapeHtml(t('contact.delivery'))}</h3>
            <p>${escapeHtml(storeConfig.deliveryInfo)}</p>
          </div>
        </div>
      </section>
    </main>
  `;
}

export function LegalPage(type) {
  const titles = { privacy: t('footer.privacy'), terms: t('footer.terms'), shipping: t('footer.shipping'), returns: t('footer.returns') };
  const title = titles[type] || 'Legal';
  updateSEO({ title });

  return `
    <main id="main-content" class="container page-content legal-page">
      <h1 class="page-title">${escapeHtml(title)}</h1>
      <div class="content-block legal-content">
        <p class="legal-placeholder"><strong>${escapeHtml(t('legal.placeholder'))}</strong></p>
        <h2>${escapeHtml(t('legal.general'))}</h2>
        <p>${escapeHtml(storeConfig.brandName)} — WhatsApp orders.</p>
        <h2>${escapeHtml(t('legal.contact'))}</h2>
        <p>${escapeHtml(storeConfig.email)} | ${escapeHtml(storeConfig.phone)}</p>
      </div>
    </main>
  `;
}

export function NotFoundPage() {
  updateSEO({ title: t('common.pageNotFound') });
  return `
    <main id="main-content" class="container page-content">
      ${EmptyState({ icon: '404', title: t('common.pageNotFound'), message: t('common.pageNotFoundMsg'), ctaText: t('common.backHome'), ctaHref: '#/' })}
    </main>
  `;
}
