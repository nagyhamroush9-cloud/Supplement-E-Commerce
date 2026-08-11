import { formatPrice } from '../utils/format.js';
import { escapeHtml } from '../utils/dom.js';
import { QuantitySelector } from './UI.js';
import { t } from '../services/i18nService.js';

export function CartItem(item) {
  const lineTotal = item.price * item.quantity;
  return `
    <div class="cart-item" data-cart-item data-id="${escapeHtml(item.id)}" data-flavor="${escapeHtml(item.flavor || '')}">
      <a href="#/product/${escapeHtml(item.slug || item.id)}" class="cart-item__image">
        <img src="${escapeHtml(item.thumbnail)}" alt="${escapeHtml(item.name)}" loading="lazy" />
      </a>
      <div class="cart-item__details">
        <h3 class="cart-item__name">${escapeHtml(item.name)}</h3>
        ${item.flavor ? `<p class="cart-item__flavor">${escapeHtml(item.flavor)}</p>` : ''}
        <p class="cart-item__price">${formatPrice(item.price)}</p>
      </div>
      <div class="cart-item__qty">
        ${QuantitySelector({ value: item.quantity, max: item.maxStock || 99 })}
      </div>
      <div class="cart-item__total">${formatPrice(lineTotal)}</div>
      <button type="button" class="cart-item__remove" data-action="remove-from-cart" aria-label="Remove">&times;</button>
    </div>
  `;
}

export function CartSummary({ subtotal, itemCount }) {
  return `
    <div class="cart-summary">
      <h3 class="cart-summary__title">${escapeHtml(t('cart.summary'))}</h3>
      <div class="cart-summary__row">
        <span>${escapeHtml(t('cart.items'))} (${itemCount})</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="cart-summary__row cart-summary__row--total">
        <span>${escapeHtml(t('cart.subtotal'))}</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <p class="cart-summary__note">${escapeHtml(t('cart.deliveryNote'))}</p>
      <a href="#/checkout" class="btn btn--primary btn--block">${escapeHtml(t('cart.proceed'))}</a>
      <a href="#/shop" class="btn btn--ghost btn--block">${escapeHtml(t('cart.continue'))}</a>
    </div>
  `;
}
