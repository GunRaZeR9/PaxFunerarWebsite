// modals.js — port of ServiceDetailModalComponent open/close logic.
// Each .pax-modal[data-modal=KEY] is hidden alongside its card; the card
// [data-modal-open=KEY] opens it. Same anime timeline values as the component.

import { slideUpIn, slideDownOut, fadeIn } from './animations.js';

let openModalEl = null;

const PANEL = '.modal-panel, .product-modal-panel';

function openModal(modal) {
  if (!modal) return;
  openModalEl = modal;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  const panel = modal.querySelector(PANEL);
  const overlay = modal.querySelector('.modal-overlay');
  // Product quick-view is centered via transform → must NOT be translateY-animated
  // (the magazin component never animated it). Service modal slides up.
  if (modal.hasAttribute('data-modal-static')) {
    if (panel) panel.focus();
    return;
  }
  requestAnimationFrame(() => {
    slideUpIn(panel);
    fadeIn(overlay, 200);
    if (panel) panel.focus();
  });
}

function closeModal(modal) {
  if (!modal) return;
  if (modal.hasAttribute('data-modal-static')) {
    modal.hidden = true;
    document.body.style.overflow = '';
    openModalEl = null;
    return;
  }
  const panel = modal.querySelector(PANEL);
  slideDownOut(panel, () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    openModalEl = null;
  });
}

document.addEventListener('click', (e) => {
  // Inner "learn more" link must not open the modal.
  const stop = e.target.closest('[data-stop-prop]');
  if (stop) return;

  const trigger = e.target.closest('[data-modal-open]');
  if (trigger) {
    e.preventDefault();
    openModal(document.querySelector(`.pax-modal[data-modal="${trigger.getAttribute('data-modal-open')}"]`));
    return;
  }

  if (e.target.closest('[data-modal-close]')) {
    closeModal(e.target.closest('.pax-modal'));
  }
});

// Card is role="button": open on Enter / Space.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && openModalEl) {
    closeModal(openModalEl);
    return;
  }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-modal-open]')) {
    e.preventDefault();
    openModal(document.querySelector(`.pax-modal[data-modal="${e.target.getAttribute('data-modal-open')}"]`));
  }
});
