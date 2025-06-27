var ModalsListModals = [];
var ModalsOpenedModals = [];
var ModalsListElement = [];
/**
 * 
 * @param {HTMLElement | String} modalID Element to bind the modal onClick
 * @param {object} options
 * @param {string} options.selector Element selector (#|.) to bind event click
 * @param {object} options.optionalClass Custom class you want to add to the element of the modal
 * @param {object} options.header Header content
 * @param {string} options.header.icon Classname 
 * @param {string} options.header.title Title
 * @param {HTMLElement | String} options.content Main content
 * @param {HTMLElement | String} options.footer Footer content  
 */
function Modal(modalID = "a", options = {}) {
    if (modalID != "a") {
        let myself = this;

        // Error handling
        if (typeof modalID !== 'string' || modalID === '') {
            throw 'Options name must be defined.';
        }
        if (this.contains(modalID)) {
            throw `This modal name [${modalID}] is already used.`;
        }
        // Assign param to local
        if (options.selector instanceof HTMLElement) {
            ModalsListElement.push(element);
        } else {
            try {
                ModalsListElement = document.querySelectorAll(options.selector);
            } catch (error) {
                // console.error('Cannot find selector for element: ' + modalID);
            }
        }
        this.options = Object.assign({}, {
            header: {},
            content: '',
            footer: ''
        }, options);

        this.options.header = Object.assign({}, {
            icon: 'fas fa-folder-open',
            title: 'modals.standard.default.title'
        }, options.header);

        this.options.optionalClass = Object.assign({}, {}, options.optionalClass);

        var modalClass = "";
        if (this.options.optionalClass.hasOwnProperty("modal")) {
            modalClass = ` ${this.options.optionalClass.modal}`;
        }

        var contentClass = "";
        if (this.options.optionalClass.hasOwnProperty("content")) {
            contentClass = ` ${this.options.optionalClass.content}`;
        }

        var footerClass = "";
        if (this.options.optionalClass.hasOwnProperty("footer")) {
            footerClass = ` ${this.options.optionalClass.footer}`;
        }

        let modal = document.createElement('div');
        modal.setAttribute('id', modalID);
        modal.setAttribute('class', `vitta-modal${modalClass}`);
        modal.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            e.preventDefault();
            myself.closeModal(modalID);
          }
        });

        // Header creation
        let header = document.createElement('div');
        header.setAttribute('class', 'vitta-modal-header');
        let title = document.createElement('span');
        title.setAttribute('class', 'vitta-modal-title');
        let icon = document.createElement('i');
        icon.setAttribute('class', this.options.header.icon);
        let title_content = document.createElement('span');
        title_content.setAttribute('data-i18n', this.options.header.title);
        title_content.innerText = i18next.t(`${this.options.header.title}`);

        title.appendChild(icon);
        title.appendChild(title_content);

        header.appendChild(title);

        let exit_btn = document.createElement('div');
        exit_btn.setAttribute('class', 'vitta-modal-exit-btn vitta-button btn');
        exit_btn.setAttribute('type', 'button');
        exit_btn.setAttribute('role', 'button');
        exit_btn.setAttribute('tabindex', '0');
        exit_btn.setAttribute('data-i18n', '[title]modals.standard.default.exit;[aria-label]manager.buttons.close');
        exit_btn.setAttribute('data-bs-toggle', 'tooltip');
        exit_btn.setAttribute('data-bs-placement', 'top');
        exit_btn.addEventListener('click', function () {
            myself.closeModal(modal.id);
        });
        exit_btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                myself.closeModal(modal.id);
            }
        });
        let exit_icon = document.createElement('i');
        exit_icon.setAttribute('class', 'fa fa-times-circle');

        exit_btn.appendChild(exit_icon);

        header.appendChild(exit_btn);

        // Content creation
        let content = document.createElement('div');
        content.setAttribute('class', 'vitta-modal-content');
        let msg_div = document.createElement('div');
        msg_div.setAttribute('class', 'modal-message');
        content.appendChild(msg_div);
        let custom_content = document.createElement('div');
        custom_content.setAttribute('class', `modal-content-div${contentClass}`)
        if (this.options.content instanceof HTMLElement)
            custom_content.appendChild(this.options.content);
        else
            custom_content.innerHTML += this.options.content;
        content.appendChild(custom_content);

        // Footer creation
        let footer = document.createElement('div');
        if (this.options.footer !== '') {
            footer.setAttribute('class', 'vitta-modal-footer');
            let footer_div = document.createElement('div');
            footer_div.setAttribute('class', `modal-footer-div${contentClass}`);

            if (this.options.footer instanceof HTMLElement)
                footer_div.appendChild(this.options.footer);
            else
                footer_div.innerHTML = this.options.footer;
            footer.appendChild(footer_div);
        }

        // Assemble modal elements
        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(footer);

        // For translation (need jquery also)
        // Assign event show modal to element.s
        ModalsListElement.forEach((element) => {
            element.addEventListener('click', function () {
                myself.openModal(modalID);
            });
        })

        // Save modal name 
        this.add(modalID);
        return modal;
    }
}

/**
 * 
 * @param {string} modal ID of the modal element 
 */
Modal.prototype.openModal = function (modal) {
    this.trapFocusInModal(document.getElementById(modal));
    $(`#${modal}`).localize();
    this.closeAllModal();
    var zIndex = ModalsOpenedModals.length + 1000
    if (ModalsListModals.includes(modal)) {
        const modalElement = document.getElementById(modal);
        modalElement.setAttribute('style', `display: block; z-index: ${zIndex}`);
        modalElement.setAttribute('tabindex', '-1');
        modalElement.focus();
        ModalsOpenedModals.push(modal);
    } else {
        throw 'Cannot open this modal, modal not included';
    }
}

/**
 * 
 * @param {string} modal ID of the modal element
 * Close the modal and reset his message
 */
Modal.prototype.closeModal = function (modal) {
    const modalElement = document.getElementById(modal);
    
    if (ModalsOpenedModals.includes(modal)) {
        this.resetMessage(modal);
        this.removeFocusTrap(modalElement);
        modalElement.removeAttribute('style');
        var index = ModalsOpenedModals.indexOf(modal);
        ModalsOpenedModals.splice(index, 1);
    }
}

/**
 * Close all modal registered
 */
Modal.prototype.closeAllModal = function () {
    ModalsOpenedModals.forEach((e) => {
        this.closeModal(e);
    });
}

/**
 * Close lastest modal opened
 */
Modal.prototype.closeLatestModal = function () {
    $('.vitta-modal').hide()
}
/**
 * 
 * @param {string} modal ID of the modal element
 * (Register modal) Add modal to the list
 */
Modal.prototype.add = function (modal) {
    ModalsListModals.push(modal);
}
/**
 * 
 * @param {string} modal 
 * @returns {boolean}
 * Return if modal is registered
 */
Modal.prototype.contains = function (modal) {
    return ModalsListModals.includes(modal);
}

/**
 * 
 * @param {string} modal ID of the modal element
 * Reset message in a specific modal
 */
Modal.prototype.resetMessage = function (modal) {
    if (this.contains(modal)) {
        let modalElem = document.getElementById(modal);
        let msg = modalElem.getElementsByClassName('modal-message')[0];
        msg.innerHTML = "";
        msg.setAttribute('class', 'modal-message');
        msg.removeAttribute('style');
    }
}

/**
 * 
 * @param {*} ID of the modal element
 * @param {function} cb Callback function to bind on exit button
 */
Modal.prototype.clickOnExit = function (modal, cb) {
    if (this.contains(modal)) {
        let modalElem = document.getElementById(modal);
        let exitBtn = modalElem.querySelector('.vitta-modal-exit-btn');
        exitBtn.addEventListener('click', cb);
    }
}
/**
 * 
 * @param {string} modal Id of the modal you want to apply the message
 * @param {string} msg Your message i18next code
 * @param {string} type 
 */
Modal.prototype.setMessage = function (modal, msg, type = 'info') {
    this.resetMessage(modal);
    let modalElem = document.getElementById(modal);
    let msgElem = modalElem.getElementsByClassName('modal-message')[0];
    msgElem.innerHTML = msg;
    msgElem.setAttribute('style', 'margin-bottom: 0.25rem');
    switch (type) {
        case 'info':
            msgElem.classList.add('alert', 'alert-info');
            break;
        case 'success':
            msgElem.classList.add('alert', 'alert-success');
            break;
        case 'warning':
            msgElem.classList.add('alert', 'alert-warning');
            break;
        case 'error':
            msgElem.classList.add('alert', 'alert-danger');
            break;
        default:
            msgElem.classList.add('alert', 'alert-info');
            break;
    }

}
/**
 * 
 * @param {string} elem 
 * @param {string} event 
 */
Modal.prototype.resetEventOnElement = function (elem, event = '') {
    let element = document.getElementById(elem);
    element.removeEventListener(event);
}

/**
 * 
 * @param {array} listElem 
 * @param {string} event
 */
Modal.prototype.resetEventOnElements = function (listElem = [], event = '') {
    listElem.forEach((e) => {
        Modal.resetEventOnElement(e, event);
    });
}

/**
 * 
 * @param {string} elem
 * Shortcut to remove click event
 */
Modal.prototype.resetEventClick = function (elem) {
    this.resetEventOnElement(elem, 'click');
}

/**
 * 
 * @param {string} elem 
 * @param {*} event 
 * @param {*} cb 
 */
Modal.prototype.bindEvent = function (elem, event, cb) {
    this.resetEventClick(elem);
    let element = document.getElementById(elem);
    element.addEventListener(event, cb);
}

/**
 * 
 * @param {string} modal ID of the modal element
 * @param {string} element Element to bind the event close modal
 */
Modal.prototype.bindEventExitOnElement = function (modal, element) {
    document.getElementById(element).addEventListener('click', function () {
        Modal.closeModal(modal);
    });
}

/**
 * 
 * @param {string} modal ID of the modal element 
 * @param {array} listElem List of elements to apply event
 */
Modal.prototype.bindEventExitOnElements = function (modal, listElem) {
    listElem.forEach((element) => {
        this.bindEventExitOnElement(modal, element);
    })
}

/**
 * 
 * @param {string} modal ID of the modal elements 
 * @param {string} msg Code i18next referenced to the correct string
 * Shortcut for info message
 */
Modal.prototype.showInfo = function (modal, msg) {
    this.setMessage(modal, msg);
}

/**
 * 
 * @param {string} modal ID of the modal elements 
 * @param {string} msg Code i18next referenced to the correct string
 * Shortcut for success message
 */
Modal.prototype.showSuccess = function (modal, msg) {
    this.setMessage(modal, msg, "success");
    this.openModal(modal);
}

/**
 * 
 * @param {string} modal ID of the modal elements 
 * @param {string} msg Code i18next referenced to the correct string
 * Shortcut for warning message
 */
Modal.prototype.showWarning = function (modal, msg) {
    this.setMessage(modal, msg, "warning");
    this.openModal(modal);
}

/**
 * 
 * @param {string} modal ID of the modal elements 
 * @param {string} msg Code i18next referenced to the correct string
 * Shortcut for error message
 */
Modal.prototype.showError = function (modal, msg) {
    this.setMessage(modal, msg, "error");
    this.openModal(modal);
}

Modal.prototype.setWarningModal = function (content = '', footer = '') {
    let warningModal = document.getElementById('warning-modal');
    let contentModal = warningModal.getElementsByClassName('modal-content-div');
    let footerModal = warningModal.getElementsByClassName('modal-footer-div');

    contentModal.setAttribute('data-i18n', content);
    footerModal.setAttribute('data-i18n', footer);

    $(warningModal).localize();

    Modal.openModal('warning-modal');
}

Modal.prototype.trapFocusInModal = async function(modalElement) {
    const focusableSelectors = [
        'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])',
        'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed',
        '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
    ];

    await wait(100);

    const exitButton = modalElement.querySelector('.vitta-modal-exit-btn');
    const allFocusable = modalElement.querySelectorAll(focusableSelectors.join(', '));

    const focusableElements = Array.from(allFocusable).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none'
            && style.visibility !== 'hidden'
            && el.offsetParent !== null;
    });

    if (focusableElements.length === 0) return;

    if (exitButton) {
        focusableElements.unshift(exitButton);
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
        if (e.key !== 'Tab') return;

        const activeElement = document.activeElement;
        
        if (e.shiftKey) {
            // Backward navigation (Shift+Tab)
            if (activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Forward navigation (Tab)
            if (activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    const handleFocusOut = (e) => {
        // Check if the focus has left the modal
        if (!modalElement.contains(e.relatedTarget)) {
            e.preventDefault();
            firstElement.focus();
        }
    };

    modalElement.addEventListener('keydown', handleKeyDown);
    modalElement.addEventListener('focusout', handleFocusOut);

    // Store listeners for later deletion
    modalElement._focusTrapHandlers = {
        keydown: handleKeyDown,
        focusout: handleFocusOut
    };

    firstElement.focus();
};

Modal.prototype.removeFocusTrap = function(modalElement) {
    if (modalElement._focusTrapHandlers) {
        modalElement.removeEventListener('keydown', modalElement._focusTrapHandlers.keydown);
        modalElement.removeEventListener('focusout', modalElement._focusTrapHandlers.focusout);
        delete modalElement._focusTrapHandlers;
    }
};

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function() {
    
    function checkAndUpdateBackdrop() {
        const visibleModals = $('[id$="-modal"]:visible, .vitta-modal:visible, .modal:visible').length;
        let backdrop = document.getElementById('modal-backdrop');
        
        if (visibleModals > 0) {
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'modal-backdrop';
                backdrop.setAttribute('role', 'presentation');
                backdrop.setAttribute('aria-hidden', 'true');
                backdrop.setAttribute('tabindex', '-1');
                
                backdrop.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    const visibleModal = document.querySelector('[id$="-modal"]:not([style*="display: none"]), .vitta-modal:not([style*="display: none"]), .modal:not([style*="display: none"])');
                    if (visibleModal) {
                        visibleModal.focus();
                    }
                });
                
                document.body.appendChild(backdrop);
            }
            backdrop.style.display = 'block';
            //console.log('Backdrop shown - visible modals:', visibleModals);
        } else {
            if (backdrop) {
                backdrop.style.display = 'none';
                //console.log('Backdrop hidden - no visible modals');
            }
        }
    }
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.id && target.id.endsWith('-modal')) {
                    //console.log('Modal style changed:', target.id, 'display:', window.getComputedStyle(target).display);
                    checkAndUpdateBackdrop();
                }
            }
        });
    });
    
    function startObserving() {
        document.querySelectorAll('[id$="-modal"], .vitta-modal, .modal').forEach(function(modal) {
            observer.observe(modal, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
    }
    
    startObserving();
    
    const bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if ((node.id && node.id.endsWith('-modal')) || 
                        node.classList.contains('vitta-modal') || 
                        node.classList.contains('modal')) {
                        observer.observe(node, {
                            attributes: true,
                            attributeFilter: ['style', 'class']
                        });
                        //console.log('Started observing new modal:', node.id);
                    }
                }
            });
        });
    });
    
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

/*    class ErrorModal extends Modal {


constructor(element, options = {}) {

    if (options.content === "") {
        throw "Cannot have an empty content";
    }

    let content = document.createElement('div');
    if (options.content instanceof HTMLElement)
        content.appendChild(options.content);
    else
        content.innerHTML = options.content;

    options = Object.assign({}, {
        header: {
            icon: 'fa fa-exclamation-triangle',
            title: 'modals.error.default.title',
        },
        content: content
    }, options);

    super(element, options, {
        modal: 'vitta-modal-error'
    });
}

}*/