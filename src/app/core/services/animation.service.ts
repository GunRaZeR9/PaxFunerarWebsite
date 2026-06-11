import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import anime from 'animejs';

export const motionTokens = {
  durationFast: 200, // micro-interactions
  durationNormal: 450, // section reveals, card hovers
  durationSlow: 800, // hero entrance, page transitions
  easeOut: 'cubicBezier(0.16, 1, 0.3, 1)', // spring-feel
  easeIn: 'cubicBezier(0.4, 0, 1, 1)',
  easeInOut: 'cubicBezier(0.65, 0, 0.35, 1)',
} as const;

// Performance rules: only animate transform + opacity.
@Injectable({ providedIn: 'root' })
export class AnimationService {
  private readonly platform = inject(PLATFORM_ID);

  get prefersReducedMotion(): boolean {
    if (!isPlatformBrowser(this.platform)) return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  fadeUp(targets: string | Element | Element[], delay = 0): void {
    if (this.prefersReducedMotion) {
      this.showInstantly(targets);
      return;
    }
    anime({
      targets,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay,
      easing: motionTokens.easeOut,
    });
  }

  staggerFadeUp(targets: string | Element[], stagger = 80): void {
    if (this.prefersReducedMotion) {
      this.showInstantly(targets);
      return;
    }
    anime({
      targets,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 500,
      delay: anime.stagger(stagger),
      easing: motionTokens.easeOut,
    });
  }

  fadeIn(targets: string | Element | Element[], duration = motionTokens.durationFast): void {
    if (this.prefersReducedMotion) {
      this.showInstantly(targets);
      return;
    }
    anime({ targets, opacity: [0, 1], duration, easing: 'linear' });
  }

  slideUpIn(targets: string | Element, onComplete?: () => void): void {
    if (this.prefersReducedMotion) {
      this.showInstantly(targets);
      onComplete?.();
      return;
    }
    anime({
      targets,
      translateY: ['100%', '0%'],
      opacity: [0, 1],
      duration: 350,
      easing: motionTokens.easeOut,
      complete: onComplete,
    });
  }

  slideDownOut(targets: string | Element, onComplete?: () => void): void {
    if (this.prefersReducedMotion) {
      onComplete?.();
      return;
    }
    anime({
      targets,
      translateY: ['0%', '60px'],
      opacity: [1, 0],
      duration: 250,
      easing: motionTokens.easeIn,
      complete: onComplete,
    });
  }

  private showInstantly(targets: string | Element | Element[]): void {
    if (!isPlatformBrowser(this.platform)) return;
    const els: Element[] =
      typeof targets === 'string'
        ? Array.from(document.querySelectorAll(targets))
        : Array.isArray(targets)
          ? targets
          : [targets];
    els.forEach(el => ((el as HTMLElement).style.opacity = '1'));
  }
}
