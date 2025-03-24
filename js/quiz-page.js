/**
 * =============================================================================
 * S-Cream Quiz Page JavaScript
 * Handles quiz flow, logic, and recommendations
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
});

/**
 * Initialize the quiz functionality
 */
function initQuiz() {
  const quizSlides = document.querySelectorAll('.quiz-slide');
  const nextButtons = document.querySelectorAll('[data-next]');
  const backButtons = document.querySelectorAll('[data-prev]');
  const radioInputs = document.querySelectorAll('.answer-option input');
  const checkoutButton = document.getElementById('checkout-button');
  
  // Store user's answers
  const userAnswers = {};
  
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
        
        // Show processing slide
        showSlide(nextSlideId);
        
        // Animate the processing steps
        simulateProcessing(() => {
          // After processing, determine recommendation based on answers
          const recommendation = determineRecommendation(userAnswers);
          updateResultsWithRecommendation(recommendation);
          
          // Show results slide
          setTimeout(() => {
            showSlide('results');
          }, 500);
        });
        
        return;
      }
      
      // For normal navigation, store the answer if it's a question slide
      if (currentSlide.querySelector('.quiz-question')) {
        const questionId = currentSlide.getAttribute('data-slide');
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        
        if (selectedOption) {
          userAnswers[questionId] = selectedOption.value;
        }
      }
      
      // Show the next slide
      if (nextSlideId) {
        showSlide(nextSlideId);
      }
    });
  });
  
  // Navigate to previous slide
  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      const prevSlideId = button.getAttribute('data-prev');
      
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
      
      // Redirect to Stripe checkout (this would be replaced with actual Stripe integration)
      redirectToStripeCheckout(formulaName);
    });
  }
}

/**
 * Show a specific slide
 * @param {string} slideId - The ID of the slide to show
 * @param {boolean} isBackNavigation - Whether this is back navigation
 */
function showSlide(slideId, isBackNavigation = false) {
  const slides = document.querySelectorAll('.quiz-slide');
  
  // Hide all slides
  slides.forEach(slide => {
    slide.classList.remove('active');
    slide.classList.remove('slide-in-right');
    slide.classList.remove('slide-in-left');
  });
  
  // Show target slide with appropriate animation
  const targetSlide = document.querySelector(`.quiz-slide[data-slide="${slideId}"]`);
  if (targetSlide) {
    targetSlide.classList.add('active');
    targetSlide.classList.add(isBackNavigation ? 'slide-in-left' : 'slide-in-right');
    
    // Scroll to top of quiz container
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
      quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
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
      steps[currentStep].classList.add('completed');
      currentStep++;
      setTimeout(processStep, 800);
    } else {
      // All steps completed
      if (callback) callback();
    }
  };
  
  // Start processing
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
  
  if (formulaNameElement) formulaNameElement.textContent = recommendation.formulaName;
  if (highlight1Element) highlight1Element.textContent = recommendation.highlight1;
  if (highlight2Element) highlight2Element.textContent = recommendation.highlight2;
  if (highlight3Element) highlight3Element.textContent = recommendation.highlight3;
}

/**
 * Redirect to Stripe checkout page
 * @param {string} formulaName - Name of the recommended formula
 */
function redirectToStripeCheckout(formulaName) {
  // In a real implementation, this would create a Stripe Checkout session
  // and redirect the user to the Stripe-hosted checkout page
  
  // For demonstration purposes, we'll log the action and alert the user
  console.log('Redirecting to Stripe checkout for:', formulaName);
  
  // Simulated redirect
  alert(`You're being redirected to checkout for ${formulaName}. In a real implementation, this would open the Stripe checkout page.`);
  
  // Example of how this might be implemented with Stripe
  /*
  fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product: formulaName,
      price: '71.20'
    }),
  })
  .then(response => response.json())
  .then(session => {
    // Redirect to Stripe Checkout
    window.location.href = session.url;
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */
  
  // For demo purposes, redirect back to index page after delay
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
}
