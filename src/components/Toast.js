import { escapeHtml } from '../utils/dom.js';

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'success', duration = 3000) {
  const container = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast--visible'));

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
