<?php
/**
 * header.php — emergency strip + navbar. Port of navbar.component.html.
 * Same markup + class names; routerLink targets become real WP URLs,
 * Angular signals become CSS :hover/:focus-within + nav.js for mobile.
 */
if (!defined('ABSPATH')) {
    exit;
}
$pax_services = pax_services();
$pax_categories = pax_shop_categories();
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="emergency-strip">
  <a href="tel:0745547530">📞 <?= esc_html(pax_t('common.nonStop')) ?>: <?= esc_html(pax_t('common.phone')) ?></a>
</div>

<header class="navbar">
  <div class="container navbar-inner">
    <a href="<?= esc_url(pax_home_url()) ?>" class="navbar-logo">
      <span class="logo-text">PAX</span>
      <span class="logo-sub">Casa Funerară</span>
    </a>

    <nav class="navbar-links" aria-label="<?= esc_attr(pax_t('nav.menu')) ?>" data-nav-links>
      <a href="<?= esc_url(pax_home_url()) ?>" class="nav-link<?= pax_nav_active('') ?>"><?= esc_html(pax_t('nav.home')) ?></a>

      <!-- Servicii Funerare — dropdown -->
      <div class="nav-group" data-nav-group="services">
        <div class="nav-group-trigger">
          <a href="<?= esc_url(pax_servicii_url()) ?>" class="nav-link<?= pax_nav_active('servicii-funerare') ?>" aria-haspopup="true">
            <?= esc_html(pax_t('nav.services')) ?>
            <svg class="nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <button type="button" class="group-toggle" data-group-toggle="services" aria-expanded="false" aria-label="<?= esc_attr(pax_t('nav.services')) ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        <div class="dropdown dropdown-services">
          <div class="dropdown-inner">
            <div class="dropdown-grid">
              <?php foreach ($pax_services as $s) : ?>
                <a href="<?= esc_url(pax_service_url($s['slug'])) ?>" class="dropdown-link">
                  <img src="<?= esc_url($s['icon']) ?>" alt="" width="22" height="22" loading="lazy">
                  <span><?= esc_html(pax_t($s['name'])) ?></span>
                </a>
              <?php endforeach; ?>
            </div>
            <a href="<?= esc_url(pax_servicii_url()) ?>" class="dropdown-all"><?= esc_html(pax_t('nav.allServices')) ?> →</a>
          </div>
        </div>
      </div>

      <!-- Magazin — dropdown -->
      <div class="nav-group" data-nav-group="shop">
        <div class="nav-group-trigger">
          <a href="<?= esc_url(pax_magazin_url()) ?>" class="nav-link<?= pax_nav_active('magazin') ?>" aria-haspopup="true">
            <?= esc_html(pax_t('nav.shop')) ?>
            <svg class="nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <button type="button" class="group-toggle" data-group-toggle="shop" aria-expanded="false" aria-label="<?= esc_attr(pax_t('nav.shop')) ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        <div class="dropdown dropdown-shop">
          <div class="dropdown-inner">
            <?php foreach ($pax_categories as $c) : ?>
              <a href="<?= esc_url(pax_magazin_url($c['id'])) ?>" class="dropdown-link"><?= esc_html(pax_t($c['labelKey'])) ?></a>
            <?php endforeach; ?>
            <a href="<?= esc_url(pax_magazin_url()) ?>" class="dropdown-all"><?= esc_html(pax_t('nav.allProducts')) ?> →</a>
          </div>
        </div>
      </div>

      <a href="<?= esc_url(pax_page_url('despre-noi')) ?>" class="nav-link<?= pax_nav_active('despre-noi') ?>"><?= esc_html(pax_t('nav.about')) ?></a>
      <a href="<?= esc_url(pax_page_url('contact')) ?>" class="nav-link<?= pax_nav_active('contact') ?>"><?= esc_html(pax_t('nav.contact')) ?></a>

      <div class="lang-switch">
        <a href="<?= pax_lang_url('ro') ?>" class="<?= pax_current_lang() === 'ro' ? 'active' : '' ?>">RO</a>
        <span aria-hidden="true">|</span>
        <a href="<?= pax_lang_url('hu') ?>" class="<?= pax_current_lang() === 'hu' ? 'active' : '' ?>">HU</a>
      </div>
    </nav>

    <div class="navbar-actions">
      <a href="<?= esc_url(pax_page_url('contact')) ?>" class="cta-btn-primary navbar-cta"><?= esc_html(pax_t('nav.cta')) ?></a>

      <?php $pax_cart_url = function_exists('wc_get_cart_url') ? wc_get_cart_url() : pax_magazin_url(); ?>
      <a href="<?= esc_url($pax_cart_url) ?>" class="cart-icon" aria-label="<?= esc_attr(pax_t('nav.cart')) ?>">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <?php $pax_count = pax_cart_count(); ?>
        <span class="cart-badge" data-cart-count<?= $pax_count > 0 ? '' : ' hidden' ?>><?= esc_html($pax_count) ?></span>
      </a>

      <button type="button" class="hamburger" data-hamburger aria-expanded="false" aria-label="<?= esc_attr(pax_t('nav.menu')) ?>">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<main>
