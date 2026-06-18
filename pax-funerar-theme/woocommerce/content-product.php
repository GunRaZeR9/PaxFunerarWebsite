<?php
/**
 * woocommerce/content-product.php — one product card + its quick-view modal.
 * Markup/classes match magazin.component.html (.product-card / .product-modal-*).
 * Add-to-cart is native WooCommerce AJAX; the modal is the card→modal pattern
 * (static — no slide animation, matching the Angular magazin modal).
 */

if (!defined('ABSPATH')) {
    exit;
}

global $product;
if (!is_a($product, 'WC_Product') || !$product->is_visible()) {
    return;
}

$id       = $product->get_id();
$key      = 'product-' . $id;
$name     = $product->get_name();
$price    = pax_product_price($product);
$short    = $product->get_short_description();
$desc     = $product->get_description();
$has_img  = has_post_thumbnail($id);
$cart_url = $product->add_to_cart_url();

$ajax = $product->supports('ajax_add_to_cart')
    && $product->is_purchasable()
    && $product->is_in_stock()
    && !$product->is_type('variable');

$add_classes = 'add-btn add_to_cart_button' . ($ajax ? ' ajax_add_to_cart' : '');
?>
<article class="product-card" role="button" tabindex="0" data-modal-open="<?= esc_attr($key) ?>">
  <div class="product-image-wrap">
    <?php if ($has_img) : ?>
      <?= $product->get_image('woocommerce_thumbnail', ['class' => 'product-img', 'loading' => 'lazy']); ?>
    <?php else : ?>
      <div class="product-image-placeholder" aria-hidden="true">💐</div>
    <?php endif; ?>
  </div>
  <div class="product-info">
    <h3 class="product-name"><?= esc_html($name) ?></h3>
    <p class="product-short"><?= wp_kses_post($short) ?></p>
    <div class="product-footer">
      <span class="product-price"><?= esc_html($price) ?></span>
      <a href="<?= esc_url($cart_url) ?>"
         data-stop-prop
         data-quantity="1"
         data-product_id="<?= esc_attr($id) ?>"
         data-product_sku="<?= esc_attr($product->get_sku()) ?>"
         rel="nofollow"
         class="<?= esc_attr($add_classes) ?>"
         aria-label="<?= esc_attr(pax_t('common.addToCart') . ' ' . $name) ?>">+</a>
    </div>
  </div>
</article>

<div class="pax-modal" data-modal="<?= esc_attr($key) ?>" data-modal-static data-price="<?= esc_attr((float) $product->get_price()) ?>" hidden>
  <div class="product-modal-overlay" data-modal-close tabindex="-1" aria-hidden="true"></div>
  <div class="product-modal-panel" role="dialog" aria-modal="true" aria-label="<?= esc_attr($name) ?>" tabindex="0">
    <button class="modal-close" type="button" data-modal-close aria-label="<?= esc_attr(pax_t('common.close')) ?>">✕</button>

    <div class="product-modal-body">
      <div class="product-modal-image">
        <?php if ($has_img) : ?>
          <?= $product->get_image('woocommerce_single', ['class' => 'modal-img']); ?>
        <?php else : ?>
          <div class="product-image-placeholder" aria-hidden="true">💐</div>
        <?php endif; ?>
      </div>
      <div class="product-modal-info">
        <h2><?= esc_html($name) ?></h2>
        <p class="product-modal-price"><?= esc_html($price) ?></p>
        <div class="product-modal-desc"><?= wp_kses_post(wpautop($desc)) ?></div>

        <div class="qty-row">
          <button type="button" class="qty-btn" data-qty-dec aria-label="<?= esc_attr(pax_t('cart.decreaseQty')) ?>">−</button>
          <span class="qty-val" data-qty-val aria-live="polite">1</span>
          <button type="button" class="qty-btn" data-qty-inc aria-label="<?= esc_attr(pax_t('cart.increaseQty')) ?>">+</button>
        </div>

        <a href="<?= esc_url($cart_url) ?>"
           data-qty-add
           data-quantity="1"
           data-product_id="<?= esc_attr($id) ?>"
           data-product_sku="<?= esc_attr($product->get_sku()) ?>"
           rel="nofollow"
           class="cta-btn-primary full-w <?= $ajax ? 'ajax_add_to_cart add_to_cart_button' : '' ?>">
          <?= esc_html(pax_t('common.addToCart')) ?> — <span data-qty-total><?= esc_html(number_format((float) $product->get_price(), 0, ',', '.')) ?></span> RON
        </a>
      </div>
    </div>
  </div>
</div>
