<?php
/**
 * page.php — generic fallback for any WP page without a dedicated template.
 */
if (!defined('ABSPATH')) {
    exit;
}

$GLOBALS['pax_body_class'] = 'page-legal'; // reuse the legal reading-content styles

while (have_posts()) :
    the_post();
    pax_seo(get_the_title(), wp_strip_all_tags(get_the_excerpt()), get_permalink());
    get_header();
    ?>
    <section class="page-hero">
      <div class="container">
        <h1><?php the_title(); ?></h1>
      </div>
    </section>
    <section class="legal-body">
      <div class="container legal-content">
        <?php the_content(); ?>
      </div>
    </section>
    <?php
    get_footer();
endwhile;
