<?php
/**
 * template-parts/service-card.php — port of ServiceCardComponent.
 * Expects $args['service'] = a service array from pax_services().
 * Clicking the card opens its modal (data-modal-open = slug, wired by modals.js);
 * the inner "learn more" link routes to the detail page (stops propagation in JS).
 */
if (!defined('ABSPATH')) {
    exit;
}
$s = $args['service'] ?? null;
if (!$s) {
    return;
}
$name = pax_t($s['name']);
?>
<article
  class="service-card"
  role="button"
  tabindex="0"
  data-reveal
  data-modal-open="<?= esc_attr($s['slug']) ?>"
  aria-label="<?= esc_attr(pax_t('common.details') . ' ' . $name) ?>"
>
  <div class="card-icon">
    <img src="<?= esc_url($s['icon']) ?>" alt="" width="34" height="34" loading="lazy">
  </div>
  <h3 class="card-name"><?= esc_html($name) ?></h3>
  <p class="card-teaser"><?= esc_html(pax_t($s['teaser'])) ?></p>
  <a class="card-link" href="<?= esc_url(pax_service_url($s['slug'])) ?>" data-stop-prop>
    <?= esc_html(pax_t('common.learnMore')) ?> →
  </a>
</article>
