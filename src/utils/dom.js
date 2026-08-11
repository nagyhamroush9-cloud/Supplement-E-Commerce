const div = document.createElement('div');

export function escapeHtml(str) {
  if (str == null) return '';
  div.textContent = String(str);
  return div.innerHTML;
}

export function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

export function render(container, html) {
  container.innerHTML = html;
}

export function delegate(parent, eventType, selector, handler) {
  parent.addEventListener(eventType, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler(e, target);
    }
  });
}

export function scrollToTop(smooth = true) {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'instant' });
}

export function syncQuantitySelector(selector, value) {
  if (!selector) return value;
  const input = selector.querySelector('[data-qty-input]');
  if (!input) return value;

  const min = parseInt(input.min, 10) || 1;
  const max = parseInt(input.max, 10) || 99;
  const val = Math.min(max, Math.max(min, value));

  input.value = val;

  const decreaseBtn = selector.querySelector('[data-action="decrease"]');
  const increaseBtn = selector.querySelector('[data-action="increase"]');
  if (decreaseBtn) decreaseBtn.disabled = val <= min;
  if (increaseBtn) increaseBtn.disabled = val >= max;

  return val;
}

export function trapFocus(modal) {
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  first?.focus();
}
