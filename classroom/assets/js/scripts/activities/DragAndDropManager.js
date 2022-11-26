class DragAndDropManager {
    
    init() {
        $('#dragAndDrop-add-inputs').click(() => {
            if ($("#drag-and-drop-content").getSelectText() != "") {
                $('#drag-and-drop-content').bbcode();
                let randomString = Math.random().toString(36).substring(7);
                replaceSelectionWithHtml(`<span class="lms-answer" data-id="${randomString}">${$("#drag-and-drop-content").getSelectText()}</span>\&nbsp`);
                let newText = $('#drag-and-drop-content').htmlcode();
                $('#drag-and-drop-content').htmlcode(newText);
                setCaret('drag-and-drop-content', randomString);
            } else {
                $('#drag-and-drop-content').bbcode()
                $('#drag-and-drop-content').htmlcode($('#drag-and-drop-content').htmlcode() + `\&nbsp;<span class="lms-answer">\&nbsp;réponse\&nbsp;</span>\&nbsp;`);
            }
        });
    }

    parseDragAndDropFieldsAndSaveThem() {

        if ($('#drag-and-drop-content').bbcode().match(/\[answer\](.*?)\[\/answer\]/gi) == null) {
            displayNotification('#notif-div', "classroom.notif.noAnswerInActivity", "error");
            return false;
        }
        
        Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForTeacher = $('#drag-and-drop-content').bbcode();
        
        let responseDD = $('#drag-and-drop-content').bbcode().match(/\[answer\](.*?)\[\/answer\]/gi).map(match => match.replace(/\[answer\](.*?)\[\/answer\]/gi, "$1"));
        let contentForStudent = $('#drag-and-drop-content').bbcode();
    
    
        responseDD.forEach((e, i) => {
            contentForStudent = contentForStudent.replace(`[answer]${e}[/answer]`, `﻿`);
            responseDD[i] = e.trim();
            if (e.includes('&&')) {
                responseDD[i] = e.split('&&').map(e => e.trim()).join(',');
            }
        })
    
        if ($('#drag-and-drop-states').bbcode() != '') {
            Main.getClassroomManager()._createActivity.content.states = $('#drag-and-drop-states').bbcode();
        } else {
            return false;
        }
    
        Main.getClassroomManager()._createActivity.autocorrect = $('#drag-and-drop-autocorrect').is(":checked");
        Main.getClassroomManager()._createActivity.content.hint = $('#drag-and-drop-hint').val();
    
    
        Main.getClassroomManager()._createActivity.solution = responseDD;
        Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForStudent = contentForStudent;
    
        if (Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForTeacher == "") {
            return false;
        }
        return true;
    }

    dragAndDropValidateActivity(correction = 1, isFromCourse = false) {
        let studentResponse = [];
        for (let i = 0; i < $(`span[id^="dz-"]`).length; i++) {
            let string = document.getElementById(`dz-${i}`).children.length > 0 ? document.getElementById(`dz-${i}`).children[0].innerHTML : "";
            studentResponse.push({
                string: string
            });
        }

        let activityId = isFromCourse ? coursesManager.actualCourse.activity : Activity.activity.id,
            activityLink = isFromCourse ? coursesManager.actualCourse.link : Activity.id;

        Main.getClassroomManager().saveNewStudentActivity(activityId, correction, null, JSON.stringify(studentResponse), activityLink).then((response) => {
            if (isFromCourse) {
                coursesManager.coursesResponseManager(response, 'drag-and-drop');
            } else {
                responseManager(response, 'drag-and-drop');
            }
        });
    }

    manageUpdateForDragAndDrop(activity) {
        $('#activity-drag-and-drop').show();
        let content = JSON.parse(activity.content);
        $("#drag-and-drop-hint").val(content.hint);
        $("#drag-and-drop-states").htmlcode(bbcodeToHtml(content.states));
        $("#drag-and-drop-content").htmlcode(bbcodeToHtml(content.dragAndDropFields.contentForTeacher));
        activity.isAutocorrect ? $("#drag-and-drop-autocorrect").prop("checked", true) : $("#drag-and-drop-autocorrect").prop("checked", false);
    
        navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
    }

    showTeacherDragAndDropActivity(contentParsed, Activity) {
        $("#activity-states").html(bbcodeToHtml(contentParsed.states));
    
        let contentForTeacher = contentParsed.dragAndDropFields.contentForTeacher;
    
        contentForTeacher = parseContent(contentForTeacher, "drag-and-drop-answer-teacher", true);
    
        $("#activity-content").html(bbcodeToHtml(contentForTeacher));
        $("#activity-content-container").show();
        $("#activity-states-container").show();
    }



    manageDisplayDragAndDrop(correction, content, correction_div, isFromCourse) {
        let course = isFromCourse ? "-course" : "";
        $('#activity-title'+course).html(Activity.activity.title);
        // Show the content with the response to the teacher
        if (UserManager.getUser().isRegular) {
    
            let contentForTeacher = content.dragAndDropFields.contentForTeacher;
            contentForTeacher = parseContent(contentForTeacher, "drag-and-drop-answer-teacher", true);
            $('#activity-content'+course).html(bbcodeToHtml(contentForTeacher));
            $('#activity-content-container'+course).show();
        }
    
        $('#activity-states'+course).html(bbcodeToHtml(content.states));
        $('#activity-states-container'+course).show();
        
        if (correction <= 1 || correction == null) {
            if (!UserManager.getUser().isRegular) {
    
                let ContentString = manageDragAndDropText(content.dragAndDropFields.contentForStudent);
                $('#drag-and-drop-text'+course).html(`<div>${ContentString}</div>`);
    
                // Get the response array and shuffle it
                let choices = shuffleArray(JSON.parse(Activity.activity.solution));
    
                choices.forEach(e => {
                    $('#drag-and-drop-fields'+course).append(`<p class="draggable draggable-items drag-drop" id="${e}">${e.trim()}</p>`);
                });
                $('#activity-drag-and-drop-container'+course).show();
            
                // init dragula if it's not already initialized
                if (Main.getClassroomManager().dragulaGlobal == false) {
                    Main.getClassroomManager().dragulaGlobal = dragula();
                }
    
                // Reset the dragula fields
                Main.getClassroomManager().dragulaGlobal.containers = [];
                
                Main.getClassroomManager().dragulaGlobal = dragula([document.querySelector('#drag-and-drop-fields'+course)]).on('drop', function(el, target, source) {
                    if (target.id != 'drag-and-drop-fields'+course) {
                        let swap = $(target).find('p').not(el);
                        swap.length > 0 ? source.append(swap[0]) : null;
                    }
                });
    
                $('.dropzone').each((i, e) => {
                    Main.getClassroomManager().dragulaGlobal.containers.push(document.querySelector('#'+e.id));
                });
    
                // Place the student's response if there is one
                if (Activity.response != null && Activity.response != "") {
                    let response = JSON.parse(Activity.response);
                    response.forEach((e, i) => {
                        if (e.string.toLowerCase() != "" && e.string.toLowerCase() != null) {
                            if ($(`#${e.string.toLowerCase()}`).length > 0) {
                                $(`#dz-${i}`).html($(`#${e.string.toLowerCase()}`)[0]);
                            }
                        }
                    })
                }
            } else {
                dragAndDropManager.displayDragAndDropTeacherSide(correction_div, correction, content, isFromCourse);
            }
        } else if (correction > 1) {
            dragAndDropManager.displayDragAndDropTeacherSide(correction_div, correction, content, isFromCourse);
        } 
    }
    
    displayDragAndDropTeacherSide(correction_div, correction, content, isFromCourse) {
        let course = isFromCourse ? "-course" : "";
        let studentResponses = JSON.parse(Activity.response);
        let studentContentString = content.dragAndDropFields.contentForStudent;
    
        $(`input[id^="corrected-student-response-"]`).each((i, e) => {
            $(e).remove();
        })
    
        if (studentResponses != "" && studentResponses != null) {
            for (let i = 0; i < studentResponses.length; i++) {
                let autoWidthStyle = 'style="width:' + (studentResponses[i].string.toLowerCase().length + 2) + 'ch"';
                studentContentString = studentContentString.replace(`﻿`, `<input readonly class='drag-and-drop-answer-teacher' id="corrected-student-response-${i}" value="${studentResponses[i].string.toLowerCase()}" ${autoWidthStyle}>`);
            }
        
            $('#activity-student-response-content'+course).html(bbcodeToHtml(studentContentString));
            $('#activity-student-response'+course).show();
            Main.getClassroomManager().getActivityAutocorrectionResult(Activity.activity.id, Activity.id).then(result => {
                for (let i = 0; i < $(`input[id^="corrected-student-response-"]`).length; i++) {
                    $('#corrected-student-response-' + i).addClass("answer-correct");
                }
            
                for (let i = 0; i < result.success.length; i++) {
                    $('#corrected-student-response-' + (result.success[i])).addClass("answer-incorrect");
                }
            })
        }
        manageCorrectionDiv(correction_div, correction, isFromCourse);
    }

    dragAndDropPreview(activity) {
        let ContentString = manageDragAndDropText(activity.content.dragAndDropFields.contentForStudent, true);
        $('#preview-drag-and-drop-text').html(`<div>${ContentString}</div>`);

        // Get the response array and shuffle it
        let choices = shuffleArray(activity.solution);
        choices.forEach(e => {
            $('#preview-drag-and-drop-fields').append(`<p class="draggable draggable-items drag-drop" id="${e}">${e.trim()}</p>`);
        });
    
        // init dragula if it's not already initialized
        if (Main.getClassroomManager().dragulaGlobal == false) {
            Main.getClassroomManager().dragulaGlobal = dragula();
        }

        // Reset the dragula fields
        Main.getClassroomManager().dragulaGlobal.containers = [];
        Main.getClassroomManager().dragulaGlobal = dragula([document.querySelector('#preview-drag-and-drop-fields')]).on('drop', function(el, target, source) {
            if (target.id != 'preview-drag-and-drop-fields') {
                let swap = $(target).find('p').not(el);
                swap.length > 0 ? source.append(swap[0]) : null;
            }
        });

        $('.dropzone-preview').each((i, e) => {
            Main.getClassroomManager().dragulaGlobal.containers.push(document.querySelector('#'+e.id));
        });

        $('#preview-states').show();
        $('#preview-activity-drag-and-drop-container').show();
        $('#activity-preview-div').show();
    }
}

const dragAndDropManager = new DragAndDropManager();
dragAndDropManager.init();

