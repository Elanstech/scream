// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // ===============================
    // Global Variables & DOM Elements
    // ===============================
    const preloader = document.querySelector('.preloader');
    const header = document.getElementById('mainHeader');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const heroVideo = document.getElementById('heroVideo');
    const heroContent = document.querySelector('.hero-content');
    const featureCards = document.querySelectorAll('.feature-card');
    let isMenuOpen = false;
    let lastScrollTop = 0;

    // ===============================
    // Preloader Configuration
    // ===============================
    class PreloaderManager {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressText = document.querySelector('.progress-text');
        this.initializePreloader();
    }

    initializePreloader() {
        if (!this.preloader) return;

        // Shorter maximum loading time (reduced from 3000ms to 1500ms)
        const maxLoadTime = 1500;
        let progress = 0;
        
        // Faster progress increments
        const interval = setInterval(() => {
            progress += 5; // Increased increment from 1 to 5
            
            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
            }
            
            if (this.progressText) {
                this.progressText.textContent = `${progress}%`;
            }

            if (progress >= 100) {
                clearInterval(interval);
                this.hidePreloader();
            }
        }, 15); // Reduced interval from 30ms to 15ms

        // Ensure preloader doesn't get stuck
        setTimeout(() => {
            clearInterval(interval);
            this.hidePreloader();
        }, maxLoadTime);
    }

    hidePreloader() {
        if (!this.preloader) return;
        
        // Add fade out animation
        this.preloader.classList.add('fade-out');
        
        // Remove preloader after animation
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.classList.remove('loading');
        }, 300); // Reduced from 500ms to 300ms
    }
}

    // ===============================
    // Header Management
    // ===============================
   document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const header = document.querySelector('.header');
    const primaryNav = document.querySelector('.primary-navigation');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelectorAll('.nav-list a');

    // Toggle mobile navigation
    navToggle.addEventListener('click', () => {
        const visibility = primaryNav.getAttribute('data-visible');
        
        if (visibility === "true") {
            primaryNav.setAttribute('data-visible', false);
            navToggle.setAttribute('aria-expanded', false);
            navToggle.innerHTML = '<span class="sr-only">Menu</span><i class="fa-solid fa-bars"></i>';
        } else {
            primaryNav.setAttribute('data-visible', true);
            navToggle.setAttribute('aria-expanded', true);
            navToggle.innerHTML = '<span class="sr-only">Close</span><i class="fa-solid fa-xmark"></i>';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
            primaryNav.setAttribute('data-visible', false);
            navToggle.setAttribute('aria-expanded', false);
            navToggle.innerHTML = '<span class="sr-only">Menu</span><i class="fa-solid fa-bars"></i>';
        }
    });

    // Add scrolled class to header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});

    // ===============================
    // Hero Section Management
    // ===============================
    class HeroManager {
        constructor() {
            this.initializeHero();
        }

        initializeHero() {
            if (heroVideo) {
                this.setupVideo();
            }
            this.setupFeatureCards();
        }

        setupVideo() {
            // Optimize video playback
            heroVideo.setAttribute('playsinline', '');
            
            // Pause video when page is not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    heroVideo.pause();
                } else {
                    heroVideo.play();
                }
            });

            // Handle video loading error
            heroVideo.addEventListener('error', () => {
                heroVideo.style.display = 'none';
                console.warn('Video failed to load');
            });
        }

        setupFeatureCards() {
            featureCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.2}s`;
                
                // Add hover effect
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-5px)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            });
        }
    }

    // ===============================
    // Smooth Scroll
    // ===============================
    class SmoothScroll {
        constructor() {
            this.initializeSmoothScroll();
        }

        initializeSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollToTarget(anchor.getAttribute('href'));
                });
            });
        }

        scrollToTarget(targetId) {
            const target = document.querySelector(targetId);
            if (!target) return;

            const headerOffset = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top;
            const offsetPosition = targetPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ===============================
    // Page Animations
    // ===============================
    function startPageAnimations() {
        if (!heroContent) return;

        // Animate hero content
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.classList.add('animate');
        }, 100);

        // Animate feature cards
        featureCards.forEach((card, index) => {
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2}s`;
        });
    }

    // ===============================
    // Performance Optimizations
    // ===============================
    function setupPerformanceOptimizations() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                // Handle scroll-based animations
            });
        });

        // Handle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768) {
                    // Reset mobile menu state
                    isMenuOpen = false;
                    mainNav?.classList.remove('active');
                    menuToggle?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }

    // ===============================
// How It Works Section Management
// ===============================
class HowItWorksManager {
    constructor() {
        this.initializeObserver();
        this.initializeStepCards();
        this.initializeTimeline();
    }

    initializeObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    this.animateTimelineLine();
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '-50px'
        });

        document.querySelectorAll('.step-card').forEach(card => {
            this.observer.observe(card);
        });
    }

    initializeStepCards() {
        const stepCards = document.querySelectorAll('.step-card');
        
        stepCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.handleCardHover(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.handleCardHover(card, false);
            });

            card.classList.add('step-card-' + (index + 1));
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    handleCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            const stepNumber = card.querySelector('.step-number span').textContent;
            this.highlightTimelineSection(stepNumber);
        } else {
            card.style.transform = '';
            this.resetTimelineHighlight();
        }
    }

    initializeTimeline() {
        this.timelineProgress = 0;
        this.timelineLine = document.querySelector('.timeline-line');
        
        if (this.timelineLine) {
            this.timelineLine.style.transform = 'scaleY(0)';
            this.timelineLine.style.transformOrigin = 'top';
        }
    }

    animateTimelineLine() {
        if (!this.timelineLine) return;

        const timeline = document.querySelector('.steps-timeline');
        if (!timeline) return;

        const timelineRect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (timelineRect.top < viewportHeight && timelineRect.bottom > 0) {
            const progress = Math.min(
                1,
                (viewportHeight - timelineRect.top) / (viewportHeight + timelineRect.height)
            );
            
            this.timelineLine.style.transform = `scaleY(${Math.max(0, progress)})`;
        }
    }

    highlightTimelineSection(stepNumber) {
        const section = (stepNumber - 1) / 3;
        const timeline = document.querySelector('.timeline-line');
        if (timeline) {
            timeline.style.background = `linear-gradient(
                180deg,
                var(--accent-color) ${section * 100}%,
                rgba(var(--accent-rgb), 0.3) ${section * 100 + 5}%,
                var(--accent-color) 100%
            )`;
        }
    }

    resetTimelineHighlight() {
        const timeline = document.querySelector('.timeline-line');
        if (timeline) {
            timeline.style.background = `linear-gradient(
                180deg,
                var(--accent-color) 0%,
                rgba(var(--accent-rgb), 0.3) 100%
            )`;
        }
    }
}

    // ===============================
// Ingredients Section Manager
// ===============================
    // Ingredients Section Manager
class IngredientsManager {
    constructor() {
        this.initializeIngredients();
        this.setupAnimations();
        this.setupInteractions();
    }

    initializeIngredients() {
        // Get all ingredient cards
        this.ingredientCards = document.querySelectorAll('.ingredient-card');
        this.formulaDetails = document.querySelector('.formula-details');
        
        // Initialize molecular animation
        this.initializeMolecularAnimation();
    }

    setupAnimations() {
        // Add intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '-50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.startParticleAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe all ingredient cards
        this.ingredientCards.forEach(card => {
            observer.observe(card);
        });

        // Observe formula details
        if (this.formulaDetails) {
            observer.observe(this.formulaDetails);
        }
    }

    setupInteractions() {
        // Add hover interactions to ingredient cards
        this.ingredientCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
        });

        // Add click interaction
        this.ingredientCards.forEach(card => {
            card.addEventListener('click', () => this.handleCardClick(card));
        });
    }

    handleCardHover(card, isHovering) {
        if (isHovering) {
            // Add hover class for additional effects
            card.classList.add('card-hover');
            
            // Animate molecule icon
            const moleculeIcon = card.querySelector('.molecule-icon');
            if (moleculeIcon) {
                moleculeIcon.style.transform = 'rotate(180deg) scale(1.1)';
            }

            // Highlight dosage
            const dosage = card.querySelector('.dosage');
            if (dosage) {
                dosage.style.background = 'rgba(var(--accent-rgb), 0.2)';
            }
        } else {
            // Remove hover effects
            card.classList.remove('card-hover');
            
            // Reset molecule icon
            const moleculeIcon = card.querySelector('.molecule-icon');
            if (moleculeIcon) {
                moleculeIcon.style.transform = '';
            }

            // Reset dosage highlight
            const dosage = card.querySelector('.dosage');
            if (dosage) {
                dosage.style.background = '';
            }
        }
    }

    handleCardClick(card) {
        // Add pulse animation on click
        card.classList.add('card-pulse');
        
        // Remove pulse class after animation completes
        setTimeout(() => {
            card.classList.remove('card-pulse');
        }, 500);

        // Show ingredient details
        this.showIngredientDetails(card);
    }

    showIngredientDetails(card) {
        const ingredientName = card.querySelector('h3').textContent;
        const dosage = card.querySelector('.dosage').textContent;
        
        // Create or update details popup
        let popup = document.querySelector('.ingredient-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'ingredient-popup';
            document.body.appendChild(popup);
        }

        // Update popup content
        popup.innerHTML = `
            <div class="popup-content">
                <h4>${ingredientName}</h4>
                <p>Dosage: ${dosage}</p>
                <button class="close-popup">×</button>
            </div>
        `;

        // Show popup
        popup.style.display = 'flex';
        setTimeout(() => popup.classList.add('show'), 10);

        // Add close button functionality
        const closeButton = popup.querySelector('.close-popup');
        closeButton.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        });
    }

    initializeMolecularAnimation() {
        const moleculeAnimation = document.querySelector('.molecule-animation');
        if (!moleculeAnimation) return;

        // Create dynamic orbitals
        for (let i = 0; i < 3; i++) {
            const orbital = document.createElement('div');
            orbital.className = 'orbital';
            orbital.style.animationDelay = `${i * -3}s`;
            orbital.style.transform = `rotate(${i * 60}deg)`;
            moleculeAnimation.appendChild(orbital);
        }
    }

    startParticleAnimation(card) {
        const particle = document.createElement('div');
        particle.className = 'ingredient-particle';
        card.appendChild(particle);

        // Remove particle after animation
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

     // ===============================
    // TestimonialsManager
    // ===============================
    // Testimonials Section Manager
class TestimonialsManager {
    constructor() {
        this.currentSlide = 0;
        this.testimonials = [];
        this.results = [];
        this.initializeTestimonials();
    }

    initializeTestimonials() {
        // Initialize elements
        this.slider = document.querySelector('.testimonials-slider');
        this.resultsSlider = document.querySelector('.results-slider');
        this.prevBtn = document.querySelector('.nav-btn.prev');
        this.nextBtn = document.querySelector('.nav-btn.next');

        // Set up testimonial data
        this.testimonials = [
            {
                name: "Sarah J.",
                location: "New York, USA",
                rating: 5,
                text: "Absolutely transformative experience. The results were noticeable within weeks, and the discrete shipping was much appreciated.",
                satisfaction: 95,
                results: 90
            },
            {
                name: "Dr. Emma M.",
                location: "Medical Professional",
                rating: 5,
                text: "As a medical professional, I'm impressed by the scientific approach and quality of ingredients. The results speak for themselves.",
                isExpert: true
            },
            // Add more testimonials here
        ];

        this.results = [
            {
                satisfaction: 94,
                days: 28,
                recommend: 97
            },
            {
                satisfaction: 92,
                days: 30,
                recommend: 95
            }
            // Add more results here
        ];

        this.setupEventListeners();
        this.setupAnimations();
        this.initializeMetrics();
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.navigate('prev'));
            this.nextBtn.addEventListener('click', () => this.navigate('next'));
        }

        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.slider?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.navigate('next');
            } else {
                this.navigate('prev');
            }
        }
    }

    navigate(direction) {
        const previousSlide = this.currentSlide;
        
        if (direction === 'next') {
            this.currentSlide = (this.currentSlide + 1) % this.results.length;
        } else {
            this.currentSlide = (this.currentSlide - 1 + this.results.length) % this.results.length;
        }

        this.updateSlides(previousSlide);
    }

    updateSlides(previousSlide) {
        // Animate results transition
        this.animateResultsTransition(previousSlide);
        
        // Update navigation buttons state
        this.updateNavigationState();
    }

    animateResultsTransition(previousSlide) {
        const resultCard = document.querySelector('.result-card');
        if (!resultCard) return;

        // Add exit animation
        resultCard.classList.add('slide-exit');

        // After exit animation, update content and animate entrance
        setTimeout(() => {
            this.updateResultsContent(this.results[this.currentSlide]);
            resultCard.classList.remove('slide-exit');
            resultCard.classList.add('slide-enter');

            // Remove entrance animation class
            setTimeout(() => {
                resultCard.classList.remove('slide-enter');
            }, 300);
        }, 300);
    }

    updateResultsContent(result) {
        const resultCard = document.querySelector('.result-card');
        if (!resultCard) return;

        resultCard.innerHTML = `
            <div class="result-stats">
                <div class="stat">
                    <span class="stat-value">${result.satisfaction}%</span>
                    <span class="stat-label">Satisfaction Rate</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${result.days}</span>
                    <span class="stat-label">Days Average</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${result.recommend}%</span>
                    <span class="stat-label">Would Recommend</span>
                </div>
            </div>
        `;
    }

    updateNavigationState() {
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
            this.nextBtn.disabled = this.currentSlide === this.results.length - 1;
        }
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    if (entry.target.classList.contains('metric-fill')) {
                        this.animateMetric(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.2
        });

        // Observe testimonial cards
        document.querySelectorAll('.testimonial-card').forEach(card => {
            observer.observe(card);
        });

        // Observe metrics
        document.querySelectorAll('.metric-fill').forEach(metric => {
            observer.observe(metric);
        });
    }

    initializeMetrics() {
        document.querySelectorAll('.metric-fill').forEach(metric => {
            const width = metric.style.width;
            metric.style.width = '0';
            setTimeout(() => {
                metric.style.width = width;
            }, 100);
        });
    }

    animateMetric(metricElement) {
        const targetWidth = metricElement.getAttribute('data-width') || metricElement.style.width;
        metricElement.style.width = targetWidth;
    }
}
     // ===============================
    // Initialize Everything
    // ===============================
    // FAQ Section Manager
class FAQManager {
    constructor() {
        this.initializeFAQ();
    }

    initializeFAQ() {
        // Get all FAQ cards
        const faqCards = document.querySelectorAll('.faq-card');

        // Add click handlers
        faqCards.forEach(card => {
            const header = card.querySelector('.faq-header');
            header.addEventListener('click', () => this.toggleFAQ(card));

            // Initialize content height
            const content = card.querySelector('.faq-content');
            content.style.maxHeight = '0px';
        });

        // Add keyboard accessibility
        this.setupKeyboardNavigation(faqCards);
    }

    toggleFAQ(card) {
        const isActive = card.classList.contains('active');
        
        // Close all other cards
        document.querySelectorAll('.faq-card.active').forEach(activeCard => {
            if (activeCard !== card) {
                this.closeFAQ(activeCard);
            }
        });

        // Toggle current card
        if (isActive) {
            this.closeFAQ(card);
        } else {
            this.openFAQ(card);
        }
    }

    openFAQ(card) {
        card.classList.add('active');
        const content = card.querySelector('.faq-content');
        content.style.maxHeight = `${content.scrollHeight}px`;
    }

    closeFAQ(card) {
        card.classList.remove('active');
        const content = card.querySelector('.faq-content');
        content.style.maxHeight = '0px';
    }

    setupKeyboardNavigation(cards) {
        cards.forEach(card => {
            const header = card.querySelector('.faq-header');
            
            header.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.toggleFAQ(card);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.focusNextCard(card);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.focusPreviousCard(card);
                        break;
                }
            });

            // Make header focusable
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
        });
    }

    focusNextCard(currentCard) {
        const nextCard = currentCard.nextElementSibling;
        if (nextCard && nextCard.classList.contains('faq-card')) {
            nextCard.querySelector('.faq-header').focus();
        }
    }

    focusPreviousCard(currentCard) {
        const prevCard = currentCard.previousElementSibling;
        if (prevCard && prevCard.classList.contains('faq-card')) {
            prevCard.querySelector('.faq-header').focus();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const faqManager = new FAQManager();
});
    // ===============================
    // Secure Payment Section Manager
    // ===============================
// Secure Payment Section Manager
class SecurePaymentManager {
    constructor() {
        this.initializeSecurePayment();
    }

    initializeSecurePayment() {
        // Add card hover effects
        this.setupCardEffects();
        
        // Initialize payment method logos
        this.loadPaymentLogos();
        
        // Setup security indicators
        this.setupSecurityIndicators();
    }

    setupCardEffects() {
        const cards = document.querySelectorAll('.security-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.pulseSecurityIcon(card);
            });
        });
    }

    pulseSecurityIcon(card) {
        const icon = card.querySelector('.security-icon');
        if (!icon) return;

        icon.style.animation = 'none';
        icon.offsetHeight; // Trigger reflow
        icon.style.animation = 'pulse 1s ease';
    }

    loadPaymentLogos() {
        // Preload payment method logos
        const logos = document.querySelectorAll('.payment-methods img');
        
        logos.forEach(logo => {
            logo.addEventListener('load', () => {
                logo.classList.add('loaded');
            });
        });
    }

    setupSecurityIndicators() {
        // Add intersection observer for animated entrance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-security');
                }
            });
        }, {
            threshold: 0.2
        });

        // Observe features
        document.querySelectorAll('.feature').forEach(feature => {
            observer.observe(feature);
        });

        // Setup hover animations for features
        this.setupFeatureAnimations();
    }

    setupFeatureAnimations() {
        const features = document.querySelectorAll('.feature');
        
        features.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                const icon = feature.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        icon.style.transform = 'scale(1)';
                    }, 200);
                }
            });
        });
    }
}
    // ===============================
    // Initialize Everything
    // ===============================
    function initializeApp() {
        // Initialize all managers
        const preloaderManager = new PreloaderManager();
        const headerManager = new HeaderManager();
        const mobileMenuManager = new MobileMenuManager();
        const heroManager = new HeroManager();
        const smoothScroll = new SmoothScroll();
        const howItWorksManager = new HowItWorksManager();
        const ingredientsManager = new IngredientsManager();
        const testimonialsManager = new TestimonialsManager();
        const faqManager = new FAQManager();
        const securePaymentManager = new SecurePaymentManager();

        // Setup performance optimizations
        setupPerformanceOptimizations();

        // Remove initial loading state
        document.body.classList.remove('loading');
    }

    // Start initialization
    initializeApp();
});
