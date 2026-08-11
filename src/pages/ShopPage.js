import {
  getProducts,
  getCategories,
  filterProducts,
  sortProducts,
  searchProducts,
  getPriceRange,
} from '../services/productService.js';
import { ProductGrid, CategoryCard } from '../components/ProductCard.js';
import { EmptyState } from '../components/UI.js';
import { updateSEO } from '../utils/seo.js';
import { escapeHtml } from '../utils/dom.js';
import { t, getLocalizedCategory } from '../services/i18nService.js';
import { track, Events } from '../services/analyticsService.js';
import { storeConfig } from '../data/store-config.js';

let shopState = {
  search: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'featured',
  inStockOnly: false,
};

export function ShopPage(query = {}) {
  if (query.view === 'categories') {
    return CategoriesBrowsePage();
  }

  updateSEO({ title: t('shop.title'), description: storeConfig.seo.defaultDescription });

  shopState = { ...shopState, ...query };
  const categories = getCategories();
  const priceRange = getPriceRange();

  let products = getProducts();
  if (shopState.search) products = searchProducts(shopState.search);
  products = filterProducts(
    { category: shopState.category, minPrice: shopState.minPrice, maxPrice: shopState.maxPrice, inStockOnly: shopState.inStockOnly },
    products
  );
  products = sortProducts(products, shopState.sort);

  const categoryOptions = categories
    .map((c) => `<option value="${escapeHtml(c.id)}" ${shopState.category === c.id ? 'selected' : ''}>${escapeHtml(getLocalizedCategory(c))}</option>`)
    .join('');

  return `
    <main id="main-content" class="shop-page">
      <div class="shop-filters-backdrop" data-shop-filters-backdrop hidden aria-hidden="true"></div>
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">${escapeHtml(t('shop.title'))}</h1>
          <p class="page-subtitle">${products.length} ${escapeHtml(t('shop.productsFound'))}</p>
        </div>
        <div class="shop-layout">
          <aside class="shop-filters" aria-label="Product filters">
            <div class="filter-group">
              <label for="shop-search" class="filter-label">${escapeHtml(t('shop.search'))}</label>
              <input type="search" id="shop-search" class="filter-input" placeholder="${escapeHtml(t('shop.searchPlaceholder'))}" value="${escapeHtml(shopState.search)}" data-filter="search" />
            </div>
            <div class="filter-group">
              <label for="shop-category" class="filter-label">${escapeHtml(t('shop.category'))}</label>
              <select id="shop-category" class="filter-select" data-filter="category">
                <option value="all" ${shopState.category === 'all' ? 'selected' : ''}>${escapeHtml(t('shop.allCategories'))}</option>
                ${categoryOptions}
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">${escapeHtml(t('shop.priceRange'))}</label>
              <div class="filter-price-row">
                <input type="number" class="filter-input" placeholder="Min" min="0" value="${escapeHtml(shopState.minPrice)}" data-filter="minPrice" />
                <span>—</span>
                <input type="number" class="filter-input" placeholder="Max" min="0" value="${escapeHtml(shopState.maxPrice)}" data-filter="maxPrice" />
              </div>
              <small class="filter-hint">${priceRange.min} – ${priceRange.max} EGP</small>
            </div>
            <div class="filter-group">
              <label class="filter-check">
                <input type="checkbox" data-filter="inStockOnly" ${shopState.inStockOnly ? 'checked' : ''} />
                ${escapeHtml(t('shop.inStockOnly'))}
              </label>
            </div>
            <button type="button" class="btn btn--ghost btn--sm btn--block" data-action="clear-filters">${escapeHtml(t('shop.clearFilters'))}</button>
          </aside>
          <div class="shop-content">
            <div class="shop-toolbar">
              <button type="button" class="btn btn--ghost btn--sm shop-filters-toggle" data-action="toggle-filters">${escapeHtml(t('shop.filters'))}</button>
              <select class="filter-select" data-filter="sort" aria-label="Sort">
                <option value="featured" ${shopState.sort === 'featured' ? 'selected' : ''}>${escapeHtml(t('shop.sortFeatured'))}</option>
                <option value="newest" ${shopState.sort === 'newest' ? 'selected' : ''}>${escapeHtml(t('shop.sortNewest'))}</option>
                <option value="price-asc" ${shopState.sort === 'price-asc' ? 'selected' : ''}>${escapeHtml(t('shop.sortPriceAsc'))}</option>
                <option value="price-desc" ${shopState.sort === 'price-desc' ? 'selected' : ''}>${escapeHtml(t('shop.sortPriceDesc'))}</option>
                <option value="best-selling" ${shopState.sort === 'best-selling' ? 'selected' : ''}>${escapeHtml(t('shop.sortBestSelling'))}</option>
                <option value="rating" ${shopState.sort === 'rating' ? 'selected' : ''}>${escapeHtml(t('shop.sortRating'))}</option>
              </select>
            </div>
            <div data-shop-results>
              ${products.length ? ProductGrid(products) : EmptyState({ icon: '🔍', title: t('shop.noResults'), message: t('shop.noResultsMsg'), ctaText: t('shop.viewAll'), ctaHref: '#/shop' })}
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function CategoriesBrowsePage() {
  updateSEO({ title: t('nav.categories'), description: t('sections.categoriesSub') });
  const categories = getCategories();

  return `
    <main id="main-content" class="categories-page">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">${escapeHtml(t('sections.categories'))}</h1>
          <p class="page-subtitle">${escapeHtml(t('sections.categoriesSub'))}</p>
        </div>
        <div class="category-grid">${categories.map(CategoryCard).join('')}</div>
      </div>
    </main>
  `;
}

export function initShopPage(router) {
  const container = document.querySelector('.shop-page');
  if (!container) return;

  const closeFilters = () => {
    container.querySelector('.shop-filters')?.classList.remove('shop-filters--open');
    container.querySelector('[data-shop-filters-backdrop]')?.setAttribute('hidden', '');
    document.body.classList.remove('shop-filters-open');
  };

  const applyFilters = () => {
    const params = {};
    container.querySelectorAll('[data-filter]').forEach((el) => {
      const key = el.dataset.filter;
      if (el.type === 'checkbox') params[key] = el.checked;
      else if (el.value) params[key] = el.value;
      else if (key !== 'inStockOnly') params[key] = '';
    });
    if (!params.category) params.category = 'all';
    track(Events.SEARCH, { query: params.search, category: params.category });
    closeFilters();
    router.navigate('/shop', params);
  };

  let debounce;
  container.querySelector('[data-filter="search"]')?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(applyFilters, 300);
  });
  container.querySelectorAll('[data-filter]:not([data-filter="search"])').forEach((el) => {
    el.addEventListener('change', applyFilters);
  });
  container.querySelector('[data-action="clear-filters"]')?.addEventListener('click', () => {
    shopState = { search: '', category: 'all', minPrice: '', maxPrice: '', sort: 'featured', inStockOnly: false };
    closeFilters();
    router.navigate('/shop');
  });

  container.querySelector('[data-action="toggle-filters"]')?.addEventListener('click', () => {
    const filters = container.querySelector('.shop-filters');
    const backdrop = container.querySelector('[data-shop-filters-backdrop]');
    if (!filters) return;
    const isOpen = filters.classList.toggle('shop-filters--open');
    if (isOpen) backdrop?.removeAttribute('hidden');
    else backdrop?.setAttribute('hidden', '');
    document.body.classList.toggle('shop-filters-open', isOpen);
  });

  container.querySelector('[data-shop-filters-backdrop]')?.addEventListener('click', closeFilters);
}
