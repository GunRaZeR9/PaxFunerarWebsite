// reveal.js — port of RevealOnScrollDirective.
// Fades [data-reveal] elements up when they enter the viewport (threshold 0.15).
// data-reveal-delay="N" maps to the directive's [revealDelay] input.

import { fadeUp, prefersReducedMotion } from './animations.js';

const targets = document.querySelectorAll('[data-reveal]');

if (prefersReducedMotion()) {
  // Leave everything visible, no animation (matches the directive).
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        fadeUp(el, delay);
        obs.unobserve(el);
      }
    }
  }, { threshold: 0.15 });

  targets.forEach(el => {
    el.classList.add('reveal-hidden'); // opacity:0 until revealed
    observer.observe(el);
  });
}
