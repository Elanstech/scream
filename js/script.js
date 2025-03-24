document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Animate hamburger icon
    if (this.classList.contains('active')) {
      this.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 5px)';
      this.querySelector('span:nth-child(2)').style.opacity = '0';
      this.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      this.querySelector('span:nth-child(1)').style.transform = '';
      this.querySelector('span:nth-child(2)').style.opacity = '';
      this.querySelector('span:nth-child(3)').style.transform = '';
    }
  });

  // Close mobile menu when clicking a link
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      // Reset hamburger icon
      menuToggle.querySelector('span:nth-child(1)').style.transform = '';
      menuToggle.querySelector('span:nth-child(2)').style.opacity = '';
      menuToggle.querySelector('span:nth-child(3)').style.transform = '';
    });
  });

  // FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.accordion-item').forEach(el => {
        if (el !== item) {
          el.classList.remove('active');
          el.querySelector('.accordion-content').style.maxHeight = '0';
          el.querySelector('.icon').textContent = '+';
        }
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        const content = this.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + 'px';
        this.querySelector('.icon').textContent = '×';
      } else {
        item.classList.remove('active');
        this.nextElementSibling.style.maxHeight = '0';
        this.querySelector('.icon').textContent = '+';
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Hero image hover effect
  const productImage = document.querySelector('.product-image');
  if (productImage) {
    productImage.addEventListener('mousemove', (e) => {
      const rect = productImage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;
      
      productImage.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    productImage.addEventListener('mouseleave', () => {
      productImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }

  // Animate elements when they come into view
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.benefit-card, .step, .ingredient, .review-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Set initial state for animated elements
  document.querySelectorAll('.benefit-card, .step, .ingredient, .review-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
  });

  // Run once on load
  animateOnScroll();
  
  // Then on scroll
  window.addEventListener('scroll', animateOnScroll);
});

// Add bubble elements dynamically for more variety
function addBubbles() {
  const bubbleContainer = document.querySelector('.bubble-background');
  const colors = [
    'rgba(255, 112, 162, 0.1)',
    'rgba(138, 79, 255, 0.1)',
    'rgba(92, 217, 186, 0.1)'
  ];
  
  for (let i = 0; i < 5; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Random properties
    const size = Math.floor(Math.random() * 150) + 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.floor(Math.random() * 30) + 15;
    const delay = Math.random() * 5;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.background = color;
    bubble.style.top = `${top}%`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
    
    bubbleContainer.appendChild(bubble);
  }
}

// Initialize bubbles
window.addEventListener('load', addBubbles);
