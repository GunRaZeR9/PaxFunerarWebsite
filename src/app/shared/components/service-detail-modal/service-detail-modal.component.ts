import { Component, input, output, OnChanges, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ServiceCard } from '../../../pages/servicii-funerare/services.data';
import { AnimationService } from '../../../core/services/animation.service';

@Component({
  selector: 'pax-service-detail-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-detail-modal.component.html',
  styleUrl: './service-detail-modal.component.scss',
})
export class ServiceDetailModalComponent implements OnChanges {
  readonly service = input<ServiceCard | null>(null);
  readonly closed = output<void>();

  private readonly anim = inject(AnimationService);
  private readonly platform = inject(PLATFORM_ID);

  ngOnChanges(): void {
    if (!isPlatformBrowser(this.platform)) return;
    if (this.service()) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        this.anim.slideUpIn('.modal-panel');
        this.anim.fadeIn('.modal-overlay', 200);
      });
    }
  }

  close(): void {
    this.anim.slideDownOut('.modal-panel', () => {
      document.body.style.overflow = '';
      this.closed.emit();
    });
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.close();
  }
}
