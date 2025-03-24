/**
 * S-Cream Success Page JavaScript
 * Handles JotForm integration and form prefilling from Stripe
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the success page
    initSuccessPage();
    
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

/**
 * Initialize the success page functionality
 */
function initSuccessPage() {
    // Extract URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    // Generate a random order number if not provided
    generateOrderNumber();
    
    // Load JotForm with prefilled values
    loadJotForm(sessionId);
    
    // Log analytics data (can be expanded later)
    logAnalytics(sessionId);
}

/**
 * Generate a random order number
 */
function generateOrderNumber() {
    const orderNumberElement = document.getElementById('order-number');
    
    if (orderNumberElement) {
        // Create a random order number based on timestamp and random digits
        const timestamp = new Date().getTime();
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `SC-${timestamp.toString().slice(-6)}-${randomDigits}`;
        
        // Update the element
        orderNumberElement.textContent = orderNumber;
        
        // Store in localStorage for potential future use
        localStorage.setItem('scream_order_number', orderNumber);
        
        return orderNumber;
    }
    
    return null;
}

/**
 * Load JotForm with prefilled values
 * @param {string} sessionId - Stripe session ID
 */
function loadJotForm(sessionId) {
    const jotformContainer = document.getElementById('jotform-container');
    
    if (!jotformContainer) return;
    
    // Get current date for order date
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Get order number
    const orderNumber = localStorage.getItem('scream_order_number') || document.getElementById('order-number').textContent;
    
    // Create JotForm embed with prefilled values
    const jotformEmbed = document.createElement('script');
    jotformEmbed.src = `https://form.jotform.com/jsform/250825922202147?orderDate=${currentDate}&stripeSessionID=${sessionId || 'direct-access'}&orderStatus=Medical Review Pending`;
    
    // Append JotForm to container
    jotformContainer.appendChild(jotformEmbed);
    
    // Add event listener for JotForm messages
    window.addEventListener('message', function(event) {
        // Check if message is from JotForm and if it's a submission success message
        if (event.data.action === 'submission:success') {
            handleFormSubmission(event.data);
        }
    });
}

/**
 * Handle successful form submission
 * @param {Object} data - Form submission data
 */
function handleFormSubmission(data) {
    // Show a thank you message or redirect to a tracking page
    showThankYouMessage();
    
    // You could also redirect to a tracking page:
    // setTimeout(() => {
    //     window.location.href = "tracking.html?order=" + localStorage.getItem('scream_order_number');
    // }, 3000);
}

/**
 * Show thank you message after form submission
 */
function showThankYouMessage() {
    const verificationSection = document.querySelector('.medical-verification');
    
    if (verificationSection) {
        // Hide the form
        const jotformContainer = verificationSection.querySelector('.jotform-container');
        if (jotformContainer) {
            jotformContainer.style.display = 'none';
        }
        
        // Create and show thank you message
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';
        thankYouMessage.innerHTML = `
            <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="48" height="48">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2>Verification Submitted</h2>
            <p class="verification-intro">Thank you for completing the medical verification. Our doctor will review your information within 24 hours.</p>
            
            <div class="verification-timeline">
                <div class="timeline-item">
                    <div class="timeline-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="timeline-content">
                        <h3>Verification Submitted</h3>
                        <p>We've received your medical information.</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                            <circle cx="12" cy="12" r="10" stroke-width="2"/>
                            <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="timeline-content">
                        <h3>Doctor Review</h3>
                        <p>Our doctor will review your information within 24 hours.</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                            <rect x="2" y="4" width="20" height="16" rx="2" stroke-width="2"/>
                            <path d="M16 2v4M8 2v4M2 10h20" stroke-width="2"/>
                        </svg>
                    </div>
                    <div class="timeline-content">
                        <h3>Shipping</h3>
                        <p>Once approved, your order will be shipped within 1-2 business days.</p>
                    </div>
                </div>
            </div>
            
            <div class="email-notification">
                <p>You'll receive an email notification once your order is approved and shipped.</p>
            </div>
        `;
        
        // Add CSS for the thank you message
        const style = document.createElement('style');
        style.textContent = `
            .thank-you-message {
                text-align: center;
                animation: fadeIn 0.5s ease-out;
            }
            
            .verification-timeline {
                margin: 2rem 0;
                max-width: 550px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .timeline-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                margin-bottom: 1.5rem;
                text-align: left;
            }
            
            .timeline-icon {
                background-color: rgba(72, 187, 120, 0.1);
                color: var(--success);
                padding: 0.75rem;
                border-radius: 50%;
                flex-shrink: 0;
            }
            
            .timeline-content h3 {
                font-size: 1.1rem;
                margin-bottom: 0.25rem;
                color: var(--text);
            }
            
            .timeline-content p {
                color: var(--text-light);
                margin: 0;
            }
            
            .email-notification {
                background-color: rgba(225, 122, 146, 0.1);
                padding: 1rem;
                border-radius: 0.5rem;
                margin-top: 2rem;
            }
            
            .email-notification p {
                margin: 0;
                color: var(--primary);
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
        
        // Add the thank you message to the page
        verificationSection.appendChild(thankYouMessage);
    }
}

/**
 * Log analytics data
 * @param {string} sessionId - Stripe session ID
 */
function logAnalytics(sessionId) {
    console.log('Page loaded with session ID:', sessionId);
    
    // This function can be expanded to include actual analytics tracking
    // For example, with Google Analytics or other tracking systems
    
    // Example with Google Analytics (if it's included on your page):
    // if (typeof gtag === 'function') {
    //     gtag('event', 'purchase_complete', {
    //         'event_category': 'ecommerce',
    //         'event_label': 'Payment Successful',
    //         'value': 99.00
    //     });
    // }
}
