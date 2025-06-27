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
            for (let i = 1; i < $(`textarea[id^="quiz-suggestion-"]`).length+1; i++) {
                let res = {
                    inputVal: $(`#quiz-suggestion-${i}`).bbcode(),
                    isCorrect: $(`#quiz-checkbox-${i}`).is(':checked')
                }
                let student = {
                    inputVal: $(`#quiz-suggestion-${i}`).bbcode()
                }
                tempArraySolution.push(res);
                tempArraycontentForStudent.push(student);
            }
    
            Main.getClassroomManager()._createActivity.content.quiz.contentForStudent = tempArraycontentForStudent;
            Main.getClassroomManager()._createActivity.solution = tempArraySolution;
            
            Main.getClassroomManager()._createActivity.content.hint = $('#quiz-hint').bbcode();
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
        for (let i = 1; i < $(`textarea[id^="quiz-suggestion-"]`).length+1; i++) {
            if ($(`#quiz-suggestion-${i}`).bbcode() == '') {
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
    
        let divToAdd = `<div class="form-group c-primary-form" id="quiz-group-${i}" role="group" aria-labelledby="quiz-label-suggestion-${i}">
                            <div class="row my-1">
                                <div class="col">
                                    <label for="quiz-suggestion-${i}" id="quiz-label-suggestion-${i}">Proposition ${i}</label>
                                    <button class="btn c-btn-secondary mx-2" data-i18n="newActivities.delete" id="quiz-button-suggestion-${i}" onclick="quizManager.deleteQuizSuggestion(${i})" aria-label="Supprimer la proposition ${i}">Delete</button>
                                </div>

                                <div class="col-md-auto d-flex align-items-center">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="quiz-checkbox-${i}" aria-label="Marquer comme réponse correcte pour la proposition ${i}">
                                        <label class="form-check-label" for="quiz-checkbox-${i}" data-i18n="classroom.activities.correctAnswer">
                                            Réponse correcte
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <textarea id="quiz-suggestion-${i}" style="height:100px" aria-label="Contenu de la proposition ${i}"></textarea>
                        </div>`;

        $('#quiz-suggestions-container').append(divToAdd);
        quizManager.enableTextArea(`#quiz-suggestion-${i}`);
        $(`#quiz-button-suggestion-${i}`).localize();
        $(`#label-quiz-${i}`).localize();
    }

    enableTextArea(id, data = null) {
        const btns = "fontcolor,underline,math,customimageupload,myimages,keys,screens";
        const optMini = Main.getClassroomManager().returnCustomConfigWysibb(btns, 100)
        $(id).wysibb(optMini);
        if (data != null) {
            $(id).forceInsertBbcode(data);
        }
    }
    
    deleteQuizSuggestion(number) {
        $(`#quiz-group-${number}`).remove();
    }

    quizValidateActivity(correction = 1, isFromCourse = false) {
        let activityId = isFromCourse ? coursesManager.actualCourse.activity : Activity.activity.id;
        let activityLink = isFromCourse ? coursesManager.actualCourse.link : Activity.id;

        let studentResponse = [];
        for (let i = 1; i < $(`input[id^="student-quiz-checkbox-"]`).length+1; i++) {
            let res = {
                inputVal: $(`#student-quiz-suggestion-${i}`).attr("data-raw"),
                isCorrect: $(`#student-quiz-checkbox-${i}`).is(':checked')
            }
            studentResponse.push(res);
        }
        
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
                            <div class="row my-1">
                                <div class="col">
                                    <label for="quiz-suggestion-${i}" id="quiz-label-suggestion-${i}">Proposition ${i}</label>
                                    <button class="btn c-btn-secondary mx-2" data-i18n="newActivities.delete" id="quiz-button-suggestion-${i}" onclick="quizManager.deleteQuizSuggestion(${i})">Delete</button>
                                </div>

                                <div class="col-md-auto d-flex align-items-center">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="quiz-checkbox-${i}" ${solution[i-1].isCorrect ? "checked" : ""}>
                                        <label class="form-check-label" for="quiz-checkbox-${i}" data-i18n="classroom.activities.correctAnswer">
                                            Réponse correcte
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <textarea id="quiz-suggestion-${i}" style="height:100px"></textarea>
                        </div>`;

            $('#quiz-suggestions-container').append(divToAdd);
            quizManager.enableTextArea(`#quiz-suggestion-${i}`, solution[i-1].inputVal);
            $(`#quiz-button-suggestion-${i}`).localize();
            $(`#label-quizz-${i}`).localize();
        }
    
        $('#quiz-states').forceInsertBbcode(content.states);
        $('#quiz-hint').forceInsertBbcode(content.hint);
    
        if (activity.isAutocorrect) {
            $("#quiz-autocorrect").prop("checked", true);
        } else {
            $("#quiz-autocorrect").prop("checked", false);
        }
        $('#activity-quiz').show();
    
        navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
    }

    showTeacherQuizActivity(contentParsed, Activity) {
        $(`div[id^="teacher-suggestion-"]`).each(function() {
            $(this).remove();
        })
    
        let data = JSON.parse(Activity.solution);
        let htmlToPush = '';
        for (let i = 1; i < data.length+1; i++) {
            htmlToPush += `<div class="col-12 col-lg-5 form-check quiz-form-check" id="qcm-field-${i}">
                            <input class="form-check-input" type="checkbox" id="show-quiz-checkbox-${i}" ${data[i-1].isCorrect ? 'checked' : ''} onclick="return false;">
                            <label class="form-check-label" for="quiz-checkbox-${i}" id="show-quiz-label-checkbox-${i}">${bbcodeContentIncludingMathLive(data[i-1].inputVal)}</label>
                        </div>`;
        }



        $('#activity-content').html(htmlToPush);
        quizManager.displayForShowTeacher(contentParsed);
    }

    showTeacherQuizActivityDoable(contentParsed, Activity) {
        let contentDiv = document.getElementById('activity-content');
        contentDiv.innerHTML = "";

        let divActivityDoable = document.createElement('div');
        divActivityDoable.id = "activity-doable" + Activity.id;
        divActivityDoable.classList.add("activity-doable-quiz-teacher");

        contentDiv.innerHTML = quizManager.createContentForQuiz(contentParsed.quiz.contentForStudent, true, false, true);
        quizManager.displayForShowTeacher(contentParsed);
    }

    displayForShowTeacher(contentParsed) {
        $("#activity-states").html(bbcodeContentIncludingMathLive(contentParsed.states));
        $("#activity-content-container").show();
        $("#activity-states-container").show();
    }


    manageDisplayQuiz(correction, content, correction_div, isFromCourse) {
        let course = isFromCourse ? "-course" : "";
        $('#activity-states'+course).html(bbcodeContentIncludingMathLive(content.states));
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

        manageLabelForActivity();
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
    
    createContentForQuiz(data, doable = true, correction = false, preview = false, id = null) {
        manageLabelForActivity();
        let previewId = preview ? '-preview' : '';
        let correctionId = correction ? 'correction-' : '';
    
        let content = "";

        if (doable) {
            for (let i = 1; i < data.length+1; i++) {
                content += ` <div class="col-12 col-lg-5 form-check quiz-form-check" id="qcm-doable-${i}${previewId}" role="group" aria-labelledby="quiz-question-${i}${previewId}">
                                <input class="form-check-input" type="checkbox" 
                                    id="student-quiz-checkbox${id != null ? "-"+id : ""}-${i}${previewId}" 
                                    ${data[i-1].isCorrect ? "checked" : ""}
                                    aria-describedby="quiz-description-${i}${previewId}">
                                <label class="form-check-label" 
                                    data-raw="${data[i-1].inputVal}" 
                                    for="student-quiz-checkbox${id != null ? "-"+id : ""}-${i}${previewId}" 
                                    id="${correctionId}student-quiz-suggestion${id != null ? "-"+id : ""}-${i}${previewId}"
                                    role="presentation">
                                    ${bbcodeContentIncludingMathLive(data[i-1].inputVal)}
                                </label>
                                <span id="quiz-description-${i}${previewId}" class="sr-only">Option ${i} de ${data.length}</span>
                            </div>`;
            }
        } else {
            for (let i = 1; i < data.length+1; i++) {
                content += ` <div class="col-12 col-lg-5 form-check quiz-form-check" id="qcm-not-doable-${i}" role="group" aria-labelledby="quiz-question-${i}">
                                <input class="form-check-input" type="checkbox" 
                                    id="student-quiz-checkbox${id != null ? "-"+id : ""}-${i}" 
                                    ${data[i-1].isCorrect ? "checked" : ""} 
                                    onclick="return false"
                                    aria-describedby="quiz-description-${i}"
                                    aria-disabled="true">
                                <label class="form-check-label" 
                                    data-raw="${data[i-1].inputVal}" 
                                    for="student-quiz-checkbox${id != null ? "-"+id : ""}-${i}" 
                                    id="${correctionId}student-quiz-suggestion${id != null ? "-"+id : ""}-${i}"
                                    role="presentation">
                                    ${bbcodeContentIncludingMathLive(data[i-1].inputVal)}
                                </label>
                                <span id="quiz-description-${i}" class="sr-only">Option ${i} de ${data.length} (non modifiable)</span>
                            </div>`;
            }
        }
        return `<div class="d-flex flex-row flex-wrap justify-content-around w-100" role="list" aria-label="Options du quiz">${content}</div>`;
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

    quizValidateActivityOnePageCourse(activityId, activityLink, correction) {
        let studentResponse = [];
        for (let i = 1; i < $(`input[id^="student-quiz-checkbox-${activityId}"]`).length+1; i++) {
            let res = {
                inputVal: $(`#student-quiz-suggestion${"-"+activityId}-${i}`).attr("data-raw"),
                isCorrect: $(`#student-quiz-checkbox${"-"+activityId}-${i}`).is(':checked')
            }
            studentResponse.push(res);
        }
        
        Main.getClassroomManager().saveNewStudentActivity(activityId, correction, null, JSON.stringify(studentResponse), activityLink).then((response) => {
            quizManager.showErrors(response, activityId);
            coursesManager.displayHintForOnePageCourse(response, activityId);
            if (response.hasOwnProperty('activity')) {
                coursesManager.manageValidateReponse(response);
            }
        });
    }

    renderQuizActivity(activityData, htmlContainer, idActivity) {
        coursesManager.manageStatesAndContentForOnePageCourse(idActivity, htmlContainer, activityData);

        if (activityData.doable) {
            coursesManager.manageValidateBtnForOnePageCourse(idActivity, htmlContainer, activityData);
        }
    }

    getManageDisplayQuiz(content, activity, correction_div) {
        const activityData = {
            states: null,
            content: null,
            correction: null,
            doable: false,
            type: 'quiz',
            link: activity.id,
            id: activity.activity.id,
        }

        activityData.states = bbcodeContentIncludingMathLive(content.states);
        activityData.doable = activity.correction <= 1 || activity.correction == null;

        if (activity.correction <= 1 || activity.correction == null) {
            if (!UserManager.getUser().isRegular) {
                if (activity.activity.response != null && activity.activity.response != '') {
                    if (JSON.parse(activity.activity.response) != null && JSON.parse(activity.activity.response) != "") {
                        activityData.content = quizManager.createContentForQuiz(JSON.parse(activity.activity.response), true, false, false, activity.activity.id);
                    }
                } else {
                    activityData.content = quizManager.createContentForQuiz(content.quiz.contentForStudent, true, false, false, activity.activity.id);
                }
            }
        } else if (activity.correction > 1) {
            activityData.content = quizManager.returnCorrectedContent(activity);
        }

        return activityData;
    }

    returnCorrectedContent(activity) {
        if (activity.response != null) {
            let data = "";
            if (activity.response != null && activity.response != "") {
                data = JSON.parse(activity.response);
            }
            const solution = JSON.parse(activity.activity.solution);

            let dataCorrected = "";
            for (let i = 1; i < solution.length+1; i++) {
                
                let correctAnswer = false;
                if (data[i-1].isCorrect == solution[i-1].isCorrect) {
                    correctAnswer = true;
                }

                dataCorrected += ` <div class="col-12 col-lg-5 d-flex form-check quiz-form-check ${correctAnswer ? "quiz-answer-correct" : "quiz-answer-incorrect"}" id="qcm-not-doable-${i}">
                                <input class="form-check-input" type="checkbox" id="student-quiz-checkbox-${i}" ${data[i-1].isCorrect ? "checked" : ""} onclick="return false">
                                <label class="form-check-label" for="student-quiz-checkbox-${i}" id="correction-student-quiz-suggestion-${i}">${bbcodeContentIncludingMathLive(data[i-1].inputVal)}</label>
                            </div>`;
            }
            return dataCorrected;
        }
    }

    showErrors(response, activityId = null) {
        if (!response.hasOwnProperty('badResponse')) {
            return;
        }

        let activityTag = activityId != null ? `-${activityId}` : "";

        displayNotification('#notif-div', "classroom.activities.wrongAnswerLarge", "error");
        document.querySelectorAll('.quiz-answer-incorrect').forEach((element) => {
            element.classList.remove('quiz-answer-incorrect');
        });

        for (let i = 1; i < $(`input[id^="student-quiz-suggestion${activityTag}-"]`).length+1; i++) {
            $(`#student-quiz-suggestion${activityTag}-'${i}`).parent().addClass('quiz-answer-correct');
        }

        for (let i = 0; i < response.badResponse.length; i++) {
            //$('#student-quiz-suggestion-' + (response.badResponse[i]+1)).parent().addClass('quiz-answer-incorrect');
            $(`#student-quiz-suggestion${activityTag}-${response.badResponse[i]+1}`).parent().addClass('quiz-answer-incorrect');
        }
    }
}

const quizManager = new QuizManager();

