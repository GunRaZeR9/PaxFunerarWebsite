import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../../core/services/cart.service';
import { TranslationService, Lang } from '../../../core/services/translation.service';

@Component({
  selector: 'pax-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly cart = inject(CartService);
  readonly i18n = inject(TranslationService);

  readonly menuOpen = signal(false);

  readonly links = [
    { path: '/', labelKey: 'nav.home', exact: true },
    { path: '/servicii-funerare', labelKey: 'nav.services', exact: false },
    { path: '/magazin', labelKey: 'nav.shop', exact: false },
    { path: '/despre-noi', labelKey: 'nav.about', exact: false },
    { path: '/contact', labelKey: 'nav.contact', exact: false },
  ];

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  switchLang(lang: Lang): void {
    this.i18n.use(lang);
  }

  openCart(): void {
    this.closeMenu();
    this.cart.openDrawer();
  }
}
