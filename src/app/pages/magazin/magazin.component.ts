import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CATEGORIES } from './products.data';
import { WooCommerceService } from '../../core/services/woocommerce.service';
import { WcProduct } from '../../core/models/woocommerce.models';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { AnimationService } from '../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pax-magazin',
  standalone: true,
  imports: [RevealOnScrollDirective, DecimalPipe, TranslateModule],
  templateUrl: './magazin.component.html',
  styleUrl: './magazin.component.scss',
})
export class MagazinComponent implements OnInit {
  private readonly wc        = inject(WooCommerceService);
  private readonly cart      = inject(CartService);
  private readonly seo       = inject(SeoService);
  private readonly anim      = inject(AnimationService);
  private readonly route     = inject(ActivatedRoute);
  private readonly router    = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories     = CATEGORIES;
  readonly activeCategory = signal<string>('all');
  readonly activeProduct  = signal<WcProduct | null>(null);
  readonly productQty     = signal<number>(1);

  readonly allProducts = signal<WcProduct[]>([]);
  readonly loading     = signal<boolean>(true);
  readonly error       = signal<string | null>(null);

  readonly filteredProducts = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.allProducts();
    const catEntry = CATEGORIES.find(c => c.id === cat);
    if (!catEntry?.slug) return this.allProducts();
    return this.allProducts().filter(p =>
      p.categories.some(c => c.slug === catEntry.slug)
    );
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Magazin Floral | Casa Funerară PAX Târgu Mureș',
      description: 'Aranjamente florale funerare PAX: coroane, jerbe, buchete. Comandă online sau telefonic la 0741 115 864.',
      canonical: 'https://sellmotion.ro/magazin',
    });

    this.anim.fadeUp('.page-hero-title');
    this.anim.fadeUp('.page-hero-desc', 150);

    this.loadProducts();

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const cat = params.get('cat');
        this.activeCategory.set(
          cat && CATEGORIES.some(c => c.id === cat) ? cat : 'all'
        );
      });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.wc.getProducts({ per_page: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: products => {
          this.allProducts.set(products);
          this.loading.set(false);
          setTimeout(() => this.anim.staggerFadeUp('.product-card', 50), 50);
        },
        error: () => {
          this.error.set('shop.loadError');
          this.loading.set(false);
        },
      });
  }

  setCategory(id: string): void {
    this.activeCategory.set(id);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cat: id === 'all' ? null : id },
      replaceUrl: true,
    });
    setTimeout(() => this.anim.staggerFadeUp('.product-card', 50), 50);
  }

  openProduct(product: WcProduct): void {
    this.productQty.set(1);
    this.activeProduct.set(product);
  }

  closeProduct(): void {
    this.activeProduct.set(null);
  }

  increment(): void { this.productQty.update(q => q + 1); }
  decrement(): void { this.productQty.update(q => Math.max(1, q - 1)); }

  getPrice(product: WcProduct): number {
    return this.wc.parsePrice(product);
  }

  getImage(product: WcProduct): string {
    return product.images[0]?.src ?? 'assets/images/placeholder.jpg';
  }

  addToCart(product: WcProduct): void {
    this.cart.addItem({
      productId:   String(product.id),
      wcProductId: product.id,
      name:        product.name,
      price:       this.wc.parsePrice(product),
      qty:         this.productQty(),
      image:       this.getImage(product),
    });
    this.closeProduct();
    this.cart.openDrawer();
  }

  addToCartDirect(product: WcProduct, event: MouseEvent): void {
    event.stopPropagation();
    this.cart.addItem({
      productId:   String(product.id),
      wcProductId: product.id,
      name:        product.name,
      price:       this.wc.parsePrice(product),
      qty:         1,
      image:       this.getImage(product),
    });
    this.cart.openDrawer();
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('product-modal-overlay')) {
      this.closeProduct();
    }
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.closeProduct();
  }
}
