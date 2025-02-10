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
        this.header = document.querySelector('.main-header');
        this.hamburger = document.querySelector('.hamburger');
        this.mobileNav = document.querySelector('.nav-mobile');
        this.scrollThreshold = 50;
        this.lastScrollTop = 0;
        this.scrollTimeout = null;
        
        this.initializeHeader();
        this.setupEventListeners();
    }

    initializeHeader() {
        window.addEventListener('scroll', () => {
            if (this.scrollTimeout) {
                window.cancelAnimationFrame(this.scrollTimeout);
            }
            this.scrollTimeout = window.requestAnimationFrame(() => {
                this.handleHeaderScroll();
            });
        });
    }

    handleHeaderScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Hide/show header based on scroll direction
        if (currentScroll > this.lastScrollTop && currentScroll > this.header.offsetHeight) {
            this.header.style.transform = 'translateY(-100%)';
        } else {
            this.header.style.transform = 'translateY(0)';
        }

        this.lastScrollTop = currentScroll;
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.hamburger && this.mobileNav) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.mobileNav && !this.mobileNav.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.mobileNav.classList.toggle('active');
        document.body.style.overflow = this.mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

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
