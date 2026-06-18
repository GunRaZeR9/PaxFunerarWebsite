<?php
/**
 * legal-data.php — port of LegalComponent's LEGAL_PAGES spec.
 *
 * The 5 legal pages render structured i18n content under legal.<ns>.*, exactly
 * as the Angular component did. Section shape:
 *   ['title'=>key, 'sub'=>bool, 'paragraphs'=>[keys], 'items'=>[keys], 'after'=>[keys]]
 * Keys here are relative to legal.<ns>; the template prefixes them.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Build ['<prefix>1', ..., '<prefix>N']. */
function pax_legal_items(string $prefix, int $count): array {
    $out = [];
    for ($i = 1; $i <= $count; $i++) {
        $out[] = "{$prefix}{$i}";
    }
    return $out;
}

/** @return array<string, array> keyed by page slug, or the single page if $slug given. */
function pax_legal_pages(?string $slug = null) {
    $pages = [
        'politica-de-confidentialitate' => [
            'ns'       => 'confidentialitate',
            'sections' => [
                ['title' => 's1Title', 'paragraphs' => ['s1Text']],
                ['title' => 's2Title', 'paragraphs' => ['s2Intro'], 'items' => pax_legal_items('s2Item', 6)],
                ['title' => 's3Title', 'paragraphs' => ['s3Intro'], 'items' => pax_legal_items('s3Item', 5)],
                ['title' => 's4Title', 'paragraphs' => ['s4Intro'], 'items' => pax_legal_items('s4Item', 4)],
                ['title' => 's5Title', 'paragraphs' => ['s5Intro'], 'items' => pax_legal_items('s5Item', 3), 'after' => ['s5Note']],
                ['title' => 's6Title', 'paragraphs' => ['s6Intro'], 'items' => pax_legal_items('s6Item', 3)],
                ['title' => 's7Title', 'paragraphs' => ['s7Intro'], 'items' => pax_legal_items('s7Item', 8), 'after' => ['s7Contact']],
                ['title' => 's8Title', 'paragraphs' => ['s8Text']],
                ['title' => 's9Title', 'paragraphs' => ['s9Text']],
            ],
            'closing'  => ['contactNote'],
        ],
        'politica-de-cookies' => [
            'ns'       => 'cookies',
            'sections' => [
                ['title' => 's1Title', 'paragraphs' => ['s1Text']],
                ['title' => 's2Title'],
                ['title' => 's2aTitle', 'sub' => true, 'paragraphs' => ['s2aText']],
                ['title' => 's2bTitle', 'sub' => true, 'paragraphs' => ['s2bText']],
                ['title' => 's2cTitle', 'sub' => true, 'paragraphs' => ['s2cText']],
                ['title' => 's3Title', 'paragraphs' => ['s3Text']],
                ['title' => 's4Title', 'paragraphs' => ['s4Text']],
                ['title' => 's5Title', 'paragraphs' => ['s5Text']],
            ],
        ],
        'termeni-si-conditii' => [
            'ns'       => 'termeni',
            'subtitle' => 'subtitle',
            'sections' => [
                ['title' => 's1Title', 'paragraphs' => ['s1Text']],
                ['title' => 's2Title', 'paragraphs' => ['s2Text']],
                ['title' => 's3Title', 'paragraphs' => ['s3Text']],
                ['title' => 's4Title', 'paragraphs' => ['s4Text']],
                ['title' => 's5Title', 'paragraphs' => ['s5Text']],
                ['title' => 's6Title', 'paragraphs' => ['s6Intro'], 'items' => pax_legal_items('s6Item', 4)],
                ['title' => 's7Title', 'paragraphs' => ['s7Text']],
                ['title' => 's8Title', 'paragraphs' => ['s8Text']],
                ['title' => 's9Title', 'paragraphs' => ['s9Text']],
            ],
        ],
        'politica-de-reclamatii' => [
            'ns'       => 'reclamatii',
            'subtitle' => 'subtitle',
            'sections' => [
                ['title' => 's1Title', 'paragraphs' => ['s1Intro'], 'items' => pax_legal_items('s1Item', 3)],
                ['title' => 's2Title', 'paragraphs' => ['s2Intro'], 'items' => ['s2Email', 's2Phone', 's2Post', 's2Form'], 'after' => ['s2Note']],
                ['title' => 's3Title', 'items' => pax_legal_items('s3Item', 3)],
                ['title' => 's4Title', 'paragraphs' => ['s4Intro'], 'items' => pax_legal_items('s4Item', 4)],
                ['title' => 's5Title', 'paragraphs' => ['s5Text']],
                ['title' => 's6Title', 'paragraphs' => ['s6Intro'], 'items' => pax_legal_items('s6Item', 2)],
                ['title' => 's7Title', 'paragraphs' => ['s7Text']],
            ],
        ],
        'politica-clienti' => [
            'ns'       => 'clienti',
            'subtitle' => 'fullTitle',
            'sections' => [
                ['title' => 's1Title', 'paragraphs' => ['s1Intro'], 'items' => pax_legal_items('s1Item', 6)],
                ['title' => 's2Title', 'paragraphs' => ['s2Intro'], 'items' => pax_legal_items('s2Item', 5)],
                ['title' => 's3Title', 'paragraphs' => ['s3Intro'], 'items' => pax_legal_items('s3Item', 3)],
                ['title' => 's4Title', 'paragraphs' => ['s4Intro'], 'items' => pax_legal_items('s4Item', 3), 'after' => ['s4Note']],
                ['title' => 's5Title', 'paragraphs' => ['s5Intro'], 'items' => pax_legal_items('s5Item', 3)],
                ['title' => 's6Title', 'paragraphs' => ['s6Intro'], 'items' => pax_legal_items('s6Item', 6), 'after' => ['s6Contact']],
                ['title' => 's7Title', 'paragraphs' => ['s7Text']],
                ['title' => 's8Title', 'paragraphs' => ['s8Text']],
            ],
        ],
    ];

    if ($slug !== null) {
        return $pages[$slug] ?? null;
    }
    return $pages;
}
