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
    $("#fill-in-hint").wysibb(options);

    // DragAndDrop
    $("#drag-and-drop-states").wysibb(options);
    $("#drag-and-drop-content").wysibb(options);
    $("#drag-and-drop-hint").wysibb(options);

    // Quiz
    $("#quiz-states").wysibb(options);
    $("#quiz-hint").wysibb(options);

    // quiz rework
    const btns = "fontcolor,underline,math,customimageupload,myimages,keys,screens";
    const optMini = Main.getClassroomManager().returnCustomConfigWysibb(btns, 100)
    $("#quiz-suggestion-1").wysibb(optMini);
}

// autocorrect modification pas pris en compte

function LtiDefaultCode(activityType, isUpdate) {
    Main.getClassroomManager().setActivityIsLti(true);
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
    // Reset the tag list
    manageTagList([]); 
    
    const contentForwardButtonElt = document.getElementById('content-forward-button');
    contentForwardButtonElt.style.display = 'inline-block';
    if(!isUpdate) {
        // Reset and hide all activities input and fields
        resetActivityInputs(activityType);
    }
    hideAllActivities();
    setAddFieldTooltips();
    Main.getClassroomManager()._createActivity.id = activityType;
    if (!isUpdate) {
        Main.getClassroomManager()._createActivity.function = "create";
    }

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
    breadcrumbManager.addItemCreateActivity(activityType);
}

function contentBackward() {
    Main.getClassroomManager().getAllApps().then((apps) => {
        navigatePanel('classroom-dashboard-proactivities-panel-teacher', 'dashboard-activities-teacher');
        activitiesCreation(apps);
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
            folder = foldersManager.actualFolder,
            tags = getAllTagId();

        if (type == "dragAndDrop" || type == "fillIn" || type == "quiz") {
            autocorrect = true;
        }

        if (Main.getClassroomManager()._createActivity.function == "create") {  
            Main.getClassroomManager().createNewActivity(title, type, content, solution, tolerance, autocorrect, folder, tags).then((response) => {
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
            Main.getClassroomManager().updateActivity(ClassroomSettings.activity, title, type, content, solution, tolerance, autocorrect, tags).then((response) => {
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


function defaultCallback(activity, correction, interface) {
    if (!interface) {
        navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities');
        actualizeStudentActivities(activity, correction);
        $("#activity-validate").attr("disabled", false);
    } else {
        actualizeStudentActivities(activity, correction)
        $("#activity-validate").attr("disabled", false);
        navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
    }
}

/**
 * Validation pipeline for the new activity
 */
function validateActivity(correction) {
    // filter activityAndCase to get the right function
    // CustomActivity = Manager for the custom activity
    const funct = customActivity.activityAndCase.filter(activityValidate => activityValidate[0] == Activity.activity.type)[0];
    if (funct) {
        funct[1](funct[2] ? correction : null, false, defaultCallback);
    } else {
        defaultProcessValidateActivity(correction, false, defaultCallback);
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

    breadcrumbManager.addItemCreateActivityEmpty();

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
            nameField = `<h2 class="app-card-title mt-2" data-i18n="${titleRoad+app.name}"></h2>`;
        } else if (i18next.t(app.name) != app.name) {
            nameField = `<h2 class="app-card-title mt-2" data-i18n="${app.name}"></h2>`;
        } else {
            let appName = app.name.replaceAll("-", " ");
            nameField = `<h2 class="app-card-title mt-2">${appName}</h2>`;
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

        htmlContent +=
          `
            <div class="app-card" style="--border-color:${app.color};" onclick="${restrict}" onkeydown="if(event.key==='Enter'||event.key===' '){${restrict}}" tabindex="0" aria-label="${app.name}">
              <img class="app-card-img" src="${app.image}" alt="${app.name}"/>
              ${nameField}
              ${descriptionField}
            </div>
          `;
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
        <iframe id="lti_teacher_iframe" src="about:blank" name="lti_teacher_iframe" title="Tool Content" class="lti-iframe-height" width="100%"  height="100%" allow="fullscreen *; microphone *; camera *; serial *; usb *"></iframe>
    </div>`;

    document.forms["contentitem_request_form"].submit();
}

function launchLtiResource(activityId, activityType, activityContent, isStudentLaunch = false, studentResourceUrl = false, activityContentId = "#activity-content", isFromCourse = false) {
    let course = isFromCourse ? "-course" : "";
    let height = window.innerHeight - 330;
    document.querySelector(activityContentId + course).innerHTML = 
        `<input id="activity-score" type="text" hidden/>
        <form name="resource_launch_form" action="${_PATH}lti/ltilaunch.php" method="post" target="lti_student_iframe">
            <input type="hidden" id="application_type" name="application_type" value="${activityType}">
            <input type="hidden" id="target_link_uri" name="target_link_uri" value="${activityContent.replace('&amp;', '&')}">
            <input type="hidden" id="student_launch" name="student_launch" value="${isStudentLaunch}">
            <input type="hidden" id="activities_link_user" name="activities_link_user" value="${activityId}">
            <input type="hidden" id="student_resource_url" name="student_resource_url" value="${studentResourceUrl}">
        </form>
        <iframe id="lti_student_iframe" src="about:blank" name="lti_student_iframe" title="Tool Content" width="100%" style="height: ${height}px" allow="fullscreen *; microphone *; camera *; serial *; usb *" ></iframe>
        `;
    document.forms["resource_launch_form"].submit();
    $("#activity-content-container"+course).show();
}

function showLtiContentAsSimpleIframe(description = false) {
    let height = window.innerHeight - 330;
    const urlParams = new URLSearchParams(description);

    let projectLink = urlParams.get('project_link'),
        consoleState = urlParams.get('console'),
        mode = urlParams.get('mode'),
        board = urlParams.get('board'),
        toolbox = urlParams.get('toolbox');

    let interfaceName = description.substring(description.indexOf('interface=') + 10, description.indexOf('&', description.indexOf('interface=')));

    let url = `https://fr.vittascience.com/${interfaceName}/?link=${projectLink}&console=${consoleState}&mode=${mode}&board=${board}&toolbox=${toolbox}`;
    document.querySelector("#activity-content").innerHTML = 
        `<iframe id="lti_student_iframe" src="${url}" title="Tool Content" width="100%" style="height: ${height}px" allow="fullscreen *; microphone *; camera *; serial *; usb *" ></iframe>`;
    $("#activity-content-container").show();
}


function ActivityPreviewBeforeCreation(type) {

    $('#activity-preview-div').hide();

    const $title = $('#preview-title'),
        $statesText = $('#preview-activity-states'),
        ActivityPreview = Main.getClassroomManager()._createActivity;

    resetPreviewViews();
    
    $title.html(Main.getClassroomManager()._createActivity.title);
    $statesText.html(bbcodeContentIncludingMathLive(Main.getClassroomManager()._createActivity.content.states));
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
        fillInManager.showErrors(response);
        hintManager(response, courseIndicator)
    } else if (activityType == 'drag-and-drop') {
        dragAndDropManager.showErrors(response);
        hintManager(response, courseIndicator)
    } else if (activityType == 'quiz') {
        quizManager.showErrors(response);
        hintManager(response, courseIndicator)
    } else if (activityType == 'free') {
        displayNotification('#notif-div', "classroom.activities.wrongAnswer", "error");
    }
}

function hintManager(response, courseIndicator = "") {
    if (response.hasOwnProperty("hint")) {
        if (response.hint != null && response.hint != "") {
            $(`#activity-hint-container${courseIndicator}`).show();
            $(`#activity-hint${courseIndicator}`).html(bbcodeContentIncludingMathLive(response.hint));
        }
    }
}

/* Now include course to avoid duplicate */
function defaultProcessValidateActivity(correction = null, isFromCourse = false, callback = null, activityOverride = null) {
    $("#activity-validate").attr("disabled", "disabled");

    if (activityOverride != null) {
        Activity = activityOverride;
    }

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
        Main.getClassroomManager().saveStudentActivity(false, false, Activity.id, correction, 4).then(function (activity) {
            if (typeof activity.errors != 'undefined') {
                for (let error in activity.errors) {
                    displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                    $("#activity-validate").attr("disabled", false);
                }
            } else  {
               callback(activity, correction, interfaceData);
            }
        })
        window.localStorage.classroomActivity = null
    } else if (Activity.autocorrection == false) {
        let correction = 1;
        const interfaceName = interfaceData[2];
        let project = window.localStorage[interfaceName + 'CurrentProject']

        
        let projectParsed = tryToParse(project);
        if (!projectParsed) {
            projectParsed = null;
        }

        Main.getClassroomManager().saveStudentActivity(projectParsed, interfaceName, Activity.id).then(function (activity) {
            if (typeof activity.errors != 'undefined') {
                for (let error in activity.errors) {
                    displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                    $("#activity-validate").attr("disabled", false);
                }
            } else {
                callback(activity, correction, interfaceData);
            }
        })
    } else {
        $("#activity-validate").attr("disabled", false);
        window.localStorage.autocorrect = true
    }
}

/* 
    Tags management
*/

const addTagToList = document.getElementById('add-tag-to-list');
if (addTagToList) {
    addTagToList.addEventListener('click', () => {
        const tagListSelect = document.getElementById('taglist-select');
        const tagList = document.getElementById('taglist');
        const selectedTags = tagListSelect.selectedOptions;

        // check if the tag is already in the list with the dataset
        const tagListDivs = tagList.querySelectorAll('div');
        for (let i = 0; i < tagListDivs.length; i++) {
            const tagListDiv = tagListDivs[i];
            if (tagListDiv.dataset.tags == selectedTags[0].value) {
                displayNotification('#notif-div', "classroom.notif.tagAlreadyInList", "error");
                return;
            }
        }

        for (let i = 0; i < selectedTags.length; i++) {
            const tag = selectedTags[i];
            const tagDiv = document.createElement('div');
            tagDiv.dataset.tags = tag.value;
            tagDiv.classList.add('tag');
            tagDiv.classList.add('m-2');
            tagDiv.classList.add('px-2');
            tagDiv.classList.add('c-btn-primary');
            tagDiv.innerHTML = tag.innerHTML + '<i class="fas fa-times ms-2"></i>';
            tagList.appendChild(tagDiv);
        }

        // add event listener to remove the tag on the i element
        const tagDivs = tagList.querySelectorAll('div');
        for (let i = 0; i < tagDivs.length; i++) {
            const tagDiv = tagDivs[i];
            tagDiv.addEventListener('click', () => {
                tagDiv.remove();
            });
        }

    });
}

function getAllTagId() {
    const tagList = document.getElementById('taglist');

    if (tagList == null) {
        return [];
    }

    const tagDivs = tagList.querySelectorAll('div');
    let tagIds = [];
    for (let i = 0; i < tagDivs.length; i++) {
        const tagDiv = tagDivs[i];
        tagIds.push(tagDiv.dataset.tags);
    }
    return tagIds;
}


function manageTagList(taglist) {
    const eTagList = document.getElementById('taglist');
    if (eTagList == null) {
        return;
    }

    eTagList.innerHTML = '';
    for (let i = 0; i < taglist.length; i++) {
        // Main.getClassroomManager().tagList find
        const tag = Main.getClassroomManager().tagList.find((tag) => {
            return tag.id == taglist[i];
        });

        const tagDiv = document.createElement('div');
        tagDiv.dataset.tags = tag.id;
        tagDiv.classList.add('tag');
        tagDiv.classList.add('m-2');
        tagDiv.classList.add('px-2');
        tagDiv.classList.add('c-btn-primary');
        tagDiv.innerHTML = tag.name + '<i class="fas fa-times ms-2"></i>';
        eTagList.appendChild(tagDiv);
    }

    // add event listener to remove the tag on the i element
    const tagDivs = eTagList.querySelectorAll('div');
    for (let i = 0; i < tagDivs.length; i++) {
        const tagDiv = tagDivs[i];
        tagDiv.addEventListener('click', () => {
            tagDiv.remove();
        });
    }
}



function loadActivityContent(doable = false) {
    if (IsJsonString(Activity.content)) {
        
        const contentParsed = JSON.parse(Activity.content);
        let funct = null;

        if (doable) {
            funct = customActivity.getTeacherActivityCustomDoable.filter(activityValidate => activityValidate[0] == Activity.type)[0];
        } else {
            funct = customActivity.getTeacherActivityCustom.filter(activityValidate => activityValidate[0] == Activity.type)[0];
        }

        if (funct) { 
            funct[1](contentParsed, Activity);
        } else {
            // LTI Activity
            if (Activity.isLti) {
                //launchLtiResource(Activity.id, Activity.type, JSON.parse(Activity.content).description);
                showLtiContentAsSimpleIframe(JSON.parse(Activity.content).description);
            } else {
                // Non core and non LTI Activity fallback
                $("#activity-content").html(bbcodeToHtml(contentParsed));
                $("#activity-content-container").show();
            }
        }      
    } else {
        $('#activity-content').html(bbcodeToHtml(Activity.content))
        $("#activity-content-container").show();
    }

    $('#activity-introduction').hide();
    $('#activity-validate').hide();

    breadcrumbManager.setActivityTitle(Activity.title);
}