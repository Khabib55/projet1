// ============================================
// MODERN PORTFOLIO JAVASCRIPT
// Enhanced interactivity and animations
// ============================================

// Header scroll effect
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const formData = new FormData(contactForm);
      const name = contactForm.querySelector('input[type="text"]').value;
      const email = contactForm.querySelector('input[type="email"]').value;
      const message = contactForm.querySelector('textarea').value;
      
      // Simple validation
      if (!name || !email || !message) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return;
      }
      
      // Simulate form submission
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Envoi en cours...';
      submitButton.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        showNotification('Merci ! Votre demande a été envoyée avec succès. Je vous répondrai bientôt.', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 1500);
    });
  }

  // Gallery item click handler (for future lightbox implementation)
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      // Add click animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
      
      // Future: Implement lightbox here
      console.log('Gallery item clicked');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe gallery items
  galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(item);
  });

  // Animated counter for stats
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const statsSection = document.querySelector('.stats');
  
  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(stat => {
            animateCounter(stat);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }

  // Animate skill bars when in view
  const skillBars = document.querySelectorAll('.skill-progress');
  const skillsSection = document.querySelector('.skills');
  
  if (skillsSection && skillBars.length > 0) {
    const skillsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = width;
            }, 100);
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
  }

  // Observe service cards for fade-in animation
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    observer.observe(card);
  });

  // Portfolio Filter Functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Filter gallery items
        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (filterValue === 'all' || category === filterValue) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 100);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.classList.add('hidden');
            }, 300);
          }
        });
      });
    });
  }

  // Lightbox Functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let currentImageIndex = 0;
  let images = [];
  
  // Initialize lightbox with gallery items
  if (galleryItems.length > 0 && lightbox) {
    // Collect all visible images
    function updateImagesArray() {
      images = Array.from(galleryItems)
        .filter(item => !item.classList.contains('hidden'))
        .map(item => {
          const img = item.querySelector('img');
          const info = item.querySelector('.gallery-info');
          return {
            src: img ? img.src : '',
            title: info ? info.querySelector('h3')?.textContent || '' : '',
            description: info ? info.querySelector('p')?.textContent || '' : ''
          };
        });
    }
    
    updateImagesArray();
    
    // Open lightbox
    function openLightbox(index) {
      if (images.length === 0) return;
      currentImageIndex = index;
      updateLightboxContent();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Update lightbox content
    function updateLightboxContent() {
      if (images[currentImageIndex]) {
        lightboxImage.src = images[currentImageIndex].src;
        lightboxTitle.textContent = images[currentImageIndex].title;
        lightboxDescription.textContent = images[currentImageIndex].description;
      }
    }
    
    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // Navigate to next image
    function nextImage() {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateLightboxContent();
    }
    
    // Navigate to previous image
    function prevImage() {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      updateLightboxContent();
    }
    
    // Add click handlers to gallery items
    galleryItems.forEach((item, index) => {
      const viewBtn = item.querySelector('.gallery-view-btn');
      if (viewBtn) {
        viewBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          updateImagesArray();
          const visibleIndex = Array.from(galleryItems)
            .filter(i => !i.classList.contains('hidden'))
            .indexOf(item);
          if (visibleIndex !== -1) {
            openLightbox(visibleIndex);
          }
        });
      }
      
      // Also allow clicking the image itself
      item.addEventListener('click', function() {
        updateImagesArray();
        const visibleIndex = Array.from(galleryItems)
          .filter(i => !i.classList.contains('hidden'))
          .indexOf(item);
        if (visibleIndex !== -1) {
          openLightbox(visibleIndex);
        }
      });
    });
    
    // Lightbox controls
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxNext) {
      lightboxNext.addEventListener('click', nextImage);
    }
    
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', prevImage);
    }
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    });
    
    // Update images array when filters change
    if (filterButtons.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', updateImagesArray);
      });
    }
  }
});

// Notification system
function showNotification(message, type = 'success') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
    font-weight: 500;
  `;
  
  // Add animation keyframes if not already added
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
  
  // Click to dismiss
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
}

// Animated counter function
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

// Add loading animation
window.addEventListener('load', function() {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease-in';
    document.body.style.opacity = '1';
  }, 100);
});
