// MSSC Website - Interactive JavaScript

// Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Smooth scrolling
document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Form handling (mock - replace with EmailJS or backend)
function handleContactForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('name');
  alert(`Thank you, ${name}! Your quote request has been sent. We'll contact you soon.`);
  e.target.reset();
}

// Subscribe mock
function handleSubscribe(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  if (email) {
    alert(`Subscribed with ${email}! Check your inbox for updates.`);
    e.target.reset();
  }
}

// WhatsApp function
function openWhatsApp() {
  const message = 'Hello, I%27d like a quote for Mntambo Services.';
  window.open(`https://wa.me/27645565624?text=${message}`, '_blank');
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255,255,255,0.98)';
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  } else {
    navbar.style.background = 'rgba(255,255,255,0.95)';
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
  }
});

// Gallery lightbox mock (hover effect handled in CSS)
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    alert('Visit our workshop to see all products! Custom orders available.');
  });
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Form listeners
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', handleContactForm);
  });

  const subscribeForms = document.querySelectorAll('.subscribe-form');
  subscribeForms.forEach(form => {
    form.addEventListener('submit', handleSubscribe);
  });

  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  });

  document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

