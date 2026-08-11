import { escapeHtml } from '../utils/dom.js';

export function Button({
  text,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  disabled = false,
  className = '',
  attrs = '',
  icon = '',
}) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();
  const content = `${icon ? `<span class="btn__icon">${icon}</span>` : ''}${escapeHtml(text)}`;

  if (href) {
    return `<a href="${escapeHtml(href)}" class="${cls}" ${attrs}>${content}</a>`;
  }
  return `<button type="${type}" class="${cls}" ${disabled ? 'disabled' : ''} ${attrs}>${content}</button>`;
}

export function Badge({ text, variant = 'default' }) {
  return `<span class="badge badge--${variant}">${escapeHtml(text)}</span>`;
}

export function EmptyState({ icon, title, message, ctaText, ctaHref }) {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">${icon || '📦'}</div>
      <h3 class="empty-state__title">${escapeHtml(title)}</h3>
      <p class="empty-state__message">${escapeHtml(message)}</p>
      ${ctaText ? `<a href="${escapeHtml(ctaHref || '#/shop')}" class="btn btn--primary">${escapeHtml(ctaText)}</a>` : ''}
    </div>
  `;
}

export function LoadingSkeleton({ count = 4, type = 'card' }) {
  const items = Array.from({ length: count }, () => {
    if (type === 'card') {
      return `<div class="skeleton skeleton--card"><div class="skeleton__img"></div><div class="skeleton__line"></div><div class="skeleton__line skeleton__line--short"></div></div>`;
    }
    return `<div class="skeleton skeleton--line"></div>`;
  }).join('');
  return `<div class="skeleton-grid">${items}</div>`;
}

export function Breadcrumbs(items) {
  const links = items
    .map((item, i) => {
      if (i === items.length - 1) {
        return `<span class="breadcrumb__current" aria-current="page">${escapeHtml(item.label)}</span>`;
      }
      return `<a href="${escapeHtml(item.href)}" class="breadcrumb__link">${escapeHtml(item.label)}</a>`;
    })
    .join('<span class="breadcrumb__sep">/</span>');

  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${links}</nav>`;
}

export function StarRating({ rating, count }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < full ? '★' : '☆'
  ).join('');
  return `<span class="rating" aria-label="Rating ${rating} out of 5"><span class="rating__stars">${stars}</span>${count != null ? `<span class="rating__count">(${count})</span>` : ''}</span>`;
}

export function QuantitySelector({ value, min = 1, max = 99, id = '' }) {
  return `
    <div class="qty-selector" data-qty-selector>
      <button type="button" class="qty-selector__btn" data-action="decrease" aria-label="Decrease quantity" ${value <= min ? 'disabled' : ''}>−</button>
      <input type="number" class="qty-selector__input" value="${value}" min="${min}" max="${max}" data-qty-input ${id ? `id="${id}"` : ''} aria-label="Quantity" />
      <button type="button" class="qty-selector__btn" data-action="increase" aria-label="Increase quantity" ${value >= max ? 'disabled' : ''}>+</button>
    </div>
  `;
}
