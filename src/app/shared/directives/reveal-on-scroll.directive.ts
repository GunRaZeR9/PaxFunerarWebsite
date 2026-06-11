import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnimationService } from '../../core/services/animation.service';

/**
 * Fades the host element up when it enters the viewport.
 * Usage: <section paxRevealOnScroll [revealDelay]="100">
 */
@Directive({
  selector: '[paxRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  readonly revealDelay = input<number>(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly anim = inject(AnimationService);
  private readonly platform = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platform)) return;

    if (this.anim.prefersReducedMotion) return; // leave element visible, no animation

    const host = this.el.nativeElement as HTMLElement;
    host.classList.add('reveal-hidden');

    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.anim.fadeUp(host, this.revealDelay());
            this.observer?.unobserve(host);
          }
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
