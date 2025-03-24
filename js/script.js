/**
 * S-Cream Website JavaScript
 * Optimized version with modular structure
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  const header = new HeaderManager();
  const hero = new HeroSection();
  const ingredients = new IngredientsSection();
  const faq = new FAQSection();
  const testimonials = new TestimonialsSection();
  
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
  }
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
      link.addEventListener('click', () => {
        if (this.mobileNav && this.mobileNav.classList.contains('active')) {
          this.closeMobileMenu();
        }
      });
    });
    
    // Scroll handling
    window.addEventListener('scroll', Utils.debounce(() => this.handleScroll(), 10));
    
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
          !this.mobileNav.contains(e.target) && 
          !this.menuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.classList.toggle('menu-open', this.isMenuOpen);
    this.mobileNav.classList.toggle('active', this.isMenuOpen);
    
    // Update ARIA attributes
    this.menuToggle.setAttribute('aria-expanded', this.isMenuOpen);
    this.mobileNav.setAttribute('aria-hidden', !this.isMenuOpen);
  }
  
  closeMobileMenu() {
    this.isMenuOpen = false;
    document.body.classList.remove('menu-open');
    this.mobileNav.classList.remove('active');
    
    // Update ARIA attributes
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.mobileNav.setAttribute('aria-hidden', 'true');
  }
  
  handleScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add or remove scrolled class
    if (currentScrollTop > this.scrollThreshold) {
      this.header.classList.add('header-scrolled');
    } else {
      this.header.classList.remove('header-scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScrollTop > this.lastScrollTop && currentScrollTop > this.header.offsetHeight) {
      // Scrolling down
      this.header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      this.header.style.transform = 'translateY(0)';
    }
    
    this.lastScrollTop = currentScrollTop;
  }
}

/**
 * Hero Section
 */
class HeroSection {
  constructor() {
    // Elements
    this.hero = document.querySelector('.hero');
    this.heroVideo = document.getElementById('heroVideo');
    this.productImage = document.querySelector('.product-container');
    this.badges = document.querySelectorAll('.benefit-badge');
    
    // Initialize
    if (this.hero) {
      this.init();
    }
  }
  
  init() {
    // Initialize video
    if (this.heroVideo) {
      this.initVideo();
    }
    
    // Initialize product image interactions
    if (this.productImage && window.innerWidth >= 1024) {
      this.initProductInteraction();
    }
    
    // Start badge animations
    this.initBadgeAnimations();
  }
  
  initVideo() {
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.heroVideo.pause();
      } else {
        this.heroVideo.play().catch(() => {});
      }
    });
    
    // Handle video loading errors
    this.heroVideo.addEventListener('error', () => {
      console.warn('Hero video failed to load');
      this.heroVideo.parentNode.style.display = 'none';
    });
  }
  
  initProductInteraction() {
    // Skip on devices with reduced motion preference
    if (Utils.handleReducedMotion()) return;
    
    // Add tilt effect on mouse move
    this.productImage.addEventListener('mousemove', e => {
      const rect = this.productImage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      this.productImage.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
    });
    
    // Reset on mouse leave
    this.productImage.addEventListener('mouseleave', () => {
      this.productImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }
  
  initBadgeAnimations() {
    // Skip on devices with reduced motion preference
    if (Utils.handleReducedMotion()) return;
    
    // Add staggered animation for benefit badges on mobile
    if (window.innerWidth < 1024) {
      this.badges.forEach((badge, index) => {
        Utils.addClassWhenInView(badge, 'animate-in');
        badge.style.transitionDelay = `${index * 0.2}s`;
      });
    }
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
    this.currentIngredient = 'aminophylline';
    
    // Initialize
    if (this.section) {
      this.init();
    }
  }
  
  init() {
    // Set up tab functionality
    this.setupTabs();
    
    // Set up animations
    this.setupAnimations();
    
    // Handle scroll for mobile
    this.setupScrollObserver();
  }
  
  setupTabs() {
    // Desktop tab clicks
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const ingredient = tab.getAttribute('data-ingredient');
        if (ingredient) {
          this.switchToIngredient(ingredient);
        }
      });
      
      // Keyboard navigation
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
    
    // Mobile nav clicks
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
    
    // Update tab state
    this.tabs.forEach(tab => {
      const isActive = tab.getAttribute('data-ingredient') === ingredient;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });
    
    // Update mobile nav
    this.mobileNavItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-ingredient') === ingredient);
      item.setAttribute('aria-selected', item.getAttribute('data-ingredient') === ingredient);
    });
    
    // Update details panels
    this.details.forEach(detail => {
      if (detail.getAttribute('data-ingredient') === ingredient) {
        detail.style.display = 'block';
        // Use requestAnimationFrame to ensure display change has taken effect
        requestAnimationFrame(() => {
          detail.classList.add('active');
        });
      } else {
        detail.classList.remove('active');
        // Wait for transition before hiding
        const handleTransitionEnd = () => {
          if (!detail.classList.contains('active')) {
            detail.style.display = 'none';
          }
          detail.removeEventListener('transitionend', handleTransitionEnd);
        };
        detail.addEventListener('transitionend', handleTransitionEnd);
      }
    });
  }
  
  scrollToIngredient(ingredient) {
    const detailElement = document.querySelector(`.ingredient-detail[data-ingredient="${ingredient}"]`);
    if (!detailElement) return;
    
    const offset = window.innerWidth < 768 ? 100 : 50;
    const elementTop = detailElement.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    });
  }
  
  setupAnimations() {
    // Skip if reduced motion is preferred
    if (Utils.handleReducedMotion()) return;
    
    // Add animations to elements when they enter viewport
    const animateElements = [
      ...this.tabs,
      ...document.querySelectorAll('.molecule-circle'),
      ...document.querySelectorAll('.benefit-item')
    ];
    
    animateElements.forEach(element => {
      Utils.addClassWhenInView(element, 'animate-in');
    });
  }
  
  setupScrollObserver() {
    // Update mobile navigation based on which ingredient is in view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ingredient = entry.target.getAttribute('data-ingredient');
          if (ingredient) {
            // Update mobile nav without scrolling
            this.mobileNavItems.forEach(item => {
              item.classList.toggle('active', item.getAttribute('data-ingredient') === ingredient);
              item.setAttribute('aria-selected', item.getAttribute('data-ingredient') === ingredient);
            });
          }
        }
      });
    }, { threshold: 0.5 });
    
    this.details.forEach(detail => observer.observe(detail));
  }
}

/**
 * FAQ Section Manager
 */
class FAQSection {
  constructor() {
    // Elements
    this.section = document.querySelector('.faq-section');
    this.categoryButtons = document.querySelectorAll('.faq-section .category-btn');
    this.faqCards = document.querySelectorAll('.faq-card');
    this.faqTriggers = document.querySelectorAll('.faq-trigger');
    
    // State
    this.activeCategory = 'all';
    this.activeCard = null;
    
    // Initialize
    if (this.section) {
      this.init();
    }
  }
  
  init() {
    // Set up category filtering
    this.setupCategories();
    
    // Set up FAQ accordions
    this.setupAccordions();
    
    // Set up animations
    this.setupAnimations();
  }
  
  setupCategories() {
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
    
    // Filter cards
    this.faqCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const shouldShow = category === 'all' || cardCategory === category;
      
      if (shouldShow) {
        card.style.display = 'block';
      } else {
        // Close accordion if open
        const trigger = card.querySelector('.faq-trigger');
        if (trigger && trigger.getAttribute('aria-expanded') === 'true') {
          this.closeAccordion(trigger);
        }
        
        // Hide after transition
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
  
  setupAccordions() {
    this.faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        this.toggleAccordion(trigger);
      });
      
      // Keyboard support
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
    
    if (isExpanded) {
      this.closeAccordion(trigger);
    } else {
      // Close currently open accordion if exists
      if (this.activeCard && this.activeCard !== card) {
        const activeTrigger = this.activeCard.querySelector('.faq-trigger');
        this.closeAccordion(activeTrigger);
      }
      
      // Open this accordion
      trigger.setAttribute('aria-expanded', 'true');
      card.classList.add('active');
      
      // Show answer with animation
      answer.style.display = 'block';
      answer.style.height = '0';
      answer.style.overflow = 'hidden';
      
      // Get the height and animate
      const height = answer.scrollHeight;
      answer.style.height = height + 'px';
      
      // Clean up after transition
      const handleTransitionEnd = () => {
        answer.style.height = '';
        answer.style.overflow = '';
        answer.removeEventListener('transitionend', handleTransitionEnd);
      };
      
      answer.addEventListener('transitionend', handleTransitionEnd);
      
      // Update active card
      this.activeCard = card;
    }
  }
  
  closeAccordion(trigger) {
    const answer = document.getElementById(trigger.getAttribute('aria-controls'));
    const card = trigger.closest('.faq-card');
    
    trigger.setAttribute('aria-expanded', 'false');
    card.classList.remove('active');
    
    // Animate closing
    answer.style.height = answer.scrollHeight + 'px';
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
    
    // Add animations when scrolling into view
    this.faqCards.forEach((card, index) => {
      Utils.addClassWhenInView(card, 'fade-in');
      // Add staggered delay
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  }
}

/**
 * Testimonials Section
 */
class TestimonialsSection {
  constructor() {
    // Elements
    this.section = document.querySelector('.testimonials-section');
    this.cards = document.querySelectorAll('.review-card');
    this.stats = document.querySelectorAll('.stat-number');
    
    // Initialize
    if (this.section) {
      this.init();
    }
  }
  
  init() {
    // Animate cards on scroll
    this.animateCards();
    
    // Animate stat counters
    this.animateStats();
    
    // Add card interactions
    this.addCardInteractions();
  }
  
  animateCards() {
    // Skip if reduced motion is preferred
    if (Utils.handleReducedMotion()) return;
    
    this.cards.forEach((card, index) => {
      Utils.addClassWhenInView(card, 'fade-in');
      // Add staggered delay
      card.style.transitionDelay = `${index * 0.2}s`;
    });
  }
  
  animateStats() {
    // Skip if reduced motion is preferred
    if (Utils.handleReducedMotion()) return;
    
    this.stats.forEach(stat => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.countUp(stat);
            observer.unobserve(stat);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(stat);
    });
  }
  
  countUp(element) {
    const target = parseFloat(element.textContent);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let current = 0;
    const increment = target / steps;
    const isInteger = Number.isInteger(target);
    
    const updateNumber = () => {
      current += increment;
      
      if (current <= target) {
        if (isInteger) {
          element.textContent = Math.round(current);
        } else {
          element.textContent = current.toFixed(1);
        }
        setTimeout(updateNumber, stepDuration);
      } else {
        element.textContent = target;
      }
    };
    
    updateNumber();
  }
  
  addCardInteractions() {
    // Skip if reduced motion is preferred
    if (Utils.handleReducedMotion()) return;
    
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = 'var(--shadow-lg)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }
}

/**
 * Initialize GSAP Animations
 */
function initGSAPAnimations() {
  // Skip if reduced motion is preferred
  if (Utils.handleReducedMotion()) return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Hero animations
  gsap.from('.hero-title .title-line', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  });
  
  gsap.from('.hero-description', {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
  });
  
  gsap.from('.hero-cta-group', {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.7,
    ease: 'power3.out'
  });
  
  // Section headers animations
  const sections = [
    '.advanced-social-proof',
    '.ingredients-showcase',
    '.how-it-works',
    '.faq-section'
  ];
  
  sections.forEach(section => {
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
}

/**
 * Setup Smooth Scrolling for Anchor Links
 */
function setupSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
