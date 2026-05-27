import './style.css';

// ===== DOM ELEMENTS =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const backToTopBtn = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');

// ===== MOBILE NAVIGATION TOGGLE =====
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== BACK TO TOP BUTTON =====
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => link.style.color = '');
      if (navLink) {
        navLink.style.color = '#00a8ff';
      }
    }
  });
}

window.addEventListener('scroll', setActiveNavLink);

// ===== SKILL BAR ANIMATION =====
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  const skillsSection = document.getElementById('skills');

  if (!skillsSection) return;

  const sectionTop = skillsSection.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight / 1.3;

  if (sectionTop < triggerPoint) {
    skillBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      bar.style.width = progress + '%';
    });
  }
}

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// ===== HEADER BACKGROUND ON SCROLL =====
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 50) {
    header.style.background = 'rgba(10, 10, 10, 0.98)';
  } else {
    header.style.background = 'rgba(10, 10, 10, 0.95)';
  }
});

// ===== INTERSECTION OBSERVER FOR FADE IN ANIMATIONS =====
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: '0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in animation to cards
document.querySelectorAll('.skill-card, .project-card, .contact-item, .soft-skill-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeInObserver.observe(card);
});