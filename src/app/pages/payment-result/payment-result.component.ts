import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'pax-payment-result',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <section class="result-page container">
      @if (status === 'success') {
        <div class="result-card result-success">
          <span class="result-icon" aria-hidden="true">✓</span>
          <h1>{{ 'checkout.successTitle' | translate }}</h1>
          <p>{{ 'checkout.successText' | translate }}</p>
          <a routerLink="/" class="cta-btn-primary">{{ 'nav.home' | translate }}</a>
        </div>
      } @else {
        <div class="result-card result-failure">
          <span class="result-icon result-icon--fail" aria-hidden="true">✕</span>
          <h1>{{ 'checkout.failTitle' | translate }}</h1>
          <p>{{ 'checkout.failText' | translate }}</p>
          <a routerLink="/magazin" class="cta-btn-primary">{{ 'nav.shop' | translate }}</a>
        </div>
      }
    </section>
  `,
  styles: [`
    .result-page {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-block: var(--space-16);
    }
    .result-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-6);
    }
    .result-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(74, 124, 89, 0.15);
      color: var(--color-success, #4a7c59);
      font-size: var(--text-3xl);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .result-icon--fail {
      background: rgba(192, 57, 43, 0.12);
      color: var(--color-error, #c0392b);
    }
    h1 { margin: 0; }
    p  { margin: 0; color: var(--color-text-secondary); }
  `],
})
export class PaymentResultComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo   = inject(SeoService);

  status = 'success';

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status') ?? 'success';
    this.seo.setPage({
      title: this.status === 'success'
        ? 'Comandă plasată | Casa Funerară PAX'
        : 'Plată nefinalizată | Casa Funerară PAX',
      description: this.status === 'success'
        ? 'Comanda ta a fost plasată cu succes.'
        : 'Plata nu a fost finalizată. Încearcă din nou.',
    });
  }
}
