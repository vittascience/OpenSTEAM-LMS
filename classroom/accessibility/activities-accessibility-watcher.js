export function initAccessibilityWatcher() {
    startBlankTextsObservation();
}


/**
 * Activity "Glisser-déposer" makes blank container tabbable.
 * But when there is a text in the container, the container AND the text are tabbable.
 * This function makes the container tabbable when there is no text in the container.
 */
function startBlankTextsObservation() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const target = mutation.target;

            if (
                target.tagName === 'SPAN' &&
                target.classList.contains('droppable-items') &&
                target.classList.contains('dropzone-preview')
            ) {
                const hasParagraph = target.querySelector('p') !== null;
                const expectedTabindex = hasParagraph ? '-1' : '0';

                if (target.getAttribute('tabindex') !== expectedTabindex) {
                    target.setAttribute('tabindex', expectedTabindex);
                }
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    });
}