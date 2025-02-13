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

// Header functionality
class Header {
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

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Header();
});

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

document.addEventListener('DOMContentLoaded', () => {
    // Clinical Results Chart Animation
    const resultCharts = document.querySelectorAll('.result-chart');
    
    const animateCharts = () => {
        resultCharts.forEach(chart => {
            const circle = chart.querySelector('.chart-circle');
            const percentage = chart.querySelector('.percentage');
            
            if (!circle || !percentage) return;

            const percentageValue = parseInt(percentage.textContent);
            
            // Animate circle fill
            requestAnimationFrame(() => {
                circle.style.strokeDasharray = `${percentageValue} 100`;
            });
        });
    };

    // Use Intersection Observer for performance
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCharts();
                chartObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe each chart
    resultCharts.forEach(chart => {
        chartObserver.observe(chart);
    });

    // Testimonial Slider Functionality
    const slider = document.querySelector('.testimonial-track');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    if (slider && prevButton && nextButton && testimonialCards.length > 0) {
        let currentIndex = 0;
        const cardWidth = testimonialCards[0].offsetWidth + 16; // Include margin

        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        };

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < testimonialCards.length - 1) {
                currentIndex++;
                updateSlider();
            }
        });

        // Responsive slider adjustment
        const handleResize = () => {
            const newCardWidth = testimonialCards[0].offsetWidth + 16;
            slider.style.transform = `translateX(-${currentIndex * newCardWidth}px)`;
        };

        window.addEventListener('resize', () => {
            // Debounce resize event
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(handleResize, 250);
        });
    }
});

// Initialize Social Proof functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const socialProofManager = new SocialProofManager();
});

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
