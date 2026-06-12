import { Component, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';

interface LegalSection {
  /** i18n key (relative to page namespace) for the section heading */
  title?: string;
  /** render heading as a sub-heading (h3) */
  sub?: boolean;
  /** paragraph keys rendered before the list */
  paragraphs?: string[];
  /** list item keys */
  items?: string[];
  /** paragraph keys rendered after the list (notes, contact lines) */
  after?: string[];
}

interface LegalPage {
  /** namespace under `legal.` in the i18n files */
  ns: string;
  /** optional subtitle key (relative) shown under the page title */
  subtitle?: string;
  sections: LegalSection[];
  /** closing paragraph keys (relative) rendered after all sections */
  closing?: string[];
}

/** Builds ['<prefix>1', ..., '<prefix>N'] */
const items = (prefix: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);

const LEGAL_PAGES: Record<string, LegalPage> = {
  'politica-de-confidentialitate': {
    ns: 'confidentialitate',
    sections: [
      { title: 's1Title', paragraphs: ['s1Text'] },
      { title: 's2Title', paragraphs: ['s2Intro'], items: items('s2Item', 6) },
      { title: 's3Title', paragraphs: ['s3Intro'], items: items('s3Item', 5) },
      { title: 's4Title', paragraphs: ['s4Intro'], items: items('s4Item', 4) },
      { title: 's5Title', paragraphs: ['s5Intro'], items: items('s5Item', 3), after: ['s5Note'] },
      { title: 's6Title', paragraphs: ['s6Intro'], items: items('s6Item', 3) },
      { title: 's7Title', paragraphs: ['s7Intro'], items: items('s7Item', 8), after: ['s7Contact'] },
      { title: 's8Title', paragraphs: ['s8Text'] },
      { title: 's9Title', paragraphs: ['s9Text'] },
    ],
    closing: ['contactNote'],
  },
  'politica-de-cookies': {
    ns: 'cookies',
    sections: [
      { title: 's1Title', paragraphs: ['s1Text'] },
      { title: 's2Title' },
      { title: 's2aTitle', sub: true, paragraphs: ['s2aText'] },
      { title: 's2bTitle', sub: true, paragraphs: ['s2bText'] },
      { title: 's2cTitle', sub: true, paragraphs: ['s2cText'] },
      { title: 's3Title', paragraphs: ['s3Text'] },
      { title: 's4Title', paragraphs: ['s4Text'] },
      { title: 's5Title', paragraphs: ['s5Text'] },
    ],
  },
  'termeni-si-conditii': {
    ns: 'termeni',
    subtitle: 'subtitle',
    sections: [
      { title: 's1Title', paragraphs: ['s1Text'] },
      { title: 's2Title', paragraphs: ['s2Text'] },
      { title: 's3Title', paragraphs: ['s3Text'] },
      { title: 's4Title', paragraphs: ['s4Text'] },
      { title: 's5Title', paragraphs: ['s5Text'] },
      { title: 's6Title', paragraphs: ['s6Intro'], items: items('s6Item', 4) },
      { title: 's7Title', paragraphs: ['s7Text'] },
      { title: 's8Title', paragraphs: ['s8Text'] },
      { title: 's9Title', paragraphs: ['s9Text'] },
    ],
  },
  'politica-de-reclamatii': {
    ns: 'reclamatii',
    subtitle: 'subtitle',
    sections: [
      { title: 's1Title', paragraphs: ['s1Intro'], items: items('s1Item', 3) },
      {
        title: 's2Title',
        paragraphs: ['s2Intro'],
        items: ['s2Email', 's2Phone', 's2Post', 's2Form'],
        after: ['s2Note'],
      },
      { title: 's3Title', items: items('s3Item', 3) },
      { title: 's4Title', paragraphs: ['s4Intro'], items: items('s4Item', 4) },
      { title: 's5Title', paragraphs: ['s5Text'] },
      { title: 's6Title', paragraphs: ['s6Intro'], items: items('s6Item', 2) },
      { title: 's7Title', paragraphs: ['s7Text'] },
    ],
  },
  'politica-clienti': {
    ns: 'clienti',
    subtitle: 'fullTitle',
    sections: [
      { title: 's1Title', paragraphs: ['s1Intro'], items: items('s1Item', 6) },
      { title: 's2Title', paragraphs: ['s2Intro'], items: items('s2Item', 5) },
      { title: 's3Title', paragraphs: ['s3Intro'], items: items('s3Item', 3) },
      { title: 's4Title', paragraphs: ['s4Intro'], items: items('s4Item', 3), after: ['s4Note'] },
      { title: 's5Title', paragraphs: ['s5Intro'], items: items('s5Item', 3) },
      { title: 's6Title', paragraphs: ['s6Intro'], items: items('s6Item', 6), after: ['s6Contact'] },
      { title: 's7Title', paragraphs: ['s7Text'] },
      { title: 's8Title', paragraphs: ['s8Text'] },
    ],
  },
};

@Component({
  selector: 'pax-legal',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    @if (page(); as p) {
      <section class="page-hero">
        <div class="container">
          <h1>{{ base() + '.pageTitle' | translate }}</h1>
          @if (p.subtitle) {
            <p class="legal-subtitle">{{ base() + '.' + p.subtitle | translate }}</p>
          }
          <p class="legal-updated">{{ base() + '.lastUpdate' | translate }}</p>
        </div>
      </section>
      <section class="legal-body">
        <div class="container legal-content">
          <p class="legal-intro">{{ base() + '.intro' | translate }}</p>
          @for (section of p.sections; track $index) {
            @if (section.title) {
              @if (section.sub) {
                <h3>{{ base() + '.' + section.title | translate }}</h3>
              } @else {
                <h2>{{ base() + '.' + section.title | translate }}</h2>
              }
            }
            @for (key of section.paragraphs ?? []; track key) {
              <p>{{ base() + '.' + key | translate }}</p>
            }
            @if (section.items?.length) {
              <ul>
                @for (key of section.items!; track key) {
                  <li>{{ base() + '.' + key | translate }}</li>
                }
              </ul>
            }
            @for (key of section.after ?? []; track key) {
              <p>{{ base() + '.' + key | translate }}</p>
            }
          }
          @for (key of p.closing ?? []; track key) {
            <p class="legal-closing">{{ base() + '.' + key | translate }}</p>
          }
        </div>
      </section>
      <div class="container back-section">
        <a routerLink="/" class="back-link">← {{ 'nav.home' | translate }}</a>
      </div>
    }
  `,
  styles: [`
    .page-hero { background: var(--gradient-hero); padding-block: var(--space-12); }
    h1 { font-size: var(--text-3xl); }
    .legal-subtitle { color: var(--color-text-secondary); margin-top: var(--space-2); }
    .legal-updated { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); }
    .legal-body { padding-block: var(--space-12); }
    .legal-content { max-width: 800px; line-height: 1.8; }
    h2 { font-size: var(--text-xl); margin-block: var(--space-8) var(--space-4); }
    h3 { font-size: var(--text-lg); margin-block: var(--space-6) var(--space-3); }
    p { color: var(--color-text-secondary); margin-bottom: var(--space-4); }
    ul { color: var(--color-text-secondary); padding-left: var(--space-6); margin-bottom: var(--space-4); }
    li { margin-bottom: var(--space-2); }
    .legal-intro, .legal-closing { color: var(--color-text-secondary); }
    .back-section { padding-bottom: var(--space-12); }
    .back-link { font-size: var(--text-sm); color: var(--color-text-muted); }
    .back-link:hover { color: var(--color-accent); }
  `],
})
export class LegalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);

  private readonly slug = toSignal(
    this.route.data.pipe(map((d: { slug?: string }) => d['slug'] ?? '')),
    { initialValue: '' },
  );

  readonly page = computed(() => LEGAL_PAGES[this.slug()] ?? null);
  readonly base = computed(() => `legal.${this.page()?.ns}`);

  ngOnInit(): void {
    const p = this.page();
    if (p) {
      const slug = this.slug();
      // translations load async over HTTP — resolve the title once available
      this.translate.get(`legal.${p.ns}.pageTitle`).subscribe((title: string) => {
        this.seo.setPage({
          title: `${title} | Casa Funerară PAX`,
          description: `${title} — Casa Funerară PAX Târgu Mureș`,
          canonical: `https://paxfunerar.ro/${slug}`,
        });
      });
    }
  }
}
