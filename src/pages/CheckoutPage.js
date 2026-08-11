import { getCartItems, getCartSubtotal } from '../services/cartService.js';
import { getGovernorates } from '../services/configService.js';
import { storeConfig } from '../data/store-config.js';
import { EmptyState } from '../components/UI.js';
import { formatPrice } from '../utils/format.js';
import { updateSEO } from '../utils/seo.js';
import { escapeHtml } from '../utils/dom.js';
import { validateCheckout } from '../utils/validation.js';
import { showToast } from '../components/Toast.js';
import { t } from '../services/i18nService.js';
import { track, Events } from '../services/analyticsService.js';

export function CheckoutPage() {
  updateSEO({ title: t('checkout.title') });
  track(Events.CHECKOUT_STARTED);

  const items = getCartItems();
  const subtotal = getCartSubtotal();

  if (!items.length) {
    return `
      <main id="main-content" class="container page-content">
        ${EmptyState({ icon: '🛒', title: t('checkout.empty'), message: t('checkout.emptyMsg'), ctaText: t('checkout.goShop'), ctaHref: '#/shop' })}
      </main>
    `;
  }

  const governorates = getGovernorates()
    .map((g) => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`)
    .join('');

  return `
    <main id="main-content" class="checkout-page">
      <div class="container">
        <h1 class="page-title">${escapeHtml(t('checkout.title'))}</h1>
        <div class="checkout-layout">
          <form class="checkout-form" data-checkout-form novalidate>
            <h2 class="checkout-form__title">${escapeHtml(t('checkout.customerInfo'))}</h2>
            <div class="form-group">
              <label for="fullName" class="form-label">${escapeHtml(t('checkout.fullName'))} *</label>
              <input type="text" id="fullName" name="fullName" class="form-input" required autocomplete="name" />
              <span class="form-error" data-error="fullName"></span>
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">${escapeHtml(t('checkout.phone'))} *</label>
              <input type="tel" id="phone" name="phone" class="form-input" required placeholder="01XXXXXXXXX" autocomplete="tel" />
              <span class="form-error" data-error="phone"></span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="governorate" class="form-label">${escapeHtml(t('checkout.governorate'))} *</label>
                <select id="governorate" name="governorate" class="form-select" required>
                  <option value="">${escapeHtml(t('checkout.selectGov'))}</option>
                  ${governorates}
                </select>
                <span class="form-error" data-error="governorate"></span>
              </div>
              <div class="form-group">
                <label for="city" class="form-label">${escapeHtml(t('checkout.city'))} *</label>
                <input type="text" id="city" name="city" class="form-input" required />
                <span class="form-error" data-error="city"></span>
              </div>
            </div>
            <div class="form-group">
              <label for="address" class="form-label">${escapeHtml(t('checkout.address'))} *</label>
              <textarea id="address" name="address" class="form-textarea" rows="3" required></textarea>
              <span class="form-error" data-error="address"></span>
            </div>
            <div class="form-group">
              <label for="deliveryTime" class="form-label">${escapeHtml(t('checkout.deliveryTime'))}</label>
              <input type="text" id="deliveryTime" name="deliveryTime" class="form-input" />
            </div>
            <div class="form-group">
              <label for="notes" class="form-label">${escapeHtml(t('checkout.notes'))}</label>
              <textarea id="notes" name="notes" class="form-textarea" rows="2"></textarea>
            </div>
            <button type="submit" class="btn btn--primary btn--lg btn--block">${escapeHtml(t('checkout.review'))}</button>
          </form>
          <aside class="checkout-summary">
            <h2 class="checkout-summary__title">${escapeHtml(t('checkout.orderSummary'))}</h2>
            <div class="checkout-summary__items">
              ${items.map((item) => `<div class="checkout-summary__item"><span>${escapeHtml(item.name)} × ${item.quantity}</span><span>${formatPrice(item.price * item.quantity)}</span></div>`).join('')}
            </div>
            <div class="checkout-summary__total">
              <span>${escapeHtml(t('checkout.total'))}</span>
              <span>${formatPrice(subtotal)}</span>
            </div>
            <p class="checkout-summary__note">${escapeHtml(storeConfig.deliveryNote)}</p>
          </aside>
        </div>
      </div>
    </main>
  `;
}

export function initCheckoutPage(router) {
  const form = document.querySelector('[data-checkout-form]');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach((el) => el.classList.remove('form-input--error'));

    const { valid, errors } = validateCheckout(data);
    if (!valid) {
      showToast(t('order.incomplete'), 'error');
      Object.entries(errors).forEach(([field, msg]) => {
        form.querySelector(`[data-error="${field}"]`).textContent = msg;
        form.querySelector(`[name="${field}"]`)?.classList.add('form-input--error');
      });
      return;
    }
    router.setState({ checkoutData: data });
    router.navigate('/order-confirm');
  });
}
