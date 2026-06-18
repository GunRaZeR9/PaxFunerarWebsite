<?php
/**
 * template-parts/faq-accordion.php — port of FaqAccordionComponent.
 * Expects $args['items'] = [ ['question'=>key, 'answer'=>key], ... ].
 * Toggle behaviour (add/remove .open on .faq-item) is wired in nav.js.
 */
if (!defined('ABSPATH')) {
    exit;
}
$items = $args['items'] ?? [];
if (!$items) {
    return;
}
?>
<div class="faq-list">
  <?php foreach ($items as $item) : ?>
    <div class="faq-item" data-accordion-item>
      <button type="button" class="faq-question" data-accordion-toggle aria-expanded="false">
        <span><?= esc_html(pax_t($item['question'])) ?></span>
        <svg class="faq-chevron" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div class="faq-answer-wrap" aria-hidden="true">
        <div class="faq-answer-inner">
          <p class="faq-answer"><?= esc_html(pax_t($item['answer'])) ?></p>
        </div>
      </div>
    </div>
  <?php endforeach; ?>
</div>
