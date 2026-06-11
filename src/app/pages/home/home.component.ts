import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationService } from '../../core/services/animation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'pax-home',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Casa Funerară PAX — Servicii Funerare Complete în Târgu Mureș',
      description:
        'Servicii funerare complete în Târgu Mureș, non-stop: transport funerar, îmbălsămare, ceremonii, repatriere, fotoceramică. ☎ 0745 547 530',
      canonical: 'https://paxfunerar.ro/',
    });
  }

  ngAfterViewInit(): void {
    this.anim.fadeUp('.hero-title');
    this.anim.fadeUp('.hero-subtitle', 150);
    this.anim.fadeUp('.hero-description', 250);
    this.anim.fadeUp('.hero-actions', 350);
  }
}
