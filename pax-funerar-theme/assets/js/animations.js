// animations.js — port of AnimationService (anime.js v3, loaded as window.anime).
// Only transform + opacity are animated. Same durations/easings as the source.

const anime = window.anime;

export const motionTokens = {
  durationFast: 200,
  durationNormal: 450,
  durationSlow: 800,
  easeOut: 'cubicBezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubicBezier(0.4, 0, 1, 1)',
  easeInOut: 'cubicBezier(0.65, 0, 0.35, 1)',
};

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function showInstantly(targets) {
  const els = typeof targets === 'string'
    ? Array.from(document.querySelectorAll(targets))
    : (Array.isArray(targets) ? targets : [targets]);
  els.forEach(el => { el.style.opacity = '1'; });
}

export function fadeUp(targets, delay = 0) {
  if (prefersReducedMotion() || !anime) { showInstantly(targets); return; }
  anime({ targets, opacity: [0, 1], translateY: [30, 0], duration: 600, delay, easing: motionTokens.easeOut });
}

export function staggerFadeUp(targets, stagger = 80) {
  if (prefersReducedMotion() || !anime) { showInstantly(targets); return; }
  anime({ targets, opacity: [0, 1], translateY: [40, 0], duration: 500, delay: anime.stagger(stagger), easing: motionTokens.easeOut });
}

export function fadeIn(targets, duration = motionTokens.durationFast) {
  if (prefersReducedMotion() || !anime) { showInstantly(targets); return; }
  anime({ targets, opacity: [0, 1], duration, easing: 'linear' });
}

export function slideUpIn(targets, onComplete) {
  if (prefersReducedMotion() || !anime) { showInstantly(targets); if (onComplete) onComplete(); return; }
  anime({ targets, translateY: ['100%', '0%'], opacity: [0, 1], duration: 350, easing: motionTokens.easeOut, complete: onComplete });
}

export function slideDownOut(targets, onComplete) {
  if (prefersReducedMotion() || !anime) { if (onComplete) onComplete(); return; }
  anime({ targets, translateY: ['0%', '60px'], opacity: [1, 0], duration: 250, easing: motionTokens.easeIn, complete: onComplete });
}

// Per-page hero entrance — mirrors each component's ngOnInit/ngAfterViewInit.
function runHeroIntro() {
  const b = document.body.classList;
  if (b.contains('page-home')) {
    fadeUp('.hero-kicker');
    fadeUp('.hero-title', 100);
    fadeUp('.hero-subtitle', 220);
    fadeUp('.hero-divider', 320);
    fadeUp('.hero-description', 400);
    fadeUp('.hero-actions', 500);
    fadeUp('.hero-quick', 620);
  } else if (b.contains('page-servicii')) {
    fadeUp('.page-hero-title');
    fadeUp('.page-hero-desc', 150);
  } else if (b.contains('page-service-detail')) {
    fadeUp('.detail-title');
    fadeUp('.detail-teaser', 100);
    fadeUp('.detail-intro', 200);
  } else if (b.contains('page-despre')) {
    fadeUp('.page-hero-title');
    fadeUp('.page-hero-tagline', 150);
    fadeUp('.page-hero-motto', 250);
    fadeUp('.page-hero-intro', 350);
  } else if (b.contains('page-contact') || b.contains('page-magazin')) {
    fadeUp('.page-hero-title');
  }
}

runHeroIntro();
