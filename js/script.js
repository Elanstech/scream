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
            const increment = target / 50;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

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

// Key part for Ingredients section
class IngredientsManager {
    constructor() {
        // Initialize all needed elements
        this.ingredientTabs = document.querySelectorAll('.ingredient-tab');
        this.ingredientDetails = document.querySelectorAll('.ingredient-detail');
        this.quickNavItems = document.querySelectorAll('.quick-nav-item');
        this.currentIngredient = 'aminophylline';
        
        // Make sure all elements are visible initially
        this.ingredientTabs.forEach(tab => {
            tab.style.display = 'flex';
            tab.style.opacity = '1';
        });
        
        this.init();
    }

    init() {
        // Initialize all ingredients tabs and details
        this.ingredientTabs.forEach(tab => {
            tab.style.visibility = 'visible';
            tab.style.opacity = '1';
            const icon = tab.querySelector('.tab-icon');
            if (icon) {
                icon.style.visibility = 'visible';
                icon.style.opacity = '1';
            }
        });

        this.setupEventListeners();
        this.initializeAnimations();
        this.setupIntersectionObserver();
        
        // Show initial ingredient
        this.switchIngredient(this.currentIngredient);
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
        // Update tabs
        this.ingredientTabs.forEach(tab => {
            const isActive = tab.dataset.ingredient === ingredient;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        // Update mobile nav
        this.quickNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.ingredient === ingredient);
        });

        // Show/hide details with animation
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

// Benefits Section Manager
class BenefitsSectionManager {
    constructor() {
        // Core elements
        this.section = document.querySelector('.why-choose-section');
        this.cards = document.querySelectorAll('.benefit-card');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.statsCircles = document.querySelectorAll('.stat-circle svg path');
        this.ctaButton = document.querySelector('.cta-button');

        // State
        this.activeCategory = 'all';
        this.animatedCards = new Set();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Initialize
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupParallaxEffect();
        this.initializeGSAPAnimations();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Category filtering
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = btn.dataset.category;
                this.handleCategoryChange(category);
            });
        });

        // Card interactions
        this.cards.forEach(card => {
            // Mouse hover effects
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));

            // Touch handling for mobile
            let touchStart;
            card.addEventListener('touchstart', (e) => {
                touchStart = e.touches[0].clientX;
            });

            card.addEventListener('touchend', (e) => {
                const touchEnd = e.changedTouches[0].clientX;
                const difference = Math.abs(touchStart - touchEnd);
                
                if (difference < 10) { // Threshold for tap vs. swipe
                    this.handleCardFlip(card);
                }
            });

            // Learn more button clicks
            const learnMoreBtn = card.querySelector('.learn-more-btn');
            if (learnMoreBtn) {
                learnMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleLearnMore(card);
                });
            }
        });

        // Keyboard navigation
        this.section.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.resetAllCards();
            }
        });
    }

    handleCardHover(card, isEntering) {
        if (this.isReducedMotion) return;

        const icon = card.querySelector('.benefit-icon');
        const particles = card.querySelectorAll('.icon-particles span');

        if (isEntering) {
            gsap.to(icon, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: 'power2.out'
            });

            particles.forEach((particle, index) => {
                gsap.to(particle, {
                    opacity: 1,
                    x: (index - 1) * 15,
                    y: -15,
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: 'power2.out'
                });
            });
        } else {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.in'
            });

            particles.forEach(particle => {
                gsap.to(particle, {
                    opacity: 0,
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.in'
                });
            });
        }
    }

    handleCardFlip(card) {
        if (this.isReducedMotion) return;

        const cardInner = card.querySelector('.card-inner');
        const isFlipped = cardInner.style.transform === 'rotateY(180deg)';

        gsap.to(cardInner, {
            rotationY: isFlipped ? 0 : 180,
            duration: 0.6,
            ease: 'power2.inOut'
        });
    }

    handleCategoryChange(category) {
        this.activeCategory = category;
        
        // Update button states
        this.categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
            btn.setAttribute('aria-selected', btn.dataset.category === category);
        });

        // Filter cards with animation
        this.cards.forEach(card => {
            const shouldShow = category === 'all' || card.dataset.category === category;
            
            if (shouldShow) {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    display: 'block'
                });
            } else {
                gsap.to(card, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                        card.style.display = 'none';
                    }
                });
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedCards.has(entry.target)) {
                    this.animateCard(entry.target);
                    this.animatedCards.add(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        this.cards.forEach(card => observer.observe(card));
    }

    animateCard(card) {
        if (this.isReducedMotion) {
            card.style.opacity = 1;
            return;
        }

        // Card entrance animation
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Animate statistics
        const stats = card.querySelectorAll('.stat-circle');
        stats.forEach((stat, index) => {
            const path = stat.querySelector('svg path');
            const text = stat.querySelector('svg text');
            const finalValue = parseInt(text.textContent);

            if (path && text) {
                // Animate circle fill
                gsap.from(path, {
                    strokeDasharray: '0, 100',
                    duration: 1.5,
                    delay: 0.2 + (index * 0.1),
                    ease: 'power2.out'
                });

                // Animate number counter
                gsap.from(text, {
                    textContent: 0,
                    duration: 1.5,
                    delay: 0.2 + (index * 0.1),
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: () => {
                        if (finalValue > 0) {
                            text.textContent = Math.round(text.textContent);
                        }
                    }
                });
            }
        });
    }

    setupParallaxEffect() {
        if (this.isReducedMotion || window.innerWidth < 1024) return;

        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(card.querySelector('.card-inner'), {
                    rotationY: x * 10,
                    rotationX: -y * 10,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card.querySelector('.card-inner'), {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }

    initializeGSAPAnimations() {
        if (this.isReducedMotion) return;

        // Animate section title
        gsap.from('.section-title .title-line', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.benefits-header',
                start: 'top 80%'
            }
        });

        // Animate subtitle
        gsap.from('.section-subtitle', {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.benefits-header',
                start: 'top 80%'
            }
        });

        // Animate CTA section
        gsap.from('.benefits-cta', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.benefits-cta',
                start: 'top 90%'
            }
        });
    }

    setupAccessibility() {
        // Add ARIA attributes and roles
        this.cards.forEach(card => {
            const cardInner = card.querySelector('.card-inner');
            const frontSide = card.querySelector('.card-front');
            const backSide = card.querySelector('.card-back');

            card.setAttribute('role', 'article');
            frontSide.setAttribute('role', 'region');
            backSide.setAttribute('role', 'region');
            
            // Enable keyboard interaction
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardFlip(card);
                }
            });
        });

        // Category button accessibility
        this.categoryBtns.forEach(btn => {
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', btn.classList.contains('active'));
        });
    }

    resetAllCards() {
        this.cards.forEach(card => {
            const cardInner = card.querySelector('.card-inner');
            if (cardInner.style.transform === 'rotateY(180deg)') {
                this.handleCardFlip(card);
            }
        });
    }

    handleLearnMore(card) {
        const category = card.dataset.category;
        const title = card.querySelector('.benefit-title').textContent;
        console.log(`Learn more clicked for ${title} in category ${category}`);
        // Add custom logic for learn more button clicks
    }

    // Public method to refresh animations
    refresh() {
        this.animatedCards.clear();
        this.setupIntersectionObserver();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const benefitsManager = new BenefitsSectionManager();

    // Handle dynamic content updates
    document.addEventListener('contentUpdated', () => {
        benefitsManager.refresh();
    });
});

class FAQManager {
    constructor() {
        // Core elements
        this.section = document.querySelector('.faq-section');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.faqCards = document.querySelectorAll('.faq-card');
        this.triggers = document.querySelectorAll('.faq-trigger');
        
        // State
        this.activeCategory = 'all';
        this.activeCard = null;
        this.isAnimating = false;

        // Initialize
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.initializeGSAPAnimations();
    }

    setupEventListeners() {
        // Category filtering
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.handleCategoryChange(category);
            });
        });

        // FAQ triggers
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.toggleAnswer(trigger);
                }
            });
        });

        // Keyboard navigation
        this.section.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllAnswers();
            }
        });

        // Accessibility
        this.triggers.forEach(trigger => {
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleAnswer(trigger);
                }
            });
        });
    }

    handleCategoryChange(category) {
        // Update active state
        this.activeCategory = category;
        
        // Update buttons
        this.categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
            btn.setAttribute('aria-selected', btn.dataset.category === category);
        });

        // Filter cards
        this.faqCards.forEach(card => {
            const shouldShow = category === 'all' || card.dataset.category === category;
            
            if (shouldShow) {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    height: 'auto',
                    duration: 0.4,
                    ease: 'power2.out',
                    display: 'block'
                });
            } else {
                gsap.to(card, {
                    opacity: 0,
                    y: 20,
                    height: 0,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        card.style.display = 'none';
                    }
                });
            }
        });

        // Close any open answers
        this.closeAllAnswers();
    }

    toggleAnswer(trigger) {
        const card = trigger.closest('.faq-card');
        const answer = trigger.nextElementSibling;
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        this.isAnimating = true;

        if (!isExpanded) {
            // Close current open answer if exists
            if (this.activeCard && this.activeCard !== card) {
                this.closeAnswer(this.activeCard.querySelector('.faq-trigger'));
            }

            // Open new answer
            trigger.setAttribute('aria-expanded', 'true');
            answer.style.display = 'block';
            
            gsap.fromTo(answer,
                { height: 0, opacity: 0 },
                {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    onComplete: () => {
                        this.isAnimating = false;
                        this.activeCard = card;
                    }
                }
            );

            card.classList.add('active');
        } else {
            this.closeAnswer(trigger);
        }
    }

    closeAnswer(trigger) {
        const card = trigger.closest('.faq-card');
        const answer = trigger.nextElementSibling;

        gsap.to(answer, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                trigger.setAttribute('aria-expanded', 'false');
                answer.style.display = 'none';
                this.isAnimating = false;
                this.activeCard = null;
                card.classList.remove('active');
            }
        });
    }

    closeAllAnswers() {
        this.triggers.forEach(trigger => {
            if (trigger.getAttribute('aria-expanded') === 'true') {
                this.closeAnswer(trigger);
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCard(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        this.faqCards.forEach(card => observer.observe(card));
    }

    animateCard(card) {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    initializeGSAPAnimations() {
        gsap.from('.section-eyebrow', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.section-header',
                start: 'top 80%'
            }
        });

        gsap.from('.section-title .title-line', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.section-header',
                start: 'top 80%'
            }
        });

        gsap.from('.category-btn', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.faq-categories',
                start: 'top 85%'
            }
        });

        gsap.from('.faq-cta', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.faq-cta',
                start: 'top 90%'
            }
        });
    }
}

// Testimonials Section Manager
class TestimonialsManager {
    constructor() {
        // Core elements
        this.section = document.querySelector('.testimonials-section');
        this.reviewCards = Array.from(document.querySelectorAll('.review-card'));
        this.statCards = document.querySelectorAll('.stat-card');
        this.ctaButton = document.querySelector('.cta-button');

        // Initialize
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupInteractions();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('stat-card')) {
                        this.animateStatNumber(entry.target);
                    }
                }
            });
        }, options);

        // Observe review cards
        this.reviewCards.forEach(card => {
            observer.observe(card);
        });

        // Observe stat cards
        this.statCards.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateStatNumber(statCard) {
        const numberElement = statCard.querySelector('.stat-number');
        const targetNumber = parseFloat(numberElement.textContent);
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = duration / steps;

        let currentNumber = 0;
        const increment = targetNumber / steps;

        const updateNumber = () => {
            currentNumber += increment;
            if (currentNumber <= targetNumber) {
                if (Number.isInteger(targetNumber)) {
                    numberElement.textContent = Math.round(currentNumber);
                } else {
                    numberElement.textContent = currentNumber.toFixed(1);
                }
                setTimeout(updateNumber, stepDuration);
            } else {
                numberElement.textContent = targetNumber;
            }
        };

        updateNumber();
    }

    setupScrollAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.from(this.reviewCards, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.featured-reviews',
                    start: 'top 80%'
                }
            });

            gsap.from(this.statCards, {
                scale: 0.9,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.trust-stats',
                    start: 'top 80%'
                }
            });
        }
    }

    setupInteractions() {
        // Add hover effect to review cards
        this.reviewCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = 'var(--shadow-lg)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-sm)';
            });
        });

        // Add click animation to CTA button
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.ctaButton.appendChild(ripple);

                const rect = this.ctaButton.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;

                const x = e.clientX - rect.left - size/2;
                const y = e.clientY - rect.top - size/2;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                setTimeout(() => ripple.remove(), 600);

                // Navigate after animation
                setTimeout(() => {
                    window.location.href = this.ctaButton.href;
                }, 300);
            });
        }
    }
}

// Secure Shipping Section Manager
class SecureShippingManager {
    constructor() {
        // Core elements
        this.section = document.querySelector('.secure-shipping-section');
        this.securityCards = document.querySelectorAll('.security-card');
        this.timelineSteps = document.querySelectorAll('.timeline-step');
        this.trustItems = document.querySelectorAll('.trust-item');
        this.ctaButton = document.querySelector('.cta-button');
        
        // Animation states
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.animatedElements = new Set();
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCardInteractions();
        this.setupTimelineAnimation();
        this.setupTrustCounters();
        this.setupCTAEffects();
        this.initParallaxEffects();
    }

    setupScrollAnimations() {
        const options = {
            root: null,
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add fade-in animation
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements
        this.securityCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        this.trustItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(item);
        });
    }

    setupCardInteractions() {
        this.securityCards.forEach(card => {
            // Add hover effect with 3D rotation
            card.addEventListener('mousemove', (e) => {
                if (this.isReducedMotion) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = 
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

                // Add highlight effect
                const highlight = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`;
                card.style.backgroundImage = highlight;
            });

            // Reset card on mouse leave
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                card.style.backgroundImage = 'none';
            });

            // Add click ripple effect
            card.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;

                card.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    setupTimelineAnimation() {
        this.timelineSteps.forEach((step, index) => {
            // Animate dots sequentially
            setTimeout(() => {
                step.classList.add('active');
                
                // Add pulsing effect to dot
                const dot = step.querySelector('.step-dot');
                dot.style.animation = 'pulse 2s infinite';
            }, index * 1000);
        });
    }

    setupTrustCounters() {
        this.trustItems.forEach(item => {
            const numberElement = item.querySelector('.trust-number');
            const targetText = numberElement.textContent;
            let targetNumber;
            let suffix = '';

            // Extract number and suffix
            if (targetText.includes('-bit')) {
                targetNumber = parseInt(targetText);
                suffix = '-bit';
            } else if (targetText.includes('%')) {
                targetNumber = parseInt(targetText);
                suffix = '%';
            } else if (targetText.includes('/')) {
                targetNumber = parseInt(targetText.split('/')[0]);
                suffix = '/7';
            }

            // Animate counter
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(item)) {
                        this.animatedElements.add(item);
                        this.animateNumber(numberElement, targetNumber, suffix);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(item);
        });
    }

    animateNumber(element, target, suffix) {
        const duration = 2000;
        const steps = 60;
        const stepValue = target / steps;
        let current = 0;

        const update = () => {
            current += stepValue;
            if (current < target) {
                element.textContent = `${Math.round(current)}${suffix}`;
                requestAnimationFrame(update);
            } else {
                element.textContent = `${target}${suffix}`;
            }
        };

        update();
    }

    setupCTAEffects() {
        if (!this.ctaButton) return;

        this.ctaButton.addEventListener('mouseenter', () => {
            const arrow = this.ctaButton.querySelector('.arrow-icon');
            if (arrow) {
                arrow.style.transform = 'translateX(8px)';
            }
        });

        this.ctaButton.addEventListener('mouseleave', () => {
            const arrow = this.ctaButton.querySelector('.arrow-icon');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    }

    initParallaxEffects() {
        if (this.isReducedMotion) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Parallax for security cards
            this.securityCards.forEach((card, index) => {
                const speed = 1 + (index * 0.1);
                const yPos = -(scrolled * speed / 10);
                card.style.transform = `translateY(${yPos}px)`;
            });

            // Counter-parallax for trust items
            this.trustItems.forEach((item, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = (scrolled * speed / 10);
                item.style.transform = `translateY(${yPos}px)`;
            });
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
    const BenefitsSectionManager = new BenefitsSectionManager();
    const faqManager = new FAQManager
    
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
