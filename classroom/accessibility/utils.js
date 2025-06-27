function notifyA11y(message, type = 'info') {
    const notifier = document.getElementById('a11y-notifier');
    
    if (!notifier) {
        console.warn('a11y-notifier element not found');
        return;
    }
    
    notifier.textContent = '';
    
    switch(type) {
        case 'error':
            notifier.setAttribute('aria-live', 'assertive');
            notifier.setAttribute('role', 'alert');
            break;
        case 'warning':
            notifier.setAttribute('aria-live', 'assertive');
            notifier.setAttribute('role', 'status');
            break;
        case 'success':
            notifier.setAttribute('aria-live', 'polite');
            notifier.setAttribute('role', 'status');
            break;
        default:
            notifier.setAttribute('aria-live', 'polite');
            notifier.setAttribute('role', 'status');
    }
    
    setTimeout(() => {
        notifier.textContent = message;
    }, 100);
}

function notifyA11yAuto(message, status = 'info') {
    const errorKeywords = ['erreur', 'error', 'échec', 'failed', 'impossible', 'problème'];
    const warningKeywords = ['attention', 'warning', 'avertissement'];
    const successKeywords = ['succès', 'success', 'créé', 'created', 'sauvegardé', 'saved'];
    
    let messageType = status;
    const lowerMessage = message.toLowerCase();
    
    if (errorKeywords.some(keyword => lowerMessage.includes(keyword))) {
        messageType = 'error';
    } else if (warningKeywords.some(keyword => lowerMessage.includes(keyword))) {
        messageType = 'warning';
    } else if (successKeywords.some(keyword => lowerMessage.includes(keyword))) {
        messageType = 'success';
    }
    
    notifyA11y(message, messageType);
}

/* function addKeyboardSupport() {
    const dashboardElementIds = [
        'dashboard-classes-teacher',
        'dashboard-activities-teacher', 
        'realtime-calculator',
        'dashboard-profil-teacher',
        'realtime-calculator-student',
        'dashboard-help',
        'dashboard-profil',
        'dashboard-activities',
        'dashboard-manager-apps',
        'dashboard-profil-manager',
        'dashboard-manager-groups',
        'dashboard-manager-statistics',
        'dashboard-manager-gar-subscriptions'
    ];
    
    dashboardElementIds.forEach(elementId => {
        const elements = document.querySelectorAll(`#${elementId}`);
        
        elements.forEach(element => {
            // Remove any existing keydown listeners to avoid duplicates
            element.removeEventListener('keydown', handleKeydownForDashboardElements);
            
            // Add the keydown event listener
            element.addEventListener('keydown', handleKeydownForDashboardElements);
        });
    });
}

// Handler for keydown events on dashboard elements
function handleKeydownForDashboardElements(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        
        // Get the onclick attribute and execute it
        const onclickAttr = this.getAttribute('onclick');
        if (onclickAttr) {
            try {
                // Execute the onclick function
                eval(onclickAttr);
            } catch (error) {
                console.error(`Error executing onclick for ${this.id}:`, error);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', addKeyboardSupport);

const observer = new MutationObserver(function(mutations) {
    const dashboardElementIds = [
        'dashboard-classes-teacher',
        'dashboard-activities-teacher', 
        'realtime-calculator',
        'dashboard-profil-teacher',
        'realtime-calculator-student',
        'dashboard-help',
        'dashboard-profil',
        'dashboard-activities',
        'dashboard-manager-apps',
        'dashboard-profil-manager',
        'dashboard-manager-groups',
        'dashboard-manager-statistics',
        'dashboard-manager-gar-subscriptions'
    ];
    
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Check if the node itself or any of its children has one of our target IDs
                    const hasTargetElement = dashboardElementIds.some(id => 
                        node.id === id || node.querySelector(`#${id}`)
                    );

                    if (hasTargetElement) {
                        addKeyboardSupport();
                    }
                }
            });
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});
 */