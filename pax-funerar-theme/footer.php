<?php
/**
 * footer.php — footer + phone-sticky + cookie consent.
 * Ports footer.component.html, phone-sticky.component.html,
 * cookie-consent.component.html. Closes <main> opened in header.php.
 */
if (!defined('ABSPATH')) {
    exit;
}
$pax_service_links = array_slice(pax_services(), 0, 6);
$pax_legal_links   = pax_legal_links();
?>
</main>

<footer class="footer">
  <div class="container footer-grid">
    <div class="footer-col footer-brand">
      <span class="footer-logo">PAX</span>
      <p class="footer-tagline"><?= esc_html(pax_t('about.tagline')) ?></p>
      <p class="footer-description"><?= esc_html(pax_t('footer.description')) ?></p>
      <p><?= esc_html(pax_t('footer.address')) ?></p>
      <p>
        <a href="tel:0745547530">0745 547 530</a> ·
        <a href="tel:0745647530">0745 647 530</a>
      </p>
      <p><a href="mailto:contact@paxfunerar.ro"><?= esc_html(pax_t('footer.email')) ?></a></p>
      <p class="footer-nonstop"><?= esc_html(pax_t('common.nonStop')) ?> · 24/7</p>
    </div>

    <nav class="footer-col" aria-label="<?= esc_attr(pax_t('footer.servicesTitle')) ?>">
      <h3 class="footer-heading"><?= esc_html(pax_t('footer.servicesTitle')) ?></h3>
      <?php foreach ($pax_service_links as $s) : ?>
        <a href="<?= esc_url(pax_service_url($s['slug'])) ?>"><?= esc_html(pax_t($s['name'])) ?></a>
      <?php endforeach; ?>
      <a href="<?= esc_url(pax_servicii_url()) ?>" class="footer-all"><?= esc_html(pax_t('nav.allServices')) ?> →</a>
    </nav>

    <nav class="footer-col" aria-label="<?= esc_attr(pax_t('footer.usefulLinks')) ?>">
      <h3 class="footer-heading"><?= esc_html(pax_t('footer.usefulLinks')) ?></h3>
      <a href="<?= esc_url(pax_magazin_url()) ?>"><?= esc_html(pax_t('nav.shop')) ?></a>
      <a href="<?= esc_url(pax_page_url('despre-noi')) ?>"><?= esc_html(pax_t('nav.about')) ?></a>
      <a href="<?= esc_url(pax_page_url('contact')) ?>"><?= esc_html(pax_t('nav.contact')) ?></a>
    </nav>

    <nav class="footer-col" aria-label="<?= esc_attr(pax_t('footer.legalTitle')) ?>">
      <h3 class="footer-heading"><?= esc_html(pax_t('footer.legalTitle')) ?></h3>
      <?php foreach ($pax_legal_links as $l) : ?>
        <a href="<?= esc_url(pax_page_url($l['slug'])) ?>"><?= esc_html(pax_t($l['label'])) ?></a>
      <?php endforeach; ?>
    </nav>
  </div>

  <div class="footer-bottom">
    <div class="ornament-divider" aria-hidden="true"><span></span></div>
    <p>© <?= esc_html(date('Y')) ?> <?= esc_html(pax_t('footer.company')) ?> — <?= esc_html(pax_t('footer.rights')) ?></p>
    <p class="footer-sal">
      <?= esc_html(pax_t('footer.salText')) ?>
      <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener">ANPC — SAL</a> ·
      <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">SOL (ODR)</a>
    </p>
  </div>
</footer>

<!-- phone-sticky.component.html -->
<div class="phone-sticky">
  <a href="https://wa.me/40745547530" target="_blank" rel="noopener noreferrer" class="sticky-btn whatsapp" aria-label="<?= esc_attr(pax_t('phoneSticky.whatsapp')) ?>">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"/>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.34A10 10 0 1 0 12 2zm0 18.3c-1.5 0-2.96-.4-4.24-1.16l-.3-.18-3.13.84.84-3.06-.2-.31A8.3 8.3 0 1 1 12 20.3z"/>
    </svg>
    <span class="sticky-label"><?= esc_html(pax_t('phoneSticky.whatsappLabel')) ?></span>
  </a>
  <a href="tel:0745547530" class="sticky-btn phone" aria-label="<?= esc_attr(pax_t('phoneSticky.call')) ?>">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
    <span class="sticky-label"><?= esc_html(pax_t('phoneSticky.callLabel')) ?></span>
  </a>
</div>

<!-- cookie-consent.component.html — shown until accepted (toggled by nav.js via the pax_cookie cookie) -->
<div class="cookie-banner" role="region" aria-label="<?= esc_attr(pax_t('cookie.title')) ?>" data-cookie-banner hidden>
  <p>
    <?= esc_html(pax_t('cookie.text')) ?>
    <a href="<?= esc_url(pax_page_url('politica-de-cookies')) ?>"><?= esc_html(pax_t('cookie.more')) ?></a>
  </p>
  <button type="button" class="cta-btn-primary cookie-accept" data-cookie-accept><?= esc_html(pax_t('cookie.accept')) ?></button>
</div>

<?php wp_footer(); ?>
</body>
</html>
