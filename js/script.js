/**
 * =============================================================================
 * S-Cream Website - Modern JavaScript
 * Interactive functionality for premium user experience
 * Version: 1.0.0
 * =============================================================================
 */

// Main initialization function to run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing S-Cream website...');
  
  // Initialize core components
  initPageLoader();
  initFloatingHeader();
  initTopBanner();
  initScrollIndicator();
  initMobileMenu();
  initHeroSection();
  initCTAEffects();
  initHeaderScroll();
  initTrustBar();
  initBenefitsAnimations();
  initCounterAnimations();
  initBeforeAfterSlider();
  initTimelineAnimations();
  initTabsSystem();
  initClinicalChart();
  initVideoTestimonials();
  initReviewsMasonry();
  initFaqAccordion();
  initCountdownTimer();
  initPromoCodeCopy();
  initLiveChat();
  initBackToTop();
  initCookieConsent();
  initSmoothScrolling();
  
  // Initialize ingredients section components
  initIngredientsSlider();
  initParticleBackground();
  initAnimations();
  initProductInteraction();
  initMeterAnimations();
  
  // FIXED: Partner logo carousel - only initialize once
  initPartnerLogoCarousel();
  
  // Initialize AOS library for scroll animations if it exists
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      delay: 100,
      disable: window.innerWidth < 768 ? true : false
    });
  }
  
  // Initialize particles.js if available
  if (typeof particlesJS !== 'undefined') {
    initParticles();
  }
  
  // Update current year in footer
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});

/**
 * Initialize page loader animation
 */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  
  // Hide loader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      
      // Enable scroll after loader disappears
      document.body.style.overflow = 'auto';
    }, 500);
  });
  
  // Disable scroll while loading
  document.body.style.overflow = 'hidden';
}

/**
 * Initialize the floating header behavior
 */
function initFloatingHeader() {
  const header = document.querySelector('.floating-header');
  if (!header) return;
  
  let lastScrollTop = 0;
  const scrollThreshold = 100;
  
  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when scroll position is past threshold
    if (currentScrollTop > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Handle visibility when scrolling up/down
    if (currentScrollTop > lastScrollTop && currentScrollTop > 400) {
      // Scrolling down & past header height
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScrollTop;
  });
  
  // Update active link based on scroll position
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  if (navLinks.length) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + 200;
      
      // Find all sections with IDs
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          // Remove active class from all links
          navLinks.forEach(link => {
            link.classList.remove('active');
          });
          
          // Add active class to corresponding links
          document.querySelectorAll(`.nav-link[href="#${sectionId}"], .mobile-nav-link[href="#${sectionId}"]`).forEach(link => {
            link.classList.add('active');
          });
        }
      });
    });
  }
}

/**
 * Initialize top banner close functionality
 */
function initTopBanner() {
  const banner = document.querySelector('.top-banner');
  const closeBtn = document.querySelector('.banner-close');
  
  if (banner && closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.style.height = banner.offsetHeight + 'px';
      banner.style.overflow = 'hidden';
      
      setTimeout(() => {
        banner.style.height = '0';
        banner.style.padding = '0';
        banner.style.margin = '0';
        
        setTimeout(() => {
          banner.style.display = 'none';
        }, 300);
      }, 10);
      
      // Store closed state in localStorage
      localStorage.setItem('bannerClosed', 'true');
    });
    
    // Check if banner was previously closed
    const isBannerClosed = localStorage.getItem('bannerClosed') === 'true';
    if (isBannerClosed) {
      banner.style.display = 'none';
    }
  }
}

/**
 * Initialize scroll indicator functionality
 */
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;
  
  // Fade out scroll indicator as user scrolls down
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    if (scrollPosition > windowHeight * 0.1) {
      const opacity = Math.max(0, 1 - (scrollPosition - windowHeight * 0.1) / (windowHeight * 0.3));
      scrollIndicator.style.opacity = opacity;
    } else {
      scrollIndicator.style.opacity = 1;
    }
  });
  
  // Scroll down when indicator is clicked
  scrollIndicator.addEventListener('click', () => {
    const targetSection = document.querySelector('#benefits') || document.querySelector('section:nth-of-type(2)');
    
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback if no specific section is found
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  });
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.setAttribute('aria-hidden', isExpanded);
      
      // Toggle body scroll
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileNav.getAttribute('aria-hidden') === 'false' && 
          !mobileNav.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * Initialize Hero section interactive effects
 */
function initHeroSection() {
  // Video background handling
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    // Handle video loading error
    heroVideo.addEventListener('error', () => {
      const videoContainer = heroVideo.parentElement;
      const fallbackImage = document.querySelector('.fallback-image');
      
      if (videoContainer && fallbackImage) {
        // Hide video and show fallback image
        heroVideo.style.display = 'none';
        fallbackImage.style.display = 'block';
      }
    });
    
    // Mobile optimization - pause video when not visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroVideo.play();
          } else if (!entry.isIntersecting && !heroVideo.paused) {
            heroVideo.pause();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(heroVideo);
    }
  }
  
  // Product image interactive effects
  const productImage = document.getElementById('product-image');
  const productContainer = document.querySelector('.product-image-container');
  
  if (productImage && productContainer) {
    // 3D tilt effect on product image
    productContainer.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = productContainer.getBoundingClientRect();
      
      // Calculate mouse position relative to container
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      // Apply subtle rotation and shadow effects
      productContainer.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      productContainer.style.boxShadow = `${-x * 20}px ${-y * 20}px 30px rgba(255, 107, 107, 0.3)`;
    });
    
    // Reset on mouse leave
    productContainer.addEventListener('mouseleave', () => {
      productContainer.style.transform = 'translate(-50%, -50%)';
      productContainer.style.boxShadow = '0 0 50px rgba(255, 107, 107, 0.5)';
    });
  }
  
  // Animate callouts to appear one by one
  const callouts = document.querySelectorAll('.callout-item');
  callouts.forEach((callout, index) => {
    setTimeout(() => {
      callout.classList.add('active');
    }, 300 + (index * 200));
  });
  
  // Limited offer countdown timer
  const offerBanner = document.querySelector('.limited-offer-banner');
  if (offerBanner) {
    // Add pulsing effect after a delay
    setTimeout(() => {
      offerBanner.classList.add('pulse-attention');
    }, 5000);
  }
}

/**
 * Add dynamic CTA button effects
 */
function initCTAEffects() {
  const ctaButton = document.getElementById('hero-cta-button');
  if (!ctaButton) return;
  
  // Track views for urgency effects
  let hasViewed = sessionStorage.getItem('hasViewedCTA');
  
  if (!hasViewed) {
    // Add attention-grabbing animation after 3 seconds
    setTimeout(() => {
      ctaButton.classList.add('attention-pulse');
      
      setTimeout(() => {
        ctaButton.classList.remove('attention-pulse');
      }, 3000);
    }, 3000);
    
    sessionStorage.setItem('hasViewedCTA', 'true');
  }
  
  // Dynamic text on CTA button hover
  const ctaSpan = ctaButton.querySelector('span');
  if (ctaSpan) {
    const originalText = ctaSpan.textContent;
    
    ctaButton.addEventListener('mouseenter', () => {
      ctaSpan.textContent = 'Yes, I Want This!';
    });
    
    ctaButton.addEventListener('mouseleave', () => {
      ctaSpan.textContent = originalText;
    });
    
    // Add success feedback on click
    ctaButton.addEventListener('click', (e) => {
      // If not navigating to another page (for demo purposes)
      if (ctaButton.getAttribute('href') === '#' || ctaButton.getAttribute('href') === '') {
        e.preventDefault();
        
        // Change button text and style to indicate success
        ctaSpan.textContent = 'Perfect Choice!';
        ctaButton.classList.add('success');
        
        // Reset after delay
        setTimeout(() => {
          ctaSpan.textContent = originalText;
          ctaButton.classList.remove('success');
        }, 2000);
      }
    });
  }
}

/**
 * Make header transparent/solid based on scroll position
 */
function initHeaderScroll() {
  const header = document.querySelector('.hero-header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * Initialize advanced animations with GSAP if available
 */
function initAdvancedAnimations() {
  if (typeof gsap === 'undefined') return;
  
  // Stagger animations for hero content
  gsap.from('.hero-left > *', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });
  
  // Subtle parallax effect on scroll
  gsap.to('.hero-background', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  // Animated callouts for product features
  gsap.from('.product-callouts .callout-item', {
    opacity: 0,
    scale: 0.8,
    y: 20,
    duration: 0.6,
    stagger: 0.2,
    delay: 0.8,
    ease: 'back.out(1.7)'
  });
  
  // Advanced hero brand text animation
  const heroText = document.querySelector('.hero-brand');
  if (heroText) {
    const textTimeline = gsap.timeline({ repeat: -1, repeatDelay: 5 });
    
    textTimeline
      .to(heroText, { 
        backgroundPosition: '200% 0', 
        duration: 1.5, 
        ease: 'power2.inOut' 
      })
      .to(heroText, { 
        scale: 1.05, 
        duration: 0.3, 
        ease: 'power2.out' 
      }, '<0.5')
      .to(heroText, { 
        scale: 1, 
        duration: 0.3, 
        ease: 'power2.in' 
      }, '>0.2');
  }
  
  // Subtle animation for background video overlay
  gsap.to('.video-overlay', {
    opacity: 0.7,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

/**
 * Initialize trust bar animations
 */
function initTrustBar() {
  const trustBar = document.querySelector('.trust-bar');
  if (!trustBar) return;
  
  // Add hover effects to trust items
  const trustItems = trustBar.querySelectorAll('.trust-item');
  trustItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const icon = item.querySelector('.trust-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const icon = item.querySelector('.trust-icon');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
  });
  
  // Intersection Observer for animation when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate trust items when visible
          trustItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 100 * index);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    // Set initial state
    trustItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    observer.observe(trustBar);
  }
}

/**
 * Initialize partner logo carousel without duplicates
 */
function initPartnerLogoCarousel() {
  const partnersTrack = document.getElementById('partnersTrack');
  if (!partnersTrack) return;
  
  // Get all partner items (non-clones only)
  const partnerItems = partnersTrack.querySelectorAll('.partner-item:not(.partner-clone)');
  if (partnerItems.length === 0) return;
  
  // First, remove any existing clones to prevent duplicate cloning
  partnersTrack.querySelectorAll('.partner-clone').forEach(clone => clone.remove());
  
  // Create only one set of clones - enough for continuous scrolling
  partnerItems.forEach(item => {
    // Create just one clone for each item
    const clone = item.cloneNode(true);
    
    // Add class to identify clones
    clone.classList.add('partner-clone');
    
    // Append to the track
    partnersTrack.appendChild(clone);
  });
  
  // Calculate the proper width
  const itemWidth = partnerItems[0].offsetWidth + 
                    parseInt(getComputedStyle(partnerItems[0]).marginLeft || 0) + 
                    parseInt(getComputedStyle(partnerItems[0]).marginRight || 0);
  
  // Set animation duration based on the number of items
  const animationDuration = partnerItems.length * 5; // 5 seconds per item
  partnersTrack.style.animationDuration = `${animationDuration}s`;
  
  // Add pause on hover functionality
  partnersTrack.addEventListener('mouseenter', () => {
    partnersTrack.style.animationPlayState = 'paused';
  });
  
  partnersTrack.addEventListener('mouseleave', () => {
    partnersTrack.style.animationPlayState = 'running';
  });
  
  // Add touch support for mobile
  partnersTrack.addEventListener('touchstart', () => {
    partnersTrack.style.animationPlayState = 'paused';
  }, { passive: true });
  
  partnersTrack.addEventListener('touchend', () => {
    partnersTrack.style.animationPlayState = 'running';
  }, { passive: true });
}

/**
 * Initialize benefits section animations
 */
function initBenefitsAnimations() {
  const benefitCards = document.querySelectorAll('.benefit-card');
  
  if (benefitCards.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered animation when cards come into view
          setTimeout(() => {
            entry.target.classList.add('active');
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.opacity = '1';
          }, index * 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    benefitCards.forEach(card => {
      card.style.transform = 'translateY(30px)';
      card.style.opacity = '0';
      card.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
      observer.observe(card);
    });
  }
}

/**
 * Initialize counter animations for statistics
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target') || '0');
          const duration = 2000; // 2 seconds
          const step = 30; // Update every 30ms
          const increment = target / (duration / step);
          
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            entry.target.textContent = Math.floor(current);
            
            if (current >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
            }
          }, step);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
}

/**
 * Initialize before & after image slider
 */
function initBeforeAfterSlider() {
  const slider = document.getElementById('beforeAfterSlider');
  if (!slider) return;
  
  const handle = document.getElementById('sliderHandle');
  const sliderAfter = slider.querySelector('.slider-after');
  
  if (!handle || !sliderAfter) return;
  
  // Set initial position
  sliderAfter.style.width = '50%';
  
  // Function to set slider position
  const setPosition = (x) => {
    const sliderRect = slider.getBoundingClientRect();
    let position = (x - sliderRect.left) / sliderRect.width;
    
    // Constrain position between 0 and 1
    position = Math.max(0, Math.min(1, position));
    
    // Update slider position
    sliderAfter.style.width = `${position * 100}%`;
    handle.style.left = `${position * 100}%`;
  };
  
  // Handle drag events
  let isDragging = false;
  
  // Mouse events
  handle.addEventListener('mousedown', () => {
    isDragging = true;
    slider.classList.add('dragging');
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      setPosition(e.clientX);
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    slider.classList.remove('dragging');
  });
  
  // Touch events for mobile
  handle.addEventListener('touchstart', () => {
    isDragging = true;
    slider.classList.add('dragging');
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      setPosition(e.touches[0].clientX);
      e.preventDefault(); // Prevent scrolling while dragging
    }
  });
  
  document.addEventListener('touchend', () => {
    isDragging = false;
    slider.classList.remove('dragging');
  });
  
  // Allow clicking anywhere on slider to set position
  slider.addEventListener('click', (e) => {
    if (e.target !== handle) {
      setPosition(e.clientX);
    }
  });
}

/**
 * Initialize timeline animations
 */
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }
}

/**
 * Initialize the ingredients slider with Swiper
 */
function initIngredientsSlider() {
    // Check if Swiper and the container exist
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library is not loaded. The ingredients carousel requires Swiper.');
        return;
    }
    
    const sliderContainer = document.querySelector('.ingredients-slider');
    if (!sliderContainer) {
        console.warn('Ingredients slider container not found.');
        return;
    }
    
    // Initialize the Swiper slider with optimized configuration
    const swiper = new Swiper('.ingredients-slider', {
        // Core configuration
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        loop: false,
        speed: 600,
        autoHeight: false,
        
        // Center the active slide for better visibility
        centeredSlides: true,
        
        // Enable free mode for smoother sliding experience
        freeMode: {
            enabled: true,
            sticky: true,
            momentumBounce: false
        },
        
        // Responsive breakpoints
        breakpoints: {
            // Small mobile devices
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            // Tablets
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // Desktops
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },
        
        // Navigation
        navigation: {
            nextEl: '.ingredients-button-next',
            prevEl: '.ingredients-button-prev',
        },
        
        // Pagination (bullets)
        pagination: {
            el: '.ingredients-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        
        // Extra effects
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        
        // Events
        on: {
            init: function() {
                console.log('Ingredients slider initialized successfully');
                // Initialize the first slide
                setTimeout(() => {
                    animateCurrentSlideMeter(this);
                    highlightActiveCard(this);
                }, 500);
            },
            slideChange: function() {
                // Animate meters in the current slide
                animateCurrentSlideMeter(this);
            },
            slideChangeTransitionEnd: function() {
                // Additional effects after slide change
                highlightActiveCard(this);
            },
            resize: function() {
                // Re-calculate swiper dimensions on window resize
                this.update();
            }
        }
    });
    
    // Function to animate meter bars in the current slide
    function animateCurrentSlideMeter(swiper) {
        // Reset all meters first
        document.querySelectorAll('.meter-fill').forEach(meter => {
            meter.style.width = "0%";
            meter.style.transition = "none";
        });
        
        // Get current active slide
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (!activeSlide) return;
        
        // Get all meters in the active slide
        const meters = activeSlide.querySelectorAll('.meter-fill');
        
        // Animate each meter with a slight delay
        meters.forEach((meter, index) => {
            setTimeout(() => {
                meter.style.transition = "width 1s ease-out";
                
                // Get target width from inline style
                const targetWidth = getTargetWidth(meter);
                meter.style.width = targetWidth;
            }, 100 * index);
        });
    }
    
    // Helper function to safely extract target width from meter element
    function getTargetWidth(meter) {
        // Check for inline style first
        if (meter.style.width && meter.style.width !== "0%") {
            return meter.style.width;
        }
        
        // Try to get width from style attribute
        const styleAttr = meter.getAttribute('style');
        if (styleAttr && styleAttr.includes('width:')) {
            const widthMatch = styleAttr.match(/width:\s*([^;]+)/);
            if (widthMatch && widthMatch[1]) {
                return widthMatch[1].trim();
            }
        }
        
        // Default fallback - check dataset or use a default value
        return meter.dataset.width || "80%";
    }
    
    // Function to highlight the currently active card with visual effects
    function highlightActiveCard(swiper) {
        // Remove highlight from all cards
        document.querySelectorAll('.ingredient-card').forEach(card => {
            card.classList.remove('active-card');
        });
        
        // Add highlight class to active card
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide) {
            const activeCard = activeSlide.querySelector('.ingredient-card');
            if (activeCard) {
                activeCard.classList.add('active-card');
                
                // Add subtle animation
                activeCard.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    activeCard.style.transform = '';
                }, 300);
            }
        }
    }
    
    // Handle touch interactions for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });
    
    function handleSwipeGesture() {
        if (touchEndX < touchStartX) {
            // Swipe left - go to next slide
            swiper.slideNext();
        }
        if (touchEndX > touchStartX) {
            // Swipe right - go to previous slide
            swiper.slidePrev();
        }
    }
    
    // Add extra interaction for ingredient cards
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    ingredientCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Go to this slide when card is clicked
            swiper.slideTo(index);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('active-card')) {
                card.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active-card')) {
                card.style.transform = '';
            }
        });
    });
    
    // Return the swiper instance for potential external access
    return swiper;
}

/**
 * Add to document ready function
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the ingredients slider if not already initialized
    if (typeof initIngredientsSlider === 'function') {
        initIngredientsSlider();
    }
    
    // Also initialize section title fixing
    fixSectionTitles();
});

/**
 * Function to fix section title spacing and display issues
 */
function fixSectionTitles() {
    // Find all section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        // Ensure section-header-content wrapper is present
        if (!header.querySelector('.section-header-content')) {
            // Create wrapper if it doesn't exist
            const content = document.createElement('div');
            content.className = 'section-header-content';
            
            // Move children inside wrapper
            while (header.firstChild) {
                content.appendChild(header.firstChild);
            }
            
            // Append wrapper back to header
            header.appendChild(content);
        }
        
        // Fix badge/tag margins
        const badge = header.querySelector('.section-badge, .section-tag');
        if (badge) {
            badge.style.marginBottom = '1rem';
        }
        
        // Fix title margins
        const title = header.querySelector('.section-title');
        if (title) {
            title.style.marginBottom = '1rem';
            title.style.lineHeight = '1.2';
        }
        
        // Fix subtitle margins
        const subtitle = header.querySelector('.section-subtitle');
        if (subtitle) {
            subtitle.style.marginTop = '0';
        }
    });
    
    // Fix ingredients title specifically
    const ingredientsTitle = document.querySelector('.ingredients-title');
    if (ingredientsTitle) {
        ingredientsTitle.style.position = 'relative';
        
        // Add bottom decoration line if not present
        if (!ingredientsTitle.getAttribute('data-decorated')) {
            ingredientsTitle.setAttribute('data-decorated', 'true');
            
            // Add pseudoelement styling with CSS
            const style = document.createElement('style');
            style.textContent = `
                .ingredients-title::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 3px;
                    background: linear-gradient(90deg, #FF3166, #FF85A1);
                    border-radius: 3px;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Ensure proper initialization when page loads
window.addEventListener('load', () => {
    // Re-initialize on load to ensure everything is in place
    const swiper = document.querySelector('.ingredients-slider')?.swiper;
    
    if (swiper) {
        // Update swiper if it exists
        swiper.update();
    } else {
        // Initialize if it doesn't exist
        initIngredientsSlider();
    }
    
    // Fix any title issues again after full page load
    fixSectionTitles();
});
   
    // Function to animate meter bars in current slide
    function animateCurrentSlideMeter(swiper) {
        // Reset all meters first
        document.querySelectorAll('.meter-fill').forEach(meter => {
            meter.style.width = "0%";
            meter.style.transition = "none";
        });
        
        // Get current active slide and animate its meters
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (!activeSlide) return;
        
        const meters = activeSlide.querySelectorAll('.meter-fill');
        
        // Animate each meter with a slight delay
        meters.forEach((meter, index) => {
            setTimeout(() => {
                meter.style.transition = "width 1s ease-out";
                
                // FIXED: Safely get the width value
                const style = meter.getAttribute('style');
                let targetWidth = '0%'; // Default value
                if (style && style.includes('width:')) {
                    targetWidth = style.split('width:')[1];
                }
                
                meter.style.width = targetWidth;
            }, 100 * index);
        });
    }
    
    // Highlight the active card with effects
    function highlightActiveCard(swiper) {
        // Remove highlight from all cards
        document.querySelectorAll('.ingredient-card').forEach(card => {
            card.classList.remove('active-card');
        });
        
        // Add highlight to active card
        const activeCard = swiper.slides[swiper.activeIndex]?.querySelector('.ingredient-card');
        if (activeCard) {
            activeCard.classList.add('active-card');
        }
    }
}

/**
 * Initialize particle background for premium visual effect
 */
function initParticleBackground() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer || typeof particlesJS === 'undefined') return;
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 40,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ff6b8f"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 5,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ff6b8f",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "bubble"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 200,
                    size: 6,
                    duration: 2,
                    opacity: 0.8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

/**
 * Initialize custom animations for premium effects
 */
function initAnimations() {
    // Animated highlight effect for text
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        setInterval(() => {
            highlight.classList.add('pulse-highlight');
            setTimeout(() => {
                highlight.classList.remove('pulse-highlight');
            }, 1000);
        }, 3000);
    });
    
    // Animate validation banner
    const validationBanner = document.querySelector('.validation-banner');
    if (validationBanner) {
        // Add slight movement animation
        setInterval(() => {
            validationBanner.classList.add('pulse-banner');
            setTimeout(() => {
                validationBanner.classList.remove('pulse-banner');
            }, 1000);
        }, 5000);
    }
    
    // Animate CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        // Pulsing animation
        setInterval(() => {
            ctaButton.classList.add('pulse-strong');
            setTimeout(() => {
                ctaButton.classList.remove('pulse-strong');
            }, 1000);
        }, 4000);
    }
    
    // Animate certification badges
    const certBadges = document.querySelectorAll('.cert-badge');
    certBadges.forEach((badge, index) => {
        // Staggered subtle animations
        setInterval(() => {
            badge.classList.add('badge-highlight');
            setTimeout(() => {
                badge.classList.remove('badge-highlight');
            }, 1000);
        }, 6000 + (index * 1000));
    });
}

/**
 * Initialize product interaction effects
 */
function initProductInteraction() {
    const productContainer = document.querySelector('.product-highlight');
    const productImage = document.querySelector('.product-image');
    
    if (!productContainer || !productImage) return;
    
    // 3D tilt effect on product image
    productContainer.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = productContainer.getBoundingClientRect();
        
        // Calculate mouse position relative to container
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        // Apply subtle rotation and shadow effects
        productContainer.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        productContainer.style.boxShadow = `${-x * 20}px ${-y * 20}px 30px rgba(255, 49, 102, 0.3)`;
        
        // Move the glow effect
        const glow = productContainer.querySelector('.product-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${x * 100 + 50}% ${y * 100 + 50}%, rgba(255, 107, 107, 0.8), transparent 70%)`;
        }
    });
    
    // Reset on mouse leave
    productContainer.addEventListener('mouseleave', () => {
        productContainer.style.transform = '';
        productContainer.style.boxShadow = '';
        
        const glow = productContainer.querySelector('.product-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at center, rgba(255, 107, 107, 0.5), transparent 70%)`;
        }
    });
    
    // Product pulse animation
    const pulse = document.querySelector('.formula-pulse');
    if (pulse) {
        setInterval(() => {
            pulse.classList.add('pulse-animation');
            setTimeout(() => {
                pulse.classList.remove('pulse-animation');
            }, 1500);
        }, 3000);
    }
    
    // Zoom effect on click
    productContainer.addEventListener('click', () => {
        productContainer.classList.add('product-zoom');
        setTimeout(() => {
            productContainer.classList.remove('product-zoom');
        }, 500);
    });
}

/**
 * Initialize meter animations for ingredients cards
 * FIXED: Safely handle style attribute extraction
 */
function initMeterAnimations() {
    // Find all meter bars
    const meterBars = document.querySelectorAll('.meter-bar');
    
    // Add observer to animate meters when they come into view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const meter = entry.target.querySelector('.meter-fill');
                    if (meter) {
                        // FIXED: Safely get target width from inline style
                        const style = meter.getAttribute('style');
                        let targetWidth = '0%'; // Default value
                        if (style && style.includes('width:')) {
                            targetWidth = style.split('width:')[1];
                        }
                        
                        // Reset width first
                        meter.style.width = '0%';
                        
                        // Animate to target width
                        setTimeout(() => {
                            meter.style.transition = 'width 1s ease-out';
                            meter.style.width = targetWidth;
                        }, 200);
                    }
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe all meter bars
        meterBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

/**
 * Initialize tabs system
 */
function initTabsSystem() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  if (tabButtons.length && tabPanes.length) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        if (!targetTab) return;
        
        // Deactivate all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Activate target tab
        button.classList.add('active');
        
        const tabPane = document.getElementById(`tab-${targetTab}`);
        if (tabPane) {
            tabPane.classList.add('active');
        }
      });
    });
  }
}

/**
 * Initialize clinical chart visualization
 */
function initClinicalChart() {
  const chartCanvas = document.getElementById('clinicalChart');
  if (!chartCanvas || typeof Chart === 'undefined') return;
  
  // Chart configuration
  const ctx = chartCanvas.getContext('2d');
  const labels = ['Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12'];
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'With S-Cream',
          data: [45, 76, 125, 162, 215],
          borderColor: 'rgba(225, 122, 146, 0.8)',
          backgroundColor: 'rgba(225, 122, 146, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Without S-Cream (Control)',
          data: [42, 45, 50, 52, 55],
          borderColor: 'rgba(200, 200, 200, 0.5)',
          backgroundColor: 'rgba(200, 200, 200, 0.1)',
          tension: 0.4,
          fill: true,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + '% sensitivity';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sensitivity Increase (%)',
            color: '#666',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        },
        x: {
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
  
  // Animate chart when in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chart.update();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(chartCanvas);
  }
}

/**
 * Initialize video testimonials carousel
 */
function initVideoTestimonials() {
  const carousel = document.getElementById('videoCarousel');
  if (!carousel) return;
  
  const items = carousel.querySelectorAll('.video-item');
  const dots = document.querySelectorAll('#videoDots .video-dot');
  const prevBtn = document.getElementById('videoPrev');
  const nextBtn = document.getElementById('videoNext');
  
  if (!items.length) return;
  
  let currentIndex = 0;
  
  // Function to show specific slide
  const showSlide = (index) => {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    
    // Hide all slides
    items.forEach(item => {
      item.classList.remove('active');
    });
    
    // Update dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show current slide
    items[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    currentIndex = index;
  };
  
  // Event listeners for navigation controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
    });
  }
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });
  
  // Video play buttons
  const playButtons = carousel.querySelectorAll('.video-play-button');
  playButtons.forEach(button => {
    button.addEventListener('click', () => {
      const videoId = button.getAttribute('data-video-id');
      const wrapper = button.closest('.video-wrapper');
      
      if (videoId && wrapper) {
        // Replace thumbnail with embedded video
        wrapper.innerHTML = `
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          ></iframe>
        `;
      }
    });
  });
}

/**
 * Initialize reviews masonry layout
 */
function initReviewsMasonry() {
  const masonry = document.getElementById('reviewsMasonry');
  if (!masonry) return;
  
  // If we have the Masonry library, use it for advanced layout
  if (typeof Masonry !== 'undefined') {
    new Masonry(masonry, {
      itemSelector: '.review-card',
      columnWidth: '.review-card',
      percentPosition: true,
      gutter: 16
    });
  }
}

/**
 * Initialize FAQ accordion
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length) {
    faqQuestions.forEach((question) => {
      const answer = question.nextElementSibling;
      if (!answer) return;
      
      // Set initial height to 0 for closed state
      answer.style.maxHeight = '0px';
      
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other questions
        faqQuestions.forEach((q) => {
          if (q !== question && q.nextElementSibling) {
            q.setAttribute('aria-expanded', 'false');
            q.nextElementSibling.style.maxHeight = '0px';
          }
        });
        
        // Toggle current question
        question.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0px';
        }
      });
    });
  }
}

/**
 * Initialize countdown timer
 */
function initCountdownTimer() {
  const daysElement = document.getElementById('countdown-days');
  const hoursElement = document.getElementById('countdown-hours');
  const minutesElement = document.getElementById('countdown-minutes');
  const secondsElement = document.getElementById('countdown-seconds');
  
  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;
  
  // Set end date to 2 weeks from now if not stored in localStorage
  let endDate = localStorage.getItem('offerEndDate');
  
  if (!endDate) {
    // Create new end date if not stored
    const now = new Date();
    endDate = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
    localStorage.setItem('offerEndDate', endDate.toString());
  } else {
    endDate = new Date(endDate);
    
    // If offer has expired, reset it
    if (endDate < new Date()) {
      const now = new Date();
      endDate = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
      localStorage.setItem('offerEndDate', endDate.toString());
    }
  }
  
  // Update countdown
  function updateCountdown() {
    const currentTime = new Date();
    const difference = endDate - currentTime;
    
    if (difference <= 0) {
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
  }
  
  // Update countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * Initialize promo code copy functionality
 */
function initPromoCodeCopy() {
  const promoCode = document.getElementById('promoCode');
  const copyButton = document.getElementById('copyPromoButton');
  
  if (promoCode && copyButton) {
    copyButton.addEventListener('click', () => {
      // Create a temporary input element to copy from
      const tempInput = document.createElement('input');
      tempInput.value = promoCode.textContent;
      document.body.appendChild(tempInput);
      
      // Select and copy the content
      tempInput.select();
      document.execCommand('copy');
      
      // Remove the temporary element
      document.body.removeChild(tempInput);
      
      // Visual feedback
      const originalIcon = copyButton.innerHTML;
      copyButton.innerHTML = '<i class="bi bi-check"></i>';
      
      setTimeout(() => {
        copyButton.innerHTML = originalIcon;
      }, 2000);
    });
  }
}

/**
 * Initialize live chat functionality
 */
function initLiveChat() {
  const chatToggle = document.querySelector('.chat-toggle');
  const chatWindow = document.querySelector('.chat-window');
  const chatClose = document.querySelector('.chat-close');
  const chatInput = document.querySelector('.chat-input textarea');
  const sendButton = document.querySelector('.send-button');
  const chatMessages = document.querySelector('.chat-messages');
  
  if (!chatToggle || !chatWindow) return;
  
  // Toggle chat window
  chatToggle.addEventListener('click', () => {
    const isExpanded = chatToggle.getAttribute('aria-expanded') === 'true';
    chatToggle.setAttribute('aria-expanded', !isExpanded);
    chatWindow.setAttribute('aria-hidden', isExpanded);
    
    if (!isExpanded) {
      // Focus on input when opening chat
      setTimeout(() => {
        if (chatInput) chatInput.focus();
      }, 300);
    }
  });
  
  // Close chat window
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatToggle.setAttribute('aria-expanded', 'false');
      chatWindow.setAttribute('aria-hidden', 'true');
    });
  }
  
  // Send message functionality
  if (sendButton && chatInput && chatMessages) {
    const sendMessage = () => {
      const message = chatInput.value.trim();
      
      if (message) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = 'Just now';
        
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTime);
        
        // Add to chat
        chatMessages.appendChild(messageElement);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after delay
        setTimeout(() => {
          const responseElement = document.createElement('div');
          responseElement.className = 'message received';
          
          const responseContent = document.createElement('div');
          responseContent.className = 'message-content';
          responseContent.textContent = "Thanks for your message! I'll help you find the perfect S-Cream formula for your needs. Could you tell me what specific benefits you're looking for?";
          
          const responseTime = document.createElement('div');
          responseTime.className = 'message-time';
          responseTime.textContent = 'Just now';
          
          responseElement.appendChild(responseContent);
          responseElement.appendChild(responseTime);
          
          chatMessages.appendChild(responseElement);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
      }
    };
    
    // Send on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send on Enter key (allow Shift+Enter for new line)
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = (chatInput.scrollHeight < 100) ? chatInput.scrollHeight + 'px' : '100px';
    });
  }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Initialize cookie consent banner
 */
function initCookieConsent() {
  const cookieConsent = document.getElementById('cookieConsent');
  if (!cookieConsent) return;
  
  const acceptButton = cookieConsent.querySelector('.cookie-accept');
  const settingsButton = cookieConsent.querySelector('.cookie-settings');
  
  // Check if user has already accepted cookies
  const cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
  
  if (!cookiesAccepted) {
    // Show cookie banner after a delay
    setTimeout(() => {
      cookieConsent.classList.add('visible');
    }, 2000);
  }
  
  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.classList.remove('visible');
    });
  }
  
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      // Here you would open a cookie settings modal instead
      // For simplicity, we'll just accept cookies
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.classList.remove('visible');
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initialize particles.js effect
 */
function initParticles() {
  if (typeof particlesJS === 'undefined' || !document.getElementById('particles-js')) return;
  
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { 
        type: "circle", 
        stroke: { width: 0, color: "#000000" }
      },
      opacity: {
        value: 0.3,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "bubble" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        bubble: { distance: 200, size: 4, duration: 2, opacity: 0.8, speed: 3 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

/**
 * Handle responsive layout adjustments
 */
function handleResponsiveLayout() {
  // Reinitialize components as needed for different screen sizes
  const slider = document.querySelector('.ingredients-slider');
  if (slider && typeof Swiper !== 'undefined' && slider.swiper) {
    // Destroy and reinitialize slider for proper responsiveness
    slider.swiper.destroy();
    initIngredientsSlider();
  }
}
