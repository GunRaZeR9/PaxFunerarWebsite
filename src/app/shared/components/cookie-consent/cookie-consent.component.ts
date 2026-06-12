import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const STORAGE_KEY = 'pax-cookie-consent';

@Component({
  selector: 'pax-cookie-consent',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
})
export class CookieConsentComponent implements OnInit {
  private readonly platform = inject(PLATFORM_ID);

  readonly visible = signal(false);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platform)) return;
    this.visible.set(localStorage.getItem(STORAGE_KEY) !== 'accepted');
  }

  accept(): void {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    this.visible.set(false);
  }
}
