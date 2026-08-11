import {
  getDiscountPercent,
  isInStock,
  getCategoryById,
} from '../services/productService.js';
import { isFavorite } from '../services/favoritesService.js';
import { formatPrice } from '../utils/format.js';
import { t, getLocalizedCategory } from '../services/i18nService.js';
import { escapeHtml } from '../utils/dom.js';
import { Badge, StarRating } from './UI.js';

export function ProductCard(product, options = {}) {
  const { showQuickView = true, variant = 'default' } = options;
  const isHome = variant === 'home';
  const inStock = isInStock(product);
  const discount = getDiscountPercent(product);
  const category = getCategoryById(product.category);
  const fav = isFavorite(product.id);

  let badge = '';
  if (!inStock) badge = Badge({ text: t('product.outOfStock'), variant: 'danger' });
  else if (product.bestSeller) badge = Badge({ text: t('product.bestSeller'), variant: 'accent' });
  else if (product.newArrival) badge = Badge({ text: t('product.new'), variant: 'info' });
  else if (discount > 0) badge = Badge({ text: `-${discount}%`, variant: 'sale' });

  const bodyContent = isHome
    ? `
        ${StarRating({ rating: product.rating, count: product.reviewCount })}
        <h3 class="product-card__title"><a href="#/product/${escapeHtml(product.slug)}">${escapeHtml(product.name)}</a></h3>
        ${product.weight ? `<p class="product-card__weight">${escapeHtml(product.weight)}</p>` : ''}
        <div class="product-card__price-row">
          <span class="product-card__price">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="product-card__old-price">${formatPrice(product.oldPrice)}</span>` : ''}
        </div>
      `
    : `
        <span class="product-card__category">${escapeHtml(getLocalizedCategory(category) || product.category)}</span>
        <h3 class="product-card__title"><a href="#/product/${escapeHtml(product.slug)}">${escapeHtml(product.name)}</a></h3>
        ${product.weight ? `<p class="product-card__weight">${escapeHtml(product.weight)}</p>` : ''}
        ${StarRating({ rating: product.rating, count: product.reviewCount })}
        <div class="product-card__price-row">
          <span class="product-card__price">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="product-card__old-price">${formatPrice(product.oldPrice)}</span>` : ''}
        </div>
      `;

  return `
    <article class="product-card${isHome ? ' product-card--home' : ''}" data-product-id="${escapeHtml(product.id)}">
      <div class="product-card__image-wrap">
        ${badge ? `<div class="product-card__badges">${badge}</div>` : ''}
        <button type="button" class="product-card__fav ${fav ? 'product-card__fav--active' : ''}" data-action="toggle-fav" data-id="${escapeHtml(product.id)}" aria-label="Favorite">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.778l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <a href="#/product/${escapeHtml(product.slug)}" class="product-card__image-link">
          <img src="${escapeHtml(product.thumbnail)}" alt="${escapeHtml(product.name)}" loading="lazy" class="product-card__image" onerror="this.src='/assets/products/placeholder.svg'" />
        </a>
        ${showQuickView ? `<button type="button" class="product-card__quick-view" data-action="quick-view" data-id="${escapeHtml(product.id)}">${escapeHtml(t('product.quickView'))}</button>` : ''}
      </div>
      <div class="product-card__body">
        ${bodyContent}
        <div class="product-card__actions">
          ${
            inStock
              ? `<button type="button" class="btn btn--primary btn--sm btn--block product-card__add-btn" data-action="add-to-cart" data-id="${escapeHtml(product.id)}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  ${escapeHtml(t('product.addToCart'))}
                </button>`
              : `<button type="button" class="btn btn--ghost btn--sm btn--block" disabled>${escapeHtml(t('product.outOfStock'))}</button>`
          }
        </div>
      </div>
    </article>
  `;
}

export function ProductGrid(products, options) {
  if (!products.length) return '';
  return `<div class="product-grid">${products.map((p) => ProductCard(p, options)).join('')}</div>`;
}

export function CategoryCard(category) {
  return `
    <a href="#/shop?category=${escapeHtml(category.id)}" class="category-card">
      <div class="category-card__image">
        <img src="${escapeHtml(category.image)}" alt="${escapeHtml(getLocalizedCategory(category))}" loading="lazy" onerror="this.src='/assets/categories/placeholder.svg'" />
      </div>
      <div class="category-card__body">
        <h3 class="category-card__title">${escapeHtml(getLocalizedCategory(category))}</h3>
        <p class="category-card__desc">${escapeHtml(category.description)}</p>
      </div>
    </a>
  `;
}
