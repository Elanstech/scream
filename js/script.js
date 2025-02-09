// ==============================================
// Constants & Configurations
// ==============================================
const CONFIG = {
    animations: {
        duration: 400,
        scrollThreshold: 100,
        preloaderDelay: 800
    },
    classes: {
        active: 'active',
        hidden: 'hidden',
        scrolled: 'scrolled'
    }
};

// ==============================================
// DOM Elements
// ==============================================
const DOM = {
    // Core Elements
    body: document.body,
    preloader: document.querySelector('.preloader'),
    
    // Header Elements
    header: document.querySelector('.floating-header'),
    menuTrigger: document.querySelector('.menu-trigger'),
    fullscreenMenu: document.querySelector('.fullscreen-menu'),
    menuLinks: document.querySelectorAll('.menu-link'),
    
    // Hero Elements
    heroSection: document.querySelector('.hero-section'),
    heroVideo: document.querySelector('.video-background video'),
    ctaButton: document.querySelector('.cta-button'),
    scrollIndicator: document.querySelector('.scroll-indicator')
};

// ==============================================
// Preloader Handler
// ==============================================
class PreloaderHandler {
    static init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                DOM.preloader.style.opacity = '0';
                DOM.preloader.addEventListener('transitionend', () => {
                    DOM.preloader.style.display = 'none';
                    DOM.body.classList.add('loaded');
                });
            }, CONFIG.animations.preloaderDelay);
        });
    }
}

// ==============================================
// Menu Handler
// ==============================================
class MenuHandler {
    static init() {
        this.isMenuOpen = false;
        this.bindEvents();
    }

    static bindEvents() {
        // Menu Trigger Click
        DOM.menuTrigger.addEventListener('click', () => this.toggleMenu());

        // Menu Links Click
        DOM.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleMenuLinkClick(e));
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !e.target.closest('.menu-trigger') && 
                !e.target.closest('.fullscreen-menu')) {
                this.closeMenu();
            }
        });
    }

    static toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        DOM.menuTrigger.classList.toggle(CONFIG.classes.active);
        DOM.fullscreenMenu.classList.toggle(CONFIG.classes.active);
        DOM.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    static closeMenu() {
        this.isMenuOpen = false;
        DOM.menuTrigger.classList.remove(CONFIG.classes.active);
        DOM.fullscreenMenu.classList.remove(CONFIG.classes.active);
        DOM.body.style.overflow = '';
    }

    static handleMenuLinkClick(e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        
        this.closeMenu();
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ==============================================
// Scroll Handler
// ==============================================
class ScrollHandler {
    static init() {
        this.lastScroll = 0;
        this.bindEvents();
    }

    static bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    static handleScroll() {
        const currentScroll = window.pageYOffset;

        // Header Transform
        if (currentScroll > this.lastScroll && currentScroll > CONFIG.animations.scrollThreshold) {
            DOM.header.style.transform = 'translateY(-100%)';
        } else {
            DOM.header.style.transform = 'translateY(0)';
        }

        // Add scrolled class to header
        DOM.header.classList.toggle(
            CONFIG.classes.scrolled, 
            currentScroll > 0
        );

        // Hide/Show scroll indicator
        if (DOM.scrollIndicator) {
            DOM.scrollIndicator.style.opacity = 
                currentScroll > CONFIG.animations.scrollThreshold ? '0' : '1';
        }

        this.lastScroll = currentScroll;
    }
}

// ==============================================
// Hero Video Handler
// ==============================================
class HeroVideoHandler {
    static init() {
        if (DOM.heroVideo) {
            this.setupVideo();
        }
    }

    static setupVideo() {
        DOM.heroVideo.play().catch(error => {
            console.log('Auto-play was prevented:', error);
            // Add play button if autoplay fails
            this.createPlayButton();
        });

        // Handle video loading
        DOM.heroVideo.addEventListener('loadeddata', () => {
            DOM.heroVideo.classList.add('loaded');
        });
    }

    static createPlayButton() {
        const playButton = document.createElement('button');
        playButton.classList.add('video-play-button');
        playButton.innerHTML = '<span>Play</span>';
        
        DOM.heroSection.appendChild(playButton);
        
        playButton.addEventListener('click', () => {
            DOM.heroVideo.play();
            playButton.remove();
        });
    }
}

// ==============================================
// Animation Handler
// ==============================================
class AnimationHandler {
    static init() {
        this.setupEntryAnimations();
        this.setupHoverEffects();
    }

    static setupEntryAnimations() {
        // Animate hero content on load
        document.addEventListener('DOMContentLoaded', () => {
            const heroElements = [
                '.hero-title',
                '.hero-subtitle',
                '.cta-button',
                '.scroll-indicator'
            ].forEach((selector, index) => {
                const element = document.querySelector(selector);
                if (element) {
                    setTimeout(() => {
                        element.classList.add('fade-in');
                    }, index * 200);
                }
            });
        });
    }

    static setupHoverEffects() {
        // CTA Button hover effect
        if (DOM.ctaButton) {
            DOM.ctaButton.addEventListener('mouseenter', () => {
                DOM.ctaButton.style.transform = 'translateY(-2px)';
            });

            DOM.ctaButton.addEventListener('mouseleave', () => {
                DOM.ctaButton.style.transform = 'translateY(0)';
            });
        }
    }
}

// ==============================================
// Initialize Everything
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all handlers
    PreloaderHandler.init();
    MenuHandler.init();
    ScrollHandler.init();
    HeroVideoHandler.init();
    AnimationHandler.init();
    
    // Log initialization
    console.log('Website initialized successfully!');
});

// ==============================================
// Error Handling
// ==============================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
