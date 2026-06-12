import { Component, HostListener, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'pax-cart-drawer',
  standalone: true,
  imports: [CurrencyPipe, TranslateModule],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss',
})
export class CartDrawerComponent {
  readonly cart = inject(CartService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.cart.drawerOpen()) {
      this.cart.closeDrawer();
    }
  }
}
