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

class FAQSectionManager {
    constructor() {
        // Core elements
        this.section = document.querySelector('.faq-section');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.questions = document.querySelectorAll('.faq-question');

        // State
        this.activeCategory = 'all';
        this.isAnimating = false;
        this.activeItem = null;

        // Initialize
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
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

        // Question toggles
        this.questions.forEach(question => {
            question.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.toggleQuestion(question);
                }
            });
        });

        // Keyboard navigation
        this.section.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllQuestions();
            }
        });
    }

    handleCategoryChange(category) {
        this.activeCategory = category;

        // Update button states
        this.categoryBtns.forEach(btn => {
            const isActive = btn.dataset.category === category;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        // Filter FAQ items
        this.faqItems.forEach(item => {
            const shouldShow = category === 'all' || item.dataset.category === category;
            
            gsap.to(item, {
                opacity: shouldShow ? 1 : 0,
                y: shouldShow ? 0 : 20,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    item.style.display = shouldShow ? 'block' : 'none';
                }
            });
        });

        // Close all open questions
        this.closeAllQuestions();
    }

    toggleQuestion(question) {
        const item = question.closest('.faq-item');
        const answer = question.nextElementSibling;
        const isExpanded = question.getAttribute('aria-expanded') === 'true';

        // Set animation flag
        this.isAnimating = true;

        if (!isExpanded) {
            // Close currently open question if exists
            if (this.activeItem && this.activeItem !== item) {
                this.closeQuestion(this.activeItem.querySelector('.faq-question'));
            }

            // Open clicked question
            question.setAttribute('aria-expanded', 'true');
            answer.style.display = 'block';
            answer.setAttribute('aria-hidden', 'false');

            gsap.fromTo(answer,
                { height: 0, opacity: 0 },
                {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    onComplete: () => {
                        this.isAnimating = false;
                        this.activeItem = item;
                    }
                }
            );

            // Add active class for styling
            item.classList.add('active');
        } else {
            this.closeQuestion(question);
        }
    }

    closeQuestion(question) {
        const item = question.closest('.faq-item');
        const answer = question.nextElementSibling;

        gsap.to(answer, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                question.setAttribute('aria-expanded', 'false');
                answer.style.display = 'none';
                answer.setAttribute('aria-hidden', 'true');
                this.isAnimating = false;
                this.activeItem = null;
                item.classList.remove('active');
            }
        });
    }

    closeAllQuestions() {
        this.questions.forEach(question => {
            if (question.getAttribute('aria-expanded') === 'true') {
                this.closeQuestion(question);
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateEntry(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        this.faqItems.forEach(item => observer.observe(item));
    }

    animateEntry(element) {
        gsap.from(element, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    initializeGSAPAnimations() {
        // Animate section title
        gsap.from('.faq-header .title-line', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.faq-header',
                start: 'top 80%'
            }
        });

        // Animate categories
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

        // Animate CTA section
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

    setupAccessibility() {
        // Add appropriate ARIA attributes
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            // Generate unique IDs
            const questionId = `faq-question-${Math.random().toString(36).substr(2, 9)}`;
            const answerId = `faq-answer-${Math.random().toString(36).substr(2, 9)}`;
            
            // Set up ARIA attributes
            question.setAttribute('id', questionId);
            question.setAttribute('aria-controls', answerId);
            answer.setAttribute('id', answerId);
            answer.setAttribute('role', 'region');
            answer.setAttribute('aria-labelledby', questionId);
        });

        // Add keyboard navigation
        this.questions.forEach(question => {
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleQuestion(question);
                }
            });
        });
    }

    // Public method to refresh the section
    refresh() {
        this.closeAllQuestions();
        this.activeCategory = 'all';
        this.handleCategoryChange('all');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const faqManager = new FAQSectionManager();

    // Handle dynamic content updates
    document.addEventListener('contentUpdated', () => {
        faqManager.refresh();
    });
});

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
