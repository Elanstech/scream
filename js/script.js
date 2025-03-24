/**
 * S-Cream Website JavaScript
 * Modern, organized script with modular structure
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  const header = new HeaderManager();
  const hero = new HeroSection();
  const ingredients = new IngredientsSection();
  const faq = new FAQSection();
  const reviews = new ReviewsSection();
  
  // Setup smooth scrolling
  setupSmoothScrolling();
  
  // Set current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Initialize GSAP animations if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initGSAPAnimations();
  } else {
    // Fallback to basic animations
    setupBasicAnimations();
  }
  
  // Initialize Analytics tracking if needed
  setupAnalytics();
});

/**
 * Utility Functions
 */
const Utils = {
  // Debounce function to limit execution rate
  debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  
  // Throttle function to limit execution frequency
  throttle(func, limit = 100) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Check if element is in viewport
  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset) &&
      rect.bottom >= offset
    );
  },
  
  // Add class when element is in viewport
  addClassWhenInView(element, className, offset = 0) {
    if (!element) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.classList.add(className);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1, rootMargin: `0px 0px -${offset}px 0px` });
    
    observer.observe(element);
  },
  
  // Handle animation based on reduced motion preference
  handleReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Get scroll percentage of page
  getScrollPercentage() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    return (scrollPosition / docHeight) * 100;
  }
};

/**
 * Header & Navigation Manager
 */
class HeaderManager {
  constructor() {
    // Elements
    this.header = document.querySelector('.site-header');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    // State
    this.isMenuOpen = false;
    this.lastScrollTop = 0;
    this.scrollThreshold = 50;
    this.ticking = false;
    
    // Initialize
    this.init();
  }
  
  init() {
    if (!this.header) return;
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Handle initial scroll position
    this.handleScroll();
  }
  
  setupEventListeners() {
    // Menu toggle button
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // If it's a hash link to an element on the page
        const href = link.getAttribute('href');
        if (href.startsWith('#') && href.length > 1) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (this.isMenuOpen) {
              this.closeMobileMenu();
            }
            
            // Smooth scroll to the target
            const headerOffset = this.header.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    // Optimized scroll handling with throttle
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
    
    // Resize handling
    window.addEventListener('resize', Utils.debounce(() => {
      if (window.innerWidth >= 1024 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    }, 150));
    
    // Close on outside click
    document.addEventListener('click', e => {
      if (this.isMenuOpen && 
          this.mobileNav && 
          !this.mobileNav.contains(e.target) && 
          !this.menuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.classList.toggle('menu-open', this.isMenuOpen);
    
    if (this.mobileNav) {
      this.mobileNav.classList.toggle('active', this.isMenuOpen);
      
      // Update ARIA attributes
      this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen);
      this.mobileNav.setAttribute('aria-hidden', !this.isMenuOpen);
    }
  }
  
  closeMobileMenu() {
    this.isMenuOpen = false;
    document.body.classList.remove('menu-open');
    
    if (this.mobileNav) {
      this.mobileNav.classList.remove('active');
      
      // Update ARIA attributes
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.mobileNav.setAttribute('aria-hidden', 'true');
    }
  }
  
  handleScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add or remove scrolled class
    if (currentScrollTop > this.scrollThreshold) {
      this.header.classList.add('header-scrolled');
      this.header.style.boxShadow = 'var(--shadow-md)';
    } else {
      this.header.classList.remove('header-scrolled');
      this.header.style.boxShadow = 'var(--shadow-sm)';
    }
    
    // Hide/show header on scroll (only on larger screens)
    if (window.innerWidth >= 768) {
      // Check if scrolling down and past the threshold
      if (currentScrollTop > this.lastScrollTop && currentScrollTop > this.header.offsetHeight) {
        // Scrolling down - hide header
        this.header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up - show header
        this.header.style.transform = 'translateY(0)';
      }
    } else {
      // Always show header on mobile
      this.header.style.transform = 'translateY(0)';
    }
    
    this.lastScrollTop = currentScrollTop;
  }
}

/**
 * Hero Section Manager
 */
class HeroSection {
  constructor() {
    // Elements
    this.section = document.querySelector('.hero');
    this.productImage = document.querySelector('.product-image');
    this.ctaButtons = document.querySelectorAll('.hero-cta-group a');
    this.scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Initialize if elements exist
    if (this.section) {
      this.init();
    }
  }
  
  init() {
    // Set up 3D tilt effect for product
    this.setupTiltEffect();
    
    // Set up parallax for background elements
    this.setupParallaxEffect();
    
    // Set up CTA button interactions
    this.setupCtaInteractions();
    
    // Set up scroll indicator
    this.setupScrollIndicator();
  }
  
  setupTiltEffect() {
    // Only setup on desktop devices and if product image exists
    if (window.innerWidth >= 1024 && this.productImage && !Utils.handleReducedMotion()) {
      const container = this.productImage;
      const img = container.querySelector('img');
      
      if (!img) return;
      
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate mouse position relative to center (range: -1 to 1)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        // Apply 3D tilt effect (limit tilt to 10 degrees)
        img.style.transform = `perspective(1000px) rotateX(${-percentY * 10}deg) rotateY(${percentX * 10}deg) scale3d(1.05, 1.05, 1.05)`;
      });
      
      // Reset transform on mouse leave
      container.addEventListener('mouseleave', () => {
        img.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
  }
  
  setupParallaxEffect() {
    // Set up parallax effect for background elements
    const bgCircles = document.querySelectorAll('.bg-circle');
    
    if (bgCircles.length === 0 || Utils.handleReducedMotion()) return;
    
    document.addEventListener('mousemove', Utils.throttle((e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      bgCircles.forEach((circle, index) => {
        // Different parallax intensity for each circle
        const multiplier = 30 * (1 - (index * 0.2));
        const offsetX = (mouseX - 0.5) * multiplier;
        const offsetY = (mouseY - 0.5) * multiplier;
        
        circle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    }, 50)); // Throttled for performance
  }
  
  setupCtaInteractions() {
    // Add interaction effects to CTA buttons
    if (!this.ctaButtons.length) return;
    
    this.ctaButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        const svg = button.querySelector('svg');
        if (svg) {
          svg.style.transform = 'translateX(5px)';
        }
      });
      
      button.addEventListener('mouseleave', () => {
        const svg = button.querySelector('svg');
        if (svg) {
          svg.style.transform = '';
        }
      });
      
      // Track button clicks for analytics
      button.addEventListener('click', () => {
        const buttonText = button.querySelector('span')?.textContent || 'Button';
        this.trackButtonClick(buttonText);
      });
    });
  }
  
  setupScrollIndicator() {
    // Set up scroll indicator click behavior
    if (!this.scrollIndicator) return;
    
    this.scrollIndicator.addEventListener('click', () => {
      // Find the next section
      const nextSection = this.section.nextElementSibling;
      
      if (nextSection) {
        // Scroll to it with smooth behavior
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
        const elementPosition = nextSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
  
  trackButtonClick(buttonText) {
    // For future analytics implementation
    console.log(`Hero CTA clicked: ${buttonText}`);
    
    // Example analytics call:
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', 'click', {
    //     'event_category': 'CTA',
    //     'event_label': buttonText
    //   });
    // }
  }
}

/**
 * Ingredients Section Manager
 */
class IngredientsSection {
  constructor() {
    // Elements
    this.section = document.querySelector('.ingredients-showcase');
    this.tabs = document.querySelectorAll('.ingredient-tab');
    this.details = document.querySelectorAll('.ingredient-detail');
    this.mobileNavItems = document.querySelectorAll('.quick-nav-item');
    
    // State
    this.currentIngredient = this.tabs.length > 0 ? 
      this.tabs[0].getAttribute('data-ingredient') : null;
    
    // Initialize if section exists
    if (this.section) {
      this.init();
    }
  }
  
  init() {
    // Setup tab functionality
    this.setupTabs();
    
    // Setup animations for elements
    this.setupAnimations();
    
    // Setup scroll observer for mobile navigation updates
    this.setupScrollObserver();
  }
  
  setupTabs() {
    // Add click handlers to desktop tabs
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const ingredient = tab.getAttribute('data-ingredient');
        if (ingredient) {
          this.switchToIngredient(ingredient);
        }
      });
      
      // Add keyboard accessibility
      tab.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const ingredient = tab.getAttribute('data-ingredient');
          if (ingredient) {
            this.switchToIngredient(ingredient);
          }
        }
      });
    });
    
    // Add click handlers to mobile navigation
    this.mobileNavItems.forEach(item => {
      item.addEventListener('click', () => {
        const ingredient = item.getAttribute('data-ingredient');
        if (ingredient) {
          this.switchToIngredient(ingredient);
          this.scrollToIngredient(ingredient);
        }
      });
    });
  }
  
  switchToIngredient(ingredient) {
    // Store current ingredient
    this.currentIngredient = ingredient;
    
    // Update tab states
    this.tabs.forEach(tab => {
      const isActive = tab.getAttribute('data-ingredient') === ingredient;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });
    
    // Update mobile navigation
    this.mobileNavItems.forEach(item => {
      const isActive = item.getAttribute('data-ingredient') === ingredient;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', isActive);
    });
    
    // Update ingredient details
    this.details.forEach(detail => {
      if (detail.getAttribute('data-ingredient') === ingredient) {
        // Make the matching detail visible
        detail.style.display = 'block';
        
        // Ensure display change has taken effect then add active class
        window.requestAnimationFrame(() => {
          detail.classList.add('active');
        });
      } else {
        // Remove active class from others
        detail.classList.remove('active');
        
        // Wait for transition to complete before hiding
        const handleTransitionEnd = () => {
          if (!detail.classList.contains('active')) {
            detail.style.display = 'none';
          }
          detail.removeEventListener('transitionend', handleTransitionEnd);
        };
        
        // Only add listener if already displayed
        if (detail.style.display !== 'none') {
          detail.addEventListener('transitionend', handleTransitionEnd);
        } else {
          detail.style.display = 'none';
        }
      }
    });
    
    // Track for analytics
    this.trackTabChange(ingredient);
  }
  
  scrollToIngredient(ingredient) {
    // Smooth scroll to ingredient detail
    const detailElement = document.querySelector(`.ingredient-detail[data-ingredient="${ingredient}"]`);
    if (!detailElement) return;
    
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
    const offset = headerHeight + 20; // Add extra padding
    
    const elementTop = detailElement.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    });
  }
  
  setupAnimations() {
    // Skip if reduced motion is preferred
    if (Utils.handleReducedMotion()) return;
    
    // Animate molecule circles
    const moleculeCircles = document.querySelectorAll('.molecule-circle');
    moleculeCircles.forEach(circle => {
      Utils.addClassWhenInView(circle, 'animate-in');
    });
    
    // Animate benefit items with staggered delay
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach((item, index) => {
      Utils.addClassWhenInView(item, 'animate-in');
      item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Animate clinical evidence stats
    const statCircles = document.querySelectorAll('.stat-circle');
    statCircles.forEach(circle => {
      Utils.addClassWhenInView(circle, 'animate-in');
    });
  }
  
  setupScrollObserver() {
    // Update mobile navigation when scrolling through sections
    if (!this.mobileNavItems.length) return;
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ingredient = entry.target.getAttribute('data-ingredient');
          if (ingredient && ingredient !== this.currentIngredient) {
            // Update navigation without scrolling
            this.mobileNavItems.forEach(item => {
              const isActive = item.getAttribute('data-ingredient') === ingredient;
              item.classList.toggle('active', isActive);
              item.setAttribute('aria-selected', isActive);
            });
            
            // Update state but don't scroll
            this.currentIngredient = ingredient;
          }
        }
      });
    }, { threshold: 0.5 });
    
    // Observe all ingredient details
    this.details.forEach(detail => observer.observe(detail));
  }
  
  trackTabChange(ingredient) {
    // For future analytics implementation
    console.log(`Ingredient tab changed to: ${ingredient}`);
  }
}

/**
 * FAQ Section Manager
 */
class FAQSection {
  constructor() {
    // Elements
    this.section = document.querySelector('.faq-section');
    this.categoryButtons = document.querySelectorAll('.faq-categories .category-btn');
    this.faqCards = document.querySelectorAll('.faq-card');
    this.faqTriggers = document.querySelectorAll('.faq-trigger');
    
    // State
    this.activeCategory = 'all';
    this.activeCard = null;
    
    // Initialize if section exists
    if (this.section) {
      this.init();
    }
  }
  
  init() {
    // Setup category filtering
    this.setupCategoryFilters();
    
    // Setup accordion functionality
    this.setupAccordions();
    
    // Setup animations
    this.setupAnimations();
  }
  
  setupCategoryFilters() {
    // Add click event listeners to category buttons
    this.categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        if (category) {
          this.filterByCategory(category);
        }
      });
    });
  }
  
  filterByCategory(category) {
    // Update active category
    this.activeCategory = category;
    
    // Update button states
    this.categoryButtons.forEach(button => {
      const isActive = button.getAttribute('data-category') === category;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive);
    });
    
    // Filter FAQ cards
    this.faqCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const shouldShow = category === 'all' || cardCategory === category;
      
      // Animate the filtering
      if (shouldShow) {
        // First make sure display is block
        card.style.display = 'block';
        
        // Then animate in
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        // Animate out then hide
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Hide after animation completes
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
        
        // Close any open accordions in this card
        const trigger = card.querySelector('.faq-trigger[aria-expanded="true"]');
        if (trigger) {
          this.closeAccordion(trigger);
        }
      }
    });
    
    // Track for analytics
    this.trackCategoryChange(category);
  }
  
  setupAccordions() {
    // Setup click event listeners for accordion triggers
    this.faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        this.toggleAccordion(trigger);
      });
      
      // Keyboard accessibility
      trigger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleAccordion(trigger);
        }
      });
    });
  }
  
  toggleAccordion(trigger) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const answer = document.getElementById(trigger.getAttribute('aria-controls'));
    const card = trigger.closest('.faq-card');
    
    if (!answer || !card) return;
    
    if (isExpanded) {
      // Close this accordion
      this.closeAccordion(trigger);
    } else {
      // Close any other open accordion
      if (this.activeCard && this.activeCard !== card) {
        const activeTrigger = this.activeCard.querySelector('.faq-trigger[aria-expanded="true"]');
        if (activeTrigger) {
          this.closeAccordion(activeTrigger);
        }
      }
      
      // Open this accordion
      trigger.setAttribute('aria-expanded', 'true');
      card.classList.add('active');
      
      // Animate opening
      answer.style.display = 'block';
      answer.style.height = '0';
      answer.style.overflow = 'hidden';
      
      // Get the height and animate
      const height = answer.scrollHeight;
      setTimeout(() => {
        answer.style.height = `${height}px`;
      }, 10);
      
      // Clean up after transition
      const handleTransitionEnd = () => {
        answer.style.height = '';
        answer.style.overflow = '';
        answer.removeEventListener('transitionend', handleTransitionEnd);
      };
      
      answer.addEventListener('transitionend', handleTransitionEnd);
      
      // Update active card reference
      this.activeCard = card;
      
      // Track for analytics
      this.trackAccordionOpen(trigger.querySelector('.question-content h3')?.textContent || 'FAQ item');
    }
  }
  
  closeAccordion(trigger) {
    const answer = document.getElementById(trigger.getAttribute('aria-controls'));
    const card = trigger.closest('.faq-card');
    
    if (!answer || !card) return;
    
    trigger.setAttribute('aria-expanded', 'false');
    card.classList.remove('active');
    
    // Animate closing
    const height = answer.scrollHeight;
    answer.style.height = `${height}px`;
    answer.style.overflow = 'hidden';
    
    // Trigger reflow
    answer.offsetHeight;
    
    // Collapse
    answer.style.height = '0';
    
    // Hide after transition
    const handleTransitionEnd = () => {
      answer.style.display = 'none';
      answer.style.height = '';
      answer.style.overflow = '';
      answer.removeEventListener('transitionend', handleTransitionEnd);
    };
    
    answer.addEventListener('transitionend', handleTransitionEnd);
    
    // Clear active card reference if this was the active one
    if (this.activeCard === card) {
      this.activeCard = null;
    }
  }
  
  setupAnimations() {
    // Skip if reduced motion is preferred
    if (Utils.handleReducedMotion()) return;
    
    // Animate FAQ cards when they enter viewport
    this.faqCards.forEach((card, index) => {
      Utils.addClassWhenInView(card, 'fade-in', 50);
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  }
  
  trackCategoryChange(category) {
    // For future analytics implementation
    console.log(`FAQ category changed to: ${category}`);
  }
  
  trackAccordionOpen(question) {
    // For future analytics implementation
    console.log(`FAQ opened: ${question}`);
  }
}

/**
 * Reviews Section Manager
 */
class ReviewsSection {
  constructor() {
    // Elements
    this.section = document.querySelector('.reviews-section');
    this.reviewCards = document.querySelectorAll('.review-card');
    this.ctaButton = document.querySelector('.btn-reviews-cta');
    
    // Initialize if section exists
    if (this.section) {
      this.init();
    }
  }
  
  init() {
    // Setup animations for review cards
    this.setupAnimations();
    
    // Setup CTA button interactions
    this.setupCtaButton();
  }
  
  setupAnimations() {
    // Skip if reduced motion is preferred
    if (Utils.handleReducedMotion()) return;
    
    // Animate review cards when they come into view
    this.reviewCards.forEach((card, index) => {
      Utils.addClassWhenInView(card, 'fade-in', 50);
      card.style.transitionDelay = `${index * 0.15}s`;
      
      // Add hover effect interactions
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = 'var(--shadow-lg)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }
  
  setupCtaButton() {
    // Add interaction effects to CTA button
    if (!this.ctaButton) return;
    
    this.ctaButton.addEventListener('mouseenter', () => {
      const svg = this.ctaButton.querySelector('svg');
      if (svg) {
        svg.style.transform = 'translateX(5px)';
      }
    });
    
    this.ctaButton.addEventListener('mouseleave', () => {
      const svg = this.ctaButton.querySelector('svg');
      if (svg) {
        svg.style.transform = '';
      }
    });
    
    // Track button clicks for analytics
    this.ctaButton.addEventListener('click', () => {
      const buttonText = this.ctaButton.textContent.trim();
      this.trackCtaClick(buttonText);
    });
  }
  
  trackCtaClick(buttonText) {
    // For future analytics implementation
    console.log(`Reviews CTA clicked: ${buttonText}`);
  }
}

/**
 * Setup Smooth Scrolling for Anchor Links
 */
function setupSmoothScrolling() {
  // Get all anchor links that point to an ID on the page
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Account for fixed header
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.offsetHeight : 0;
        
        // Calculate position
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        // Smooth scroll to target
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Basic Animation Setup (fallback when GSAP is not available)
 */
function setupBasicAnimations() {
  // Skip if reduced motion is preferred
  if (Utils.handleReducedMotion()) return;
  
  // Animate elements when they enter the viewport
  const animateElements = [
    '.section-title',
    '.section-subtitle',
    '.proof-column',
    '.testimonial-card',
    '.step-content',
    '.benefit-item',
    '.result-card',
    '.review-card',
    '.faq-card',
    '.cta-feature'
  ];
  
  animateElements.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      // Add staggered delay for groups of elements
      element.style.transitionDelay = `${index * 0.1}s`;
      Utils.addClassWhenInView(element, 'fade-in', 50);
    });
  });
}

/**
 * Initialize GSAP Animations
 * Only runs if GSAP library is loaded
 */
function initGSAPAnimations() {
  // Skip if reduced motion is preferred
  if (Utils.handleReducedMotion()) return;
  
  // Only run if GSAP is available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  // Hero section animations
  const heroElements = {
    title: '.hero-title .title-line',
    description: '.hero-description',
    features: '.feature-highlights',
    cta: '.hero-cta-group',
    social: '.social-proof',
    product: '.hero-product-column'
  };
  
  // Animate hero elements
  gsap.from(heroElements.title, {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  });
  
  gsap.from(heroElements.description, {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
  });
  
  gsap.from(heroElements.features, {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.7,
    ease: 'power3.out'
  });
  
  gsap.from(heroElements.cta, {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.9,
    ease: 'power3.out'
  });
  
  gsap.from(heroElements.social, {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 1.1,
    ease: 'power3.out'
  });
  
  gsap.from(heroElements.product, {
    opacity: 0,
    y: 40,
    duration: 1.2,
    delay: 0.4,
    ease: 'power3.out'
  });
  
  // Section headers animations (for all main sections)
  const sections = [
    '.advanced-social-proof',
    '.how-it-works',
    '.ingredients-showcase',
    '.reviews-section',
    '.faq-section',
    '.final-cta-section'
  ];
  
  sections.forEach(section => {
    // Animate section titles
    gsap.from(`${section} .section-title`, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%'
      }
    });
    
    // Animate section subtitles
    gsap.from(`${section} .section-subtitle`, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%'
      }
    });
  });
  
  // Animate proof columns
  gsap.from('.proof-column', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.social-proof-grid',
      start: 'top 80%'
    }
  });
  
  // Animate timeline steps
  gsap.from('.timeline-step', {
    opacity: 0,
    x: index => index % 2 === 0 ? -50 : 50,
    y: 30,
    duration: 0.8,
    stagger: 0.3,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.process-timeline',
      start: 'top 70%'
    }
  });
  
  // Animate ingredient detail
  gsap.from('.ingredient-detail.active', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.ingredient-details-container',
      start: 'top 70%'
    }
  });
  
  // Animate review cards
  gsap.from('.review-card', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.reviews-grid',
      start: 'top 70%'
    }
  });
  
  // Animate FAQ cards
  gsap.from('.faq-card', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.faq-grid',
      start: 'top 70%'
    }
  });
  
  // Animate final CTA
  gsap.from('.final-cta-content > *', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.final-cta-section',
      start: 'top 70%'
    }
  });
}

/**
 * Analytics Setup
 * Can be expanded to integrate with Google Analytics, Facebook Pixel, etc.
 */
function setupAnalytics() {
  // For now, just track page load
  console.log('Page loaded: S-Cream Website');
  
  // Track scroll depth
  let lastScrollDepth = 0;
  
  window.addEventListener('scroll', Utils.throttle(() => {
    const scrollPercent = Math.round(Utils.getScrollPercentage());
    
    // Log scroll depth at 25% intervals
    const milestones = [25, 50, 75, 100];
    
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && lastScrollDepth < milestone) {
        console.log(`Scroll depth: ${milestone}%`);
        // Could send to analytics:
        // if (typeof gtag !== 'undefined') {
        //   gtag('event', 'scroll_depth', {
        //     'depth': milestone
        //   });
        // }
      }
    });
    
    lastScrollDepth = scrollPercent;
  }, 1000));
}
