import {
  getProductBySlug,
  getRelatedProducts,
  isInStock,
  getDiscountPercent,
  getCategoryById,
} from '../services/productService.js';
import { addRecentlyViewed } from '../services/recentlyViewedService.js';
import { isFavorite } from '../services/favoritesService.js';
import { ProductGrid } from '../components/ProductCard.js';
import { Breadcrumbs, StarRating, Badge, QuantitySelector, EmptyState } from '../components/UI.js';
import { formatPrice } from '../utils/format.js';
import { updateSEO } from '../utils/seo.js';
import { escapeHtml } from '../utils/dom.js';
import { t, getLocalizedCategory } from '../services/i18nService.js';
import { track, Events } from '../services/analyticsService.js';

export function ProductPage(slug) {
  const product = getProductBySlug(slug);

  if (!product) {
    updateSEO({ title: 'Product Not Found' });
    return `
      <main id="main-content" class="container page-content">
        ${EmptyState({ icon: '❌', title: t('product.notFound'), message: t('product.notFoundMsg'), ctaText: t('common.backShop'), ctaHref: '#/shop' })}
      </main>
    `;
  }

  addRecentlyViewed(product.id);
  track(Events.PRODUCT_VIEWED, { id: product.id, name: product.name });

  const category = getCategoryById(product.category);
  const inStock = isInStock(product);
  const discount = getDiscountPercent(product);
  const fav = isFavorite(product.id);
  const related = getRelatedProducts(product);

  updateSEO({
    title: product.name,
    description: product.shortDescription,
    image: product.thumbnail,
  });

  const gallery = product.images
    .map(
      (img, i) =>
        `<button type="button" class="gallery__thumb ${i === 0 ? 'gallery__thumb--active' : ''}" data-gallery-thumb="${i}"><img src="${escapeHtml(img)}" alt="${escapeHtml(product.name)} view ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" onerror="this.src='/assets/products/placeholder.svg'" /></button>`
    )
    .join('');

  const flavorOptions =
    product.flavors?.length > 0
      ? `
      <div class="product-option">
        <label for="flavor-select" class="product-option__label">${escapeHtml(t('product.flavor'))}</label>
        <select id="flavor-select" class="filter-select" data-product-flavor>
          ${product.flavors.map((f) => `<option value="${escapeHtml(f)}">${escapeHtml(f)}</option>`).join('')}
        </select>
      </div>`
      : '';

  const tabs = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'benefits', label: 'Benefits', content: product.benefits?.map((b) => `• ${b}`).join('\n') || 'N/A' },
    { id: 'ingredients', label: 'Ingredients', content: product.ingredients?.join(', ') || 'N/A' },
    { id: 'usage', label: 'Usage', content: product.usage || 'N/A' },
    { id: 'warnings', label: 'Warnings', content: product.warnings?.map((w) => `• ${w}`).join('\n') || 'N/A' },
  ];

  const tabButtons = tabs
    .map(
      (t, i) =>
        `<button type="button" class="product-tab ${i === 0 ? 'product-tab--active' : ''}" data-tab="${t.id}" role="tab">${escapeHtml(t.label)}</button>`
    )
    .join('');

  const tabPanels = tabs
    .map(
      (t, i) =>
        `<div class="product-tab-panel ${i === 0 ? 'product-tab-panel--active' : ''}" data-tab-panel="${t.id}" role="tabpanel">${escapeHtml(t.content).replace(/\n/g, '<br>')}</div>`
    )
    .join('');

  return `
    <main id="main-content" class="product-page" data-product-slug="${escapeHtml(product.slug)}">
      <div class="container">
        ${Breadcrumbs([
          { label: 'Home', href: '#/' },
          { label: 'Shop', href: '#/shop' },
          { label: category?.name || 'Products', href: `#/shop?category=${product.category}` },
          { label: product.name, href: `#/product/${product.slug}` },
        ])}

        <div class="product-detail">
          <div class="product-detail__gallery">
            <div class="gallery__main">
              <img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" class="gallery__main-img" data-gallery-main onerror="this.src='/assets/products/placeholder.svg'" />
            </div>
            <div class="gallery__thumbs">${gallery}</div>
          </div>

          <div class="product-detail__info">
            <span class="product-detail__category">${escapeHtml(category?.name || '')}</span>
            <h1 class="product-detail__title">${escapeHtml(product.name)}</h1>
            ${StarRating({ rating: product.rating, count: product.reviewCount })}
            
            <div class="product-detail__price-row">
              <span class="product-detail__price">${formatPrice(product.price)}</span>
              ${product.oldPrice ? `<span class="product-detail__old-price">${formatPrice(product.oldPrice)}</span>` : ''}
              ${discount > 0 ? Badge({ text: `Save ${discount}%`, variant: 'sale' }) : ''}
            </div>

            <p class="product-detail__stock ${inStock ? 'in-stock' : 'out-of-stock'}">
              ${inStock ? `✓ ${t('product.inStock')} (${product.stock})` : `✗ ${t('product.outOfStock')}`}
            </p>

            <p class="product-detail__short-desc">${escapeHtml(product.shortDescription)}</p>

            ${product.weight ? `<p class="product-detail__meta"><strong>Weight:</strong> ${escapeHtml(product.weight)}</p>` : ''}

            ${flavorOptions}

            <div class="product-detail__qty">
              <label class="product-option__label">${escapeHtml(t('product.quantity'))}</label>
              ${QuantitySelector({ value: 1, max: product.stock, id: 'product-qty' })}
            </div>

            <div class="product-detail__actions">
              ${
                inStock
                  ? `<button type="button" class="btn btn--primary btn--lg" data-action="add-to-cart" data-id="${escapeHtml(product.id)}" data-from-detail>${escapeHtml(t('product.addToCart'))}</button>
                     <button type="button" class="btn btn--outline btn--lg" data-action="buy-now" data-id="${escapeHtml(product.id)}">${escapeHtml(t('product.buyNow'))}</button>`
                  : `<button type="button" class="btn btn--ghost btn--lg" disabled>${escapeHtml(t('product.outOfStock'))}</button>`
              }
              <button type="button" class="btn btn--ghost product-detail__fav ${fav ? 'product-detail__fav--active' : ''}" data-action="toggle-fav" data-id="${escapeHtml(product.id)}" aria-label="Toggle favorite">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="product-tabs">
          <div class="product-tabs__nav" role="tablist">${tabButtons}</div>
          <div class="product-tabs__panels">${tabPanels}</div>
        </div>

        ${
          related.length
            ? `<section class="section"><h2 class="section__title">Related Products</h2>${ProductGrid(related)}</section>`
            : ''
        }
      </div>
    </main>
  `;
}

export function initProductPage() {
  const page = document.querySelector('.product-page');
  if (!page) return;

  // Gallery
  page.querySelectorAll('[data-gallery-thumb]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const img = thumb.querySelector('img');
      const main = page.querySelector('[data-gallery-main]');
      if (img && main) main.src = img.src;
      page.querySelectorAll('[data-gallery-thumb]').forEach((t) => t.classList.remove('gallery__thumb--active'));
      thumb.classList.add('gallery__thumb--active');
    });
  });

  // Tabs
  page.querySelectorAll('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      page.querySelectorAll('[data-tab]').forEach((t) => t.classList.remove('product-tab--active'));
      page.querySelectorAll('[data-tab-panel]').forEach((p) => p.classList.remove('product-tab-panel--active'));
      tab.classList.add('product-tab--active');
      page.querySelector(`[data-tab-panel="${id}"]`)?.classList.add('product-tab-panel--active');
    });
  });
}

export function getProductPageQuantity() {
  const input = document.querySelector('#product-qty');
  return input ? Math.max(1, parseInt(input.value, 10) || 1) : 1;
}

export function getProductPageFlavor() {
  const select = document.querySelector('[data-product-flavor]');
  return select ? select.value : '';
}
