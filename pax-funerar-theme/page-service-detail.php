<?php
/**
 * Template Name: Service Detail
 *
 * page-service-detail.php — port of service-detail.component.html.
 * Assigned to the 10 service child pages (slug = service slug) via
 * Page Attributes → Template.
 *
 * Option B content model:
 *   - H1 / teaser / benefits / description default to the bilingual i18n values
 *     (so RO+HU work out of the box, identical to the Angular build), and are
 *     OVERRIDDEN per-page when the admin fills the editor / meta box:
 *       description -> the_content()         (else servicesData.<slug>.description)
 *       teaser      -> meta pax_teaser       (else servicesData.<slug>.teaser)
 *       benefits    -> meta pax_benefits     (one per line; else b1..bN)
 *   - The long-form sections (items/why/extras/shapes/conclusion) stay i18n.
 */
if (!defined('ABSPATH')) {
    exit;
}

$GLOBALS['pax_body_class'] = 'page-service-detail';

$post_id = get_the_ID();
$slug    = get_post_field('post_name', $post_id);
$service = pax_service_by_slug($slug);
$page    = pax_service_page_content($slug);

if (!$service) {
    pax_seo(pax_t('serviceDetail.notFound'), pax_t('serviceDetail.notFound'));
    get_header();
    ?>
    <div class="container not-found">
      <h1><?= esc_html(pax_t('serviceDetail.notFound')) ?></h1>
      <a href="<?= esc_url(pax_servicii_url()) ?>" class="cta-btn-primary"><?= esc_html(pax_t('serviceDetail.back')) ?></a>
    </div>
    <?php
    get_footer();
    return;
}

$name = pax_t($service['name']);

// Teaser — meta override else i18n.
$teaser_meta = trim((string) get_post_meta($post_id, 'pax_teaser', true));
$teaser      = $teaser_meta !== '' ? $teaser_meta : pax_t($service['teaser']);

// Benefits — meta (one per line) override else i18n keys.
$benefits_meta = trim((string) get_post_meta($post_id, 'pax_benefits', true));
if ($benefits_meta !== '') {
    $benefits = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $benefits_meta))));
} else {
    $benefits = array_map('pax_t', $service['benefits']);
}

// Description — the_content() override else i18n.
$content_raw  = get_post_field('post_content', $post_id);
$has_content  = trim(wp_strip_all_tags($content_raw)) !== '';

pax_seo(
    "{$name} Târgu Mureș | Casa Funerară PAX",
    pax_t($service['teaser']) . ' Casa Funerară PAX, Târgu Mureș. ☎ 0745 547 530',
    home_url('/servicii-funerare/' . $slug . '/')
);

get_header();
?>

<section class="detail-hero">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="<?= esc_url(pax_home_url()) ?>"><?= esc_html(pax_t('nav.home')) ?></a>
      <span aria-hidden="true">›</span>
      <a href="<?= esc_url(pax_servicii_url()) ?>"><?= esc_html(pax_t('nav.services')) ?></a>
      <span aria-hidden="true">›</span>
      <span><?= esc_html($name) ?></span>
    </nav>
    <h1 class="detail-title reveal-hidden"><?= esc_html($name) ?></h1>
    <p class="detail-teaser reveal-hidden"><?= esc_html($teaser) ?></p>
    <?php if ($page) : ?>
      <p class="detail-intro reveal-hidden"><?= esc_html(pax_t($page['heroIntro'])) ?></p>
    <?php endif; ?>
  </div>
</section>

<section class="detail-body">
  <div class="container detail-grid">
    <div class="detail-content">
      <?php if ($has_content) : ?>
        <div class="detail-description" data-reveal><?php echo apply_filters('the_content', $content_raw); ?></div>
      <?php else : ?>
        <p class="detail-description" data-reveal><?= esc_html(pax_t($service['description'])) ?></p>
      <?php endif; ?>

      <?php if ($page) : ?>
        <p class="body-intro" data-reveal><?= esc_html(pax_t($page['bodyIntro'])) ?></p>

        <ol class="item-blocks">
          <?php foreach ($page['items'] as $index => $item) : ?>
            <li class="item-block" data-reveal>
              <span class="item-number" aria-hidden="true"><?= esc_html($index + 1) ?></span>
              <div class="item-body">
                <h2 class="item-title"><?= esc_html(pax_t($item['title'])) ?></h2>
                <p class="item-text"><?= esc_html(pax_t($item['text'])) ?></p>
              </div>
            </li>
          <?php endforeach; ?>
        </ol>

        <?php if (!empty($page['why'])) : ?>
          <div class="why-section" data-reveal>
            <h2 class="section-title"><?= esc_html(pax_t('serviceDetail.whyTitle')) ?></h2>
            <ul class="check-list">
              <?php foreach ($page['why'] as $w) : ?>
                <li><span class="benefit-check" aria-hidden="true">✓</span> <?= esc_html(pax_t($w)) ?></li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endif; ?>

        <?php if (!empty($page['extras'])) : ?>
          <div class="extras-section" data-reveal>
            <h2 class="section-title"><?= esc_html(pax_t('serviceDetail.extrasTitle')) ?></h2>
            <div class="extras-grid">
              <?php foreach ($page['extras'] as $e) : ?>
                <article class="extra-card">
                  <h3><?= esc_html(pax_t($e['title'])) ?></h3>
                  <p><?= esc_html(pax_t($e['text'])) ?></p>
                </article>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>

        <?php if (!empty($page['shapesTitle'])) : ?>
          <div class="shapes-section" data-reveal>
            <h2 class="section-title"><?= esc_html(pax_t($page['shapesTitle'])) ?></h2>
            <ul class="shapes-grid">
              <?php foreach ($page['shapes'] as $shape) : ?>
                <li class="shape-chip"><?= esc_html(pax_t($shape)) ?></li>
              <?php endforeach; ?>
            </ul>
            <div class="cta-row">
              <?php if (!empty($page['orderCta'])) : ?>
                <a href="<?= esc_url(add_query_arg('service', $slug, pax_page_url('contact'))) ?>" class="cta-btn-primary"><?= esc_html(pax_t($page['orderCta'])) ?></a>
              <?php endif; ?>
              <?php if (!empty($page['contactCta'])) : ?>
                <a href="tel:0745547530" class="cta-btn-ghost"><?= esc_html(pax_t($page['contactCta'])) ?></a>
              <?php endif; ?>
            </div>
          </div>
        <?php endif; ?>
      <?php endif; ?>

      <?php if (!empty($benefits)) : ?>
        <h2 class="benefits-title"><?= esc_html(pax_t('serviceDetail.includes')) ?></h2>
        <ul class="benefits-list">
          <?php foreach ($benefits as $b) : ?>
            <li><span class="benefit-check" aria-hidden="true">✓</span> <?= esc_html($b) ?></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>

      <?php if ($page && !empty($page['conclusion'])) : ?>
        <aside class="conclusion-callout" data-reveal>
          <p><?= esc_html(pax_t($page['conclusion'])) ?></p>
        </aside>
      <?php endif; ?>
    </div>

    <aside class="detail-cta-box">
      <h3><?= esc_html(pax_t('serviceDetail.helpTitle')) ?></h3>
      <p><?= esc_html(pax_t('serviceDetail.helpText')) ?></p>
      <a href="<?= esc_url(add_query_arg('service', $slug, pax_page_url('contact'))) ?>" class="cta-btn-primary"><?= esc_html(pax_t('common.requestService')) ?></a>
      <a href="tel:0745547530" class="cta-btn-ghost">☎ 0745 547 530</a>
      <a href="tel:0745647530" class="cta-btn-ghost">☎ 0745 647 530</a>
    </aside>
  </div>
</section>

<section class="faq-band">
  <div class="container faq-inner" data-reveal>
    <p class="faq-subtitle"><?= esc_html(pax_t('serviceDetail.faqSubtitle')) ?></p>
    <a href="tel:0745547530" class="cta-btn-primary"><?= esc_html(pax_t('serviceDetail.faqCta')) ?></a>
  </div>
</section>

<section class="back-section">
  <div class="container">
    <a href="<?= esc_url(pax_servicii_url()) ?>" class="back-link"><?= esc_html(pax_t('serviceDetail.backAll')) ?></a>
  </div>
</section>

<?php
get_footer();
