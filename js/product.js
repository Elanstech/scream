// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initPreloader();
    initMobileNav();
    initProductGallery();
    initPurchaseOptions();
    initTabs();
    initAOS();
    updateFooterYear();
    initScrollEffects();
});

// Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    });
}

// Mobile Navigation
function initMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    const header = document.querySelector('.header');
    let lastScroll = 0;

    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.setAttribute('data-visible', !isExpanded);
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
    }

    // Header scroll behavior
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
}

// Product Gallery
function initProductGallery() {
    const mainImage = document.querySelector('.product-image');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            galleryItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Update main image with animation
            const newImageSrc = item.querySelector('img').src;
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = newImageSrc;
                mainImage.style.opacity = '1';
            }, 300);
        });
    });

    // Image zoom effect on hover
    if (mainImage) {
        const imageWrapper = mainImage.parentElement;
        
        imageWrapper.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = imageWrapper.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            mainImage.style.transform = `scale(1.1) translate(${-x * 20}px, ${-y * 20}px)`;
        });
        
        imageWrapper.addEventListener('mouseleave', () => {
            mainImage.style.transform = '';
        });
    }
}

// Purchase Options
function initPurchaseOptions() {
    const subscriptionOptions = document.querySelectorAll('.subscription-option');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    let selectedPrice = '89'; // Default price

    subscriptionOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Update active state
            subscriptionOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Update price
            selectedPrice = option.querySelector('.option-price').textContent.match(/\d+/)[0];
            updateAddToCartButton();
            
            // Add animation effect
            option.style.transform = 'scale(0.98)';
            setTimeout(() => {
                option.style.transform = '';
            }, 150);
        });
    });

    function updateAddToCartButton() {
        const animation = addToCartBtn.animate([
            { transform: 'scale(0.95)' },
            { transform: 'scale(1)' }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            addToCartBtn.innerHTML = `
                <span>Add to Cart - $${selectedPrice}</span>
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <path d="M9 20a1 1 0 100-2 1 1 0 000 2z"/>
                    <path d="M20 20a1 1 0 100-2 1 1 0 000 2z"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
            `;
        };
    }

    // Add to Cart Animation
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create success notification
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `
                <svg class="check-icon" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Added to Cart!</span>
            `;
            
            document.body.appendChild(notification);
            
            // Trigger animation
            setTimeout(() => {
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }, 2000);
            }, 100);
        });
    }
}

// Product Tabs
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Smooth scroll to content on mobile
            if (window.innerWidth < 768) {
                document.getElementById(targetTab).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize AOS (Animate on Scroll)
function initAOS() {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-out'
    });
}

// Update Footer Year
function updateFooterYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    // Parallax effect for product image
    const productImage = document.querySelector('.product-image');
    if (productImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            productImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for fade-in effects
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}

// Cart Notification Styles
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--rose-gold);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .cart-notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .check-icon {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        stroke-width: 2;
        fill: none;
    }
`;
document.head.appendChild(style);

// Handle errors gracefully
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.message);
    // Implement error tracking or reporting here
});
