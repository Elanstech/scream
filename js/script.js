// Utility Functions
const utils = {
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
    }
};

// Preloader Manager
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

// Header Manager
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.hamburger = document.querySelector('.mobile-menu-toggle');
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

        if (currentScroll > this.scrollThreshold) {
            this.header.classList.add('header-scrolled');
        } else {
            this.header.classList.remove('header-scrolled');
        }

        if (currentScroll > this.lastScrollTop && currentScroll > this.header.offsetHeight) {
            this.header.style.transform = 'translateY(-100%)';
        } else {
            this.header.style.transform = 'translateY(0)';
        }

        this.lastScrollTop = currentScroll;
    }

    setupEventListeners() {
        if (this.hamburger && this.mobileNav) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        document.addEventListener('click', (e) => {
            if (this.mobileNav && !this.mobileNav.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        document.body.classList.toggle('menu-open');
        this.hamburger.classList.toggle('active');
        this.mobileNav.classList.toggle('active');
    }

    closeMobileMenu() {
        document.body.classList.remove('menu-open');
        this.hamburger.classList.remove('active');
        this.mobileNav.classList.remove('active');
    }
}

// Hero Manager
class HeroManager {
    constructor() {
        this.heroVideo = document.getElementById('heroVideo');
        this.heroProduct = document.querySelector('.product-container');
        this.benefitBadges = document.querySelectorAll('.benefit-badge');
        this.initializedAnimations = false;
        
        this.initializeHero();
    }

    initializeHero() {
        if (this.heroVideo) {
            this.setupVideo();
        }

        if (this.heroProduct && window.matchMedia('(min-width: 992px)').matches) {
            this.setupProductTilt();
        }

        this.startAnimations();
    }

    setupVideo() {
        this.heroVideo.setAttribute('playsinline', '');
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.heroVideo.pause();
            } else {
                this.heroVideo.play().catch(() => {});
            }
        });

        this.heroVideo.addEventListener('error', () => {
            this.heroVideo.style.display = 'none';
            console.warn('Video failed to load');
        });
    }

    setupProductTilt() {
        this.heroProduct.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = this.heroProduct.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            this.heroProduct.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
        });

        this.heroProduct.addEventListener('mouseleave', () => {
            this.heroProduct.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    startAnimations() {
        if (!this.initializedAnimations) {
            document.querySelectorAll('.benefit-badge').forEach((badge, index) => {
                badge.style.animationDelay = `${0.5 + (index * 0.2)}s`;
            });

            document.querySelectorAll('.stat-card').forEach((stat, index) => {
                stat.style.animationDelay = `${1.5 + (index * 0.2)}s`;
            });

            this.initializedAnimations = true;
        }
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    const preloader = new PreloaderManager();
    const headerManager = new HeaderManager();
    const heroManager = new HeroManager();

    // Handle resize
    const handleResize = utils.debounce(() => {
        if (window.innerWidth > 992) {
            document.body.classList.remove('menu-open');
            const mobileNav = document.querySelector('.nav-mobile');
            const hamburger = document.querySelector('.mobile-menu-toggle');
            if (mobileNav) mobileNav.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    }, 250);

    window.addEventListener('resize', handleResize);
});
