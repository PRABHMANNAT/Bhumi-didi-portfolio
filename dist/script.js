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

const ugcSlides = [...document.querySelectorAll('[data-ugc-slide]')];
const ugcDots = [...document.querySelectorAll('.ugc-dots i')];
const ugcPlay = document.querySelector('.ugc-play');
const ugcStage = document.querySelector('.ugc-media');
let ugcIndex = 0;
let ugcPointerStart = null;

function showUgcSlide(index) {
  ugcIndex = (index + ugcSlides.length) % ugcSlides.length;
  ugcSlides.forEach((slide, position) => {
    const distance = (position - ugcIndex + ugcSlides.length) % ugcSlides.length;
    slide.className = `ugc-video ${distance === 0 ? 'is-active' : distance === 1 ? 'is-next' : 'is-hidden'}`;
    slide.setAttribute('aria-hidden', distance === 0 ? 'false' : 'true');
    if (distance === 0 && !slide.querySelector('.ugc-play')) slide.append(ugcPlay);
  });
  ugcPlay.setAttribute('aria-pressed', 'false');
  ugcPlay.setAttribute('aria-label', 'Play video placeholder');
  ugcSlides.forEach(slide => slide.classList.remove('is-playing'));
  ugcDots.forEach((dot, position) => dot.classList.toggle('active', position === ugcIndex));
}

document.querySelector('.ugc-next').addEventListener('click', () => showUgcSlide(ugcIndex + 1));
document.querySelector('.ugc-prev').addEventListener('click', () => showUgcSlide(ugcIndex - 1));
ugcPlay.addEventListener('click', () => {
  const playing = ugcSlides[ugcIndex].classList.toggle('is-playing');
  ugcPlay.setAttribute('aria-pressed', String(playing));
  ugcPlay.setAttribute('aria-label', playing ? 'Pause video placeholder' : 'Play video placeholder');
});
ugcStage.addEventListener('pointerdown', event => {
  if (event.target.closest('button')) return;
  ugcPointerStart = event.clientX;
  ugcStage.setPointerCapture?.(event.pointerId);
});
ugcStage.addEventListener('pointerup', event => {
  if (ugcPointerStart === null) return;
  const distance = event.clientX - ugcPointerStart;
  if (Math.abs(distance) > 45) showUgcSlide(ugcIndex + (distance < 0 ? 1 : -1));
  ugcPointerStart = null;
});
ugcStage.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') showUgcSlide(ugcIndex + 1);
  if (event.key === 'ArrowLeft') showUgcSlide(ugcIndex - 1);
});
showUgcSlide(0);
