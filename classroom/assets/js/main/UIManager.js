var UIManager = (function () {
    /**
     * This object contains all the UI functionalities.
     * @private
     */
    var UI = {};

    UI.modalsHtml = {};

    UI.modalStack = [];

    // Modals
    UI.appendAllModals = function (htmlNode) {
        for (let idModal in UI.modalsHtml) {
            $(UI.modalsHtml[idModal]).appendTo(htmlNode);
        }
    };
    UI.closeAllModals = function () {
        for (let idModal in UI.modalsHtml) {
            $(idForJquery(idModal)).hide();
        }
        UI.modalStack = [];
    };
    UI.showModal = function (idModal) {
        $(idForJquery(idModal)).show();
        $(idForJquery(idModal)).localize()
        UI.modalStack.push(idModal);
    };
    UI.closeModal = function (idModal = null) {
        if (idModal === null) {
            var currentModal = UI.modalStack.pop();
            $(idForJquery(currentModal)).hide();
        } else {
            $(idForJquery(idModal)).hide();
            UI.modalStack.pop();
        }
    };

    // Binders
    UI.unbindAllEvent = function (elementId) {
        $(idForJquery(elementId)).unbind();
    };
    UI.bindClick = function (elementId, action) {
        UI.unbindAllEvent(elementId);
        $(idForJquery(elementId)).click(action);
    };

    // Messages
    UI.cleanMessage = function (messageDivId) {
        $(idForJquery(messageDivId)).attr("class", "");
        $(idForJquery(messageDivId)).html("");
    };
    UI.cleanMessages = function (messageDivIds) {
        messageDivIds.forEach(messageDivId => {
            $(idForJquery(messageDivId)).attr("class", "");
            $(idForJquery(messageDivId)).html("");
        });
    };
    UI.successMessage = function (messageDivId, message) {
        UI.cleanMessage(messageDivId);
        $(idForJquery(messageDivId)).attr("class", "alert alert-success");
        $(idForJquery(messageDivId)).html(message);
    };
    UI.errorMessage = function (messageDivId, message) {
        UI.cleanMessage(messageDivId);
        $(idForJquery(messageDivId)).attr("class", "alert alert-danger");
        $(idForJquery(messageDivId)).html(message);
    };

    UI.init = function () {
        return new Promise(function (resolve) {
            UI.appendAllModals("body");
            $(document).on('keydown', function (e) {
                if (e.keyCode === 27)
                    UI.closeModal();
            });
            resolve("loaded");
        });
    };
    return {
        /**
         * Init UIManager and return a resolved promise.
         *
         * @returns {Promise}
         */
        init: function () {
            return UI.init();
        },
        showModal: function (idModal) {
            UI.showModal(idModal);
        },
        closeModal: function (idModal) {
            UI.closeModal(idModal);
        },
        /**
         * Close all the modals currently opened
         *
         */
        closeAllModals: function () {
            UI.closeAllModals();
        },
        /**
         * Unbinds all the events and bind a click event with its action
         * passed as parameter
         *
         * @param {string} elementId
         * @param {function} action
         */
        bindClick: function (elementId, action) {
            UI.bindClick(elementId, action);
        },
        resetMessage: function (elementId) {
            UI.cleanMessage(elementId);
        },
        resetMessages: function (elementsIds) {
            UI.cleanMessages(elementsIds);
        },
        showSuccessMessage: function (elementId, message) {
            UI.successMessage(elementId, message);
        },
        showErrorMessage: function (elementId, message) {
            UI.errorMessage(elementId, message);
        }
    };

}());