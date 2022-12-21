function parseContent(content, className, autoWidth = false) {
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
    $(`#activity-student-response-content${courseIndicator}`).text('');
    
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
        $('#fill-in-hint').val("");
        $('#fill-in-tolerance').val(0);
    } else if (activityType == 'reading') {
        /* reading reset */
        $('#reading-content').htmlcode("");
    } else if (activityType == 'dragAndDrop') {
        /* drag-and-drop reset */
        $('#drag-and-drop-states').htmlcode("");
        $('#drag-and-drop-content').htmlcode("");
        $('#drag-and-drop-hint').val("");
        $('#drag-and-drop-tolerance').val("");
    } else if (activityType == 'quiz') {
        /* quiz reset */
        $('#quiz-states').htmlcode("");
        $('#quiz-hint').val("");
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


