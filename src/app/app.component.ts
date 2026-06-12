import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer.component';
import { PhoneStickyComponent } from './shared/components/phone-sticky/phone-sticky.component';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CartDrawerComponent,
    PhoneStickyComponent,
    CookieConsentComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly i18n = inject(TranslationService);

  ngOnInit(): void {
    this.i18n.init();
  }
}
