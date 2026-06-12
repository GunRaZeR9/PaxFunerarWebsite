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
    { path: '/politica-de-confidentialitate', label: 'Politică de Confidențialitate' },
    { path: '/politica-de-cookies', label: 'Politică de Cookies' },
    { path: '/termeni-si-conditii', label: 'Termeni și Condiții' },
    { path: '/politica-de-reclamatii', label: 'Politică de Reclamații' },
    { path: '/politica-clienti', label: 'Politică Clienți' },
  ];
}
