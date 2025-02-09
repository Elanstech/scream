document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initHeroAnimations();
    initProductHighlights();
    initStatistics();
    initParticles();
    initScrollAnimations();
    initSmoothScroll();
    initIngredientsInteraction();
});

// Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                // Start hero animations after preloader
                triggerHeroEntrance();
            }, 500);
        });
    }
}

// Hero Animations
function initHeroAnimations() {
    const productImage = document.querySelector('.product-image');
    const rings = document.querySelectorAll('.ring');
    const titleLines = document.querySelectorAll('.title-line');

    // Product float animation
    if (productImage) {
        productImage.style.opacity = '0';
        productImage.style.transform = 'translateY(30px)';
    }

    // Rings animation
    rings.forEach((ring, index) => {
        ring.style.opacity = '0';
        ring.style.transform = 'scale(0.8)';
    });

    // Title lines animation
    titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(20px)';
    });
}

function triggerHeroEntrance() {
    const productImage = document.querySelector('.product-image');
    const rings = document.querySelectorAll('.ring');
    const titleLines = document.querySelectorAll('.title-line');
    const features = document.querySelectorAll('.feature-item');

    // Animate product image
    if (productImage) {
        setTimeout(() => {
            productImage.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            productImage.style.opacity = '1';
            productImage.style.transform = 'translateY(0)';
        }, 300);
    }

    // Animate rings
    rings.forEach((ring, index) => {
        setTimeout(() => {
            ring.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            ring.style.opacity = '1';
            ring.style.transform = 'scale(1)';
        }, 500 + (index * 200));
    });

    // Animate title lines
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 800 + (index * 200));
    });

    // Animate features
    features.forEach((feature, index) => {
        setTimeout(() => {
            feature.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            feature.style.opacity = '1';
            feature.style.transform = 'translateY(0)';
        }, 1200 + (index * 150));
    });
}

// Product Highlights
function initProductHighlights() {
    const highlights = document.querySelectorAll('.highlight-point');
    
    highlights.forEach((point, index) => {
        // Create connecting lines
        const line = point.querySelector('.point-line');
        const content = point.querySelector('.point-content');
        
        // Calculate line angle based on position
        const angle = index % 2 === 0 ? -30 : 30;
        line.style.transform = `rotate(${angle}deg)`;
        
        // Add hover effects
        point.addEventListener('mouseenter', () => {
            point.style.zIndex = '10';
            content.style.transform = 'scale(1.1)';
            line.style.width = '60px';
        });
        
        point.addEventListener('mouseleave', () => {
            point.style.zIndex = '1';
            content.style.transform = 'scale(1)';
            line.style.width = '50px';
        });
    });
}

// Statistics Animation
function initStatistics() {
    const statRings = document.querySelectorAll('.progress-ring');
    const statValues = document.querySelectorAll('.stat-value');
    
    // Animate stat rings when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target;
                const value = ring.nextElementSibling.textContent;
                const percentage = parseInt(value) || 100;
                
                // Animate the ring fill
                const circumference = 283; // 2 * π * r where r = 45
                const offset = circumference - (percentage / 100 * circumference);
                ring.style.strokeDashoffset = offset;
                
                // Animate the number
                animateNumber(ring.nextElementSibling, percentage);
            }
        });
    }, { threshold: 0.5 });
    
    statRings.forEach(ring => observer.observe(ring));
}

function animateNumber(element, final, duration = 2000) {
    const start = 0;
    const increment = final / (duration / 16);
    let current = start;
    
    const animate = () => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current < final) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = final;
        }
    };
    
    animate();
}

// Particle Background
function initParticles() {
    const container = document.querySelector('.particles-container');
    const particlesConfig = {
        particles: 50,
        size: { min: 1, max: 3 },
        speed: { min: 0.5, max: 1.5 }
    };
    
    if (container) {
        for (let i = 0; i < particlesConfig.particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size
            const size = Math.random() * (particlesConfig.size.max - particlesConfig.size.min) + particlesConfig.size.min;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random speed
            const speed = Math.random() * (particlesConfig.speed.max - particlesConfig.speed.min) + particlesConfig.speed.min;
            particle.style.animation = `float ${speed}s infinite linear`;
            
            container.appendChild(particle);
        }
    }
}

// Scroll Animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => observer.observe(element));
}

// Smooth Scroll
function initSmoothScroll() {
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
}

// Ingredients Section Interaction
function initIngredientsInteraction() {
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    
    ingredientCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Highlight the ingredient
            ingredientCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Update molecule visualization if exists
            const moleculeVis = document.querySelector('.molecule-visualization');
            if (moleculeVis) {
                moleculeVis.dataset.activeIngredient = card.dataset.ingredient;
                updateMoleculeVisualization(card.dataset.ingredient);
            }
        });
    });
}

function updateMoleculeVisualization(ingredient) {
    const molecule = document.querySelector('.molecule-structure');
    if (!molecule) return;
    
    // Update molecule structure based on ingredient
    const atoms = molecule.querySelectorAll('.atom');
    const bonds = molecule.querySelectorAll('.bond');
    
    // Different configurations for different ingredients
    const configurations = {
        aminophylline: {
            atomPositions: [[20, 20], [50, 50], [80, 20]],
            bondAngles: [45, -45]
        },
        ergoloid: {
            atomPositions: [[50, 20], [20, 80], [80, 80]],
            bondAngles: [60, -60]
        },
        larginine: {
            atomPositions: [[50, 20], [20, 50], [80, 50]],
            bondAngles: [30, -30]
        }
    };
    
    const config = configurations[ingredient] || configurations.aminophylline;
    
    // Update atom positions
    atoms.forEach((atom, i) => {
        if (config.atomPositions[i]) {
            atom.style.left = `${config.atomPositions[i][0]}%`;
            atom.style.top = `${config.atomPositions[i][1]}%`;
        }
    });
    
    // Update bond angles
    bonds.forEach((bond, i) => {
        if (config.bondAngles[i]) {
            bond.style.transform = `rotate(${config.bondAngles[i]}deg)`;
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.message);
    // Implement error tracking or reporting here
});
