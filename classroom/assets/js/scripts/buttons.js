window.localStorage.classroomActivity = null
window.localStorage.autocorrect = false
let Activity = {
    autocorrection: false
}

function $_GET(param) {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );
    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

$(document).ready(function () {
    $(".dropdown-toggle").dropdown();
});
let ClassroomSettings = {
    willAutocorrect: false,
    lastPage: [],
    isEvaluation: false,
    studentCount: 0,
    activity: false,
    activityInWriting: false,
    status: null,
    classroom: null,
    project: null,
    firstLevel: ["classroom-dashboard-activities-panel-teacher",
        "classroom-dashboard-classes-panel-teacher",
        "classroom-dashboard-sandbox-panel",
        "classroom-dashboard-profil-panel-teacher",
        "classroom-dashboard-activities-panel",
        "classroom-dashboard-profil-panel",
        "classroom-dashboard-help-panel",
    ],
    teacherPanels: ['classroom-dashboard-activities-panel-teacher', 'classroom-dashboard-activities-panel-library-teacher', 'classroom-dashboard-new-activity-panel', 'classroom-dashboard-new-activity-panel2', 'classroom-dashboard-new-course-panel2', 'classroom-dashboard-new-activity-panel3', 'classroom-dashboard-form-classe-panel', 'classroom-dashboard-classes-panel-teacher', 'classroom-table-panel-teacher', 'classroom-dashboard-help-panel-teacher', 'classroom-dashboard-profil-panel-teacher', 'classroom-table-panel-teacher-code'

    ],
    studentPanels: ['classroom-dashboard-activities-panel', 'classroom-dashboard-activity-panel-success', 'classroom-dashboard-activity-panel-fail', 'classroom-dashboard-activity-panel-correcting', 'classroom-dashboard-help-panel', 'classroom-dashboard-profil-panel', ''

    ],
    mixPanels: ['classroom-dashboard-ide-panel', 'classroom-dashboard-sandbox-panel', 'classroom-dashboard-sandbox-creation', 'classroom-dashboard-activity-panel'],
    managerPanels: ['manager-dashboard-main', 'manager-apps-main', 'classroom-dashboard-profil-panel-manager'],
    groupAdminPanels: ['groupadmin-dashboard-users', 'groupadmin-apps-main', 'classroom-dashboard-profil-panel-groupadmin', 'groupadmin-dashboard-help'],
    treeStructure: {
        "classroom-dashboard-activities-panel-teacher": {
            "classroom-dashboard-new-activity-panel": {},
            "classroom-dashboard-new-activity-panel3": {},
            "classroom-dashboard-new-activity-panel2": {},
            "classroom-dashboard-activity-panel": {}
        },
        "classroom-dashboard-classes-panel-teacher": {
            "classroom-dashboard-form-classe-panel": {},
            "classroom-table-panel-teacher": {
                "classroom-table-panel-teacher-code": {}
            }
        },
        "classroom-dashboard-sandbox-panel": {
            "classroom-dashboard-sandbox-creation": {},
            "classroom-dashboard-ide-panel": {}
        },
        "classroom-dashboard-profil-panel-teacher": {
            "classroom-dashboard-account-panel-teacher": {},
            "classroom-dashboard-help-panel-teacher": {}
        },
        "classroom-dashboard-activities-panel": {
            "classroom-dashboard-activity-panel": {}
        },
        "classroom-dashboard-profil-panel": {},
        "classroom-dashboard-help-panel": {}
    }
}
let Breadcrumb = {
    "dashboard-activities": "classroom-dashboard-activities-panel",
    "dashboard-sandbox": "classroom-dashboard-sandbox-panel",
    "dashboard-help": "classroom-dashboard-help-panel",
    "dashboard-profil": "classroom-dashboard-profil-panel",
    "dashboard-activities-teacher": "classroom-dashboard-activities-panel-teacher",
    "dashboard-classes-teacher": "classroom-dashboard-classes-panel-teacher",
    "dashboard-sandbox-teacher": "classroom-dashboard-sandbox-panel",
    "dashboard-profil-teacher": "classroom-dashboard-profil-panel-teacher"
}

let displayPanel = new DisplayPanel()
let URLServer = window.location.origin
if (/[0-9a-z]{5}/.test($_GET('option'))) {
    ClassroomSettings.classroom = $_GET('option')
}
if (/WK[0-9]{1,9}/.test($_GET('option'))) {
    ClassroomSettings.activity = $_GET('option')
}
if (/AC[0-9]{1,9}/.test($_GET('option'))) {
    ClassroomSettings.exercise = $_GET('option')
}

if (/[0-9a-z]{13}/.test($_GET('option'))) {
    ClassroomSettings.project = $_GET('option')
}

$('.classroom-navbar-button').click(function () {
    try {
        if (!new ActivityTracker().getIsCheckingLti()) {
            pseudoModal.closeAllModal();
        }
    } catch (e) {
        console.error('pseudoModal is not defined')
    }
})
$('#return-last-panel').click(function () {
    ClassroomSettings.lastPage.shift()
    let lastPage = ClassroomSettings.lastPage.shift()
    navigatePanel(lastPage.history, lastPage.navbar)

})
$('body').on('click', '.breadcrumb-clickable', function (e) {
    if (e.target.getAttribute('data-nav') && e.target.getAttribute('data-panel')) {
        navigatePanel(e.target.getAttribute('data-panel'), e.target.getAttribute('data-nav'));
    }
})
$('body').on('mouseenter mouseleave', '.dropdown-act', function () {
    $(this).find('.span-act').toggle()
    $(this).find('.fa-cog').toggle()
})

// avoid modal closing when clicking on the modal
$(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
});

$('input[type=radio][name=isEval-activity-form]').change(function () {

    let id = Main.getClassroomManager()._idActivityOnAttribution,
        activity = "",
        contentParsed = "";

    if (id != 0) {
        activity = Main.getClassroomManager()._myTeacherActivities.filter(x => x.id == id)[0];
        contentParsed = JSON.parse(activity.content);
    }

    if (this.value == "true") {
        ClassroomSettings.isEvaluation = true
        if (id != 0) {
            if (contentParsed.hasOwnProperty('hint')) {
                if (contentParsed.hint != "" && contentParsed.hint != null) {
                    $("#hint-exist-disclaimer").show();
                }
            }
        }
    } else {
        $("#hint-exist-disclaimer").hide();
        ClassroomSettings.isEvaluation = false
    }
});

function showDisclaimerIfEval() {
    let activity = Main.getClassroomManager()._myTeacherActivities.filter(x => x.id == id)[0];
    let contentParsed = JSON.parse(activity.content);
    $("#hint-exist-disclaimer").hide();
    if (contentParsed.hasOwnProperty('hint')) {
        if (contentParsed.hint != "" && contentParsed.hint != null) {
            $("#hint-exist-disclaimer").show();
        }
    }
}

function autocorrectSwitch() {
    if (ClassroomSettings.willAutocorrect == true) {
        ClassroomSettings.willAutocorrect = false
    } else {
        ClassroomSettings.willAutocorrect = true
    }
}

$('body').on('click', '.fa-share', function () {
    ClassroomSettings.project = $(this).attr('data-link')
    if (UserManager.getUser().isRegular) {
        $('#list-student-share-modal').html('')
        Main.getClassroomManager()._myClasses.forEach(element => {
            $('#list-student-share-modal').append(classeList(element))
        })
        pseudoModal.openModal('share-project-modal')
    } else {
        if (!Main.getClassroomManager()._myTeachers) {
            Main.getClassroomManager().getTeachers(Main.getClassroomManager()).then(function () {
                Main.getClassroomManager().shareProject(ClassroomSettings.project, [Main.getClassroomManager()._myTeachers[0].user.id]).then(function () {
                    displayNotification('#notif-div', "classroom.notif.shareProjectTeacher", "success")

                })

            })
        } else {
            Main.getClassroomManager().shareProject(ClassroomSettings.project, [Main.getClassroomManager()._myTeachers[0].user.id]).then(function () {
                displayNotification('#notif-div', "classroom.notif.shareProjectTeacher", "success")

            })
        }
    }
})

/**
 * Go back to the current classroom from the code display panel
 */
function backToClassroomFromCode() {
    let link = ClassroomSettings.classroom;
    if (link) {
        navigatePanel('classroom-table-panel-teacher', 'dashboard-classroom-teacher', link);
    }
}

function askQuitLtiWithoutSaving() {
    return new Promise((resolve, reject) => {
        const modalElt = document.querySelector('#quit-lti-activity-modal'),
            modalCloseButtonElt = modalElt.querySelector('.vitta-modal-exit-btn'),
            modalYesButtonElt = document.querySelector('#quit-lti-yes-button'),
            modalNoButtonElt = document.querySelector('#quit-lti-no-button');
        pseudoModal.openModal('quit-lti-activity-modal');
        new ActivityTracker().setIsCheckingLti(true);
        const removeListeners = () => {
            modalYesButtonElt.removeEventListener('click', quitCallback);
            modalNoButtonElt.removeEventListener('click', stayCallback);
            modalCloseButtonElt.removeEventListener('click', stayCallback);
            pseudoModal.closeModal('quit-lti-activity-modal');
            new ActivityTracker().setIsCheckingLti(false);
        }
        const quitCallback = () => {
            resolve(true);
            removeListeners();
        };
        const stayCallback = () => {
            resolve(false);
            removeListeners();
        };
        modalYesButtonElt.addEventListener('click', quitCallback);
        modalNoButtonElt.addEventListener('click', stayCallback);
        modalCloseButtonElt.addEventListener('click', stayCallback);
    });
}


function askQuitSandboxWithoutSaving() {
    return new Promise((resolve, reject) => {
        const modalElt = document.querySelector('#quit-sandbox-activity-modal'),
            modalCloseButtonElt = modalElt.querySelector('.vitta-modal-exit-btn'),
            modalYesButtonElt = document.querySelector('#quit-sandbox-yes-button'),
            modalNoButtonElt = document.querySelector('#quit-sandbox-no-button');
        new Modal("a").openModal('quit-sandbox-activity-modal').openModal('quit-sandbox-activity-modal');

        const removeListeners = () => {
            modalYesButtonElt.removeEventListener('click', quitCallback);
            modalNoButtonElt.removeEventListener('click', stayCallback);
            modalCloseButtonElt.removeEventListener('click', stayCallback);
            new Modal("a").openModal('quit-sandbox-activity-modal').closeModal('quit-sandbox-activity-modal');
        }

        const quitCallback = () => {
            resolve(true);
            removeListeners();
        };

        const stayCallback = () => {
            resolve(false);
            removeListeners();
        };

        modalYesButtonElt.addEventListener('click', quitCallback);
        modalNoButtonElt.addEventListener('click', stayCallback);
        modalCloseButtonElt.addEventListener('click', stayCallback);
    });
}

/**
 * Navigate trough panels
 * @param {string} id - The destination panel
 * @param {string} idNav - The destination nav (the current "tab")
 * @param {string} option - The option (current classroom, activity etc.)
 * @param {string} interface - The interface (if the target is an interface or an activity using one)
 * @param {boolean} skipConfirm - If set to true, the exit confirmation prompt won't be displayed
 * @param {boolean} isOnpopstate - If set to true, the current navigation won't be saved in history (dedicated to onpopstate events)
 */
async function navigatePanel(id, idNav, option = "", interface = '', isOnpopstate = false) {
    notifyA11y("Navigation");
    document.title = $('#' + idNav).find('span').html() + ' - ' + location.hostname.charAt(0).toUpperCase() + location.hostname.slice(1);

    // If we are on the activity panel, in LTI context and the LTI resource isn't up to date
    const isActivityPanel = $_GET('panel') === 'classroom-dashboard-activity-panel',
        isNewActivityPanel = $_GET('panel') === 'classroom-dashboard-classes-new-activity';

    const isLtiActivity = isActivityPanel && Activity.isLti,
        isLtiNewActivity = isNewActivityPanel && Main.getClassroomManager().getActivityIsLti(),
        isStudentLtiActivity = UserManager.getUser().isRegular
            ? false
            : Activity.activity
                ? isActivityPanel && Activity.activity.isLti
                : false;

    const isLti = isLtiActivity || isLtiNewActivity || isStudentLtiActivity;

    if (isLti && !(new ActivityTracker().getIsUpToDate())) {
        const quitLti = await askQuitLtiWithoutSaving();
        if (!quitLti) return;
    }

    /*     
    const isIDEPanel = $_GET('panel') === 'classroom-dashboard-ide-panel';
    const isNavInludesInterface = $_GET('interface') !== undefined;

    if (isIDEPanel && isNavInludesInterface) {
        const quitSandbox = await askQuitSandboxWithoutSaving();
        if (!quitSandbox) return;
    } 
    */

    breadcrumbManager.navigatePanelBreadcrumb(idNav, id, $_GET('nav'), $_GET('panel'));
    // If there is any working activity tracker, send the tracking data and stop it
    if (typeof Main.activityTracker != 'undefined' && Main.activityTracker.getIsTracking()) {
        Main.activityTracker.saveTimePassed();
        Main.activityTracker.stopActivityTracker();
    }

    $('.classroom-navbar-button').removeClass("active");
    $('.dashboard-block').hide();
    $('#' + id).show();
    $('#' + idNav).addClass("active");

    // Accessibility: move focus inside the opened panel (only after first user interaction)
    if (window.__a11yAllowPanelFocus === true) {
        moveFocusIntoPanel(id);
    }

    // Always ensure focus for help panels goes to the contact section regardless of initial Tab state
    if (/-help-panel/.test(id)) {
        setTimeout(() => moveFocusIntoPanel(id), 150);
    }

    // If user navigates to the realtime calculator panel, initialize result monitoring
    if (id === 'classroom-dashboard-realtime-calculator' || id === 'classroom-dashboard-realtime-calculator-student') {
        setTimeout(() => {
            try { setupCalculationMonitoring(); } catch (e) { /* noop */ }
        }, 500);
    }

    if (id == 'resource-center-classroom') {
        $('#classroom-dashboard-activities-panel-library-teacher').html('<iframe id="resource-center-classroom" src="/learn/?use=classroom" frameborder="0" style="height:80vh;width:80vw" title="Centre de ressources - Bibliothèque d\'activités"></iframe>');
    }

    ClassroomSettings.lastPage.unshift({
        history: id,
        navbar: idNav
    });

    if ($_GET('panel') == 'classroom-dashboard-activity-panel' && document.querySelector('#activity-content') != null) {
        document.querySelector('#activity-content').innerHTML = '';
    }

    let state = {},
        title = '',
        endUrl = idNav;

    if (option != "") {
        endUrl += '&option=' + option;
    }
    if (id == 'classroom-dashboard-ide-panel' || id == 'classroom-dashboard-activity-panel') {
        endUrl += '&interface=' + interface;
    }
    let link = window.location.origin + window.location.pathname + "?panel=" + id + "&nav=" + endUrl;
    if (!isOnpopstate) {
        history.pushState(state, title, link);
    }
    let formateId = id.replace(/\-/g, '_');
    if (displayPanel[formateId]) {
        displayPanel[formateId](option);
    }

    // In case the panel content is populated asynchronously by displayPanel(),
    // retry focusing shortly after DOM updates (only after first user interaction).
    if (window.__a11yAllowPanelFocus === true) {
        setTimeout(() => moveFocusIntoPanel(id), 150);
    }

    $('.tooltip').remove()
    if (typeof Main.leaderline !== 'undefined') Main.leaderline.hide();
    $('[data-toggle="tooltip"]').tooltip()

    if (id == 'classroom-dashboard-activities-panel-teacher' && idNav == 'dashboard-activities-teacher') {
        foldersManager.goToFolder(foldersManager.actualFolder);
    }
}

/**
 * Monitor TI calculator results and announce them via screen reader.
 * Requires a global calcInstance with methods: isInitialized(), isBusy(), getFullPrecisionAnswer().
 */
function setupCalculationMonitoring() {
    if (window.__calcMonitoringStarted === true) {
        return;
    }
    if (typeof calcInstance === 'undefined') {
        return;
    }

    window.__calcMonitoringStarted = true;

    let lastResult = null;
    function checkForResults() {
        try {
            if (!calcInstance || !calcInstance.isInitialized() || calcInstance.isBusy()) {
                return;
            }

            const currentResult = calcInstance.getFullPrecisionAnswer();
            if (currentResult && currentResult !== lastResult && currentResult !== '0' && currentResult !== '') {
                notifyA11y('Résultat du calcul : ' + currentResult);
                lastResult = currentResult;
            }
        } catch (_) { }
    }

    setInterval(checkForResults, 500);

    const calculator = document.querySelector('.TI83CE');
    if (calculator) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.id === 'TI83CE_KEY_ENTER_ENTRY_NONE' && target.classList.contains('ti_highlight_keys')) {
                        setTimeout(checkForResults, 200);
                    }
                }
            });
        });

        observer.observe(calculator, {
            attributes: true,
            attributeFilter: ['class'],
            subtree: true
        });
    }
}

/**
 * Move focus inside a given dashboard panel.
 * Attempts to focus the first visible, enabled, focusable element inside the panel.
 * Falls back to focusing the panel container (made programmatically focusable).
 */
function moveFocusIntoPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel || panel.style.display === 'none') {
        return;
    }

    const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        'iframe'
    ];

    const candidates = Array.from(panel.querySelectorAll(focusableSelectors.join(',')));
    const isVisible = (el) => {
        if (!el.offsetParent && el.tagName.toLowerCase() !== 'body' && el.getClientRects().length === 0) return false;
        const style = window.getComputedStyle(el);
        return style.visibility !== 'hidden' && style.display !== 'none';
    };

    // Prefer focusing inside the contact panel first (help panel UX)
    const contactSection = panel.querySelector('.contact-panel');
    if (contactSection) {
        const contactCandidates = Array.from(contactSection.querySelectorAll(focusableSelectors.join(','))).filter(isVisible);
        if (contactCandidates.length > 0) {
            try { contactCandidates[0].focus(); return; } catch (_) { }
        }
    }

    const firstFocusable = candidates.find((el) => isVisible(el));

    if (firstFocusable) {
        try { firstFocusable.focus(); return; } catch (_) { }
    }

    if (!panel.hasAttribute('tabindex')) {
        panel.setAttribute('tabindex', '-1');
    }
    try { panel.focus(); } catch (_) { }
}

/**
 * History navigation
 */
window.onpopstate = () => {
    if ($_GET('panel') && $_GET('nav')) {
        navigatePanel($_GET('panel'), $_GET('nav'), option = $_GET('option'), interface = $_GET('interface'), true);
    }
};

// Add activity modal (Classroom management) -> Resource Bank button
function goToResourceBank() {
    Modal.prototype.closeAllModal();
    navigatePanel('classroom-dashboard-activities-panel-library-teacher', 'dashboard-activity-teacher');
}

// Add activity modal (Classroom management) -> Resource Bank button
function goToActivityPanel() {
    Modal.prototype.closeAllModal();
    navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher');
}

function navigateToHome() {
    notifyA11y("Retour à l'accueil");
    document.location.href = document.location.origin;
}


function modeApprenant() {
    window.localStorage.showSwitchTeacherButton = 'true';
    Main.getClassroomManager().getDemoStudent(ClassroomSettings.classroom)
}

$('body').on('change', '#list-classes input', function () {
    ClassroomSettings.classroom = $(this).val()
})

function listeModeApprenant() {
    pseudoModal.openModal('list-classes-modal')
}

//demoStudent-->prof
function modeProf() {
    Main.getClassroomManager().getTeacherAccount(ClassroomSettings.classroom).then(() => {
        window.localStorage.showSwitchTeacherButton = 'false';
    });
}

// Hide the switch teacher mode button when irrelevant
if (document.getElementById('teacherSwitchButton') && window.localStorage.showSwitchTeacherButton == 'true') {
    document.getElementById('teacherSwitchButton').style.display = 'block';
}

if (document.getElementById('settings-student') && window.localStorage.showSwitchTeacherButton == 'true') {
    document.getElementById('settings-student').style.display = 'none';
}

$('#code-copy').click(function () {
    currentOriginUrl = new URL(window.location.href).origin;
    fullPath = currentOriginUrl + '/classroom/login.php?link=' + $("#classroom-link-share").text();
    navigator.clipboard.writeText(fullPath)
    $('#hidden-link-prefix').hide()
    displayNotification('#notif-div', "classroom.activities.copyLink", "success")
})


// .new-student-modal removed
$('body').on('click', '#add-student-dashboard-panel', function () {
    // enable the button
    $('#add-student-to-classroom').prop('disabled', false);
    pseudoModal.openModal('add-student-modal');
});


if (document.querySelector('#update-classroom-student-button')) {
    document.querySelector('#update-classroom-student-button').addEventListener('click', (e) => {
        e.preventDefault();
        pseudoModal.openModal('update-classroom-student-modal');
    });
}




//banque de ressources-->copier une activité
window.addEventListener('storage', () => {
    if (window.localStorage.copyActivity) {
        Activity = JSON.parse(window.localStorage.copyActivity)
        Activity.isFromClassroom = true
        delete window.localStorage.copyActivity
        if (Activity.array) {
            Main.getClassroomManager().addActivities(Activity).then(function (response) {
                for (let i = 0; i < response.length; i++) {
                    addTeacherActivityInList(response[i])
                }
                processDisplay();
                displayNotification('#notif-div', "classroom.notif.addActivities", "success")
            })
        } else {
            Main.getClassroomManager().addActivity(Activity).then(function (response) {
                if (response.errors) {
                    for (let error in response.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                    }
                } else {
                    addTeacherActivityInList(response);
                    processDisplay();
                    displayNotification('#notif-div', "classroom.notif.addActivity", "success");
                }
            })
        }
    }
    //new sandbox--> save
    try {
        addProjectInList(JSON.parse(window.localStorage.saveProject))
        delete window.localStorage.saveProject
    } catch (e) { }
})

//profil prof-->paramètres
$('#settings-teacher').click(function () {
    if (UserManager.getUser().isFromGar) {
        if (document.getElementById('teacher-account-button')) {
            document.getElementById('teacher-account-button').style.display = 'none';
        }
        if (document.querySelector('[data-i18n="classroom.modals.settingsTeacher.description"]')) {
            document.querySelector('[data-i18n="classroom.modals.settingsTeacher.description"]').style.display = 'none';
        }
    }
    pseudoModal.openModal('settings-teacher-modal');
});

//profil élève-->paramètres
$('#settings-student').click(function () {
    getAndDisplayStudentPassword('#password-display-area');
    pseudoModal.openModal('settings-student-modal');
});

document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
    if (e.target.id == 'pwd-change-modal') {
        displayNotification('#notif-div', "classroom.notif.studentPwdChanged", "success");
        e.stopPropagation();
        resetStudentPassword('#password-display-area');
    }
});

//profil prof-->aide
$('#help-teacher').click(function () {
    navigatePanel('classroom-dashboard-help-panel-teacher', 'dashboard-profil-teacher');
})
//dropdow-accessibility
$('#accessDropdown').click(function () {
    $('#access-dropdown').toggle()
})

var accessForm = document.querySelector('#access-form');
if (accessForm) {
    accessForm.addEventListener("change", function (e) {
        updateWebsiteAcessibility($(this));
    });
}

//navbar prof-->new sandbox
$('.open-ide').click(function () {
    let option = $(this).attr('data-interface')
    if (UserManager.getUser().isRegular) {
        navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox-teacher', option)
    } else {
        navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox', option)
    }
})
//sandbox-->projet
$('body').on('click', '.sandbox-card', function () {
    if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
        ClassroomSettings.project = $(this).attr('data-href').replace(/.+link=([0-9a-z]{13}).+/, '$1')
        ClassroomSettings.interface = $(this).attr('data-href').replace(/.+(arduino|python|microbit|adacraft|wb55|esp32).+/, '$1')
        if (UserManager.getUser().isRegular) {
            navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox-teacher', ClassroomSettings.project, ClassroomSettings.interface)
        } else {
            navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox', ClassroomSettings.project, ClassroomSettings.interface)
        }
    }
})
//sandbox dropdown-->delete
$('body').on('click', '.modal-teacherSandbox-delete', function () {
    let confirm = window.confirm("Etes vous sur de vouloir supprimer le projet?")
    if (confirm) {
        let link = $(this).parent().parent().parent().parent().attr('data-href').replace(/\\(arduino|microbit|python|adacraft|wb55|esp32)\\\?link=([0-9a-f]{13})/, "$2")
        Main.getClassroomManager().deleteProject(link).then(function (project) {
            deleteSandboxInList(project.link)
            sandboxDisplay()
            displayNotification('#notif-div', "classroom.notif.deleteProject", "success")
        })
    }
})
//increment counter when selecting student
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('student-id') || e.target.classList.contains('list-students-classroom')) {
        let selectedStudentNumber = 0,
            studentCheckboxesElts = document.querySelectorAll('#list-student-attribute-modal .student-id');

        for (let checkboxElt of studentCheckboxesElts) {
            if (checkboxElt.checked) {
                selectedStudentNumber++;
            }
        }

        document.querySelector('#assign-total-student-number').innerHTML = selectedStudentNumber.toString();
        document.querySelector('#assign-total-student-number-course').innerHTML = selectedStudentNumber.toString();
        document.querySelector('#attribuate-student-number').innerText = selectedStudentNumber;

        if (selectedStudentNumber > 0) {
            document.querySelector('#attribute-activity-to-students').removeAttribute('disabled');
            document.querySelector('#attribute-course-to-students').removeAttribute('disabled');

        } else {
            document.querySelector('#attribute-activity-to-students').setAttribute('disabled', '');
            document.querySelector('#attribute-course-to-students').setAttribute('disabled', '');
        }
    }
    $('.student-number').html(ClassroomSettings.studentCount);
    // temp fix
    if (document.querySelector('#assign-total-student-number') != null) {
        if (document.querySelector('#assign-total-student-number').textContent != '0') {
            document.getElementById('attribute-activity-to-students').removeAttribute('disabled');
        } else {
            document.getElementById('attribute-activity-to-students').setAttribute('disabled', '');
        }
    }

    if (document.querySelector('#assign-total-student-number-course') != null) {
        if (document.querySelector('#assign-total-student-number-course').textContent != '0') {
            document.getElementById('attribute-course-to-students').removeAttribute('disabled');
        } else {
            document.getElementById('attribute-course-to-students').setAttribute('disabled', '');
        }
    }
})

$('body').on('change', '.list-students-classroom', function () {
    let nbStudent = $(this).parent().find('.student-list').children().length
    if ($(this).is(':checked')) {

        ClassroomSettings.studentCount += nbStudent
    } else {
        ClassroomSettings.studentCount -= nbStudent
    }
    $('.student-number').html(ClassroomSettings.studentCount)
    if (document.querySelector('.student-number').textContent != '0') {
        document.getElementById('attribute-activity-to-students').removeAttribute('disabled');
        document.getElementById('attribute-course-to-students').removeAttribute('disabled');
    } else {
        document.getElementById('attribute-activity-to-students').setAttribute('disabled', '');
        document.getElementById('attribute-course-to-students').setAttribute('disabled', '');
    }
})


//sandbox dropdown-->duplicate
$('body').on('click', '.modal-teacherSandbox-duplicate', function () {
    let link = $(this).parent().parent().parent().parent().attr('data-href')
    link = link.replace(/.+link=([0-9a-f]{13}).+/, '$1')
    ClassroomSettings.interface = $(this).parent().parent().parent().parent().attr('data-href').replace(/.+(arduino|python|microbit|adacraft|wb55|esp32).+/, '$1')
    Main.getClassroomManager().duplicateProject(link).then(function (project) {
        ClassroomSettings.project = project.link
        addSandboxInList(project)
        navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox', project.link, ClassroomSettings.interface)

    })
})

//sandbox dropdown-->share
$('body').on('click', '#share-project-to-students-close', function () {
    let linkProject = ClassroomSettings.project
    let usersInput = $(this).parent().find(".student-id")
    let idUsers = []
    usersInput.each(function () {
        if ($(this).is(':checked')) {
            idUsers.push($(this).val())
        }
    })
    Main.getClassroomManager().shareProject(linkProject, idUsers).then(function (project) {
        displayNotification('#notif-div', "classroom.notif.shareProject", "success")
        $('.student-number').html(0)
        pseudoModal.closeAllModal()
    })
})

//navbar-->mes activités
$('#dashboard-activities, .activity-panel-link').click(function () {
    navigatePanel('classroom-dashboard-activities-panel', 'dashboard-activities')
})
//activity-->validate
// Add more validate options for the activities 


//sandbox-->créer une activité
$('body').on('click', '.sandbox-action-add', function () {
    if (UserManager.getUser().isRegular) {
        navigatePanel('classroom-dashboard-sandbox-creation', 'dashboard-sandbox-teacher')
    } else {
        navigatePanel('classroom-dashboard-sandbox-creation', 'dashboard-sandbox')
    }
})

function isDateNull(dateBegin = null, dateEnd = null) {
    if (dateBegin == null || dateEnd == null) {
        return true;
    }
    return false;
}

function checkDateForActivities(dateBegin, dateEnd) {
    let today = new Date();

    if (dateBegin == null || dateEnd == null) {
        return true;
    }

    let begin = new Date(dateBegin);
    let end = new Date(dateEnd);
    if (today < begin || today > end) {
        return false;
    }
    return true;
}

function countCourseDoable() {
    let today = new Date();
    let doableCourse = Main.getClassroomManager()._myCourses.filter(course => {
        let dateBegin = new Date(course.dateBegin.date);
        let dateEnd = new Date(course.dateEnd.date);
        return today >= dateBegin && today <= dateEnd;
    }).length;

    return doableCourse;
}


function countActivityDoable() {
    let today = new Date();
    let doableActivity = Main.getClassroomManager()._myActivities.newActivities.filter(activity => {
        if (activity.dateBegin == null || activity.dateEnd == null) {
            return true;
        }
        let dateBegin = new Date(activity.dateBegin.date);
        let dateEnd = new Date(activity.dateEnd.date);
        return today >= dateBegin && today <= dateEnd;
    }).length;

    return doableActivity;
}

function studentActivitiesDisplay() {

    let activities = Main.getClassroomManager()._myActivities;
    let index = 1;

    document.querySelector('#new-activities-list').innerHTML = '';
    document.querySelector('#current-activities-list').innerHTML = '';
    document.querySelector('#saved-activities-list').innerHTML = '';
    document.querySelector('#done-activities-list').innerHTML = '';

    $('.section-new .resource-number').html(activities.newActivities.length)
    const newCount = activities.newActivities.length;
    const newHeader = document.querySelector('.section-new .section-header');
    if (newHeader) {
        newHeader.setAttribute('aria-label', `Nouveaux, ${newCount} ${newCount === 1 ? 'nouvelle activité' : 'nouvelles activités'}`);
    }
    activities.newActivities.forEach(element => {
        if (isDateNull(element.dateBegin, element.dateEnd) || checkDateForActivities(element.dateBegin.date, element.dateEnd.date)) {
            $('#new-activities-list').append(activityItem(element, "newActivities"));
            index++;
        }
    });

    $('.section-saved .resource-number').html(activities.savedActivities.length)
    const savedCount = activities.savedActivities.length;
    const savedHeader = document.querySelector('.section-saved .section-header');
    if (savedHeader) {
        savedHeader.setAttribute('aria-label', `Brouillons, ${savedCount} ${savedCount === 1 ? 'activité en attente de correction' : 'activités en attente de correction'}`);
    }
    activities.savedActivities.forEach(element => {
        if (isDateNull(element.dateBegin, element.dateEnd) || checkDateForActivities(element.dateBegin.date, element.dateEnd.date)) {
            $('#saved-activities-list').append(activityItem(element, "savedActivities"));
            index++;
        }
    });

    $('.section-current .resource-number').html(activities.currentActivities.length)
    const currentCount = activities.currentActivities.length;
    const currentHeader = document.querySelector('.section-current .section-header');
    if (currentHeader) {
        currentHeader.setAttribute('aria-label', `En attente de correction, ${currentCount} ${currentCount === 1 ? 'activité en cours' : 'activités en cours'}`);
    }
    activities.currentActivities.forEach(element => {
        if (isDateNull(element.dateBegin, element.dateEnd) || checkDateForActivities(element.dateBegin.date, element.dateEnd.date)) {
            $('#current-activities-list').append(activityItem(element, "currentActivities"));
            index++;
        }
    });

    $('.section-done .resource-number').html(activities.doneActivities.length)
    const doneCount = activities.doneActivities.length;
    const doneHeader = document.querySelector('.section-done .section-header');
    if (doneHeader) {
        doneHeader.setAttribute('aria-label', `Terminés, ${doneCount} ${doneCount === 1 ? 'activité terminée' : 'activités terminées'}`);
    }
    activities.doneActivities.forEach(element => {
        $('#done-activities-list').append(activityItem(element, "doneActivities"));
        index++;
    });

    Main.getClassroomManager()._myCourses.forEach(course => {
        let today = new Date(),
            dateBegin = course.dateBegin ? new Date(course.dateBegin.date) : null,
            dateEnd = course.dateEnd ? new Date(course.dateEnd.date) : null;

        if (dateBegin && (today < dateBegin || dateEnd < today) && dateBegin != null && dateEnd != null) {
            return;
        }

        let saveCourse = false;
        course.activities.forEach(a => {
            if (a.correction > 0 && a.activity.type != 'reading' && course.format == 1) {
                saveCourse = true;
            }
        });

        if (course.courseState == 999) {
            let doneNumberElement = document.querySelector('.section-done .resource-number');
            let currentCount = parseInt(doneNumberElement.textContent || '0') + 1;
            doneNumberElement.textContent = currentCount.toString();
            doneNumberElement.setAttribute('aria-label', currentCount + (currentCount === 1 ? ' activité terminée' : ' activités terminées'));
            doneNumberElement.removeAttribute('aria-hidden');
            const doneHeader = document.querySelector('.section-done .section-header');
            if (doneHeader) {
                doneHeader.setAttribute('aria-label', `Terminés, ${currentCount} ${currentCount === 1 ? 'activité terminée' : 'activités terminées'}`);
            }
            document.querySelector('#done-activities-list').innerHTML += courseItem(course, "doneActivities");
        } else if ((course.courseState == 0 && course.activities[0].response != null) || course.courseState > 0 && course.courseState != 999 && saveCourse) {
            let savedNumberElement = document.querySelector('.section-saved .resource-number');
            let currentCount = parseInt(savedNumberElement.textContent || '0') + 1;
            savedNumberElement.textContent = currentCount.toString();
            savedNumberElement.setAttribute('aria-label', currentCount + (currentCount === 1 ? ' activité en attente de correction' : ' activités en attente de correction'));
            savedNumberElement.removeAttribute('aria-hidden');
            const savedHeader = document.querySelector('.section-saved .section-header');
            if (savedHeader) {
                savedHeader.setAttribute('aria-label', `Brouillons, ${currentCount} ${currentCount === 1 ? 'activité en attente de correction' : 'activités en attente de correction'}`);
            }
            document.querySelector('#saved-activities-list').innerHTML += courseItem(course, "currentActivities");
        } else if (course.courseState == 0 || !saveCourse) {
            let newNumberElement = document.querySelector('.section-new .resource-number');
            let currentCount = parseInt(newNumberElement.textContent || '0') + 1;
            newNumberElement.textContent = currentCount.toString();
            newNumberElement.setAttribute('aria-label', currentCount + (currentCount === 1 ? ' nouvelle activité' : ' nouvelles activités'));
            newNumberElement.removeAttribute('aria-hidden');
            const newHeader = document.querySelector('.section-new .section-header');
            if (newHeader) {
                newHeader.setAttribute('aria-label', `Nouveaux, ${currentCount} ${currentCount === 1 ? 'nouvelle activité' : 'nouvelles activités'}`);
            }
            document.querySelector('#new-activities-list').innerHTML += courseItem(course, "newActivities");
        }
    });

    manageToggleForStudentPanel();

    if (activities.doneActivities.length < 1) {
        $('#average-score').hide();
    } else {
        $('#number-activities-done').html(activities.doneActivities.length);
        $('#score-student').html($('#body-table-bilan .bilan-success').length);
        $('#average-score').show();
    }

    if (index == 1) {
        $('#bilan-student').hide();
    } else {
        $('#bilan-student').show();
    }

    $('[data-bs-toggle="tooltip"]').tooltip();
}

function manageToggleForStudentPanel() {
    // test toggle auto if activity in the section
    if (parseInt($('.section-done .resource-number').text() || '0') > 0) {
        if ($('#done-activities-list').css("display") == 'none') {
            sectionToggle('done')
        }
    }
    if (parseInt($('.section-saved .resource-number').text() || '0') > 0) {
        if ($('#saved-activities-list').css("display") == 'none') {
            sectionToggle('saved')
        }
    }
    if (parseInt($('.section-current .resource-number').text() || '0') > 0) {
        if ($('#current-activities-list').css("display") == 'none') {
            sectionToggle('current')
        }
    }
}

function sandboxDisplay(projects = Main.getClassroomManager()._myProjects) {
    $('#sandbox-container-list').html(`
    <h3 class="section-title section-new">` + i18next.t('classroom.sandbox.mine') + ` </h3>
    <div id="mine-sandbox">
    </div>
    <h3 class="section-title section-current">` + i18next.t('classroom.sandbox.shared') + `</h3>
    <div id="shared-sandbox"></div>`)
    projects.forEach(element => {
        $('#mine-sandbox').append(teacherSandboxItem(element))
    });
    let sharedProjects = Main.getClassroomManager()._sharedProjects
    if (!sharedProjects.length) {
        if (UserManager.getUser().isRegular) {
            $('#shared-sandbox').html(`
            <p>${i18next.t('classroom.sandbox.teacherSharedDescription')}</p>
            `);
        } else {
            $('#shared-sandbox').html(`
            <p>${i18next.t('classroom.sandbox.studentSharedDescription')}</p>
            `);
        }
    }
    sharedProjects.forEach(element => {
        $('#shared-sandbox').append(teacherSandboxItem(element))
    });
}

function classroomsDisplay() {
    let noContentDiv = `
    <p class="no-content-div">
        <img src="${_PATH}assets/media/my_classes.svg" alt="Icône classe" class="hue-rotate-teacher"> 
        <b data-i18n="classroom.classes.noClasses">Vous n'avez pas encore de classe</b>
        <span id="no-content-div__bottom-text"  data-i18n="classroom.classes.createClassNow">Commencez par créer une classe dès maintenant !</span>
    </p>`

    // Hide the "add a class" button in the gar user context
    if (UserManager.getUser().isFromGar) {
        document.querySelector('.buttons-interactions button.teacher-new-classe').style.display = 'none';
        noContentDiv = `
        <p class="no-content-div">
            <img src="${_PATH}assets/media/my_classes.svg" alt="Icône classe" class="hue-rotate-teacher"> 
            <b data-i18n="classroom.classes.noClasses">Vous n'avez pas encore de classe</b>
        </p>`
    }

    // Display the classes from cached data
    $('.list-classes').html(``);
    let classes = Main.getClassroomManager()._myClasses;
    if (classes.length) {
        classes.forEach(classroom => {
            $('.list-classes').append(classeItem(classroom.classroom, classroom.students.length, classroom.students));
        });
    } else {
        $('.list-classes').append(noContentDiv).localize();
    }
    // Get the classes from the database and refresh the panel it there are differences
    Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
        $('.list-classes').html(``);
        let classes = Main.getClassroomManager()._myClasses;
        if (classes.length) {
            classes.forEach(classroom => {
                $('.list-classes').append(classeItem(classroom.classroom, classroom.students.length, classroom.students));
            });
        } else {
            $('.list-classes').append(noContentDiv).localize();



            if (typeof Main.leaderline === 'undefined') {
                const startAttachment = LeaderLine.pointAnchor({
                    element: document.getElementById('no-content-div__bottom-text'),
                    x: -10,
                });
                const endAttachment = LeaderLine.pointAnchor({
                    element: document.getElementById('teacher-new-classroom-btn'),
                    y: "110%"
                });

                Main.leaderline = new LeaderLine(
                    startAttachment,
                    endAttachment, {
                    color: 'var(--classroom-primary)',
                    path: "arc",
                    startSocket: "left",
                    endSocket: "bottom",
                    endPlug: "arrow2",
                    startSocketGravity: [50, -100]
                });
            } else {
                Main.leaderline.setOptions({
                    start: LeaderLine.pointAnchor({
                        element: document.getElementById('no-content-div__bottom-text'),
                        x: -10,
                    }),
                    end: LeaderLine.pointAnchor({
                        element: document.getElementById('teacher-new-classroom-btn'),
                        y: "110%"
                    })
                });
                Main.leaderline.show();
            }
        }
    });
}

function teacherActivitiesDisplay(list = Main.getClassroomManager()._myTeacherActivities, keyword = false, asc = false, excludedObjects = [], tags = []) {
    // Keep the list sorted
    let selectedSort = $('#filter-activity-select').val(),
        sortedList = "";

    if (selectedSort == "desc" || selectedSort == "asc") {
        sortedList = $("#filter-activity-select").val() != "desc" ? list.sort((a, b) => { return b.id - a.id }) : list;
    } else if (selectedSort == "alph" || selectedSort == "ralph") {
        sortedList = $("#filter-activity-select").val() == "alph" ? list.sort((a, b) => a.title.localeCompare(b.title)) : list.sort((a, b) => -1 * a.title.localeCompare(b.title));
    }

    let displayStyle = Main.getClassroomManager().displayMode;

    if (foldersManager.treeFolder.html() == "") {
        foldersManager.resetTreeFolders();
    }

    $('#list-activities-teacher').html(``);
    displayStyle == "list" ? $("#list-activities-teacher").css("flex-direction", "column") : $("#list-activities-teacher").css("flex-direction", "row");

    // Add sorting to the folders
    let foldersZ = keyword ? filterTeacherFolderInList(keyword, asc) : foldersManager.userFolders;
    if (!excludedObjects.includes("folders")) {
        foldersZ.forEach(folder => {
            if (folder.parentFolder == null && foldersManager.actualFolder == null) {
                $('#list-activities-teacher').append(teacherFolder(folder, displayStyle));
            } else if (folder.parentFolder != null) {
                if (folder.parentFolder.id == foldersManager.actualFolder) {
                    $('#list-activities-teacher').append(teacherFolder(folder, displayStyle));
                }
            }
        });
    }

    sortedList.forEach(element => {
        if (element.folder == null && foldersManager.actualFolder == null) {
            $('#list-activities-teacher').append(teacherActivityItem(element, displayStyle));
        } else if (element.folder != null) {
            if (element.folder.id == foldersManager.actualFolder) {
                $('#list-activities-teacher').append(teacherActivityItem(element, displayStyle));
            }
        }
    });

    if (!excludedObjects.includes("courses")) {
        coursesManager.myCourses.forEach(course => {
            if (course.folder == null && foldersManager.actualFolder == null) {
                $('#list-activities-teacher').append(coursesManager.teacherCourseItem(course, displayStyle));
            } else if (course.folder != null) {
                if (course.folder.id == foldersManager.actualFolder) {
                    $('#list-activities-teacher').append(coursesManager.teacherCourseItem(course, displayStyle));
                }
            }
        });
    }

    foldersManager.dragulaInitObjects();
    $('[data-bs-toggle="tooltip"]').tooltip();
}


function filterTeacherFolderInList(keywords = [], asc = true) {
    let expression = ''
    for (let i = 0; i < keywords.length; i++) {
        expression += '(?=.*'
        expression += keywords[i].toUpperCase()
        expression += ')'
    }
    regExp = new RegExp(expression)
    let list = foldersManager.userFolders.filter(x => regExp.test(x.name.toUpperCase()))
    if (asc) {
        return list.sort(function (a, b) {
            return a["id"] - b["id"];
        })
    } else {
        return list.sort(function (a, b) {
            return b["id"] - a["id"];
        })
    }
}

/**
 * Toggle the block class mode (to lock/unlock the access to the classroom)
 */
function toggleBlockClass() {
    let currentClassroomLink = $_GET('option') ? $_GET('option') : ClassroomSettings.classroom;
    let classroom = getClassroomInListByLink(currentClassroomLink)[0].classroom;
    if (classroom.isBlocked == true) {
        classroom.isBlocked = false;
        $('#blocking-class-tooltip').removeClass('greyscale');
        $('#blocking-class-tooltip > i.fa').removeClass('fa-lock').addClass('fa-lock-open');
        $('#classroom-info > *:not(#blocking-class-tooltip)').css('opacity', '1');
        $('#blocking-class-tooltip').tooltip("dispose");
        $('#blocking-class-tooltip').attr("title", i18next.t('classroom.classes.classroomUnlocked')).tooltip();

    } else {
        classroom.isBlocked = true;
        $('#blocking-class-tooltip').addClass('greyscale');
        $('#blocking-class-tooltip > i.fa').removeClass('fa-lock-open').addClass('fa-lock');
        $('#classroom-info > *:not(#blocking-class-tooltip)').css('opacity', '0.5');
        $('#blocking-class-tooltip').tooltip("dispose");
        $('#blocking-class-tooltip').attr("title", i18next.t('classroom.classes.classroomLocked')).tooltip();
    }
    Main.getClassroomManager().updateClassroom(classroom);
}

// Show the month in string format
function formatDay(da) {
    if (da == null) {
        return "";
    }
    let d = new Date(da.date)
    let translatedMonth = i18next.t("classroom.activities.month." + parseInt(d.getMonth() + 1));
    let numericMonth = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    return d.getDate() + "." + numericMonth + "." + d.getFullYear();
}


function formatHour(da) {
    let d = new Date(da.date);
    let translatedMonth = i18next.t("classroom.activities.month." + parseInt(d.getMonth() + 1));
    let twoDigitsHour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    return d.getDate() + " " + (translatedMonth) + " " + d.getFullYear() + " - " + twoDigitsHour + "h" + d.getMinutes();
}

function returnToConnectionPanel(currentPanel) {
    if (window.getComputedStyle(document.getElementById('classroom-register-container')).display == 'block') {
        $('#classroom-register-container').hide();
    } else {
        $('#classroom-login-container').toggle();
    }
    $(currentPanel).toggle();
}

function findClassroomToConnect(linkC) {
    $('#classroom-login-container').toggle();
    Main.getClassroomManager().getClassroom(linkC).then(function (classroom) {
        let link = window.location.origin + window.location.pathname + '/?link=' + linkC
        $('#classroom-login-container-bis').toggle();
        let state = {};
        var title = '';
        history.pushState(state, title, link);
        if (classroom != false) {
            $('#classroom-desc').html('Classe ' + classroom[0].name + ", code " + classroom[0].link);
        } else {
            $('#classroom-desc').html(i18next.t("classroom.login.noClass"))

        }
    })
}

function sectionToggle(id) {
    $('#' + id + '-activities-list').toggle()
    $('#i-' + id).toggleClass('fa-chevron-down')
    $('#i-' + id).toggleClass('fa-chevron-up')
}

/**
 * Get the current student password from database and show it in the dedicated area
 * @param {string} querySelector - css selector
 */
function getAndDisplayStudentPassword(querySelector) {
    let userId = UserManager.getUser().id;
    if (userId) {
        Main.getClassroomManager().getStudentPassword(userId).then((response) => {
            if (response.errorType) {
                displayNotification('#notif-div', `classroom.notif.${response.errorType}`, "error");
            } else {
                displayStudentPassword(querySelector, response.password);
            }
        });
    } else {
        displayNotification('#notif-div', "classroom.notif.cantGetPassword", "error");
        displayStudentPassword(querySelector, '');
    }
}

/**
 * Display the password in the selected dom element
 * @param {string} querySelector - css selector
 * @param {string} password - password
 */
function displayStudentPassword(querySelector, password) {
    let displayArea = document.querySelector(querySelector);
    displayArea.value = password;
}

/**
 * Reset the current student password and show it in the dedicated area
 * @param {string} querySelector - css selector
 */
function resetStudentPassword(querySelector) {
    let userId = UserManager.getUser().id;
    if (userId) {
        Main.getClassroomManager().resetStudentPassword(userId).then((response) => {
            if (response.errorType) {
                displayNotification('#notif-div', `classroom.notif.${response.errorType}`, "error");
            } else {
                displayStudentPassword(querySelector, response.newPassword);
            }
        });
    } else {
        displayNotification('#notif-div', "classroom.notif.cantResetPassword", "error");
        displayStudentPassword(querySelector, '');
    }
}

/***************************/
/* manager & groupAdmin */
/***************************/

$('#create_group_manager').click(function () {
    pseudoModal.openModal('manager-create-group');


    $('#group_global_restrictions').html(`
            <div class="activity-add-form c-secondary-form my-3">

            <h6 class="form-check-label font-weight-bold mb-4" style="color: var(--classroom-primary)">${i18next.t('manager.group.groupsRestrictions')}</h6>
            <br>
            <label class="form-check-label" for="groupe_create_begin_date"><i class="far fa-calendar-alt"></i>  ${i18next.t('classroom.activities.form.dateBegin')}</label>
            <input type="date" id="groupe_create_begin_date" name="trip-start" max="2100-12-31">

            <label class="form-check-label" for="groupe_create_end_date"><i class="far fa-calendar-alt"></i>  ${i18next.t('classroom.activities.form.dateEnd')}</label>
            <input type="date" id="groupe_create_end_date" name="trip-start" max="2100-12-31">

            <label class="form-check-label" data-bs-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxStudentsPerTeachers')}" for="groupe_create_max_students_per_teachers"><i class="fas fa-user-alt"></i>  ${i18next.t('manager.group.studentsPerTeacher')}</label>
            <input type="number" id="groupe_create_max_students_per_teachers" value="${mainManager.getmanagerManager()._defaultRestrictions[1].restrictions.maxStudentsPerTeacher}">

            <label class="form-check-label" data-bs-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxStudentsPerGroups')}" for="groupe_create_max_students_per_groups"><i class="fas fa-user-alt"></i>  ${i18next.t('manager.group.studentsPerGroup')}</label>
            <input type="number" id="groupe_create_max_students_per_groups" value="${mainManager.getmanagerManager()._defaultRestrictions[1].restrictions.maxStudents}">

            <label class="form-check-label" data-bs-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxTeachers')}" for="groupe_create_max_teachers_per_groups"><i class="fas fa-user-alt"></i>  ${i18next.t('manager.group.teachersPerGroup')}</label>
            <input type="number" id="groupe_create_max_teachers_per_groups" value="${mainManager.getmanagerManager()._defaultRestrictions[1].restrictions.maxTeachers}">
            
            <label class="form-check-label" data-bs-toggle="tooltip" title="" for="groupe_create_max_class_per_teachers"><i class="fas fa-user-alt"></i>  ${i18next.t('manager.group.classroomPerTeacher')}</label>
            <input type="number" id="groupe_create_max_class_per_teachers" value="${mainManager.getmanagerManager()._defaultRestrictions[1].restrictions.maxClassroomsPerTeacher}">
            
            </div>`);

    // Clean input
    $('#group_name').val("");
    $('#group_desc').val("");
    optionsGroupApplications("create");
});

$('#settings-manager').click(function () {
    pseudoModal.openModal('settings-teacher-modal')
})

$('#settings-groupadmin').click(function () {
    pseudoModal.openModal('settings-teacher-modal')
})

function createGroupWithModal() {
    let $name = $('#group_name').val(),
        $description = $('#group_desc').val(),
        ApplicationsData = [];

    const GlobalRestrictions = [
        $('#groupe_create_begin_date').val(),
        $('#groupe_create_end_date').val(),
        $('#groupe_create_max_students_per_teachers').val(),
        $('#groupe_create_max_students_per_groups').val(),
        $('#groupe_create_max_teachers_per_groups').val(),
        $('#groupe_create_max_class_per_teachers').val()
    ];

    $("input:checkbox.form-check-input.app").each(function () {
        const ApplicationTemp = [$(this).val(),
        $(this).is(':checked'),
        $('#max_activities_per_groups_' + $(this).val()).val(),
        $('#max_activities_per_teachers_' + $(this).val()).val()
        ]
        ApplicationsData.push(ApplicationTemp);
    });

    mainManager.getmanagerManager().createGroup($description, $name, JSON.stringify(ApplicationsData), JSON.stringify(GlobalRestrictions)).then((response) => {
        if (response.response == "success") {
            displayNotification('#notif-div', "manager.group.groupCreated", "success");
        } else {
            displayNotification('#notif-div', "manager.group.groupCreateFailed", "error");
        }
    });

    pseudoModal.closeAllModal();
    tempoAndShowGroupsTable();
}

function showupdateGroupModal(id) {
    mainManager.getmanagerManager().getGroupInfos(id).then(function (res) {
        mainManager.getmanagerManager()._actualGroup = res;
        pseudoModal.openModal('manager-update-group');
        optionsGroupApplications("update");
        $('#upd_group_name').val(res[0].name);
        $('#upd_group_desc').val(res[0].description);
        $('#upd_group_id').val(res[0].id);

        const url = window.location.origin + "/classroom/group_invitation.php?gc=" + res[0].link,
            dateBegin = res[0].dateBegin != null ? new Date(res[0].dateBegin.date).toISOString().split('T')[0] : "",
            dateEnd = res[0].dateEnd != null ? new Date(res[0].dateEnd.date).toISOString().split('T')[0] : "",
            defaultRestrictions = mainManager.getmanagerManager()._defaultRestrictions,
            maxStudentsPerTeachers = res[0].maxStudentsPerTeachers != null ? res[0].maxStudentsPerTeachers : defaultRestrictions[1].restrictions.maxStudentsPerTeacher,
            maxStudents = res[0].maxStudents != null ? res[0].maxStudents : defaultRestrictions[1].restrictions.maxStudents,
            maxTeachers = res[0].maxTeachers != null ? res[0].maxTeachers : defaultRestrictions[1].restrictions.maxTeachers,
            maxClassroomPerTeachers = res[0].maxClassroomsPerTeachers != null ? res[0].maxClassroomsPerTeachers : 0;


        $('#group_upd_global_restrictions').html(`
            <div class="activity-add-form c-secondary-form my-3">

            <h6 class="form-check-label font-weight-bold mb-4" style="color: var(--classroom-primary)">${i18next.t('manager.group.groupsRestrictions')}</h6>
            <br>
            <label class="form-check-label" for="begin_date"><i class="far fa-calendar-alt"></i>  ${i18next.t('classroom.activities.form.dateBegin')}</label>
            <input type="date" id="begin_date" name="trip-start" value="${dateBegin}" max="2100-12-31">

            <label class="form-check-label" for="end_date"><i class="far fa-calendar-alt"></i>  ${i18next.t('classroom.activities.form.dateEnd')}</label>
            <input type="date" id="end_date" name="trip-start" value="${dateEnd}" max="2100-12-31">

            <label class="form-check-label" data-bs-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxStudentsPerTeachers')}" for="max_students_per_teachers"><i class="fas fa-user-alt"></i>  ${i18next.t('manager.group.studentsPerTeacher')}</label>
            <input type="number" id="max_students_per_teachers" value="${maxStudentsPerTeachers}">

            <label class="form-check-label" data-bs-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxStudentsPerGroups')}" for="max_students_per_groups"><i class="fas fa-user-alt"></i>  ${i18next.t('manager.group.studentsPerGroup')}</label>
            <input type="number" id="max_students_per_groups" value="${maxStudents}">

            <label class="form-check-label" data-bs-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxTeachers')}" for="max_teachers_per_groups"><i class="fas fa-user-alt"></i>  ${i18next.t('manager.group.teachersPerGroup')}</label>
            <input type="number" id="max_teachers_per_groups" value="${maxTeachers}">

            <label class="form-check-label" data-bs-toggle="tooltip" title="" for="max_class_per_teachers"><i class="fas fa-user-alt"></i>  ${i18next.t('manager.group.classroomPerTeacher')}</label>
            <input type="number" id="max_class_per_teachers" value="${maxClassroomPerTeachers}">
            </div>`);
        $('#upd_group_link').val(url);
    });
}

function updateGroupWithModal() {
    let ApplicationsData = [];

    const GlobalRestrictions = [
        $('#begin_date').val(),
        $('#end_date').val(),
        $('#max_students_per_teachers').val(),
        $('#max_students_per_groups').val(),
        $('#max_teachers_per_groups').val(),
        $('#max_class_per_teachers').val()
    ];

    $("input:checkbox.form-check-input.app").each(function (element) {
        const ApplicationTemp = [$(this).val(),
        $(this).is(':checked'),
        $('#max_activities_per_groups_' + $(this).val()).val(),
        $('#max_activities_per_teachers_' + $(this).val()).val()
        ]
        ApplicationsData.push(ApplicationTemp);
    });

    mainManager.getmanagerManager().updateGroup(
        $('#upd_group_id').val(),
        $('#upd_group_name').val(),
        $('#upd_group_desc').val(),
        JSON.stringify(ApplicationsData),
        JSON.stringify(GlobalRestrictions)
    ).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.group.groupUpdated", "success");
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        } else if (response.message == "missing data date") {
            displayNotification('#notif-div', "manager.account.missingDataDate", "error");
        }
    })
    pseudoModal.closeAllModal()
    tempoAndShowGroupsTable()
}

$('#table_back_to_users').click(function () {
    $('#table_details_users').hide();
    $('#table_details_admins').show();
    $('#paginationButtons_users').hide();
    $('#paginationButtons_groups').show();
    $('#users_options').hide();
    $('#groups_options').show();
    $('#btn-create-manager').show();
    $('#table_info_group_data').html("");
    $('#paginationButtons_users').html("");
})

$('#table_back_to_users_groupadmin').click(function () {
    $('#groupadmin_groups').show();
    $('#group-monitoring').show();
    $('#table_details_users_groupadmin').hide();
})

$('#dashboard-manager-groups').click(() => {
    getGroupsManagerInfo();
})

function getGroupsManagerInfo() {
    let sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
}

$('#sort_users_filter, #users_per_page').on('change', () => {
    let $sort = $('#sort_users_filter').val(),
        $userspp = $('#users_per_page').val(),
        $group_id = mainManager.getmanagerManager()._actualGroup;
    mainManager.getmanagerManager().showGroupMembers($group_id, 1, $userspp, $sort);
})

$('#search_user').click(() => {
    let name = $('#name_user_search').val(),
        usersperpage = $('#users_per_page').val();
    if (name != "") {
        mainManager.getmanagerManager().globalSearchUser(name, 1, usersperpage);
    }
})

$('#name_user_search').on('change', () => {
    let name = $('#name_user_search').val(),
        sort = $('#sort_users_filter').val(),
        usersperpage = $('#users_per_page').val(),
        group_id = mainManager.getmanagerManager()._actualGroup;
    if (name == "") {
        mainManager.getmanagerManager().showGroupMembers(group_id, 1, usersperpage, sort);
    }
})

$('#name_group_search').on('change', () => {
    let name = $('#name_group_search').val(),
        sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    if (name == "") {
        mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
    }
})

$('#sort_groups_filter, #groups_per_page').on('change', () => {
    let sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
})


$('#search_group').click(() => {
    let name = $('#name_group_search').val(),
        sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    if (name == "") {
        mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
    } else {
        mainManager.getmanagerManager().searchGroup(name, 1, groupsperpage,);
    }
})

$('#create_user_link_to_group_manager').click(function () {
    mainManager.getmanagerManager()._addedCreateUserGroup = 0;
    $('#group_add_sa').html("");
    $('#u_firstname').val("");
    $('#u_surname').val("");
    $('#u_bio').val("");
    $('#u_mail').val("");
    $('#u_pseudo').val("");
    $('#user_teacher_infos').hide();
    $('#u_phone').val("");
    $('#u_school').val("");
    $('#u_is_admin').prop("checked", false);
    $('#u_is_teacher').prop("checked", false);
    $('#u_is_active').prop("checked", false);
    $('#user_teacher_grade').prop('selectedIndex', 0);
    $('#user_teacher_subjects').prop('selectedIndex', 0);
    $('#u_is_group_admin').prop("checked", false);


    $("#create_max_students").val(mainManager.getmanagerManager()._defaultRestrictions[0].restrictions.maxStudents);
    $("#create_max_classrooms").val(mainManager.getmanagerManager()._defaultRestrictions[0].restrictions.maxClassrooms);


    updateAppForUser("create");
    pseudoModal.openModal('manager-create-user');

    // Bind function to select
    $("#u_is_teacher").change(() => {
        if ($('#u_is_teacher').is(':checked')) {
            $('#user_teacher_infos').show();
        } else {
            $('#user_teacher_infos').hide();
        }
    })

    $('#user_teacher_grade').change(() => {
        switch ($('#user_teacher_grade').val()) {
            case "0":
                createSubjectSelect(getSubjects(0), 0);
                break;
            case "1":
                createSubjectSelect(getSubjects(1), 0);
                break;
            case "2":
                createSubjectSelect(getSubjects(2), 0);
                break;
            case "3":
                createSubjectSelect(getSubjects(3), 0);
                break;
            case "4":
                createSubjectSelect(getSubjects(4), 0);
                break;
            default:
                break;
        }
    })

    $("#user_teacher_grade").trigger("change");
    if ($("#u_group")[0].length <= 0) {
        $saved_groups = mainManager.getmanagerManager()._comboGroups;
        appendSelectGroups($saved_groups, 'u_group');
    }

});

function addGroupmanager() {
    let numberOfAddedGroup = mainManager.getmanagerManager()._addedCreateUserGroup,
        $saved_groups = mainManager.getmanagerManager()._comboGroups;

    // fix
    if ($('#u_actual_group' + numberOfAddedGroup)[0]) {
        for (i = 0; i <= numberOfAddedGroup; i++) {
            if (!$('#u_actual_group' + i)[0]) {
                numberOfAddedGroup = i;
                break;
            }
        }
    }

    let HtmlToAdd = `<div class="input-group mb-3" id="u_actual_group${numberOfAddedGroup}">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                        <input type="checkbox" id="u_is_group_admin${numberOfAddedGroup}">
                        <label class="form-check-label mx-1" for="u_is_group_admin${numberOfAddedGroup}">
                                Administrateur du groupe
                            </label>
                        </div>
                    </div>
                    <select class="form-control" id="u_group${numberOfAddedGroup}">
                    </select>
                    <button class="btn btn-danger ms-1" onclick="deleteGroupFromCreate(${numberOfAddedGroup})">Supprimer</button>
                </div>`;
    $('#group_add_sa').append(HtmlToAdd);

    let item_id = 'u_group' + numberOfAddedGroup;
    appendSelectGroups($saved_groups, item_id);
    mainManager.getmanagerManager()._addedCreateUserGroup += 1;
}

function deleteGroupFromCreate(id) {
    mainManager.getmanagerManager()._addedCreateUserGroup -= 1;
    $('#u_actual_group' + id).remove();
}

// Fill the selectbox with the existing groups
function appendSelectGroups(obj, item_id) {
    const o = new Option("Aucun groupe", -1);
    $(o).html("Aucun groupe");
    $("#" + item_id).append(o);

    for (let index = 0; index < obj.length; index++) {
        const o = new Option(obj[index].name, obj[index].id);
        $(o).html(obj[index].name);
        $("#" + item_id).append(o);
    }
}

function updateAppForUser(methodName = "update") {
    const process = (data) => {
        // Get the actual user's information
        let user = mainManager.getmanagerManager()._actualUserDetails;
        let defaultRestrictions = mainManager.getmanagerManager()._defaultRestrictions;

        let Restrictions = "";

        let dateBegin = "";
        let dateEnd = "";
        let maxStudents = defaultRestrictions[0].restrictions.maxStudents,
            maxClassrooms = defaultRestrictions[0].restrictions.maxClassrooms;

        if (user[0]) {
            if (user[0].restrictions.length > 0) {
                dateBegin = user[0].restrictions[0].date_begin != null ? new Date(user[0].restrictions[0].date_begin).toISOString().split('T')[0] : null;
                dateEnd = user[0].restrictions[0].date_end != null ? new Date(user[0].restrictions[0].date_end).toISOString().split('T')[0] : null;
                if (user[0].restrictions[0].max_students != null && user[0].restrictions[0].max_students != undefined) {
                    maxStudents = user[0].restrictions[0].max_students;
                }
                if (user[0].restrictions[0].max_classrooms != null && user[0].restrictions[0].max_classrooms != undefined) {
                    maxClassrooms = user[0].restrictions[0].max_classrooms;
                }
            }
        }

        $('#update_personal_apps_sa').html("");
        $('#create_update_personal_apps_sa').html("");

        let stringhtml = `<label>${i18next.t('manager.profil.personalApps')}</label>`;
        data.forEach(element => {

            let infoapp = "";

            if (user[0]) {
                if (user[0].hasOwnProperty('applications')) {
                    user[0].applications.some(function (item) {
                        if (element.id == item.id)
                            infoapp = item;
                    })
                }
            }

            if (!infoapp) {
                stringhtml += `<div class="c-checkbox">
                <input class="form-check-input appuser" type="checkbox" value="${element.id}" id="${methodName}_application_${element.id}">
                <label class="form-check-label font-weight-bold mb-2" style="color: var(--classroom-primary)" for="${methodName}_application_${element.id}" >
                    ${element.name}
                </label>
                <br>
                <div class="activity-add-form c-secondary-form" id="${methodName}_personal_apps_${element.id}" style="display:none;">
                    <label class="form-check-label" for="${methodName}_max_activities_${element.id}">${i18next.t('manager.group.maxActivities')}</label>
                    <input type="number" id="${methodName}_max_activities_${element.id}">
                </div>
                </div>`;
            } else {
                stringhtml += `<div class="c-checkbox">
                <input class="form-check-input appuser" type="checkbox" checked value="${element.id}" id="${methodName}_application_${element.id}">
                <label class="form-check-label font-weight-bold mb-2" style="color: var(--classroom-primary)" for="${methodName}_application_${element.id}">
                    ${element.name}
                </label>
                <br>
                <div class="activity-add-form c-secondary-form" id="${methodName}_personal_apps_${element.id}">
                    <label class="form-check-label" for="${methodName}_max_activities_${element.id}">${i18next.t('manager.group.maxActivities')}</label>
                    <input type="number" id="${methodName}_max_activities_${element.id}" value="${infoapp.max_activities}">
                </div>
                </div>`;
            }
        });

        Restrictions = `<h6 class="form-check-label font-weight-bold mb-1" style="color: var(--classroom-primary)">${i18next.t('manager.users.globalRestrictions')}</h6>
                        <br>
                        <div class="activity-add-form c-secondary-form">
                        <label class="form-check-label" for="update_begin_date">${i18next.t('manager.table.dateBeginFA')}</label>
                        <input type="date" id="update_begin_date" name="trip-start" value="${dateBegin}" max="2100-12-31">
                        <label class="form-check-label" for="update_end_date">${i18next.t('manager.table.dateEndFA')}</label>
                        <input type="date" id="update_end_date" name="trip-start" value="${dateEnd}" max="2100-12-31">
                        <label class="form-check-label" for="update_max_teacher">${i18next.t('manager.table.maxStudentsFA')}</label>
                        <input type="number" id="update_max_teacher" value="${maxStudents}">


                        <label class="form-check-label" for="update_max_classrooms">${i18next.t('manager.table.maxClassroomsFA')}</label>
                        <input type="number" id="update_max_classrooms" value="${maxClassrooms}">

                        </div>`;
        $('#update_global_user_restrictions').html(Restrictions);


        if (methodName == "update") {
            $('#update_personal_apps_sa').html(stringhtml);
        } else {
            $('#create_update_personal_apps_sa').html(stringhtml);
        }

        data.forEach(element => {
            $(`#${methodName}_application_${element.id}`).change(function () {
                $(`#${methodName}_personal_apps_${element.id}`).toggle();
                mainManager.getmanagerManager().getActivityRestrictionFromApp(element.id).then((res) => {
                    if ($(`#${methodName}_max_activities_${element.id}`).val() == "") {
                        $(`#${methodName}_max_activities_${element.id}`).val(res.max_per_teachers)
                    }
                });
            })
        });
    }

    mainManager.getmanagerManager().getAllApplications().then((res) => {
        mainManager.getmanagerManager()._allApplications = res;
        process(res)
    })
}

function persistUpdateUserApp(user = 0) {
    if (user == 0) {
        user = mainManager.getmanagerManager()._actualUserDetails[0].id;
    }

    let ApplicationsData = [];
    let GlobalRestrictions = [
        $('#update_begin_date').val(),
        $('#update_end_date').val(),
        $('#update_max_teacher').val(),
        $('#update_max_classrooms').val()
    ];

    $("input:checkbox.form-check-input.appuser").each(function (element) {
        const ApplicationTemp = [
            $(this).val(),
            $(this).is(':checked'),
            $('#update_max_activities_' + $(this).val()).val()
        ]
        ApplicationsData.push(ApplicationTemp);
    });

    mainManager.getmanagerManager().updateUserApps(user, JSON.stringify(ApplicationsData), JSON.stringify(GlobalRestrictions)).then((res) => {
        if (res.message == "success") {
            displayNotification('#notif-div', "manager.users.appsUpdated", "success");
            pseudoModal.closeAllModal();
            $('#user_apps_update').html("");
            tempoAndShowUsersTable();
        } else if (res.message == "User not found") {
            displayNotification('#notif-div', "manager.account.userNotFoundId", "error");
        } else if (res.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        }
    })
}

function showupdateUserModal(id) {
    let $groups = mainManager.getmanagerManager()._comboGroups;
    mainManager.getmanagerManager()._updatedUserGroup = 0;
    mainManager.getmanagerManager().getUserInfoWithHisGroups(id).then(function (res) {
        //get the personal apps 
        updateAppForUser();
        mainManager.getmanagerManager()._actualUserDetails = res;
        $("#update_actualgroup_sa").html("");
        $('#update_applications_sa').html("");
        $('#update_personal_apps_sa').html('');
        pseudoModal.openModal('manager-update-user');

        if (res[0].isRegular != null || res[0].isActive != null) {
            $('#update_u_mail_phone').hide();
        }

        $('#update_u_firstname').val(res[0].firstname);
        $('#update_u_surname').val(res[0].surname);
        $('#update_u_pseudo').val(res[0].pseudo);
        $('#update_u_id').val(res[0].id);

        if (res[0].isActive == true) {
            $('#update_u_is_active').prop("checked", true);
        } else {
            $('#update_u_is_active').prop("checked", false);
        }

        $('#update_u_bio').val(res[0].bio);
        $('#update_u_mail').val(res[0].email);
        $('#update_u_phone').val(res[0].telephone);

        $('#update_user_teacher_grade').change(() => {
            switch ($('#update_user_teacher_grade').val()) {
                case "0":
                    createSubjectSelect(getSubjects(0), 2);
                    break;
                case "1":
                    createSubjectSelect(getSubjects(1), 2);
                    break;
                case "2":
                    createSubjectSelect(getSubjects(2), 2);
                    break;
                case "3":
                    createSubjectSelect(getSubjects(3), 2);
                    break;
                case "4":
                    createSubjectSelect(getSubjects(4), 2);
                    break;
                default:
                    break;
            }
        })

        if (res[0].isTeacher != null) {
            $('#update_u_is_teacher').prop("checked", true);
            $('#update_u_school').val(res[0].school);
            $('#update_user_teacher_infos').show();
            // set the grade then trigger the function to set the good subject
            $('#update_user_teacher_grade').val(res[0].grade - 1);
            $("#update_user_teacher_grade").trigger("change");
            $('#update_user_teacher_subjects').val(res[0].subject - 1);
        } else {
            $('#update_u_is_teacher').prop("checked", false);
            $('#update_user_teacher_infos').hide();
        }

        if (res[0].isAdmin == true) {
            $('#update_u_is_admin').prop("checked", true);
        } else {
            $('#update_u_is_admin').prop("checked", false);
        }

        $("#update_u_is_teacher").change(() => {
            if ($('#update_u_is_teacher').is(':checked')) {
                $('#update_user_teacher_infos').show();
                createSubjectSelect(getSubjects(0), 2);
            } else {
                $('#update_user_teacher_infos').hide();
            }
        })

        if (res[0].hasOwnProperty('groups')) {
            for (let i = 0; i < res[0].groups.length; i++) {
                mainManager.getmanagerManager()._updatedUserGroup += 1;
                let group = `<div class="form-group c-secondary-form">
                                <label for="update_u_group${i}" data-i18n="manager.profil.group">Groupe</label>
                                <div class="input-group mb-3" id="update_u_actual_group${i}">
                                    <select class="form-control" id="update_u_group${i}">
                                    </select>
                                    <div class="input-group-append">
                                        <div class="input-group-text c-checkbox c-checkbox-grey input-group-selector">
                                            <input class="form-check-input" type="checkbox" id="update_u_is_group_admin${i}">
                                            <label class="form-check-label mx-1" for="update_u_is_group_admin${i}" data-i18n="manager.users.groupAdmin">
                                                Administrateur du groupe
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                $("#update_actualgroup_sa").append(group);
                if (res[0].groups[i].rights == 1) {
                    $('#update_u_is_group_admin' + i).prop("checked", true);
                }
                const item_id = 'update_u_group' + i;
                appendSelectGroups($groups, item_id);
                $('#update_u_group' + i).val(res[0].groups[i].id);
            }

            let html = "";
            html += "<label class='form-check-label font-weight-bold mb-1' style='color: var(--classroom-primary)' data-i18n='manager.profil.groupsApps'>Applications</label>";
            mainManager.getmanagerManager()._comboGroups.forEach(element => {
                if (element.id == mainManager.getmanagerManager()._actualGroup) {
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(application => {
                            let checked = ""
                            if (res[0].hasOwnProperty("applications_from_groups")) {
                                res[0].applications_from_groups.forEach(element => {
                                    if (application.id == element.application) {
                                        checked = "checked";
                                    }
                                });
                            }
                            html += `<div class="c-checkbox">
                                <input class="form-check-input" type="checkbox" name="group_app" id="group_app_${application.id}" value="${application.id}" ${checked}>
                                <label class="form-check-label" for="group_app_${application.id}">
                                    ${application.name}
                                </label>
                            </div>`;
                        })
                    }
                }
            });
            $('#update_applications_sa').html(html);

        } else {
            mainManager.getmanagerManager()._updatedUserGroup += 1;
            let group = `<div class="form-group c-secondary-form">
                            <label for="update_u_group0" data-i18n="manager.profil.group">Groupe</label>
                            <div class="input-group mb-3" id="update_u_actual_group0">
                                <select class="form-control" id="update_u_group0">
                                </select>
                                <div class="input-group-append">
                                    <div class="input-group-text c-checkbox c-checkbox-grey input-group-selector">
                                        <input class="form-check-input" type="checkbox" id="update_u_is_group_admin0">
                                        <label class="form-check-label mx-1" for="update_u_is_group_admin0" data-i18n="manager.users.groupAdmin">
                                            Administrateur du groupe
                                        </label>
                                    </div>
                                </div>
                                
                            </div>
                        </div>`;
            $("#update_actualgroup_sa").append(group);
            const item_id = 'update_u_group0';
            appendSelectGroups($groups, item_id);
        }
    });
}

function updateAddGroupmanager() {
    let $groups = mainManager.getmanagerManager()._comboGroups,
        nextGroup = mainManager.getmanagerManager()._updatedUserGroup;

    // fix
    if ($('#update_u_actual_group' + nextGroup)[0]) {
        for (i = 0; i <= nextGroup; i++) {
            if (!$('#update_u_actual_group' + i)[0]) {
                nextGroup = i;
                break;
            }
        }
    }

    let group = `<div class="input-group mb-3" id="update_u_actual_group${nextGroup}">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="checkbox" id="update_u_is_group_admin${nextGroup}">
                            <label class="form-check-label mx-1" for="update_u_is_group_admin${nextGroup}">
                            Administrateur du groupe
                            </label>
                        </div>
                    </div>
                    <select class="form-control" id="update_u_group${nextGroup}">
                    </select>
                    <button class="btn btn-danger ms-1" onclick="deleteGroupFromUpdate(${nextGroup})">Supprimer</button>
                </div>`;
    $("#update_actualgroup_sa").append(group);
    const item_id = 'update_u_group' + nextGroup;
    appendSelectGroups($groups, item_id);
    mainManager.getmanagerManager()._updatedUserGroup += 1;
}

function deleteGroupFromUpdate(id) {
    mainManager.getmanagerManager()._updatedUserGroup -= 1;
    $('#update_u_actual_group' + id).remove();
}

function updateUserModal() {
    let $firstname = $('#update_u_firstname').val(),
        $surname = $('#update_u_surname').val(),
        $user_id = $('#update_u_id').val(),
        $bio = $('#update_u_bio').val(),
        $mail = $('#update_u_mail').val(),
        $pseudo = $('#update_u_pseudo').val(),
        $phone = $('#update_u_phone').val(),
        $school = $('#update_u_school').val(),
        $is_active = $('#update_u_is_active').is(':checked'),
        $is_admin = $('#update_u_is_admin').is(':checked'),
        $is_teacher = $('#update_u_is_teacher').is(':checked'),
        $teacher_grade = $('#update_user_teacher_grade').length ? $('#update_user_teacher_grade').val() + 1 : null,
        $teacher_suject = $('#update_user_teacher_subjects').length ? $('#update_user_teacher_subjects').val() + 1 : null,
        $groups = [$('#update_u_is_group_admin0').is(':checked'), $('#update_u_group0').val()];

    $ApplicationFromGroup = [];
    $('[name="group_app"]').each(function () {
        const ApplicationTemp = [
            $(this).val(),
            $(this).is(':checked')
        ]
        $ApplicationFromGroup.push(ApplicationTemp);
    });


    mainManager.getmanagerManager().updateUser($user_id,
        $firstname,
        $surname,
        $pseudo,
        $phone,
        $mail,
        $bio,
        $groups,
        $is_admin,
        $is_teacher,
        $teacher_grade,
        $teacher_suject,
        $school,
        $is_active,
        JSON.stringify($ApplicationFromGroup)).then((response) => {
            if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userUpdated", "success");
                persistUpdateUserApp();
            } else if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            } else if (response.response == false) {
                displayNotification('#notif-div', "manager.group.groupFull", "error");
            } else if (response.message == "maxStudentsFromTeacher") {
                displayNotification('#notif-div', "manager.group.toManyStudentsFromTheTeacher", "error");
            } else if (response.message = "maxStudentsInGroup") {
                displayNotification('#notif-div', "manager.group.toManyStudentsInGroup", "error");
            }
        });
}


function createUserAndLinkToGroup() {
    let $firstname = $('#u_firstname').val(),
        $surname = $('#u_surname').val(),
        $bio = $('#u_bio').val(),
        $mail = $('#u_mail').val(),
        $pseudo = $('#u_pseudo').val(),
        $phone = $('#u_phone').val(),
        $school = $('#u_school').val(),
        $is_admin = $('#u_is_admin').is(':checked'),
        $is_teacher = $('#u_is_teacher').is(':checked'),
        $teacher_grade = $('#user_teacher_grade').length ? $('#user_teacher_grade').val() : null,
        $teacher_suject = $('#user_teacher_subjects').length ? $('#user_teacher_subjects').val() : null,
        $groups = [],
        $applications = [
            $('#create_begin_date').val(),
            $('#create_end_date').val(),
            $('#create_max_students').val(),
            [],
            $('#create_max_classrooms').val(),
        ];


    $(`input[id^="create_application_"]`).each(function () {
        let appData = [];
        let appID = $(this)[0].id.replace('create_application_', '');
        appData.push($(this).val());
        appData.push($(this).is(':checked'));
        appData.push($("#create_max_activities_" + appID).val());
        $applications[3].push(appData);
    })

    $groups.push([$('#u_is_group_admin').is(':checked'), $('#u_group').val()])
    for (let index = 0; index < mainManager.getmanagerManager()._addedCreateUserGroup; index++) {
        $groups.push([$('#u_is_group_admin' + index).is(':checked'), $('#u_group' + index).val()])
    }

    mainManager.getmanagerManager().createUserAndLinkToGroup($firstname,
        $surname,
        $pseudo,
        $phone,
        $mail,
        $bio,
        $groups,
        $is_admin,
        $is_teacher,
        $teacher_grade,
        $teacher_suject,
        $school,
        $applications).then((response) => {
            if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userCreated", "success");
                if (response.mail == true) {
                    displayNotification('#notif-div', "manager.users.mailSentToUser", "success");
                } else {
                    displayNotification('#notif-div', "manager.users.mailSentToUser", "error");
                }
                pseudoModal.closeAllModal();
                tempoAndShowUsersTable()
            } else if (response.message == "mailAlreadyExist") {
                displayNotification('#notif-div', "classroom.notif.emailExists", "error");
            } else if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            } else if (response.response == false) {
                displayNotification('#notif-div', "manager.group.groupFull", "error");
            }
        });
    pseudoModal.closeAllModal();
    tempoAndShowUsersTable()
}


function tempoAndShowGroupsTable() {
    let sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    setTimeout(() => {
        mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
    }, 500);
}

function tempoAndShowUsersTable() {
    let sort = $('#sort_users_filter').val(),
        usersperpage = $('#users_per_page').val(),
        group_actuel = mainManager.getmanagerManager()._actualGroup;
    setTimeout(() => {
        mainManager.getmanagerManager().showGroupMembers(group_actuel, 1, usersperpage, sort);
    }, 500);
}

function tempoAndShowUsersTableGroupAdmin() {
    let actualGroup = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    setTimeout(() => {
        mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(actualGroup, 1);
    }, 500);
}

function tempoAndShowGroupTableGroupAdmin() {
    setTimeout(() => {
        mainGroupAdmin.getGroupAdminManager().getGroupsUserAdmin();
    }, 500);
}

function switchTomanager() {
    $('body').addClass('theme-super-admin').removeClass("theme-group-admin theme-teacher")
    $('#classroom-dashboard-sidebar-teacher').hide();
    $('#groupadmin-dashboard-sidebar').hide();
    $('#manager-dashboard-sidebar').show();
    navigatePanel('classroom-dashboard-profil-panel-manager', 'dashboard-profil-manager');
    pseudoModal.closeAllModal();
    mainManager.getmanagerManager().getDefaultRestrictions().then(function (res2) {
        mainManager.getmanagerManager()._defaultRestrictions = res2;
    });
}

function switchToGroupAdmin() {
    $('body').addClass('theme-group-admin').removeClass("theme-super-admin theme-teacher")
    $('#classroom-dashboard-sidebar-teacher').hide();
    $('#manager-dashboard-sidebar').hide();
    $('#groupadmin-dashboard-sidebar').show();

    mainGroupAdmin.getGroupAdminManager().getGroupUserAdminId().then((response) => {
        if (response[0] != undefined) {
            mainGroupAdmin.getGroupAdminManager()._actualGroup = response[0].id;
            mainGroupAdmin.getGroupAdminManager().isGroupsApplicationsOutDated(response[0].id);
        }
    })
    pseudoModal.closeAllModal();
}

function switchToProf() {
    $('body').addClass('theme-teacher').removeClass("theme-group-admin theme-super-admin")
    navigatePanel('classroom-dashboard-profil-panel-teacher', 'dashboard-profil-teacher');
    $('#manager-dashboard-sidebar').hide();
    $('#groupadmin-dashboard-sidebar').hide();
    $('#classroom-dashboard-sidebar-teacher').show();
}

function deleteGroup(id) {
    mainManager.getmanagerManager()._actualGroup = id;
    $('#validation_delete_group').val("");
    pseudoModal.openModal('manager-delete-group');
    mainManager.getmanagerManager()._comboGroups.forEach(element => {
        if (element.id == id) {
            $('#md_group').text(element.name);
        }
    });
}

function persistDeleteGroup() {
    let validation = $('#validation_delete_group').val();
    let placeholderWord = $('#validation_delete_group').attr('placeholder');
    const group = mainManager.getmanagerManager()._actualGroup;
    if (validation == placeholderWord) {
        mainManager.getmanagerManager().deleteGroup(group).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.group.groupDeleteError", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.group.groupDeleted", "success");
                mainManager.getmanagerManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowGroupsTable();
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function cancelDeleteGroup() {
    $('#md_group').text("");
    pseudoModal.closeAllModal();
}

function deleteUser(id, name) {
    mainManager.getmanagerManager()._actualUser = id;
    $('#validation_delete').val("");
    pseudoModal.openModal('manager-delete-user');
    $('#mde_firstname').text(name);

}

/**
 * 
 * @param {*} id 
 * @param {*} name 
 */
function deleteUserGroupAdmin(id, name) {
    mainGroupAdmin.getGroupAdminManager()._actualUser = id;
    $('#validation_deleteGroupAdmin').val("");
    pseudoModal.openModal('groupadmin-delete-user');
    $('#md_firstnameGA').text(name);
}

function activateUserGroupAdmin(id) {
    mainGroupAdmin.getGroupAdminManager().activateUser(id).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.users.activated", "success");
            mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(mainGroupAdmin.getGroupAdminManager()._actualGroup, 1);
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.users.errorActivation", "error");
        }
    })
}

function disableUser(id, name) {
    mainManager.getmanagerManager()._actualUser = id;
    $('#validation_disable').val("");
    pseudoModal.openModal('manager-disable-user');
    $('#mdi_firstname').text(name);
}

function disableUserGroupAdmin(id, name) {
    mainGroupAdmin.getGroupAdminManager()._actualUser = id;
    $('#validation_deleteGroupAdmin').val("");
    pseudoModal.openModal('groupadmin-disable-user');
    $('#md_firstnameGA').text(name);
}

function activeUserGroupAdmin(id, name) {
    mainGroupAdmin.getGroupAdminManager()._actualUser = id;
    $('#validation_activeGroupAdmin').val("");
    pseudoModal.openModal('groupadmin-active-user');
    $('#md_firstnameGA').text(name);
}

function persistDisable() {
    let validation = $('#validation_disable').val();
    let placeholderWord = $('#validation_disable').attr('placeholder');
    const user = mainManager.getmanagerManager()._actualUser;
    if (validation == placeholderWord) {
        mainManager.getmanagerManager().disableUser(user).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.account.notAllowedDisableUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userDisabled", "success");
                mainManager.getmanagerManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTable()
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistDelete() {
    let validation = $('#validation_delete').val(),
        placeholderWord = $('#validation_delete').attr('placeholder');
    const user = mainManager.getmanagerManager()._actualUser;
    if (validation == placeholderWord) {
        mainManager.getmanagerManager().deleteUser(user).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.account.notAllowedDeleteUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userDeleted", "success");
                mainManager.getmanagerManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTable();
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistDisableGroupAdmin() {
    let validation = $('#validation_disableGroupAdmin').val(),
        placeholderWord = $('#validation_disableGroupAdmin').attr('placeholder');
    const user = mainGroupAdmin.getGroupAdminManager()._actualUser;
    if (validation == placeholderWord) {
        mainGroupAdmin.getGroupAdminManager().disableUser(user).then((response) => {
            if (response.message == "not_allowed") {
                displayNotification('#notif-div', "manager.account.notAllowedDeleteUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userDeleted", "success");
                mainGroupAdmin.getGroupAdminManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTableGroupAdmin()
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistDeleteGroupAdmin() {
    let validation = $('#validation_deleteGroupAdmin').val(),
        placeholderWord = $('#validation_deleteGroupAdmin').attr('placeholder');
    const user = mainGroupAdmin.getGroupAdminManager()._actualUser;
    if (validation == placeholderWord) {
        mainGroupAdmin.getGroupAdminManager().deleteUser(user).then((response) => {
            if (response.message == "not_allowed") {
                displayNotification('#notif-div', "manager.account.notAllowedDeleteUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userDeleted", "success");
                mainGroupAdmin.getGroupAdminManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTableGroupAdmin()
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

/**
 * Show an alert message 
 * @param {int} i : 0 = class success, 1 = class danger
 * @param {string} id : the id of the div we need to interact with
 * @param {string} message : the message we need to show
 */
function switchAlertModal(i, id, message) {
    $(id).text(message);
    if (i == 0) {
        $(id).removeClass("alert-danger");
        $(id).addClass("alert-success");
    } else if (i == 1) {
        $(id).addClass("alert-danger");
        $(id).removeClass("alert-success");
    }
    $(id).fadeIn(1000);
    setTimeout(function () {
        $(id).fadeOut(1000);
    }, 3500);
}

function cancelDelete() {
    $('#md_firstnameGA').text("");
    pseudoModal.closeAllModal();
}

function cancelDisable() {
    $('#md_firstnameGA').text("");
    pseudoModal.closeAllModal();
}

function cancelDeleteGroupAdmin() {
    $('#md_firstnameGA').text("");
    pseudoModal.closeAllModal();
}

/* function showGroupMembers($group_id, $page, $userspp, $sort) {
    mainManager.getmanagerManager()._actualGroup = $group_id;
    mainManager.getmanagerManager().showGroupMembers($group_id, $page, $userspp, $sort);
    $('#table_details_users').show();
    $('#table_details_admins').hide();
    $('#paginationButtons_users').show();
    $('#paginationButtons_groups').hide();
    $('#users_options').show();
    $('#groups_options').hide();
    $('#btn-create-manager').hide();
} */



function showGroupMembers(group_id, page, userspp, sort) {
    const mgr = mainManager.getmanagerManager();
    mgr._actualGroup = group_id;


    setDisplay('table_details_users', true);
    setDisplay('table_details_admins', false);
    setDisplay('paginationButtons_users', false);
    setDisplay('paginationButtons_groups', false);
    setDisplay('users_options', true);
    setDisplay('groups_options', false);
    setDisplay('btn-create-manager', false);

    mgr.showGroup(group_id, page, userspp, sort);
}

function setDisplay(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? '' : 'none';
}

function showGroupMembersGroupAdmin(id) {
    $('#group-monitoring').hide();
    $('#groupadmin_groups').hide();
    mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(id, 1)
    $('#table_details_users_groupadmin').show();
}

function optionsGroupApplications($type) {

    const process = (data) => {
        $('#group_upd_apps_options').html("");
        $('#group_apps_options').html("");

        let stringhtml = "",
            actualGroup = mainManager.getmanagerManager()._actualGroup;

        data.forEach(element => {
            let $infoapp = "";

            if ($type == "update") {
                actualGroup[0].applications.some(function (item) {
                    if (element.id == item.application_id)
                        $infoapp = item;
                })
            }

            if (!$infoapp) {
                stringhtml += `<div class="c-checkbox">
                <input class="form-check-input app" type="checkbox" value="${element.id}" id="application_${element.id}">
                <label class="form-check-label font-weight-bold mb-2" for="application_${element.id}" style="color: var(--classroom-primary)">
                    ${element.name}
                </label>
                <br>
                <div class="activity-add-form c-secondary-form" id="apps_restriction_${element.id}" style="display:none;">

                    <label class="form-check-label" for="max_activities_per_groups_${element.id}">${i18next.t('manager.group.activitiesPerGroup')}</label>
                    <input type="number" id="max_activities_per_groups_${element.id}">

                    <label class="form-check-label" for="max_activities_per_teachers_${element.id}">${i18next.t('manager.group.activitiesPerTeacher')}</label>
                    <input type="number" id="max_activities_per_teachers_${element.id}">

                </div>
                </div><hr>`;
            } else {

                stringhtml += `<div class="c-checkbox">
                <input class="form-check-input app" type="checkbox" checked value="${element.id}" id="application_${element.id}">
                <label class="form-check-label font-weight-bold mb-2" for="application_${element.id}" style="color: var(--classroom-primary)">
                    ${element.name}
                </label>
                <br>
                <div class="activity-add-form c-secondary-form" id="apps_restriction_${element.id}">

                    <label class="form-check-label" for="max_activities_per_groups_${element.id}">${i18next.t('manager.group.activitiesPerGroup')}</label>
                    <input type="number" id="max_activities_per_groups_${element.id}" value="${$infoapp.max_activities_per_groups}">

                    <label class="form-check-label" for="max_activities_per_teachers_${element.id}">${i18next.t('manager.group.activitiesPerTeacher')}</label>
                    <input type="number" id="max_activities_per_teachers_${element.id}" value="${$infoapp.max_activities_per_teachers}">
                </div>
                </div><hr>`;
            }

        });

        if ($type == "update")
            $('#group_upd_apps_options').html(stringhtml);
        else if ($type == "create")
            $('#group_apps_options').html(stringhtml);

        // toggle the description if the checkbox is checked
        data.forEach(element => {
            $(`#application_${element.id}`).change(function () {
                $(`#apps_restriction_${element.id}`).toggle();

                mainManager.getmanagerManager().getActivityRestrictionFromApp(element.id).then((response) => {
                    if ($(`#max_activities_per_groups_${element.id}`).val() == "" && response != null) {
                        $(`#max_activities_per_groups_${element.id}`).val(response.max_per_teachers)
                    }
                    if ($(`#max_activities_per_teachers_${element.id}`).val() == "" && response != null) {
                        $(`#max_activities_per_teachers_${element.id}`).val(response.max_per_teachers)
                    }
                });
            })
        });

    }
    if (mainManager.getmanagerManager()._allApplications == "") {
        mainManager.getmanagerManager().getAllApplications().then((res) => {
            mainManager.getmanagerManager()._allApplications = res;
            process(res)
        })
    } else {
        process(mainManager.getmanagerManager()._allApplications)
    }
}

function createSubjectSelect(array, type) {
    let html = "";
    switch (type) {
        case 0:
            html = $("#user_teacher_subjects");
            break;
        case 1:
            html = $("#user_teacher_subjects_ga");
            break;
        case 2:
            html = $("#update_user_teacher_subjects");
            break;
        case 3:
            html = $("#update_user_teacher_subjects_ga");
            break;
        default:
            break;
    }
    html.empty();
    for (let index = 0; index < array.length; index++) {
        const o = new Option(array[index], index);
        $(o).html(array[index]);
        html.append(o);
    }
}

$('#dashboard-groupadmin-users-side').click(() => {
    //let actualGroup = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    getTheGroupOftheAdmin();
})

function getTheGroupOftheAdmin() {
    mainGroupAdmin.getGroupAdminManager().getGroupsUserAdmin();
}

$('#dashboard-groupadmin-apps').click(() => {
    getGroupMonitoring();
})

function showUpdateUserModalGroupAdmin(user_id) {
    const groupAdminManager = mainGroupAdmin.getGroupAdminManager();
    const groups = groupAdminManager._comboGroups;
    groupAdminManager._updatedUserGroup = 0;

    groupAdminManager.getUserInfoWithHisGroups(user_id).then(function (res) {
        if (res.message === "not_allowed") {
            displayNotification('#notif-div', "manager.account.notAllowedUpdateUser", "error");
            return;
        }

        // Réinitialisation et ouverture de la modale
        const actualGroupEl = document.getElementById('update_actualgroup_ga');
        const applicationsEl = document.getElementById('update_applications_ga');
        if (actualGroupEl) actualGroupEl.innerHTML = "";
        if (applicationsEl) applicationsEl.innerHTML = "";
        pseudoModal.openModal('groupadmin-update-user');

        // Remplissage des champs utilisateur en vérifiant que l'élément existe
        const firstnameEl = document.getElementById('update_u_firstname_ga');
        if (firstnameEl) firstnameEl.value = res[0].firstname;
        const surnameEl = document.getElementById('update_u_surname_ga');
        if (surnameEl) surnameEl.value = res[0].surname;
        const pseudoEl = document.getElementById('update_u_pseudo_ga');
        if (pseudoEl) pseudoEl.value = res[0].pseudo;
        const idEl = document.getElementById('update_u_id_ga');
        if (idEl) idEl.value = res[0].id;
        const bioEl = document.getElementById('update_u_bio_ga');
        if (bioEl) bioEl.value = res[0].bio;
        const mailEl = document.getElementById('update_u_mail_ga');
        if (mailEl) mailEl.value = res[0].email;
        const phoneEl = document.getElementById('update_u_phone_ga');
        if (phoneEl) phoneEl.value = res[0].telephone;

        // Affichage des applications
        renderApplications(res[0], groups);

        // Gestion du changement de grade pour afficher les matières associées
        const teacherGradeEl = document.getElementById('update_user_teacher_grade_ga');
        if (teacherGradeEl) {
            teacherGradeEl.onchange = function () {
                const grade = parseInt(this.value, 10);
                createSubjectSelect(getSubjects(grade), 3);
            };

            teacherGradeEl.value = res[0].grade - 1;
            teacherGradeEl.dispatchEvent(new Event('change'));
        }

        // Partie enseignant
        const schoolEl = document.getElementById('update_u_school_ga');
        if (schoolEl) schoolEl.value = res[0].school;
        const subjectsEl = document.getElementById('update_user_teacher_subjects_ga');
        if (subjectsEl) subjectsEl.value = res[0].subject - 1;

        // Affichage des groupes de l'utilisateur
        renderGroups(res[0]);
    }).catch(function (error) {
        console.error("Erreur lors de la récupération des infos utilisateur :", error);
    });
}

function renderApplications(userData, groups) {
    let html = "";
    let hasApp = false;

    groups.forEach(element => {
        if (element.id == mainGroupAdmin.getGroupAdminManager()._actualGroup && element.hasOwnProperty('applications')) {
            element.applications.forEach(application => {
                hasApp = true;
                let checked = "";
                if (userData.hasOwnProperty("applications_from_groups")) {
                    userData.applications_from_groups.forEach(item => {
                        if (application.id == item.application) {
                            checked = "checked";
                        }
                    });
                }
                html += `
                    <div class="c-checkbox">
                        <input class="form-check-input" type="checkbox" name="group_app" id="group_app_${application.id}" value="${application.id}" ${checked}>
                        <label class="form-check-label" for="group_app_${application.id}">${application.name}</label>
                    </div>`;
            });
        }
    });

    const updateAppGa = document.getElementById('update_applications_ga');
    if (updateAppGa) {
        if (hasApp) {
            const title = "<label class='form-check-label font-weight-bold mb-1' style='color: var(--classroom-primary)' data-i18n='manager.profil.groupsApps'>Applications</label>";
            updateAppGa.innerHTML = title + html;
        } else {
            updateAppGa.innerHTML = "";
        }
    }
}

function renderGroups(userData) {
    const currentUserId = UserManager.getUser().id;
    const groupsContainer = document.getElementById('update_actualgroup_ga');
    let updatedUserGroup = 0;

    if (userData.hasOwnProperty('groups') && groupsContainer) {
        userData.groups.forEach((groupData, i) => {
            updatedUserGroup++;
            // Si l'utilisateur connecté est celui dont on affiche les infos, on désactive la modification du statut "group admin"
            const isCurrentUser = currentUserId == userData.id;
            const groupHtml = `
                <div class="form-group c-secondary-form">
                    <label for="update_u_group_ga${i}" data-i18n="manager.profil.group">Groupe</label>
                    <div class="input-group mb-3" id="update_u_actual_group_ga${i}">
                        <select class="form-control" id="update_u_group_ga${i}" disabled></select>
                        <div class="input-group-append">
                            <div class="input-group-text c-checkbox c-checkbox-grey input-group-selector">
                                <input type="checkbox" id="update_u_is_group_admin_ga${i}" ${isCurrentUser ? 'disabled' : ''}>
                                <label class="form-check mx-1" for="update_u_is_group_admin_ga${i}">Administrateur du groupe</label>
                            </div>
                        </div>
                    </div>
                </div>`;
            groupsContainer.insertAdjacentHTML('beforeend', groupHtml);

            const selectId = 'update_u_group_ga' + i;
            appendSelectGroups(mainGroupAdmin.getGroupAdminManager()._comboGroups, selectId);
            const selectEl = document.getElementById(selectId);
            if (selectEl) selectEl.value = groupData.id;

            const checkboxEl = document.getElementById('update_u_is_group_admin_ga' + i);
            if (checkboxEl && groupData.rights == 1) {
                checkboxEl.checked = true;
            }
        });
        mainGroupAdmin.getGroupAdminManager()._updatedUserGroup = updatedUserGroup;
    }
}



function deleteGroupFromUpdateGroupAdmin(id) {
    mainGroupAdmin.getGroupAdminManager()._updatedUserGroup -= 1;
    $('#update_u_actual_group_ga' + id).remove();
}

function updateUserModalGroupAdmin() {
    let $firstname = $('#update_u_firstname_ga').val(),
        $surname = $('#update_u_surname_ga').val(),
        $user_id = $('#update_u_id_ga').val(),
        $bio = $('#update_u_bio_ga').val(),
        $mail = $('#update_u_mail_ga').val(),
        $pseudo = $('#update_u_pseudo_ga').val(),
        $phone = $('#update_u_phone_ga').val(),
        $school = $('#update_u_school_ga').val(),
        $teacher_grade = $('#update_user_teacher_grade_ga').lenght ? $('#update_user_teacher_grade_ga').val() : null,
        $teacher_suject = $('#update_user_teacher_subjects_ga').length ? $('#update_user_teacher_subjects_ga').val() : null,
        $groups = [$('#update_u_is_group_admin_ga0').is(':checked'), $('#update_u_group_ga0').val()];


    $ApplicationFromGroup = [];
    $('[name="group_app"]').each(function () {
        const ApplicationTemp = [
            $(this).val(),
            $(this).is(':checked')
        ]
        $ApplicationFromGroup.push(ApplicationTemp);
    });


    mainGroupAdmin.getGroupAdminManager().updateUser($user_id,
        $firstname,
        $surname,
        $pseudo,
        $phone,
        $mail,
        $bio,
        $groups,
        $teacher_grade,
        $teacher_suject,
        $school,
        JSON.stringify($ApplicationFromGroup)).then((response) => {
            if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userUpdated", "success");
                pseudoModal.closeAllModal();
            } else if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            } else if (response.message == "maxStudentsFromTeacher") {
                displayNotification('#notif-div', "manager.group.toManyStudentsFromTheTeacher", "error");
            } else if (response.message == "maxStudentsInGroup") {
                displayNotification('#notif-div', "manager.group.toManyStudentsInGroup", "error");
            } else if (response.message == "outDated") {
                displayNotification('#notif-div', "manager.apps.outDatedApp", "error");
            }
        });
    tempoAndShowUsersTableGroupAdmin();
}

$('#users_per_page_groupadmin, #sort_users_filter_groupadmin').change(() => {
    let actualGroup = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(actualGroup, 1);
})
// 1. On bind l'événement uniquement si l'élément existe
const createUserLink = document.getElementById('create_user_link_to_group_groupadmin');
if (createUserLink) {
    createUserLink.addEventListener('click', onCreateUserClick);
}

async function onCreateUserClick() {
    resetForm();
    const manager = mainGroupAdmin.getGroupAdminManager();
    const groupId = manager._actualGroup;

    try {
        const response = await manager.isGroupFull(groupId);
        if (response.message === 'limit') {
            displayNotification('#notif-div', 'manager.group.groupFullAdminMessage', 'error');
            return;
        }
        // Ouverture du modal et peuplement des sections
        pseudoModal.openModal('groupeadmin-create-user');
        buildGroupSelector();
        bindGradeChange();
        // affiche les matières pour le grade 0 par défaut
        createSubjectSelect(getSubjects(0), 1);
        buildApplicationsList(groupId);
    } catch (err) {
        console.error('Erreur vérif. groupe plein :', err);
        displayNotification('#notif-div', 'manager.group.checkError', 'error');
    }
}

function resetForm() {
    ['group_add_ga', 'create_applications_ga'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    ['u_firstname_ga', 'u_surname_ga', 'u_bio_ga', 'u_mail_ga', 'u_pseudo_ga', 'u_phone_ga', 'u_school_ga'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    ['user_teacher_grade_ga', 'user_teacher_subjects_ga'].forEach(id => {
        const sel = document.getElementById(id);
        if (sel) sel.selectedIndex = 0;
    });

    const chk = document.getElementById('u_is_group_admin_ga');
    if (chk) chk.checked = false;

    mainGroupAdmin.getGroupAdminManager()._addedCreateUserGroup = 0;
}

function buildGroupSelector() {
    const manager = mainGroupAdmin.getGroupAdminManager();
    const comboGroups = manager._comboGroups;
    const container = document.getElementById('allGroupsGA');
    if (!container) return;

    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    comboGroups.forEach(group => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('form-group', 'c-secondary-form');

        const label = document.createElement('label');
        label.setAttribute('data-i18n', 'manager.profil.group');
        label.innerText = 'Groupe';

        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group', 'mb-3');

        const select = document.createElement('select');
        select.classList.add('form-control');
        select.disabled = true;
        select.id = 'create_u_group_ga';
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.name;
        select.appendChild(option);

        const appendDiv = document.createElement('div');
        appendDiv.classList.add('input-group-append');
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('input-group-text', 'c-checkbox', 'c-checkbox-grey', 'input-group-selector');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'checkboxAdmin';
        checkbox.dataset.groupId = group.id;
        const checkboxLabel = document.createElement('label');
        checkboxLabel.classList.add('form-check', 'mx-1');
        checkboxLabel.setAttribute('for', 'checkboxAdmin');
        checkboxLabel.innerText = 'Administrateur du groupe';

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(checkboxLabel);
        appendDiv.appendChild(checkboxWrapper);
        inputGroup.appendChild(select);
        inputGroup.appendChild(appendDiv);
        wrapper.appendChild(label);
        wrapper.appendChild(inputGroup);
        frag.appendChild(wrapper);
    });

    container.appendChild(frag);
}

function bindGradeChange() {
    const gradeSelect = document.getElementById('user_teacher_grade_ga');
    if (!gradeSelect) return;

    gradeSelect.addEventListener('change', () => {
        const grade = Number(gradeSelect.value) || 0;
        createSubjectSelect(getSubjects(grade), 1);
    });
}

function buildApplicationsList(actualGroupId) {
    const manager = mainGroupAdmin.getGroupAdminManager();
    const group = manager._comboGroups.find(g => g.id === actualGroupId);
    const container = document.getElementById('create_applications_ga');
    if (!container) return;

    container.innerHTML = '';
    if (!group || !group.applications) return;

    const title = document.createElement('label');
    title.classList.add('form-check-label', 'font-weight-bold', 'mb-1');
    title.style.color = 'var(--classroom-primary)';
    title.setAttribute('data-i18n', 'manager.profil.groupsApps');
    title.innerText = 'Applications';
    container.appendChild(title);

    const frag = document.createDocumentFragment();
    group.applications.forEach(app => {
        const div = document.createElement('div');
        div.classList.add('form-check');
        const input = document.createElement('input');
        input.classList.add('form-check-input');
        input.type = 'checkbox';
        input.name = 'create_group_app';
        input.id = `group_app_${app.id}`;
        input.value = app.id;
        const label = document.createElement('label');
        label.classList.add('form-check');
        label.setAttribute('for', `group_app_${app.id}`);
        label.innerText = app.name;
        div.appendChild(input);
        div.appendChild(label);
        frag.appendChild(div);
    });
    container.appendChild(frag);
}


function createUserAndLinkToGroup_groupAdmin() {
    let $firstname = $('#u_firstname_ga').val(),
        $surname = $('#u_surname_ga').val(),
        $bio = $('#u_bio_ga').val(),
        $mail = $('#u_mail_ga').val(),
        $pseudo = $('#u_pseudo_ga').val(),
        $phone = $('#u_phone_ga').val(),
        $school = $('#u_school_ga').val(),
        $groups = [
            $('#checkboxAdmin').is(':checked'),
            $('#create_u_group_ga').val()
        ],
        $teacher_grade = $('#user_teacher_grade_ga').length ? $('#user_teacher_grade_ga').val() + 1 : null,
        $teacher_suject = $('#user_teacher_subjects_ga').length ? $('#user_teacher_subjects_ga').val() + 1 : null;

    $ApplicationFromGroup = [];
    $('[name="create_group_app"]').each(function () {
        const ApplicationTemp = [
            $(this).val(),
            $(this).is(':checked')
        ]
        $ApplicationFromGroup.push(ApplicationTemp);
    });


    mainGroupAdmin.getGroupAdminManager().createUserAndLinkToGroup($firstname,
        $surname,
        $pseudo,
        $phone,
        $mail,
        $bio,
        $groups,
        $teacher_grade,
        $teacher_suject,
        $school,
        $ApplicationFromGroup
    ).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.users.userCreated", "success");
            if (response.mail == true) {
                displayNotification('#notif-div', "manager.users.mailSentToUser", "success");
            } else {
                displayNotification('#notif-div', "manager.users.mailSentToUser", "error");
            }
            pseudoModal.closeAllModal();
            tempoAndShowGroupTableGroupAdmin()
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        } else if (response.message == "mailAlreadyExist") {
            displayNotification('#notif-div', "classroom.notif.emailExists", "error");
        } else if (response.message == "limit") {
            displayNotification('#notif-div', "manager.group.groupFullAdminMessage", "error");
        } else if (response.message == "not-admin") {
            displayNotification('#notif-div', "manager.account.notAllowedToCreateUserInThisGroup", "error");
        }
    });
}

function resetUserPassword(id) {
    mainManager.getmanagerManager().sendResetPassword(id).then((response) => {
        if (response.isSent == true) {
            displayNotification('#notif-div', "manager.users.mailSentToUserReset", "success");
        } else {
            displayNotification('#notif-div', "manager.users.mailNotSentToUserReset", "error");
        }
        pseudoModal.openModal('manager-show-resetlink');
        $('#passwordLink').val(response.link);
    })
}

function dismissModal() {
    pseudoModal.closeAllModal();
}

function resetUserPasswordga(id) {
    mainGroupAdmin.getGroupAdminManager().sendResetPassword(id).then((response) => {
        if (response.message != "not_allowed") {
            if (response.isSent == true) {
                displayNotification('#notif-div', "manager.users.mailSentToUserReset", "success");
            } else {
                displayNotification('#notif-div', "manager.users.mailNotSentToUserReset", "error");
            }
            pseudoModal.openModal('manager-show-resetlink');
            $('#passwordLink').val(response.link);
        } else {
            displayNotification('#notif-div', "manager.account.notAllowedUpdateUser", "error");
        }
    })
}

function copyLink(id) {
    const copyText = $(id);
    copyText.select();
    document.execCommand("copy");
}

$('#search_user_groupadmin').click(() => {
    let name = $('#name_user_search_groupadmin').val(),
        usersperpage = $('#users_per_page_groupadmin').val();
    if (name != "") {
        mainGroupAdmin.getGroupAdminManager().globalSearchUser(name, 1, usersperpage);
    } else {
        tempoAndShowGroupTableGroupAdmin();
    }
})


function getGroupLinkGA(id) {
    mainGroupAdmin.getGroupAdminManager().getGroupLink(id).then((response) => {
        pseudoModal.openModal('groupadmin-show-grouplink');
        $('#groupLink').val(response.link);
    })
}


function getGrades() {
    let Arr = [];
    for (let i = 0; i < 5; i++) {
        Arr.push(i18next.t(`manager.users.teacherGrades.${i}`))
    }
    return Arr;
}

function getSubjects(grade) {
    let subjectsLength = 0;
    switch (grade) {
        case 0:
            subjectsLength = 2;
            break;
        case 1:
            subjectsLength = 11;
            break;
        case 2:
            subjectsLength = 38;
            break;
        case 3:
            subjectsLength = 12;
            break;
        case 4:
            subjectsLength = 2;
            break;
        default:
            break;
    }
    let TmpArr = [];
    for (let i = 0; i < subjectsLength; i++) {
        TmpArr.push(i18next.t(`manager.users.teacherSubjects.${grade}.${i}`))
    }
    return TmpArr;
}


/**
 * Get the grade and the subject in the user language
 */
const Grade = getGrades();


// Applications management 
function isUserAppsOutDated() {
    mainGroupAdmin.getGroupAdminManager().isUserApplicationsOutDated().then((response) => {
        if (response.message == true) {
            const Apps = response.applications;
            let text = "";
            Apps.forEach(app => {
                const event = new Date(app.date_end.date);
                let stringToShow = i18next.t('manager.account.subscriptionOudated');
                stringToShow = stringToShow.replace("APPNAME", app.app.name);
                stringToShow = stringToShow.replace("DATE", event.toLocaleDateString());
                text += stringToShow;
            });
            $('#info-applications').html(text);
            $('#info-applications').show();
        }
    })
}

function isGroupAppsOutDated(group_id) {
    mainGroupAdmin.getGroupAdminManager().isGroupsApplicationsOutDated(group_id).then((response) => {
        if (response.message == true) {
            const Apps = response.applications;
            let text = "";
            Apps.forEach(app => {
                const event = new Date(app.date_end.date);
                let stringToShow = i18next.t('manager.account.subscriptionOudated');
                stringToShow = stringToShow.replace("APPNAME", app.app.name);
                stringToShow = stringToShow.replace("DATE", event.toLocaleDateString());
                text += stringToShow;
            });
            $('#info-group-applications').html(text);
            $('#info-group-applications').show();
        }
        getGroupMonitoring();
    })
}

function getGroupMonitoring() {
    let actualGroup = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    mainGroupAdmin.getGroupAdminManager().getMonitoringGroup(actualGroup).then((response) => {
        showMonitoring(response);
    })
}

function showMonitoring(data) {
    let html = "";
    let htmlGlobal = "";
    $('#group-monitoring-body').html();
    $('#group-monitoring-global-body').html();

    if (data.hasOwnProperty('applications')) {
        let dateBegin = null;
        let dateEnd = null;
        if (data.dateBegin != null && data.dateEnd != null) {
            dateBegin = new Date(data.dateBegin.date).toLocaleDateString();
            dateEnd = new Date(data.dateEnd.date).toLocaleDateString();
        }

        let outDatedString = "";
        if (data.outDated == 0) {
            outDatedString = i18next.t('manager.apps.appStatus0');
        } else if (data.outDated == 1) {
            outDatedString = i18next.t('manager.apps.appStatus1');
        } else if (data.outDated == 2) {
            outDatedString = i18next.t('manager.apps.appStatus2');
        }


        htmlGlobal = `<td>${outDatedString}</td>
                        <td>${dateBegin}</td>
                        <td>${dateEnd}</td>
                        <td>${data.maxStudents}</td>
                        <td>${data.actualStudents}</td>
                        <td>${data.maxTeachers}</td>
                        <td>${data.groupTotalTeachers}</td>
                        <td>${data.maxStudentsPerTeacher}</td>`;

        data.applications.forEach(app => {
            html += `<tr>
                        <td>${app.name}</td>
                        <td>${app.activityLimit}</td>
                        <td>${app.actualTeachers}</td>
                        <td>${app.activityMaxPerTeacher}</td>
                    </tr>`;
        })
    }
    $('#group-monitoring-global-body').html(htmlGlobal);
    $('#group-monitoring-body').html(html);
    $('#group-monitoring').show();
}

/**
 * Applications crud
 */

$('#dashboard-manager-apps').click(() => {
    getAndShowApps();
})

// Close all the crud views
function closeCrudAppViews() {
    const CRUD_APP_VIEWS = ['#update-app-manager', '#delete-app-manager', '#create-app-manager'];
    CRUD_APP_VIEWS.forEach(view => {
        $(view).hide();
    });
}

// Open the modal with the div we want
function openModalInState(state) {
    closeCrudAppViews()
    pseudoModal.openModal('update-applications-manager');
    $(state).show();
}

// Close modal, reset input, close view and if true refresh the table of 
function closeModalAndCleanInput(refresh = false) {
    if (refresh) {
        getAndShowApps();
    }
    pseudoModal.closeAllModal();
    resetInputApplications();
    closeCrudAppViews();
    closeRestrictionDetail();
}

function resetInputApplications() {
    $('#app_update_name').val("");
    $('#app_update_description').val("");
    $('#app_update_image').val("");
    $('#app_update_id').val("");
    $('#app_create_name').val("");
    $('#app_create_description').val("");
    $('#app_create_image').val("");
    $('#validation_delete_application_id').val("");
    $('#validation_delete_application').val("");
    $('#app_update_activity_restriction_value').val("");
    $('#app_update_activity_restriction_type').val("");
    $('#app_create_activity_restriction_value').val("");
    $('#app_create_activity_restriction_type').val("");

    $('#isLti').prop('checked', false);
    $('#update_isLti').prop('checked', false);

    $('#inputs-lit').hide();
    $('#update_inputs-lti').hide();

    $('#clientId').val("");
    $('#deploymentId').val("");
    $('#toolUrl').val("");
    $('#publicKeySet').val("");
    $('#loginUrl').val("");
    $('#redirectionUrl').val("");
    $('#deepLinkUrl').val("");
    $('#privateKey').val("");

    $('#update_clientId').val("");
    $('#update_deploymentId').val("");
    $('#update_toolUrl').val("");
    $('#update_publicKeySet').val("");
    $('#update_loginUrl').val("");
    $('#update_redirectionUrl').val("");
    $('#update_deepLinkUrl').val("");
    $('#update_privateKey').val("");
}

function getAndShowApps() {
    $('#all-applications-crud').html();
    let htmlApps = "";
    mainManager.getmanagerManager().getAllApplications().then((response) => {
        getAllrestrictions();
        response.forEach(application => {

            let divImg = "";
            if (application.image != null && application.image != "") {
                divImg = `<img src="${application.image}" class="app_image_preview" alt="Icône de l'application ${application.name}">`
            } else {
                divImg = "None";
            }

            htmlApps += `<tr>
                            <td>${divImg}</td>
                            <td class="font-weight-bold">${application.name}</td>
                            <td>${application.description}</td>
                            <td>${application.max_per_teachers}</td>
                            <td>
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="updateApp(${application.id})" aria-label="Modifier l'application ${application.name}"><i class="fas fa-pencil-alt fa-2x" aria-hidden="true"></i></a>
                            </td>
                            <td>
                                <a class="c-link-red" href="javascript:void(0)" onclick="deleteApp(${application.id}, '${application.name}')" aria-label="Supprimer l'application ${application.name}"><i class="fas fa-trash-alt fa-2x" aria-hidden="true"></i></a>
                            </td>
                        </tr>`;
        });
        $('#all-applications-crud').html(htmlApps);
    })
}

/*                             
<td>
    <a class="c-link-tertiary" href="javascript:void(0)" onclick="activitiesRestrictionsCrud(${application.id})"><i class="fas fa-key fa-2x"></i></a>
</td> 
*/

function createApp() {
    openModalInState('#create-app-manager');
}


$('body').on('change', '#isLti', function () {
    if ($(this).is(":checked")) {
        $('#inputs-lti').show();
    } else {
        $('#inputs-lti').hide();
    }
})

$('body').on('change', '#update_isLti', function () {
    if ($(this).is(":checked")) {
        $('#update_inputs-lti').show();
    } else {
        $('#update_inputs-lti').hide();
    }
})




// Return false if the input is empty
function checkLtiFields(type) {
    if (type == 'create') {
        if ($('#isLti').is(":checked")) {
            if (
                $('#clientId').val() == "" ||
                $('#deploymentId').val() == "" ||
                $('#toolUrl').val() == "" ||
                $('#publicKeySet').val() == "" ||
                $('#loginUrl').val() == "" ||
                $('#redirectionUrl').val() == "" ||
                $('#deepLinkUrl').val() == "" ||
                $('#privateKey').val() == "") {
                return { isLti: false };
            } else {
                return {
                    isLti: true,
                    clientId: $('#clientId').val(),
                    deploymentId: $('#deploymentId').val(),
                    toolUrl: $('#toolUrl').val(),
                    publicKeySet: $('#publicKeySet').val(),
                    loginUrl: $('#loginUrl').val(),
                    redirectionUrl: $('#redirectionUrl').val(),
                    deepLinkUrl: $('#deepLinkUrl').val(),
                    privateKey: $('#privateKey').val()
                };
            }
        }
    } else if (type == 'update') {
        if ($('#update_isLti').is(":checked")) {
            if (
                $('#update_clientId').val() == "" ||
                $('#update_deploymentId').val() == "" ||
                $('#update_toolUrl').val() == "" ||
                $('#update_publicKeySet').val() == "" ||
                $('#update_loginUrl').val() == "" ||
                $('#update_redirectionUrl').val() == "" ||
                $('#update_deepLinkUrl').val() == "" ||
                $('#update_privateKey').val() == ""
            ) {
                return { isLti: false };
            } else {
                let lti = {
                    isLti: true,
                    clientId: $('#update_clientId').val(),
                    deploymentId: $('#update_deploymentId').val(),
                    toolUrl: $('#update_toolUrl').val(),
                    publicKeySet: $('#update_publicKeySet').val(),
                    loginUrl: $('#update_loginUrl').val(),
                    redirectionUrl: $('#update_redirectionUrl').val(),
                    deepLinkUrl: $('#update_deepLinkUrl').val(),
                    privateKey: $('#update_privateKey').val()
                }
                return lti;
            }
        }
    }
    return { isLti: false };
}

function updateApp(app_id) {
    resetInputApplications();
    mainManager.getmanagerManager().getApplicationById(app_id).then((response) => {
        $('#app_update_name').val(response.name);
        $('#app_update_description').val(response.description);
        if (response.color != "") {
            $('#app_update_color').val(response.color);
        }
        $('#app_update_image').val(response.image);
        $('#app_update_id').val(response.id);
        $('#app_update_activity_restriction_value').val(response.max_per_teachers);

        $('#app_update_sort_index').val(response.sort);

        if (response.hasOwnProperty('lti')) {
            $('#update_isLti').prop('checked', true);
            $('#update_inputs-lti').show();
            $('#update_clientId').val(response.lti.clientId);
            $('#update_deploymentId').val(response.lti.deploymentId);
            $('#update_toolUrl').val(response.lti.toolUrl);
            $('#update_publicKeySet').val(response.lti.publicKeySet);
            $('#update_loginUrl').val(response.lti.loginUrl);
            $('#update_redirectionUrl').val(response.lti.redirectionUrl);
            $('#update_deepLinkUrl').val(response.lti.deepLinkUrl);
            $('#update_privateKey').val(response.lti.privateKey);
        }
        openModalInState('#update-app-manager');
        updateImg('app_update_image');
    })
}

function deleteApp(app_id, app_name) {
    openModalInState('#delete-app-manager');
    $('#application_delete_name').text(app_name);
    $('#validation_delete_application_id').val(app_id);
}


function persistUpdateApp() {
    let $application_id = $('#app_update_id').val(),
        $application_name = $('#app_update_name').val(),
        $application_description = $('#app_update_description').val(),
        $application_color = $('#app_update_color').val(),
        $application_image = $('#app_update_image').val(),
        $application_restrictions_value = $('#app_update_activity_restriction_value').val(),
        lti = checkLtiFields('update'),
        $application_sort_index = $('#app_update_sort_index').val();

    if (!lti.isLti && $('#update_isLti').is(":checked")) {
        displayNotification('#notif-div', "manager.account.missingData", "error");
    } else {
        mainManager.getmanagerManager().updateApplication(
            $application_id,
            $application_name,
            $application_description,
            $application_image,
            lti,
            $application_color,
            $application_restrictions_value,
            $application_sort_index).then((response) => {
                if (response.message == "success") {
                    displayNotification('#notif-div', "manager.apps.updateSuccess", "success");
                    closeModalAndCleanInput(true);
                } else {
                    if (response.message == "application with the same name already exist") {
                        displayNotification('#notif-div', "manager.apps.nameAlreadyExist", "error");
                    } else {
                        displayNotification('#notif-div', "manager.account.missingData", "error");
                    }
                }
            })
    }
}


function persistDeleteApp() {
    let validation = $('#validation_delete_application').val(),
        placeholderWord = $('#validation_delete_application').attr('placeholder'),
        app_id = $('#validation_delete_application_id').val();

    if (validation == placeholderWord) {
        mainManager.getmanagerManager().deleteApplication(app_id).then((response) => {
            if (response.message == "success") {
                displayNotification('#notif-div', "manager.apps.deleteSuccess", "success");
                closeModalAndCleanInput(true)
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistCreateApp() {
    let $application_name = $('#app_create_name').val(),
        $application_description = $('#app_create_description').val(),
        $application_color = $('#app_create_color').val(),
        $application_image = $('#app_create_image').val(),
        $application_restrictions_value = $('#app_create_activity_restriction_value').val(),
        lti = checkLtiFields('create'),
        $application_sort_index = $('#app_create_sort_index').val();


    if (!lti.isLti && $('#isLti').is(":checked")) {
        displayNotification('#notif-div', "manager.account.missingData", "error");
    } else {
        mainManager.getmanagerManager().createApplication(
            $application_name,
            $application_description,
            $application_image, lti,
            $application_color,
            $application_restrictions_value,
            $application_sort_index).then((response) => {
                if (response.message == "success") {
                    displayNotification('#notif-div', "manager.apps.createSuccess", "success");
                    closeModalAndCleanInput(true);
                } else {
                    displayNotification('#notif-div', "manager.account.missingData", "error");
                }
                updateStoredApps();
            })
    }
}

/**
 * Img manager
 */

$('body').on('input', '#app_create_image', function () {
    updateImg('app_create_image');
})

$('body').on('input', '#app_update_image', function () {
    updateImg('app_update_image');
})



function updateImg(imageId) {
    let image = document.getElementById(`${imageId}_preview`);
    image.src = document.getElementById(imageId).value;
}


function updateStoredApps() {
    mainManager.getmanagerManager().getAllApplications().then((res) => {
        mainManager.getmanagerManager()._allApplications = res;
    })
}

/**
 * Activities restrictions per applications
 */

function createRestriction() {
    crudActivityCloseViews();
    pseudoModal.openModal('update-activities-restrictions-manager');
    $('#create-activity-restrictions-manager').show();
}

function deleteRestriction(id, type) {
    crudActivityCloseViews();
    pseudoModal.openModal('update-activities-restrictions-manager');
    $('#restriction_delete_name').text(type);
    $('#validation_delete_restriction_id').val(id);
    $('#delete-activity-restrictions-manager').show();
}

function crudActivityCloseViews() {
    const ALL_ACTIVITIES_VIEWS = ['#update-activity-restrictions-manager', '#delete-activity-restrictions-manager', '#create-activity-restrictions-manager'];
    ALL_ACTIVITIES_VIEWS.forEach(view => {
        $(view).hide();
    });
}


function closeModalAndCleanInputActivityRestrictions() {
    activitiesRestrictionsCrud($('#application-id-for-restriction').val());
    // Update fields
    $('#activity_restrictions_update_type').val("");
    $('#activity_restrictions_update_maximum').val("");
    $('#activity_restrictions_id').val("");
    // Create fields
    $('#activity_restrictions_create_type').val("");
    $('#activity_restrictions_create_maximum').val("");

    crudActivityCloseViews();
    pseudoModal.closeAllModal();

}

function closeRestrictionDetail() {
    $('#application-id-for-restriction').val("");
    $('#all-restrictions-from-app').hide();
}

function getAllrestrictions() {
    mainManager.getmanagerManager().getDefaultRestrictions().then((response) => {

        let html = "";
        $('#all-default-restrictions').html("");
        response.forEach(restriction => {
            let name = "",
                limitation = "",
                update = "";
            switch (restriction.name) {
                case 'userDefaultRestrictions':
                    name = i18next.t(`manager.apps.usersLimitation`);
                    limitation = `<ul class="m-0">`;
                    Object.keys(restriction.restrictions).forEach(function (key) {
                        limitation += `<li> <span class="font-weight-bold">${i18next.t(`manager.table.${key}`)}</span> : ${restriction.restrictions[key]}</li>`;
                    });
                    limitation += `</ul>`;
                    update = `<a class="c-link-secondary d-inline-block" href="javascript:void(0)" onclick="updateDefaultUsersLimitation()" aria-label="Modifier les limitations par défaut des utilisateurs"><i class="fas fa-pencil-alt fa-2x" aria-hidden="true"></i></a>`;
                    break;
                case 'groupDefaultRestrictions':
                    name = i18next.t(`manager.apps.groupsLimitation`);
                    limitation = `<ul class="m-0">`;
                    Object.keys(restriction.restrictions).forEach(function (key) {
                        limitation += `<li> <span class="font-weight-bold">${i18next.t(`manager.table.${key}`)}</span> : ${restriction.restrictions[key]}</li>`;
                    });
                    limitation += `</ul>`;
                    update = `<a class="c-link-secondary d-inline-block" href="javascript:void(0)" onclick="updateDefaultGroupsLimitation()" aria-label="Modifier les limitations par défaut des groupes"><i class="fas fa-pencil-alt fa-2x" aria-hidden="true"></i></a>`;
                    break;
                default:
                    break;
            }

            html += `<tr>
                        <td>${name}</td>
                        <td>${limitation}</td>
                        <td>${update}</td>
                    </tr>`;
        });
        $('#all-default-restrictions').html(html);
    })
}

function updateDefaultUsersLimitation() {
    let html = "";
    $('#update-default-restrictions').html("");
    mainManager.getmanagerManager().getDefaultUsersRestrictions().then((response) => {
        pseudoModal.openModal('update-default-restrictions-manager');
        Object.keys(response.restrictions).forEach(function (key) {
            html += `<div class="row mt-1 c-secondary-form">`
            html += `<div class="col-md">`
            html += `<label for="default-users-restrictions-value-${key}">${i18next.t(`manager.table.${key}`)}</label>`;
            html += `<input type="number" class="form-control" id="default-users-restrictions-value-${key}" value="${response.restrictions[key]}" aria-required="true">`;
            html += `</div>`;
            html += `</div>`;
        });
        html += `<button class="btn c-btn-secondary my-3 btn" onclick="persistUpdateDefaultUsersRestriction()">${i18next.t(`manager.buttons.update`)}</button>`;
        html += `<button class="btn c-btn-primary my-3 btn" onclick="closeDefault()">${i18next.t(`manager.buttons.cancel`)}</button>`;
        $('#update-default-restrictions').html(html);
    })
}

function updateDefaultGroupsLimitation() {
    let html = "";
    $('#update-default-restrictions').html("");
    mainManager.getmanagerManager().getDefaultGroupsRestrictions().then((response) => {
        pseudoModal.openModal('update-default-restrictions-manager');
        Object.keys(response.restrictions).forEach(function (key) {
            html += `<div class="row mt-1 c-secondary-form">`
            html += `<div class="col-md">`
            html += `<label for="default-groups-restrictions-value-${key}">${i18next.t(`manager.table.${key}`)}</label>`;
            html += `<input type="number" class="form-control" id="default-groups-restrictions-value-${key}" value="${response.restrictions[key]}">`;
            html += `</div>`;
            html += `</div>`;
        });
        html += `<button class="btn c-btn-secondary my-3 btn" onclick="persistUpdateDefaultGroupsRestriction()">${i18next.t(`manager.buttons.update`)}</button>`;
        html += `<button class="btn c-btn-primary my-3 btn" onclick="closeDefault()">${i18next.t(`manager.buttons.cancel`)}</button>`;
        $('#update-default-restrictions').html(html);
    })
}

let allActualType = [];

function updateDefaultActivitiesLimitation() {
    let html = "";
    allActualType = [];
    $('#update-default-restrictions').html("");
    mainManager.getmanagerManager().getDefaultActivitiesRestrictions().then((response) => {
        pseudoModal.openModal('update-default-restrictions-manager');
        html += `<button class="btn c-btn-primary my-3 btn" onclick="addDefaultActivitiesRestriction()">${i18next.t(`manager.defaultRestrictions.add`)}</button>`;
        Object.keys(response.restrictions).forEach(function (key) {
            allActualType.push(key);
            html += `<div class="row mt-1 c-secondary-form">`
            html += `<div class="col-md">`
            html += `<label for="default-activity-restriction-type-${key}">${i18next.t('manager.defaultRestrictions.type')}</label>`;
            html += `<input type="text" class="form-control" id="default-activity-restriction-type-${key}" value="${key}">`;
            html += `</div>`;
            html += `<div class="col-md">`
            html += `<label for="default-activity-restriction-value-${key}">${i18next.t('manager.defaultRestrictions.max')}</label>`;
            html += `<input type="number" class="form-control" id="default-activity-restriction-value-${key}" value="${response.restrictions[key]}">`;
            html += `</div>`;
            html += `<button class="btn c-btn-red my-3 btn" onclick="persistdeleteDefaultActivitiesRestriction('${key}')">${i18next.t(`manager.buttons.delete`)}</button>`;
            html += `</div>`;
        });
        html += `<button class="btn c-btn-secondary my-3 btn" onclick="persistUpdateDefaultActivitiesRestriction()">${i18next.t(`manager.buttons.update`)}</button>`;
        html += `<button class="btn c-btn-primary my-3 btn" onclick="closeDefault()">${i18next.t(`manager.buttons.cancel`)}</button>`;
        $('#update-default-restrictions').html(html);
    })
}

function persistUpdateDefaultUsersRestriction() {
    let maxStudentsValue = $('#default-users-restrictions-value-maxStudents').val(),
        maxClassrooms = $('#default-users-restrictions-value-maxClassrooms').val();

    mainManager.getmanagerManager().updateDefaultUsersRestrictions(maxStudentsValue, maxClassrooms).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.defaultRestrictions.updateUsersRestrictionsSuccess", "success");
            pseudoModal.closeAllModal();
            getAllrestrictions();
        }
    })
}

function persistUpdateDefaultGroupsRestriction() {
    let maxStudentsValue = $('#default-groups-restrictions-value-maxStudents').val(),
        maxTeachersValue = $('#default-groups-restrictions-value-maxTeachers').val(),
        maxStudentsPerTeacherValue = $('#default-groups-restrictions-value-maxStudentsPerTeacher').val(),
        maxClassromms = $('#default-groups-restrictions-value-maxClassroomsPerTeacher').val()


    mainManager.getmanagerManager().updateDefaultGroupsRestrictions(maxStudentsValue, maxTeachersValue, maxStudentsPerTeacherValue, maxClassromms).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.defaultRestrictions.updateGroupsRestrictionsSuccess", "success");
            pseudoModal.closeAllModal();
            getAllrestrictions();
        }
    })
}

function closeDefault() {
    pseudoModal.closeAllModal();
}

// Adjust the registrations forms from the configuration in the .env file
function createRegistrationTemplate() {

    // Get the registration template configuration from the .env file
    getRegistrationTemplate().then((res) => {

        // List all the views who are adjustable
        const usernameViews = ['#manager_username', '#manager_update_username', '#group_admin_username', '#group_admin_username_update'],
            phoneViews = ['#manager_phone', '#manager_update_phone', '#group_admin_phone', '#group_admin_phone_update'],
            userBioViews = ['#manager_bio', '#manager_update_bio', '#group_admin_bio', '#group_admin_bio_update'],
            userTeacherSectionViews = ['#user_teacher_infos', '#update_user_teacher_infos', '#user_teacher_infos_ga', '#update_user_teacher_infos_ga'],
            userTeacherSchoolViews = ['#section_teacher_school', '#section_teacher_school_ga', '#section_teacher_school_update_ga', '#section_teacher_update_school'],
            userTeacherGradeViews = ['#section_teacher_grade', '#section_teacher_grade_ga', '#section_teacher_grade_update_ga', '#section_teacher_update_grade'],
            userTeacherSubjectsViews = ['#section_teacher_subjects', '#section_teacher_subjects_ga', '#section_teacher_subjects_update_ga', '#section_teacher_update_subjects'];

        // If the registration template does not need an element to be displayed, we remove it
        const deleteInputs = (array) => {
            array.forEach(element => {
                if ($(element).length) {
                    $(element).remove();
                }
            });
        }


        if (res.USER_TEACHER_GRADE == "false" && res.USER_TEACHER_SUBJECTS == "false" && res.USER_TEACHER_SCHOOL == "false") {
            deleteInputs(userTeacherSectionViews);
        } else {
            if (res.USER_TEACHER_GRADE == "false") {
                deleteInputs(userTeacherGradeViews);
            }
            if (res.USER_TEACHER_SUBJECT == "false") {
                deleteInputs(userTeacherSubjectsViews);
            }
            if (res.USER_TEACHER_SCHOOL == "false") {
                deleteInputs(userTeacherSchoolViews);
            }
        }

        // Check for every configuration if it is needed to display the element
        if (res.USER_USERNAME == "false") {
            deleteInputs(usernameViews);
        }

        if (res.USER_PHONE == "false") {
            deleteInputs(phoneViews);
        }

        if (res.USER_BIO == "false") {
            deleteInputs(userBioViews);
        }

    })
}


$('#btn-help-for-groupAdmin').click(function () {
    let message = $('#groupadmin-contact-message-input').val(),
        subject = $('#groupadmin-contact-subject-input').val();
    mainGroupAdmin.getGroupAdminManager().helpRequestGroupAdmin(subject, message).then((response) => {
        if (response.emailSent == true) {
            displayNotification('#notif-div', "classroom.notif.helpRequestFromTeacherSent", "success");
        } else if (response.emailSent == false) {
            displayNotification('#notif-div', "manager.account.errorSending", "error");
        }
        // Add reset
        $('#groupadmin-contact-message-input').val("");
        $('#groupadmin-contact-subject-input').val("");
    })
})

/* Add tooltip to info  */
function setAddFieldTooltips() {
    $('#infoRetroAttribution').tooltip("dispose");
    $('#infoAutocorrect').tooltip("dispose");
    $('#infoEvaluation').tooltip("dispose");

    $('#infoRetroAttribution').attr("title", i18next.t('classroom.activities.infoRetroAttribution')).tooltip();
    $('#infoAutocorrect').attr("title", i18next.t('classroom.activities.infoAutocorrect')).tooltip();
    $('#infoEvaluation').attr("title", i18next.t('classroom.activities.infoEvaluation')).tooltip();
}
setTimeout(setAddFieldTooltips, 2000);


function facultativeOptions() {
    $('#facultative-options').toggle()
    $('#i-facultative-options').toggleClass('fa-chevron-down')
    $('#i-facultative-options').toggleClass('fa-chevron-up')
}


function activityPreviewToggler() {
    $('#activity-preview').toggle()
    $('#i-activity-preview').toggleClass('fa-chevron-down')
    $('#i-activity-preview').toggleClass('fa-chevron-up')
}

$('#qr-copy').click(() => {
    if ($("#classroom-code-share-qr-code").find("canvas").length > 0) {
        const canvasImg = $("#classroom-code-share-qr-code").find("canvas")[0];
        canvasImg.toBlob(function (blob) {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
        });
    }
})

$('#qr-download').click(() => {
    if ($("#classroom-code-share-qr-code").find("canvas").length > 0) {
        const canvasImg = $("#classroom-code-share-qr-code").find("canvas")[0];
        let link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = canvasImg.toDataURL()
        link.click();
    }
})


function setCaret(contentId, id) {

    const el = $(`#${contentId}`).siblings('.wysibb-text-editor.wysibb-body')[0];
    let range = document.createRange(),
        sel = window.getSelection(),
        childNote = null;

    for (let i = 0; i < el.childNodes.length; i++) {
        if ($(el.childNodes[i]).data('id')) {
            if ($(el.childNodes[i]).data('id') == id) {
                childNote = el.childNodes[i];
            }
        }
    }

    if (childNote != Object) {
        return;
    }

    range.setStart(childNote, 1)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
}

document.body.style.setProperty("--keyboard-zindex", "3000");

/**
 * Managing the initial focus on accessibility
 * Ensures that the classroom-sidebar-logo receives focus on first tab.
 */
function initializeFocusManagement() {
    let hasTabbed = false;
    let sectionButtons;

    function setInitialFocus() {
        const activeSidebar = document.querySelector('.sidebar-classroom:not([style*="display: none"])');
        const logo = activeSidebar ? activeSidebar.querySelector('#classroom-sidebar-logo') : null;

        if (logo) {
            if (!logo.hasAttribute('tabindex'))
                logo.setAttribute('tabindex', '0');

            logo.focus();
        } else {
            const firstNavButton = document.querySelector('.classroom-navbar-button:not([style*="display: none"])');
            if (firstNavButton) {
                if (!firstNavButton.hasAttribute('tabindex'))
                    firstNavButton.setAttribute('tabindex', '0');

                firstNavButton.focus();
            }
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Tab' && !hasTabbed) {
            hasTabbed = true;
            if (document.activeElement === document.body ||
                document.activeElement === document.documentElement ||
                !document.activeElement) {

                event.preventDefault();
                setInitialFocus();
                window.__a11yAllowPanelFocus = true;
            }
        }
    }, { once: false });

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.classList.contains('sidebar-classroom')) {
                    const isVisible = target.style.display !== 'none';
                    if (isVisible && !hasTabbed) {
                        setTimeout(() => {
                            setInitialFocus();
                        }, 100);
                    }
                }
            }
        });
    });

    const sidebars = document.querySelectorAll('.sidebar-classroom');
    sidebars.forEach(sidebar => {
        observer.observe(sidebar, {
            attributes: true,
            attributeFilter: ['style']
        });
    });

    if (document.querySelector('.sidebar-classroom:not([style*="display: none"])')) {
        setTimeout(() => {
            setInitialFocus();
            // Do NOT enable panel auto-focus yet; wait for first Tab press
        }, 500);
    }

    // Accessibility: enforce focus order Logo -> Topbar focusables -> Section buttons
    function isElementVisible(el) {
        if (!el) return false;
        let node = el;
        while (node && node !== document.body) {
            const cs = window.getComputedStyle(node);
            if (!cs) return false;
            if (cs.display === 'none' || cs.visibility === 'hidden') return false;
            node = node.parentElement;
        }
        if (el.getClientRects && el.getClientRects().length === 0) return false;
        return true;
    }

    function getVisibleSidebars() {
        return Array.from(document.querySelectorAll('.sidebar-classroom')).filter(isElementVisible);
    }

    function getActiveSidebar() {
        const visible = getVisibleSidebars();
        return visible.length ? visible[0] : null;
    }

    function getActiveLogo() {
        const sidebar = getActiveSidebar();
        return sidebar ? sidebar.querySelector('#classroom-sidebar-logo') : null;
    }

    function getTopbar() {
        const tb = document.getElementById('classroom-dashboard-top-bar');
        return isElementVisible(tb) ? tb : null;
    }

    function getFocusableWithin(container) {
        if (!container) return [];
        const selectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(container.querySelectorAll(selectors)).filter(isElementVisible);
    }

    function getSectionButtons() {
        const sidebar = getActiveSidebar();
        if (!sidebar) return [];
        const visibleSectionButtons = Array.from(sidebar.querySelectorAll('.classroom-navbar-button')).filter(isElementVisible)
        return visibleSectionButtons;
    }

    function getSidebarFocusables() {
        const sidebar = getActiveSidebar();
        if (!sidebar) return [];
        return getFocusableWithin(sidebar);
    }

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Tab') return;

        const logo = getActiveLogo();
        const topbar = getTopbar();
        let topbarFocusables = getFocusableWithin(topbar);
        sectionButtons = getSectionButtons();
        const firstSection = sectionButtons[0];
        const sidebarFocusables = getSidebarFocusables();
        const lastSidebarFocusable = sidebarFocusables.length ? sidebarFocusables[sidebarFocusables.length - 1] : null;
        const active = document.activeElement;

        // From logo -> first topbar focusable (retry if needed), else -> first section
        if (logo && active === logo && !event.shiftKey) {
            event.preventDefault();
            const tryFocusTopbar = () => {
                topbarFocusables = getFocusableWithin(topbar);
                if (topbarFocusables.length > 0) {
                    topbarFocusables[0].focus();
                    return true;
                }
                return false;
            };
            if (!tryFocusTopbar()) {
                setTimeout(() => {
                    if (!tryFocusTopbar() && firstSection) firstSection.focus();
                }, 100);
            }
            return;
        }

        // Within topbar: last -> first section on Tab, first -> logo on Shift+Tab
        if (topbar && topbar.contains(active)) {
            topbarFocusables = getFocusableWithin(topbar);
            if (topbarFocusables.length > 0) {
                const idx = topbarFocusables.indexOf(active);
                if (idx !== -1) {
                    if (!event.shiftKey && idx === topbarFocusables.length - 1 && firstSection) {
                        event.preventDefault();
                        firstSection.focus();
                        return;
                    }
                    if (event.shiftKey && idx === 0 && logo) {
                        event.preventDefault();
                        logo.focus();
                        return;
                    }
                }
            }
        }

        // From first section with Shift+Tab -> last topbar focusable or logo
        if (sectionButtons.length > 0 && active === sectionButtons[0] && event.shiftKey) {
            topbarFocusables = getFocusableWithin(topbar);
            if (topbarFocusables.length > 0) {
                event.preventDefault();
                topbarFocusables[topbarFocusables.length - 1].focus();
                return;
            }
            if (logo) {
                event.preventDefault();
                logo.focus();
                return;
            }
        }

        // From last focusable in sidebar with Tab -> first focusable in active panel
        if (lastSidebarFocusable && active === lastSidebarFocusable && !event.shiftKey) {
            event.preventDefault();
            if (!focusFirstInActivePanel()) {
                setTimeout(() => { focusFirstInActivePanel(); }, 50);
            }
            return;
        }

        // From first focusable in panel with Shift+Tab -> last focusable in sidebar (fallback: topbar last, then logo)
        {
            const panel = getActivePanelContainer();
            const panelFocusables = getFocusableWithin(panel);
            const firstPanelFocusable = panelFocusables.length ? panelFocusables[0] : null;
            if (firstPanelFocusable && active === firstPanelFocusable && event.shiftKey) {
                event.preventDefault();
                if (lastSidebarFocusable) {
                    lastSidebarFocusable.focus();
                    return;
                }
                topbarFocusables = getFocusableWithin(topbar);
                if (topbarFocusables.length > 0) {
                    topbarFocusables[topbarFocusables.length - 1].focus();
                    return;
                }
                if (logo) {
                    logo.focus();
                    return;
                }
            }
        }

        // From last section with Tab -> first focusable in active panel
        if (sectionButtons.length > 0 && active === sectionButtons[sectionButtons.length - 1] && !event.shiftKey) {
            event.preventDefault();
            // Try immediately, then retry shortly in case of async content
            if (!focusFirstInActivePanel()) {
                setTimeout(() => { focusFirstInActivePanel(); }, 50);
            }
            return;
        }
    }, { capture: true });

    function getActivePanelContainer() {
        const content = document.getElementById('classroom-dashboard-content');
        if (!content) return null;
        const visiblePanels = Array.from(content.querySelectorAll('.dashboard-block')).filter(isElementVisible);
        return visiblePanels.length ? visiblePanels[0] : null;
    }

    function focusFirstInActivePanel() {
        const panel = getActivePanelContainer();
        if (!panel) return false;
        const focusables = getFocusableWithin(panel);
        if (focusables.length > 0) {
            focusables[0].focus();
            return true;
        }
        // Fallback: focus the panel itself
        if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
        panel.focus();
        return true;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFocusManagement);
} else {
    initializeFocusManagement();
}