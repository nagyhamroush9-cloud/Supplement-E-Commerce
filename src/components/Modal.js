import { escapeHtml } from '../utils/dom.js';
import { trapFocus } from '../utils/dom.js';

let activeModal = null;

export function Modal({ id, title, content, size = 'md' }) {
  return `
    <div class="modal" id="${escapeHtml(id)}" role="dialog" aria-modal="true" aria-labelledby="${escapeHtml(id)}-title" hidden>
      <div class="modal__backdrop" data-modal-close></div>
      <div class="modal__dialog modal__dialog--${size}">
        <div class="modal__header">
          <h2 class="modal__title" id="${escapeHtml(id)}-title">${escapeHtml(title)}</h2>
          <button type="button" class="modal__close" data-modal-close aria-label="Close">&times;</button>
        </div>
        <div class="modal__body">${content}</div>
      </div>
    </div>
  `;
}

export function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  activeModal = modal;
  trapFocus(modal);

  const closeHandlers = modal.querySelectorAll('[data-modal-close]');
  closeHandlers.forEach((el) => {
    el.addEventListener('click', () => closeModal(id), { once: true });
  });

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal(id);
  }, { once: true });
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  activeModal = null;
}

export function closeActiveModal() {
  if (activeModal) {
    activeModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    activeModal = null;
  }
}

export function QuickViewModal() {
  return Modal({
    id: 'quick-view-modal',
    title: 'Quick View',
    content: '<div data-quick-view-content></div>',
    size: 'lg',
  });
}
