import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoPage {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: object;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  setPage(page: SeoPage): void {
    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });

    if (page.canonical) {
      this.setCanonical(page.canonical);
    }
    if (page.jsonLd) {
      this.setJsonLd(page.jsonLd);
    }
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(schema: object): void {
    let script = this.doc.querySelector<HTMLScriptElement>('script[type="application/ld+json"]#seo-jsonld');
    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-jsonld';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }
}
