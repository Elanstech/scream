/**
 * =============================================================================
 * S-Cream Website JavaScript
 * Modern, conversion-optimized functionality
 * =============================================================================
 */

/**
 * =============================================================================
 * MAIN INITIALIZATION
 * =============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initPillHeader();
  initHeroAnimations();
  initTestimonialSlider();
  initFaqAccordion();
  initQuizFlow();
  initCountdownTimer();
  initLiveChat();
  initSmoothScrolling();
  
  // Update current year in footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});

/**
 * =============================================================================
 * ADVANCED FLOATING PILL-SHAPED HEADER
 * =============================================================================
 */
function initPillHeader() {
  const header = document.querySelector('.pill-header');
  const headerWrapper = document.querySelector('.pill-header-wrapper');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNavPanel = document.querySelector('.mobile-nav-panel');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  let lastScrollTop = 0;
  const scrollThreshold = 50;
  
  // Toggle mobile menu with slick animation
  if (mobileToggle && mobileNavPanel) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavPanel.setAttribute('aria-hidden', isExpanded);
      
      // Optional: Add body scroll lock when menu is open
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }
  
  // Close mobile menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNavPanel && mobileNavPanel.getAttribute('aria-hidden') === 'false') {
        mobileNavPanel.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Handle scroll effects with advanced animations
  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class to header with smooth transition
    if (currentScrollTop > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Advanced scroll-based header animation
    if (headerWrapper) {
      // Calculate how far to move the header based on scroll
      // Clamp the value between 0 and 1.5rem
      const scrollOffset = Math.max(0, Math.min(1.5, currentScrollTop / 200));
      headerWrapper.style.top = `${1.5 - scrollOffset}rem`;
      
      // Scale the header slightly when scrolling to make it more compact
      const headerScale = 1 - (scrollOffset * 0.03);
      header.style.transform = `scale(${headerScale})`;
      
      // Increase background opacity as user scrolls
      const bgOpacity = 0.85 + (scrollOffset * 0.1);
      header.style.backgroundColor = `rgba(255, 255, 255, ${bgOpacity})`;
    }
    
    // Close mobile menu when scrolling
    if (mobileNavPanel && mobileNavPanel.getAttribute('aria-hidden') === 'false' && 
        Math.abs(currentScrollTop - lastScrollTop) > 30) {
      mobileNavPanel.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    
    lastScrollTop = currentScrollTop;
  });
  
  // Handle header hover effects for desktop
  if (header && window.innerWidth >= 1024) {
    header.addEventListener('mousemove', e => {
      // Get mouse position relative to the header
      const rect = header.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate the percentage of mouse position within the header
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;
      
      // Update the glow position based on mouse
      const pillGlow = header.querySelector('.pill-glow');
      if (pillGlow) {
        pillGlow.style.opacity = "1";
        pillGlow.style.transform = `translate(${(xPercent - 0.5) * 50}px, ${(yPercent - 0.5) * 20}px)`;
      }
      
      // Add subtle tilt effect to the header
      const tiltX = (yPercent - 0.5) * 1.5;
      const tiltY = (xPercent - 0.5) * -1.5;
      header.style.transform = `scale(${header.classList.contains('scrolled') ? 0.98 : 1}) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    header.addEventListener('mouseleave', () => {
      // Reset effects when mouse leaves
      const pillGlow = header.querySelector('.pill-glow');
      if (pillGlow) {
        pillGlow.style.opacity = "0";
        pillGlow.style.transform = 'translate(0, 0)';
      }
      
      // Reset header transform
      header.style.transform = header.classList.contains('scrolled') ? 'scale(0.98)' : 'scale(1)';
    });
  }
  
  // Close menu on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNavPanel && mobileNavPanel.getAttribute('aria-hidden') === 'false') {
      mobileNavPanel.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Handle click outside to close mobile menu
  document.addEventListener('click', e => {
    if (mobileNavPanel && 
        mobileNavPanel.getAttribute('aria-hidden') === 'false' && 
        !mobileNavPanel.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      mobileNavPanel.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Add active class to navigation link based on current section
  function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for header height
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  // Call on scroll and initial load
  window.addEventListener('scroll', setActiveNavLink);
  setActiveNavLink();
  
  // Initialize Interactive Indicator for desktop nav
  if (window.innerWidth >= 1024) {
    initInteractiveIndicator();
  }
  
  // Optional: Add nav underline indicator that moves with active element
  function initInteractiveIndicator() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navSection = document.querySelector('.nav-section');
    
    if (!navLinks.length || !navSection) return;
    
    // Create the indicator element
    const indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    indicator.style.position = 'absolute';
    indicator.style.bottom = '8px';
    indicator.style.height = '3px';
    indicator.style.borderRadius = '3px';
    indicator.style.background = 'var(--primary-gradient)';
    indicator.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
    indicator.style.opacity = '0';
    navSection.appendChild(indicator);
    
    // Update indicator position based on active or hovered link
    function updateIndicator(link) {
      const linkRect = link.getBoundingClientRect();
      const navRect = navSection.getBoundingClientRect();
      
      indicator.style.width = `${linkRect.width * 0.6}px`;
      indicator.style.left = `${linkRect.left - navRect.left + (linkRect.width * 0.2)}px`;
      indicator.style.opacity = '1';
    }
    
    // Add event listeners to each link
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        updateIndicator(link);
      });
      
      link.addEventListener('focus', () => {
        updateIndicator(link);
      });
    });
    
    // Hide indicator when mouse leaves navigation
    navSection.addEventListener('mouseleave', () => {
      const activeLink = document.querySelector('.nav-link.active');
      if (activeLink) {
        updateIndicator(activeLink);
      } else {
        indicator.style.opacity = '0';
      }
    });
    
    // Set indicator to active link on load
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
      updateIndicator(activeLink);
    }
    
    // Update indicator position when window is resized
    window.addEventListener('resize', () => {
      const activeLink = document.querySelector('.nav-link.active');
      if (activeLink) {
        updateIndicator(activeLink);
      }
    });
  }
}

/**
 * =============================================================================
 * HERO SECTION WITH VIDEO BACKGROUND
 * =============================================================================
 */
function initHeroAnimations() {
  // Initialize and check if video loaded successfully
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    // Handle video loading
    heroVideo.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
    });
    
    // Handle potential video loading errors
    heroVideo.addEventListener('error', (e) => {
      console.error('Error loading video:', e);
      // Fallback to static background
      const videoContainer = document.querySelector('.video-container');
      if (videoContainer) {
        videoContainer.style.backgroundImage = 'url("images/hero-background-fallback.jpg")';
        videoContainer.style.backgroundSize = 'cover';
        videoContainer.style.backgroundPosition = 'center center';
      }
    });

    // Check if browser supports autoplay
    // If not, manually play the video or show a play button
    if (heroVideo.paused) {
      const autoplayAttempt = heroVideo.play();
      
      if (autoplayAttempt) {
        autoplayAttempt.catch(error => {
          console.warn('Autoplay not allowed:', error);
          // Optionally add a play button for manual play
          createPlayButton();
        });
      }
    }
  }

  // Product image tilt effect on desktop
  const productImage = document.querySelector('.product-image');
  
  if (productImage && window.innerWidth >= 1024) {
    const productContainer = document.querySelector('.product-container');
    
    productContainer.addEventListener('mousemove', e => {
      const rect = productContainer.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      
      productImage.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    
    productContainer.addEventListener('mouseleave', () => {
      productImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    });
  }

  // Parallax effect for video background
  if (heroVideo && window.innerWidth >= 768) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      heroVideo.style.transform = `translate(-50%, calc(-50% + ${scrollPosition * 0.15}px))`;
    });
  }

  // Optional: Create play button if autoplay is not supported
  function createPlayButton() {
    // Only create if it doesn't exist already
    if (!document.querySelector('.video-play-button')) {
      const playButton = document.createElement('button');
      playButton.className = 'video-play-button';
      playButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
        </svg>
      `;
      
      // Add styles
      playButton.style.position = 'absolute';
      playButton.style.top = '50%';
      playButton.style.left = '50%';
      playButton.style.transform = 'translate(-50%, -50%)';
      playButton.style.zIndex = '10';
      playButton.style.background = 'rgba(255, 255, 255, 0.2)';
      playButton.style.border = 'none';
      playButton.style.borderRadius = '50%';
      playButton.style.width = '60px';
      playButton.style.height = '60px';
      playButton.style.cursor = 'pointer';
      playButton.style.color = 'white';
      playButton.style.backdropFilter = 'blur(5px)';
      
      // Add event listener
      playButton.addEventListener('click', () => {
        heroVideo.play();
        playButton.style.display = 'none';
      });
      
      // Add to DOM
      const videoContainer = document.querySelector('.video-container');
      if (videoContainer) {
        videoContainer.appendChild(playButton);
      }
    }
  }

  // Animate elements on scroll
  const animateElements = document.querySelectorAll('.fade-in-element');
  
  if (animateElements.length > 0) {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    animateElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// Initialize hero animations when window is loaded
window.addEventListener('load', initHeroAnimations);

// Ensure video responsiveness on window resize
window.addEventListener('resize', () => {
  const heroVideo = document.querySelector('.hero-video');
  
  // Reset transform on mobile for better performance
  if (heroVideo && window.innerWidth < 768) {
    heroVideo.style.transform = 'translate(-50%, -50%)';
  }
});

/**
 * =============================================================================
 * TESTIMONIAL SLIDER
 * =============================================================================
 */
function initTestimonialSlider() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const navDots = document.querySelectorAll('.nav-dot');
  
  if (testimonialCards.length === 0 || navDots.length === 0) return;
  
  let currentIndex = 0;
  let interval;
  
  // Show testimonial at specific index
  const showTestimonial = (index) => {
    testimonialCards.forEach(card => {
      card.classList.remove('active');
    });
    
    navDots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    testimonialCards[index].classList.add('active');
    navDots[index].classList.add('active');
    currentIndex = index;
  };
  
  // Add click event to navigation dots
  navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showTestimonial(index);
      resetInterval();
    });
  });
  
  // Start automatic rotation
  const startInterval = () => {
    interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % testimonialCards.length;
      showTestimonial(nextIndex);
    }, 5000);
  };
  
  // Reset interval after user interaction
  const resetInterval = () => {
    clearInterval(interval);
    startInterval();
  };
  
  // Initialize
  showTestimonial(0);
  startInterval();
}

/**
 * =============================================================================
 * FAQ ACCORDION
 * =============================================================================
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Close all other questions
      faqQuestions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current question
      question.setAttribute('aria-expanded', !isExpanded);
    });
  });
}

/**
 * =============================================================================
 * QUIZ FLOW
 * =============================================================================
 */
function initQuizFlow() {
  const quizSlides = document.querySelectorAll('.quiz-slide');
  const quizButtons = document.querySelectorAll('[data-next]');
  const quizBackButtons = document.querySelectorAll('[data-prev]');
  const radioInputs = document.querySelectorAll('.answer-option input');
  
  if (quizSlides.length === 0) return;
  
  // Navigate to next slide
  quizButtons.forEach(button => {
    button.addEventListener('click', () => {
      const nextSlideId = button.getAttribute('data-next');
      
      if (nextSlideId) {
        // Hide all slides
        quizSlides.forEach(slide => {
          slide.classList.remove('active');
        });
        
        // Show target slide
        const nextSlide = document.querySelector(`.quiz-slide[data-slide="${nextSlideId}"]`);
        if (nextSlide) {
          nextSlide.classList.add('active');
          
          // Update progress bar if applicable
          const progressBar = nextSlide.querySelector('.progress-filled');
          if (progressBar) {
            const questionNumber = nextSlide.querySelector('.progress-text').textContent.match(/\d+/)[0];
            const totalQuestions = 5; // Assuming 5 questions total
            const progressPercent = (parseInt(questionNumber) / totalQuestions) * 100;
            progressBar.style.width = `${progressPercent}%`;
          }
        }
        
        // Scroll to top of quiz container
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
          quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
  
  // Navigate to previous slide
  quizBackButtons.forEach(button => {
    button.addEventListener('click', () => {
      const prevSlideId = button.getAttribute('data-prev');
      
      if (prevSlideId) {
        // Hide all slides
        quizSlides.forEach(slide => {
          slide.classList.remove('active');
        });
        
        // Show target slide
        const prevSlide = document.querySelector(`.quiz-slide[data-slide="${prevSlideId}"]`);
        if (prevSlide) {
          prevSlide.classList.add('active');
        }
      }
    });
  });
  
  // Enable/disable next button based on selection
  radioInputs.forEach(input => {
    input.addEventListener('change', () => {
      const questionSlide = input.closest('.quiz-slide');
      const nextButton = questionSlide.querySelector('.quiz-next-button');
      
      if (nextButton) {
        nextButton.disabled = false;
      }
    });
  });
}

/**
 * =============================================================================
 * COUNTDOWN TIMER
 * =============================================================================
 */
function initCountdownTimer() {
  const daysElement = document.getElementById('countdown-days');
  const hoursElement = document.getElementById('countdown-hours');
  const minutesElement = document.getElementById('countdown-minutes');
  const secondsElement = document.getElementById('countdown-seconds');
  
  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;
  
  // Set end date to 3 days from now
  const now = new Date();
  const endDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
  
  // Update countdown
  function updateCountdown() {
    const currentTime = new Date();
    const timeDifference = endDate - currentTime;
    
    if (timeDifference <= 0) {
      // Reset countdown to another 3 days when it reaches zero
      endDate.setTime(currentTime.getTime() + (3 * 24 * 60 * 60 * 1000));
    }
    
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
  }
  
  // Initial update
  updateCountdown();
  
  // Update every second
  setInterval(updateCountdown, 1000);
}

/**
 * =============================================================================
 * LIVE CHAT
 * =============================================================================
 */
function initLiveChat() {
  const chatToggle = document.querySelector('.chat-toggle');
  const chatWindow = document.querySelector('.chat-window');
  const chatClose = document.querySelector('.chat-close');
  const chatInput = document.querySelector('.chat-input textarea');
  const sendButton = document.querySelector('.send-button');
  const chatMessages = document.querySelector('.chat-messages');
  
  if (!chatToggle || !chatWindow) return;
  
  // Toggle chat window
  chatToggle.addEventListener('click', () => {
    const isExpanded = chatToggle.getAttribute('aria-expanded') === 'true';
    chatToggle.setAttribute('aria-expanded', !isExpanded);
    chatWindow.setAttribute('aria-hidden', isExpanded);
    
    if (!isExpanded) {
      // Focus input when opening chat
      setTimeout(() => {
        if (chatInput) chatInput.focus();
      }, 300);
    }
  });
  
  // Close chat window
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatToggle.setAttribute('aria-expanded', 'false');
      chatWindow.setAttribute('aria-hidden', 'true');
    });
  }
  
  // Send message
  if (sendButton && chatInput && chatMessages) {
    const sendMessage = () => {
      const message = chatInput.value.trim();
      
      if (message) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = 'Just now';
        
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTime);
        
        // Add to chat
        chatMessages.appendChild(messageElement);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after delay
        setTimeout(() => {
          const responseElement = document.createElement('div');
          responseElement.className = 'message received';
          
          const responseContent = document.createElement('div');
          responseContent.className = 'message-content';
          responseContent.textContent = "Thanks for your message! One of our specialists will reply shortly. In the meantime, feel free to take our quiz to find your personalized recommendation.";
          
          const responseTime = document.createElement('div');
          responseTime.className = 'message-time';
          responseTime.textContent = 'Just now';
          
          responseElement.appendChild(responseContent);
          responseElement.appendChild(responseTime);
          
          chatMessages.appendChild(responseElement);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
      }
    };
    
    // Send on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send on Enter key (but allow Shift+Enter for new line)
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}

/**
 * =============================================================================
 * SMOOTH SCROLLING
 * =============================================================================
 */
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80; // Adjust based on header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * =============================================================================
 * UTILITY FUNCTIONS
 * =============================================================================
 */

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

// Debounce function to limit execution rate
function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
