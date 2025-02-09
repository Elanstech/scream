// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Remove preloader after page load
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });
});

// Smooth Navigation
const nav = document.getElementById('mainNav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
    
    // Hide/show navigation on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('.parallax');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.05;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const moveX = (mouseX - centerX) * speed;
        const moveY = (mouseY - centerY) * speed;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Magnetic Button Effect
document.querySelectorAll('.magnetic-btn').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.transform = `translate(
            ${(x - rect.width / 2) / 10}px,
            ${(y - rect.height / 2) / 10}px
        )`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0px, 0px)';
    });
});

// Smooth Scroll
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

// Video Background Optimization
const video = document.getElementById('heroVideo');
if (video) {
    // Preload video
    video.preload = 'auto';
    
    // Play video when it's ready
    video.addEventListener('canplay', () => {
        video.play();
    });
    
    // Handle video playback based on visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(video);
}

// Modal Handling
const modal = document.getElementById('questionnaireModal');
const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
const closeModal = document.querySelector('.close-modal');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close modal on outside click
modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Medical Questionnaire Form Handling
const questionnaireForm = document.getElementById('medicalQuestionnaire');
if (questionnaireForm) {
    const questions = [
        {
            id: 'age',
            type: 'number',
            label: 'What is your age?',
            required: true
        },
        {
            id: 'medical_conditions',
            type: 'checkbox-group',
            label: 'Do you have any of the following conditions?',
            options: [
                'High blood pressure',
                'Heart disease',
                'Diabetes',
                'None of the above'
            ]
        },
        // Add more questions as needed
    ];

    // Dynamically generate form fields
    questions.forEach(question => {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'form-field';
        
        const label = document.createElement('label');
        label.htmlFor = question.id;
        label.textContent = question.label;
        
        let input;
        
        if (question.type === 'checkbox-group') {
            input = document.createElement('div');
            input.className = 'checkbox-group';
            
            question.options.forEach(option => {
                const checkbox = document.createElement('div');
                checkbox.className = 'checkbox-option';
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.name = question.id;
                cb.value = option;
                
                const optionLabel = document.createElement('label');
                optionLabel.textContent = option;
                
                checkbox.appendChild(cb);
                checkbox.appendChild(optionLabel);
                input.appendChild(checkbox);
            });
        } else {
            input = document.createElement('input');
            input.type = question.type;
            input.id = question.id;
            input.name = question.id;
            input.required = question.required;
        }
        
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        questionnaireForm.appendChild(fieldContainer);
    });
}

// Custom Smooth Scroll Animation
const smoothScroll = (target, duration) => {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = currentTime => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Easing function
    const ease = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
};

// Stripe Integration
const stripe = Stripe('your_publishable_key');
const elements = stripe.elements();

// Create card element
const card = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
});

// Mount card element
const cardElement = document.getElementById('card-element');
if (cardElement) {
    card.mount('#card-element');
}

// Handle form submission
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const { token, error } = await stripe.createToken(card);
        
        if (error) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
        } else {
            // Send token to server
            submitPayment(token);
        }
    });
}

// Intersection Observer for Animations
const observeElements = document.querySelectorAll('.observe-element');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            intersectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

observeElements.forEach(element => {
    intersectionObserver.observe(element);
});
