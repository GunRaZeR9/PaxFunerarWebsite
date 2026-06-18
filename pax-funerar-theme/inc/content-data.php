<?php
/**
 * content-data.php — structural port of the home/about content lists.
 *
 * Like services-data.php, only structure lives here; all copy resolves via
 * pax_t() against the same ro/hu JSON keys the Angular components used:
 *   testimonials.<t>.text / .author        (t1..t3)
 *   faq.q<n> / faq.a<n>                     (1..10)
 *   home.guide.step<n>Title / Text / Intro / Item<i>
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Testimonial keys — HomeComponent.testimonialKeys + DespreNoi reuse. */
function pax_testimonial_keys(): array {
    return ['t1', 't2', 't3'];
}

/**
 * FAQ items as question/answer key pairs — HomeComponent.faqItems (1..10).
 * @return array<int, array{question:string, answer:string}>
 */
function pax_faq_items(): array {
    $items = [];
    for ($n = 1; $n <= 10; $n++) {
        $items[] = ['question' => "faq.q{$n}", 'answer' => "faq.a{$n}"];
    }
    return $items;
}

/**
 * Step-by-step funeral guide — HomeComponent.guideSteps.
 * Steps 1–3 are single paragraphs; steps 4–5 have an intro + 5 list items.
 * @return array<int, array{n:int, title:string, text:string, items:string[]}>
 */
function pax_guide_steps(): array {
    $steps = [];
    foreach ([1, 2, 3, 4, 5] as $n) {
        $items = [];
        if ($n >= 4) {
            foreach ([1, 2, 3, 4, 5] as $i) {
                $items[] = "home.guide.step{$n}Item{$i}";
            }
        }
        $steps[] = [
            'n'     => $n,
            'title' => "home.guide.step{$n}Title",
            'text'  => $n <= 3 ? "home.guide.step{$n}Text" : "home.guide.step{$n}Intro",
            'items' => $items,
        ];
    }
    return $steps;
}

/** Hero quick-links — the 3 most-requested services (HomeComponent.heroQuickLinks). */
function pax_hero_quick_links(): array {
    $slugs = ['transport-funerar', 'repatriere-decedati', 'incinerare'];
    $out = [];
    foreach ($slugs as $slug) {
        $svc = pax_service_by_slug($slug);
        if ($svc) {
            $out[] = $svc;
        }
    }
    return $out;
}

/** Home teaser services — first 6 (HomeComponent.teaserServices). */
function pax_teaser_services(): array {
    return array_slice(pax_services(), 0, 6);
}
