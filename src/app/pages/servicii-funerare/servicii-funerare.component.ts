import { Component, inject, signal, OnInit } from '@angular/core';
import { SERVICES, ServiceCard } from './services.data';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { ServiceDetailModalComponent } from '../../shared/components/service-detail-modal/service-detail-modal.component';
import { SeoService } from '../../core/services/seo.service';
import { AnimationService } from '../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pax-servicii-funerare',
  standalone: true,
  imports: [ServiceCardComponent, ServiceDetailModalComponent, RevealOnScrollDirective, TranslateModule],
  templateUrl: './servicii-funerare.component.html',
  styleUrl: './servicii-funerare.component.scss',
})
export class ServiciiFunerareComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);

  readonly services = SERVICES;
  readonly activeService = signal<ServiceCard | null>(null);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Servicii Funerare Târgu Mureș | Casa Funerară PAX',
      description:
        'Servicii funerare complete în Târgu Mureș: transport funerar, îmbălsămare, ceremonii, repatriere, incinerare, capelă, fotoceramică. ☎ 0745 547 530',
      canonical: 'https://paxfunerar.ro/servicii-funerare',
    });
    this.anim.fadeUp('.page-hero-title');
    this.anim.fadeUp('.page-hero-desc', 150);
    setTimeout(() => this.anim.staggerFadeUp('.service-card', 60), 300);
  }

  openModal(service: ServiceCard): void {
    this.activeService.set(service);
  }

  closeModal(): void {
    this.activeService.set(null);
  }
}
