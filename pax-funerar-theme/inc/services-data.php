<?php
/**
 * services-data.php — literal port of services.data.ts.
 *
 * Only structure lives here (slug, icon, benefit count). All copy
 * (name / teaser / description / benefits) lives in assets/i18n/<lang>.json
 * under servicesData.<slug>.*, exactly as in the Angular build:
 *   name        -> servicesData.<slug>.name
 *   teaser      -> servicesData.<slug>.teaser
 *   description -> servicesData.<slug>.description
 *   benefits    -> servicesData.<slug>.b1 .. b{N}
 *
 * Order matters — it's the display order of the listing grid and the nav.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * @return array<int, array{slug:string, icon:string, name:string, teaser:string, description:string, benefits:string[]}>
 */
function pax_services(): array {
    static $services = null;
    if ($services !== null) {
        return $services;
    }

    // [ slug, icon filename, benefit count ] — mirrors svc() calls in services.data.ts
    $defs = [
        ['intocmirea-actelor',    'acte.svg',         4],
        ['transport-funerar',     'transport.svg',    4],
        ['imbalsamare',           'imbalsamare.svg',  4],
        ['servicii-ceremoniale',  'ceremonii.svg',    4],
        ['servicii-de-catering',  'catering.svg',     4],
        ['repatriere-decedati',   'repatriere.svg',   4],
        ['capela',                'capela.svg',        4],
        ['pregatire-loc-de-veci', 'loc-veci.svg',     4],
        ['incinerare',            'incinerare.svg',   4],
        ['fotoceramica',          'fotoceramica.svg', 4],
    ];

    $services = [];
    foreach ($defs as [$slug, $icon, $benefitCount]) {
        $base = "servicesData.{$slug}";
        $benefits = [];
        for ($i = 1; $i <= $benefitCount; $i++) {
            $benefits[] = "{$base}.b{$i}";
        }
        $services[] = [
            'slug'        => $slug,
            'icon'        => get_template_directory_uri() . '/assets/icons/' . $icon,
            'name'        => "{$base}.name",
            'teaser'      => "{$base}.teaser",
            'description' => "{$base}.description",
            'benefits'    => $benefits,
        ];
    }

    return $services;
}

/** Find one service by slug, or null. */
function pax_service_by_slug(string $slug): ?array {
    foreach (pax_services() as $service) {
        if ($service['slug'] === $slug) {
            return $service;
        }
    }
    return null;
}

/**
 * Shop categories — port of CATEGORIES from products.data.ts (drops 'all').
 * @return array<int, array{id:string, slug:string, labelKey:string}>
 */
function pax_shop_categories(): array {
    return [
        ['id' => 'coroane',     'slug' => 'coroane',     'labelKey' => 'shop.cat.coroane'],
        ['id' => 'jerbe',       'slug' => 'jerbe',       'labelKey' => 'shop.cat.jerbe'],
        ['id' => 'aranjamente', 'slug' => 'aranjamente', 'labelKey' => 'shop.cat.aranjamente'],
        ['id' => 'buchete',     'slug' => 'buchete',     'labelKey' => 'shop.cat.buchete'],
    ];
}

/** Legal pages — port of FooterComponent.legalLinks. */
function pax_legal_links(): array {
    return [
        ['slug' => 'politica-de-confidentialitate', 'label' => 'legal.confidentialitate.navTitle'],
        ['slug' => 'politica-de-cookies',           'label' => 'legal.cookies.navTitle'],
        ['slug' => 'termeni-si-conditii',           'label' => 'legal.termeni.navTitle'],
        ['slug' => 'politica-de-reclamatii',        'label' => 'legal.reclamatii.navTitle'],
        ['slug' => 'politica-clienti',              'label' => 'legal.clienti.navTitle'],
    ];
}
