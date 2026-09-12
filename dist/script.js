const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); }
menuButton.addEventListener('click', () => { const opening = mobileNav.hidden; mobileNav.hidden = !opening; menuButton.setAttribute('aria-expanded', String(opening)); menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation'); });
mobileNav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}
