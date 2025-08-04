function makeWysiBBEditorAccessible(editorContainer) {
    const wysibbEditor = editorContainer.querySelector('.wysibb-text-editor');
    const textarea = editorContainer.querySelector('textarea');
    const toolbar = editorContainer.querySelector('.wysibb-toolbar');

    if (!wysibbEditor || wysibbEditor.getAttribute('data-a11y-setup') === 'true') return;

    const contentDiv = editorContainer.closest('.content');
    let labelText = '';
    
    const associatedLabel = contentDiv?.querySelector('label');
    const parentHeading = editorContainer.closest('[role="dialog"], .modal')?.querySelector('h1, h2, h3, h4, h5, h6');
    const nearbyText = editorContainer.previousElementSibling?.textContent || 
                      editorContainer.parentElement?.querySelector('label, .label-text, [data-i18n]')?.textContent;

    if (associatedLabel) {
        labelText = associatedLabel.textContent.trim();
    } else if (parentHeading) {
        labelText = parentHeading.textContent.trim();
    } else if (nearbyText) {
        labelText = nearbyText.trim();
    } else if (textarea?.id) {
        // Generate a descriptive label based on the textarea ID
        const idParts = textarea.id.split('-');
        labelText = idParts.join(' ').replace(/([A-Z])/g, ' $1').trim();
    } else {
        labelText = 'Éditeur de texte';
    }

    wysibbEditor.setAttribute('role', 'textbox');
    wysibbEditor.setAttribute('aria-multiline', 'true');
    wysibbEditor.setAttribute('tabindex', '-1');
    wysibbEditor.setAttribute('contenteditable', 'true');
    wysibbEditor.setAttribute('data-a11y-setup', 'true');
    
    if (textarea?.id) {
        const labelId = `${textarea.id}_label`;
        const labelElement = document.getElementById(labelId);
        
        if (labelElement && labelElement.textContent.trim()) {
            wysibbEditor.setAttribute('aria-labelledby', labelId);
        } else {
            wysibbEditor.removeAttribute('aria-labelledby');
            wysibbEditor.setAttribute('aria-label', labelText || 'Éditeur de texte enrichi');
        }
    } else {
        wysibbEditor.setAttribute('aria-label', labelText || 'Éditeur de texte enrichi');
    }

    disableToolbarNavigation(toolbar);
    
    fixToolbarImages(toolbar);

    let liveRegion = document.getElementById('wysibb-live-region');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'wysibb-live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveRegion);
    }

    // Keyboard input button (visible when focused)
    const toggleButton = document.createElement('button');
    const finalLabelText = wysibbEditor.getAttribute('aria-label') || labelText || 'Éditeur de texte';
    toggleButton.textContent = `Éditer le contenu (appuyez sur Entrée). Appuyez sur Alt + F10 pour accéder à la barre d'outils. Appuyez sur Échap pour quitter.`;
    toggleButton.className = 'wysibb-toggle-button';
    toggleButton.setAttribute('aria-controls', textarea?.id || '');
    toggleButton.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 123, 255, 0.1);
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 10;
        font-size: 14px;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 10px;
    `;
    
    let isEditorActive = false;
    
    toggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            isEditorActive = true;
            toggleButton.style.display = 'none';
            wysibbEditor.setAttribute('tabindex', '0');
            wysibbEditor.focus();
            liveRegionAnnounce(`Éditer le contenu (appuyez sur Entrée). Appuyez sur Alt + F10 pour accéder à la barre d'outils. Appuyez sur Échap pour quitter.`);
        }
    });

    toggleButton.addEventListener('focus', () => {
        // Only show if editor is not active and focus is via keyboard
        if (!isEditorActive) {
            toggleButton.style.opacity = '1';
            toggleButton.style.border = '2px solid #007bff';
            toggleButton.style.background = 'rgba(0, 123, 255, 0.5)';
        }
    });

    toggleButton.addEventListener('blur', () => {
        if (!isEditorActive) {
            toggleButton.style.opacity = '0';
            toggleButton.style.border = '2px solid transparent';
            toggleButton.style.background = 'rgba(0, 123, 255, 0.1)';
        }
    });

    // Track mouse clicks to hide the button
    toggleButton.addEventListener('mousedown', () => {
        if (!isEditorActive) {
            toggleButton.style.opacity = '0';
        }
    });

    wysibbEditor.parentNode.insertBefore(toggleButton, wysibbEditor);

    wysibbEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            isEditorActive = false;
            toggleButton.style.display = 'block';
            wysibbEditor.setAttribute('tabindex', '-1');
            toggleButton.focus();
            liveRegionAnnounce("Vous avez quitté la zone d'édition.");
        } else if (e.key === 'F10' && e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            enableToolbarNavigation(toolbar, wysibbEditor, liveRegion);
        }
    });

    toggleButton.addEventListener('click', () => {
      isEditorActive = true;
      toggleButton.style.display = 'none';
      wysibbEditor.setAttribute('tabindex', '0');
      wysibbEditor.focus();
      liveRegionAnnounce(`Éditer le contenu (appuyez sur Entrée). ${finalLabelText}. Zone d'édition activée. Appuyez sur Alt + F10 pour accéder à la barre d'outils. Appuyez sur Échap pour quitter.`);
    });

    // If you exit without Esc (click, tab...), the keyboard input is locked again.
    wysibbEditor.addEventListener('blur', () => {
        setTimeout(() => {
            if (document.activeElement !== wysibbEditor && 
                !toolbar.contains(document.activeElement) && 
                document.activeElement !== toggleButton) {
                // Same effect as pressing Escape
                isEditorActive = false;
                toggleButton.style.display = 'block';
                toggleButton.style.opacity = '0';
                toggleButton.style.border = '2px solid transparent';
                toggleButton.style.background = 'rgba(0, 123, 255, 0.1)';
                wysibbEditor.setAttribute('tabindex', '-1');
                liveRegionAnnounce("Vous avez quitté la zone d'édition.");
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
                e.stopPropagation();
                btn.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                e.stopPropagation();
                const next = buttons[index + 1];
                if (next) next.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                e.stopPropagation();
                const prev = buttons[index - 1];
                if (prev) prev.focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
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

function fixExistingWysiBBLabels() {
    const editorsWithBrokenLabels = document.querySelectorAll('.wysibb-text-editor[aria-labelledby]');
    
    editorsWithBrokenLabels.forEach(editor => {
        const labelledById = editor.getAttribute('aria-labelledby');
        if (labelledById) {
            const labelElement = document.getElementById(labelledById);
            
            if (!labelElement || !labelElement.textContent.trim()) {
                editor.removeAttribute('aria-labelledby');
                
                const container = editor.closest('.wysibb, .content, .form-group');
                let labelText = '';
                
                const nearbyLabel = container?.querySelector('label');
                const parentHeading = editor.closest('[role="dialog"], .modal')?.querySelector('h1, h2, h3, h4, h5, h6');
                
                if (nearbyLabel) {
                    labelText = nearbyLabel.textContent.trim();
                } else if (parentHeading) {
                    labelText = parentHeading.textContent.trim();
                } else {
                    const idParts = labelledById.replace('_label', '').split('-');
                    labelText = idParts.join(' ').replace(/([A-Z])/g, ' $1').trim() || 'Éditeur de texte enrichi';
                }
                
                editor.setAttribute('aria-label', labelText);
            }
        }
        
        const toolbar = editor.closest('.wysibb')?.querySelector('.wysibb-toolbar');
        if (toolbar) {
            fixToolbarImages(toolbar);
        }
    });
    
    document.querySelectorAll('.wysibb-toolbar').forEach(fixToolbarImages);
}

document.querySelectorAll('.wysibb').forEach(makeWysiBBEditorAccessible);

fixExistingWysiBBLabels();

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                if (node.classList.contains('wysibb')) {
                    makeWysiBBEditorAccessible(node);
                }
                
                const wysiBBEditors = node.querySelectorAll ? node.querySelectorAll('.wysibb') : [];
                wysiBBEditors.forEach(makeWysiBBEditorAccessible);
                
                setTimeout(() => {
                    const newEditorsWithBrokenLabels = (node.querySelectorAll ? node.querySelectorAll('.wysibb-text-editor[aria-labelledby]') : []);
                    newEditorsWithBrokenLabels.forEach(editor => {
                        const labelledById = editor.getAttribute('aria-labelledby');
                        if (labelledById && !document.getElementById(labelledById)) {
                            const container = editor.closest('.wysibb, .content, .form-group');
                            let labelText = '';
                            
                            const nearbyLabel = container?.querySelector('label');
                            if (nearbyLabel) {
                                labelText = nearbyLabel.textContent.trim();
                            } else {
                                const idParts = labelledById.replace('_label', '').split('-');
                                labelText = idParts.join(' ').replace(/([A-Z])/g, ' $1').trim() || 'Éditeur de texte enrichi';
                            }
                            
                            editor.removeAttribute('aria-labelledby');
                            editor.setAttribute('aria-label', labelText);
                        }
                    });
                    
                    const newToolbars = (node.querySelectorAll ? node.querySelectorAll('.wysibb-toolbar') : []);
                    newToolbars.forEach(fixToolbarImages);
                }, 100);
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });

function fixToolbarImages(toolbar) {
    if (!toolbar) return;
    
    const imageAltTexts = {
        'SigleVittascience.svg': 'VittaScience',
        'SigleVittascience.png': 'VittaScience',
        
        'cabri_logo.png': 'Cabri',
        
        'peertube_logo.svg': 'PeerTube',
        
        'SigleGenially.png': 'Genially',
        'SigleGenially.svg': 'Genially'
    };
    
    const toolbarImages = toolbar.querySelectorAll('.wysibb-toolbar-btn img');
    
    toolbarImages.forEach(img => {
        if (img.getAttribute('alt') !== null) return;
        
        const src = img.getAttribute('src') || '';
        const filename = src.split('/').pop();
        if (imageAltTexts[filename]) {
            img.setAttribute('alt', imageAltTexts[filename]);
        } else {
            const button = img.closest('.wysibb-toolbar-btn');
            let altText = '';
            
            if (button?.classList.contains('wbb-vittaiframe')) {
                altText = 'VittaScience';
            } else if (button?.classList.contains('wbb-cabriiframe')) {
                altText = 'Cabri';
            } else if (button?.classList.contains('wbb-peertube')) {
                altText = 'PeerTube';
            } else if (button?.classList.contains('wbb-genialyiframe')) {
                altText = 'Genially';
            } else {
                const buttonClasses = Array.from(button?.classList || []);
                const relevantClass = buttonClasses.find(cls => cls.startsWith('wbb-'));
                if (relevantClass) {
                    altText = relevantClass.replace('wbb-', '').replace('iframe', '');
                    altText = altText.charAt(0).toUpperCase() + altText.slice(1);
                } else {
                    altText = 'Outil d\'édition';
                }
            }
            
            img.setAttribute('alt', altText);
        }
    });
}
