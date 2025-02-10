document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        });
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');
    
    if (hamburger && navMobile) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMobile.classList.toggle('active');
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Video Background Control
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.play().catch(function(error) {
            console.log("Video autoplay failed:", error);
        });
    }

    // Application Guide Features
    class PrepTimer {
        constructor() {
            this.minutes = 5;
            this.seconds = 0;
            this.isRunning = false;
            this.interval = null;
            this.timerDisplay = document.querySelector('.timer-display');
            this.timerCircle = document.querySelector('.timer-circle');
            this.totalTime = this.minutes * 60;
            this.remainingTime = this.totalTime;
            
            if (this.timerCircle) {
                this.timerCircle.style.strokeDasharray = `${2 * Math.PI * 45}`;
                this.timerCircle.style.strokeDashoffset = '0';
            }
            
            this.updateDisplay();
        }

        // ... [Previous PrepTimer methods remain the same]
    }

    class PumpSimulator {
        constructor() {
            this.pumpCount = 0;
            this.maxPumps = 3;
            this.pumpDisplay = document.querySelector('.pump-count');
            this.pumpButton = document.querySelector('.pump-button');
            this.setupListeners();
        }

        // ... [Previous PumpSimulator methods remain the same]
    }

    // Benefits Section Features
    class BenefitsManager {
        constructor() {
            this.benefitCards = document.querySelectorAll('.benefit-card');
            this.initializeEffectivenessMeters();
            this.setupIntersectionObserver();
        }

        initializeEffectivenessMeters() {
            this.benefitCards.forEach(card => {
                const effectiveness = card.dataset.effectiveness;
                const meterFill = card.querySelector('.meter-fill');
                if (meterFill) {
                    meterFill.style.width = '0%';
                    setTimeout(() => {
                        meterFill.style.width = `${effectiveness}%`;
                    }, 500);
                }
            });
        }

        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            this.benefitCards.forEach(card => observer.observe(card));
        }
    }

    // Research Section Features
    class ResearchManager {
        constructor() {
            this.initializeStats();
            this.setupMethodologyCards();
            this.initializeFindingsAnimation();
        }

        initializeStats() {
            const statItems = document.querySelectorAll('.stat-item');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStatNumber(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            statItems.forEach(item => observer.observe(item));
        }

        animateStatNumber(statItem) {
            const numberElement = statItem.querySelector('.stat-number');
            if (!numberElement) return;

            const finalNumber = parseFloat(numberElement.textContent);
            let currentNumber = 0;
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = finalNumber / steps;
            const stepDuration = duration / steps;

            const animation = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    numberElement.textContent = finalNumber.toString();
                    clearInterval(animation);
                } else {
                    numberElement.textContent = Math.floor(currentNumber).toString();
                }
            }, stepDuration);
        }

        setupMethodologyCards() {
            const methodCards = document.querySelectorAll('.method-card');
            methodCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-10px)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            });
        }

        initializeFindingsAnimation() {
            const findingCards = document.querySelectorAll('.finding-card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this.animateFindingStats(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            findingCards.forEach(card => observer.observe(card));
        }

        animateFindingStats(card) {
            const statValues = card.querySelectorAll('.stat-value');
            statValues.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.opacity = '1';
                    stat.style.transform = 'translateX(0)';
                }, index * 200);
            });
        }
    }

    // Global Scroll Animation
    class ScrollAnimationManager {
        constructor() {
            this.animatedElements = document.querySelectorAll('.fade-in, .slide-in');
            this.setupIntersectionObserver();
        }

        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            this.animatedElements.forEach(element => observer.observe(element));
        }
    }

    // Initialize All Components
    const initializeAllComponents = () => {
        // Initialize Application Guide
        const prepTimer = new PrepTimer();
        const pumpSimulator = new PumpSimulator();

        // Initialize Benefits Section
        const benefitsManager = new BenefitsManager();

        // Initialize Research Section
        const researchManager = new ResearchManager();

        // Initialize Global Scroll Animations
        const scrollAnimationManager = new ScrollAnimationManager();

        // Setup Timer Click Events
        const timerSection = document.querySelector('.prep-timer');
        if (timerSection) {
            timerSection.addEventListener('click', () => {
                if (!prepTimer.isRunning) {
                    prepTimer.start();
                } else {
                    prepTimer.stop();
                }
            });
        }
    };

    // Footer Year Update
    const updateFooterYear = () => {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    };

    // Initialize Everything
    initializeAllComponents();
    updateFooterYear();
});
