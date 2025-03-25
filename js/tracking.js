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
        document.getElementById('lookup-value').value = orderParam;
        lookupOrder(orderParam);
    } 
    else if (localStorage.getItem('scream_order_number')) {
        document.getElementById('lookup-value').value = localStorage.getItem('scream_order_number');
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

// Fetch order details from JotForm API
async function fetchOrderDetails(identifier) {
    try {
        // CORRECTED API key from your screenshot
        const apiKey = '1d286bad28d846621fed1c1c411e3d5b';
        const formId = '250825922202147';
        
        console.log('Using API Key:', apiKey);
        
        // Create multiple ways to search for the identifier
        const filters = [];
        
        // Based on your form's field names
        if (identifier.toUpperCase().startsWith('SC')) {
            // Try as order tracking number
            filters.push(`{"q26_yourOrder":"${identifier}"}`);
            filters.push(`{"q27_yourOrder":"${identifier}"}`);
            
            // Try exact match by value
            filters.push(`{"yourOrderTracking":"${identifier}"}`);
        } else if (identifier.includes('@')) {
            // Try as email
            filters.push(`{"q7_email":"${identifier}"}`);
            filters.push(`{"email":"${identifier}"}`);
        } else {
            // Try as unique ID
            filters.push(`{"q28_uniqueId":"${identifier}"}`);
            filters.push(`{"uniqueId":"${identifier}"}`);
        }
        
        // Try each filter until we find a match
        for (const filter of filters) {
            // API URL with filter
            const apiUrl = `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}&filter=${filter}`;
            console.log('Trying API URL:', apiUrl);
            
            // Fetch from JotForm API
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            console.log('JotForm API response:', data);
            
            // If we found a match, process and return
            if (data.responseCode === 200 && data.content && data.content.length > 0) {
                const submission = data.content[0];
                console.log('Found submission:', submission);
                return processSubmissionData(submission);
            }
        }
        
        // Try a broad search (all submissions)
        console.log('Trying broad search...');
        const allSubmissionsUrl = `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}`;
        const allResponse = await fetch(allSubmissionsUrl);
        const allData = await allResponse.json();
        
        if (allData.responseCode === 200 && allData.content && allData.content.length > 0) {
            console.log('Got all submissions, looking for matching order...');
            
            // Look through all submissions for a match
            for (const submission of allData.content) {
                console.log('Checking submission:', submission);
                
                // Check for matches in answers
                if (submission.answers) {
                    let found = false;
                    
                    // Look through all answers for the identifier
                    for (const qid in submission.answers) {
                        const answer = submission.answers[qid];
                        
                        // Check if answer contains our identifier
                        if (answer.answer && String(answer.answer).toUpperCase() === identifier.toUpperCase()) {
                            console.log('Found matching answer:', answer);
                            found = true;
                            break;
                        }
                    }
                    
                    if (found) {
                        return processSubmissionData(submission);
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

// Process JotForm submission data
function processSubmissionData(submission) {
    console.log('Processing submission data:', submission);
    
    // Extract answers based on your JotForm field structure
    const orderData = {
        orderNumber: getFieldValue(submission, 'Your Order Tracking Number') || 'SC0003',
        orderDate: getFieldValue(submission, 'Order Date') || formatDate(submission.created_at),
        status: 'medicalReview', // Default based on your screenshot
        statusText: getFieldValue(submission, 'Order Status') || 'Medical Review Pending',
        trackingNumber: getFieldValue(submission, 'Tracking Number'),
        carrier: 'usps' // Default carrier
    };
    
    // Build timeline steps
    orderData.steps = {
        order: { completed: true, date: submission.created_at },
        review: { completed: true, date: submission.created_at },
        approved: { completed: false, date: null },
        preparing: { completed: false, date: null },
        shipped: { completed: false, date: null },
        delivered: { completed: false, date: null }
    };
    
    return orderData;
}

// Helper to get field values from JotForm submission
function getFieldValue(submission, fieldName) {
    if (!submission.answers) return null;
    
    // Look through all answers
    for (const qid in submission.answers) {
        const answer = submission.answers[qid];
        
        // Check field name
        if (answer.text && answer.text.includes(fieldName)) {
            console.log(`Found field ${fieldName}:`, answer.answer);
            return answer.answer;
        }
        
        // Also check name attribute
        if (answer.name && answer.name.includes(fieldName)) {
            console.log(`Found field ${fieldName} by name:`, answer.answer);
            return answer.answer;
        }
    }
    
    return null;
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
        
        if (trackingLink) {
            trackingLink.href = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${orderData.trackingNumber}`;
        }
    } else {
        trackingContainer.style.display = 'none';
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
