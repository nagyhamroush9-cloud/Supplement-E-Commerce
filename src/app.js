import { applyThemeVariables } from './services/configService.js';
import { Navbar, initNavbar, updateCartBadge, closeNavbarSearch } from './components/Navbar.js';
import { Footer, BackToTop, FloatingButtons, initBackToTop } from './components/Footer.js';
import { QuickViewModal, openModal } from './components/Modal.js';
import { showToast } from './components/Toast.js';
import { createRouter, route } from './router.js';
import { HomePage } from './pages/HomePage.js';
import { ShopPage, initShopPage } from './pages/ShopPage.js';
import { ProductPage, initProductPage, getProductPageQuantity, getProductPageFlavor } from './pages/ProductPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage, initCheckoutPage } from './pages/CheckoutPage.js';
import { OrderConfirmPage, initOrderConfirmPage } from './pages/OrderConfirmPage.js';
import {
  FavoritesPage,
  AboutPage,
  ContactPage,
  LegalPage,
  NotFoundPage,
} from './pages/StaticPages.js';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from './services/cartService.js';
import { toggleFavorite } from './services/favoritesService.js';
import { getProductById, isInStock } from './services/productService.js';
import { initLanguage, setLanguage, getLanguage, t } from './services/i18nService.js';
import { formatPrice } from './utils/format.js';
import { escapeHtml, syncQuantitySelector } from './utils/dom.js';
import { track, Events } from './services/analyticsService.js';
import { initPageAnimations, destroyPageAnimations } from './utils/animationService.js';

const routes = [
  route('/', 'home'),
  route('/shop', 'shop'),
  route('/product/:slug', 'product', ['slug']),
  route('/cart', 'cart'),
  route('/checkout', 'checkout'),
  route('/order-confirm', 'order-confirm'),
  route('/favorites', 'favorites'),
  route('/about', 'about'),
  route('/contact', 'contact'),
  route('/privacy', 'privacy'),
  route('/terms', 'terms'),
  route('/shipping', 'shipping'),
  route('/returns', 'returns'),
];

let router;
let globalEventsBound = false;
let isLanguageSwitch = false;

function closeTransientUI() {
  document.querySelector('[data-mobile-menu]')?.setAttribute('hidden', '');
  document.querySelector('[data-mobile-menu-toggle]')?.setAttribute('aria-expanded', 'false');
  document.querySelector('.shop-filters')?.classList.remove('shop-filters--open');
  document.querySelector('[data-shop-filters-backdrop]')?.setAttribute('hidden', '');
  document.body.classList.remove('shop-filters-open');
  closeNavbarSearch();
}

function renderPage(content) {
  destroyPageAnimations();
  const app = document.getElementById('app');
  const path = router.getCurrentPath();
  const query = router.getQuery();
  app.innerHTML = `
    ${Navbar(path, query)}
    ${content}
    ${Footer()}
    ${BackToTop()}
    ${FloatingButtons()}
    ${QuickViewModal()}
  `;
  initNavbar();
  initBackToTop();
  initPageAnimations({ languageSwitch: isLanguageSwitch });
  isLanguageSwitch = false;
}

function cartMessage(result) {
  if (result.message === 'added') return t('toast.added');
  if (result.message === 'invalid') return t('toast.invalid');
  if (result.message === 'stock') return t('toast.stock');
  if (result.message === 'stock_limit') return `${t('toast.stock')} (${result.stock})`;
  if (result.message === 'removed') return t('cart.removed');
  return result.message;
}

function bindGlobalEvents() {
  if (globalEventsBound) return;
  globalEventsBound = true;

  const app = document.getElementById('app');

  app.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-search-form]');
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('[data-search-input]');
    const q = input?.value.trim() || '';
    closeTransientUI();
    router.navigate('/shop', q ? { search: q } : {});
  });

  app.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id;

    switch (action) {
      case 'add-to-cart': {
        e.preventDefault();
        const qty = target.dataset.fromDetail != null ? getProductPageQuantity() : 1;
        const flavor = target.dataset.fromDetail != null ? getProductPageFlavor() : '';
        const result = addToCart(id, qty, flavor);
        showToast(cartMessage(result), result.success ? 'success' : 'error');
        if (result.success) {
          track(Events.ADD_TO_CART, { id, qty });
          updateCartBadge();
        }
        break;
      }
      case 'buy-now': {
        e.preventDefault();
        const qty = getProductPageQuantity();
        const flavor = getProductPageFlavor();
        const result = addToCart(id, qty, flavor);
        if (result.success) {
          updateCartBadge();
          router.navigate('/checkout');
        } else {
          showToast(cartMessage(result), 'error');
        }
        break;
      }
      case 'toggle-fav': {
        e.preventDefault();
        const result = toggleFavorite(id);
        showToast(result.added ? t('toast.favAdded') : t('toast.favRemoved'));
        target.classList.toggle('product-card__fav--active', result.added);
        target.classList.toggle('product-detail__fav--active', result.added);
        const svg = target.querySelector('svg');
        if (svg) svg.setAttribute('fill', result.added ? 'currentColor' : 'none');
        break;
      }
      case 'quick-view': {
        e.preventDefault();
        showQuickView(id);
        break;
      }
      case 'remove-from-cart': {
        e.preventDefault();
        const item = target.closest('[data-cart-item]');
        removeFromCart(item.dataset.id, item.dataset.flavor);
        showToast(t('cart.removed'));
        updateCartBadge();
        router.navigate('/cart');
        break;
      }
      case 'clear-cart': {
        e.preventDefault();
        clearCart();
        showToast(t('cart.cleared'));
        updateCartBadge();
        router.navigate('/cart');
        break;
      }
      case 'toggle-lang': {
        e.preventDefault();
        setLanguage(getLanguage() === 'ar' ? 'en' : 'ar');
        break;
      }
    }
  });

  app.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="decrease"], [data-action="increase"]');
    if (!btn) return;
    const selector = btn.closest('[data-qty-selector]');
    const input = selector?.querySelector('[data-qty-input]');
    if (!input) return;

    const min = parseInt(input.min, 10) || 1;
    const max = parseInt(input.max, 10) || 99;
    let val = parseInt(input.value, 10) || min;

    if (btn.dataset.action === 'decrease') val -= 1;
    else val += 1;

    val = syncQuantitySelector(selector, val);

    const cartItem = selector.closest('[data-cart-item]');
    if (cartItem) {
      const result = updateQuantity(cartItem.dataset.id, val, cartItem.dataset.flavor);
      if (!result.success) showToast(cartMessage(result), 'error');
      updateCartBadge();
      router.navigate('/cart');
    }
  });

  app.addEventListener('change', (e) => {
    const input = e.target.closest('[data-qty-input]');
    if (!input) return;
    const selector = input.closest('[data-qty-selector]');
    const val = syncQuantitySelector(selector, parseInt(input.value, 10) || 1);

    const cartItem = input.closest('[data-cart-item]');
    if (cartItem) {
      const result = updateQuantity(cartItem.dataset.id, val, cartItem.dataset.flavor);
      if (!result.success) showToast(cartMessage(result), 'error');
      updateCartBadge();
      router.navigate('/cart');
    }
  });
}

function showQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const inStock = isInStock(product);
  const content = document.querySelector('[data-quick-view-content]');
  if (content) {
    content.innerHTML = `
      <div class="quick-view">
        <img src="${escapeHtml(product.thumbnail)}" alt="${escapeHtml(product.name)}" class="quick-view__img" />
        <div class="quick-view__info">
          <h3>${escapeHtml(product.name)}</h3>
          <p class="quick-view__price">${formatPrice(product.price)}</p>
          <p class="quick-view__stock">${inStock ? t('product.inStock') : t('product.outOfStock')}</p>
          <p>${escapeHtml(product.shortDescription)}</p>
          <div class="quick-view__actions">
            ${inStock ? `<button type="button" class="btn btn--primary" data-action="add-to-cart" data-id="${escapeHtml(product.id)}">${t('product.addToCart')}</button>` : ''}
            <a href="#/product/${escapeHtml(product.slug)}" class="btn btn--outline">${t('product.viewDetails')}</a>
          </div>
        </div>
      </div>
    `;
  }
  openModal('quick-view-modal');
}

function handleNavigation({ route: r, params, query, state }) {
  let content = '';

  switch (r.name) {
    case 'home':
      content = HomePage();
      renderPage(content);
      break;
    case 'shop':
      content = ShopPage(query);
      renderPage(content);
      initShopPage(router);
      break;
    case 'product':
      content = ProductPage(params.slug);
      renderPage(content);
      initProductPage();
      break;
    case 'cart':
      content = CartPage();
      renderPage(content);
      break;
    case 'checkout':
      content = CheckoutPage();
      renderPage(content);
      initCheckoutPage(router);
      break;
    case 'order-confirm':
      content = OrderConfirmPage(state.checkoutData);
      renderPage(content);
      initOrderConfirmPage();
      break;
    case 'favorites':
      content = FavoritesPage();
      renderPage(content);
      break;
    case 'about':
      content = AboutPage();
      renderPage(content);
      break;
    case 'contact':
      content = ContactPage();
      renderPage(content);
      break;
    case 'privacy':
      content = LegalPage('privacy');
      renderPage(content);
      break;
    case 'terms':
      content = LegalPage('terms');
      renderPage(content);
      break;
    case 'shipping':
      content = LegalPage('shipping');
      renderPage(content);
      break;
    case 'returns':
      content = LegalPage('returns');
      renderPage(content);
      break;
    default:
      content = NotFoundPage();
      renderPage(content);
  }
}

function rerenderCurrentPage() {
  closeTransientUI();
  isLanguageSwitch = true;
  document.body.classList.add('language-switching');
  router.refresh({ preserveScroll: true });
  requestAnimationFrame(() => {
    document.body.classList.remove('language-switching');
  });
}

export function initApp() {
  initLanguage();
  applyThemeVariables();
  router = createRouter(routes, handleNavigation);
  bindGlobalEvents();

  window.addEventListener('cart-updated', updateCartBadge);
  window.addEventListener('language-changed', rerenderCurrentPage);

  router.start();
}
