/**
 * Teacher onboarding tour, shown once per browser when the instance enables it (VS_ONBOARDING_ENABLED).
 * Plugins customise it before it starts: Onboarding.registerStep / removeStep / beforeStart.
 * Steps are Shepherd step options, except `text` and `buttons` which are functions called at start time.
 */
const Onboarding = (function () {
    const SEEN_KEY = 'hasSeenTour';
    const steps = [];
    const beforeStartHooks = [];

    function registerStep(step, position = {}) {
        removeStep(step.id);
        const index = steps.findIndex(s => s.id === (position.before || position.after));
        if (index === -1) {
            steps.push(step);
        } else {
            steps.splice(position.after ? index + 1 : index, 0, step);
        }
    }

    function removeStep(id) {
        const index = steps.findIndex(s => s.id === id);
        if (index !== -1) steps.splice(index, 1);
    }

    function beforeStart(hook) {
        beforeStartHooks.push(hook);
    }

    function buttonLabel(key) {
        return `${i18next.t(key)} <i class="fas fa-chevron-right"></i>`;
    }

    function defaultButtons(tour) {
        return [
            { text: buttonLabel('onboarding.help'), classes: 'btn btn-outline-primary', action: tour.cancel },
            { text: buttonLabel('onboarding.next'), classes: 'btn btn-secondary', action: tour.next }
        ];
    }

    function centeredStep(id, titleKey, descriptionKey, buttonKey, isLast) {
        return {
            id,
            classes: 'text-center',
            text: (user) => `<p class="text-secondary fst-italic fs-5 fw-semibold">${i18next.t(titleKey, { firstname: user.firstname })}</p>
                <p class="text-dark">${i18next.t(descriptionKey)}</p>`,
            buttons: (tour) => [{
                text: buttonLabel(buttonKey),
                classes: 'btn btn-secondary mx-auto',
                action: isLast ? tour.complete : tour.next
            }]
        };
    }

    function listStep(id, key, element) {
        return {
            id,
            attachTo: { element, on: 'bottom' },
            text: () => {
                const items = Object.values(i18next.t(`${key}.list`, { returnObjects: true }))
                    .map(item => `<li>${item}</li>`)
                    .join('');
                return `<span class="text-dark">${i18next.t(`${key}.description`)}</span><ol class="text-dark">${items}</ol>`;
            }
        };
    }

    registerStep(centeredStep('welcome-step', 'onboarding.welcome.hello', 'onboarding.welcome.description', 'onboarding.begin', false));
    registerStep(listStep('activities-step', 'onboarding.activities', '#dashboard-activities-teacher'));
    registerStep(listStep('classes-step', 'onboarding.classes', '#dashboard-classes-teacher'));
    registerStep(listStep('profile-step', 'onboarding.profile', '#dashboard-profil-teacher'));
    registerStep(centeredStep('done-step', 'onboarding.done.title', 'onboarding.done.description', 'onboarding.finish', true));

    function waitFor(condition) {
        return new Promise(resolve => {
            (function check() {
                condition() ? resolve() : setTimeout(check, 100);
            })();
        });
    }

    function hasSeenTour() {
        try {
            return localStorage.getItem(SEEN_KEY) === 'true';
        } catch (e) {
            return false;
        }
    }

    function markTourAsSeen() {
        try {
            localStorage.setItem(SEEN_KEY, 'true');
        } catch (e) {
            // storage unavailable: the tour will show again next time
        }
    }

    function isEligible(user) {
        return Boolean(user.isRegular) && !user.isFromGar && !user.isGarTest;
    }

    async function start() {
        await waitFor(() => typeof i18next !== 'undefined' && i18next.isInitialized);
        await waitFor(() => UserManager.getUser());
        const user = UserManager.getUser();
        if (!isEligible(user)) return;

        for (const hook of beforeStartHooks) {
            await hook(user);
        }

        const tour = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: { classes: 'shepherd-theme-arrows', scrollTo: true }
        });
        steps.forEach(step => tour.addStep({
            ...step,
            text: step.text(user),
            buttons: step.buttons ? step.buttons(tour) : defaultButtons(tour)
        }));

        tour.start();
        markTourAsSeen();
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (typeof onboardingEnabled === 'undefined' || !onboardingEnabled || hasSeenTour()) return;
        start();
    });

    return { registerStep, removeStep, beforeStart };
})();
