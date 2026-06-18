<?php
/**
 * service-meta.php — Option B meta box for service-detail pages (no plugin).
 *
 * Adds Teaser / Benefits / Icon fields to any page using the "Service Detail"
 * template (page-service-detail.php). These override the i18n defaults on the
 * front end. ACF can later absorb the same three fields with no template change.
 */

if (!defined('ABSPATH')) {
    exit;
}

const PAX_SERVICE_TEMPLATE = 'page-service-detail.php';

add_action('add_meta_boxes_page', function ($post) {
    if (get_page_template_slug($post) !== PAX_SERVICE_TEMPLATE) {
        return;
    }
    add_meta_box(
        'pax_service_meta',
        'Detalii serviciu (PAX)',
        'pax_service_meta_box',
        'page',
        'normal',
        'high'
    );
});

function pax_service_meta_box($post): void {
    wp_nonce_field('pax_service_meta_save', 'pax_service_meta_nonce');
    $teaser   = get_post_meta($post->ID, 'pax_teaser', true);
    $benefits = get_post_meta($post->ID, 'pax_benefits', true);
    $icon     = get_post_meta($post->ID, 'pax_icon', true);
    $slug     = $post->post_name;
    ?>
    <p style="margin:0 0 12px;color:#666">
      Lăsate goale, câmpurile folosesc automat textele bilingve din fișierele de traducere
      (<code>servicesData.<?= esc_html($slug ?: '&lt;slug&gt;') ?></code>). Completează doar ce vrei să suprascrii.
    </p>

    <p>
      <label for="pax_teaser"><strong>Teaser</strong> (un rând, sub titlu)</label><br>
      <textarea id="pax_teaser" name="pax_teaser" rows="2" style="width:100%"><?= esc_textarea($teaser) ?></textarea>
    </p>

    <p>
      <label for="pax_benefits"><strong>Beneficii / „Ce include”</strong> (unul pe linie)</label><br>
      <textarea id="pax_benefits" name="pax_benefits" rows="5" style="width:100%"><?= esc_textarea($benefits) ?></textarea>
    </p>

    <p>
      <label for="pax_icon"><strong>Icon</strong> (URL sau cale; ex. <code>/wp-content/themes/pax-funerar-theme/assets/icons/transport.svg</code>)</label><br>
      <input type="text" id="pax_icon" name="pax_icon" value="<?= esc_attr($icon) ?>" style="width:100%">
    </p>
    <?php
}

add_action('save_post_page', function ($post_id) {
    if (
        !isset($_POST['pax_service_meta_nonce'])
        || !wp_verify_nonce($_POST['pax_service_meta_nonce'], 'pax_service_meta_save')
        || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
        || !current_user_can('edit_page', $post_id)
    ) {
        return;
    }

    $fields = [
        'pax_teaser'   => 'sanitize_textarea_field',
        'pax_benefits' => 'sanitize_textarea_field',
        'pax_icon'     => 'esc_url_raw',
    ];
    foreach ($fields as $key => $sanitize) {
        if (isset($_POST[$key])) {
            $value = $sanitize(wp_unslash($_POST[$key]));
            if ($value === '') {
                delete_post_meta($post_id, $key);
            } else {
                update_post_meta($post_id, $key, $value);
            }
        }
    }
});
