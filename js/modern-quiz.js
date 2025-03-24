/**
 * =============================================================================
 * S-Cream Modern Quiz Page JavaScript
 * Complete integration with quiz flow, animations, and Stripe checkout
 * With direct purchase option for returning customers
 * =============================================================================
 */

/**
 * =============================================================================
 * 1. INITIALIZATION & EVENT LISTENERS
 * =============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the quiz
  initQuiz();
  
  // Update current year in footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  
  // Update header on scroll
  window.addEventListener('scroll', handleScroll);
  
  // Add hover effect to product preview
  initProductPreview();
});

/**
 * Handle scroll events to update header styling
 */
function handleScroll() {
  const header = document.querySelector('.quiz-header');
  
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

/**
 * Initialize product preview hover effects
 */
function initProductPreview() {
  const productPreview = document.querySelector('.product-preview');
  const productGlow = document.querySelector('.product-glow');
  
  if (productPreview && productGlow) {
    productPreview.addEventListener('mousemove', e => {
      const rect = productPreview.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate position within the element (0 to 1)
      const xPos = x / rect.width;
      const yPos = y / rect.height;
      
      // Move glow to follow cursor
      productGlow.style.transform = `translate(calc(-50% + ${(xPos - 0.5) * 20}px), calc(-50% + ${(yPos - 0.5) * 20}px))`;
      productGlow.style.opacity = '0.8';
    });
    
    productPreview.addEventListener('mouseleave', () => {
      productGlow.style.transform = 'translate(-50%, -50%)';
      productGlow.style.opacity = '0.4';
    });
  }
}

/**
 * =============================================================================
 * 2. QUIZ FUNCTIONALITY
 * =============================================================================
 */
function initQuiz() {
  const quizSlides = document.querySelectorAll('.quiz-slide');
  const nextButtons = document.querySelectorAll('[data-next]');
  const backButtons = document.querySelectorAll('[data-prev]');
  const radioInputs = document.querySelectorAll('.answer-option input');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressBar = document.querySelector('.progress-filled');
  const checkoutButton = document.getElementById('checkout-button');
  const loadingOverlay = document.getElementById('loading-overlay');
  
  // Store user's answers
  const userAnswers = {};
  
  // Store current question index
  let currentQuestionIndex = 0;
  
  // Set up direct purchase buttons - new code for Buy Now functionality
  const directPurchaseButtons = document.querySelectorAll('.direct-purchase-button, .secondary-purchase-button');
  if (directPurchaseButtons.length > 0) {
    directPurchaseButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show loading overlay
        if (loadingOverlay) {
          loadingOverlay.classList.add('active');
        }
        
        // Redirect to Stripe checkout directly without quiz processing
        redirectToStripeCheckout('S-Cream Premium Formula');
      });
    });
  }
  
  // Navigate to next slide
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentSlide = button.closest('.quiz-slide');
      const nextSlideId = button.getAttribute('data-next');
      
      // If processing slide, simulate processing and then show results
      if (nextSlideId === 'processing') {
        // Store the answer for the last question
        const questionId = currentSlide.getAttribute('data-slide');
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        
        if (selectedOption) {
          userAnswers[questionId] = selectedOption.value;
        }
        
        // Update progress visualization
        updateProgress(5);
        
        // Show processing slide with animation
        showSlide(nextSlideId, false);
        
        // Animate the processing steps
        simulateProcessing(() => {
          // After processing, determine recommendation based on answers
          const recommendation = determineRecommendation(userAnswers);
          updateResultsWithRecommendation(recommendation);
          
          // Show results slide
          setTimeout(() => {
            showSlide('results', false);
          }, 500);
        });
        
        return;
      }
      
      // For normal navigation, store the answer if it's a question slide
      if (currentSlide.querySelector('.quiz-slide-content')) {
        const questionId = currentSlide.getAttribute('data-slide');
        
        // Only store if it's a question slide (not intro)
        if (questionId.includes('question')) {
          const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
          
          if (selectedOption) {
            userAnswers[questionId] = selectedOption.value;
          }
          
          // Get the question number
          const questionNumber = parseInt(questionId.split('-')[1]);
          
          // Update progress visualization
          updateProgress(questionNumber);
        }
      }
      
      // Show the next slide
      if (nextSlideId) {
        showSlide(nextSlideId, false);
      }
    });
  });
  
  // Navigate to previous slide
  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      const prevSlideId = button.getAttribute('data-prev');
      
      // Get the question number if applicable
      if (prevSlideId.includes('question')) {
        const questionNumber = parseInt(prevSlideId.split('-')[1]);
        updateProgress(questionNumber);
      } else if (prevSlideId === 'intro') {
        // Reset progress for intro
        updateProgress(0);
      }
      
      if (prevSlideId) {
        showSlide(prevSlideId, true);
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
  
  // Set up checkout button to redirect to Stripe
  if (checkoutButton) {
    checkoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get selected formula information
      const formulaName = document.getElementById('formula-name').textContent;
      
      // Show loading overlay
      if (loadingOverlay) {
        loadingOverlay.classList.add('active');
      }
      
      // Redirect to Stripe checkout
      redirectToStripeCheckout(formulaName);
    });
  }
  
  // Initial progress setup
  updateProgress(0);
}

/**
 * =============================================================================
 * 3. QUIZ PROGRESS & NAVIGATION
 * =============================================================================
 */

/**
 * Update progress indicators
 * @param {number} step - Current step number (0-5)
 */
function updateProgress(step) {
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressBar = document.querySelector('.progress-filled');
  
  // Update step indicators
  progressSteps.forEach((stepEl, index) => {
    // Reset all steps
    stepEl.classList.remove('active');
    stepEl.classList.remove('completed');
    
    // Set appropriate classes
    if (index + 1 < step) {
      stepEl.classList.add('completed');
    } else if (index + 1 === step) {
      stepEl.classList.add('active');
    }
  });
  
  // Update progress bar (0% for intro, 20% per question)
  if (step === 0) {
    progressBar.style.width = '0%';
  } else {
    const progressPercentage = Math.min(100, step * 20);
    progressBar.style.width = `${progressPercentage}%`;
  }
  
  // Hide progress indicators on intro and results
  const progressContainer = document.querySelector('.quiz-progress-container');
  
  if (step === 0 || step > 5) {
    progressContainer.style.opacity = '0';
    progressContainer.style.pointerEvents = 'none';
  } else {
    progressContainer.style.opacity = '1';
    progressContainer.style.pointerEvents = 'auto';
  }
}

/**
 * Show a specific slide with animation
 * @param {string} slideId - The ID of the slide to show
 * @param {boolean} isBackNavigation - Whether this is back navigation
 */
function showSlide(slideId, isBackNavigation) {
  const slides = document.querySelectorAll('.quiz-slide');
  const currentSlide = document.querySelector('.quiz-slide.active');
  const targetSlide = document.querySelector(`.quiz-slide[data-slide="${slideId}"]`);
  
  if (!targetSlide) return;
  
  // Direction-specific animation classes
  const outgoingAnimation = isBackNavigation ? 'slide-out-right' : 'slide-out-left';
  const incomingAnimation = isBackNavigation ? 'slide-in-left' : 'slide-in-right';
  
  // Animate current slide out
  if (currentSlide) {
    currentSlide.classList.add(outgoingAnimation);
    
    // After animation completes, hide the slide
    setTimeout(() => {
      currentSlide.classList.remove('active');
      currentSlide.classList.remove(outgoingAnimation);
    }, 300);
  }
  
  // Animate new slide in (with a slight delay)
  setTimeout(() => {
    targetSlide.classList.add('active');
    targetSlide.classList.add(incomingAnimation);
    
    // Remove animation class after completion
    setTimeout(() => {
      targetSlide.classList.remove(incomingAnimation);
    }, 300);
    
    // Scroll to top of container
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 200);
}

/**
 * =============================================================================
 * 4. PROCESSING & RECOMMENDATION
 * =============================================================================
 */

/**
 * Simulate processing with animated steps
 * @param {Function} callback - Function to call when processing is complete
 */
function simulateProcessing(callback) {
  const steps = document.querySelectorAll('.processing-step');
  let currentStep = 0;
  
  // Process each step with a delay
  const processStep = () => {
    if (currentStep < steps.length) {
      // Mark step as active first
      steps[currentStep].classList.add('active');
      
      // Then mark as completed after a delay
      setTimeout(() => {
        steps[currentStep].classList.add('completed');
        steps[currentStep].classList.remove('active');
        currentStep++;
        setTimeout(processStep, 800);
      }, 1200);
    } else {
      // All steps completed
      if (callback) callback();
    }
  };
  
  // Start processing after a brief delay
  setTimeout(processStep, 800);
}

/**
 * Determine the recommended formula based on user answers
 * @param {Object} answers - User's quiz answers
 * @returns {Object} - Recommendation object with formula details
 */
function determineRecommendation(answers) {
  console.log('User answers:', answers);
  
  // Since we only have one formula, always recommend Premium Formula
  let recommendation = {
    formulaName: 'S-Cream Premium Formula',
    highlight1: 'Our most advanced formula for maximum results',
    highlight2: 'Fast-acting formula (15-30 minutes)',
    highlight3: 'Doctor-formulated with premium ingredients'
  };
  
  // Personalize some highlights based on answers for better user experience
  
  // Question 1: What are you looking to improve?
  if (answers['question-1'] === 'sensitivity') {
    recommendation.highlight1 = 'Enhanced sensitivity through increased blood flow';
  } else if (answers['question-1'] === 'arousal') {
    recommendation.highlight1 = 'Specialized blend for enhanced arousal response';
  } else if (answers['question-1'] === 'satisfaction') {
    recommendation.highlight1 = 'Comprehensive formula for overall satisfaction';
  } else if (answers['question-1'] === 'all') {
    recommendation.highlight1 = 'Our most complete formula for all aspects of intimacy';
  }
  
  // Question 4: Preferred sensation
  if (answers['question-4'] === 'warming') {
    recommendation.highlight2 = 'Warming sensation for enhanced comfort';
  } else if (answers['question-4'] === 'tingling') {
    recommendation.highlight2 = 'Gentle tingling effect for heightened awareness';
  } else if (answers['question-4'] === 'subtle') {
    recommendation.highlight2 = 'Subtle enhancement for natural feeling';
  } else if (answers['question-4'] === 'intense') {
    recommendation.highlight2 = 'Maximum intensity for powerful sensations';
  }
  
  // Question 5: Previous product use
  if (answers['question-5'] === 'never') {
    recommendation.highlight3 = 'Gentle introduction for first-time users';
  } else if (answers['question-5'] === 'tried-ineffective') {
    recommendation.highlight3 = 'Clinical-strength formula unlike over-the-counter options';
  } else if (answers['question-5'] === 'tried-effective') {
    recommendation.highlight3 = 'Enhanced potency compared to typical products';
  } else if (answers['question-5'] === 'using-currently') {
    recommendation.highlight3 = 'Doctor-formulated alternative to your current product';
  }
  
  return recommendation;
}

/**
 * Update the results screen with the recommendation
 * @param {Object} recommendation - Recommendation object with formula details
 */
function updateResultsWithRecommendation(recommendation) {
  const formulaNameElement = document.getElementById('formula-name');
  const highlight1Element = document.getElementById('highlight-1');
  const highlight2Element = document.getElementById('highlight-2');
  const highlight3Element = document.getElementById('highlight-3');
  
  // Animate the updates
  if (formulaNameElement) {
    animateTextUpdate(formulaNameElement, recommendation.formulaName);
  }
  
  if (highlight1Element) {
    animateTextUpdate(highlight1Element, recommendation.highlight1);
  }
  
  if (highlight2Element) {
    animateTextUpdate(highlight2Element, recommendation.highlight2);
  }
  
  if (highlight3Element) {
    animateTextUpdate(highlight3Element, recommendation.highlight3);
  }
}

/**
 * Animate text update with a fade effect
 * @param {HTMLElement} element - Element to update
 * @param {string} newText - New text content
 */
function animateTextUpdate(element, newText) {
  // Fade out
  element.style.transition = 'opacity 0.3s, transform 0.3s';
  element.style.opacity = '0';
  element.style.transform = 'translateY(10px)';
  
  // Update text and fade in after a short delay
  setTimeout(() => {
    element.textContent = newText;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 300);
}

/**
 * =============================================================================
 * 5. CHECKOUT & COMPLETION
 * =============================================================================
 */

/**
 * Redirect to Stripe checkout page
 * @param {string} formulaName - Name of the recommended formula
 */
function redirectToStripeCheckout(formulaName) {
  // Show loading overlay if not already visible
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay && !loadingOverlay.classList.contains('active')) {
    loadingOverlay.classList.add('active');
  }
  
  // Generate a secure token for validating the return from Stripe
  const secureToken = generateSecureToken();
  
  // Store token in both localStorage AND sessionStorage for redundancy
  localStorage.setItem('scream_checkout_token', secureToken);
  sessionStorage.setItem('scream_checkout_token', secureToken);
  
  // Get the base path to handle subdirectory hosting
  const currentPath = window.location.pathname;
  const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
  
  // Build the complete success URL with our domain and include the token
  const successUrl = `${window.location.origin}${basePath}success.html?token=${secureToken}`;
  
  // Set up the Stripe checkout URL with both token and return_url parameters
  const baseStripeUrl = 'https://buy.stripe.com/test_6oE8yM1y7atV9qM8ww';
  const stripeCheckoutUrl = `${baseStripeUrl}?success_url=${encodeURIComponent(successUrl)}&return_url=${encodeURIComponent(successUrl)}`;
  
  // Log for debugging purposes
  console.log('Redirecting to Stripe checkout for:', formulaName);
  console.log('Success URL:', successUrl);
  console.log('Token stored:', secureToken);
  
  // Short delay to show loading animation
  setTimeout(() => {
    // Redirect to Stripe Checkout
    window.location.href = stripeCheckoutUrl;
  }, 800);
}

/**
 * Generate a secure token for verification
 * @returns {string} - Secure random token
 */
function generateSecureToken() {
  // Create a timestamp component
  const timestamp = Date.now().toString();
  
  // Create a random component (random alphanumeric string)
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let random = '';
  for (let i = 0; i < 16; i++) {
    random += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  
  // Combine timestamp and random components
  return `${timestamp}-${random}`;
}

/**
 * Handle success page URL parameters (if applicable)
 * Can be used to verify the checkout was completed
 */
function handleSuccessPage() {
  // Check if we're on the success page
  if (window.location.pathname.includes('success')) {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const token = urlParams.get('token');
    
    console.log('Success page loaded with params:', { sessionId, token });
    
    // You could verify the session on your server if needed
    // or trigger additional events like conversion tracking
  }
}

// Check for success page parameters on load
handleSuccessPage();

/**
 * =============================================================================
 * 6. UTILITY FUNCTIONS
 * =============================================================================
 */

/**
 * Check if an element is visible in viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in viewport
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function to limit execution frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
