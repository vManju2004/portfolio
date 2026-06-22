// Nav: background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Nav: mobile toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.project-card, .timeline-item');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Hero chart: draw path + animate counters
function easeOutQuad(t) { return t * (2 - t); }

function animateHeroChart() {
  const path = document.getElementById('convergencePath');
  const dot = document.getElementById('chartDot');
  const counter = document.getElementById('chartCounter');
  const epoch = document.getElementById('epochCounter');
  const targetAccuracy = 99.59;
  const targetEpoch = 50;
  const duration = 2200;

  if (reduceMotion) {
    counter.textContent = targetAccuracy.toFixed(2);
    epoch.textContent = targetEpoch;
    return;
  }

  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  dot.style.opacity = 0;

  requestAnimationFrame(() => {
    path.style.transition = `stroke-dashoffset ${duration}ms ease-out`;
    path.style.strokeDashoffset = 0;
  });

  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = easeOutQuad(progress);
    counter.textContent = (eased * targetAccuracy).toFixed(2);
    epoch.textContent = Math.round(eased * targetEpoch);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      dot.style.transition = 'opacity 0.3s ease';
      dot.style.opacity = 1;
    }
  }
  requestAnimationFrame(tick);
}

window.addEventListener('DOMContentLoaded', animateHeroChart);

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();