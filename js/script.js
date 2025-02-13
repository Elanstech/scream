// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Utility Functions
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

    // Smooth scroll to element
    scrollTo(target, offset = 80) {
        const element = document.querySelector(target);
        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Animate number counting
    animateNumber(element, target, duration = 2000, startValue = 0) {
        const start = startValue;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const animate = () => {
            current += increment;
            element.textContent = Math.round(current);

            if (current < target) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        animate();
    }
};

// Header Manager
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.hamburger = document.querySelector('.hamburger');
        this.mobileNav = document.querySelector('.nav-mobile');
        this.lastScroll = 0;
        this.scrollThreshold = 50;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleScroll = utils.debounce(this.handleScroll.bind(this), 10);
        window.addEventListener('scroll', this.handleScroll);
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.hamburger && this.mobileNav) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close menu on link click
        document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.mobileNav && 
                !this.mobileNav.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                utils.scrollTo(link.getAttribute('href'));
            });
        });
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Hide/show header based on scroll direction
        if (currentScroll > this.lastScroll && currentScroll > this.header.offsetHeight) {
            this.header.style.transform = 'translateY(-100%)';
        } else {
            this.header.style.transform = 'translateY(0)';
        }

        this.lastScroll = currentScroll;
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

// Hero Section Manager
// Hero Section JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Hero Section
    class HeroSection {
        constructor() {
            this.initializeVideo();
            this.setupAnimations();
            this.setupCounters();
            this.setupHotspots();
            this.setupCTAButton();
            this.setupScrollIndicator();
        }

        // Video Background Management
        initializeVideo() {
            const video = document.getElementById('heroVideo');
            if (!video) return;

            // Handle video loading and playback
            video.addEventListener('loadeddata', () => {
                video.play().catch(() => {
                    console.log('Auto-play prevented');
                });
            });

            // Optimize video playback
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    video.pause();
                } else {
                    video.play().catch(() => {});
                }
            });

            // Handle mobile optimization
            if (window.matchMedia('(max-width: 768px)').matches) {
                video.setAttribute('playsinline', '');
            }
        }

        // GSAP Animations
        setupAnimations() {
            // Hero content animations
            gsap.from('.hero-eyebrow', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.from('.hero-title .title-line', {
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out'
            });

            gsap.from('.hero-description', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.4,
                ease: 'power2.out'
            });

            // Benefits cards animation
            gsap.from('.benefit-card', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.2,
                delay: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.benefits-grid',
                    start: 'top 80%'
                }
            });

            // Product showcase animation
            gsap.from('.product-image', {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                delay: 0.8,
                ease: 'power2.out'
            });
        }

        // Number Counter Animation
        setupCounters() {
            const animateValue = (element, start, end, duration) => {
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const value = Math.floor(progress * (end - start) + start);
                    element.textContent = value;
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
            };

            // Animate stat number
            const statNumber = document.querySelector('.stat-number');
            if (statNumber) {
                const observerCallback = (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateValue(statNumber, 0, 94, 2000);
                            observer.unobserve(entry.target);
                        }
                    });
                };

                const observer = new IntersectionObserver(observerCallback, {
                    threshold: 0.5
                });

                observer.observe(statNumber);
            }
        }

        // Interactive Product Hotspots
        setupHotspots() {
            const hotspots = document.querySelectorAll('.hotspot');
            
            hotspots.forEach(hotspot => {
                // Hover effects
                hotspot.addEventListener('mouseenter', () => {
                    gsap.to(hotspot.querySelector('.hotspot-dot'), {
                        scale: 1.5,
                        duration: 0.3
                    });
                });

                hotspot.addEventListener('mouseleave', () => {
                    gsap.to(hotspot.querySelector('.hotspot-dot'), {
                        scale: 1,
                        duration: 0.3
                    });
                });

                // Mobile touch handling
                hotspot.addEventListener('click', (e) => {
                    e.preventDefault();
                    const content = hotspot.querySelector('.hotspot-content');
                    
                    // Close other open hotspots
                    document.querySelectorAll('.hotspot-content.active').forEach(item => {
                        if (item !== content) {
                            item.classList.remove('active');
                        }
                    });

                    content.classList.toggle('active');
                });
            });
        }

        // CTA Button Effects
        setupCTAButton() {
            const cta = document.querySelector('.primary-cta');
            if (!cta) return;

            // Add hover animation
            cta.addEventListener('mouseenter', () => {
                gsap.to(cta.querySelector('.btn-glow'), {
                    opacity: 0.15,
                    duration: 0.3
                });
            });

            cta.addEventListener('mouseleave', () => {
                gsap.to(cta.querySelector('.btn-glow'), {
                    opacity: 0,
                    duration: 0.3
                });
            });

            // Add click effect
            cta.addEventListener('click', () => {
                gsap.to(cta, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });

                // Implement your CTA click handler here
                // For example, scroll to form or open modal
            });
        }

        // Scroll Indicator
        setupScrollIndicator() {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (!scrollIndicator) return;

            scrollIndicator.addEventListener('click', () => {
                const nextSection = document.querySelector('#benefits') || 
                                  document.querySelector('section:nth-of-type(2)');
                if (nextSection) {
                    window.scrollTo({
                        top: nextSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });

            // Hide scroll indicator when scrolled
            window.addEventListener('scroll', () => {
                if (window.scrollY > window.innerHeight * 0.3) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            });
        }
    }

    // Initialize Hero Section
    const heroSection = new HeroSection();
});

// Testimonials Manager
class TestimonialsManager {
    constructor() {
        this.currentSlide = 0;
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.querySelector('.control-btn.prev');
        this.nextBtn = document.querySelector('.control-btn.next');
        this.pagination = document.querySelector('.pagination .current');

        this.init();
    }

    init() {
        if (!this.testimonials.length) return;

        this.setupEventListeners();
        this.updatePagination();
        this.startAutoPlay();
        this.initializeAnimations();
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Pause autoplay on hover
        document.querySelector('.testimonial-gallery')?.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        document.querySelector('.testimonial-gallery')?.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
        this.updateSlides();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.testimonials.length) % this.testimonials.length;
        this.updateSlides();
    }

    updateSlides() {
        this.testimonials.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.classList.add('active');
                this.animateSlideContent(slide);
            } else {
                slide.classList.remove('active');
            }
        });
        this.updatePagination();
    }

    updatePagination() {
        if (this.pagination) {
            this.pagination.textContent = String(this.currentSlide + 1).padStart(2, '0');
        }
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    animateSlideContent(slide) {
        gsap.from(slide.querySelectorAll('.animate'), {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    initializeAnimations() {
        // Animate metrics
        document.querySelectorAll('.metric-bar .bar-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            ScrollTrigger.create({
                trigger: bar,
                onEnter: () => {
                    gsap.to(bar, {
                        width: width,
                        duration: 1.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }
}

// FAQ Manager
class FAQManager {
    constructor() {
        this.faqCards = document.querySelectorAll('.faq-card');
        this.searchInput = document.querySelector('.search-input');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSearch();
        this.setupCategories();
    }

    setupEventListeners() {
        this.faqCards.forEach(card => {
            const trigger = card.querySelector('.faq-trigger');
            const content = card.querySelector('.faq-content');

            trigger?.addEventListener('click', () => {
                const isOpen = trigger.getAttribute('aria-expanded') === 'true';
                
                // Close other open FAQs
                this.faqCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const otherTrigger = otherCard.querySelector('.faq-trigger');
                        const otherContent = otherCard.querySelector('.faq-content');
                        
                        otherTrigger?.setAttribute('aria-expanded', 'false');
                        otherCard.classList.remove('active');
                        if (otherContent) {
                            otherContent.style.height = '0px';
                        }
                    }
                });

                // Toggle current FAQ
                trigger.setAttribute('aria-expanded', !isOpen);
                card.classList.toggle('active');
                
                if (content) {
                    content.style.height = !isOpen ? `${content.scrollHeight}px` : '0px';
                }
            });
        });
    }

    setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', utils.debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            this.faqCards.forEach(card => {
                const question = card.querySelector('.question').textContent.toLowerCase();
                const answer = card.querySelector('.answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }, 300));
    }

    setupCategories() {
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                this.categoryBtns.forEach(otherBtn => {
                    otherBtn.classList.remove('active');
                });
                btn.classList.add('active');

                this.faqCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Conversion Manager
class ConversionManager {
    constructor() {
        this.conversionBar = document.querySelector('.conversion-bar');
        this.timer = document.querySelector('.offer-timer');
        this.ctaButtons = document.querySelectorAll('[data-tracking]');
        
        this.init();
    }

    init() {
        this.setupScrollTrigger();
        this.setupTimer();
        this.setupTracking();
    }

    setupScrollTrigger() {
        if (!this.conversionBar) return;

        let lastScroll = 0;
        const showThreshold = 300;

        window.addEventListener('scroll', utils.debounce(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > showThreshold && currentScroll > lastScroll) {
                this.conversionBar.classList.add('visible');
            } else {
                this.conversionBar.classList.remove('visible');
            }
            
            lastScroll = currentScroll;
        }, 100));
    }

    setupTimer() {
        if (!this.timer) return;

        const updateTimer = () => {
            const now = new Date();
            const hours = 23 - now.getHours();
            const minutes = 59 - now.getMinutes();
            const seconds = 59 - now.getSeconds();

            const timeUnits = this.timer.querySelectorAll('.time-unit');
            timeUnits[0].textContent = String(hours).padStart(2, '0');
            timeUnits[1].textContent = String(minutes).padStart(2, '0');
            timeUnits[2].textContent = String(seconds).padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    setupTracking() {
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                const trackingId = button.dataset.tracking;
                // Implement your tracking logic here
                console.log(`CTA clicked: ${trackingId}`);
            });
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const header = new HeaderManager();
    const hero = new HeroManager();
    const testimonials = new TestimonialsManager();
    const faq = new FAQManager();
    const conversion = new ConversionManager();

    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-out'
    });

    // Handle initial animations
    gsap.from('.fade-in', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Initialize number counters
    document.querySelectorAll('[data-counter]').forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            onEnter: () => {
                utils.animateNumber(
                    counter,
                    parseInt(counter.dataset.counter),
                    2000
                );
            }
        });
    });
});
