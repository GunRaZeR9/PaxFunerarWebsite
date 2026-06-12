import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SERVICES } from '../../../pages/servicii-funerare/services.data';

@Component({
  selector: 'pax-footer',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly serviceLinks = SERVICES.slice(0, 6).map(s => ({
    path: `/servicii-funerare/${s.slug}`,
    label: s.name,
  }));

  readonly legalLinks = [
    { path: '/politica-de-confidentialitate', label: 'legal.confidentialitate.navTitle' },
    { path: '/politica-de-cookies', label: 'legal.cookies.navTitle' },
    { path: '/termeni-si-conditii', label: 'legal.termeni.navTitle' },
    { path: '/politica-de-reclamatii', label: 'legal.reclamatii.navTitle' },
    { path: '/politica-clienti', label: 'legal.clienti.navTitle' },
  ];
}
