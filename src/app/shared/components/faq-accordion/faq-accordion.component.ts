import { Component, input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/** question/answer are i18n keys (raw strings also work — missing keys fall through). */
export interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'pax-faq-accordion',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './faq-accordion.component.html',
  styleUrl: './faq-accordion.component.scss',
})
export class FaqAccordionComponent {
  readonly items = input.required<FaqItem[]>();
  readonly openIndex = signal<number | null>(null);

  toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}
