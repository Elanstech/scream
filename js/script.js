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

    // ===============================
    // Preloader Configuration
    // ===============================
    class PreloaderManager {
        constructor() {
            this.videoLoaded = false;
            this.domLoaded = false;
            this.initializeLoading();
        }

        initializeLoading() {
            // Handle video loading
            if (heroVideo) {
                heroVideo.addEventListener('loadeddata', () => {
                    this.videoLoaded = true;
                    this.checkPreloader();
                });

                // Fallback if video takes too long
                setTimeout(() => {
                    if (!this.videoLoaded) {
                        this.videoLoaded = true;
                        this.checkPreloader();
                    }
                }, 5000);
            } else {
                this.videoLoaded = true;
            }

            // Handle DOM content loading
            window.addEventListener('load', () => {
                this.domLoaded = true;
                this.checkPreloader();
            });
        }

        checkPreloader() {
            if (this.videoLoaded && this.domLoaded) {
                this.hidePreloader();
            }
        }

        hidePreloader() {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
                startPageAnimations();
            }, 500);
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

            // Add/remove scrolled class
            if (currentScroll > this.scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
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

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Close menu on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMenu();
                }
            });

            // Handle navigation links
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
            // Optimize video playback
            heroVideo.setAttribute('playsinline', '');
            
            // Pause video when page is not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    heroVideo.pause();
                } else {
                    heroVideo.play();
                }
            });

            // Handle video loading error
            heroVideo.addEventListener('error', () => {
                heroVideo.style.display = 'none';
                console.warn('Video failed to load');
            });
        }

        setupFeatureCards() {
            featureCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.2}s`;
                
                // Add hover effect
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
    // Smooth Scroll
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
    // Page Animations
    // ===============================
    function startPageAnimations() {
        if (!heroContent) return;

        // Animate hero content
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.classList.add('animate');
        }, 100);

        // Animate feature cards
        featureCards.forEach((card, index) => {
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2}s`;
        });
    }

    // ===============================
    // Performance Optimizations
    // ===============================
    function setupPerformanceOptimizations() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                // Handle scroll-based animations
            });
        });

        // Handle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768) {
                    // Reset mobile menu state
                    isMenuOpen = false;
                    mainNav?.classList.remove('active');
                    menuToggle?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
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
            timeline.style.background = `linear-gradient(
                180deg,
                var(--accent-color) 0%,
                rgba(var(--accent-rgb), 0.3) 100%
            )`;
        }
    }
}

    // ===============================
    // Initialize Everything
    // ===============================
    function initializeApp() {
        // Initialize all managers
        const preloaderManager = new PreloaderManager();
        const headerManager = new HeaderManager();
        const mobileMenuManager = new MobileMenuManager();
        const heroManager = new HeroManager();
        const smoothScroll = new SmoothScroll();
        const howItWorksManager = new HowItWorksManager();

        // Setup performance optimizations
        setupPerformanceOptimizations();

        // Remove initial loading state
        document.body.classList.remove('loading');
    }

    // Start initialization
    initializeApp();
});
