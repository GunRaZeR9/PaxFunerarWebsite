// cart.js — classic script (uses window.jQuery + window.anime), WC pages only.
// 1) Pulses the cart badge on WooCommerce's added_to_cart event (the badge
//    count itself updates via the woocommerce_add_to_cart_fragments fragment).
// 2) Quick-view modal quantity stepper (+/-) updates the qty, the AJAX button's
//    data-quantity, and the displayed total.
(function () {
  var $ = window.jQuery;
  var anime = window.anime;

  if ($) {
    $(document.body).on('added_to_cart', function () {
      var badge = document.querySelector('.cart-badge');
      if (!badge) return;
      badge.hidden = false;
      if (anime) {
        anime({ targets: badge, scale: [1, 1.4, 1], duration: 400, easing: 'easeOutQuad' });
      }
    });
  }

  document.addEventListener('click', function (e) {
    var dec = e.target.closest('[data-qty-dec]');
    var inc = e.target.closest('[data-qty-inc]');
    if (!dec && !inc) return;

    var modal = e.target.closest('.pax-modal');
    if (!modal) return;

    var valEl = modal.querySelector('[data-qty-val]');
    var addBtn = modal.querySelector('[data-qty-add]');
    var price = parseFloat(modal.getAttribute('data-price') || '0');
    var qty = parseInt(valEl ? valEl.textContent : '1', 10) || 1;

    qty = inc ? qty + 1 : Math.max(1, qty - 1);
    if (valEl) valEl.textContent = String(qty);
    if (addBtn) {
      addBtn.setAttribute('data-quantity', String(qty));
      var totalEl = addBtn.querySelector('[data-qty-total]');
      if (totalEl) totalEl.textContent = Math.round(price * qty).toLocaleString('ro-RO');
    }
  });
})();
