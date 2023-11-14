/* function parseContent(content, className, autoWidth = false) {
    let values = content.match(/\[answer\](.*?)\[\/answer\]/gi).map(match => match.replace(/\[answer\](.*?)\[\/answer\]/gi, "$1"));

    for (let i = 0; i < values.length; i++) {
        if (autoWidth) {    
            autoWidthStyle = 'style="width:' + (values[i].length + 2) + 'ch"';
        } else {
            autoWidthStyle = '';
        }

        content = content.replace(`[answer]${values[i]}[/answer]`, `[answer][/answer]`);
        content = content.replace(/\[answer\]/, `<input readonly class='${className}' value="${values[i]}" ${autoWidthStyle}>`);
        content = content.replace(/\[\/answer\]/, "</input>");
    }
    
    return content;
} */

function parseContent(content, className, autoWidth = false) {
    let values = content.match(/\[answer\](.*?)\[\/answer\]/gi).map(match => match.replace(/\[answer\](.*?)\[\/answer\]/gi, "$1"));
    let autoWidthStyle = '';
    for (let i = 0; i < values.length; i++) {

        autoWidthStyle = autoWidth ? 'style="width:' + (values[i].length + 4) + 'ch"' : autoWidthStyle = '';

        content = content.replace(`[answer]${values[i]}[/answer]`, `[answer][/answer]`);
        let valueParsed = values[i].includes('[math]') ? parseMathLiveContent(values[i]) : values[i];

        if (bbcodeToHtml(valueParsed) != valueParsed) {
            content = content.replace(/\[answer\]/, bbcodeToHtml(valueParsed));
            content = content.replace(/\[\/answer\]/, "");
        } else {
            if (valueParsed.includes('<math-field')) {
                content = content.replace(/\[answer\]/, `<div readonly class='${className}' ${'style="width:' + (values[i].length / 5) + 'ch; height:6ch;"'}>` + valueParsed);
                content = content.replace(/\[\/answer\]/, "</div>");
            } else {
                content = content.replace(/\[answer\]/, `<input readonly class='${className}' value="${valueParsed}" ${'style="width:' + (values[i].length + 4) + 'ch"'}>`);
                content = content.replace(/\[\/answer\]/, "</input>");
            }
        }
    }
    
    return content;
}

function parseMathLiveContent(content) {
    if (!content.includes('[math]')) {
        return false;
    }
    content = content.replace(/\[math\]/gi, "<span>&nbsp;</span><math-field read-only style='display:inline-block'>")
    content = content.replace(/\[\/math\]/gi, "</math-field>") 
    return content;
}


function bbcodeContentIncludingMathLive(content) {
    if (content.includes('[math]')) {
        content = content.replace(/\[math\]/gi, "<math-field class='math-field-aligned' default-mode='inline-math' read-only style='display:inline-block'>")
        content = content.replace(/\[\/math\]/gi, "</math-field>")
    }
    return bbcodeToHtml(content);
}

/**
 * Visibility management
 */

// Set all the inputs we need to reset
function resetInputsForActivity(isFromCourse = false) {

    let courseIndicator = isFromCourse ? '-course' : '';
    
    $(`#activity-auto-corrected-disclaimer${courseIndicator}`).hide();
    $(`#activity-auto-disclaimer${courseIndicator}`).hide();
    $(`#activity-content-container${courseIndicator}`).hide();
    
    $(`#activity-introduction${courseIndicator}`).hide();
    $(`#activity-correction-container${courseIndicator}`).hide();
    $(`#activity-states-container${courseIndicator}`).hide();
    
    $(`#activity-input-container${courseIndicator}`).hide();
    $(`#activity-student-response${courseIndicator}`).hide();
    $(`#activity-student-response-content${courseIndicator}`).html('');
    
    $(`#activity-states${courseIndicator}`).html("");
    $(`#activity-title${courseIndicator}`).html("");
    $(`#activity-details${courseIndicator}`).html('');
    $(`#activity-content${courseIndicator}`).html("");
    $(`#activity-correction${courseIndicator}`).html("");
    
    $(`#activity-hint${courseIndicator}`).text('');
    $(`#activity-hint-container${courseIndicator}`).hide();
    
    $(`#activity-drag-and-drop-container${courseIndicator}`).hide();
    $(`#drag-and-drop-fields${courseIndicator}`).html('');
    $(`#drag-and-drop-text${courseIndicator}`).html('');
    
    $(`#warning-icon-container${courseIndicator}`).hide();
    $(`#warning-text-evaluation${courseIndicator}`).hide();
    $(`#warning-text-no-evaluation${courseIndicator}`).hide();

    // Quiz reset input
    quizManager.deleteQcmFields();
}

function resetActivityInputs(activityType) {
    resetDisplayForActivity();
    $('#global_title').val('');
    $('#activity-input').val('');

    $("#activity-hint").text('');
    $("#activity-hint-container").hide();

    if (activityType == 'free') {
        $('#free-content').htmlcode("");
        $('#free-correction').htmlcode("");
        $('#free-autocorrect').prop('checked', false);
        $("#free-correction-content").hide();
        $('#free-tolerance').val(0);
    } else if (activityType == 'fillIn') {
        /* fill-in reset */
        $('#fill-in-states').htmlcode("");
        $('#fill-in-content').htmlcode("");
        $('#fill-in-hint').htmlcode();
        $('#fill-in-tolerance').val(0);
    } else if (activityType == 'reading') {
        /* reading reset */
        $('#reading-content').htmlcode("");
    } else if (activityType == 'dragAndDrop') {
        /* drag-and-drop reset */
        $('#drag-and-drop-states').htmlcode("");
        $('#drag-and-drop-content').htmlcode("");
        $('#drag-and-drop-hint').htmlcode();
        $('#drag-and-drop-tolerance').val("");
    } else if (activityType == 'quiz') {
        /* quiz reset */
        $('#quiz-states').htmlcode("");
        $('#quiz-hint').htmlcode();
        $('#quiz-tolerance').val("");
        // Quiz reset input
        quizManager.deleteQcmFields();
    }
    Main.getClassroomManager().setDefaultActivityData();
}

function resetDisplayForActivity() {
    hideAllActivities();
    const ACTIVITY_CONTAINERS = [   '#activity-states-container', 
                                    '#activity-content-container', 
                                    '#activity-student-response', 
                                    '#activity-input-container', 
                                    '#activity-autocorrect-container'];
    ACTIVITY_CONTAINERS.forEach(view => {
        $(view).hide();
    });
}

function hideAllActivities() {
    const ACTIVITY_VIEWS = ['#activity-free', 
                            '#activity-reading', 
                            '#activity-fill-in', 
                            '#activity-drag-and-drop', 
                            '#activity-custom', 
                            '#activity-quiz'];
    ACTIVITY_VIEWS.forEach(view => {
        $(view).hide();
    });
}

$("#free-autocorrect").change(function () {
    if ($(this).is(":checked")) {
        $("#free-correction-content").show();
    } else {
        $("#free-correction-content").hide();
    }
})


function setAddFieldTooltips() {
    $('#dragAndDrop-add-inputs').tooltip("dispose")
    $('#fill-in-add-inputs').tooltip("dispose")
    $('#dragAndDrop-add-inputs').attr("title", i18next.t('newActivities.addFieldTooltip') ).tooltip();
    $('#fill-in-add-inputs').attr("title", i18next.t('newActivities.addFieldTooltip')).tooltip();
}

/* 
    * Create an HTML element with attributes and data
    * @param {string} type - The type of the element
    * @param {object} attributes - The attributes of the element
    * @param {string} data - The data of the element
*/
function createHtmlElement(type, attributes = {}, data = "") {
    let element = document.createElement(type);
    for (let attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }
    if (data) {
        element.innerHTML = data;
    }
    return element;
}

function exportActivityToJSON(activityId) {

    const Activity = Main.getClassroomManager().getLocalActivityById(activityId);

    const blob = new Blob([JSON.stringify(Activity)], { type: "text/json" });
    const link = document.createElement("a");

    link.download = `activity-${slugify(Activity.title)}-${Activity.id}.json`;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    try {
        link.dispatchEvent(evt);
        link.remove();
        displayNotification('#notif-div', "newActivities.exportSuccess", "success");
    } catch (e) {
        displayNotification('#notif-div', "newActivities.exportError", "error");
        console.error(e);
    }
}

function importActivityFromJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    input.dispatchEvent(evt);
    input.remove();

    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const activity = JSON.parse(reader.result);

            // check activity validity
            if (!activity.type || !activity.id || !activity.title || !activity.content) {
                displayNotification('#notif-div', "newActivities.importError", "error");
                return;
            }

            customActivity.activityToImport = activity;
            pseudoModal.openModal("import-activity-modal");
            
            const   titleDiv = document.getElementById("import-activity-title"),
                    translationPath = `newActivities.ActivitiesData.title.${activity.type}`;
            
            titleDiv.innerHTML = `<span class="c-text-secondary">[${i18next.t(translationPath)}]</span> : <span class="c-text-primary font-weight-bold">${activity.title}</span>`;
        };

        reader.onerror = function() {
            displayNotification('#notif-div', "newActivities.importError", "error");
        };
    });
}

function persistImport() {
    const activity = customActivity.activityToImport;

    const   title = activity.title,
            type = activity.type,
            content = activity.content,
            solution = activity.solution,
            tolerance = activity.tolerance,
            autocorrect = activity.autocorrect,
            folder = foldersManager.actualFolder,
            tags = activity.tags;

    Main.getClassroomManager().createNewActivity(title, type, content, solution, tolerance, autocorrect, folder, tags).then((response) => {
        if (response.success == true) {
            Main.getClassroomManager()._lastCreatedActivity = response.id;
            displayNotification('#notif-div', "newActivities.importSuccess", "success");
            navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher');
            pseudoModal.closeModal("import-activity-modal");
        } else {
            displayNotification('#notif-div', "newActivities.importError", "error");
        }
    });
}

function cancelImport() {
    customActivity.activityToImport = null;
    pseudoModal.closeModal("import-activity-modal");
}


function initializeDragulaWithOneContainer(idContainer, classDropZone, activityId = null) {
    let droppableName = 'droppable'
    if (activityId != null) {
        droppableName += '-'+activityId;
    }

    if (Main.getClassroomManager().droppable[droppableName] != undefined) {
        Main.getClassroomManager().droppable[droppableName].destroy();
    }

    Main.getClassroomManager().droppable[droppableName] = new Draggable.Droppable(
        document.querySelectorAll(`#${idContainer}`),
        {
            draggable: '.draggable-items',
            dropzone: '.'+classDropZone,
        },
    );

    Main.getClassroomManager().droppable[droppableName].on('droppable:stop', (evt) => {
        if (evt.dropzone.classList.contains('drag-and-drop-fields')) {
            if (evt.dropzone.classList.contains("draggable-dropzone--occupied")) {
                evt.dropzone.classList.remove("draggable-dropzone--occupied");
            }
        }
    });
}




