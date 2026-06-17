<?php
/**
 * Plugin Name: PAX CORS Fix
 * Description: Allows the Angular storefront to call the WooCommerce REST API.
 *
 * Upload to: wp.sellmotion.ro/wp-content/mu-plugins/pax-cors.php
 * See WOOCOMMERCE_INTEGRATION.md Phase 0.5 for context.
 */

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        // Whitelist, not a single origin. Angular's production target is
        // sellmotion.ro — both apex and www are listed since browsers treat
        // them as distinct origins for CORS. GitHub Pages + localhost stay
        // in for the demo/local-dev workflow; safe to drop gunrazer9.github.io
        // once sellmotion.ro is confirmed working end-to-end.
        $allowed_origins = [
            'https://sellmotion.ro',
            'https://www.sellmotion.ro',
            'https://gunrazer9.github.io',
            'http://localhost:4200',
        ];

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }

        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit();
        }

        return $value;
    }, 15);
}, 15);