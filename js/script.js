// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // ===============================
    // Global Variables & DOM Elements
    // ===============================
    const preloader = document.querySelector('.preloader');
    const header = document.getElementById('mainHeader');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const heroVideo = document.getElementById('heroVideo');
    const heroButton = document.getElementById('heroButton');
    const questionnaireModal = document.getElementById('questionnaireModal');
    const modalClose = document.querySelector('.close-modal');
    const medicalForm = document.getElementById('medicalQuestionnaire');
    let isModalOpen = false;

    // ===============================
    // Preloader Configuration
    // ===============================
    function hidePreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Start hero animations after preloader
                startHeroAnimations();
            }, 500);
        }
    }

    // Handle preloader based on video and content loading
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', hidePreloader);
    } else {
        window.addEventListener('load', hidePreloader);
    }

    // Fallback for preloader
    setTimeout(hidePreloader, 5000); // Maximum wait time

    // ===============================
    // Header & Navigation
    // ===============================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // Mobile Menu Toggle
    function setupMobileMenu() {
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            });
        }
    }

    function toggleMobileMenu() {
        menuToggle?.classList.toggle('active');
        mainNav?.classList.toggle('active');
    }

    function closeMobileMenu() {
        menuToggle?.classList.remove('active');
        mainNav?.classList.remove('active');
    }

    // ===============================
    // Smooth Scroll
    // ===============================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    closeMobileMenu();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===============================
    // Hero Section Animations
    // ===============================
    function startHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.classList.add('animate');
            }, 500);
        }
    }

    // ===============================
    // Modal Handling
    // ===============================
    function setupModal() {
        if (heroButton && questionnaireModal) {
            heroButton.addEventListener('click', openModal);
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === questionnaireModal) {
                closeModal();
            }
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        });
    }

    function openModal() {
        if (questionnaireModal) {
            questionnaireModal.style.display = 'flex';
            setTimeout(() => {
                questionnaireModal.classList.add('show');
                isModalOpen = true;
            }, 10);
        }
    }

    function closeModal() {
        if (questionnaireModal) {
            questionnaireModal.classList.remove('show');
            setTimeout(() => {
                questionnaireModal.style.display = 'none';
                isModalOpen = false;
            }, 300);
        }
    }

    // ===============================
    // Medical Questionnaire Form
    // ===============================
    function setupQuestionnaire() {
        if (medicalForm) {
            const questions = [
                {
                    type: 'radio',
                    question: 'Are you over 18 years of age?',
                    options: ['Yes', 'No'],
                    required: true
                },
                {
                    type: 'checkbox',
                    question: 'Do you have any of the following conditions?',
                    options: [
                        'High blood pressure',
                        'Heart conditions',
                        'Allergies',
                        'None of the above'
                    ]
                },
                {
                    type: 'text',
                    question: 'Are you currently taking any medications?',
                    placeholder: 'Please list any medications'
                }
            ];

            populateQuestionnaire(questions);
        }
    }

    function populateQuestionnaire(questions) {
        questions.forEach((q, index) => {
            const fieldset = document.createElement('fieldset');
            const legend = document.createElement('legend');
            legend.textContent = q.question;
            fieldset.appendChild(legend);

            if (q.type === 'radio' || q.type === 'checkbox') {
                q.options.forEach(option => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = q.type;
                    input.name = `question_${index}`;
                    input.value = option;
                    if (q.required) input.required = true;
                    label.appendChild(input);
                    label.appendChild(document.createTextNode(option));
                    fieldset.appendChild(label);
                });
            } else if (q.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = `question_${index}`;
                input.placeholder = q.placeholder || '';
                if (q.required) input.required = true;
                fieldset.appendChild(input);
            }

            medicalForm.appendChild(fieldset);
        });

        // Add submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'submit-btn';
        submitBtn.textContent = 'Submit';
        medicalForm.appendChild(submitBtn);
    }

    // ===============================
    // Reviews Slider
    // ===============================
    function initReviewsSlider() {
        const reviewsSlider = document.getElementById('reviewsSlider');
        if (!reviewsSlider) return;

        const reviews = [
            {
                text: "An incredible product that exceeded my expectations.",
                author: "Sarah M.",
                rating: 5,
                date: "January 2025"
            },
            {
                text: "Professional service and amazing results.",
                author: "Jennifer K.",
                rating: 5,
                date: "December 2024"
            },
            {
                text: "Life-changing results. Highly recommended!",
                author: "Michelle R.",
                rating: 5,
                date: "February 2025"
            }
        ];

        reviews.forEach(review => {
            const reviewCard = createReviewCard(review);
            reviewsSlider.appendChild(reviewCard);
        });
    }

    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.setAttribute('data-aos', 'fade-up');
        
        card.innerHTML = `
            <div class="review-content">
                <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                <p class="review-text">"${review.text}"</p>
                <div class="review-meta">
                    <p class="review-author">${review.author}</p>
                    <p class="review-date">${review.date}</p>
                </div>
            </div>
        `;
        return card;
    }

    // ===============================
    // Scroll Animations (AOS)
    // ===============================
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-in-out'
            });
        }
    }

    // ===============================
    // Initialize Everything
    // ===============================
    function init() {
        setupMobileMenu();
        initSmoothScroll();
        setupModal();
        setupQuestionnaire();
        initReviewsSlider();
        initAOS();

        // Remove preloader class from body after initialization
        document.body.classList.remove('loading');
    }

    // Start initialization
    init();
});
