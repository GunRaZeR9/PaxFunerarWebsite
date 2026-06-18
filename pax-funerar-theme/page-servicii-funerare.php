<?php
/**
 * page-servicii-funerare.php — port of servicii-funerare.component.html.
 * Assigned to the "Servicii Funerare" parent page (slug servicii-funerare).
 */
if (!defined('ABSPATH')) {
    exit;
}

$GLOBALS['pax_body_class'] = 'page-servicii';
pax_seo(
    'Servicii Funerare Târgu Mureș | Casa Funerară PAX',
    'Servicii funerare complete în Târgu Mureș: transport funerar, îmbălsămare, ceremonii, repatriere, incinerare, capelă, fotoceramică. ☎ 0745 547 530',
    home_url('/servicii-funerare/')
);

$services = pax_services();

get_header();
?>

<section class="page-hero">
  <img class="hero-bg" src="<?= esc_url(pax_asset('assets/photos/services/services_hero.png')) ?>" alt="" aria-hidden="true">
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="container">
    <h1 class="page-hero-title reveal-hidden"><?= esc_html(pax_t('services.title')) ?></h1>
    <p class="page-hero-desc reveal-hidden"><?= esc_html(pax_t('services.desc')) ?></p>
  </div>
</section>

<section class="services-section">
  <div class="container">
    <div class="services-grid">
      <?php foreach ($services as $service) : ?>
        <?php get_template_part('template-parts/service-card', null, ['service' => $service]); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="cta-banner" data-reveal>
  <div class="container cta-inner">
    <div>
      <h2><?= esc_html(pax_t('ctaBanner.title')) ?></h2>
      <p><?= esc_html(pax_t('ctaBanner.text')) ?></p>
    </div>
    <a href="tel:0745547530" class="cta-btn-dark">☎ <?= esc_html(pax_t('common.phone')) ?></a>
  </div>
</section>

<?php
foreach ($services as $service) {
    get_template_part('template-parts/service-modal', null, ['service' => $service]);
}

get_footer();
