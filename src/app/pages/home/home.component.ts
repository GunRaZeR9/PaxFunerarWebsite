import { Component, inject, OnInit, AfterViewInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationService } from '../../core/services/animation.service';
import { SeoService } from '../../core/services/seo.service';
import { SERVICES, ServiceCard } from '../servicii-funerare/services.data';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { ServiceDetailModalComponent } from '../../shared/components/service-detail-modal/service-detail-modal.component';
import { FaqAccordionComponent, FaqItem } from '../../shared/components/faq-accordion/faq-accordion.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'pax-home',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    ServiceCardComponent,
    ServiceDetailModalComponent,
    FaqAccordionComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);

  readonly teaserServices = SERVICES.slice(0, 6);
  readonly activeService = signal<ServiceCard | null>(null);

  // The three most-requested services, surfaced directly in the hero
  readonly heroQuickLinks = ['transport-funerar', 'repatriere-decedati', 'incinerare']
    .map(slug => SERVICES.find(s => s.slug === slug)!)
    .map(s => ({ slug: s.slug, name: s.name, icon: s.icon }));

  readonly testimonialKeys = ['t1', 't2', 't3'];

  // Translation keys — resolved by the translate pipe inside pax-faq-accordion
  readonly faqItems: FaqItem[] = [1, 2, 3, 4, 5, 6].map(n => ({
    question: `faq.q${n}`,
    answer: `faq.a${n}`,
  }));

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Casa Funerară PAX — Servicii Funerare Complete în Târgu Mureș',
      description:
        'Servicii funerare complete în Târgu Mureș, non-stop: transport funerar, îmbălsămare, ceremonii, repatriere, fotoceramică. ☎ 0745 547 530',
      canonical: 'https://paxfunerar.ro/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FuneralHome',
        name: 'Casa Funerară PAX',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Strada Alexandru Papiu Ilarian 10',
          addressLocality: 'Târgu Mureș',
          addressRegion: 'Mureș',
          postalCode: '540058',
          addressCountry: 'RO',
        },
        telephone: ['+40745547530', '+40745647530'],
        email: 'contact@paxfunerar.ro',
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      },
    });
  }

  ngAfterViewInit(): void {
    this.anim.fadeUp('.hero-kicker');
    this.anim.fadeUp('.hero-title', 100);
    this.anim.fadeUp('.hero-subtitle', 220);
    this.anim.fadeUp('.hero-divider', 320);
    this.anim.fadeUp('.hero-description', 400);
    this.anim.fadeUp('.hero-actions', 500);
    this.anim.fadeUp('.hero-quick', 620);
  }

  openModal(service: ServiceCard): void {
    this.activeService.set(service);
  }

  closeModal(): void {
    this.activeService.set(null);
  }
}
