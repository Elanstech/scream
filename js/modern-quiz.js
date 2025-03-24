/**
 * =============================================================================
 * S-Cream Modern Quiz Page JavaScript
 * Handles quiz flow, animations, and recommendation logic
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
 * Initialize the quiz functionality
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
      
      // Redirect to Stripe checkout (this would be replaced with actual Stripe integration)
      redirectToStripeCheckout(formulaName);
    });
  }
  
  // Initial progress setup
  updateProgress(0);
}

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
  
  // Default recommendation
  let recommendation = {
    formulaName: 'S-Cream Sensitivity+ Formula',
    highlight1: 'Enhanced blood flow for maximum sensitivity',
    highlight2: 'Fast-acting formula (15-30 minutes)',
    highlight3: 'Personalized for your unique needs'
  };
  
  // Simple logic to determine recommendation based on answers
  // This would be expanded with more sophisticated logic based on actual formulations
  
  // Question 1: What are you looking to improve?
  if (answers['question-1'] === 'sensitivity') {
    recommendation.formulaName = 'S-Cream Sensitivity+ Formula';
    recommendation.highlight1 = 'Enhanced sensitivity through increased blood flow';
  } else if (answers['question-1'] === 'arousal') {
    recommendation.formulaName = 'S-Cream Arousal+ Formula';
    recommendation.highlight1 = 'Specialized blend for enhanced arousal response';
  } else if (answers['question-1'] === 'satisfaction') {
    recommendation.formulaName = 'S-Cream Complete Formula';
    recommendation.highlight1 = 'Comprehensive formula for overall satisfaction';
  } else if (answers['question-1'] === 'all') {
    recommendation.formulaName = 'S-Cream Premium Formula';
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
 * Redirect to Stripe checkout page
 * @param {string} formulaName - Name of the recommended formula
 */
function redirectToStripeCheckout(formulaName) {
  // In a real implementation, this would create a Stripe Checkout session
  // and redirect the user to the Stripe-hosted checkout page
  
  console.log('Redirecting to Stripe checkout for:', formulaName);
  
  // Example of how this might be implemented with Stripe
  /*
  fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product: formulaName,
      price: '99.00'
    }),
  })
  .then(response => response.json())
  .then(session => {
    // Redirect to Stripe Checkout
    window.location.href = session.url;
  })
  .catch(error => {
    console.error('Error:', error);
    
    // Hide loading overlay on error
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('active');
    }
  });
  */
  
  // For demo purposes, simulate API call and redirect after delay
  setTimeout(() => {
    // In production, this would be the Stripe checkout URL
    // window.location.href = session.url;
    
    // For demo, redirect back to index page
    window.location.href = 'index.html';
  }, 2000);
}
