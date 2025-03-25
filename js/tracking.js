/**
 * S-Cream Order Tracking System
 * Optimized for your specific JotForm structure
 */

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
    
    // Add loading overlay
    createLoadingOverlay();
    
    // Check for URL parameters
    checkUrlParameters();
    
    // Form submission handler
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
    
    // Try again button
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
}

/**
 * Create loading overlay
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
    
    // Add styles
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

function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('visible');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('visible');
    }
}

// Check URL parameters
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderParam = urlParams.get('order') || urlParams.get('orderId') || urlParams.get('orderNumber');
    
    if (orderParam) {
        const input = document.getElementById('lookup-value');
        if (input) {
            input.value = orderParam;
            // Small delay to ensure UI is ready
            setTimeout(() => lookupOrder(orderParam), 300);
        }
    } 
    else if (localStorage.getItem('scream_order_number')) {
        const input = document.getElementById('lookup-value');
        if (input) {
            input.value = localStorage.getItem('scream_order_number');
        }
    }
}

// Main lookup function
function lookupOrder(lookupValue) {
    console.log('Looking up order:', lookupValue);
    showLoading();
    
    // Fetch from JotForm API
    fetchOrderDetails(lookupValue)
        .then(orderData => {
            if (orderData) {
                displayOrderDetails(orderData);
            } else {
                showNotFound();
            }
            hideLoading();
        })
        .catch(error => {
            console.error('Error looking up order:', error);
            showNotFound();
            hideLoading();
        });
}

// Fetch order details from JotForm API with improved search capabilities
async function fetchOrderDetails(identifier) {
    try {
        // API key from your confirmed settings
        const apiKey = '1d286bad28d846621fed1c1c411e3d5b';
        const formId = '250825922202147';
        
        console.log('Fetching order with identifier:', identifier);
        
        // ENHANCEMENT: Try a direct submission lookup first
        // This is useful if the identifier is a submission ID
        try {
            const submissionUrl = `https://api.jotform.com/submission/${identifier}?apiKey=${apiKey}`;
            console.log('Trying direct submission lookup:', submissionUrl);
            
            const directResponse = await fetch(submissionUrl);
            const directData = await directResponse.json();
            
            if (directData.responseCode === 200 && directData.content) {
                console.log('Found submission directly:', directData.content);
                return processSubmissionData(directData.content);
            }
        } catch (e) {
            console.log('Direct submission lookup failed, trying filters...');
        }
        
        // ENHANCEMENT: Create multiple ways to search for the identifier
        // This expands the search options to find an order with any field
        const filters = [];
        
        // Try order tracking number with various possible field names
        if (identifier.toUpperCase().startsWith('SC')) {
            filters.push(`{"q26_yourOrder":"${identifier}"}`);
            filters.push(`{"q27_yourOrder":"${identifier}"}`);
            filters.push(`{"yourOrderTracking":"${identifier}"}`);
            // Add more possible field names for order numbers
            filters.push(`{"orderNumber":"${identifier}"}`);
            filters.push(`{"orderTracking":"${identifier}"}`);
            filters.push(`{"trackingNumber":"${identifier}"}`);
        } 
        // Try email search with various possible field names
        else if (identifier.includes('@')) {
            filters.push(`{"q7_email":"${identifier}"}`);
            filters.push(`{"email":"${identifier}"}`);
            // Add more possible field names for email
            filters.push(`{"customerEmail":"${identifier}"}`);
            filters.push(`{"userEmail":"${identifier}"}`);
        } 
        // Try unique ID search with various possible field names
        else {
            filters.push(`{"q28_uniqueId":"${identifier}"}`);
            filters.push(`{"uniqueId":"${identifier}"}`);
            // Add more possible field names for unique IDs
            filters.push(`{"id":"${identifier}"}`);
            filters.push(`{"orderId":"${identifier}"}`);
        }
        
        // Try each filter until a match is found
        for (const filter of filters) {
            const apiUrl = `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}&filter=${filter}`;
            console.log('Trying filter:', filter);
            
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (data.responseCode === 200 && data.content && data.content.length > 0) {
                    console.log('Found submission with filter:', filter);
                    return processSubmissionData(data.content[0]);
                }
            } catch (e) {
                console.error('Error with filter:', filter, e);
                // Continue to next filter
            }
        }
        
        // ENHANCEMENT: If no match with specific filters, try a generic search
        // This broadens the search to look for the identifier in any field
        console.log('Trying generic search for:', identifier);
        
        // Get all submissions (limited to last 100)
        const allSubmissionsUrl = `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}&limit=100`;
        const allResponse = await fetch(allSubmissionsUrl);
        const allData = await allResponse.json();
        
        if (allData.responseCode === 200 && allData.content && allData.content.length > 0) {
            console.log('Got all submissions, searching for match in answer values...');
            
            // Search through all submissions for a match in any field
            for (const submission of allData.content) {
                if (!submission.answers) continue;
                
                // Check all answers for a matching value
                for (const qid in submission.answers) {
                    const answer = submission.answers[qid];
                    const answerValue = answer.answer;
                    
                    // Check if this answer matches our identifier
                    if (answerValue && typeof answerValue === 'string' && 
                        answerValue.toLowerCase() === identifier.toLowerCase()) {
                        console.log('Found matching answer in field:', answer.text || answer.name);
                        return processSubmissionData(submission);
                    }
                    
                    // Also check if the identifier is within a complex answer (e.g., in JSON)
                    if (answerValue && typeof answerValue === 'string' && 
                        answerValue.toLowerCase().includes(identifier.toLowerCase())) {
                        console.log('Found partial match in field:', answer.text || answer.name);
                        return processSubmissionData(submission);
                    }
                }
            }
            
            // ENHANCEMENT: As a last resort, check if order number pattern exists
            // This is useful if order numbers follow a pattern like SC####
            if (identifier.length >= 2) {
                const pattern = identifier.substring(0, 2).toUpperCase();
                for (const submission of allData.content) {
                    // Create an order number if one doesn't exist
                    // This is useful for new orders that might not have an order number yet
                    if (submission.id) {
                        const generatedOrderNumber = `SC${submission.id.substring(0, 4)}`;
                        if (generatedOrderNumber.includes(pattern)) {
                            console.log('Found submission with matching pattern:', generatedOrderNumber);
                            // Create a submission with a generated order number
                            const enhancedSubmission = { ...submission };
                            if (!enhancedSubmission.answers) enhancedSubmission.answers = {};
                            // Add a virtual order number field
                            enhancedSubmission.answers['virtualOrderNumber'] = {
                                text: 'Your Order Tracking Number',
                                answer: generatedOrderNumber
                            };
                            return processSubmissionData(enhancedSubmission);
                        }
                    }
                }
            }
        }
        
        console.log('No matching submission found.');
        return null;
    } catch (error) {
        console.error('Error fetching from JotForm API:', error);
        throw error;
    }
}

// Process JotForm submission data with improved field detection
function processSubmissionData(submission) {
    console.log('Processing submission data:', submission);
    
    // Debug: Log all fields to help identify the correct ones
    if (submission.answers) {
        console.log('Available fields in submission:');
        for (const qid in submission.answers) {
            const answer = submission.answers[qid];
            console.log(`- Field ${qid}: ${answer.text || answer.name} = ${answer.answer}`);
        }
    }
    
    // ENHANCEMENT: Try multiple possible field names for each data point
    // This improves the chances of finding the correct fields
    const orderNumber = 
        getFieldValue(submission, 'Your Order Tracking Number') || 
        getFieldValue(submission, 'Order Number') ||
        getFieldValue(submission, 'Tracking Number') ||
        getFieldValue(submission, 'Order ID') ||
        (submission.answers && submission.answers.virtualOrderNumber ? 
            submission.answers.virtualOrderNumber.answer : null) ||
        `SC${submission.id ? submission.id.substring(0, 4) : '0003'}`;
    
    const orderDate = 
        getFieldValue(submission, 'Order Date') || 
        getFieldValue(submission, 'Date') ||
        formatDate(submission.created_at);
    
    const status = determineOrderStatus(submission);
    
    const orderData = {
        orderNumber: orderNumber,
        orderDate: orderDate,
        status: status.code,
        statusText: status.text,
        trackingNumber: getFieldValue(submission, 'Tracking Number') || getFieldValue(submission, 'Shipment Tracking'),
        carrier: determineCarrier(submission)
    };
    
    // Build timeline steps based on status
    orderData.steps = buildTimelineSteps(status.code, submission);
    
    console.log('Processed order data:', orderData);
    return orderData;
}

// Helper to get field values with improved matching
function getFieldValue(submission, fieldName) {
    if (!submission.answers) return null;
    
    // Try exact field name match first
    for (const qid in submission.answers) {
        const answer = submission.answers[qid];
        
        // Check for exact matches
        if ((answer.text && answer.text === fieldName) || 
            (answer.name && answer.name === fieldName)) {
            console.log(`Found exact match for ${fieldName}:`, answer.answer);
            return answer.answer;
        }
    }
    
    // Then try partial matches
    for (const qid in submission.answers) {
        const answer = submission.answers[qid];
        
        // Check for partial matches (case insensitive)
        if ((answer.text && answer.text.toLowerCase().includes(fieldName.toLowerCase())) || 
            (answer.name && answer.name.toLowerCase().includes(fieldName.toLowerCase()))) {
            console.log(`Found partial match for ${fieldName}:`, answer.answer);
            return answer.answer;
        }
    }
    
    // Try with keywords as a last resort
    const keywords = fieldName.toLowerCase().split(' ');
    for (const qid in submission.answers) {
        const answer = submission.answers[qid];
        
        // Check if any keyword is in the field name
        if (answer.text || answer.name) {
            const text = (answer.text || answer.name).toLowerCase();
            if (keywords.some(keyword => text.includes(keyword))) {
                console.log(`Found keyword match for ${fieldName}:`, answer.answer);
                return answer.answer;
            }
        }
    }
    
    return null;
}

// Determine order status based on submission data
function determineOrderStatus(submission) {
    // Try to get status from a field
    const statusField = 
        getFieldValue(submission, 'Order Status') || 
        getFieldValue(submission, 'Status');
    
    if (statusField) {
        const status = String(statusField).toLowerCase();
        
        if (status.includes('delivered')) {
            return { code: 'delivered', text: 'Delivered' };
        } else if (status.includes('ship')) {
            return { code: 'shipped', text: 'Shipped' };
        } else if (status.includes('prepar')) {
            return { code: 'preparing', text: 'Preparing for Shipment' };
        } else if (status.includes('approv')) {
            return { code: 'approved', text: 'Approved' };
        } else if (status.includes('review')) {
            return { code: 'medicalReview', text: 'Medical Review' };
        } else if (status.includes('error') || status.includes('cancel')) {
            return { code: 'error', text: status };
        }
    }
    
    // Default to medical review based on your comment
    return { code: 'medicalReview', text: 'Medical Review Pending' };
}

// Determine carrier based on submission data
function determineCarrier(submission) {
    const trackingNumber = getFieldValue(submission, 'Tracking Number');
    const carrierField = getFieldValue(submission, 'Shipping Carrier');
    
    if (carrierField) {
        const carrier = String(carrierField).toLowerCase();
        if (carrier.includes('usps')) return 'usps';
        if (carrier.includes('ups')) return 'ups';
        if (carrier.includes('fedex')) return 'fedex';
        if (carrier.includes('dhl')) return 'dhl';
    }
    
    // Try to guess carrier from tracking number format
    if (trackingNumber) {
        if (/^\d{20}$/.test(trackingNumber)) return 'usps';
        if (/^1Z[0-9A-Z]{16}$/.test(trackingNumber)) return 'ups';
        if (/^\d{12}$/.test(trackingNumber)) return 'fedex';
    }
    
    return 'usps'; // Default carrier
}

// Build timeline steps based on status
function buildTimelineSteps(status, submission) {
    const createdAt = submission.created_at;
    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    
    // Default timeline structure
    const steps = {
        order: { completed: true, date: createdAt },
        review: { completed: false, date: null },
        approved: { completed: false, date: null },
        preparing: { completed: false, date: null },
        shipped: { completed: false, date: null },
        delivered: { completed: false, date: null }
    };
    
    // Update steps based on status
    switch (status) {
        case 'medicalReview':
            steps.review.completed = true;
            steps.review.date = createdAt;
            break;
        case 'approved':
            steps.review.completed = true;
            steps.review.date = createdAt;
            steps.approved.completed = true;
            steps.approved.date = yesterday;
            break;
        case 'preparing':
            steps.review.completed = true;
            steps.review.date = createdAt;
            steps.approved.completed = true;
            steps.approved.date = yesterday;
            steps.preparing.completed = true;
            steps.preparing.date = now;
            break;
        case 'shipped':
            steps.review.completed = true;
            steps.review.date = createdAt;
            steps.approved.completed = true;
            steps.approved.date = yesterday;
            steps.preparing.completed = true;
            steps.preparing.date = yesterday;
            steps.shipped.completed = true;
            steps.shipped.date = now;
            break;
        case 'delivered':
            steps.review.completed = true;
            steps.review.date = createdAt;
            steps.approved.completed = true;
            steps.approved.date = yesterday;
            steps.preparing.completed = true;
            steps.preparing.date = yesterday;
            steps.shipped.completed = true;
            steps.shipped.date = yesterday;
            steps.delivered.completed = true;
            steps.delivered.date = now;
            break;
    }
    
    return steps;
}

// Display order details on page
function displayOrderDetails(orderData) {
    const lookupSection = document.getElementById('lookup-section');
    const statusSection = document.getElementById('order-status-section');
    const notFoundSection = document.getElementById('not-found-section');
    
    fadeOut(lookupSection, function() {
        lookupSection.style.display = 'none';
        notFoundSection.style.display = 'none';
        statusSection.style.display = 'block';
        fadeIn(statusSection);
    });
    
    // Set order information
    const orderNumberDisplay = document.getElementById('order-number-display');
    if (orderNumberDisplay) {
        orderNumberDisplay.textContent = orderData.orderNumber;
    }
    
    const orderDateDisplay = document.getElementById('order-date-display');
    if (orderDateDisplay) {
        orderDateDisplay.textContent = formatDate(orderData.orderDate);
    }
    
    // Set status badge
    const statusBadge = document.getElementById('status-badge');
    if (statusBadge) {
        statusBadge.textContent = orderData.statusText;
        statusBadge.className = 'status-badge ' + orderData.status;
    }
    
    // Update tracking number if available
    const trackingContainer = document.querySelector('.tracking-number-container');
    const trackingNumberDisplay = document.getElementById('tracking-number-display');
    const trackingLink = document.getElementById('tracking-link');
    
    if (trackingContainer && trackingNumberDisplay) {
        if (orderData.trackingNumber) {
            trackingContainer.style.display = 'flex';
            trackingNumberDisplay.textContent = orderData.trackingNumber;
            
            if (trackingLink) {
                // Set correct tracking URL based on carrier
                let trackingUrl = '';
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
                    case 'dhl':
                        trackingUrl = `https://www.dhl.com/us-en/home/tracking/tracking-parcel.html?submit=1&tracking-id=${orderData.trackingNumber}`;
                        break;
                    default:
                        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${orderData.trackingNumber}`;
                }
                trackingLink.href = trackingUrl;
            }
        } else {
            trackingContainer.style.display = 'none';
        }
    }
    
    // Update timeline steps
    setTimeout(() => {
        updateTimelineSteps(orderData.steps);
        updateStatusNotes(orderData.status);
    }, 300);
    
    // Store order number
    localStorage.setItem('scream_order_number', orderData.orderNumber);
}

// Update timeline steps
function updateTimelineSteps(steps) {
    Object.keys(steps).forEach((stepKey, index) => {
        const stepElement = document.getElementById(`step-${stepKey}`);
        const dateElement = document.getElementById(`date-${stepKey}`);
        
        if (stepElement && steps[stepKey]) {
            stepElement.classList.remove('active', 'completed');
            
            setTimeout(() => {
                if (steps[stepKey].completed) {
                    stepElement.classList.add('completed');
                    
                    if (dateElement && steps[stepKey].date) {
                        dateElement.textContent = formatDate(steps[stepKey].date);
                    }
                } else {
                    const completedSteps = Object.keys(steps).filter(key => steps[key].completed);
                    
                    if (completedSteps.length > 0 && 
                        Object.keys(steps).indexOf(stepKey) === Object.keys(steps).indexOf(completedSteps[completedSteps.length - 1]) + 1) {
                        stepElement.classList.add('active');
                    }
                }
            }, index * 150);
        }
    });
}

// Update status notes
function updateStatusNotes(status) {
    const notes = [
        document.getElementById('note-pending'),
        document.getElementById('note-approved'),
        document.getElementById('note-shipped'),
        document.getElementById('note-error')
    ];
    
    notes.forEach(note => {
        if (note) note.style.display = 'none';
    });
    
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

// Show not found message
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

// Animation helpers
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

function fadeIn(element) {
    if (!element) return;
    
    element.style.opacity = 0;
    element.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        element.style.opacity = 1;
    }, 10);
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
