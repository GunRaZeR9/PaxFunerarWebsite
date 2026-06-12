import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { AnimationService } from '../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pax-despre-noi',
  standalone: true,
  imports: [RouterLink, RevealOnScrollDirective, TranslateModule],
  templateUrl: './despre-noi.component.html',
  styleUrl: './despre-noi.component.scss',
})
export class DespreNoiComponent implements OnInit {
  readonly testimonialKeys = ['t1', 't2', 't3'];

  readonly storyBlocks = ['history', 'commitment', 'achievements', 'future'];

  readonly values = [
    { id: 'respect', icon: '🙏' },
    { id: 'compassion', icon: '❤' },
    { id: 'professionalism', icon: '⭐' },
    { id: 'integrity', icon: '⚖' },
    { id: 'empathy', icon: '🤝' },
    { id: 'availability', icon: '🕐' },
    { id: 'discretion', icon: '🔒' },
    { id: 'experience', icon: '🏛' },
  ];

  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Despre Noi | Casa Funerară PAX Târgu Mureș',
      description:
        'Casa Funerară PAX — cu ani de experiență în Târgu Mureș. Înțelegere și îndrumare în fiecare pas al drumului.',
      canonical: 'https://paxfunerar.ro/despre-noi',
    });
    this.anim.fadeUp('.page-hero-title');
    this.anim.fadeUp('.page-hero-tagline', 150);
    this.anim.fadeUp('.page-hero-motto', 250);
    this.anim.fadeUp('.page-hero-intro', 350);
  }
}
