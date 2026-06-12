import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceCard } from '../../../pages/servicii-funerare/services.data';

@Component({
  selector: 'pax-service-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
  readonly card = input.required<ServiceCard>();
  readonly openModal = output<ServiceCard>();

  open(): void {
    this.openModal.emit(this.card());
  }
}
