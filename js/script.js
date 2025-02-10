// ==============================================
// Utility Functions
// ==============================================
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Handle intersection observer callback
    handleIntersection(entries, observer, callback) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
            }
        });
    }
};

// ==============================================
// PreloaderManager Class
// ==============================================
class PreloaderManager {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressText = document.querySelector('.progress-text');
        this.initializePreloader();
    }

    initializePreloader() {
        if (!this.preloader) return;

        const maxLoadTime = 1500;
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 5;
            
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
        }, 15);

        setTimeout(() => {
            clearInterval(interval);
            this.hidePreloader();
        }, maxLoadTime);
    }

    hidePreloader() {
        if (!this.preloader) return;
        
        this.preloader.classList.add('fade-out');
        
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.classList.remove('loading');
        }, 300);
    }
}

// ==============================================
// HeaderManager Class
// ==============================================
class HeaderManager {
    constructor() {
        // Header elements
        this.header = document.querySelector('.main-header');
        this.hamburger = document.querySelector('.hamburger');
        this.mobileNav = document.querySelector('.nav-mobile');
        this.overlay = document.querySelector('.mobile-menu-overlay');
        this.mobileLinks = document.querySelectorAll('.nav-mobile .nav-link');
        this.body = document.body;

        // State management
        this.lastScroll = 0;
        this.isMenuOpen = false;

        // Configuration
        this.config = {
            scrollThreshold: 50,
            mobileBreakpoint: 768,
            scrollTrigger: 100,
            headerHeight: 80
        };

        // Initialize
        this.init();
    }

    init() {
        // Bind event listeners
        this.bindEvents();
        
        // Initial header state check
        this.checkHeaderState();
        
        // Check if we need to adjust for iOS
        this.adjustForiOS();
    }

    bindEvents() {
        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Menu toggle events
        this.hamburger?.addEventListener('click', this.toggleMenu.bind(this));
        this.overlay?.addEventListener('click', this.closeMenu.bind(this));
        
        // Mobile link click events
        this.mobileLinks?.forEach(link => {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });

        // Resize event
        window.addEventListener('resize', this.handleResize.bind(this));

        // iOS events
        window.addEventListener('orientationchange', this.adjustForiOS.bind(this));
    }

    handleScroll() {
        requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class when past threshold
            if (currentScroll > this.config.scrollTrigger) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }

            // Update last scroll position
            this.lastScroll = currentScroll;
        });
    }

    toggleMenu(event) {
        if (event) event.preventDefault();
        
        this.isMenuOpen = !this.isMenuOpen;
        
        // Toggle classes
        this.hamburger?.classList.toggle('active');
        this.mobileNav?.classList.toggle('active');
        this.overlay?.classList.toggle('active');
        
        // Handle body scroll
        this.toggleBodyScroll();
        
        // Handle accessibility
        this.updateAccessibility();
    }

    closeMenu() {
        if (!this.isMenuOpen) return;
        
        this.isMenuOpen = false;
        
        // Remove active classes
        this.hamburger?.classList.remove('active');
        this.mobileNav?.classList.remove('active');
        this.overlay?.classList.remove('active');
        
        // Re-enable body scroll
        this.enableBodyScroll();
        
        // Reset accessibility
        this.updateAccessibility();
    }

    handleLinkClick(event) {
        // Close menu when link is clicked
        this.closeMenu();
        
        // Get the href attribute
        const href = event.currentTarget.getAttribute('href');
        
        // If it's a hash link, handle smooth scroll
        if (href?.startsWith('#')) {
            event.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                this.smoothScrollTo(target);
            }
        }
    }

    smoothScrollTo(target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - this.config.headerHeight;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, startPosition + distance * this.easeInOutCubic(progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    handleResize() {
        // Check if we should close mobile menu on desktop breakpoint
        if (window.innerWidth > this.config.mobileBreakpoint && this.isMenuOpen) {
            this.closeMenu();
        }
        
        // Adjust for iOS
        this.adjustForiOS();
    }

    toggleBodyScroll() {
        if (this.isMenuOpen) {
            this.disableBodyScroll();
        } else {
            this.enableBodyScroll();
        }
    }

    disableBodyScroll() {
        // Store current scroll position
        this.scrollPosition = window.pageYOffset;
        this.body.style.overflow = 'hidden';
        this.body.style.position = 'fixed';
        this.body.style.width = '100%';
        this.body.style.top = `-${this.scrollPosition}px`;
    }

    enableBodyScroll() {
        this.body.style.removeProperty('overflow');
        this.body.style.removeProperty('position');
        this.body.style.removeProperty('width');
        this.body.style.removeProperty('top');
        window.scrollTo(0, this.scrollPosition);
    }

    updateAccessibility() {
        // Update ARIA attributes
        this.hamburger?.setAttribute('aria-expanded', this.isMenuOpen.toString());
        this.mobileNav?.setAttribute('aria-hidden', (!this.isMenuOpen).toString());
        
        // Update focus management
        if (this.isMenuOpen) {
            this.trapFocus();
        } else {
            this.removeFocusTrap();
        }
    }

    trapFocus() {
        // Get all focusable elements in mobile nav
        const focusableElements = this.mobileNav?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements?.length) {
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            // Add keydown event listener for focus trap
            this.mobileNav.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
                
                if (e.key === 'Escape') {
                    this.closeMenu();
                }
            });
        }
    }

    removeFocusTrap() {
        this.mobileNav?.removeEventListener('keydown', () => {});
    }

    adjustForiOS() {
        // Check if we're on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS) {
            // Get the viewport height and multiply by 1% to get a value for vh unit
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Update mobile nav height
            if (this.mobileNav) {
                this.mobileNav.style.height = `calc(var(--vh, 1vh) * 100)`;
            }
        }
    }

    checkHeaderState() {
        // Check initial scroll position
        if (window.pageYOffset > this.config.scrollTrigger) {
            this.header?.classList.add('scrolled');
        }
    }

    // Public methods for external use
    static init() {
        return new HeaderManager();
    }
}

// Initialize HeaderManager
document.addEventListener('DOMContentLoaded', () => {
    const headerManager = HeaderManager.init();
});

// ==============================================
// HeroManager Class
// ==============================================
class HeroManager {
    constructor() {
        this.heroVideo = document.getElementById('heroVideo');
        this.heroContent = document.querySelector('.hero-content');
        this.featureCards = document.querySelectorAll('.feature-card');
        
        this.initializeHero();
    }

    initializeHero() {
        if (this.heroVideo) {
            this.setupVideo();
        }
        this.setupFeatureCards();
        this.startAnimations();
    }

    setupVideo() {
        this.heroVideo.setAttribute('playsinline', '');
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.heroVideo.pause();
            } else {
                this.heroVideo.play();
            }
        });

        this.heroVideo.addEventListener('error', () => {
            this.heroVideo.style.display = 'none';
            console.warn('Video failed to load');
        });
    }

    setupFeatureCards() {
        this.featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    startAnimations() {
        if (this.heroContent) {
            this.heroContent.style.opacity = '0';
            setTimeout(() => {
                this.heroContent.style.opacity = '1';
                this.heroContent.classList.add('animate');
            }, 100);
        }

        this.featureCards.forEach((card, index) => {
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2}s`;
        });
    }
}

// ==============================================
// SmoothScroll Class
// ==============================================
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

        const headerOffset = document.querySelector('.main-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top;
        const offsetPosition = targetPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ==============================================
// FAQManager Class
// ==============================================
class FAQManager {
    constructor() {
        this.initializeFAQ();
    }

    initializeFAQ() {
        const faqCards = document.querySelectorAll('.faq-card');
        
        faqCards.forEach(card => {
            const header = card.querySelector('.faq-header');
            header.addEventListener('click', () => this.toggleFAQ(card));

            const content = card.querySelector('.faq-content');
            content.style.maxHeight = '0px';
        });

        this.setupKeyboardNavigation(faqCards);
    }

    toggleFAQ(card) {
        const isActive = card.classList.contains('active');
        
        // Close other open FAQs
        document.querySelectorAll('.faq-card.active').forEach(activeCard => {
            if (activeCard !== card) {
                this.closeFAQ(activeCard);
            }
        });

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

            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
        });
    }

    focusNextCard(currentCard) {
        const nextCard = currentCard.nextElementSibling;
        if (nextCard?.classList.contains('faq-card')) {
            nextCard.querySelector('.faq-header').focus();
        }
    }

    focusPreviousCard(currentCard) {
        const prevCard = currentCard.previousElementSibling;
        if (prevCard?.classList.contains('faq-card')) {
            prevCard.querySelector('.faq-header').focus();
        }
    }
}

// ==============================================
// Initialize Everything
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const preloader = new PreloaderManager();
    const header = new HeaderManager();
    const hero = new HeroManager();
    const smoothScroll = new SmoothScroll();
    const faq = new FAQManager();

    // Setup performance optimizations
    const handleResize = utils.debounce(() => {
        if (window.innerWidth > 768) {
            document.body.style.overflow = '';
            const mobileNav = document.querySelector('.nav-mobile');
            const hamburger = document.querySelector('.hamburger');
            if (mobileNav) mobileNav.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    // Remove initial loading state
    document.body.classList.remove('loading');
});
