// ===============================
// CONSTANTS AND CONFIGURATIONS
// ===============================
const CONFIG = {
    SCROLL: {
        HEADER_THRESHOLD: 50,
        HIDE_THRESHOLD: 100
    },
    ANIMATION: {
        DURATION: 300,
        PERSPECTIVE: 1000
    }
};

// ===============================
// DOM ELEMENT SELECTORS
// ===============================
const DOM = {
    header: {
        main: document.querySelector('.main-header'),
        nav: document.querySelector('.bubble-nav'),
        container: document.querySelector('.nav-container.glass'),
        menuToggle: document.getElementById('menuToggle'),
        navLinks: document.querySelector('.nav-links'),
        logoBubble: document.querySelector('.logo-bubble'),
        links: document.querySelectorAll('.bubble-link')
    }
};

// ===============================
// STATE MANAGEMENT
// ===============================
const State = {
    lastScroll: 0,
    isMenuOpen: false
};

// ===============================
// HEADER FUNCTIONALITY
// ===============================
const Header = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        DOM.header.menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        document.addEventListener('click', this.handleOutsideClick.bind(this));
    },

    handleScroll() {
        const currentScroll = window.pageYOffset;

        // Handle scroll classes
        if (currentScroll > CONFIG.SCROLL.HEADER_THRESHOLD) {
            DOM.header.nav.classList.add('scrolled');
        } else {
            DOM.header.nav.classList.remove('scrolled');
        }

        // Handle header visibility
        if (currentScroll > State.lastScroll && currentScroll > CONFIG.SCROLL.HIDE_THRESHOLD) {
            DOM.header.main.style.transform = 'translateY(-100%)';
        } else {
            DOM.header.main.style.transform = 'translateY(0)';
        }

        State.lastScroll = currentScroll;
    },

    toggleMobileMenu() {
        State.isMenuOpen = !State.isMenuOpen;
        DOM.header.navLinks.classList.toggle('active');
        DOM.header.menuToggle.classList.toggle('active');
    },

    handleOutsideClick(event) {
        if (!DOM.header.nav.contains(event.target) && State.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }
};

// ===============================
// ANIMATION EFFECTS
// ===============================
const AnimationEffects = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Logo bubble hover effect
        DOM.header.logoBubble.addEventListener('mouseover', this.handleBubbleHover);
        
        // Glass effect parallax
        document.addEventListener('mousemove', this.handleParallax.bind(this));
        DOM.header.container.addEventListener('mouseleave', this.resetParallax);
    },

    handleBubbleHover() {
        const particles = document.querySelector('.bubble-particles');
        particles.style.animation = 'none';
        void particles.offsetWidth; // Trigger reflow
        particles.style.animation = null;
    },

    handleParallax(event) {
        const { left, top, width, height } = DOM.header.container.getBoundingClientRect();
        const x = (event.clientX - left) / width;
        const y = (event.clientY - top) / height;

        const xOffset = (x - 0.5) * 20;
        const yOffset = (y - 0.5) * 20;

        DOM.header.container.style.setProperty('--x-offset', `${xOffset}px`);
        DOM.header.container.style.setProperty('--y-offset', `${yOffset}px`);
        DOM.header.container.style.transform = 
            `perspective(${CONFIG.ANIMATION.PERSPECTIVE}px) 
             rotateX(${yOffset * 0.2}deg) 
             rotateY(${xOffset * 0.2}deg)`;
    },

    resetParallax(event) {
        event.target.style.transform = 
            `perspective(${CONFIG.ANIMATION.PERSPECTIVE}px) 
             rotateX(0deg) 
             rotateY(0deg)`;
    }
};

// ===============================
// NAVIGATION
// ===============================
const Navigation = {
    init() {
        this.setupSmoothScroll();
    },

    setupSmoothScroll() {
        DOM.header.links.forEach(link => {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });
    },

    handleLinkClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (State.isMenuOpen) {
                Header.toggleMobileMenu();
            }
        }
    }
};

// ===============================
// UTILITY FUNCTIONS
// ===============================
const Utilities = {
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

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ===============================
// INITIALIZATION
// ===============================
const App = {
    init() {
        // Initialize all modules
        Header.init();
        AnimationEffects.init();
        Navigation.init();

        // Apply performance optimizations
        this.optimizePerformance();
    },

    optimizePerformance() {
        // Optimize scroll handler
        const optimizedScroll = Utilities.throttle(() => {
            Header.handleScroll();
        }, 16); // ~60fps

        // Replace default scroll handler with optimized version
        window.removeEventListener('scroll', Header.handleScroll);
        window.addEventListener('scroll', optimizedScroll);

        // Optimize parallax effect
        const optimizedParallax = Utilities.throttle((event) => {
            AnimationEffects.handleParallax(event);
        }, 16);

        // Replace default mousemove handler with optimized version
        document.removeEventListener('mousemove', AnimationEffects.handleParallax);
        document.addEventListener('mousemove', optimizedParallax);
    }
};

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
