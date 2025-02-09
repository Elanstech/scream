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
    });

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

    // ===============================
    // Header Management
    // ===============================
    class HeaderManager {
        constructor() {
            this.scrollThreshold = 50;
            this.scrollTimeout = null;
            this.initializeHeader();
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
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollTop = currentScroll;
        }
    }

    // ===============================
    // Mobile Menu Management
    // ===============================
    class MobileMenuManager {
        constructor() {
            this.initializeMenu();
        }

        initializeMenu() {
            if (!menuToggle || !mainNav) return;

            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });

            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    this.closeMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMenu();
                }
            });

            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });
        }

        toggleMenu() {
            isMenuOpen = !isMenuOpen;
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            
            if (isMenuOpen) {
                this.animateMenuItems();
            }
        }

        closeMenu() {
            if (!isMenuOpen) return;
            
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }

        animateMenuItems() {
            const navItems = mainNav.querySelectorAll('.nav-list a');
            navItems.forEach((item, index) => {
                item.style.animation = `fadeInNav 0.5s ease forwards ${index * 0.1}s`;
            });
        }
    }

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
            heroVideo.setAttribute('playsinline', '');
            
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    heroVideo.pause();
                } else {
                    heroVideo.play();
                }
            });

            heroVideo.addEventListener('error', () => {
                heroVideo.style.display = 'none';
                console.warn('Video failed to load');
            });
        }

        setupFeatureCards() {
            featureCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.2}s`;
                
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
    // Smooth Scroll Implementation
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
                timeline.style.background = 'var(--accent-color)';
            }
        }
    }
// ===============================
// Ingredients Section Management
// ===============================
class IngredientsManager {
    constructor() {
        this.currentTime = '2025-02-09 08:09:57';
        this.currentUser = 'Elanstech';
        this.initializeIngredients();
        this.setupAnimations();
        this.setupInteractions();
    }

    initializeIngredients() {
        this.ingredientCards = document.querySelectorAll('.ingredient-card');
        this.formulaDetails = document.querySelector('.formula-details');
        
        // Initialize molecular animation
        this.initializeMolecularAnimation();

        // Set up timestamp display
        this.updateTimestamp();
        setInterval(() => this.updateTimestamp(), 1000);
    }

    updateTimestamp() {
        const timestampDisplays = document.querySelectorAll('.ingredient-timestamp');
        timestampDisplays.forEach(display => {
            display.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19);
        });
    }

    setupAnimations() {
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

        this.ingredientCards.forEach(card => {
            observer.observe(card);
        });

        if (this.formulaDetails) {
            observer.observe(this.formulaDetails);
        }
    }

    setupInteractions() {
        this.ingredientCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
            card.addEventListener('click', () => this.handleCardClick(card));
        });

        // Initialize ingredient filters
        this.setupFilters();
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.ingredient-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterIngredients(category);
                
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    filterIngredients(category) {
        this.ingredientCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === 'all' || cardCategory === category) {
                card.style.display = '';
                setTimeout(() => card.classList.add('visible'), 10);
            } else {
                card.classList.remove('visible');
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }

    handleCardHover(card, isHovering) {
        if (isHovering) {
            card.classList.add('card-hover');
            const moleculeIcon = card.querySelector('.molecule-icon');
            if (moleculeIcon) {
                moleculeIcon.style.transform = 'rotate(180deg) scale(1.1)';
            }

            const dosage = card.querySelector('.dosage');
            if (dosage) {
                dosage.style.background = 'rgba(var(--accent-rgb), 0.2)';
            }

            // Add floating particles
            this.addFloatingParticles(card);
        } else {
            card.classList.remove('card-hover');
            const moleculeIcon = card.querySelector('.molecule-icon');
            if (moleculeIcon) {
                moleculeIcon.style.transform = '';
            }

            const dosage = card.querySelector('.dosage');
            if (dosage) {
                dosage.style.background = '';
            }
        }
    }

    handleCardClick(card) {
        card.classList.add('card-pulse');
        this.trackIngredientInteraction(card);
        
        setTimeout(() => {
            card.classList.remove('card-pulse');
        }, 500);

        this.showIngredientDetails(card);
    }

    showIngredientDetails(card) {
        const ingredientName = card.querySelector('h3').textContent;
        const dosage = card.querySelector('.dosage').textContent;
        
        let popup = document.querySelector('.ingredient-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'ingredient-popup';
            document.body.appendChild(popup);
        }

        popup.innerHTML = `
            <div class="popup-content">
                <h4>${ingredientName}</h4>
                <p>Dosage: ${dosage}</p>
                <div class="ingredient-details">
                    <div class="molecule-visualization"></div>
                    <div class="ingredient-benefits"></div>
                </div>
                <div class="ingredient-meta">
                    <span class="timestamp">${this.currentTime}</span>
                    <span class="user-info">${this.currentUser}</span>
                </div>
                <button class="close-popup">×</button>
            </div>
        `;

        popup.style.display = 'flex';
        setTimeout(() => popup.classList.add('show'), 10);

        const closeButton = popup.querySelector('.close-popup');
        closeButton.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        });

        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                popup.classList.remove('show');
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 300);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
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
            
            // Add electrons
            const electron = document.createElement('div');
            electron.className = 'electron';
            orbital.appendChild(electron);
            
            moleculeAnimation.appendChild(orbital);
        }

        // Add nucleus
        const nucleus = document.createElement('div');
        nucleus.className = 'nucleus';
        moleculeAnimation.appendChild(nucleus);

        // Add particle effects
        this.addParticleEffects(moleculeAnimation);
    }

    addParticleEffects(container) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'molecule-particle';
            particle.style.setProperty('--delay', `${Math.random() * 2}s`);
            particle.style.setProperty('--duration', `${1 + Math.random()}s`);
            container.appendChild(particle);
        }
    }

    addFloatingParticles(card) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.setProperty('--x', `${Math.random() * 100}%`);
            particle.style.setProperty('--y', `${Math.random() * 100}%`);
            particle.style.setProperty('--delay', `${Math.random()}s`);
            card.appendChild(particle);

            // Remove particle after animation
            particle.addEventListener('animationend', () => particle.remove());
        }
    }

    startParticleAnimation(card) {
        const particle = document.createElement('div');
        particle.className = 'ingredient-particle';
        
        // Randomize particle properties
        particle.style.setProperty('--x-start', `${Math.random() * 100}%`);
        particle.style.setProperty('--y-start', `${Math.random() * 100}%`);
        particle.style.setProperty('--scale', `${0.5 + Math.random()}`);
        particle.style.setProperty('--rotation', `${Math.random() * 360}deg`);
        
        card.appendChild(particle);

        // Remove particle after animation
        particle.addEventListener('animationend', () => {
            particle.remove();
        });

        // Create multiple particles
        if (Math.random() > 0.5) {
            setTimeout(() => {
                this.startParticleAnimation(card);
            }, Math.random() * 1000);
        }
    }

    trackIngredientInteraction(card) {
        const interactionData = {
            ingredientName: card.querySelector('h3').textContent,
            timestamp: this.currentTime,
            userLogin: this.currentUser
        };

        // Store interaction data
        const interactions = JSON.parse(localStorage.getItem('ingredientInteractions') || '[]');
        interactions.push(interactionData);
        localStorage.setItem('ingredientInteractions', JSON.stringify(interactions));
    }
}
// ===============================
// Testimonials Section Management
// ===============================
class TestimonialsManager {
    constructor() {
        this.currentSlide = 0;
        this.testimonials = [];
        this.results = [];
        this.currentTime = '2025-02-09 08:10:50';
        this.currentUser = 'Elanstech';
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
                results: 90,
                timestamp: this.currentTime
            },
            {
                name: "Dr. Emma M.",
                location: "Medical Professional",
                rating: 5,
                text: "As a medical professional, I'm impressed by the scientific approach and quality of ingredients. The results speak for themselves.",
                isExpert: true,
                timestamp: this.currentTime
            }
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
        ];

        this.setupEventListeners();
        this.setupAnimations();
        this.initializeMetrics();
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        const timeDisplays = document.querySelectorAll('.testimonial-timestamp');
        timeDisplays.forEach(display => {
            display.textContent = this.currentTime;
        });
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

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.slider && this.slider.matches(':hover')) {
                if (e.key === 'ArrowLeft') {
                    this.navigate('prev');
                } else if (e.key === 'ArrowRight') {
                    this.navigate('next');
                }
            }
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
            this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
        } else {
            this.currentSlide = (this.currentSlide - 1 + this.testimonials.length) % this.testimonials.length;
        }

        this.updateSlides(previousSlide);
    }

    updateSlides(previousSlide) {
        // Animate testimonial transition
        this.animateTestimonialTransition(previousSlide);
        
        // Update results data
        this.updateResultsContent(this.results[this.currentSlide]);
        
        // Update navigation buttons state
        this.updateNavigationState();

        // Update timestamp
        this.updateTimeDisplay();
    }

    animateTestimonialTransition(previousSlide) {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach((card, index) => {
            if (index === this.currentSlide) {
                card.classList.add('active');
                card.classList.remove('previous', 'next');
            } else if (index === previousSlide) {
                card.classList.add('previous');
                card.classList.remove('active', 'next');
            } else {
                card.classList.add('next');
                card.classList.remove('active', 'previous');
            }
        });
    }

    updateResultsContent(result) {
        if (!this.resultsSlider) return;

        const template = `
            <div class="result-card" data-aos="fade-up">
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
                <div class="result-meta">
                    <span class="timestamp">${this.currentTime}</span>
                    <span class="user-info">${this.currentUser}</span>
                </div>
            </div>
        `;

        this.resultsSlider.innerHTML = template;
    }

    updateNavigationState() {
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
            this.nextBtn.disabled = this.currentSlide === this.testimonials.length - 1;
        }
    }

    setupAnimations() {
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

        document.querySelectorAll('.testimonial-card, .metric-fill').forEach(element => {
            observer.observe(element);
        });
    }

    initializeMetrics() {
        document.querySelectorAll('.metric-fill').forEach(metric => {
            const width = metric.getAttribute('data-width');
            metric.style.width = '0';
            setTimeout(() => {
                metric.style.width = width;
            }, 100);
        });
    }

    animateMetric(metricElement) {
        const targetWidth = metricElement.getAttribute('data-width');
        metricElement.style.width = targetWidth;
    }
}
// ===============================
// FAQ Section Management
// ===============================
class FAQManager {
    constructor() {
        this.currentTime = '2025-02-09 08:12:05';
        this.currentUser = 'Elanstech';
        this.initializeFAQ();
    }

    initializeFAQ() {
        const faqCards = document.querySelectorAll('.faq-card');

        faqCards.forEach(card => {
            const header = card.querySelector('.faq-header');
            header.addEventListener('click', () => this.toggleFAQ(card));

            const content = card.querySelector('.faq-content');
            content.style.maxHeight = '0px';

            // Add timestamp and user info
            const meta = document.createElement('div');
            meta.className = 'faq-meta';
            meta.innerHTML = `
                <span class="timestamp">${this.currentTime}</span>
                <span class="user-info">${this.currentUser}</span>
            `;
            card.appendChild(meta);
        });

        this.setupKeyboardNavigation(faqCards);
    }

    toggleFAQ(card) {
        const isActive = card.classList.contains('active');
        
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

// ===============================
// Secure Payment Section Management
// ===============================
class SecurePaymentManager {
    constructor() {
        this.currentTime = '2025-02-09 08:12:05';
        this.currentUser = 'Elanstech';
        this.initializeSecurePayment();
    }

    initializeSecurePayment() {
        this.setupCardEffects();
        this.loadPaymentLogos();
        this.setupSecurityIndicators();
    }

    setupCardEffects() {
        const cards = document.querySelectorAll('.security-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.pulseSecurityIcon(card);
            });

            // Add timestamp and user info
            const meta = document.createElement('div');
            meta.className = 'security-meta';
            meta.innerHTML = `
                <span class="timestamp">${this.currentTime}</span>
                <span class="user-info">${this.currentUser}</span>
            `;
            card.appendChild(meta);
        });
    }

    pulseSecurityIcon(card) {
        const icon = card.querySelector('.security-icon');
        if (!icon) return;

        icon.style.animation = 'none';
        icon.offsetHeight;
        icon.style.animation = 'pulse 1s ease';
    }

    loadPaymentLogos() {
        const logos = document.querySelectorAll('.payment-methods img');
        
        logos.forEach(logo => {
            logo.addEventListener('load', () => {
                logo.classList.add('loaded');
            });
        });
    }

    setupSecurityIndicators() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-security');
                }
            });
        }, {
            threshold: 0.2
        });

        document.querySelectorAll('.feature').forEach(feature => {
            observer.observe(feature);
        });

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
// Initialization and Performance Optimizations
// ===============================
function setupPerformanceOptimizations() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            // Handle scroll-based animations
        });
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                isMenuOpen = false;
                mainNav?.classList.remove('active');
                menuToggle?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
}

function initializeApp() {
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

    setupPerformanceOptimizations();

    document.body.classList.remove('loading');
    updateUTCTime();
}

// Start initialization
initializeApp();
