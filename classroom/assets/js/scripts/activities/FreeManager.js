class FreeManager {

    init() {
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
    }


    freeValidateActivity(correction = 1, isFromCourse = false) {
        let courseIndicator = isFromCourse ? "-course" : "";
        let studentResponse = $(`#activity-input${courseIndicator}`).bbcode();

        let activityId = isFromCourse ? coursesManager.actualCourse.activity : Activity.activity.id,
            activityLink = isFromCourse ? coursesManager.actualCourse.link : Activity.id;


        if (studentResponse == null || studentResponse == '') {
            displayNotification('#notif-div', "classroom.activities.emptyAnswer", "error");
            return;
        }

        Main.getClassroomManager().saveNewStudentActivity(activityId, correction, null, studentResponse, activityLink).then((response) => {
            if (isFromCourse) {
                coursesManager.coursesResponseManager(response, 'free');
            } else {
                responseManager(response, 'free');
            }
        });
    }


    manageUpdateForFree(activity) {
        $('#activity-free').show();
        let content = JSON.parse(activity.content);
        if (content.description != "" && content.description != null) {
            $('#free-content').forceInsertBbcode(content.description);
        }
    
        // set tolerance 
        if (content.tolerance != null) {
            $('#free-tolerance').val(activity.tolerance);
        }
    
        if (activity.isAutocorrect) {
            $("#free-autocorrect").prop("checked", true)
            $("#free-correction-content").show();
        } else {
            $("#free-autocorrect").prop("checked", false)
            $("#free-correction-content").hide();
        }
        if (activity.solution != "") {
            if (JSON.parse(activity.solution) != null && JSON.parse(activity.solution) != "") {
                $('#free-correction').forceInsertBbcode(JSON.parse(activity.solution));
            }
        }
        navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
    }

    showTeacherFreeActivity(contentParsed, Activity) {
        if (contentParsed.hasOwnProperty('description')) {
            $('#activity-content').html(bbcodeContentIncludingMathLive(contentParsed.description));
            $('#activity-content-container').show();
        } 
    }

    showTeacherFreeActivityDoable(contentParsed, Activity) {
        let activityContent = document.getElementById('activity-content');
        activityContent.innerHTML = '';

        let textAreaDiv = document.createElement('div');
        textAreaDiv.id = 'free-preview-teachers';
        textAreaDiv.className = 'd-flex flex-column';

        let label = document.createElement('label');
        label.className = 'vitta-modal-title mt-2';
        label.setAttribute('for', 'free-preview-teachers-preview');
        label.setAttribute('data-i18n', '[html]newActivities.preview');
        textAreaDiv.appendChild(label);

        let textArea = document.createElement('textarea');
        textArea.id = 'free-preview-teachers-textarea';
        textArea.className = 'wysibb-textarea';
        textArea.style.height = '400px';
        textAreaDiv.appendChild(textArea);

        activityContent.appendChild(textAreaDiv);
        
        const wbbptions = Main.getClassroomManager().wbbOpt;
        $('#free-preview-teachers-textarea').wysibb(wbbptions);


        $('#activity-content-container').show();
    }


    manageDisplayFree(correction, content, correction_div, isFromCourse) {
        let course = isFromCourse ? "-course" : "";
        $('#activity-states'+course).html(bbcodeContentIncludingMathLive(content));
        $('#activity-states-container'+course).show();
        if (UserManager.getUser().isRegular) {
            if (Activity.response != null && Activity.response != '') {
                if (JSON.parse(Activity.response) != null && JSON.parse(Activity.response) != "") { 
                    $('#activity-student-response'+course).show();
                    let parsed = tryToParse(Activity.response);
                    if (parsed != false) {
                        $('#activity-student-response-content'+course).html(bbcodeContentIncludingMathLive(parsed));
                    } else if (Activity.response != null) {
                        $('#activity-student-response-content'+course).html(bbcodeContentIncludingMathLive(Activity.response));
                    }
                    manageCorrectionDiv(correction_div, correction, isFromCourse);
                }
            }
        }
        if (correction <= 1 || correction == null) {
            if (!UserManager.getUser().isRegular) {
                const wbbptions = Main.getClassroomManager().wbbOpt;
                $('#activity-input'+course).wysibb(wbbptions);
                if (Activity.response != null && Activity.response != '') {
                    let parsed = tryToParse(Activity.response);
                    if (parsed != false) {
                        $('#activity-input'+course).forceInsertBbcode(parsed);
                    } else {
                        $('#activity-input'+course).htmlcode("");
                    }
                }
                $('#activity-input-container'+course).show();
            }
        } else if (correction > 1) {
            $('#activity-student-response'+course).show();
            $('#activity-student-response-content'+course).html(bbcodeContentIncludingMathLive(JSON.parse(Activity.response)));
            manageCorrectionDiv(correction_div, correction, isFromCourse);
        }
    }

    renderFreeActivity(activityData, htmlContainer, idActivity, response) {

        if (activityData.doable) {
            const textArea = document.createElement('textarea');
            textArea.style.height = '400px';
            textArea.id = 'one-page-activity-content-' + idActivity; 
            coursesManager.manageStatesAndContentForOnePageCourse(idActivity, htmlContainer, activityData, false);
    
            htmlContainer.appendChild(textArea);
            coursesManager.manageValidateBtnForOnePageCourse(idActivity, htmlContainer, activityData);
    
            $('#one-page-activity-content-'+idActivity).wysibb(Main.getClassroomManager().wbbOpt);
    
            if (response != null && response != '') {
                if (JSON.parse(response) != null && JSON.parse(response) != "") {
                    let parsed = tryToParse(response);
                    if (parsed != false) {
                        $('#one-page-activity-content-'+idActivity).forceInsertBbcode(parsed);
                    } else {
                        $('#one-page-activity-content-'+idActivity).htmlcode(response);
                    }
                }
            }
        } else {
            const paragraph = document.createElement('p');
            htmlContainer.appendChild(paragraph);
            paragraph.innerHTML = activityData.content;
        }
        
    }

    getManageDisplayFree(content, activity, correction_div) {
        const activityData = {
            states: null,
            content: null,
            correction: null,
            doable: false,
            type: 'free',
            link: activity.id,
            id: activity.activity.id,
        }

        activityData.states = bbcodeContentIncludingMathLive(content);
        activityData.doable = !activity.correction > 1;

        if (activity.correction <= 1 || activity.correction == null) {
            if (!UserManager.getUser().isRegular) {
                activityData.doable = true;
                if (activity.response != null && activity.response != '') {
                    let parsed = tryToParse(activity.response);
                    if (parsed != false) {
                        activityData.content = parsed;
                    } else {
                        activityData.content = "";
                    }
                }
            }
        } else if (activity.correction > 1) {
            activityData.content = bbcodeContentIncludingMathLive(JSON.parse(activity.response));
            activityData.correction = returnCorrectionContent(correction_div, activity.activity.correction);
        }

        return activityData;
    }

    freeValidateActivityOnePageCourse(activityId, activityLink) {
        let studentResponse = $(`#one-page-activity-content-${activityId}`).bbcode();

        if (studentResponse == null || studentResponse == '') {
            displayNotification('#notif-div', "classroom.activities.emptyAnswer", "error");
            return;
        }

        Main.getClassroomManager().saveNewStudentActivity(activityId, 1, null, studentResponse, activityLink).then((response) => {
            if (response.hasOwnProperty('activity')) {
                coursesManager.manageValidateReponse(response);
            }
        });
    }

    freePreview() {
        $('#preview-activity-states').html(bbcodeContentIncludingMathLive(Main.getClassroomManager()._createActivity.content.description))
        $('#preview-activity-bbcode-content').wysibb(Main.getClassroomManager().wbbOpt);
        $('#preview-content-bbcode').show();
        $('#preview-states').show();
        $('#activity-preview-div').show();
    }
}

const freeManager = new FreeManager();
freeManager.init();

