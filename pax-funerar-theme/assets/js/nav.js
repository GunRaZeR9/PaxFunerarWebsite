// nav.js — mobile hamburger, nav-group expand, FAQ accordion, cookie banner.
// Ports the signal-driven toggles from NavbarComponent / FaqAccordionComponent /
// CookieConsentComponent to plain class toggles.

// ---- Mobile hamburger ----
const hamburger = document.querySelector('[data-hamburger]');
const navLinks = document.querySelector('[data-nav-links]');

function closeMenu() {
  if (!navLinks) return;
  navLinks.classList.remove('open');
  hamburger?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.querySelectorAll('.nav-group.expanded').forEach(g => g.classList.remove('expanded'));
  document.querySelectorAll('[data-group-toggle]').forEach(t => t.setAttribute('aria-expanded', 'false'));
}

hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  if (!open) closeMenu();
});

// ---- Mobile dropdown group expand ----
document.querySelectorAll('[data-group-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-group-toggle');
    const group = document.querySelector(`.nav-group[data-nav-group="${name}"]`);
    if (!group) return;
    const willExpand = !group.classList.contains('expanded');
    // single-open: collapse others
    document.querySelectorAll('.nav-group.expanded').forEach(g => g.classList.remove('expanded'));
    document.querySelectorAll('[data-group-toggle]').forEach(t => t.setAttribute('aria-expanded', 'false'));
    group.classList.toggle('expanded', willExpand);
    btn.setAttribute('aria-expanded', String(willExpand));
  });
});

// Clicking any nav link closes the mobile menu (NavbarComponent.closeMenu).
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ---- FAQ accordion (single-open per list, like openIndex) ----
document.querySelectorAll('[data-accordion-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('[data-accordion-item]');
    if (!item) return;
    const list = item.parentElement;
    const isOpen = item.classList.contains('open');
    list.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('[data-accordion-toggle]')?.setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-answer-wrap')?.setAttribute('aria-hidden', 'true');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      item.querySelector('.faq-answer-wrap')?.setAttribute('aria-hidden', 'false');
    }
  });
});

// ---- Cookie consent ----
const COOKIE = 'pax_cookie_ok';
const banner = document.querySelector('[data-cookie-banner]');
if (banner) {
  const accepted = document.cookie.split('; ').some(c => c.startsWith(COOKIE + '='));
  if (!accepted) banner.hidden = false;
  document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE}=1; path=/; max-age=${oneYear}`;
    banner.hidden = true;
  });
}
