document.addEventListener("DOMContentLoaded", function () {
    const MAX_RETRIES = 25;
    const RETRY_INTERVAL = 200;

    function initValidation(retries = 0) {
        const checkMail = window.checkMailInstance;
        if (!checkMail) {
            if (retries < MAX_RETRIES) {
                return setTimeout(() => initValidation(retries + 1), RETRY_INTERVAL);
            } else {
                console.error("CheckMail non disponible.");
                return;
            }
        }

        const subjectInput = document.getElementById("contact-subject-input");
        const messageInput = document.getElementById("contact-message-input");
        const submitButton = document.querySelector("input[type='submit']");

        // Create or find error messages
        let subjectError = document.getElementById("subject-error");
        if (!subjectError) {
            subjectError = document.createElement("p");
            subjectError.id = "subject-error";
            subjectError.className = "text-danger";
            subjectError.setAttribute("role", "alert");
            subjectError.setAttribute("hidden", "true");
            subjectInput.insertAdjacentElement("afterend", subjectError);
        }

        const messageError = document.getElementById("message-error");

        // Constraint recovery
        const minSubject = checkMail.getMinSubjectLength();
        const maxSubject = checkMail.getMaxSubjectLength();
        const minMessage = checkMail.getMinMessageLength();
        const maxMessage = checkMail.getMaxMessageLength();

        if (messageError) {
            messageError.textContent = `Votre message doit contenir entre ${minMessage} et ${maxMessage} caractères.`;
        }

        if (subjectError) {
            subjectError.textContent = `L’objet doit contenir entre ${minSubject} et ${maxSubject} caractères.`;
        }


        function validateForm() {
            const subjectLength = subjectInput.value.trim().length;
            const messageLength = messageInput.value.trim().length;

            const subjectValid = subjectLength >= minSubject && subjectLength <= maxSubject;
            const messageValid = messageLength >= minMessage && messageLength <= maxMessage;

            // Object validation
            if (!subjectValid) {
                subjectInput.classList.add("is-invalid");
                subjectInput.setAttribute("aria-invalid", "true");
                subjectError.removeAttribute("hidden");
            } else {
                subjectInput.classList.remove("is-invalid");
                subjectInput.removeAttribute("aria-invalid");
                subjectError.setAttribute("hidden", "true");
            }

            // Message validation
            if (!messageValid) {
                messageInput.classList.add("is-invalid");
                messageInput.setAttribute("aria-invalid", "true");
                messageError.removeAttribute("hidden");
            } else {
                messageInput.classList.remove("is-invalid");
                messageInput.removeAttribute("aria-invalid");
                messageError.setAttribute("hidden", "true");
            }

            // Send button
            const formIsValid = subjectValid && messageValid;
            submitButton.disabled = !formIsValid;
            submitButton.setAttribute("aria-disabled", String(!formIsValid));
            submitButton.style.cursor = formIsValid ? "pointer" : "not-allowed";
        }

        subjectInput.addEventListener("input", validateForm);
        messageInput.addEventListener("input", validateForm);
    }

    initValidation();
});
