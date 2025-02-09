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
    const heroFeatures = document.querySelectorAll('.feature-bubble');
    
    // ===============================
    // Preloader Configuration
    // ===============================
    let videoLoaded = false;
    let domLoaded = false;

    function hidePreloader() {
        if (videoLoaded && domLoaded) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
                startHeroAnimations();
            }, 500);
        }
    }

    // Video load handling
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', () => {
            videoLoaded = true;
            hidePreloader();
        });

        // Fallback if video takes too long
        setTimeout(() => {
            if (!videoLoaded) {
                videoLoaded = true;
                hidePreloader();
            }
        }, 5000);
    } else {
        videoLoaded = true;
        hidePreloader();
    }

    // DOM content loaded
    window.addEventListener('load', () => {
        domLoaded = true;
        hidePreloader();
    });

    // ===============================
    // Header Scroll Effect
    // ===============================
    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class based on scroll position
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Optional: Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ===============================
    // Mobile Menu Configuration
    // ===============================
    function setupMobileMenu() {
        if (!menuToggle || !mainNav) return;

        menuToggle.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu when pressing escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Close menu when clicking nav links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    function toggleMobileMenu() {
        const isOpen = menuToggle.classList.contains('active');
        
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = isOpen ? '' : 'hidden';

        // Animate nav items if menu is opening
        if (!isOpen) {
            animateNavItems();
        }
    }

    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    function animateNavItems() {
        const navItems = mainNav.querySelectorAll('.nav-list a');
        navItems.forEach((item, index) => {
            item.style.animation = `fadeInNav 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    // ===============================
    // Hero Section Animations
    // ===============================
    function startHeroAnimations() {
        if (!heroContent) return;

        // Animate hero content
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.classList.add('animate');
        }, 100);

        // Animate feature bubbles
        heroFeatures.forEach((bubble, index) => {
            bubble.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2}s`;
        });
    }

    // ===============================
    // Smooth Scroll Configuration
    // ===============================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerOffset = header.offsetHeight;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===============================
    // Video Background Optimization
    // ===============================
    function setupVideoBackground() {
        if (!heroVideo) return;

        // Pause video if page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                heroVideo.pause();
            } else {
                heroVideo.play();
            }
        });

        // Reduce video quality on mobile
        function checkMobileVideo() {
            if (window.innerWidth <= 768) {
                heroVideo.setAttribute('playsinline', '');
                heroVideo.setAttribute('preload', 'none');
            }
        }

        window.addEventListener('resize', checkMobileVideo);
        checkMobileVideo();
    }

    // ===============================
    // Performance Optimizations
    // ===============================
    function debouncedResize(func, wait = 100) {
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

    const handleResize = debouncedResize(() => {
        if (window.innerWidth > 768) {
            document.body.style.overflow = '';
            mainNav?.classList.remove('active');
            menuToggle?.classList.remove('active');
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    // ===============================
    // Initialize Everything
    // ===============================
    function init() {
        setupMobileMenu();
        initSmoothScroll();
        setupVideoBackground();
    }

    // Start initialization
    init();
});
