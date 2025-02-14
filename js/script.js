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
        this.header = document.querySelector('.site-header');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');
        this.lastScrollTop = 0;
        this.scrollThreshold = 50;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleScroll();
    }

    setupEventListeners() {
        // Menu toggle
        this.menuToggle?.addEventListener('click', () => this.toggleMobileMenu());

        // Mobile menu links
        this.mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Scroll handling
        window.addEventListener('scroll', () => this.handleScroll());

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMobileMenu();
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.mobileNav?.classList.contains('active') && 
                !this.mobileNav.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Resize handling
        window.addEventListener('resize', () => {
            if (window.innerWidth > 968) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        document.body.classList.toggle('menu-open');
        this.mobileNav?.classList.toggle('active');
    }

    closeMobileMenu() {
        document.body.classList.remove('menu-open');
        this.mobileNav?.classList.remove('active');
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove header background based on scroll position
        if (currentScroll > this.scrollThreshold) {
            this.header.classList.add('header-scrolled');
        } else {
            this.header.classList.remove('header-scrolled');
        }

        // Hide/show header based on scroll direction
        if (currentScroll > this.lastScrollTop && currentScroll > this.header.offsetHeight) {
            // Scrolling down
            this.header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            this.header.style.transform = 'translateY(0)';
        }

        this.lastScrollTop = currentScroll;
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
            this.benefitBadges.forEach((badge, index) => {
                badge.style.animationDelay = `${0.5 + (index * 0.2)}s`;
            });

            if (typeof gsap !== 'undefined') {
                this.initGSAPAnimations();
            }

            this.initializedAnimations = true;
        }
    }

    initGSAPAnimations() {
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
    }
}

// Social Proof Manager
class SocialProofManager {
    constructor() {
        this.initAnimations();
        this.setupCounters();
    }

    initAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger is not loaded.');
            return;
        }
        
        gsap.registerPlugin(ScrollTrigger);

        // Animate section header
        gsap.from('.advanced-social-proof .section-header', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.advanced-social-proof',
                start: 'top 80%'
            }
        });

        // Animate different columns
        const elements = [
            '.stats-column .stat-item',
            '.results-column .result-card',
            '.testimonial-column .testimonial-card'
        ];

        elements.forEach(selector => {
            gsap.from(selector, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: selector,
                    start: 'top 85%'
                }
            });
        });
    }

    setupCounters() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50; // Adjust for smoother animation
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            // Start counter when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(stat);
        });
    }
}

// How It Works Manager
class HowItWorksManager {
    constructor() {
        this.timelineSteps = document.querySelectorAll('.timeline-step');
        this.init();
    }

    init() {
        if (typeof gsap !== 'undefined') {
            this.initGSAPAnimations();
        } else {
            this.initBasicAnimations();
        }

        this.initHoverEffects();
    }

    initGSAPAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Animate section header
        gsap.from('.how-it-works-header', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.how-it-works',
                start: 'top 80%'
            }
        });

        // Animate timeline steps
        this.timelineSteps.forEach((step, index) => {
            gsap.from(step, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%'
                },
                delay: index * 0.2
            });
        });

        // Animate CTA
        gsap.from('.process-cta', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.process-cta',
                start: 'top 90%'
            }
        });
    }

    initBasicAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });

        this.timelineSteps.forEach(step => observer.observe(step));
    }

    initHoverEffects() {
        this.timelineSteps.forEach(step => {
            step.addEventListener('mouseenter', () => {
                step.classList.add('hover');
            });

            step.addEventListener('mouseleave', () => {
                step.classList.remove('hover');
            });
        });
    }
}

// Ingredients Manager
class IngredientsManager {
    constructor() {
        this.ingredientTabs = document.querySelectorAll('.ingredient-tab');
        this.ingredientDetails = document.querySelectorAll('.ingredient-detail');
        this.quickNavItems = document.querySelectorAll('.quick-nav-item');
        this.currentIngredient = 'aminophylline';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Desktop tab clicks
        this.ingredientTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const ingredient = tab.dataset.ingredient;
                this.switchIngredient(ingredient);
            });
        });

        // Mobile quick nav clicks
        this.quickNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const ingredient = item.dataset.ingredient;
                this.switchIngredient(ingredient);
                this.scrollToIngredient(ingredient);
            });
        });

        // Keyboard navigation
        this.ingredientTabs.forEach(tab => {
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const ingredient = tab.dataset.ingredient;
                    this.switchIngredient(ingredient);
                }
            });
        });
    }

    switchIngredient(ingredient) {
        this.currentIngredient = ingredient;

        // Update desktop tabs
        this.ingredientTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.ingredient === ingredient);
        });

        // Update mobile quick nav
        this.quickNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.ingredient === ingredient);
        });

        // Update detail sections with animation
        this.ingredientDetails.forEach(detail => {
            if (detail.dataset.ingredient === ingredient) {
                detail.style.display = 'block';
                setTimeout(() => detail.classList.add('active'), 50);
            } else {
                detail.classList.remove('active');
                setTimeout(() => {
                    if (!detail.classList.contains('active')) {
                        detail.style.display = 'none';
                    }
                }, 500);
            }
        });
    }

    scrollToIngredient(ingredient) {
        const detail = document.querySelector(`.ingredient-detail[data-ingredient="${ingredient}"]`);
        if (detail) {
            const offset = window.innerWidth <= 768 ? 100 : 50;
            const top = detail.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    }

    initializeAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Animate ingredient tabs
            gsap.from(this.ingredientTabs, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.ingredients-nav',
                    start: 'top 80%'
                }
            });

            // Animate validation cards
            gsap.from('.validation-card', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.scientific-validation',
                    start: 'top 80%'
                }
            });

            // Animate molecule paths
            this.ingredientDetails.forEach(detail => {
                const paths = detail.querySelectorAll('.molecule-paths path');
                gsap.to(paths, {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: detail,
                        start: 'top 70%'
                    }
                });
            });
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const ingredient = entry.target.dataset.ingredient;
                    this.updateQuickNav(ingredient);
                }
            });
        }, options);

        this.ingredientDetails.forEach(detail => observer.observe(detail));
    }

    updateQuickNav(ingredient) {
        this.quickNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.ingredient === ingredient);
        });
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const preloader = new PreloaderManager();
    const headerManager = new HeaderManager();
    const heroManager = new HeroManager();
    const socialProofManager = new SocialProofManager();
    const howItWorksManager = new HowItWorksManager();
    const ingredientsManager = new IngredientsManager();

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

    // Initialize smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
});
