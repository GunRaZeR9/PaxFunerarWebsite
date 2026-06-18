<?php
/**
 * template-parts/service-modal.php — port of ServiceDetailModalComponent.
 * Rendered hidden alongside each card (per WORDPRESS_CONVERSION_PLAN.md's
 * card→modal pattern). data-modal = slug links it to its trigger.
 * Expects $args['service'].
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
<div class="pax-modal" data-modal="<?= esc_attr($s['slug']) ?>" hidden>
  <div class="modal-overlay" data-modal-close tabindex="-1" aria-hidden="true"></div>

  <div class="modal-panel" role="dialog" aria-modal="true" aria-label="<?= esc_attr($name) ?>" tabindex="0">
    <button class="modal-close" type="button" data-modal-close aria-label="<?= esc_attr(pax_t('common.close')) ?>">✕</button>

    <div class="modal-body">
      <h2 class="modal-title"><?= esc_html($name) ?></h2>
      <p class="modal-description"><?= esc_html(pax_t($s['description'])) ?></p>

      <?php if (!empty($s['benefits'])) : ?>
        <ul class="modal-benefits">
          <?php foreach ($s['benefits'] as $b) : ?>
            <li><span class="benefit-check" aria-hidden="true">✓</span> <?= esc_html(pax_t($b)) ?></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
    </div>

    <div class="modal-footer">
      <a href="<?= esc_url(add_query_arg('service', $s['slug'], pax_page_url('contact'))) ?>" class="cta-btn-primary">
        <?= esc_html(pax_t('common.requestService')) ?>
      </a>
      <a href="tel:0745547530" class="cta-btn-ghost">☎ 0745 547 530</a>
    </div>
  </div>
</div>
