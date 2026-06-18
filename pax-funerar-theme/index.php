<?php
/**
 * index.php — required fallback template.
 * Most routes resolve to dedicated templates (front-page.php, page-*.php,
 * woocommerce/*). This handles anything left over (search, archives, 404).
 */
if (!defined('ABSPATH')) {
    exit;
}

pax_seo(
    wp_get_document_title(),
    pax_t('about.metaDescription')
);
get_header();
?>

<section class="page-hero">
  <div class="container">
    <h1><?php echo is_search() ? esc_html(get_search_query()) : esc_html(get_the_archive_title()); ?></h1>
  </div>
</section>

<div class="container" style="padding-block: var(--space-16);">
  <?php if (have_posts()) : ?>
    <?php while (have_posts()) : the_post(); ?>
      <article <?php post_class(); ?>>
        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <div class="entry-content"><?php the_excerpt(); ?></div>
      </article>
    <?php endwhile; ?>
    <?php the_posts_pagination(); ?>
  <?php else : ?>
    <p><?= esc_html(pax_t('common.nothingFound')) ?></p>
  <?php endif; ?>
</div>

<?php get_footer(); ?>
