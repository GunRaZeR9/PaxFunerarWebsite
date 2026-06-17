import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart.service';
import { WooCommerceService } from '../../core/services/woocommerce.service';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'pax-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, TranslateModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly fb       = inject(FormBuilder);
  private readonly cart     = inject(CartService);
  private readonly wc       = inject(WooCommerceService);
  private readonly i18n     = inject(TranslationService);
  private readonly router   = inject(Router);
  private readonly seo      = inject(SeoService);
  private readonly platform = inject(PLATFORM_ID);

  readonly cartItems   = this.cart.cartItems;
  readonly subtotal    = this.cart.subtotal;
  readonly deliveryFee = this.cart.deliveryFee;
  readonly total       = this.cart.total;

  readonly submitting = signal(false);
  readonly error      = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    first_name:     ['', [Validators.required, Validators.minLength(2)]],
    last_name:      ['', [Validators.required, Validators.minLength(2)]],
    email:          ['', [Validators.required, Validators.email]],
    phone:          ['', Validators.required],
    address_1:      [''],
    city:           [''],
    postcode:       [''],
    payment_method: ['cod' as 'cod' | 'card', Validators.required],
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Finalizează Comanda | Casa Funerară PAX',
      description: 'Finalizează comanda ta online.',
    });

    if (isPlatformBrowser(this.platform) && this.cart.itemCount() === 0) {
      this.router.navigate(['/magazin']);
    }
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();

    const orderPayload = {
      billing: {
        first_name: v.first_name,
        last_name:  v.last_name,
        email:      v.email,
        phone:      v.phone,
        address_1:  v.address_1,
        city:       v.city,
        postcode:   v.postcode,
        country:    'RO',
      },
      line_items: this.cart.cartItems().map(item => ({
        product_id: item.wcProductId,
        quantity:   item.qty,
      })),
      payment_method: v.payment_method,
      lang: this.i18n.currentLang(),
    };

    this.wc.createOrder(orderPayload).subscribe({
      next: order => {
        this.cart.clear();

        if (v.payment_method === 'cod') {
          this.router.navigate(['/payment/result'], {
            queryParams: { status: 'success', orderId: order.id },
          });
        } else if (isPlatformBrowser(this.platform)) {
          window.location.href =
            `https://wp.sellmotion.ro/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
        }
      },
      error: () => {
        this.error.set('checkout.orderError');
        this.submitting.set(false);
      },
    });
  }
}
