<?php
/**
 * woocommerce.php — WooCommerce glue (no plugin overrides beyond the theme's
 * own template files in /woocommerce). Category filtering via ?cat=, cart-badge
 * fragment auto-update, page-magazin body class, cart pulse script, price helper.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** True on any WooCommerce-driven view. */
function pax_is_woo(): bool {
    return function_exists('is_woocommerce')
        && (is_shop() || is_product() || is_product_category() || is_product_tag());
}

// Filter the shop's main query by ?cat=slug (matches the navbar deep-links).
add_action('pre_get_posts', function ($q) {
    if (is_admin() || !$q->is_main_query() || !function_exists('is_shop') || !is_shop()) {
        return;
    }
    if (empty($_GET['cat'])) {
        return;
    }
    $cat   = sanitize_title(wp_unslash($_GET['cat']));
    $valid = array_column(pax_shop_categories(), 'slug');
    if ($cat !== '' && $cat !== 'all' && in_array($cat, $valid, true)) {
        $tax   = (array) $q->get('tax_query');
        $tax[] = ['taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $cat];
        $q->set('tax_query', $tax);
    }
});

// Cart badge as a cart fragment → WC replaces it after every AJAX add-to-cart.
add_filter('woocommerce_add_to_cart_fragments', function ($fragments) {
    $count = (function_exists('WC') && WC()->cart) ? WC()->cart->get_cart_contents_count() : 0;
    ob_start();
    ?>
<span class="cart-badge" data-cart-count<?php echo $count > 0 ? '' : ' hidden'; ?>><?php echo esc_html($count); ?></span>
    <?php
    $fragments['span.cart-badge'] = trim(ob_get_clean());
    return $fragments;
});

// Page-scope class for the .page-magazin styles.
add_filter('body_class', function ($classes) {
    if (pax_is_woo()) {
        $classes[] = 'page-magazin';
    }
    return $classes;
});

// Cart pulse script (classic — uses window.jQuery + window.anime) on WC pages.
add_action('wp_enqueue_scripts', function () {
    if (!pax_is_woo()) {
        return;
    }
    $f = PAX_DIR . '/assets/js/cart.js';
    if (file_exists($f)) {
        wp_enqueue_script('pax-cart', PAX_URI . '/assets/js/cart.js', ['jquery', 'animejs'], filemtime($f), true);
    }
}, 20);

/** Integer price + " RON" — matches the Angular number:'1.0-0' + ' RON' display. */
function pax_product_price($product): string {
    if (!$product) {
        return '';
    }
    $price = (float) $product->get_price();
    return number_format($price, 0, ',', '.') . ' RON';
}

// WooCommerce manages the whole shop layout in our archive-product.php — drop
// the default sidebar and result-count/ordering we don't use.
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);
