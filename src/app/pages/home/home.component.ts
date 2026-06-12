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

  readonly faqItems: FaqItem[] = [
    {
      question: 'Ce trebuie să fac imediat după un deces?',
      answer:
        'Sunați-ne la 0745 547 530 — răspundem non-stop. Preluăm imediat toate demersurile: constatarea decesului, transportul și actele necesare, pas cu pas, alături de familie.',
    },
    {
      question: 'Ce acte sunt necesare pentru organizarea înmormântării?',
      answer:
        'Certificatul medical constatator al decesului și actele de identitate ale defunctului și ale aparținătorului. Ne ocupăm noi de obținerea certificatului de deces și a adeverinței de înhumare.',
    },
    {
      question: 'Sunteți disponibili non-stop?',
      answer:
        'Da. Suntem disponibili 24 de ore din 24, 7 zile pe săptămână, inclusiv în weekend și de sărbători legale. La primul apel, preluăm imediat.',
    },
    {
      question: 'Vă ocupați de repatrierea decedaților din străinătate?',
      answer:
        'Da, oferim servicii complete de repatriere din orice țară europeană: formalități consulare, documentație și transport internațional.',
    },
    {
      question: 'Cum pot beneficia de ajutorul de înmormântare?',
      answer:
        'Vă consiliem și pregătim documentele necesare pentru obținerea ajutorului de deces acordat de Casa de Pensii, indiferent dacă defunctul era pensionar sau asigurat.',
    },
    {
      question: 'Pot personaliza serviciile funerare?',
      answer:
        'Desigur. Fiecare ceremonie este organizată după dorințele și tradițiile familiei — religioasă sau civilă, cu personalizare completă a detaliilor.',
    },
  ];

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
    this.anim.fadeUp('.hero-title');
    this.anim.fadeUp('.hero-subtitle', 150);
    this.anim.fadeUp('.hero-description', 250);
    this.anim.fadeUp('.hero-actions', 350);
  }

  openModal(service: ServiceCard): void {
    this.activeService.set(service);
  }

  closeModal(): void {
    this.activeService.set(null);
  }
}
