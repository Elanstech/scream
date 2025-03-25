/**
 * S-Cream Order Tracking System
 * JotForm API integration for order tracking
 */

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
    
    // Add loading overlay
    createLoadingOverlay();
    
    // Check for URL parameters
    checkUrlParameters();
    
    // Form submission handler with validation
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

/**
 * Check URL parameters for order or tracking information
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
        // JotForm API configuration - Corrected API Key
        const apiKey = '1d286bad28d846621fed1c1c411e3d5b';
        const formId = '250825922202147';
        
        // Multiple filter options to try different field names
        const filters = [];
        
        // For order numbers (try different field names that might match)
        if (identifier.toUpperCase().startsWith('SC')) {
            filters.push(`{"q27_yourOrder":"${identifier}"}`);  // Your Order Tracking Number
            filters.push(`{"your-order-tracking-number":"${identifier}"}`);
            filters.push(`{"q3_orderNumber":"${identifier}"}`); // Generic order number
            filters.push(`{"order-number":"${identifier}"}`);
        } 
        // For email addresses
        else if (identifier.includes('@')) {
            filters.push(`{"q7_email":"${identifier}"}`);
            filters.push(`{"email":"${identifier}"}`);
        } 
        // For everything else (try multiple fields)
        else {
            filters.push(`{"q27_yourOrder":"${identifier}"}`);  // Try as order number
            filters.push(`{"q7_email":"${identifier}"}`);       // Try as email
        }
        
        // Try each filter until we find a match or exhaust all options
        for (const filter of filters) {
            // Construct API URL with filter
            const apiUrl = `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}&filter=${filter}`;
            console.log('Trying API URL:', apiUrl);
            
            // Fetch data from JotForm API
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            console.log('JotForm API response for filter', filter, ':', data);
            
            // If we found a match, process it and return
            if (data.responseCode === 200 && data.content && data.content.length > 0) {
                const submission = data.content[0];
                console.log('Found submission:', submission);
                return processSubmissionData(submission);
            }
        }
        
        // If we get here, no matches were found with any filter
        console.log('No submission found with the provided identifier');
        return null;
        
    } catch (error) {
        console.error('Error fetching from JotForm API:', error);
        throw error;
    }
}

/**
 * Process JotForm submission data and extract order details
 * @param {Object} submission - JotForm submission data
 * @returns {Object} - Processed order data
 */
function processSubmissionData(submission) {
    console.log('Processing submission data:', submission);
    const answers = submission.answers;
    
    // Field mapping based on JotForm structure
    const orderData = {
        orderNumber: findJotFormField(answers, ['yourOrder', 'your order tracking', 'order number']) || submission.id,
        orderDate: findJotFormField(answers, ['orderDate', 'order date']) || formatDate(submission.created_at),
        status: mapStatusToInternal(findJotFormField(answers, ['orderStatus', 'order status'])),
        statusText: findJotFormField(answers, ['orderStatus', 'order status']) || 'Processing',
        trackingNumber: findJotFormField(answers, ['trackingNumber', 'tracking number']),
        carrier: findJotFormField(answers, ['shippingCarrier', 'shipping carrier']) || 'usps'
    };
    
    // Build timeline steps based on status
    orderData.steps = buildTimelineFromStatus(
        orderData.status, 
        submission.created_at,
        getDateFromForm(answers, 'reviewDate') || submission.created_at,
        getDateFromForm(answers, 'approvalDate'),
        getDateFromForm(answers, 'preparingDate'),
        getDateFromForm(answers, 'shippingDate'),
        getDateFromForm(answers, 'deliveryDate')
    );
    
    return orderData;
}

/**
 * Find a field value from JotForm answers by looking through various possible field names
 * @param {Object} answers - JotForm answers object
 * @param {Array} possibleNames - Array of possible field name variations to look for
 * @returns {string|null} - Found value or null
 */
function findJotFormField(answers, possibleNames) {
    for (const qid in answers) {
        const answer = answers[qid];
        
        // Check name field
        if (answer.name && possibleNames.some(name => 
            answer.name.toLowerCase().includes(name.toLowerCase()))) {
            return answer.answer || null;
        }
        
        // Also check text field 
        if (answer.text && possibleNames.some(name => 
            answer.text.toLowerCase().includes(name.toLowerCase()))) {
            return answer.answer || null;
        }
        
        // Check sublabels for multi-field inputs
        if (answer.sublabels) {
            for (const sublabel in answer.sublabels) {
                if (possibleNames.some(name => 
                    sublabel.toLowerCase().includes(name.toLowerCase()))) {
                    return answer.answer[sublabel] || null;
                }
            }
        }
    }
    
    return null;
}

/**
 * Get a date value from JotForm
 * @param {Object} answers - JotForm answers object
 * @param {string} fieldName - Field name to look for
 * @returns {string|null} - Date string or null
 */
function getDateFromForm(answers, fieldName) {
    const dateValue = findJotFormField(answers, [fieldName]);
    if (dateValue) {
        // Ensure date is in proper format
        try {
            const date = new Date(dateValue);
            return date.toISOString();
        } catch (e) {
            return dateValue;
        }
    }
    return null;
}

/**
 * Map JotForm status values to internal status codes
 * @param {string} status - JotForm status text
 * @returns {string} - Internal status code
 */
function mapStatusToInternal(status) {
    if (!status) return 'pending';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('medical') || statusLower.includes('review') || statusLower.includes('pending')) {
        return 'medicalReview';
    }
    if (statusLower.includes('approved')) {
        return 'approved';
    }
    if (statusLower.includes('preparing') || statusLower.includes('process')) {
        return 'preparing';
    }
    if (statusLower.includes('ship')) {
        return 'shipped';
    }
    if (statusLower.includes('deliver')) {
        return 'delivered';
    }
    
    return 'pending';
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
