export function handleSetupAccessibilityDebug() {
    // initCleanLog();
}

const ringExcludedSelectors = ['.ace_text-input'];

function initCleanLog() {
    document.addEventListener('focusin', (e) => {
        const el = e.target;
        currentFocusedEl = el;

        //console.log('[Accessibility Debug] Focused element:', el);
        el.style.outline = 'none';
        el.style.boxShadow = 'none';

        if (isExcludedElement(el)) {
            ring.style.display = 'none';
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            return;
        }

        updateFocusRing(true);
        ring.style.display = 'block';

        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(trackChanges);
        }
    });

    document.addEventListener('focusout', () => {
        currentFocusedEl = null;
        ring.style.display = 'none';
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    });

    window.addEventListener('scroll', updateFocusRing, true);
    window.addEventListener('resize', updateFocusRing);

    const ring = document.createElement('div');
    ring.id = 'focus-ring';
    document.body.appendChild(ring);

    Object.assign(ring.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '999999',
        display: 'none',
        border: 'solid red 5px',
        transition: 'top 0.1s, left 0.1s, width 0.1s, height 0.1s',
    });

    let currentFocusedEl = null;
    let lastRect = {};
    let animationFrameId = null;

    function getRectProps(el) {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderTopLeftRadius: computed.borderTopLeftRadius,
            borderTopRightRadius: computed.borderTopRightRadius,
            borderBottomRightRadius: computed.borderBottomRightRadius,
            borderBottomLeftRadius: computed.borderBottomLeftRadius,
        };
    }

    function hasRectChanged(newRect, oldRect) {
        return Object.keys(newRect).some((key) => newRect[key] !== oldRect[key]);
    }

    function isExcludedElement(el) {
        return ringExcludedSelectors.some((selector) => el.matches(selector));
    }

    function updateFocusRing(force = false) {
        if (!currentFocusedEl) return;

        const newRect = getRectProps(currentFocusedEl);

        if (force || hasRectChanged(newRect, lastRect)) {
            ring.style.top = newRect.top + 'px';
            ring.style.left = newRect.left + 'px';
            ring.style.width = newRect.width + 'px';
            ring.style.height = newRect.height + 'px';

            ring.style.borderTopLeftRadius = newRect.borderTopLeftRadius;
            ring.style.borderTopRightRadius = newRect.borderTopRightRadius;
            ring.style.borderBottomRightRadius = newRect.borderBottomRightRadius;
            ring.style.borderBottomLeftRadius = newRect.borderBottomLeftRadius;

            lastRect = newRect;
        }
    }

    function trackChanges() {
        updateFocusRing();
        animationFrameId = requestAnimationFrame(trackChanges);
    }
}