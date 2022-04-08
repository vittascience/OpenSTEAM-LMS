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

function deleteQcmFields() {
    $(`div[id^="teacher-suggestion-"]`).each(function() {
        $(this).remove();
    })

    $(`div[id^="qcm-field-"]`).each(function() {
        $(this).remove();
    })

    $(`div[id^="qcm-not-doable-"]`).each(function() {
        $(this).remove();
    })

    $(`div[id^="qcm-doable-"]`).each(function() {
        $(this).remove();
    })

    $(`div[id^="quiz-group-"]`).each(function() {
        if ($(this).attr('id') != "quiz-group-1") {
            $(this).remove();
        }
    })
}

/**
 * Visibility management
 */

// Set all the inputs we need to reset
function resetInputsForActivity() {
    // Autocorrect note disclaimer
    $("#activity-auto-corrected-disclaimer").hide();
    $("#activity-auto-disclaimer").hide();
    $("#activity-content-container").hide();
    // Hide all the divs
    $('#activity-introduction').hide();
    $('#activity-correction-container').hide();
    
    // Field for free activity
    $('#activity-input-container').hide();
    $('#activity-student-response').hide();
    $('#activity-student-response-content').text('');
    
    // Fields
    $('#activity-states').html("");
    $('#activity-title').html("");
    $('#activity-details').html('');
    $('#activity-content').html("");
    $('#activity-correction').html("");

    // Hint
    $("#activity-hint").text('');
    $("#activity-hint-container").hide();

    // Drag and drop
    $('#activity-drag-and-drop-container').hide();
    $('#drag-and-drop-fields').html('');
    $('#drag-and-drop-text').html('');

    // Warning message for
    $('#warning-text-evaluation').hide();
    $("#warning-text-no-evaluation").hide();

    // Quiz reset input
    deleteQcmFields();
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
    } else if (activityType == 'fillIn') {
        /* fill-in reset */
        $('#fill-in-states').htmlcode("");
        $('#fill-in-content').htmlcode("");
        $('#fill-in-hint').val("");
        $('#fill-in-tolerance').val("");
        $('#fill-in-autocorrect').prop('checked', false);
    } else if (activityType == 'reading') {
        /* reading reset */
        $('#reading-content').htmlcode("");
    } else if (activityType == 'dragAndDrop') {
        /* drag-and-drop reset */
        $('#drag-and-drop-states').htmlcode("");
        $('#drag-and-drop-content').htmlcode("");
        $('#drag-and-drop-hint').val("");
        $('#drag-and-drop-tolerance').val("");
        $('#drag-and-drop-autocorrect').prop('checked', false);
    } else if (activityType == 'quiz') {
        /* quiz reset */
        $('#quiz-states').htmlcode("");
        $('#quiz-hint').val("");
        $('#quiz-tolerance').val("");
        $('#quiz-autocorrect').prop('checked', false);
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
    $('#dragAndDrop-add-inputs').attr("title", i18next.t('newActivities.addFieldTooltip'));
    $('#fillIn-add-inputs').attr("title", i18next.t('newActivities.addFieldTooltip'));
}


