import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'ro' | 'hu';

const STORAGE_KEY = 'pax-lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly translate = inject(TranslateService);
  private readonly platform = inject(PLATFORM_ID);

  readonly currentLang = signal<Lang>('ro');

  init(): void {
    this.translate.setDefaultLang('ro');
    this.use(this.detectLang());
  }

  use(lang: Lang): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    if (isPlatformBrowser(this.platform)) {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  }

  // Detection order: stored choice → browser language → RO default.
  private detectLang(): Lang {
    if (!isPlatformBrowser(this.platform)) return 'ro';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ro' || stored === 'hu') return stored;
    return navigator.language?.toLowerCase().startsWith('hu') ? 'hu' : 'ro';
  }
}
