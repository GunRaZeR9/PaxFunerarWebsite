<?php
/**
 * i18n — plain PHP port of TranslationService + ngx-translate.
 *
 * Same two JSON files as the Angular build (assets/i18n/ro.json, hu.json),
 * same dot-keyed lookups. A cookie stands in for localStorage; ?lang= forces
 * a choice. Priority: explicit ?lang  ->  cookie  ->  browser Accept-Language
 * ->  RO default (matches PROJECT_PLAN.md's ngx-translate priority order).
 */

if (!defined('ABSPATH')) {
    exit;
}

const PAX_LANGS = ['ro', 'hu'];

/**
 * Resolve the active language for this request.
 * Sets the pax_lang cookie when ?lang= is supplied so subsequent loads stick.
 */
function pax_current_lang(): string {
    static $resolved = null;
    if ($resolved !== null) {
        return $resolved;
    }

    // 1. Explicit choice via ?lang=
    if (isset($_GET['lang']) && in_array($_GET['lang'], PAX_LANGS, true)) {
        $lang = $_GET['lang'];
        if (!headers_sent()) {
            setcookie('pax_lang', $lang, time() + YEAR_IN_SECONDS, '/');
        }
        $_COOKIE['pax_lang'] = $lang;
        return $resolved = $lang;
    }

    // 2. Stored cookie
    if (isset($_COOKIE['pax_lang']) && in_array($_COOKIE['pax_lang'], PAX_LANGS, true)) {
        return $resolved = $_COOKIE['pax_lang'];
    }

    // 3. Browser Accept-Language
    if (!empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $primary = strtolower(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2));
        if (in_array($primary, PAX_LANGS, true)) {
            return $resolved = $primary;
        }
    }

    // 4. Default
    return $resolved = 'ro';
}

/**
 * Load + memoise a language file.
 */
function pax_i18n_dict(string $lang): array {
    static $cache = [];
    if (isset($cache[$lang])) {
        return $cache[$lang];
    }
    $file = get_template_directory() . "/assets/i18n/{$lang}.json";
    if (!is_readable($file)) {
        return $cache[$lang] = [];
    }
    $data = json_decode(file_get_contents($file), true);
    return $cache[$lang] = is_array($data) ? $data : [];
}

/**
 * Translate a dot-keyed string, e.g. pax_t('nav.home').
 * Falls back to the raw key (easy to spot in the UI) when missing.
 */
function pax_t(string $key): string {
    $value = pax_i18n_dict(pax_current_lang());
    foreach (explode('.', $key) as $segment) {
        if (!is_array($value) || !array_key_exists($segment, $value)) {
            return $key;
        }
        $value = $value[$segment];
    }
    return is_string($value) ? $value : $key;
}

/**
 * Translate and return an array (for benefit lists, faq items, etc.).
 */
function pax_t_array(string $key): array {
    $value = pax_i18n_dict(pax_current_lang());
    foreach (explode('.', $key) as $segment) {
        if (!is_array($value) || !array_key_exists($segment, $value)) {
            return [];
        }
        $value = $value[$segment];
    }
    return is_array($value) ? $value : [];
}

/**
 * Build a URL on the current path that switches language (no JS needed).
 */
function pax_lang_url(string $lang): string {
    return esc_url(add_query_arg('lang', $lang));
}
