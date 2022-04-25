/**
 * Setup the rich text editor for the activities
 */
 function setTextArea() {
    let wbbOpt = {
        resize_maxheight:354,
        autoresize:false,
        buttons: ",bold,italic,underline|,justifyleft,justifycenter,justifyright,img,link,|,quote,bullist,|,vittaiframe,cabriiframe,vittapdf,video,peertube,vimeo,genialyiframe,gdocsiframe,answer",
    }
    // Free 
    $('#free-enonce').wysibb(wbbOpt);
    $('#free-content').wysibb(wbbOpt);
    $('#free-correction').wysibb(wbbOpt);

    // Reading
    $("#reading-content").wysibb(wbbOpt);

    // FillIn
    $("#fill-in-states").wysibb(wbbOpt);
    $("#fill-in-content").wysibb(wbbOpt);

    // DragAndDrop
    $("#drag-and-drop-states").wysibb(wbbOpt);
    $("#drag-and-drop-content").wysibb(wbbOpt);

     // Quiz
     $("#quiz-states").wysibb(wbbOpt);
}

// autocorrect modification pas pris en compte
function launchCustomActivity(activityType, isUpdate = false) {

    //if (document.querySelector('#free-enonce') !== null) {
    setTextArea();
    //}

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
        if (response.Limited == false) {
            switch(activityType) {
                case 'free':
                    $("#activity-free").show();
                    break;
                case 'quiz':
                    $("#activity-quiz").show();
                    break;
                case 'fillIn':
                    $("#activity-fill-in").show();
                    break;
                case 'reading':
                    $("#activity-reading").show();
                    break;
                case 'dragAndDrop':
                    $("#activity-drag-and-drop").show();
                    break;
                case 'custom':
                    // Use the previous method for the activity without title
                    $("#activity-reading").show();
                    break;
                default:
                    // Check if it's an lti apps and get the data needed if it's the case
                    contentForwardButtonElt.style.display = 'none';
                    $("#activity-custom").show();
                    if (isUpdate) {
                        launchLtiDeepLinkCreate(activityType, isUpdate);
                    } else {
                        launchLtiDeepLinkCreate(activityType);
                    }
                    
                    break;
            }
            navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
        } else {
            if (UserManager.getUser().isFromGar) {
                $('#app-restricted-number').attr('data-i18n-options', `{"activities": "${response.Restrictions[Object.keys(response.Restrictions)[0]]}"}`);
                pseudoModal.openModal('activity-restricted-gar');
                $('#app-restricted-number').localize();
            } else {
                pseudoModal.openModal('activity-restricted');
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
        isCheckPassed = parseFillInFieldsAndSaveThem();
    } else if (Main.getClassroomManager()._createActivity.id == 'quiz') {
        // Manage quiz fields
        isCheckPassed = parseQuizFieldsAndSaveThem();
    } else if (Main.getClassroomManager()._createActivity.id == 'dragAndDrop') {
        isCheckPassed = parseDragAndDropFieldsAndSaveThem();
    }
    // Check if the content if empty
    if (Main.getClassroomManager()._createActivity.content.description == '' && !isCheckPassed) { 
        displayNotification('#notif-div', "classroom.notif.emptyContent", "error");
    } else {
        navigatePanel('classroom-dashboard-classes-new-activity-title', 'dashboard-proactivities-teacher');
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
    
    // Check if the title is empty
    if (Main.getClassroomManager()._createActivity.title == '') {
        displayNotification('#notif-div', "classroom.notif.emptyTitle", "error");
    } else {
        let title = Main.getClassroomManager()._createActivity.title,
            type = Main.getClassroomManager()._createActivity.id,
            content = JSON.stringify(Main.getClassroomManager()._createActivity.content),
            solution = JSON.stringify(Main.getClassroomManager()._createActivity.solution),
            tolerance = Main.getClassroomManager()._createActivity.tolerance,
            autocorrect = Main.getClassroomManager()._createActivity.autocorrect;

        if (type == "dragAndDrop" || type == "fillIn" || type == "quiz") {
            autocorrect = true;
        }

        if (Main.getClassroomManager()._createActivity.function == "create") {  
            Main.getClassroomManager().createNewActivity(title, type, content, solution, tolerance, autocorrect).then((response) => {
                if (response.success == true) {
                    Main.getClassroomManager()._lastCreatedActivity = response.id;
                    displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${title}"}'`);
                    navigatePanel('classroom-dashboard-classes-new-activity-attribution', 'dashboard-proactivities-teacher');
                } else {
                    displayNotification('#notif-div', "manager.account.errorSending", "error");
                }
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
            });
        }
    }
}


/**
 * Validation pipeline for the new activity
 */
function validateActivity(correction) {
    switch(Activity.activity.type) {
        case 'free':
            freeValidateActivity(correction);
            break;
        case 'quiz':
            quizValidateActivity(correction);
            break;
        case 'fillIn':
            fillInValidateActivity(correction);
            break;
        case 'reading':
        case 'custom':
            defaultProcessValidateActivity();
            break;
        case 'dragAndDrop':
            dragAndDropValidateActivity(correction);
            break;
        default:
            defaultProcessValidateActivity()
            break;
    }
}

/**
 * Default process for the validation of the free activity
 */
function freeValidateActivity(correction = 1) {
    let studentResponse = $('#activity-input').bbcode();
    Main.getClassroomManager().saveNewStudentActivity(Activity.activity.id, correction, null, studentResponse, Activity.id).then((response) => {
        responseManager(response, 'free');
    });
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

function quizValidateActivity(correction = 1) {

    let studentResponse = [];
    for (let i = 1; i < $(`input[id^="student-quiz-checkbox-"]`).length+1; i++) {
        let res = {
            inputVal: $(`#student-quiz-suggestion-${i}`).text(),
            isCorrect: $(`#student-quiz-checkbox-${i}`).is(':checked')
        }
        studentResponse.push(res);
    }
    
    Main.getClassroomManager().saveNewStudentActivity(Activity.activity.id, correction, null, JSON.stringify(studentResponse), Activity.id).then((response) => {
        responseManager(response, 'quiz');
    });
}

function fillInValidateActivity(correction = 1) {
    let studentResponse = [];
    for (let i = 1; i < $(`input[id^="student-fill-in-field-"]`).length+1; i++) {
        let string = document.getElementById(`student-fill-in-field-${i}`).value;
        studentResponse.push(string);
    }
    Main.getClassroomManager().saveNewStudentActivity(Activity.activity.id, correction, null, JSON.stringify(studentResponse), Activity.id).then((response) => {
        responseManager(response, 'fill-in');
    });
}


function dragAndDropValidateActivity(correction = 1) {
    let studentResponse = [];
    for (let i = 0; i < $(`span[id^="dz-"]`).length; i++) {
        let string = document.getElementById(`dz-${i}`).children.length > 0 ? document.getElementById(`dz-${i}`).children[0].innerHTML : "";
        studentResponse.push({
            string: string
        });
    }
    Main.getClassroomManager().saveNewStudentActivity(Activity.activity.id, correction, null, JSON.stringify(studentResponse), Activity.id).then((response) => {
        responseManager(response, 'drag-and-drop');
    });
}

function responseManager(response = null, type = null) {
    if (response) {
        if (response.hasOwnProperty("message")) {
            if (response.message == "activitySaved") {
                displayNotification('#notif-div', "classroom.activities.saved", "success");
            }
        } else if (response.hasOwnProperty("badResponse")) {
            saveActivitiesResponseManager(type, response);
        } else {
            validateDefaultResponseManagement(response);
        }
    } else {
        displayNotification('#notif-div', "classroom.notif.errorSending", "error");
    }
}

function saveActivitiesResponseManager(activityType = null, response = null) {
    if (activityType == 'fill-in') {
        if (response.hasOwnProperty("hint")) {
            if (response.hint != null && response.hint != "") {
                $("#activity-hint-container").show();
                $("#activity-hint").text(response.hint);
            }
        }

        let lengthResponse = $(`input[id^="student-fill-in-field-"]`).length;
        for (let i = 1; i < lengthResponse+1; i++) {
            if (response.badResponse.includes(i-1)) {
                $(`#student-fill-in-field-${i}`).css("border","2px solid red");
            } else {
                $(`#student-fill-in-field-${i}`).css("border","2px solid green");
            }
        }
    } else if (activityType == 'drag-and-drop') {
        for (let i = 0; i < $(`span[id^="dz-"]`).length; i++) {
            $('#dz-' + i).css("border","1px solid var(--classroom-text-0)");
        }

        for (let i = 0; i < response.badResponse.length; i++) {
            $('#dz-' + (response.badResponse[i])).css("border","1px solid red");
        }

        if (response.hasOwnProperty("hint")) {
            if (response.hint != null && response.hint != "") {
                $("#activity-hint-container").show();
                $("#activity-hint").text(response.hint);
            }
        }
    } else if (activityType == 'quiz') {
        for (let i = 1; i < $(`input[id^="student-quiz-suggestion-"]`).length+1; i++) {
            $('#student-quiz-suggestion-' + i).parent().addClass('quiz-answer-correct');
        }

        for (let i = 0; i < response.badResponse.length; i++) {
            $('#student-quiz-suggestion-' + (response.badResponse[i]+1)).parent().addClass('quiz-answer-incorrect');
        }

        if (response.hasOwnProperty("hint")) {
            if (response.hint != null && response.hint != "") {
                $("#activity-hint-container").show();
                $("#activity-hint").text(response.hint);
            }
        }
    } else if (activityType == 'free') {
        displayNotification('#notif-div', "classroom.activities.wrongAnswer", "error");
    }
}




function activitiesCreation(apps) {

    let titleRoad = "newActivities.ActivitiesData.title.";
    let descriptionRoad = "newActivities.ActivitiesData.description.";

    // sort application by sort index
    apps.sort(sortFunctionBySort);

    let htmlContent = `<div class="app-head" data-i18n="classroom.activities.applist.selectApp"></div>`;
    apps.forEach(app => {

        let nameField = "";
        if (i18next.t(titleRoad+app.name) != titleRoad+app.name) {
            nameField = `<h3 class="app-card-title mt-2" data-i18n="${titleRoad+app.name}"></h3>`;
        } else if (i18next.t(app.name) != app.name) {
            nameField = `<h3 class="app-card-title mt-2" data-i18n="${app.name}"></h3>`;
        } else {
            nameField = `<h3 class="app-card-title mt-2">${app.name}</h3>`;
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
        return false;
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

$('#fill-in-add-inputs').click(() => {
    $('#fill-in-content').htmlcode($('#fill-in-content').htmlcode() + `<span class="lms-answer">réponse</span> \&nbsp`);
});

function parseFillInFieldsAndSaveThem() {
    
    Main.getClassroomManager()._createActivity.content.fillInFields.contentForTeacher = $('#fill-in-content').bbcode();
    
    let response = $('#fill-in-content').bbcode().match(/\[answer\](.*?)\[\/answer\]/gi).map(match => match.replace(/\[answer\](.*?)\[\/answer\]/gi, "$1"));
    let contentForStudent = $('#fill-in-content').bbcode();
    response.forEach((e, i) => {
        contentForStudent = contentForStudent.replace(`[answer]${e}[/answer]`, `﻿`);
        if (e.includes('&&')) {
            response[i] = e.split('&&').map(e => e.trim()).join(',');
        }
    })

    if ($('#fill-in-states').bbcode() != '') {
        Main.getClassroomManager()._createActivity.content.states = $('#fill-in-states').bbcode();
    } else {
        return false;
    }

    Main.getClassroomManager()._createActivity.tolerance = $('#fill-in-tolerance').val();
    Main.getClassroomManager()._createActivity.autocorrect = $('#fill-in-autocorrect').is(":checked");
    Main.getClassroomManager()._createActivity.content.hint = $('#fill-in-hint').val();

    Main.getClassroomManager()._createActivity.solution = response;
    Main.getClassroomManager()._createActivity.content.fillInFields.contentForStudent = contentForStudent;

    if (Main.getClassroomManager()._createActivity.content.fillInFields.contentForTeacher == "") {
        return false
    }
    return true;
}

$('#dragAndDrop-add-inputs').click(() => {
    $('#drag-and-drop-content').htmlcode($('#drag-and-drop-content').htmlcode() + `<span class="lms-answer">réponse</span> \&nbsp`);
});


function parseDragAndDropFieldsAndSaveThem() {
    
    Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForTeacher = $('#drag-and-drop-content').bbcode();
    
    let response = $('#drag-and-drop-content').bbcode().match(/\[answer\](.*?)\[\/answer\]/gi).map(match => match.replace(/\[answer\](.*?)\[\/answer\]/gi, "$1"));
    let contentForStudent = $('#drag-and-drop-content').bbcode();
    response.forEach((e, i) => {
        contentForStudent = contentForStudent.replace(`[answer]${e}[/answer]`, `﻿`);
        if (e.includes('&&')) {
            response[i] = e.split('&&').map(e => e.trim()).join(',');
        }
    })

    if ($('#drag-and-drop-states').bbcode() != '') {
        Main.getClassroomManager()._createActivity.content.states = $('#drag-and-drop-states').bbcode();
    } else {
        return false;
    }

    Main.getClassroomManager()._createActivity.autocorrect = $('#drag-and-drop-autocorrect').is(":checked");
    Main.getClassroomManager()._createActivity.content.hint = $('#drag-and-drop-hint').val();

    Main.getClassroomManager()._createActivity.solution = response;
    Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForStudent = contentForStudent;

    if (Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForTeacher == "") {
        return false;
    }
    return true;
}


function addQuizSuggestion() {
    let i = 0;
    
    do {
        i++;
    } while ($(`#quiz-suggestion-${i}`).length > 0);

    let divToAdd = `<div class="form-group c-primary-form" id="quiz-group-${i}">
                        <label for="quiz-suggestion-${i}" id="quiz-label-suggestion-${i}">Proposition ${i}</label>
                        <button class="btn c-btn-grey mx-2" data-i18n="newActivities.delete" id="quiz-button-suggestion-${i}" onclick="deleteQuizSuggestion(${i})">Delete</button>

                        <div class="input-group mt-3">
                            <input type="text" id="quiz-suggestion-${i}" class="form-control">
                            <div class="input-group-append">
                                <div class="input-group-text c-checkbox c-checkbox-grey">
                                    <input class="form-check-input" type="checkbox" id="quiz-checkbox-${i}">
                                    <label class="form-check-label" for="quiz-checkbox-${i}">Réponse correcte</label>
                                </div>
                            </div>
                        </div>
                    </div>`;
              
    $('#quiz-suggestions-container').append(divToAdd);
    $(`#quiz-button-suggestion-${i}`).localize();
}

function parseQuizFieldsAndSaveThem() {
    // check empty fields
    let emptyFields = checkEmptyQuizFields();
    let checkBox = checkQuizCheckbox();
    if (emptyFields) { 
        displayNotification('error', 'newActivities.emptyFields');
        return false;
    } else if (!checkBox) {
        displayNotification('error', 'newActivities.checkBox');
        return false;
    } else {
        let tempArraySolution = []; 
        let tempArraycontentForStudent = []; 
        for (let i = 1; i < $(`input[id^="quiz-suggestion-"]`).length+1; i++) {
            let res = {
                inputVal: $(`#quiz-suggestion-${i}`).val(),
                isCorrect: $(`#quiz-checkbox-${i}`).is(':checked')
            }
            let student = {
                inputVal: $(`#quiz-suggestion-${i}`).val()
            }
            tempArraySolution.push(res);
            tempArraycontentForStudent.push(student);
        }

        Main.getClassroomManager()._createActivity.content.quiz.contentForStudent = tempArraycontentForStudent;
        Main.getClassroomManager()._createActivity.solution = tempArraySolution;
        
        Main.getClassroomManager()._createActivity.content.hint = $('#quiz-hint').val();
        Main.getClassroomManager()._createActivity.autocorrect = $('#quiz-autocorrect').is(":checked");
        
        if ($('#quiz-states').bbcode() != '') {
            Main.getClassroomManager()._createActivity.content.states = $('#quiz-states').bbcode();
        } else {
            return false;
        }
        return true;
    }
}

function checkEmptyQuizFields() {
    let empty = false;
    for (let i = 1; i < $(`input[id^="quiz-suggestion-"]`).length+1; i++) {
        if ($(`#quiz-suggestion-${i}`).val() == '') {
            empty = true;
        }
    }
    return empty;
}

// check if at least one checkbox is checked
function checkQuizCheckbox() {
    let checkboxes = $(`input[id^="quiz-checkbox-"]`);
    let checked = false;
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checked = true;
        }
    }
    return checked;
}

function deleteQuizSuggestion(number) {
    $(`#quiz-group-${number}`).remove();
}

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

function launchLtiResource(activityId, activityType, activityContent, isStudentLaunch = false, studentResourceUrl = false) {
    document.querySelector('#activity-content').innerHTML = 
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
    $("#activity-content-container").show();
}


$('body').on('click', '#free-tolerance-increase', function () {
    let tolerance = parseInt($('#free-tolerance').val());
    if (!isNaN(tolerance)) {
        $(`#free-tolerance`).val(tolerance+1);
    } else {
        $(`#free-tolerance`).val(1);
    }
})

$('body').on('click', '#free-tolerance-decrease', function () {
    let tolerance = parseInt($('#free-tolerance').val());
    if (tolerance > 0) {
        $(`#free-tolerance`).val(tolerance-1);
    }
})

$('body').on('click', '#fill-in-tolerance-increase', function () {
    let tolerance = parseInt($('#fill-in-tolerance').val());
    if (!isNaN(tolerance)) {
        $(`#fill-in-tolerance`).val(tolerance+1);
    } else {
        $(`#fill-in-tolerance`).val(1);
    }
})

$('body').on('click', '#fill-in-tolerance-decrease', function () {
    let tolerance = parseInt($('#fill-in-tolerance').val());
    if (tolerance > 0) {
        $(`#fill-in-tolerance`).val(tolerance-1);
    }
})

