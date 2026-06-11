import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PRODUCTS, CATEGORIES, Product } from './products.data';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { AnimationService } from '../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'pax-magazin',
  standalone: true,
  imports: [RevealOnScrollDirective, CurrencyPipe],
  templateUrl: './magazin.component.html',
  styleUrl: './magazin.component.scss',
})
export class MagazinComponent implements OnInit {
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);

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
      title: 'Magazin Funerar | Casa Funerară PAX Târgu Mureș',
      description:
        'Magazin funerar PAX: lumânări, coroane florale, urne, fotoceramică, sicrie. Comandă online cu livrare în Târgu Mureș.',
      canonical: 'https://paxfunerar.ro/magazin',
    });
    this.anim.fadeUp('.page-hero-title');
    this.anim.fadeUp('.page-hero-desc', 150);
  }

  setCategory(id: string): void {
    this.activeCategory.set(id);
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
      name: product.name,
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
      name: product.name,
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
