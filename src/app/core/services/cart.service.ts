import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  productId:   string;
  wcProductId: number;
  name:        string;
  price:       number;
  qty:         number;
  image:       string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly itemCount = computed(() => this.items().reduce((a, i) => a + i.qty, 0));
  readonly subtotal = computed(() => this.items().reduce((a, i) => a + i.price * i.qty, 0));
  readonly deliveryFee = signal<number>(25); // Fixed delivery fee in RON — confirm with client
  readonly total = computed(() => this.subtotal() + this.deliveryFee());

  readonly drawerOpen = signal(false);

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  addItem(item: CartItem): void {
    this.items.update(items => {
      const existing = items.find(i => i.productId === item.productId);
      if (existing) {
        return items.map(i =>
          i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i,
        );
      }
      return [...items, item];
    });
  }

  removeItem(productId: string): void {
    this.items.update(items => items.filter(i => i.productId !== productId));
  }

  updateQty(productId: string, qty: number): void {
    if (qty <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(items =>
      items.map(i => (i.productId === productId ? { ...i, qty } : i)),
    );
  }

  clear(): void {
    this.items.set([]);
  }
}
