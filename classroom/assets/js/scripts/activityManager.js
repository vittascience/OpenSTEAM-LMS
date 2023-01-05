/**
 * Setup the rich text editor for the activities
 */
function setTextArea() {
    const options = Main.getClassroomManager().wbbOpt;
    // Free 
    $('#free-enonce').wysibb(options);
    $('#free-content').wysibb(options);
    $('#free-correction').wysibb(options);

    // Reading
    $("#reading-content").wysibb(options);

    // FillIn
    $("#fill-in-states").wysibb(options);
    $("#fill-in-content").wysibb(options);

    // DragAndDrop
    $("#drag-and-drop-states").wysibb(options);
    $("#drag-and-drop-content").wysibb(options);

     // Quiz
     $("#quiz-states").wysibb(options);
}

// autocorrect modification pas pris en compte

function LtiDefaultCode(activityType, isUpdate) {
    document.getElementById('content-forward-button').style.display = 'none';
    $("#activity-custom").show();
    if (isUpdate) {
        launchLtiDeepLinkCreate(activityType, isUpdate);
    } else {
        launchLtiDeepLinkCreate(activityType);
    }
}

function launchCustomActivity(activityType, isUpdate = false, callback = false) {
    setTextArea();

    const contentForwardButtonElt = document.getElementById('content-forward-button');
    contentForwardButtonElt.style.display = 'inline-block';
    if(!isUpdate) {
        // Reset and hide all activities input and fields
        resetActivityInputs(activityType);
    }
    hideAllActivities();
    setAddFieldTooltips();
    Main.getClassroomManager()._createActivity.id = activityType;
    Main.getClassroomManager()._createActivity.function = "create";

    Main.getClassroomManager().isActivitiesRestricted(null, activityType).then((response) => {
        if (response.Limited == false && activityType != "appOutDated") {
            const funct = customActivity.activityAndCaseView.filter(activityValidate => activityValidate[0] == activityType)[0];
            if (funct) {
                if (typeof funct[1] != 'function') {
                    navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
                    $(funct[1]).show();
                } else {
                    if (funct[3] != false) {
                        funct[1](funct[0], funct[3]);
                    } else {
                        funct[1](funct[0]);
                    }
                }
            } else {
                navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
                $("#activity-custom").show();
                LtiDefaultCode(activityType, isUpdate);
            }

            if (funct) {
                if (funct[2]) {
                    navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
                }
            }
            if (callback) callback();
        } else {
            if (activityType == "appOutDated") {
                pseudoModal.openModal('activity-outdated');
            } else if (response.Limited) {
                if (UserManager.getUser().isFromGar) {
                    $('#app-restricted-number').attr('data-i18n-options', `{"activities": "${response.Restrictions[Object.keys(response.Restrictions)[0]]}"}`);
                    pseudoModal.openModal('activity-restricted-gar');
                    $('#app-restricted-number').localize();
                } else {
                    pseudoModal.openModal('activity-restricted');
                }
            }
        }
    });
}

function contentBackward() {
    Main.getClassroomManager().getAllApps().then((apps) => {
        activitiesCreation(apps);
        navigatePanel('classroom-dashboard-proactivities-panel-teacher', 'dashboard-activities-teacher');
    })
}


// Get the content
function contentForward() {
    
    let isCheckPassed = true;
    if (Main.getClassroomManager()._createActivity.id == 'free') {
        Main.getClassroomManager()._createActivity.content.description = $('#free-content').bbcode();
        Main.getClassroomManager()._createActivity.solution = $('#free-correction').bbcode();
        Main.getClassroomManager()._createActivity.autocorrect = $('#free-autocorrect').is(":checked");
        Main.getClassroomManager()._createActivity.tolerance = $('#free-tolerance').val();
    } else if (Main.getClassroomManager()._createActivity.id == 'reading'){
        if ($('#reading-content').bbcode() == "" && $('#reading-content').htmlcode() == "") {
            isCheckPassed = false;
        } else {
            if ($('#reading-content').bbcode() != "") {
                Main.getClassroomManager()._createActivity.content.description = $('#reading-content').bbcode();
            } else if ($('#reading-content').htmlcode() != "") {
                Main.getClassroomManager()._createActivity.content.description = $('#reading-content').htmlcode();
            }
        }
    } else if (Main.getClassroomManager()._createActivity.id == 'fillIn') {
        // Manage fill in fields
        isCheckPassed = fillInManager.parseFillInFieldsAndSaveThem();
    } else if (Main.getClassroomManager()._createActivity.id == 'quiz') {
        // Manage quiz fields
        isCheckPassed = quizManager.parseQuizFieldsAndSaveThem();
    } else if (Main.getClassroomManager()._createActivity.id == 'dragAndDrop') {
        isCheckPassed = dragAndDropManager.parseDragAndDropFieldsAndSaveThem();
    } else {
        const funct = customActivity.ContentForwardCustom.filter(contentForwardCheck => contentForwardCheck[0] == Main.getClassroomManager()._createActivity.id)[0];
        if (funct) {
            isCheckPassed = funct[1]();
        }
    }
    // Check if the content if empty
    if (Main.getClassroomManager()._createActivity.content.description == '' && !isCheckPassed) { 
        displayNotification('#notif-div', "classroom.notif.emptyContent", "error");
    } else {
        navigatePanel('classroom-dashboard-classes-new-activity-title', 'dashboard-proactivities-teacher');
        ActivityPreviewBeforeCreation(Main.getClassroomManager()._createActivity.id);
    }
}

function parseFreeFieldsAndSaveThem() {
    Main.getClassroomManager()._createActivity.content.description = $('#free-content').bbcode();
    Main.getClassroomManager()._createActivity.solution = $('#free-correction').bbcode();
    Main.getClassroomManager()._createActivity.autocorrect = $('#free-autocorrect').is(":checked");
    Main.getClassroomManager()._createActivity.tolerance = $('#free-tolerance').val();
    return true;
}

function parseReadingFieldsAndSaveThem() {
    if ($('#reading-content').bbcode() == "" && $('#reading-content').htmlcode() == "") {
        return false;
    } else {
        if ($('#reading-content').bbcode() != "") {
            Main.getClassroomManager()._createActivity.content.description = $('#reading-content').bbcode();
        } else if ($('#reading-content').htmlcode() != "") {
            Main.getClassroomManager()._createActivity.content.description = $('#reading-content').htmlcode();
        }
    }
}



function titleBackward() {
    if (Main.getClassroomManager()._createActivity.id != "") {
        launchCustomActivity(Main.getClassroomManager()._createActivity.id, true);
    }
}

/**
 * Title part
 */
 function titleForward() {
    Main.getClassroomManager()._createActivity.title = $('#global_title').val();
    $('#activity-title-forward').attr('disabled', true);
    // Check if the title is empty
    if (Main.getClassroomManager()._createActivity.title == '') {
        displayNotification('#notif-div', "classroom.notif.emptyTitle", "error");
        $('#activity-title-forward').attr('disabled', false);
    } else {
        let title = Main.getClassroomManager()._createActivity.title,
            type = Main.getClassroomManager()._createActivity.id,
            content = JSON.stringify(Main.getClassroomManager()._createActivity.content),
            solution = JSON.stringify(Main.getClassroomManager()._createActivity.solution),
            tolerance = Main.getClassroomManager()._createActivity.tolerance,
            autocorrect = Main.getClassroomManager()._createActivity.autocorrect,
            folder = foldersManager.actualFolder;

        if (type == "dragAndDrop" || type == "fillIn" || type == "quiz") {
            autocorrect = true;
        }

        if (Main.getClassroomManager()._createActivity.function == "create") {  
            Main.getClassroomManager().createNewActivity(title, type, content, solution, tolerance, autocorrect, folder).then((response) => {
                if (response.success == true) {
                    Main.getClassroomManager()._lastCreatedActivity = response.id;
                    displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${title}"}'`);
                    navigatePanel('classroom-dashboard-classes-new-activity-attribution', 'dashboard-proactivities-teacher');
                } else {
                    displayNotification('#notif-div', "manager.account.errorSending", "error");
                }
                $('#activity-title-forward').attr('disabled', false);
            });
        } else if (Main.getClassroomManager()._createActivity.function == "update") {
            Main.getClassroomManager().updateActivity(ClassroomSettings.activity, title, type, content, solution, tolerance, autocorrect).then((response) => {
                if (response.success == true) {
                    Main.getClassroomManager()._lastCreatedActivity = response.id;
                    displayNotification('#notif-div', "classroom.notif.activityChanged", "success", `'{"activityTitle": "${title}"}'`);
                    navigatePanel('classroom-dashboard-classes-new-activity-attribution', 'dashboard-proactivities-teacher');
                } else {
                    displayNotification('#notif-div', "manager.account.errorSending", "error");
                }
                $('#activity-title-forward').attr('disabled', false);
            });
        }
    }
    document.querySelector('#preview-activity-content').innerHTML = '';
}


/**
 * Validation pipeline for the new activity
 */
function validateActivity(correction) {
    // filter activityAndCase to get the right function
    // CustomActivity = Manager for the custom activity
    const funct = customActivity.activityAndCase.filter(activityValidate => activityValidate[0] == Activity.activity.type)[0];
    if (funct) {
        funct[1](funct[2] ? correction : null);
    } else {
        defaultProcessValidateActivity(correction);
    }
}


function validateDefaultResponseManagement(response) {
    $("#activity-validate").attr("disabled", false);
    if (response.note != null && response.correction > 1) {
        if (response.note == 3) {
            navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities')
        } else if (response.note == 0) {
            navigatePanel('classroom-dashboard-activity-panel-fail', 'dashboard-activities')
        }
    } else {
        navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
    }
}

function responseManager(response = null, type = null) {
    if (response) {
        if (response.hasOwnProperty("message")) {
            if (response.message == "activitySaved") {
                displayNotification('#notif-div', "classroom.activities.saved", "success");
            } else if (response.message == "emptyAnswer") {
                displayNotification('#notif-div', "classroom.activities.emptyAnswer", "error");
            }
        } else if (response.hasOwnProperty("badResponse")) {
            saveActivitiesAndCoursesResponseManager(type, response, false);
        } else {
            validateDefaultResponseManagement(response);
        }
    } else {
        displayNotification('#notif-div', "classroom.notif.errorSending", "error");
    }
}

function activitiesCreation(apps) {

    let titleRoad = "newActivities.ActivitiesData.title.";
    let descriptionRoad = "newActivities.ActivitiesData.description.";

    // sort application by sort index
    apps.sort(sortFunctionBySort);

    let htmlContent = `<div class="app-head" data-i18n="classroom.activities.applist.selectApp"></div>`;
    apps.forEach(app => {

        let outDated = false;
        if (app.hasOwnProperty("outDated")) {
            outDated = app.outDated;
        }

        let nameField = "";
        if (i18next.t(titleRoad+app.name) != titleRoad+app.name) {
            nameField = `<h3 class="app-card-title mt-2" data-i18n="${titleRoad+app.name}"></h3>`;
        } else if (i18next.t(app.name) != app.name) {
            nameField = `<h3 class="app-card-title mt-2" data-i18n="${app.name}"></h3>`;
        } else {
            let appName = app.name.replaceAll("-", " ");
            nameField = `<h3 class="app-card-title mt-2">${appName}</h3>`;
        }

        let descriptionField = "";
        if (i18next.t(descriptionRoad+app.description) != descriptionRoad+app.description) {
            descriptionField = `<p class="app-card-description" data-i18n="${descriptionRoad+app.description}"></p>`;
        } else if (i18next.t(app.description) != app.description) {
            descriptionField = `<p class="app-card-description" data-i18n="${app.description}"></p>`;
        } else {
            descriptionField = `<p class="app-card-description">${app.description}</p>`;
        }
        


        let restrict = app.name != "" ? `launchCustomActivity('${app.name}')` : `launchCustomActivity('custom')`;

        if (outDated) {
            restrict = `launchCustomActivity('appOutDated')`;
        }

        htmlContent+= `<div class="app-card" style="--border-color:${app.color};" onclick="${restrict}">
            <img class="app-card-img" src="${app.image}" alt="${app.name}">
            ${nameField}
            ${descriptionField}
        </div>`
    });
    
    $('#activity-creation-grid').html(htmlContent);
    $('#activity-creation-grid').localize();
}

function getTranslatedActivityName(type) {
    let titleRoad = "newActivities.ActivitiesData.title.";
    if (i18next.t(titleRoad+type) != titleRoad+type) {
        return i18next.t(titleRoad+type);
    } else if (i18next.t(type) != type) {
        return i18next.t(type);
    } else {
        return '';
    }
}

function sortFunctionBySort(a, b) {
    if (a.sort === b.sort) {
        return 0;
    }
    else {
        return (a.sort < b.sort) ? -1 : 1;
    }
}

function goBackToActivities() {
    navigatePanel('classroom-dashboard-activities-panel', 'dashboard-activities');
}


/**
 * Fill in activity
 */
 $.fn.selectRange = function(start, end) {
    if(end === undefined) {
        end = start;
    }
    return this.each(function() {
        if('selectionStart' in this) {
            this.selectionStart = start;
            this.selectionEnd = end;
        } else if(this.setSelectionRange) {
            this.setSelectionRange(start, end);
        } else if(this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};


/**
 * Meilleur clean de contenu lors de la modification d'une activité
 */

function launchLtiDeepLinkCreate(type, isUpdate) {
    let updateInput = '';
    if (isUpdate) {
        updateInput = `<input type="hidden" id="is_update" name="is_update" value="true">
        <input type="hidden" id="update_url" name="update_url" value="${Main.getClassroomManager()._createActivity.content.description}">`;
    }
    
    document.querySelector('#lti-loader-container').innerHTML = 
    `<input id="activity-form-content-lti" type="text" hidden/>
    <form name="contentitem_request_form" action="${_PATH}lti/contentitem.php" method="post" target="lti_teacher_iframe">
        <input type="hidden" id="application_type" name="application_type" value="${type}">
        ${updateInput}
    </form>
    <div style="width: 100%; height: 100%;" class="lti-iframe-holder">
        <iframe id="lti_teacher_iframe" src="about:blank" name="lti_teacher_iframe" title="Tool Content" width="100%"  height="100%" allowfullscreen></iframe>
    </div>`;

    document.forms["contentitem_request_form"].submit();
}

function launchLtiResource(activityId, activityType, activityContent, isStudentLaunch = false, studentResourceUrl = false, activityContentId = "#activity-content", isFromCourse = false) {
    let course = isFromCourse ? "-course" : "";
    document.querySelector(activityContentId + course).innerHTML = 
        `<input id="activity-score" type="text" hidden/>
        <form name="resource_launch_form" action="${_PATH}lti/ltilaunch.php" method="post" target="lti_student_iframe">
            <input type="hidden" id="application_type" name="application_type" value="${activityType}">
            <input type="hidden" id="target_link_uri" name="target_link_uri" value="${activityContent.replace('&amp;', '&')}">
            <input type="hidden" id="student_launch" name="student_launch" value="${isStudentLaunch}">
            <input type="hidden" id="activities_link_user" name="activities_link_user" value="${activityId}">
            <input type="hidden" id="student_resource_url" name="student_resource_url" value="${studentResourceUrl}">
        </form>
        <iframe id="lti_student_iframe" src="about:blank" name="lti_student_iframe" title="Tool Content" width="100%" style="
        height: 60vh;" allowfullscreen></iframe>
        `;
    document.forms["resource_launch_form"].submit();
    $("#activity-content-container"+course).show();
}


function ActivityPreviewBeforeCreation(type) {

    $('#activity-preview-div').hide();

    const $title = $('#preview-title'),
        $statesText = $('#preview-activity-states'),
        ActivityPreview = Main.getClassroomManager()._createActivity;

    resetPreviewViews();
    
    $title.html(Main.getClassroomManager()._createActivity.title);
    $statesText.html(bbcodeToHtml(Main.getClassroomManager()._createActivity.content.states));
    $title.show();

    let func = customActivity.managePreviewCustom.filter(activityPreview => activityPreview[0] == type)[0];
    if (func) {
        func[1](ActivityPreview);
    } else {
        switch (type) {
            case "custom":
                $('#preview-activity-content').html(bbcodeToHtml(ActivityPreview.content.description));
                $('#preview-content').show();
                $('#activity-preview-div').show();
                break;
            case "vittascience":
                launchLtiResource("0000", "vittascience", ActivityPreview.content.description, false, false, "#preview-activity-content");
                $('#preview-content').show();
                $('#activity-preview-div').show();
                break;
            default:
                break;
        }
    }
}

$("#global_title").keyup(function() {
    $("#preview-title").html($("#global_title").val());
})

function resetPreviewViews() {
    const Views = [ $('#preview-title'), 
                    $('#preview-states'), 
                    $('#preview-content'), 
                    $('#preview-content-bbcode'), 
                    $('#preview-activity-drag-and-drop-container')];
    const ContentViews = [  $('#preview-activity-content'), 
                            $('#preview-activity-states'), 
                            $('#preview-activity-bbcode-content'), 
                            $('#preview-drag-and-drop-text'), 
                            $('#preview-drag-and-drop-fields')];
    Views.forEach(e => {
        e.hide();
    });
    ContentViews.forEach(e => {
        e.html('');
    });
}



function saveActivitiesAndCoursesResponseManager(activityType = null, response = null, isFromCourse = false) {
    let courseIndicator = isFromCourse ? "-course" : "";

    if (activityType == 'fill-in') {
        displayNotification('#notif-div', "classroom.activities.wrongAnswerLarge", "error");
        
        let lengthResponse = $(`input[id^="student-fill-in-field-"]`).length;
        for (let i = 1; i < lengthResponse+1; i++) {
            if (response.badResponse.includes(i-1)) {
                $(`#student-fill-in-field-${i}`).css("border","2px solid var(--correction-0)");
            } else {
                $(`#student-fill-in-field-${i}`).css("border","2px solid var(--correction-3)");
            }
        }

        hintManager(response, courseIndicator)
    } else if (activityType == 'drag-and-drop') {
        displayNotification('#notif-div', "classroom.activities.wrongAnswerLarge", "error");
        for (let i = 0; i < $(`span[id^="dz-"]`).length; i++) {
            $('#dz-' + i).css("border","1px solid var(--correction-3)");
        }

        for (let i = 0; i < response.badResponse.length; i++) {
            $('#dz-' + (response.badResponse[i])).css("border","1px solid var(--correction-0)");
        }

        hintManager(response, courseIndicator)
    } else if (activityType == 'quiz') {
        displayNotification('#notif-div', "classroom.activities.wrongAnswerLarge", "error");
        document.querySelectorAll('.quiz-answer-incorrect').forEach((element) => {
            element.classList.remove('quiz-answer-incorrect');
        });

        for (let i = 1; i < $(`input[id^="student-quiz-suggestion-"]`).length+1; i++) {
            $('#student-quiz-suggestion-' + i).parent().addClass('quiz-answer-correct');
        }

        for (let i = 0; i < response.badResponse.length; i++) {
            $('#student-quiz-suggestion-' + (response.badResponse[i]+1)).parent().addClass('quiz-answer-incorrect');
        }

        hintManager(response, courseIndicator)
    } else if (activityType == 'free') {
        displayNotification('#notif-div', "classroom.activities.wrongAnswer", "error");
    }
}

function hintManager(response, courseIndicator = "") {
    if (response.hasOwnProperty("hint")) {
        if (response.hint != null && response.hint != "") {
            $(`#activity-hint-container${courseIndicator}`).show();
            $(`#activity-hint${courseIndicator}`).text(response.hint);
        }
    }
}

/* Now include course to avoid duplicate */
function defaultProcessValidateActivity(correction = null, isFromCourse = false) {
    $("#activity-validate").attr("disabled", "disabled");

    let getInterface = tryToParse(Activity.activity.content),
        vittaIframeRegex = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm,
        interfaceData = false;

        
    if (!getInterface) {
        if (vittaIframeRegex.exec(Activity.activity.content) != null) {
            interfaceData = vittaIframeRegex.exec(Activity.activity.content);
        }
    } else {
        interfaceData = vittaIframeRegex.exec(JSON.parse(Activity.activity.content).description)
    }

    if (!interfaceData) {
        let correction = 2
        if (isFromCourse) {
            Main.getClassroomManager().saveStudentActivity(false, false, Activity.id, correction, 4).then(function (activity) {
                if (typeof activity.errors != 'undefined') {
                    for (let error in activity.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                        $("#activity-validate").attr("disabled", false);
                    }
                } else  {
                    coursesManager.manageAllActivityResponse(activity);
                }
            })
        } else {
            Main.getClassroomManager().saveStudentActivity(false, false, Activity.id, correction, 4).then(function (activity) {
                if (typeof activity.errors != 'undefined') {
                    for (let error in activity.errors) {
    
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                        $("#activity-validate").attr("disabled", false);
                    }
                } else  {
                    navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities');
                    actualizeStudentActivities(activity, correction);
                    $("#activity-validate").attr("disabled", false);
                }
            })
        }
        window.localStorage.classroomActivity = null
    } else if (Activity.autocorrection == false) {
        let correction = 1;
        const interfaceName = interfaceData[2];
        let project = window.localStorage[interfaceName + 'CurrentProject']

        
        let projectParsed = tryToParse(project);
        if (!projectParsed) {
            projectParsed = null;
        }

        if (isFromCourse) {
            Main.getClassroomManager().saveStudentActivity(projectParsed, interfaceName, Activity.id).then(function (activity) {
                if (typeof activity.errors != 'undefined') {
                    for (let error in activity.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                        $("#activity-validate").attr("disabled", false);
                    }
                } else {
                    coursesManager.manageAllActivityResponse(activity);
                }
            })
        } else {
            Main.getClassroomManager().saveStudentActivity(projectParsed, interfaceName, Activity.id).then(function (activity) {
                if (typeof activity.errors != 'undefined') {
                    for (let error in activity.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                        $("#activity-validate").attr("disabled", false);
                    }
                } else {
                    actualizeStudentActivities(activity, correction)
                    $("#activity-validate").attr("disabled", false);
                    navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
                }
            })
        }
    } else {
        $("#activity-validate").attr("disabled", false);
        window.localStorage.autocorrect = true
    }
}
