/**
 * S-Cream Modern Order Tracking System
 * Enhanced tracking functionality with JotForm API integration
 * 
 * This script handles the order tracking functionality with a modern interface:
 * - Retrieves order details from JotForm using API
 * - Displays order status and timeline with visual enhancements
 * - Updates tracking information in real-time
 * - Manages user interface elements with smooth transitions
 */

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the tracking page
    initTrackingPage();
    
    // Update current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Add smooth scrolling to page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

/**
 * Initialize tracking page functionality with enhanced UI
 */
function initTrackingPage() {
    // DOM elements
    const trackingForm = document.getElementById('tracking-lookup-form');
    const lookupSection = document.getElementById('lookup-section');
    const statusSection = document.getElementById('order-status-section');
    const notFoundSection = document.getElementById('not-found-section');
    const tryAgainButton = document.getElementById('try-again-button');
    const emailUpdatesButton = document.getElementById('email-updates-button');
    
    // Add loading overlay
    createLoadingOverlay();
    
    // Check for URL parameters
    checkUrlParameters();
    
    // Form submission handler with enhanced validation and feedback
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const lookupValue = document.getElementById('lookup-value').value.trim();
            
            if (lookupValue) {
                showLoading();
                lookupOrder(lookupValue);
            } else {
                // Simple validation feedback
                const input = document.getElementById('lookup-value');
                input.classList.add('error');
                input.addEventListener('input', function() {
                    input.classList.remove('error');
                }, { once: true });
            }
        });
    }
    
    // Try again button with smooth transition
    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', function() {
            fadeOut(notFoundSection, function() {
                notFoundSection.style.display = 'none';
                lookupSection.style.display = 'block';
                fadeIn(lookupSection);
                // Clear previous input and focus
                const input = document.getElementById('lookup-value');
                if (input) {
                    input.value = '';
                    setTimeout(() => input.focus(), 300);
                }
            });
        });
    }
    
    // Email updates button
    if (emailUpdatesButton) {
        emailUpdatesButton.addEventListener('click', function(e) {
            e.preventDefault();
            subscribeToUpdates();
        });
    }
}

// =============================================================================
// LOADING INDICATOR
// =============================================================================

/**
 * Create loading overlay for better user experience
 */
function createLoadingOverlay() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.classList.add('loading-overlay');
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <svg viewBox="0 0 50 50" width="50" height="50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="var(--tracking-accent)" stroke-width="5" stroke-linecap="round"></circle>
            </svg>
            <p>Searching for your order...</p>
        </div>
    `;
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .loading-overlay.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .loading-spinner svg {
            animation: spin 1.5s linear infinite;
        }
        
        .loading-spinner circle {
            stroke-dasharray: 150;
            stroke-dashoffset: 0;
            transform-origin: center;
            animation: dash 2s ease-in-out infinite;
        }
        
        .loading-spinner p {
            font-size: 1rem;
            color: var(--tracking-accent);
            font-weight: 500;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes dash {
            0% { stroke-dashoffset: 150; }
            50% { stroke-dashoffset: 50; }
            100% { stroke-dashoffset: 150; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingOverlay);
}

/**
 * Show loading overlay
 */
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('visible');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('visible');
    }
}

// =============================================================================
// ORDER LOOKUP AND DISPLAY
// =============================================================================

/**
 * Check URL parameters for order or tracking information
 * Enhanced to support various parameter formats
 */
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderParam = urlParams.get('order') || urlParams.get('orderId') || urlParams.get('orderNumber');
    const trackingParam = urlParams.get('tracking') || urlParams.get('trackingNumber');
    const emailParam = urlParams.get('email');
    
    // If we have any parameter, look it up
    if (orderParam) {
        document.getElementById('lookup-value').value = orderParam;
        lookupOrder(orderParam);
    } 
    else if (trackingParam) {
        document.getElementById('lookup-value').value = trackingParam;
        lookupOrder(trackingParam);
    }
    else if (emailParam) {
        document.getElementById('lookup-value').value = emailParam;
        lookupOrder(emailParam);
    }
    // Otherwise, check if we have stored order number and use that
    else if (localStorage.getItem('scream_order_number')) {
        document.getElementById('lookup-value').value = localStorage.getItem('scream_order_number');
        // Don't auto-lookup from localStorage to avoid unexpected data loads
    }
}

/**
 * Lookup order by order number, email, or tracking number
 * Enhanced with better error handling and user feedback
 * @param {string} lookupValue - Order number, email, or tracking number
 */
function lookupOrder(lookupValue) {
    console.log('Looking up order:', lookupValue);
    
    // Show loading state
    showLoading();
    
    // Fetch actual order data from JotForm API
    fetchOrderDetails(lookupValue)
        .then(orderData => {
            if (orderData) {
                displayOrderDetails(orderData);
            } else {
                showNotFound();
            }
            // Hide loading state
            hideLoading();
        })
        .catch(error => {
            console.error('Error looking up order:', error);
            showNotFound();
            hideLoading();
        });
}

/**
 * Fetch order details from JotForm API
 * @param {string} identifier - Order number or email
 */
async function fetchOrderDetails(identifier) {
    try {
        // JotForm API configuration
        const apiKey = '1d286bad28d84621fed1c1c411e3d5b';
        const formId = '250825922202147'; // Replace with your actual form ID
        
        // Determine the search field based on identifier format
        let filterField = 'orderNumber'; // Default to order number
        
        if (identifier.includes('@')) {
            filterField = 'email'; // If it looks like an email, search by email
        } else if (!identifier.startsWith('SC-')) {
            filterField = 'trackingNumber'; // If not an order number or email, try tracking number
        }
        
        // Construct API URL with proper filter
        // Note: JotForm's API requires proper filter parameter formatting
        const apiUrl = `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}&filter={"q3_orderNumber:eq":"${identifier}"}`;

        console.log('Fetching from:', apiUrl);
        
        // Fetch data from JotForm API
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log('JotForm API response:', data);
        
        if (data.responseCode === 200 && data.content && data.content.length > 0) {
            // Found matching submission
            const submission = data.content[0];
            console.log('Found submission:', submission);
            
            // Process the submission data
            return processSubmissionData(submission);
        } else {
            // No matching submission found
            console.log('No submission found with the provided identifier');
            return null;
        }
    } catch (error) {
        console.error('Error fetching from JotForm API:', error);
        throw error;
    }
}

// =============================================================================
// DATA PROCESSING
// =============================================================================

/**
 * Process JotForm submission data and return order details object
 * @param {Object} submission - JotForm submission data
 * @returns {Object} - Processed order data
 */
function processSubmissionData(submission) {
    // Extract answers from submission
    const answers = submission.answers;
    
    // Map JotForm fields to our order data model
    // Note: The actual field numbers (q3, q8, etc.) may differ in your form
    // You'll need to adjust these based on your actual JotForm structure
    const orderData = {
        orderNumber: getAnswerValue(answers, 'orderNumber') || submission.id,
        orderDate: getAnswerValue(answers, 'orderDate') || formatDate(submission.created_at),
        status: getAnswerValue(answers, 'orderStatus') || 'pending',
        statusText: getStatusText(getAnswerValue(answers, 'orderStatus')),
        trackingNumber: getAnswerValue(answers, 'trackingNumber'),
        carrier: getAnswerValue(answers, 'shippingCarrier') || 'usps'
    };
    
    // Build timeline steps based on status
    orderData.steps = buildTimelineFromStatus(
        orderData.status, 
        submission.created_at,
        getAnswerValue(answers, 'reviewDate'),
        getAnswerValue(answers, 'approvalDate'),
        getAnswerValue(answers, 'preparingDate'),
        getAnswerValue(answers, 'shippingDate'),
        getAnswerValue(answers, 'deliveryDate')
    );
    
    return orderData;
}

/**
 * Helper function to extract answer value from JotForm answers object
 * @param {Object} answers - JotForm answers object
 * @param {string} fieldName - The field name to look for
 * @returns {string|null} - The answer value or null if not found
 */
function getAnswerValue(answers, fieldName) {
    // JotForm stores answers with question IDs as keys
    // We need to find the right question ID for our field
    
    // This is a simplified approach - you might need to adjust based on your form
    for (const qid in answers) {
        const answer = answers[qid];
        
        // Check if this is the field we're looking for
        // JotForm often uses the field name in the field title or name attribute
        if (answer.name && answer.name.toLowerCase().includes(fieldName.toLowerCase())) {
            return answer.answer || null;
        }
        
        // Also check in the sub-labels for multi-line inputs or subfields
        if (answer.sublabels) {
            for (const sublabel in answer.sublabels) {
                if (sublabel.toLowerCase().includes(fieldName.toLowerCase())) {
                    return answer.answer[sublabel] || null;
                }
            }
        }
    }
    
    return null;
}

/**
 * Get human-readable status text from status code
 * @param {string} status - Status code
 * @returns {string} - Human-readable status text
 */
function getStatusText(status) {
    const statusMap = {
        'pending': 'Processing',
        'medicalReview': 'Medical Review',
        'approved': 'Approved',
        'preparing': 'Preparing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'error': 'Additional Information Needed'
    };
    
    return statusMap[status] || 'Processing';
}

/**
 * Build timeline steps based on order status and dates
 * @param {string} status - Current order status
 * @param {string} orderDate - Order creation date
 * @param {string} reviewDate - Medical review date
 * @param {string} approvalDate - Prescription approval date
 * @param {string} preparingDate - Order preparation date
 * @param {string} shippingDate - Shipping date
 * @param {string} deliveryDate - Delivery date
 * @returns {Object} - Timeline steps object
 */
function buildTimelineFromStatus(status, orderDate, reviewDate, approvalDate, preparingDate, shippingDate, deliveryDate) {
    // Default timeline with just order received
    const timeline = {
        order: { completed: true, date: orderDate },
        review: { completed: false, date: null },
        approved: { completed: false, date: null },
        preparing: { completed: false, date: null },
        shipped: { completed: false, date: null },
        delivered: { completed: false, date: null }
    };
    
    // Update based on status and dates
    switch(status) {
        case 'delivered':
            timeline.delivered.completed = true;
            timeline.delivered.date = deliveryDate || shippingDate;
            // Fall through to update previous steps
        case 'shipped':
            timeline.shipped.completed = true;
            timeline.shipped.date = shippingDate || preparingDate;
            // Fall through to update previous steps
        case 'preparing':
            timeline.preparing.completed = true;
            timeline.preparing.date = preparingDate || approvalDate;
            // Fall through to update previous steps
        case 'approved':
            timeline.approved.completed = true;
            timeline.approved.date = approvalDate || reviewDate;
            // Fall through to update previous steps
        case 'medicalReview':
            timeline.review.completed = true;
            timeline.review.date = reviewDate || orderDate;
            break;
    }
    
    return timeline;
}

// =============================================================================
// UI DISPLAY AND UPDATES
// =============================================================================

/**
 * Display order details on the page with enhanced animations
 * @param {Object} orderData - Order details including status, tracking, etc.
 */
function displayOrderDetails(orderData) {
    // Hide the lookup form and not found section with fade effects
    const lookupSection = document.getElementById('lookup-section');
    const statusSection = document.getElementById('order-status-section');
    const notFoundSection = document.getElementById('not-found-section');
    
    fadeOut(lookupSection, function() {
        lookupSection.style.display = 'none';
        notFoundSection.style.display = 'none';
        statusSection.style.display = 'block';
        fadeIn(statusSection);
        
        // Scroll to top of status section
        statusSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    // Set order information
    document.getElementById('order-number-display').textContent = orderData.orderNumber;
    document.getElementById('order-date-display').textContent = formatDate(orderData.orderDate);
    
    // Set status badge
    const statusBadge = document.getElementById('status-badge');
    statusBadge.textContent = orderData.statusText;
    statusBadge.className = 'status-badge ' + orderData.status;
    
    // Update tracking number if available
    const trackingContainer = document.querySelector('.tracking-number-container');
    const trackingNumberDisplay = document.getElementById('tracking-number-display');
    const trackingLink = document.getElementById('tracking-link');
    
    if (orderData.trackingNumber) {
        trackingContainer.style.display = 'flex';
        trackingNumberDisplay.textContent = orderData.trackingNumber;
        
        // Set tracking URL based on carrier
        if (trackingLink) {
            let trackingUrl = '#';
            
            switch (orderData.carrier) {
                case 'usps':
                    trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${orderData.trackingNumber}`;
                    break;
                case 'ups':
                    trackingUrl = `https://www.ups.com/track?tracknum=${orderData.trackingNumber}`;
                    break;
                case 'fedex':
                    trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${orderData.trackingNumber}`;
                    break;
                default:
                    trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${orderData.trackingNumber}`;
            }
            
            trackingLink.href = trackingUrl;
        }
    } else {
        trackingContainer.style.display = 'none';
    }
    
    // Update timeline steps with animation delay
    setTimeout(() => {
        updateTimelineSteps(orderData.steps);
        
        // Show relevant notes
        updateStatusNotes(orderData.status);
    }, 300);
    
    // Store the order number in localStorage for future use
    localStorage.setItem('scream_order_number', orderData.orderNumber);
}

/**
 * Update timeline steps based on order progress with animations
 * @param {Object} steps - Object containing step statuses
 */
function updateTimelineSteps(steps) {
    // Update each step in the timeline
    Object.keys(steps).forEach((stepKey, index) => {
        const stepElement = document.getElementById(`step-${stepKey}`);
        const dateElement = document.getElementById(`date-${stepKey}`);
        
        if (stepElement && steps[stepKey]) {
            // Reset classes
            stepElement.classList.remove('active', 'completed');
            
            // Add animation delay based on index
            setTimeout(() => {
                // Check if step is completed
                if (steps[stepKey].completed) {
                    stepElement.classList.add('completed');
                    
                    // Update date if available
                    if (dateElement && steps[stepKey].date) {
                        dateElement.textContent = formatDate(steps[stepKey].date);
                    }
                } else {
                    // Find the last completed step
                    const completedSteps = Object.keys(steps).filter(key => steps[key].completed);
                    
                    // If this is the next step after the last completed one, mark it as active
                    if (completedSteps.length > 0 && 
                        Object.keys(steps).indexOf(stepKey) === Object.keys(steps).indexOf(completedSteps[completedSteps.length - 1]) + 1) {
                        stepElement.classList.add('active');
                    }
                }
            }, index * 150); // Staggered animation
        }
    });
}

/**
 * Update status notes based on order status with fade effects
 * @param {string} status - Current order status
 */
function updateStatusNotes(status) {
    // Hide all notes first
    const notes = [
        document.getElementById('note-pending'),
        document.getElementById('note-approved'),
        document.getElementById('note-shipped'),
        document.getElementById('note-error')
    ];
    
    notes.forEach(note => {
        if (note) note.style.display = 'none';
    });
    
    // Show relevant note based on status with fade effect
    let noteToShow;
    
    switch(status) {
        case 'pending':
        case 'medicalReview':
            noteToShow = document.getElementById('note-pending');
            break;
        case 'approved':
        case 'preparing':
            noteToShow = document.getElementById('note-approved');
            break;
        case 'shipped':
        case 'delivered':
            noteToShow = document.getElementById('note-shipped');
            break;
        case 'error':
            noteToShow = document.getElementById('note-error');
            break;
    }
    
    if (noteToShow) {
        noteToShow.style.opacity = 0;
        noteToShow.style.display = 'flex';
        
        setTimeout(() => {
            noteToShow.style.opacity = 1;
            noteToShow.style.transition = 'opacity 0.5s ease';
        }, 50);
    }
}

/**
 * Show not found error message with animation
 */
function showNotFound() {
    const lookupSection = document.getElementById('lookup-section');
    const statusSection = document.getElementById('order-status-section');
    const notFoundSection = document.getElementById('not-found-section');
    
    fadeOut(lookupSection, function() {
        lookupSection.style.display = 'none';
        statusSection.style.display = 'none';
        notFoundSection.style.display = 'block';
        fadeIn(notFoundSection);
    });
}

// =============================================================================
// ANIMATION HELPERS
// =============================================================================

/**
 * Fade out element with callback
 * @param {HTMLElement} element - Element to fade out
 * @param {Function} callback - Callback function after fade completes
 */
function fadeOut(element, callback) {
    if (!element) return;
    
    element.style.opacity = 1;
    element.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        element.style.opacity = 0;
        
        setTimeout(() => {
            if (callback) callback();
        }, 300);
    }, 10);
}

/**
 * Fade in element
 * @param {HTMLElement} element - Element to fade in
 */
function fadeIn(element) {
    if (!element) return;
    
    element.style.opacity = 0;
    element.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        element.style.opacity = 1;
    }, 10);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format date for display with enhanced formatting
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return as-is if invalid date
    
    // Check if date is today, yesterday, or this week
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (isSameDay(date, today)) {
        return `Today at ${formatTime(date)}`;
    } else if (isSameDay(date, yesterday)) {
        return `Yesterday at ${formatTime(date)}`;
    }
    
    // Regular date format
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} - True if same day
 */
function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

/**
 * Format time in 12-hour format
 * @param {Date} date - Date object
 * @returns {string} - Formatted time string
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Subscribe to email updates with enhanced user feedback
 */
function subscribeToUpdates() {
    const email = prompt('Enter your email address to receive order updates:');
    
    if (email) {
        // Show loading
        showLoading();
        
        // Simulate API call
        setTimeout(() => {
            hideLoading();
            // In a real implementation, you would call an API to subscribe the user
            
            // Show success message
            alert('You have been subscribed to order updates. You will receive notifications when your order status changes.');
        }, 1000);
    }
}

// =============================================================================
// MOCK DATA FOR TESTING WITHOUT JOTFORM API
// =============================================================================

/**
 * Mock order data for testing purposes
 * Uncomment this function to test without JotForm API
 */
/*
function fetchOrderDetails(identifier) {
    return new Promise((resolve, reject) => {
        // Simulate API delay
        setTimeout(() => {
            // Check if lookup value matches test data
            if (identifier === 'SC-123456-7890' || identifier === 'test@example.com') {
                // Return mock data
                resolve({
                    orderNumber: 'SC-123456-7890',
                    orderDate: new Date().toISOString(),
                    status: 'shipped',
                    statusText: 'Shipped',
                    trackingNumber: '9400123456789012345678',
                    carrier: 'usps',
                    steps: {
                        order: { completed: true, date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
                        review: { completed: true, date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString() },
                        approved: { completed: true, date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
                        preparing: { completed: true, date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
                        shipped: { completed: true, date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
                        delivered: { completed: false, date: null }
                    }
                });
            } else {
                // No order found
                resolve(null);
            }
        }, 1500);
    });
}
*/
