/**
 * Lets a teacher ask to become admin of their group when it has none; the support accepts or declines from the mail.
 * Offered at the end of the onboarding tour and in the teacher settings modal.
 */
const GroupAdminRequest = (function () {
    let adminlessGroup = null;

    async function post(action, data = {}) {
        const response = await fetch(`/routing/Routing.php?controller=groupadmin&action=${action}`, {
            method: 'POST',
            body: new URLSearchParams(data)
        });
        return response.json();
    }

    async function refreshStatus() {
        const status = await post('get_group_admin_status');
        adminlessGroup = status.canRequest ? status.group : null;
        return adminlessGroup;
    }

    function description(group) {
        return i18next.t('groupAdminRequest.description', { group: group.name, interpolation: { escapeValue: false } });
    }

    async function accept() {
        if (!adminlessGroup) return;
        let response;
        try {
            response = await post('request_group_admin', { group_id: adminlessGroup.id });
        } catch (e) {
            response = { success: false };
        }
        if (!response.success) {
            displayNotification('#notif-div', 'groupAdminRequest.error', 'error');
            return;
        }

        adminlessGroup = null;
        document.getElementById('group-admin-request-option').style.display = 'none';
        displayNotification('#notif-div', 'groupAdminRequest.success', 'success');
    }

    Onboarding.beforeStart(async () => {
        const group = await refreshStatus();
        if (!group) return;

        Onboarding.registerStep({
            id: 'group-admin-step',
            classes: 'text-center',
            text: () => {
                const text = document.createElement('p');
                text.className = 'text-dark';
                text.textContent = description(group);
                return `<p class="text-secondary fs-5 fw-semibold">${i18next.t('groupAdminRequest.title')}</p>${text.outerHTML}`;
            },
            buttons: (tour) => [
                { text: i18next.t('groupAdminRequest.decline'), classes: 'btn btn-outline-primary', action: tour.complete },
                { text: i18next.t('groupAdminRequest.accept'), classes: 'btn btn-secondary', action: () => { tour.complete(); accept(); } }
            ]
        }, { after: 'done-step' });
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('settings-teacher')?.addEventListener('click', async () => {
            const option = document.getElementById('group-admin-request-option');
            const group = await refreshStatus();
            option.style.display = group ? '' : 'none';
            if (group) option.querySelector('.group-admin-request-description').textContent = description(group);
        });
    });

    return { accept };
})();
