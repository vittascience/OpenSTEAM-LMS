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
        let contentParsed = tryToParse(activity.content) == false ? activity.content : tryToParse(activity.content);
        if (contentParsed.description != "" && contentParsed.description != null) {
            $('#free-content').forceInsertBbcode(contentParsed.description);
        }
    
        // set tolerance 
        if (contentParsed.tolerance != null) {
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
            let solutionParsed = tryToParse(activity.solution) == false ? activity.solution : tryToParse(activity.solution);
            if (solutionParsed != null && solutionParsed != "") {
                $('#free-correction').forceInsertBbcode(solutionParsed);
            }
        }
        navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
    }

    showTeacherFreeActivity(contentParsed, Activity) {
        if (contentParsed.hasOwnProperty('description')) {

            let state = document.getElementById('activity-states');
            state.innerHTML = '';
            state.innerHTML = bbcodeContentIncludingMathLive(contentParsed.description);
            
            let stateContainer = document.getElementById('activity-states-container');
            stateContainer.style.display = 'block';

            let divContainer = document.getElementById('activity-content-container');
            divContainer.style.display = 'none';
        } 
    }

    showTeacherFreeActivityDoable(contentParsed, Activity) {
        let activityContent = document.getElementById('activity-content');
        activityContent.innerHTML = '';

        let state = document.getElementById('activity-states');
        state.innerHTML = '';
        state.innerHTML = bbcodeContentIncludingMathLive(contentParsed.description);

        let stateContainer = document.getElementById('activity-states-container');
        stateContainer.style.display = 'block';

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
        let parsed = tryToParse(Activity.response) == false ? Activity.response : tryToParse(Activity.response);
        if (UserManager.getUser().isRegular) {
            if (Activity.response != null && Activity.response != '') {
                if (parsed != null && parsed != "") { 
                    $('#activity-student-response'+course).show();
                    if (parsed != false) {
                        $('#activity-student-response-content'+course).html(bbcodeContentIncludingMathLive(parsed));
                    } else if (parsed != null) {
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
                $('#activity-input').htmlcode("");
                if (parsed != null && parsed != '') {
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
            $('#activity-student-response-content'+course).html(bbcodeContentIncludingMathLive(parsed));
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

            $('#one-page-activity-content-'+idActivity).wysibb(Main.getClassroomManager().wbbOpt);
    
            if (response != null && response != '') {

                let parsed = tryToParse(response) == false ? response : tryToParse(response);
                if (parsed != null && parsed != "") {
                    if (parsed != false) {
                        $('#one-page-activity-content-'+idActivity).forceInsertBbcode(parsed);
                    } else {
                        $('#one-page-activity-content-'+idActivity).htmlcode(response);
                    }
                }
            }

            if (activityData.correction == 1) {
                const info = document.createElement('p');
                info.id = 'info-one-page-activity-content-' + idActivity;
                info.classList.add('c-text-primary', 'm-2', 'fw7-uncolored', 'hint-one-page-course');
                info.innerHTML = i18next.t("newActivities.statusActivitySent");
                htmlContainer.appendChild(info);
            }

            if (activityData.correction == 1) {
                coursesManager.manageValidateBtnForOnePageCourse(idActivity, htmlContainer, activityData, true);
            } else {
                coursesManager.manageValidateBtnForOnePageCourse(idActivity, htmlContainer, activityData);
            }


        } else {
            const h5 = document.createElement('h5');
            h5.id = 'h5-one-page-activity-content-' + idActivity;
            h5.classList.add('c-text-primary', 'mt-2');
            h5.innerHTML = i18next.t("classroom.activities.yourAnswer");
            htmlContainer.appendChild(h5);

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
            correction: 0,
            type: 'free',
            link: activity.id,
            id: activity.activity.id,
        }

        activityData.states = bbcodeContentIncludingMathLive(content);
        activityData.doable = activity.correction <= 1 || activity.correction == null;
        activityData.correction = activity.correction;

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
            let responseParsed = tryToParse(activity.response) == false ? activity.response : tryToParse(activity.response);
            activityData.content = bbcodeContentIncludingMathLive(responseParsed);
            activityData.correction = returnCorrectionContent(correction_div, activity.activity.correction);
        }

        return activityData;
    }

    freeValidateActivityOnePageCourse(activityId, activityLink, correction) {
        let studentResponse = $(`#one-page-activity-content-${activityId}`).bbcode();

        if (studentResponse == null || studentResponse == '') {
            displayNotification('#notif-div', "classroom.activities.emptyAnswer", "error");
            return;
        }

        let activity = coursesManager.getOneActivityFromCourse(activityId, activityLink);
        let isRevalidate = activity.correction > 0;

        Main.getClassroomManager().saveNewStudentActivity(activityId, correction, null, studentResponse, activityLink).then((response) => {
            freeManager.showErrors(response);
            if (response.hasOwnProperty('activity')) {
                activity.correction = response.correction;
                coursesManager.manageValidateReponse(response, isRevalidate);
            }
        });
    }

    showErrors(response) {
        if (!response.hasOwnProperty('badResponse')) {
            return;
        }
        displayNotification('#notif-div', "classroom.activities.wrongAnswer", "error");
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

