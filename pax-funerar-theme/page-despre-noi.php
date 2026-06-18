<?php
/**
 * page-despre-noi.php — port of despre-noi.component.html.
 */
if (!defined('ABSPATH')) {
    exit;
}

$GLOBALS['pax_body_class'] = 'page-despre';
pax_seo(
    'Despre Noi | Casa Funerară PAX Târgu Mureș',
    'Casa Funerară PAX — cu ani de experiență în Târgu Mureș. Înțelegere și îndrumare în fiecare pas al drumului.',
    home_url('/despre-noi/')
);

$story_blocks = ['history', 'commitment', 'achievements', 'future'];
$values = [
    ['id' => 'respect',         'icon' => '🙏'],
    ['id' => 'compassion',      'icon' => '❤'],
    ['id' => 'professionalism', 'icon' => '⭐'],
    ['id' => 'integrity',       'icon' => '⚖'],
    ['id' => 'empathy',         'icon' => '🤝'],
    ['id' => 'availability',    'icon' => '🕐'],
    ['id' => 'discretion',      'icon' => '🔒'],
    ['id' => 'experience',      'icon' => '🏛'],
];
$testimonials = pax_testimonial_keys();

get_header();
?>

<section class="page-hero">
  <img class="hero-bg" src="<?= esc_url(pax_asset('assets/photos/about-us/about_us_hero.png')) ?>" alt="" aria-hidden="true">
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="container">
    <h1 class="page-hero-title reveal-hidden"><?= esc_html(pax_t('about.title')) ?></h1>
    <p class="page-hero-tagline reveal-hidden"><?= esc_html(pax_t('about.tagline')) ?></p>
    <p class="page-hero-motto reveal-hidden">✝ <?= esc_html(pax_t('about.tagline2')) ?></p>
    <p class="page-hero-intro reveal-hidden"><?= esc_html(pax_t('about.heroIntro')) ?></p>
  </div>
</section>

<section class="support-section" data-reveal>
  <div class="container">
    <div class="support-card">
      <h2><?= esc_html(pax_t('about.supportTitle')) ?></h2>
      <p><?= esc_html(pax_t('about.supportText')) ?></p>
    </div>
  </div>
</section>

<section class="about-section">
  <div class="container">
    <div class="about-text" data-reveal>
      <h2><?= esc_html(pax_t('about.whoTitle')) ?></h2>
      <p><?= esc_html(pax_t('about.p1')) ?></p>
      <p><?= esc_html(pax_t('about.p2')) ?></p>
      <p><?= esc_html(pax_t('about.p3')) ?></p>
    </div>
  </div>
</section>

<section class="story-section">
  <div class="container">
    <div class="story-grid">
      <?php foreach ($story_blocks as $i => $block) : ?>
        <article class="story-card" data-reveal data-reveal-delay="<?= esc_attr($i * 100) ?>">
          <h2><?= esc_html(pax_t("about.{$block}Title")) ?></h2>
          <p><?= esc_html(pax_t("about.{$block}Text")) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="values-section">
  <div class="container">
    <h2 class="section-title" data-reveal><?= esc_html(pax_t('about.valuesTitle')) ?></h2>
    <div class="values-grid" data-reveal data-reveal-delay="100">
      <?php foreach ($values as $value) : ?>
        <div class="value-card">
          <span class="value-icon" aria-hidden="true"><?= esc_html($value['icon']) ?></span>
          <h3><?= esc_html(pax_t("about.values.{$value['id']}.title")) ?></h3>
          <p><?= esc_html(pax_t("about.values.{$value['id']}.text")) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="testimonials-section" data-reveal>
  <div class="container">
    <h2 class="section-title"><?= esc_html(pax_t('testimonials.title')) ?></h2>
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

<section class="cta-section" data-reveal>
  <div class="container cta-inner">
    <h2><?= esc_html(pax_t('about.cta.title')) ?></h2>
    <p><?= esc_html(pax_t('about.cta.text')) ?></p>
    <div class="cta-buttons">
      <a href="tel:0745547530" class="cta-btn-primary">☎ <?= esc_html(pax_t('common.phone')) ?></a>
      <a href="<?= esc_url(pax_page_url('contact')) ?>" class="cta-btn-ghost"><?= esc_html(pax_t('about.cta.button')) ?></a>
    </div>
  </div>
</section>

<?php
get_footer();
