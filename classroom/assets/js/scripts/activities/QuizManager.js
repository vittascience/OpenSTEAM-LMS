class QuizManager {

    parseQuizFieldsAndSaveThem() {
        // check empty fields
        let emptyFields = this.checkEmptyQuizFields();
        let checkBox = this.checkQuizCheckbox();
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
    
    checkEmptyQuizFields() {
        let empty = false;
        for (let i = 1; i < $(`input[id^="quiz-suggestion-"]`).length+1; i++) {
            if ($(`#quiz-suggestion-${i}`).val() == '') {
                empty = true;
            }
        }
        return empty;
    }
    
    // check if at least one checkbox is checked
    checkQuizCheckbox() {
        let checkboxes = $(`input[id^="quiz-checkbox-"]`);
        let checked = false;
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                checked = true;
            }
        }
        return checked;
    }

    addQuizSuggestion() {
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
                                        <label class="form-check-label" for="quiz-checkbox-${i}" id="label-quiz-${i}" data-i18n="classroom.activities.correctAnswer">Réponse correcte</label>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                  
        $('#quiz-suggestions-container').append(divToAdd);
        $(`#quiz-button-suggestion-${i}`).localize();
        $(`#label-quiz-${i}`).localize();
    }
    
    deleteQuizSuggestion(number) {
        $(`#quiz-group-${number}`).remove();
    }

    quizValidateActivity(correction = 1, isFromCourse = false) {
        let studentResponse = [];
        for (let i = 1; i < $(`input[id^="student-quiz-checkbox-"]`).length+1; i++) {
            let res = {
                inputVal: $(`#student-quiz-suggestion-${i}`).text(),
                isCorrect: $(`#student-quiz-checkbox-${i}`).is(':checked')
            }
            studentResponse.push(res);
        }

        let activityId = isFromCourse ? coursesManager.actualCourse.activity : Activity.activity.id;
        let activityLink = isFromCourse ? coursesManager.actualCourse.link : Activity.id;
        
        Main.getClassroomManager().saveNewStudentActivity(activityId, correction, null, JSON.stringify(studentResponse), activityLink).then((response) => {
            if (isFromCourse) {
                coursesManager.coursesResponseManager(response, 'quiz');
            } else {
                responseManager(response, 'quiz');
            }
        });
    }

    manageUpdateForQuiz(activity) {
        let solution = JSON.parse(activity.solution),
        content = JSON.parse(activity.content);
        $('#quiz-suggestions-container').html('');
        for (let i = 1; i < solution.length+1; i++) {
            let divToAdd = `<div class="form-group c-primary-form" id="quiz-group-${i}">
                                <label for="quiz-suggestion-${i}" id="quiz-label-suggestion-${i}">Proposition ${i}</label>
                                <button class="btn c-btn-grey mx-2" data-i18n="newActivities.delete" id="quiz-button-suggestion-${i}" onclick="quizManager.deleteQuizSuggestion(${i})">Delete</button>
    
                                <div class="input-group mt-3">
                                    <input type="text" id="quiz-suggestion-${i}" class="form-control" value="${solution[i-1].inputVal}">
                                    <div class="input-group-append">
                                        <div class="input-group-text c-checkbox c-checkbox-grey">
                                            <input class="form-check-input" type="checkbox" id="quiz-checkbox-${i}" ${solution[i-1].isCorrect ? "checked" : ""}>
                                            <label class="form-check-label" for="quiz-checkbox-${i}" id="label-quizz-${i}"  data-i18n="classroom.activities.correctAnswer">Réponse correcte</label>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
            $('#quiz-suggestions-container').append(divToAdd);
            $(`#quiz-button-suggestion-${i}`).localize();
            $(`#label-quizz-${i}`).localize();
        }
    
        $('#quiz-states').htmlcode(bbcodeToHtml(content.states));
        $('#quiz-hint').val(content.hint);
    
        if (activity.isAutocorrect) {
            $("#quiz-autocorrect").prop("checked", true);
        } else {
            $("#quiz-autocorrect").prop("checked", false);
        }
        $('#activity-quiz').show();
    
        navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
    }

    showTeacherQuizActivity(contentParsed, Activity) {
        $("#activity-states").html(bbcodeToHtml(contentParsed.states));
        $(`div[id^="teacher-suggestion-"]`).each(function() {
            $(this).remove();
        })
    
        let data = JSON.parse(Activity.solution);
        let htmlToPush = '';
        for (let i = 1; i < data.length+1; i++) {
            htmlToPush += `<div class="input-group c-checkbox quiz-answer-container" id="qcm-field-${i}">
                            <input class="form-check-input" type="checkbox" id="show-quiz-checkbox-${i}" ${data[i-1].isCorrect ? 'checked' : ''} onclick="return false;">
                            <label class="form-check-label" for="quiz-checkbox-${i}" id="show-quiz-label-checkbox-${i}">${data[i-1].inputVal}</label>
                        </div>`;
        }
        $('#activity-content-container').append(htmlToPush);
    
        $("#activity-content-container").show();
        $("#activity-states-container").show();
    }


    manageDisplayQuiz(correction, content, correction_div, isFromCourse) {
        let course = isFromCourse ? "-course" : "";
        $('#activity-states'+course).html(bbcodeToHtml(content.states));
        $('#activity-states-container'+course).show();
    
        if (UserManager.getUser().isRegular) {
            $('#activity-content'+course).append(quizManager.createContentForQuiz(JSON.parse(Activity.activity.solution), false));
            $('#activity-content-container'+course).show();
        }
    
        if (correction <= 1 || correction == null) {
            if (!UserManager.getUser().isRegular) {
                $('#activity-student-response-content'+course).html("");
                if (Activity.response != null && Activity.response != '') {
                    if (JSON.parse(Activity.response) != null && JSON.parse(Activity.response) != "") {
                        $('#activity-student-response-content'+course).append(quizManager.createContentForQuiz(JSON.parse(Activity.response)));
                    }
                } else {
                    $('#activity-student-response-content'+course).append(quizManager.createContentForQuiz(content.quiz.contentForStudent));
                }
                $('#activity-student-response'+course).show();
            } else {
                quizManager.displayQuizTeacherSide(isFromCourse);
                manageCorrectionDiv(correction_div, correction, isFromCourse);
            }
        } else if (correction > 1) {
            quizManager.displayQuizTeacherSide(isFromCourse);
            manageCorrectionDiv(correction_div, correction, isFromCourse);
        }
    }
    
    displayQuizTeacherSide(isFromCourse) {
        let course = isFromCourse ? "-course" : "";
        if (Activity.response != null) {
            $('#activity-student-response-content'+course).html("");
            let data = "";
            if (Activity.response != null && Activity.response != "") {
                data = JSON.parse(Activity.response);
            }
            $('#activity-student-response-content'+course).append(quizManager.createContentForQuiz(data, false, true)); 
            $('#activity-student-response'+course).show();
            if (data != null && data != "") {
                Main.getClassroomManager().getActivityAutocorrectionResult(Activity.activity.id, Activity.id).then(result => {
                    for (let i = 1; i < $(`label[id^="correction-student-quiz-suggestion-"]`).length+1; i++) {
                        $('#correction-student-quiz-suggestion-' + i).parent().addClass('quiz-answer-correct');
                    }
            
                    if (result.success.length > 0) {
                        for (let i = 0; i < result.success.length; i++) {
                            $('#correction-student-quiz-suggestion-' + (result.success[i]+1)).parent().addClass('quiz-answer-incorrect');
                        }
                    }
                })
            }
        }
    }
    
    createContentForQuiz(data, doable = true, correction = false, preview = false) {
        manageLabelForActivity();
        let previewId = preview ? '-preview' : '';
        let correctionId = correction ? 'correction-' : '';
    
        let content = "";
        if (doable) {
            for (let i = 1; i < data.length+1; i++) {
                content += ` <div class="input-group c-checkbox quiz-answer-container" id="qcm-doable-${i}${previewId}">
                                <input class="form-check-input" type="checkbox" id="student-quiz-checkbox-${i}${previewId}" ${data[i-1].isCorrect ? "checked" : ""}>
                                <label class="form-check-label" for="student-quiz-checkbox-${i}${previewId}" id="${correctionId}student-quiz-suggestion-${i}${previewId}">${data[i-1].inputVal}</label>
                            </div>`;
            }
        } else {
            for (let i = 1; i < data.length+1; i++) {
                content += ` <div class="input-group c-checkbox quiz-answer-container" id="qcm-not-doable-${i}">
                                <input class="form-check-input" type="checkbox" id="student-quiz-checkbox-${i}" ${data[i-1].isCorrect ? "checked" : ""} onclick="return false">
                                <label class="form-check-label" for="student-quiz-checkbox-${i}" id="${correctionId}student-quiz-suggestion-${i}">${data[i-1].inputVal}</label>
                            </div>`;
            }
        }
        return content;
    }

    deleteQcmFields() {
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
        $('#quiz-suggestion-1').val('');
        $('#quiz-checkbox-1').prop('checked', false);
    }

    quizPreview(activity) {
        $('#preview-activity-content').html(quizManager.createContentForQuiz(activity.content.quiz.contentForStudent, true, false, true));
        $('#preview-states').show();
        $('#preview-content').show();
        $('#activity-preview-div').show();
    }
}

const quizManager = new QuizManager();

