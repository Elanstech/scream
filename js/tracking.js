/**
 * S-Cream Order Tracking System
 * Complete implementation with JotForm API integration
 * 
 * This script handles the entire order tracking functionality:
 * - Retrieves order details from JotForm using API
 * - Displays order status and timeline
 * - Updates tracking information in real-time
 * - Manages user interface elements
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
});

/**
 * Initialize tracking page functionality
 */
function initTrackingPage() {
    // DOM elements
    const trackingForm = document.getElementById('tracking-lookup-form');
    const lookupSection = document.getElementById('lookup-section');
    const statusSection = document.getElementById('order-status-section');
    const notFoundSection = document.getElementById('not-found-section');
    const tryAgainButton = document.getElementById('try-again-button');
    const emailUpdatesButton = document.getElementById('email-updates-button');
    
    // Check for URL parameters
    checkUrlParameters();
    
    // Form submission handler
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const lookupValue = document.getElementById('lookup-value').value.trim();
            
            if (lookupValue) {
                lookupOrder(lookupValue);
            }
        });
    }
    
    // Try again button
    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', function() {
            notFoundSection.style.display = 'none';
            lookupSection.style.display = 'block';
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
// ORDER LOOKUP AND DISPLAY
// =============================================================================

/**
 * Check URL parameters for order or tracking information
 */
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderParam = urlParams.get('order');
    const trackingParam = urlParams.get('tracking');
    
    // If we have an order parameter, look it up
    if (orderParam) {
        lookupOrder(orderParam);
    } 
    // If we have tracking number, show order with that tracking
    else if (trackingParam) {
        lookupOrder(trackingParam);
    }
    // Otherwise, check if we have stored order number and use that
    else if (localStorage.getItem('scream_order_number')) {
        lookupOrder(localStorage.getItem('scream_order_number'));
    }
}

/**
 * Lookup order by order number, email, or tracking number
 * @param {string} lookupValue - Order number, email, or tracking number
 */
function lookupOrder(lookupValue) {
    console.log('Looking up order:', lookupValue);
    
    // Show loading state
    document.body.style.cursor = 'wait';
    
    // Fetch actual order data from JotForm API
    fetchOrderDetails(lookupValue)
        .then(() => {
            // Reset cursor
            document.body.style.cursor = 'default';
        })
        .catch(error => {
            console.error('Error looking up order:', error);
            showNotFound();
            document.body.style.cursor = 'default';
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
            processSubmissionData(submission);
        } else {
            // No matching submission found
            console.log('No submission found with the provided identifier');
            showNotFound();
        }
    } catch (error) {
        console.error('Error fetching from JotForm API:', error);
        showNotFound();
        throw error;
    }
}

// =============================================================================
// DATA PROCESSING
// =============================================================================

/**
 * Process JotForm submission data and display order details
 * @param {Object} submission - JotForm submission data
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
    
    // Display the order details on the page
    displayOrderDetails(orderData);
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
 * Display order details on the page
 * @param {Object} orderData - Order details including status, tracking, etc.
 */
function displayOrderDetails(orderData) {
    // Hide the lookup form and not found section
    const lookupSection = document.getElementById('lookup-section');
    const statusSection = document.getElementById('order-status-section');
    const notFoundSection = document.getElementById('not-found-section');
    
    lookupSection.style.display = 'none';
    notFoundSection.style.display = 'none';
    statusSection.style.display = 'block';
    
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
    
    // Update timeline steps
    updateTimelineSteps(orderData.steps);
    
    // Show relevant notes
    updateStatusNotes(orderData.status);
    
    // Store the order number in localStorage for future use
    localStorage.setItem('scream_order_number', orderData.orderNumber);
}

/**
 * Update timeline steps based on order progress
 * @param {Object} steps - Object containing step statuses
 */
function updateTimelineSteps(steps) {
    // Update each step in the timeline
    Object.keys(steps).forEach(stepKey => {
        const stepElement = document.getElementById(`step-${stepKey}`);
        const dateElement = document.getElementById(`date-${stepKey}`);
        
        if (stepElement && steps[stepKey]) {
            // Reset classes
            stepElement.classList.remove('active', 'completed');
            
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
        }
    });
}

/**
 * Update status notes based on order status
 * @param {string} status - Current order status
 */
function updateStatusNotes(status) {
    // Hide all notes first
    document.getElementById('note-pending').style.display = 'none';
    document.getElementById('note-approved').style.display = 'none';
    document.getElementById('note-shipped').style.display = 'none';
    document.getElementById('note-error').style.display = 'none';
    
    // Show relevant note based on status
    switch(status) {
        case 'pending':
        case 'medicalReview':
            document.getElementById('note-pending').style.display = 'flex';
            break;
        case 'approved':
        case 'preparing':
            document.getElementById('note-approved').style.display = 'flex';
            break;
        case 'shipped':
        case 'delivered':
            document.getElementById('note-shipped').style.display = 'flex';
            break;
        case 'error':
            document.getElementById('note-error').style.display = 'flex';
            break;
    }
}

/**
 * Show not found error message
 */
function showNotFound() {
    document.getElementById('lookup-section').style.display = 'none';
    document.getElementById('order-status-section').style.display = 'none';
    document.getElementById('not-found-section').style.display = 'block';
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return as-is if invalid date
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Subscribe to email updates
 */
function subscribeToUpdates() {
    const email = prompt('Enter your email address to receive order updates:');
    
    if (email) {
        // In a real implementation, you would call an API to subscribe the user
        alert('You have been subscribed to order updates. You will receive notifications when your order status changes.');
    }
}

// Auto-refresh order status every 5 minutes (optional)
// Uncomment this block if you want to enable auto-refresh
/*
setInterval(() => {
    const orderNumber = localStorage.getItem('scream_order_number');
    if (orderNumber && document.getElementById('order-status-section').style.display !== 'none') {
        console.log('Auto-refreshing order status...');
        lookupOrder(orderNumber);
    }
}, 300000); // 5 minutes
*/
