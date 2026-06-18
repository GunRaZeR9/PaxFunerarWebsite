<?php
/**
 * woocommerce/single-product.php — product detail page.
 * No Angular reference existed (products were modal-only), so this wraps
 * WooCommerce's standard single-product content in the theme shell and styles
 * it on-brand via .page-magazin .single-product rules (assets/scss/pages/_single-product.scss).
 * Native add-to-cart / gallery / variations keep working untouched.
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header('shop');
?>

<section class="single-product-section">
  <div class="container">
    <?php if (function_exists('woocommerce_breadcrumb')) {
        woocommerce_breadcrumb([
            'delimiter'   => ' <span aria-hidden="true">›</span> ',
            'wrap_before' => '<nav class="breadcrumb" aria-label="Breadcrumb">',
            'wrap_after'  => '</nav>',
        ]);
    } ?>

    <?php while (have_posts()) : the_post(); ?>
      <?php wc_get_template_part('content', 'single-product'); ?>
    <?php endwhile; ?>
  </div>
</section>

<?php
get_footer('shop');
