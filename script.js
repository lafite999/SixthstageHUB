// ============================================
// CUSTOM CURSOR GLOW
// ============================================
const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .statue-wrap').forEach(el => {
  el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
});

// ============================================
// PARALLAX ON STATUE + WING DETAIL (mouse move)
// ============================================
const parallaxStatue = document.getElementById('parallaxStatue');
const wingParallax = document.getElementById('wingParallax');

window.addEventListener('mousemove', (e) => {
  const xRatio = (e.clientX / window.innerWidth) - 0.5;
  const yRatio = (e.clientY / window.innerHeight) - 0.5;

  if (parallaxStatue) {
    parallaxStatue.style.transform = `translate(${xRatio * 14}px, ${yRatio * 10}px)`;
  }
  if (wingParallax) {
    wingParallax.style.transform = `scale(1.08) translate(${xRatio * -18}px, ${yRatio * -12}px)`;
  }
});

// gentle scroll-based parallax too
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (parallaxStatue) {
    parallaxStatue.style.opacity = Math.max(1 - scrolled / 700, 0);
  }
}, { passive: true });

// ============================================
// RANDOM + HOVER GLITCH TRIGGER
// ============================================
function fireGlitch(el) {
  el.classList.add('glitching');
  setTimeout(() => el.classList.remove('glitching'), 260);
}

document.querySelectorAll('[data-glitch]').forEach(el => {
  el.addEventListener('mouseenter', () => fireGlitch(el));
});

// ambient random glitch on the logo every 4-9s, unprompted (feels "alive")
const logo = document.querySelector('.logo-mark[data-glitch]');
function scheduleAmbientGlitch() {
  const delay = 4000 + Math.random() * 5000;
  setTimeout(() => {
    if (logo) fireGlitch(logo);
    scheduleAmbientGlitch();
  }, delay);
}
scheduleAmbientGlitch();

// ============================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
revealEls.forEach(el => revealObserver.observe(el));

// ============================================
// SIDE NAV DOTS: click to scroll + active state on scroll
// ============================================
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      const match = document.querySelector(`.dot[data-target="${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(sec => navObserver.observe(sec));

// ============================================
// PREV / NEXT CONTROLS ON COVER
// ============================================
const sectionIds = Array.from(sections).map(s => s.id);
function currentIndex() {
  let idx = 0;
  sections.forEach((s, i) => {
    if (s.getBoundingClientRect().top <= window.innerHeight / 2) idx = i;
  });
  return idx;
}
document.getElementById('prevSection')?.addEventListener('click', () => {
  const idx = Math.max(currentIndex() - 1, 0);
  document.getElementById(sectionIds[idx]).scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('nextSection')?.addEventListener('click', () => {
  const idx = Math.min(currentIndex() + 1, sectionIds.length - 1);
  document.getElementById(sectionIds[idx]).scrollIntoView({ behavior: 'smooth' });
});

// ============================================
// BACK TO TOP
// ============================================
document.getElementById('backTop')?.addEventListener('click', () => {
  document.getElementById('cover').scrollIntoView({ behavior: 'smooth' });
});

// ============================================
// RESPECT REDUCED MOTION
// ============================================
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  document.querySelectorAll('.grain, .scanlines, .scroll-line, .logo-ring').forEach(el => {
    el.style.animation = 'none';
  });
}
