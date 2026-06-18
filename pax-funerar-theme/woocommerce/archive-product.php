<?php
/**
 * woocommerce/archive-product.php — IS the /magazin page.
 * Port of magazin.component.html: page hero, category filters, product grid
 * (each card + quick-view modal via content-product.php). Rename the WC "Shop"
 * page slug to `magazin` (Settings → Advanced → Page setup).
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header('shop');

$categories = array_merge(
    [['id' => 'all', 'slug' => '', 'labelKey' => 'shop.cat.all']],
    pax_shop_categories()
);
$active = isset($_GET['cat']) ? sanitize_title(wp_unslash($_GET['cat'])) : 'all';
if (!in_array($active, array_column($categories, 'id'), true)) {
    $active = 'all';
}
?>

<section class="page-hero">
  <img class="hero-bg" src="<?= esc_url(pax_asset('assets/photos/shop/shop_hero.png')) ?>" alt="" aria-hidden="true">
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="container">
    <h1 class="page-hero-title reveal-hidden"><?= esc_html(pax_t('shop.title')) ?></h1>
    <p class="page-hero-desc reveal-hidden"><?= esc_html(pax_t('shop.desc')) ?></p>
    <a class="floral-note reveal-hidden" href="tel:0741115864">🌸 <?= esc_html(pax_t('shop.floralNote')) ?></a>
  </div>
</section>

<section class="shop-section" data-reveal>
  <div class="container">
    <div class="category-filters">
      <?php foreach ($categories as $cat) : ?>
        <?php $url = $cat['id'] === 'all' ? pax_magazin_url() : pax_magazin_url($cat['id']); ?>
        <a href="<?= esc_url($url) ?>" class="filter-btn<?= $active === $cat['id'] ? ' active' : '' ?>"><?= esc_html(pax_t($cat['labelKey'])) ?></a>
      <?php endforeach; ?>
    </div>

    <?php if (function_exists('wc_print_notices')) {
        wc_print_notices();
    } ?>

    <?php if (have_posts()) : ?>
      <div class="products-grid">
        <?php while (have_posts()) : the_post(); ?>
          <?php wc_get_template_part('content', 'product'); ?>
        <?php endwhile; ?>
      </div>

      <?php
      // Pagination, if the catalogue is large enough to need it.
      the_posts_pagination([
          'mid_size'  => 1,
          'prev_text' => '←',
          'next_text' => '→',
      ]);
      ?>
    <?php else : ?>
      <div class="products-error">
        <p><?= esc_html(pax_t('shop.loadError')) ?></p>
      </div>
    <?php endif; ?>
  </div>
</section>

<?php
get_footer('shop');
