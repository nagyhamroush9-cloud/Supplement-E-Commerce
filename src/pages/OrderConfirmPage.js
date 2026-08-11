import { getCartItems, getCartSubtotal, clearCart } from '../services/cartService.js';
import { buildOrderMessage, getWhatsAppUrl } from '../services/whatsappService.js';
import { validateCheckout } from '../utils/validation.js';
import { formatPrice } from '../utils/format.js';
import { updateSEO } from '../utils/seo.js';
import { escapeHtml } from '../utils/dom.js';
import { t } from '../services/i18nService.js';
import { track, Events } from '../services/analyticsService.js';

export function OrderConfirmPage(checkoutData) {
  updateSEO({ title: t('order.ready') });

  const items = getCartItems();
  const subtotal = getCartSubtotal();
  const totals = { subtotal, total: subtotal };

  if (!items.length || !checkoutData) {
    return `<main id="main-content" class="container page-content"><p>${escapeHtml(t('order.noData'))} <a href="#/checkout">${escapeHtml(t('checkout.title'))}</a></p></main>`;
  }

  if (!validateCheckout(checkoutData).valid) {
    return `<main id="main-content" class="container page-content"><p>${escapeHtml(t('order.incomplete'))} <a href="#/checkout">${escapeHtml(t('checkout.title'))}</a></p></main>`;
  }

  const waUrl = getWhatsAppUrl(buildOrderMessage(items, checkoutData, totals));

  return `
    <main id="main-content" class="order-confirm-page">
      <div class="container">
        <div class="order-confirm">
          <div class="order-confirm__header">
            <span class="order-confirm__icon">✓</span>
            <h1 class="page-title">${escapeHtml(t('order.ready'))}</h1>
            <p class="order-confirm__subtitle">${escapeHtml(t('order.prepared'))}<br>${escapeHtml(t('order.whatsappOpen'))}</p>
          </div>
          <div class="order-confirm__grid">
            <section class="order-confirm__section">
              <h2>${escapeHtml(t('order.items'))}</h2>
              <div class="order-table-wrap">
                <table class="order-table">
                  <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                  <tbody>${items.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${item.quantity}</td><td>${formatPrice(item.price)}</td><td>${formatPrice(item.price * item.quantity)}</td></tr>`).join('')}</tbody>
                  <tfoot><tr><td colspan="3"><strong>${escapeHtml(t('checkout.total'))}</strong></td><td><strong>${formatPrice(subtotal)}</strong></td></tr></tfoot>
                </table>
              </div>
            </section>
            <section class="order-confirm__section">
              <h2>${escapeHtml(t('order.customer'))}</h2>
              <dl class="order-details">
                <dt>${escapeHtml(t('order.name'))}</dt><dd>${escapeHtml(checkoutData.fullName)}</dd>
                <dt>${escapeHtml(t('checkout.phone'))}</dt><dd>${escapeHtml(checkoutData.phone)}</dd>
                <dt>${escapeHtml(t('checkout.governorate'))}</dt><dd>${escapeHtml(checkoutData.governorate)}</dd>
                <dt>${escapeHtml(t('checkout.city'))}</dt><dd>${escapeHtml(checkoutData.city)}</dd>
                <dt>${escapeHtml(t('checkout.address'))}</dt><dd>${escapeHtml(checkoutData.address)}</dd>
              </dl>
            </section>
          </div>
          <div class="order-confirm__actions">
            <a href="${escapeHtml(waUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg" data-action="whatsapp-order">${escapeHtml(t('order.confirm'))}</a>
            <a href="#/shop" class="btn btn--outline">${escapeHtml(t('order.backShop'))}</a>
          </div>
          <p class="order-confirm__disclaimer">${escapeHtml(t('order.disclaimer'))}</p>
        </div>
      </div>
    </main>
  `;
}

export function initOrderConfirmPage() {
  document.querySelector('[data-action="whatsapp-order"]')?.addEventListener('click', () => {
    track(Events.WHATSAPP_ORDER);
    setTimeout(() => clearCart(), 1000);
  });
}
