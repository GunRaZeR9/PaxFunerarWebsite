<?php
/**
 * page-contact.php — port of contact.component.html + the reactive form.
 * POST is handled before any output so the handler can redirect.
 */
if (!defined('ABSPATH')) {
    exit;
}

pax_handle_contact_form(); // may redirect + exit

$GLOBALS['pax_body_class'] = 'page-contact';
pax_seo(
    'Contact | Casa Funerară PAX Târgu Mureș',
    'Contactați Casa Funerară PAX Târgu Mureș. Suntem disponibili non-stop. ☎ 0745 547 530 | contact@paxfunerar.ro',
    home_url('/contact/')
);
pax_seo_jsonld(pax_funeral_home_schema());

$service_options  = pax_service_options();
$selected_service = sanitize_text_field(wp_unslash($_GET['service'] ?? pax_contact_old('service')));

get_header();
?>

<section class="page-hero">
  <img class="hero-bg" src="<?= esc_url(pax_asset('assets/photos/contact/contact_hero.png')) ?>" alt="" aria-hidden="true">
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="container">
    <h1 class="page-hero-title reveal-hidden"><?= esc_html(pax_t('contact.title')) ?></h1>
    <p class="reveal-hidden"><?= esc_html(pax_t('contact.subtitle')) ?></p>
  </div>
</section>

<section class="contact-section">
  <div class="container contact-grid">

    <div class="contact-info" data-reveal>
      <h2><?= esc_html(pax_t('contact.info.title')) ?></h2>

      <div class="info-item">
        <span class="info-icon" aria-hidden="true">📞</span>
        <div>
          <strong><?= esc_html(pax_t('contact.info.phone')) ?></strong>
          <a href="tel:0745547530">0745 547 530</a>
          <a href="tel:0745647530">0745 647 530</a>
          <a href="tel:0741115864"><?= esc_html(pax_t('contact.info.phoneFloral')) ?></a>
        </div>
      </div>

      <div class="info-item">
        <span class="info-icon" aria-hidden="true">✉️</span>
        <div>
          <strong><?= esc_html(pax_t('contact.info.email')) ?></strong>
          <a href="mailto:contact@paxfunerar.ro">contact&#64;paxfunerar.ro</a>
        </div>
      </div>

      <div class="info-item">
        <span class="info-icon" aria-hidden="true">📍</span>
        <div>
          <strong><?= esc_html(pax_t('contact.info.address')) ?></strong>
          <span><?= esc_html(pax_t('contact.info.addressLine1')) ?></span>
          <span><?= esc_html(pax_t('contact.info.addressLine2')) ?></span>
        </div>
      </div>

      <div class="info-item">
        <span class="info-icon" aria-hidden="true">🕐</span>
        <div>
          <strong><?= esc_html(pax_t('contact.info.schedule')) ?></strong>
          <span><?= esc_html(pax_t('contact.info.scheduleValue')) ?></span>
        </div>
      </div>

      <a href="https://wa.me/40745547530" target="_blank" rel="noopener noreferrer" class="whatsapp-btn">💬 WhatsApp</a>
    </div>

    <div class="contact-form-wrap" data-reveal data-reveal-delay="100">
      <?php if (pax_contact_sent()) : ?>
        <div class="success-msg">
          <span aria-hidden="true">✓</span>
          <h3><?= esc_html(pax_t('contact.success.title')) ?></h3>
          <p><?= esc_html(pax_t('contact.success.text')) ?></p>
        </div>
      <?php else : ?>
        <form method="post" action="<?= esc_url(add_query_arg([], get_permalink())) ?>" class="contact-form" novalidate>
          <h2><?= esc_html(pax_t('contact.form.title')) ?></h2>
          <input type="hidden" name="pax_contact" value="1">
          <?php wp_nonce_field('pax_contact', 'pax_contact_nonce'); ?>

          <!-- Honeypot — hidden from users -->
          <div class="hp-field" aria-hidden="true">
            <input name="hp" tabindex="-1" autocomplete="off">
          </div>

          <div class="form-group">
            <label for="name"><?= esc_html(pax_t('contact.form.name')) ?> <span aria-hidden="true">*</span></label>
            <input id="name" name="name" type="text" autocomplete="name"
                   placeholder="<?= esc_attr(pax_t('contact.form.namePh')) ?>"
                   value="<?= esc_attr(pax_contact_old('name')) ?>"
                   class="<?= pax_contact_has_error('name') ? 'invalid' : '' ?>">
            <?php if (pax_contact_has_error('name')) : ?>
              <span class="field-error"><?= esc_html(pax_t('contact.form.nameError')) ?></span>
            <?php endif; ?>
          </div>

          <div class="form-group">
            <label for="email"><?= esc_html(pax_t('contact.form.email')) ?> <span aria-hidden="true">*</span></label>
            <input id="email" name="email" type="email" autocomplete="email"
                   placeholder="<?= esc_attr(pax_t('contact.form.emailPh')) ?>"
                   value="<?= esc_attr(pax_contact_old('email')) ?>"
                   class="<?= pax_contact_has_error('email') ? 'invalid' : '' ?>">
            <?php if (pax_contact_has_error('email')) : ?>
              <span class="field-error"><?= esc_html(pax_t('contact.form.emailError')) ?></span>
            <?php endif; ?>
          </div>

          <div class="form-group">
            <label for="phone"><?= esc_html(pax_t('contact.form.phone')) ?></label>
            <input id="phone" name="phone" type="tel" autocomplete="tel"
                   placeholder="<?= esc_attr(pax_t('contact.form.phonePh')) ?>"
                   value="<?= esc_attr(pax_contact_old('phone')) ?>">
          </div>

          <div class="form-group">
            <label for="service"><?= esc_html(pax_t('contact.form.service')) ?></label>
            <select id="service" name="service">
              <option value="" <?= selected($selected_service, '', false) ?>><?= esc_html(pax_t('contact.form.servicePh')) ?></option>
              <?php foreach ($service_options as $opt) : ?>
                <option value="<?= esc_attr($opt['slug']) ?>" <?= selected($selected_service, $opt['slug'], false) ?>><?= esc_html(pax_t($opt['name'])) ?></option>
              <?php endforeach; ?>
            </select>
          </div>

          <div class="form-group">
            <label for="message"><?= esc_html(pax_t('contact.form.message')) ?> <span aria-hidden="true">*</span></label>
            <textarea id="message" name="message" rows="5"
                      placeholder="<?= esc_attr(pax_t('contact.form.messagePh')) ?>"
                      class="<?= pax_contact_has_error('message') ? 'invalid' : '' ?>"><?= esc_textarea(pax_contact_old('message')) ?></textarea>
            <?php if (pax_contact_has_error('message')) : ?>
              <span class="field-error"><?= esc_html(pax_t('contact.form.messageError')) ?></span>
            <?php endif; ?>
          </div>

          <button type="submit" class="cta-btn-primary"><?= esc_html(pax_t('contact.form.submit')) ?></button>
        </form>
      <?php endif; ?>
    </div>

  </div>
</section>

<?php
get_footer();
