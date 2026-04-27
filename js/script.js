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

// Form handling via backend
function handleContactForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  
  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(result => {
      if (result.success) {
        alert(`Thank you, ${data.name || 'there'}! Your message has been sent.`);
        e.target.reset();
      } else {
        alert('There was an error sending your message.');
      }
    }).catch(err => {
      console.error(err);
      alert('Network error. Please try again later.');
    });
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

// Analytics tracking
function trackEvent(eventType, elementId = null) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: eventType,
      page: window.location.pathname || 'index',
      element_id: elementId
    })
  }).catch(() => {}); // ignore tracking errors
}

// Track pageview on load
document.addEventListener('DOMContentLoaded', () => {
  trackEvent('pageview');
  
  // Track clicks on all buttons and links
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (target) {
      const elementId = target.id || target.textContent.trim().substring(0, 50) || target.className;
      trackEvent('click', elementId);
    }
  });

  // Load products if on furniture gallery page
  const productGallery = document.getElementById('product-gallery');
  const categoryFilters = document.getElementById('category-filters');
  
  if (productGallery) {
    let allProducts = [];
    
    function renderProducts(products) {
      if (products.length === 0) {
        productGallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 3rem;">No products found. Check back later!</p>';
        return;
      }
      productGallery.innerHTML = '';
      products.forEach(prod => {
        const imgHtml = prod.image_url 
          ? `<div style="height: 250px; overflow: hidden; border-radius: 12px; margin-bottom: 1.5rem;"><img src="/${prod.image_url}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"></div>` 
          : `<div style="height: 250px; background: #f1f5f9; border-radius: 12px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="font-size: 3rem; color: #cbd5e1;"></i></div>`;
        
        const waMsg = encodeURIComponent(`Hi Mntambo Services, I would like to inquire about the ${prod.title}${prod.price ? ' priced at ' + prod.price : ''}.`);
        
        productGallery.innerHTML += `
          <div class="service-card" style="padding: 1.5rem; display: flex; flex-direction: column; border-radius: 16px; border: 1px solid #f8fafc; box-shadow: 0 4px 20px rgba(0,0,0,0.03);" onclick="trackEvent('product_view', '${prod.title}')">
            ${imgHtml}
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 1rem;">
              <h3 style="margin: 0; font-size: 1.15rem; line-height: 1.3;">${prod.title}</h3>
              ${prod.price ? `<span style="font-weight: 600; color: var(--primary); font-size: 0.9rem; background: #f1f5f9; padding: 0.2rem 0.6rem; border-radius: 12px; white-space: nowrap;">${prod.price}</span>` : ''}
            </div>
            <p style="margin-bottom: 1rem; color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">${prod.type || 'Other'}</p>
            <p style="margin-bottom: 1.5rem; color: #475569; font-size: 0.9rem; line-height: 1.6; flex-grow: 1;">${prod.description}</p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
              <small style="color: #94a3b8; font-size: 0.8rem;">${prod.colour || ''} ${prod.material ? '• ' + prod.material : ''}</small>
              <a href="https://wa.me/27645565624?text=${waMsg}" target="_blank" class="btn" style="background: #25D366; color: white; padding: 0.6rem; font-size: 0.85rem; border-radius: 8px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; width: 100%; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                <i class="fab fa-whatsapp" style="font-size: 1rem;"></i> Inquire via WhatsApp
              </a>
            </div>
          </div>
        `;
      });
    }

    function renderFilters() {
      if (!categoryFilters) return;
      const types = ['All', ...new Set(allProducts.map(p => p.type || 'Other'))];
      categoryFilters.innerHTML = types.map(type => 
        `<button class="filter-btn" data-filter="${type}" style="padding: 0.5rem 1.5rem; border: none; border-radius: 20px; background: ${type === 'All' ? 'var(--primary)' : '#f1f5f9'}; color: ${type === 'All' ? 'white' : '#475569'}; cursor: pointer; font-weight: 500; font-family: inherit; transition: all 0.2s ease;">${type}</button>`
      ).join('');

      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.filter-btn').forEach(b => {
            b.style.background = '#f1f5f9';
            b.style.color = '#475569';
          });
          e.target.style.background = 'var(--primary)';
          e.target.style.color = 'white';
          
          const filter = e.target.dataset.filter;
          if (filter === 'All') {
            renderProducts(allProducts);
          } else {
            renderProducts(allProducts.filter(p => (p.type || 'Other') === filter));
          }
        });
      });
    }

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        allProducts = data;
        renderFilters();
        renderProducts(allProducts);
      })
      .catch(err => {
        console.error(err);
        productGallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to load products.</p>';
      });
  }
});

