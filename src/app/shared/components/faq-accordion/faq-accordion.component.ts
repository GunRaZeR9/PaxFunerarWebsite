import { Component, input, signal } from '@angular/core';

export interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'pax-faq-accordion',
  standalone: true,
  imports: [],
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
