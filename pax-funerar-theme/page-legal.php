<?php
/**
 * Template Name: Legal Page
 *
 * page-legal.php — port of LegalComponent. Assigned to the 5 legal pages
 * (slug must match a key in pax_legal_pages()). Content is structured i18n
 * under legal.<ns>.* — identical to the Angular build.
 */
if (!defined('ABSPATH')) {
    exit;
}

$slug = get_post_field('post_name', get_the_ID());
$spec = pax_legal_pages($slug);

$GLOBALS['pax_body_class'] = 'page-legal';

if (!$spec) {
    // Not one of the known legal slugs — fall back to the generic page body.
    pax_seo(get_the_title(), wp_strip_all_tags(get_the_excerpt()), get_permalink());
    get_header();
    echo '<section class="legal-body"><div class="container legal-content">';
    while (have_posts()) {
        the_post();
        the_content();
    }
    echo '</div></section>';
    get_footer();
    return;
}

$base  = 'legal.' . $spec['ns'];
$title = pax_t($base . '.pageTitle');

pax_seo(
    $title . ' | Casa Funerară PAX',
    $title . ' — Casa Funerară PAX Târgu Mureș',
    get_permalink()
);

get_header();
?>

<section class="page-hero">
  <div class="container">
    <h1><?= esc_html($title) ?></h1>
    <?php if (!empty($spec['subtitle'])) : ?>
      <p class="legal-subtitle"><?= esc_html(pax_t($base . '.' . $spec['subtitle'])) ?></p>
    <?php endif; ?>
    <p class="legal-updated"><?= esc_html(pax_t($base . '.lastUpdate')) ?></p>
  </div>
</section>

<section class="legal-body">
  <div class="container legal-content">
    <p class="legal-intro"><?= esc_html(pax_t($base . '.intro')) ?></p>

    <?php foreach ($spec['sections'] as $section) : ?>
      <?php if (!empty($section['title'])) : ?>
        <?php if (!empty($section['sub'])) : ?>
          <h3><?= esc_html(pax_t($base . '.' . $section['title'])) ?></h3>
        <?php else : ?>
          <h2><?= esc_html(pax_t($base . '.' . $section['title'])) ?></h2>
        <?php endif; ?>
      <?php endif; ?>

      <?php foreach ($section['paragraphs'] ?? [] as $key) : ?>
        <p><?= esc_html(pax_t($base . '.' . $key)) ?></p>
      <?php endforeach; ?>

      <?php if (!empty($section['items'])) : ?>
        <ul>
          <?php foreach ($section['items'] as $key) : ?>
            <li><?= esc_html(pax_t($base . '.' . $key)) ?></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>

      <?php foreach ($section['after'] ?? [] as $key) : ?>
        <p><?= esc_html(pax_t($base . '.' . $key)) ?></p>
      <?php endforeach; ?>
    <?php endforeach; ?>

    <?php foreach ($spec['closing'] ?? [] as $key) : ?>
      <p class="legal-closing"><?= esc_html(pax_t($base . '.' . $key)) ?></p>
    <?php endforeach; ?>
  </div>
</section>

<div class="container back-section">
  <a href="<?= esc_url(pax_home_url()) ?>" class="back-link">← <?= esc_html(pax_t('nav.home')) ?></a>
</div>

<?php
get_footer();
