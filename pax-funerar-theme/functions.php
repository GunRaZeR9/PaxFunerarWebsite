<?php
/**
 * PaxFunerar theme bootstrap.
 *
 * Ported from the Angular build: theme support, asset enqueues, helper
 * includes, and a handful of URL/nav helpers the templates rely on.
 * No page builder, no purchased plugins — WooCommerce is the one exception.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('PAX_VERSION', '1.0.0');
define('PAX_DIR', get_template_directory());
define('PAX_URI', get_template_directory_uri());

/* -------------------------------------------------------------------------
 * Helper includes
 * ---------------------------------------------------------------------- */
require_once PAX_DIR . '/inc/i18n.php';
require_once PAX_DIR . '/inc/seo.php';
require_once PAX_DIR . '/inc/services-data.php';
require_once PAX_DIR . '/inc/content-data.php';
require_once PAX_DIR . '/inc/legal-data.php';
require_once PAX_DIR . '/inc/service-meta.php';
require_once PAX_DIR . '/inc/contact-form.php';

/* -------------------------------------------------------------------------
 * Theme support
 * ---------------------------------------------------------------------- */
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);

    // WooCommerce — enables AJAX add-to-cart + cart fragments out of the box.
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    load_theme_textdomain('pax-funerar', PAX_DIR . '/languages');
});

/* -------------------------------------------------------------------------
 * Assets
 * ---------------------------------------------------------------------- */
add_action('wp_enqueue_scripts', function () {
    // Google Fonts — same families/weights as index.html.
    wp_enqueue_style(
        'pax-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap',
        [],
        null
    );

    // Compiled theme stylesheet (the real CSS — style.css at the root is only
    // the WP theme header).
    $css = PAX_DIR . '/assets/css/style.css';
    wp_enqueue_style(
        'pax-style',
        PAX_URI . '/assets/css/style.css',
        ['pax-fonts'],
        file_exists($css) ? filemtime($css) : PAX_VERSION
    );

    // anime.js v3 — vendored locally (no CDN at runtime).
    $anime = PAX_DIR . '/assets/js/vendor/anime.min.js';
    if (file_exists($anime)) {
        wp_enqueue_script('animejs', PAX_URI . '/assets/js/vendor/anime.min.js', [], '3.2.2', true);
    }

    // App scripts — small ES modules, no bundler. Loaded as type="module"
    // via the script_loader_tag filter below.
    foreach (['animations', 'reveal', 'modals', 'nav', 'lang-switch'] as $name) {
        $file = PAX_DIR . "/assets/js/{$name}.js";
        if (file_exists($file)) {
            wp_enqueue_script(
                "pax-{$name}",
                PAX_URI . "/assets/js/{$name}.js",
                ['animejs'],
                filemtime($file),
                true
            );
        }
    }
});

// Mark pax-* + animejs scripts as ES modules.
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    $modules = ['pax-animations', 'pax-reveal', 'pax-modals', 'pax-nav', 'pax-lang-switch'];
    if (in_array($handle, $modules, true)) {
        return '<script type="module" src="' . esc_url($src) . '"></script>' . "\n";
    }
    return $tag;
}, 10, 3);

/* -------------------------------------------------------------------------
 * URL + nav helpers (port of routerLink targets)
 * ---------------------------------------------------------------------- */
function pax_home_url(): string {
    return home_url('/');
}

function pax_servicii_url(): string {
    return home_url('/servicii-funerare/');
}

function pax_service_url(string $slug): string {
    return home_url('/servicii-funerare/' . $slug . '/');
}

function pax_magazin_url(?string $cat = null): string {
    $url = home_url('/magazin/');
    return $cat ? add_query_arg('cat', $cat, $url) : $url;
}

function pax_page_url(string $slug): string {
    return home_url('/' . $slug . '/');
}

function pax_asset(string $path): string {
    return PAX_URI . '/' . ltrim($path, '/');
}

/** Returns ' active' when the current request matches a page slug (for nav links). */
function pax_nav_active(string $slug): string {
    if ($slug === '' || $slug === '/') {
        return is_front_page() ? ' active' : '';
    }
    if (is_page($slug)) {
        return ' active';
    }
    // Child pages (e.g. service detail) keep the parent "Servicii" link active.
    if ($slug === 'servicii-funerare') {
        $post = get_post();
        if ($post && $post->post_parent) {
            $parent = get_post($post->post_parent);
            if ($parent && $parent->post_name === 'servicii-funerare') {
                return ' active';
            }
        }
    }
    if ($slug === 'magazin' && (function_exists('is_woocommerce') && (is_shop() || is_product() || is_product_category()))) {
        return ' active';
    }
    return '';
}

/** WooCommerce cart item count (0 when WC absent). */
function pax_cart_count(): int {
    if (function_exists('WC') && WC()->cart) {
        return WC()->cart->get_cart_contents_count();
    }
    return 0;
}

/* -------------------------------------------------------------------------
 * Body class: expose active language for CSS / JS hooks
 * ---------------------------------------------------------------------- */
add_filter('body_class', function ($classes) {
    $classes[] = 'lang-' . pax_current_lang();
    // Page-scope class set by templates BEFORE get_header() (drives .page-* CSS).
    if (!empty($GLOBALS['pax_body_class'])) {
        $classes[] = $GLOBALS['pax_body_class'];
    }
    return $classes;
});
