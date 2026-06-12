import { Component, DestroyRef, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SERVICES } from '../services.data';
import { SeoService } from '../../../core/services/seo.service';
import { AnimationService } from '../../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/** i18n key pair for a titled content block */
interface PageBlock {
  title: string;
  text: string;
}

/** Resolved i18n key map for the long-form page content under servicePage.<slug> */
interface PageContent {
  heroIntro: string;
  bodyIntro: string;
  items: PageBlock[];
  /** benefit1..N or reason1..N keys — rendered under serviceDetail.whyTitle */
  why: string[];
  /** extra1..N Title/Text keys (incinerare only) */
  extras: PageBlock[];
  /** fotoceramica only */
  shapesTitle: string | null;
  shapes: string[];
  orderCta: string | null;
  contactCta: string | null;
  conclusion: string | null;
}

/** Per-slug shape of keys present in servicePage.<slug> */
interface PageSpec {
  items: number;
  benefits?: number;
  reasons?: number;
  extras?: number;
  shapes?: number;
  conclusion: boolean;
}

const PAGE_SPECS: Record<string, PageSpec> = {
  'intocmirea-actelor': { items: 5, conclusion: true },
  'transport-funerar': { items: 3, benefits: 3, conclusion: true },
  'imbalsamare': { items: 3, benefits: 3, conclusion: true },
  'servicii-ceremoniale': { items: 3, benefits: 3, conclusion: true },
  'servicii-de-catering': { items: 3, benefits: 3, conclusion: true },
  'repatriere-decedati': { items: 3, benefits: 3, conclusion: true },
  'capela': { items: 6, conclusion: true },
  'pregatire-loc-de-veci': { items: 3, conclusion: true },
  'incinerare': { items: 5, reasons: 5, extras: 3, conclusion: true },
  'fotoceramica': { items: 4, shapes: 9, conclusion: false },
};

@Component({
  selector: 'pax-service-detail',
  standalone: true,
  imports: [RouterLink, RevealOnScrollDirective, TranslateModule],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss',
})
export class ServiceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map(p => p.get('slug') ?? '')),
    { initialValue: '' },
  );

  readonly service = computed(() => SERVICES.find(s => s.slug === this.slug()) ?? null);

  readonly page = computed<PageContent | null>(() => {
    const slug = this.slug();
    const spec = PAGE_SPECS[slug];
    if (!spec) return null;

    const base = `servicePage.${slug}`;
    const range = (n?: number): number[] => Array.from({ length: n ?? 0 }, (_, i) => i + 1);

    return {
      heroIntro: `${base}.heroIntro`,
      bodyIntro: `${base}.bodyIntro`,
      items: range(spec.items).map(i => ({ title: `${base}.item${i}Title`, text: `${base}.item${i}Text` })),
      why: [
        ...range(spec.benefits).map(i => `${base}.benefit${i}`),
        ...range(spec.reasons).map(i => `${base}.reason${i}`),
      ],
      extras: range(spec.extras).map(i => ({ title: `${base}.extra${i}Title`, text: `${base}.extra${i}Text` })),
      shapesTitle: spec.shapes ? `${base}.shapesTitle` : null,
      shapes: range(spec.shapes).map(i => `${base}.shape${i}`),
      orderCta: spec.shapes ? `${base}.orderCta` : null,
      contactCta: spec.shapes ? `${base}.contactCta` : null,
      conclusion: spec.conclusion ? `${base}.conclusion` : null,
    };
  });

  ngOnInit(): void {
    const s = this.service();
    if (s) {
      // s.name / s.teaser are i18n keys; translations load async over HTTP,
      // so stream() (emits on load + language change) keeps SEO tags correct.
      this.translate
        .stream([s.name, s.teaser])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((t: Record<string, string>) => {
          this.seo.setPage({
            title: `${t[s.name]} Târgu Mureș | Casa Funerară PAX`,
            description: t[s.teaser] + ' Casa Funerară PAX, Târgu Mureș. ☎ 0745 547 530',
            canonical: `https://paxfunerar.ro/servicii-funerare/${s.slug}`,
          });
        });
    }
    this.anim.fadeUp('.detail-title');
    this.anim.fadeUp('.detail-teaser', 100);
    this.anim.fadeUp('.detail-intro', 200);
  }
}
