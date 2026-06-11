import { Component, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SERVICES } from '../services.data';
import { SeoService } from '../../../core/services/seo.service';
import { AnimationService } from '../../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'pax-service-detail',
  standalone: true,
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss',
})
export class ServiceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map(p => p.get('slug') ?? '')),
    { initialValue: '' },
  );

  readonly service = computed(() => SERVICES.find(s => s.slug === this.slug()) ?? null);

  ngOnInit(): void {
    const s = this.service();
    if (s) {
      this.seo.setPage({
        title: `${s.name} Târgu Mureș | Casa Funerară PAX`,
        description: s.teaser + ' Casa Funerară PAX, Târgu Mureș. ☎ 0745 547 530',
        canonical: `https://paxfunerar.ro/servicii-funerare/${s.slug}`,
      });
    }
    this.anim.fadeUp('.detail-title');
    this.anim.fadeUp('.detail-teaser', 100);
  }
}
