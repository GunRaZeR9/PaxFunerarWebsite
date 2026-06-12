import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../../core/services/cart.service';
import { TranslationService, Lang } from '../../../core/services/translation.service';
import { SERVICES } from '../../../pages/servicii-funerare/services.data';
import { CATEGORIES } from '../../../pages/magazin/products.data';

type NavGroup = 'services' | 'shop';

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
  // Mobile menu: which group's sublist is expanded
  readonly expandedGroup = signal<NavGroup | null>(null);

  readonly services = SERVICES.map(s => ({ slug: s.slug, name: s.name, icon: s.icon }));
  readonly shopCategories = CATEGORIES.filter(c => c.id !== 'all');

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
    if (!this.menuOpen()) this.expandedGroup.set(null);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.expandedGroup.set(null);
  }

  toggleGroup(group: NavGroup): void {
    this.expandedGroup.update(cur => (cur === group ? null : group));
  }

  switchLang(lang: Lang): void {
    this.i18n.use(lang);
  }

  openCart(): void {
    this.closeMenu();
    this.cart.openDrawer();
  }
}
