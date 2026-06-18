<?php
/**
 * contact-form.php — plain PHP contact handler (no plugin).
 * Same fields as the Angular form: name, email, phone, service, message,
 * honeypot. Called at the top of page-contact.php BEFORE get_header() so it
 * can redirect. On success -> ?sent=1; on validation error -> repopulate.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Handle a contact POST. Sets $GLOBALS['pax_contact_errors'|'pax_contact_old'] on failure. */
function pax_handle_contact_form(): void {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST' || !isset($_POST['pax_contact'])) {
        return;
    }

    // Honeypot — silently accept (no email, no error) so bots think they won.
    if (!empty($_POST['hp'])) {
        wp_safe_redirect(add_query_arg('sent', '1', remove_query_arg('service')));
        exit;
    }

    if (!isset($_POST['pax_contact_nonce']) || !wp_verify_nonce($_POST['pax_contact_nonce'], 'pax_contact')) {
        $GLOBALS['pax_contact_errors'] = ['nonce'];
        return;
    }

    $name    = sanitize_text_field(wp_unslash($_POST['name'] ?? ''));
    $email   = sanitize_email(wp_unslash($_POST['email'] ?? ''));
    $phone   = sanitize_text_field(wp_unslash($_POST['phone'] ?? ''));
    $service = sanitize_text_field(wp_unslash($_POST['service'] ?? ''));
    $message = sanitize_textarea_field(wp_unslash($_POST['message'] ?? ''));

    $errors = [];
    if (mb_strlen($name) < 2) {
        $errors[] = 'name';
    }
    if (!is_email($email)) {
        $errors[] = 'email';
    }
    if (mb_strlen($message) < 10) {
        $errors[] = 'message';
    }

    if ($errors) {
        $GLOBALS['pax_contact_errors'] = $errors;
        $GLOBALS['pax_contact_old']    = compact('name', 'email', 'phone', 'service', 'message');
        return;
    }

    $service_name = $service && pax_service_by_slug($service)
        ? pax_t(pax_service_by_slug($service)['name'])
        : '—';

    $lines = [
        'Nume: ' . $name,
        'Email: ' . $email,
        'Telefon: ' . ($phone !== '' ? $phone : '—'),
        'Serviciu: ' . $service_name,
        '',
        'Mesaj:',
        $message,
    ];

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $name . ' <' . $email . '>',
    ];

    wp_mail(
        'contact@paxfunerar.ro',
        'Mesaj nou de pe paxfunerar.ro' . ($service_name !== '—' ? ' — ' . $service_name : ''),
        implode("\n", $lines),
        $headers
    );

    wp_safe_redirect(add_query_arg('sent', '1', remove_query_arg(['service', 'sent'])));
    exit;
}

/** True when the current request has the ?sent=1 success flag. */
function pax_contact_sent(): bool {
    return isset($_GET['sent']) && $_GET['sent'] === '1';
}

/** Field-error helper for the template. */
function pax_contact_has_error(string $field): bool {
    return in_array($field, $GLOBALS['pax_contact_errors'] ?? [], true);
}

/** Old value re-population helper. */
function pax_contact_old(string $field, string $default = ''): string {
    return $GLOBALS['pax_contact_old'][$field] ?? $default;
}
