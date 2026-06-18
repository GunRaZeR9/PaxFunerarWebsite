<?php
/**
 * front-page.php — port of home.component.html.
 * Hero items keep .reveal-hidden (animated on load by animations.js);
 * scroll-revealed blocks use data-reveal (reveal.js IntersectionObserver).
 */
if (!defined('ABSPATH')) {
    exit;
}

$GLOBALS['pax_body_class'] = 'page-home';
pax_seo(
    'Casa Funerară PAX — Servicii Funerare Complete în Târgu Mureș',
    'Servicii funerare complete în Târgu Mureș, non-stop: transport funerar, îmbălsămare, ceremonii, repatriere, fotoceramică. ☎ 0745 547 530',
    home_url('/')
);
pax_seo_jsonld(pax_funeral_home_schema());

$teaser_services = pax_teaser_services();
$quick_links     = pax_hero_quick_links();
$guide_steps     = pax_guide_steps();
$testimonials    = pax_testimonial_keys();

get_header();
?>

<section class="hero">
  <img class="hero-bg" src="<?= esc_url(pax_asset('assets/photos/home/home_hero.png')) ?>" alt="" aria-hidden="true">
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="container hero-content">
    <p class="hero-kicker reveal-hidden"><?= esc_html(pax_t('common.nonStop')) ?> · Târgu Mureș</p>
    <h1 class="hero-title reveal-hidden"><?= esc_html(pax_t('home.hero.title')) ?></h1>
    <p class="hero-subtitle reveal-hidden"><?= esc_html(pax_t('home.hero.subtitle')) ?></p>
    <div class="ornament-divider hero-divider reveal-hidden" aria-hidden="true"><span></span></div>
    <p class="hero-description reveal-hidden"><?= esc_html(pax_t('home.hero.description')) ?></p>
    <div class="hero-actions reveal-hidden">
      <a href="tel:0745547530" class="cta-btn-primary">☎ <?= esc_html(pax_t('common.phone')) ?></a>
      <a href="<?= esc_url(pax_servicii_url()) ?>" class="cta-btn-ghost"><?= esc_html(pax_t('home.hero.btn1')) ?></a>
      <a href="<?= esc_url(pax_magazin_url()) ?>" class="cta-btn-ghost"><?= esc_html(pax_t('home.hero.btn2')) ?></a>
    </div>
    <nav class="hero-quick reveal-hidden" aria-label="Servicii populare">
      <?php foreach ($quick_links as $q) : ?>
        <a href="<?= esc_url(pax_service_url($q['slug'])) ?>" class="hero-quick-link">
          <img src="<?= esc_url($q['icon']) ?>" alt="" width="22" height="22">
          <span><?= esc_html(pax_t($q['name'])) ?></span>
        </a>
      <?php endforeach; ?>
    </nav>
  </div>
</section>

<section class="services-section">
  <div class="container">
    <h2 class="section-title" data-reveal><?= esc_html(pax_t('home.services.title')) ?></h2>
    <p class="section-subtitle" data-reveal><?= esc_html(pax_t('home.services.subtitle')) ?></p>
    <div class="services-grid">
      <?php foreach ($teaser_services as $service) : ?>
        <?php get_template_part('template-parts/service-card', null, ['service' => $service]); ?>
      <?php endforeach; ?>
    </div>
    <div class="services-more" data-reveal>
      <a href="<?= esc_url(pax_servicii_url()) ?>" class="cta-btn-ghost"><?= esc_html(pax_t('home.services.all')) ?></a>
    </div>
  </div>
</section>

<section class="guide-section">
  <div class="container">
    <h2 class="section-title" data-reveal><?= esc_html(pax_t('home.guide.title')) ?></h2>
    <div class="ornament-divider" aria-hidden="true"><span></span></div>
    <p class="section-subtitle" data-reveal><?= esc_html(pax_t('home.guide.subtitle')) ?></p>
    <ol class="guide-steps">
      <?php foreach ($guide_steps as $step) : ?>
        <li class="guide-step" data-reveal>
          <span class="guide-step-number" aria-hidden="true"><?= esc_html($step['n']) ?></span>
          <div class="guide-step-body">
            <h3 class="guide-step-title"><?= esc_html(pax_t($step['title'])) ?></h3>
            <p class="guide-step-text"><?= esc_html(pax_t($step['text'])) ?></p>
            <?php if (!empty($step['items'])) : ?>
              <ul class="guide-step-list">
                <?php foreach ($step['items'] as $item) : ?>
                  <li><?= esc_html(pax_t($item)) ?></li>
                <?php endforeach; ?>
              </ul>
            <?php endif; ?>
          </div>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>

<section class="about-teaser">
  <div class="container about-teaser-inner" data-reveal>
    <h2 class="section-title"><?= esc_html(pax_t('home.about.title')) ?></h2>
    <p class="about-tagline"><?= esc_html(pax_t('home.about.tagline')) ?></p>
    <p class="about-text"><?= esc_html(pax_t('home.about.text')) ?></p>
    <a href="<?= esc_url(pax_page_url('despre-noi')) ?>" class="cta-btn-ghost"><?= esc_html(pax_t('home.about.cta')) ?></a>
  </div>
</section>

<section class="testimonials-section" data-reveal>
  <div class="container">
    <h2 class="section-title"><?= esc_html(pax_t('testimonials.title')) ?></h2>
    <div class="ornament-divider" aria-hidden="true"><span></span></div>
    <div class="testimonials-grid">
      <?php foreach ($testimonials as $t) : ?>
        <blockquote class="testimonial">
          <p><?= esc_html(pax_t("testimonials.{$t}.text")) ?></p>
          <footer><?= esc_html(pax_t("testimonials.{$t}.author")) ?></footer>
        </blockquote>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="faq-section">
  <div class="container faq-container" data-reveal>
    <h2 class="section-title"><?= esc_html(pax_t('home.faqTitle')) ?></h2>
    <div class="ornament-divider" aria-hidden="true"><span></span></div>
    <?php get_template_part('template-parts/faq-accordion', null, ['items' => pax_faq_items()]); ?>
    <p class="faq-cta">
      <?= esc_html(pax_t('home.faqCta')) ?>
      <a href="tel:0745547530">☎ <?= esc_html(pax_t('common.phone')) ?></a>
    </p>
  </div>
</section>

<section class="cta-banner" data-reveal>
  <div class="container cta-inner">
    <div>
      <h2><?= esc_html(pax_t('home.ctaSection.title')) ?></h2>
      <p><?= esc_html(pax_t('home.ctaSection.text')) ?></p>
    </div>
    <div class="cta-actions">
      <a href="tel:0745547530" class="cta-btn-dark">☎ <?= esc_html(pax_t('home.ctaSection.btn1')) ?></a>
      <a href="<?= esc_url(pax_page_url('contact')) ?>" class="cta-btn-dark cta-btn-dark--outline"><?= esc_html(pax_t('home.ctaSection.btn2')) ?></a>
    </div>
  </div>
</section>

<?php
// Hidden modals for the teaser service cards (card→modal pattern).
foreach ($teaser_services as $service) {
    get_template_part('template-parts/service-modal', null, ['service' => $service]);
}

get_footer();
