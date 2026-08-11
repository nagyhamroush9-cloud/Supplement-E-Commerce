import { getCartItems, getCartSubtotal, getCartCount } from '../services/cartService.js';
import { CartItem, CartSummary } from '../components/CartItem.js';
import { EmptyState } from '../components/UI.js';
import { updateSEO } from '../utils/seo.js';
import { t } from '../services/i18nService.js';
import { escapeHtml } from '../utils/dom.js';

export function CartPage() {
  updateSEO({ title: t('cart.title') });

  const items = getCartItems();
  const subtotal = getCartSubtotal();
  const count = getCartCount();

  if (!items.length) {
    return `
      <main id="main-content" class="container page-content">
        <h1 class="page-title">${escapeHtml(t('cart.title'))}</h1>
        ${EmptyState({ icon: '🛒', title: t('cart.empty'), message: t('cart.emptyMsg'), ctaText: t('cart.startShopping'), ctaHref: '#/shop' })}
      </main>
    `;
  }

  return `
    <main id="main-content" class="cart-page">
      <div class="container">
        <h1 class="page-title">${escapeHtml(t('cart.title'))} (${count})</h1>
        <div class="cart-layout">
          <div class="cart-items">
            ${items.map(CartItem).join('')}
            <button type="button" class="btn btn--ghost btn--sm" data-action="clear-cart">${escapeHtml(t('cart.clear'))}</button>
          </div>
          ${CartSummary({ subtotal, itemCount: count })}
        </div>
      </div>
    </main>
  `;
}
