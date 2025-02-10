// Main Script for Product Page
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
        // Ensure video plays on mobile devices
        heroVideo.play().catch(function(error) {
            console.log("Video autoplay failed:", error);
        });
    }

    // Scroll Animation for Elements
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in, .slide-in');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Application Guide Interactive Features
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

        start() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.interval = setInterval(() => this.tick(), 1000);
                if (this.timerCircle) {
                    this.timerCircle.style.stroke = '#4CAF50';
                }
            }
        }

        stop() {
            if (this.isRunning) {
                this.isRunning = false;
                clearInterval(this.interval);
            }
        }

        reset() {
            this.stop();
            this.minutes = 5;
            this.seconds = 0;
            this.remainingTime = this.totalTime;
            this.updateDisplay();
            if (this.timerCircle) {
                this.timerCircle.style.strokeDashoffset = '0';
                this.timerCircle.style.stroke = 'rgba(255, 255, 255, 0.1)';
            }
        }

        tick() {
            if (this.remainingTime > 0) {
                this.remainingTime--;
                this.minutes = Math.floor(this.remainingTime / 60);
                this.seconds = this.remainingTime % 60;
                this.updateDisplay();
                this.updateCircle();
            } else {
                this.stop();
                if (this.timerCircle) {
                    this.timerCircle.style.stroke = '#ff4444';
                }
            }
        }

        updateDisplay() {
            if (this.timerDisplay) {
                const minutesDisplay = String(this.minutes).padStart(2, '0');
                const secondsDisplay = String(this.seconds).padStart(2, '0');
                this.timerDisplay.innerHTML = `
                    <span class="timer-minutes">${minutesDisplay}</span>
                    <span class="timer-separator">:</span>
                    <span class="timer-seconds">${secondsDisplay}</span>
                `;
            }
        }

        updateCircle() {
            if (this.timerCircle) {
                const progress = this.remainingTime / this.totalTime;
                const circumference = 2 * Math.PI * 45;
                const offset = circumference * (1 - progress);
                this.timerCircle.style.strokeDashoffset = offset;
            }
        }
    }

    class PumpSimulator {
        constructor() {
            this.pumpCount = 0;
            this.maxPumps = 3;
            this.pumpDisplay = document.querySelector('.pump-count');
            this.pumpButton = document.querySelector('.pump-button');
            this.setupListeners();
        }

        setupListeners() {
            if (this.pumpButton) {
                this.pumpButton.addEventListener('click', () => this.pump());
            }
        }

        pump() {
            if (this.pumpCount < this.maxPumps) {
                this.pumpCount++;
                this.updateDisplay();
                this.animatePump();

                if (this.pumpCount >= this.maxPumps) {
                    this.pumpButton.classList.add('disabled');
                    this.pumpButton.disabled = true;
                }
            }
        }

        updateDisplay() {
            if (this.pumpDisplay) {
                this.pumpDisplay.textContent = this.pumpCount;
            }
        }

        animatePump() {
            if (this.pumpButton) {
                this.pumpButton.classList.add('pumping');
                setTimeout(() => {
                    this.pumpButton.classList.remove('pumping');
                }, 300);
            }
        }

        reset() {
            this.pumpCount = 0;
            this.updateDisplay();
            if (this.pumpButton) {
                this.pumpButton.classList.remove('disabled');
                this.pumpButton.disabled = false;
            }
        }
    }

    class ActivationTimeline {
        constructor() {
            this.timelinePoints = document.querySelectorAll('.timeline-point');
            this.setupTimeline();
        }

        setupTimeline() {
            this.timelinePoints.forEach((point, index) => {
                point.style.animationDelay = `${index * 0.3}s`;
                point.addEventListener('mouseenter', () => this.highlightPoint(point));
                point.addEventListener('mouseleave', () => this.unhighlightPoint(point));
            });
        }

        highlightPoint(point) {
            point.classList.add('highlighted');
            const marker = point.querySelector('.point-marker');
            if (marker) {
                marker.style.transform = 'scale(1.2)';
            }
        }

        unhighlightPoint(point) {
            point.classList.remove('highlighted');
            const marker = point.querySelector('.point-marker');
            if (marker) {
                marker.style.transform = 'scale(1)';
            }
        }
    }

    // Initialize Application Guide Components
    const initializeApplicationGuide = () => {
        const prepTimer = new PrepTimer();
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

        const pumpSimulator = new PumpSimulator();
        const activationTimeline = new ActivationTimeline();

        // Scroll Animation Observer
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.step-panel').forEach(panel => {
            observer.observe(panel);
        });
    };

    // Add Dynamic Styles
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .pumping {
                transform: scale(0.95) !important;
            }

            .pump-button.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: #666;
            }

            .timeline-point.highlighted {
                transform: translateY(-5px);
            }

            .point-marker {
                transition: transform 0.3s ease;
            }

            .timer-circle {
                transition: stroke-dashoffset 0.3s ease;
            }

            .preloader.fade-out {
                opacity: 0;
                transition: opacity 1s ease-out;
            }

            .fade-in {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .slide-in {
                opacity: 0;
                transform: translateX(-20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .slide-in.visible {
                opacity: 1;
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    };

    // Footer Year Update
    const updateFooterYear = () => {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    };

    // Initialize Everything
    addStyles();
    initializeApplicationGuide();
    updateFooterYear();
});
