import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PRODUCTS, CATEGORIES, Product } from './products.data';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { AnimationService } from '../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { DecimalPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pax-magazin',
  standalone: true,
  imports: [RevealOnScrollDirective, DecimalPipe, TranslateModule],
  templateUrl: './magazin.component.html',
  styleUrl: './magazin.component.scss',
})
export class MagazinComponent implements OnInit {
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly categories = CATEGORIES;
  readonly activeCategory = signal<string>('all');
  readonly activeProduct = signal<Product | null>(null);
  readonly productQty = signal<number>(1);

  readonly filteredProducts = computed(() => {
    const cat = this.activeCategory();
    return cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Magazin Floral | Casa Funerară PAX Târgu Mureș',
      description:
        'Aranjamente florale funerare PAX: coroane, jerbe, buchete și aranjamente din flori naturale. Comandă online sau telefonic la 0741 115 864, livrare în Târgu Mureș.',
      canonical: 'https://paxfunerar.ro/magazin',
    });
    this.anim.fadeUp('.page-hero-title');
    this.anim.fadeUp('.page-hero-desc', 150);

    // Deep links from the navbar dropdown: /magazin?cat=<id>
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const cat = params.get('cat');
        this.activeCategory.set(cat && CATEGORIES.some(c => c.id === cat) ? cat : 'all');
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

  openProduct(product: Product): void {
    this.productQty.set(1);
    this.activeProduct.set(product);
  }

  closeProduct(): void {
    this.activeProduct.set(null);
  }

  increment(): void {
    this.productQty.update(q => q + 1);
  }

  decrement(): void {
    this.productQty.update(q => Math.max(1, q - 1));
  }

  addToCart(product: Product): void {
    this.cart.addItem({
      productId: product.id,
      name: this.translate.instant(product.name),
      price: product.price,
      qty: this.productQty(),
      image: product.image,
    });
    this.closeProduct();
  }

  addToCartDirect(product: Product, event: MouseEvent): void {
    event.stopPropagation();
    this.cart.addItem({
      productId: product.id,
      name: this.translate.instant(product.name),
      price: product.price,
      qty: 1,
      image: product.image,
    });
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
