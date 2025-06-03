function makeWysiBBEditorAccessible(editorContainer) {
    const wysibbEditor = editorContainer.querySelector('.wysibb-text-editor');
    const textarea = editorContainer.querySelector('textarea');
    const toolbar = editorContainer.querySelector('.wysibb-toolbar');

    if (!wysibbEditor || wysibbEditor.getAttribute('data-a11y-setup') === 'true') return;

    // Get the label text from parent content div
    const contentDiv = editorContainer.closest('.content');
    const labelText = contentDiv?.querySelector('label')?.textContent || '';

    // Editable zone configuration
    wysibbEditor.setAttribute('role', 'textbox');
    wysibbEditor.setAttribute('aria-multiline', 'true');
    wysibbEditor.setAttribute('tabindex', '-1');
    wysibbEditor.setAttribute('contenteditable', 'true');
    wysibbEditor.setAttribute('data-a11y-setup', 'true');
    if (textarea?.id) wysibbEditor.setAttribute('aria-labelledby', `${textarea.id}_label`);

    disableToolbarNavigation(toolbar);

    // Live region
    let liveRegion = document.getElementById('wysibb-live-region');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'wysibb-live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveRegion);
    }

    // Invisible keyboard input button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = `Éditer le contenu (appuyez sur Entrée). ${labelText}. Zone d'édition activée. Appuyez sur Alt + F10 pour accéder à la barre d'outils. Appuyez sur Échap pour quitter.`;
    toggleButton.className = 'sr-only';
    toggleButton.setAttribute('aria-controls', textarea?.id || '');
    
    toggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            wysibbEditor.setAttribute('tabindex', '0');
            wysibbEditor.focus();
            liveRegionAnnounce(`Éditer le contenu (appuyez sur Entrée). ${labelText}. Zone d'édition activée. Appuyez sur Alt + F10 pour accéder à la barre d'outils. Appuyez sur Échap pour quitter.`);
        }
    });
    wysibbEditor.parentNode.insertBefore(toggleButton, wysibbEditor);

    // Keyboard management in editing area
    wysibbEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            wysibbEditor.setAttribute('tabindex', '-1');
            toggleButton.focus();
            liveRegionAnnounce("Vous avez quitté la zone d'édition.");
        }else if (e.code === 'F10' && e.altKey){
            e.preventDefault();
            enableToolbarNavigation(toolbar, wysibbEditor, liveRegion);
        }
    });

    toggleButton.addEventListener('click', () => {
      wysibbEditor.setAttribute('tabindex', '0');
      wysibbEditor.focus();
      liveRegionAnnounce(`Éditer le contenu (appuyez sur Entrée). ${labelText}. Zone d'édition activée. Appuyez sur Alt + F10 pour accéder à la barre d'outils. Appuyez sur Échap pour quitter.`);
    });

    // If you exit without Esc (click, tab...), the keyboard input is locked again.
    wysibbEditor.addEventListener('blur', () => {
        setTimeout(() => {
            if (document.activeElement !== wysibbEditor && !toolbar.contains(document.activeElement)) {
                wysibbEditor.setAttribute('tabindex', '-1');
            }
        }, 10);
    });
}

function disableToolbarNavigation(toolbar) {
    if (!toolbar) return;
    toolbar.querySelectorAll('.wysibb-toolbar-btn').forEach(btn => {
        btn.setAttribute('tabindex', '-1');
    });
}

function enableToolbarNavigation(toolbar, returnFocusEl, liveRegion) {
    if (!toolbar) return;
    const buttons = toolbar.querySelectorAll('.wysibb-toolbar-btn');
    buttons.forEach((btn, index) => {
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('role', 'button');
        const tooltip = btn.querySelector('.btn-tooltip');
        if (tooltip) {
            btn.setAttribute('aria-label', tooltip.textContent.trim());
        }

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = buttons[index + 1];
                if (next) next.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = buttons[index - 1];
                if (prev) prev.focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                disableToolbarNavigation(toolbar);
                returnFocusEl.focus();
                liveRegionAnnounce("Retour dans la zone d'édition.");
            }
        }, { once: true });
    });

    if (buttons.length) {
        buttons[0].focus();
        liveRegionAnnounce("Barre d'outils activée. Utilisez les flèches gauche/droite pour naviguer. Appuyez sur Échap pour revenir.");
    }
}

function liveRegionAnnounce(msg) {
    const region = document.getElementById('wysibb-live-region');
    if (region) {
        region.textContent = '';
        setTimeout(() => region.textContent = msg, 30);
    }
}

// Initialize all editors
document.querySelectorAll('.wysibb').forEach(makeWysiBBEditorAccessible);

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList.contains('wysibb')) {
                makeWysiBBEditorAccessible(node);
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });
