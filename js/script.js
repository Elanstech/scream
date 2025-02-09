// ======================
// Global Variables & Constants
// ======================
const ANIMATION_DELAYS = {
    bubbleParticle: 0.2,
    scrollThreshold: 50,
    hideHeaderThreshold: 100
};

// ======================
// DOM Elements
// ======================
const elements = {
    mainNav: document.getElementById('mainNav'),
    menuToggle: document.getElementById('menuToggle'),
    navLinks: document.querySelector('.nav-links'),
    bubbleParticles: document.querySelectorAll('.bubble-particles span'),
    trackBtn: document.querySelector('.track-btn'),
    ctaBtn: document.querySelector('.cta-btn'),
    bubbleLinks: document.querySelectorAll('.bubble-link')
};

// ======================
// Scroll Handling
// ======================
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Header glass effect
    if (currentScroll > ANIMATION_DELAYS.scrollThreshold) {
        elements.mainNav.classList.add('scrolled');
    } else {
        elements.mainNav.classList.remove('scrolled');
    }
    
    // Header hide/show
    if (currentScroll > lastScroll && currentScroll > ANIMATION_DELAYS.hideHeaderThreshold) {
        elements.mainNav.style.transform = 'translateY(-100%)';
    } else {
        elements.mainNav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
}

// ======================
// Mobile Menu Functions
// ======================
function toggleMobileMenu() {
    elements.navLinks.classList.toggle('active');
    elements.menuToggle.classList.toggle('active');
}

function closeMobileMenu() {
    elements.navLinks.classList.remove('active');
    elements.menuToggle.classList.remove('active');
}

function handleOutsideClick(e) {
    if (!elements.menuToggle.contains(e.target) && !elements.navLinks.contains(e.target)) {
        closeMobileMenu();
    }
}

// ======================
// Navigation Functions
// ======================
function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        closeMobileMenu();
    }
}

// ======================
// Button Actions
// ======================
function handleTrackOrder() {
    // Add track order functionality here
    console.log('Track Order clicked');
}

function handleGetStarted() {
    // Add get started functionality here
    console.log('Get Started clicked');
}

// ======================
// Animation Functions
// ======================
function initializeBubbleAnimations() {
    elements.bubbleParticles.forEach((particle, index) => {
        particle.style.animationDelay = `${index * ANIMATION_DELAYS.bubbleParticle}s`;
    });
}

// ======================
// Event Listeners
// ======================
function initializeEventListeners() {
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu events
    elements.menuToggle.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', handleOutsideClick);
    
    // Navigation events
    elements.bubbleLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Button events
    elements.trackBtn.addEventListener('click', handleTrackOrder);
    elements.ctaBtn.addEventListener('click', handleGetStarted);
}

// ======================
// Initialization
// ======================
document.addEventListener('DOMContentLoaded', () => {
    initializeBubbleAnimations();
    initializeEventListeners();
});
