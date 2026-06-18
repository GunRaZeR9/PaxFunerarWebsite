<?php
/**
 * SEO — hand-rolled, no plugin. Port of SeoService.
 *
 * Each template calls pax_seo($title, $description, $canonical) near the top;
 * the wp_head hook below prints the tags. An optional JSON-LD blob can be set
 * with pax_seo_jsonld() (homepage / contact print the FuneralHome schema).
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Register per-page SEO data. Call at the top of a template. */
function pax_seo(string $title, string $description, ?string $canonical = null): void {
    global $pax_seo_data;
    $pax_seo_data = compact('title', 'description', 'canonical');
}

/** Register a JSON-LD array to be printed in <head>. */
function pax_seo_jsonld(array $schema): void {
    global $pax_seo_jsonld;
    $pax_seo_jsonld = $schema;
}

/** The FuneralHome schema — values ported verbatim from HomeComponent ngOnInit. */
function pax_funeral_home_schema(): array {
    return [
        '@context'  => 'https://schema.org',
        '@type'     => 'FuneralHome',
        'name'      => 'Casa Funerară PAX',
        'url'       => home_url('/'),
        'telephone' => ['+40745547530', '+40745647530'],
        'email'     => 'contact@paxfunerar.ro',
        'address'   => [
            '@type'           => 'PostalAddress',
            'streetAddress'   => 'Strada Alexandru Papiu Ilarian 10',
            'addressLocality' => 'Târgu Mureș',
            'addressRegion'   => 'Mureș',
            'postalCode'      => '540058',
            'addressCountry'  => 'RO',
        ],
        'openingHoursSpecification' => [
            '@type'     => 'OpeningHoursSpecification',
            'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'opens'     => '00:00',
            'closes'    => '23:59',
        ],
    ];
}

// Let pax_seo() drive the document <title> (works because templates call
// pax_seo() BEFORE get_header(), so the data exists when wp_head runs).
add_filter('pre_get_document_title', function ($title) {
    global $pax_seo_data;
    if (!empty($pax_seo_data['title'])) {
        return $pax_seo_data['title'];
    }
    return $title;
});

add_action('wp_head', function () {
    global $pax_seo_data, $pax_seo_jsonld;

    // Always declare the document language for the active i18n choice.
    echo '<meta name="pax-lang" content="' . esc_attr(pax_current_lang()) . '">' . "\n";

    if (!empty($pax_seo_data)) {
        if (!empty($pax_seo_data['title'])) {
            echo '<meta property="og:title" content="' . esc_attr($pax_seo_data['title']) . '">' . "\n";
        }
        if (!empty($pax_seo_data['description'])) {
            echo '<meta name="description" content="' . esc_attr($pax_seo_data['description']) . '">' . "\n";
            echo '<meta property="og:description" content="' . esc_attr($pax_seo_data['description']) . '">' . "\n";
        }
        if (!empty($pax_seo_data['canonical'])) {
            echo '<link rel="canonical" href="' . esc_url($pax_seo_data['canonical']) . '">' . "\n";
        }
        echo '<meta property="og:type" content="website">' . "\n";
    }

    if (!empty($pax_seo_jsonld)) {
        echo '<script type="application/ld+json">'
            . wp_json_encode($pax_seo_jsonld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            . '</script>' . "\n";
    }
}, 5);
