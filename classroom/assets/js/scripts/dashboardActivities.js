//@Rémi : Do we need that ? 
$(document).ready(function () {


});

function activityItem(activity, state) {
    let ide = 'vittascience'
    if (activity.activity.content.match(/vittascience\.com\/microbit/)) {
        ide = "microbit"
    }
    if (activity.activity.content.match(/vittascience\.com\/python/)) {
        ide = "python"
    }
    if (activity.activity.content.match(/vittascience\.com\/arduino/)) {
        ide = "arduino"
    }

    if (state == "doneActivities") {
        if (activity.note == 3) {
            var activityStatus = "ribbon ribbon_accept"
            var activityStatusTitle = i18next.t('classroom.activities.veryGoodProficiency')
        } else if (activity.note == 2) {
            var activityStatus = "ribbon ribbon_vgood"
            var activityStatusTitle = i18next.t('classroom.activities.goodProficiency')
        } else if (activity.note == 1) {
            var activityStatus = "ribbon ribbon_good"
            var activityStatusTitle = i18next.t('classroom.activities.weakProficiency')
        } else if (activity.note == 0) {
            var activityStatus = "ribbon ribbon_refuse"
            var activityStatusTitle = i18next.t('classroom.activities.insufficientProficiency')
        } else {
            var activityStatus = ""
            var activityStatusTitle = "?"
        }
    }

    let html = `<div class="activity-item">
                    <div class="activity-card activity-card-` + ide + `">
                        <div class="${activityStatus}" data-toggle="tooltip" title="${activityStatusTitle}"><div class="ribbon__content"></div></div>
                        <div class="activity-card-top">
                        ${activity.activity.isAutocorrect ? "<img src='assets/media/auto-icon.svg' title='Auto'>" : "" }
                        </div>
                        <div class="activity-card-mid"></div>
                        <div class="activity-card-bot">
                            <div class="info-tutorials"  data-id="${activity.activity.id}"  data-state="${state}">`

    if (activity.dateEnd != undefined) {
        html += `<span> ` + i18next.t('classroom.activities.dateBefore') + ` ${formatDay(activity.dateEnd)}</span>`
    }

    html += `</div></div></div>`
    html += `<h3 data-toggle="tooltip" title="${activity.activity.title}" class="activity-item-title">${activity.activity.title}</h3>`
    html += `</div>`

    return html;
}

function teacherSandboxItem(json) {

    let html = `<div class="sandbox-item sandbox-teacher">
                    <div class="sandbox-card sandbox-card-` + json.interface + `" data-id="${json.id}" data-href="/` + json.interface + `/?link=` + json.link + `&embed=1">
                        <div class="sandbox-card-top">
                        <i class="fas fa-share fa-2x" style="grid-column-start: 1; grid-column-end: 1;" data-link="${json.link}" ></i>      
                            <div class="dropdown"><i class="fas fa-cog fa-2x" style="grid-column-start: 3; grid-column-end: 3;" type="button" id="dropdown-teacherSandboxItem-${json.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                    <div class="dropdown-menu" aria-labelledby="dropdown-teacherSandboxItem-${json.id}">`
    if (UserManager.getUser().isRegular) {
        html += `<li class="classroom-clickable col-12 dropdown-item" onclick="createActivity('/` + json.interface + `/?link=` + json.link + `&embed=1')" href="#">` + i18next.t('classroom.activities.integrate') + `</li>`
    }
    html += `<li class="modal-teacherSandbox-duplicate classroom-clickable col-12 dropdown-item" href="#">` + capitalizeFirstLetter(i18next.t('words.duplicate')) + `</li>
                <li class="dropdown-item modal-teacherSandbox-delete classroom-clickable col-12" href="#">` + capitalizeFirstLetter(i18next.t('words.delete')) + `</li>
                </div>
                </div>
                        </div>
                        <div class="sandbox-card-mid"></div>
                        <div class="sandbox-card-bot"></div>
                    </div>
                    <h5 class="sandbox-item-title">` + decodeURI(json.name) + `</h5>
                </div> `
    return html
}

function teacherActivityItem(activity) {
    let ide = 'vittascience'
    if (activity.content.match(/vittascience\.com\/microbit/)) {
        ide = "microbit"
    }
    if (activity.content.match(/vittascience\.com\/python/)) {
        ide = "python"
    }
    if (activity.content.match(/vittascience\.com\/arduino/)) {
        ide = "arduino"
    }

    let html = `<div class="activity-item activity-teacher " >
                <div class="activity-card activity-card-` + ide + `">
                    <div class="activity-card-top">
                    ${activity.isAutocorrect ? "<img src='assets/media/auto-icon.svg' title='Auto'>" : "" }
                    <div class="dropdown"><i class="fas fa-cog fa-2x" type="button" id="dropdown-activityItem-${activity.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                    <div class="dropdown-menu" aria-labelledby="dropdown-activityItem-${activity.id}" data-id="${activity.id}">
    <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="attributeActivity(${activity.id})" style="border-bottom:2px solid rgba(0,0,0,.15">` + capitalizeFirstLetter(i18next.t('words.attribute')) + `</li>
                <li class="dropdown-item classroom-clickable col-12" href="#" onclick="createActivity(null,${activity.id})">` + capitalizeFirstLetter(i18next.t('words.duplicate')) + `</li>
                <li class=" classroom-clickable col-12 dropdown-item" onclick="activityModify(${activity.id})" href="#">` + capitalizeFirstLetter(i18next.t('words.modify')) + `</li>
                <li class="dropdown-item modal-activity-delete classroom-clickable col-12" href="#">` + capitalizeFirstLetter(i18next.t('words.delete')) + `</li>
              </div>
              </div>
                    </div>
                    <div class="activity-card-mid"></div>
                    <div class="activity-card-bot">
                        <div class="info-tutorials" data-id="${activity.id}">
                    </div>
                </div></div>`
    html += `<h3 data-toggle="tooltip" title="${activity.title}" class="activity-item-title">${activity.title}</h3></div>`

    return html;
}

function classeItem(classe, nbStudents, students) {
    function maxLength(array) {
        let count = 0
        for (let i = 0; i < array.length; i++) {
            if (array[i].activities.length > count) {
                count = array[i].activities.length
            }
        }
        return count
    }
    let maxAct = maxLength(students)
    let remainingCorrections = getRemainingCorrections(students);
    let remainingCorrectionsSpanElt = remainingCorrections ? `<span class="results-correcting c-text-secondary"><i class="fas fa-pen"></i></i> ${remainingCorrections}</span>` : '';
    let html = `<div class="class-item"><div class="class-card">
                <div class="class-card-top"  data-id="${classe.id}" data-link="${classe.link}">
                <span><i class="fas fa-user fa-2x"></i></i> ${nbStudents}</span>
                ${remainingCorrectionsSpanElt}
                <div class="dropdown"><i class="fas fa-cog fa-2x" type="button" id="dropdown-classeItem-${classe.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                    <div class="dropdown-menu" aria-labelledby="dropdown-classeItem-${classe.id}">
                <li class="modal-classroom-modify classroom-clickable col-12 dropdown-item" href="#">` + capitalizeFirstLetter(i18next.t('words.modify')) + `</li>
                <li class="dropdown-item modal-classroom-delete classroom-clickable col-12" href="#">` + capitalizeFirstLetter(i18next.t('words.delete')) + `</li>
              </div>
              </div>
                </div>`

    html += `<div class="class-card-mid">
                <h3 class="activity-item-title">${classe.name}</h3>
            </div>`
    html += `<div class="class-card-bot">
                <span class="nb-activities">${maxAct}</span> Activité` + setPluriel(maxAct) + `</p>
            </div>`
    html += `</div></div>`

    return html;
}

function getRemainingCorrections(students) {
    let remainingCorrectionCount = 0;
    for (let student of students) {
        for (let activity of student.activities) {
            if (activity.correction == 1) {
                remainingCorrectionCount++;
            }
        }
    }

    return remainingCorrectionCount;
}

function hasAttribution(student, ref) {
    let attribution = student.activities.filter(x => x.reference == ref)
    if (attribution.length > 0) {
        return true;
    }
    return false;
}

function fullClassHasAttribution(classe, ref) {
    for (let i = 0; i < classe.students.length; i++) {
        if (!hasAttribution(classe.students[i], ref)) {
            return false;
        }
    }
    return true;
}

function classeList(classe, ref = null) {
    let checkedClass = ""
    ClassroomSettings.studentCount = Number($('.student-number').html())
    if (fullClassHasAttribution(classe, ref) == true) {
        checkedClass = "checked"
    }
    let html = `<div class="col-10"><label><input type="checkbox" value="${classe.classroom.id}"${checkedClass} class ="list-students-classroom"> ${classe.classroom.name}</label>`
    html += `<button class="student-list-button" data-id="${classe.classroom.id}"><i class="fas fa-chevron-right"></i></button>`
    html += `<div class="student-list" id="student-list-${classe.classroom.id}" style="display:none;">
    `
    classe.students.forEach(student => {
        let checked = ""
        if (ref && hasAttribution(student, ref)) {
            checked = "checked"
            ClassroomSettings.studentCount++
        }

        html += '<label class="ml-3 student-attribute-form-row"><input type="checkbox" value="' + student.user.id + '" class="student-id" ' + checked + ' >'
        html += `<img src="${_PATH}assets/media/alphabet/${student.user.pseudo.slice(0, 1).toUpperCase()}.png" alt="Photo de profil"></img>`
        html += student.user.pseudo + '</label>'
    });
    html += `</div></div>`
    $('.student-number').html(ClassroomSettings.studentCount)

    return html;
}
//filter activity
$('body').on('click', '#filter-activity', function () {
    let arrayKeywords = $('#filter-activity-input').val().split(' ')
    if ($('#filter-activity-select').val() == 'asc') {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", false))
    } else {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", true))
    }
})

$('body').on('change', '#filter-activity-select', function () {
    let arrayKeywords = $('#filter-activity-input').val().split(' ')
    if ($('#filter-activity-select').val() == 'asc') {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", false))
    } else {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", true))
    }

})

$(document).on('keyup', function (e) {
    if ($("#filter-activity-input").is(":focus") || $("#filter-activity").is(":focus") || $("#filter-activity-select").is(":focus")) {
        let arrayKeywords = $('#filter-activity-input').val().split(' ')
        if ($('#filter-activity-select').val() == 'asc') {
            teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", false))
        } else {
            teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", true))
        }
    }
});

//filter sandbox
$('body').on('click', '#filter-sandbox', function () {
    let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
    if ($('#filter-sandbox-select').val() == 'asc') {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
    } else {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
    }
})

$('body').on('change', '#filter-sandbox-select', function () {
    let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
    if ($('#filter-sandbox-select').val() == 'asc') {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
    } else {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
    }

})

$(document).on('keyup', function (e) {
    if ($("#filter-sandbox-input").is(":focus") || $("#filter-sandbox").is(":focus") || $("#filter-sandbox-select").is(":focus")) {
        let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
        if ($('#filter-sandbox-select').val() == 'asc') {
            sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
        } else {
            sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
        }
    }
});
$('body').on('click', '.list-students-classroom', function () {
    let isChecked = $(this).is(':checked')
    let studentCheckbox = $(this).parent().parent().find('.student-list input')
    studentCheckbox.each(function () {
        if (isChecked) {
            $(this).prop('checked', true).change();;
        } else {
            $(this).prop('checked', false).change();;
        }
    });
})

$('body').on('click', '.activity-card, .activity-item .activity-item-title', function () {
    if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
        let id, state, navigation;
        if (this.classList.contains('activity-item-title')) {
            id = this.parentElement.querySelector('.info-tutorials').getAttribute("data-id");
            state = this.parentElement.querySelector('.info-tutorials').getAttribute("data-state") ? this.parentElement.querySelector('.info-tutorials').getAttribute("data-state") : '';
        } else {
            id = parseInt($(this).find(".info-tutorials").attr("data-id"));
            state = $(this).find(".info-tutorials").attr("data-state");
        }
        if (this.parentElement.parentElement.id == 'list-activities-teacher') {
            navigation = 'dashboard-activities-teacher';
        } else {
            navigation = 'dashboard-activities';
        }
        navigatePanel('classroom-dashboard-activity-panel', navigation, 'WK' + id, state);
    }
})

function activityWatch(id) {
    navigatePanel('classroom-dashboard-activity-panel', 'dashboard-activities-teacher', 'WK' + id, '')
}

//ouvre une activité depuis un dashboard
$('body').on('click', '.bilan-cell', function () {
    let self = $(this)
    if (!self.hasClass('no-activity')) {
        navigatePanel('classroom-dashboard-activity-panel', 'dashboard-activities-teacher', 'AC' + parseInt(self.attr('data-id')), self.attr("data-state"))
    }

})

$('body').on('click', '#activity-instruction', function () {
    $('#side-div').toggle()
})

function searchActivity(id, users) {
    users.forEach(user => {
        map2 = map1.filter(x => x.id_tutorial_part);
        if (map2 != []) {
            return true;
        }
    });
    return false;
}

function getActivity(id, state = "") {
    if (state == "") {
        return Main.getClassroomManager()._myTeacherActivities.filter(x => x.id == id)[0]
    }
    return Main.getClassroomManager()._myActivities[state].filter(x => x.activity.id == id)[0]
}

function statusActivityForStudent(id, activityList) {
    let activity = activityList.filter(x => x.id_tutorial_part);
    if (activity != []) {
        if (activity.note > 0) {
            return "success";
        } else if (activity.tries > 10) {
            return "failed";
        } else {
            return "in process";
        }

    } else {
        return false
    }
}

function statusActivity(activity, state = true, formatedTimePast = '') {
    if (activity.correction == 0 || activity.correction == null) {
        if (state == true){
            if (formatedTimePast == '') {
                return "stopwatch"
            } else {
                return "startwatch"
            }
            
        }
        if (state == "csv") {
            switch (activity.correction) {
                case 0:
                    return "Pas encore réalisé"
                    break;

                case null:
                    return "Pas encore réalisé"
                    break;

                case undefined:
                    return "Pas attribué"
                    break;

                default:
                    break;
            }
        }
        return "new-activity"
    }
    if (activity.correction == 1) {
        if (state == true)
            return "fas fa-pen";
        if (state == "csv")
            return "à corriger"
        return "todo-activity"
    }
    if (activity.note == 3) {
        if (state == true)
            return "bilan-3";
        if (state == "csv")
            return "très bien"
        return "done-activity"
    } else if (activity.note == 2) {
        if (state == true)
            return "bilan-2";
        if (state == "csv")
            return "bien"
        return "done-activity"
    } else if (activity.note == 1) {
        if (state == true)
            return "bilan-1";
        if (state == "csv")
            return "correct"
        return "done-activity"
    } else {
        if (state == true)
            return "bilan-0";
        if (state == "csv")
            return "à revoir"
        return "done-activity"
    }

}

function loadActivityForStudents(isDoable) {
    // Reset the inputs
    resetInputsForActivity()

    // Check if the activity has an introduction
    if (Activity.introduction != null && Activity.introduction != "") {
        $('#text-introduction').html(bbcodeToHtml(Activity.introduction))
        $('#activity-introduction').show()
    }
    
    // Check if the correction if available
    if (Activity.correction >= 1) {
        $('#activity-details').html(i18next.t("classroom.activities.sentOn") + formatHour(Activity.dateSend), i18next.t("classroom.activities.numberOfTries") + Activity.tries)
    } else {
        $('#activity-details').html(i18next.t("classroom.activities.toSend") + formatDay(Activity.dateEnd))
    }

    // Content management
    let content = manageContentForActivity();
    let correction = '';
    if (!UserManager.getUser().isRegular && Activity.correction > 1) {
        document.querySelector('#activity-correction').style.display = 'block';
        let activityResultString;
        switch (Activity.note) {
            case 3:
                activityResultString = i18next.t('classroom.activities.veryGoodProficiency')
                break;
            case 2:
                activityResultString = i18next.t('classroom.activities.goodProficiency')
                break;
            case 1:
                activityResultString = i18next.t('classroom.activities.weakProficiency')
                break;
            case 0:
                activityResultString = i18next.t('classroom.activities.insufficientProficiency')
                break;
            default:
                break;
        }
        correction += `<div class="results-string" style="background-color:var(--correction-${Activity.note})"">${activityResultString}</div>`
        
        if (Activity.commentary != null && Activity.commentary != "") {
            correction += '<div id="commentary-panel">' + Activity.commentary + '</div>'
        } else {
            correction += '<div id="commentary-panel">' + i18next.t("classroom.activities.bilan.noComment") + '</div>'
        }
    } else {
        document.querySelector('#activity-correction').style.display = 'none';
    }

    injectContentForActivity(content, Activity.correction, Activity.activity.type, correction, isDoable);

    if (!Activity.evaluation && correction < 2 && !isDoable) {
        isDoable = true;
    }
    isTheActivityIsDoable(isDoable);
}

function loadActivityForTeacher() {
    let isDoable = Activity.correction == null ? true : false;
    // Reset the inputs
    resetInputsForActivity()

    if (Activity.correction >= 1) {
        $('#activity-details').html(i18next.t("classroom.activities.activityOfUser") + Activity.user.pseudo + i18next.t("classroom.activities.userSentOn") + formatHour(Activity.dateSend))
        document.querySelector('#activity-details').innerHTML += `<br><img class="chrono-icon" src="${_PATH}assets/media/icon_time_spent.svg">${i18next.t('classroom.activities.timePassed')} ${formatDuration(Activity.timePassed)}, ${i18next.t("classroom.activities.numberOfTries")} ${Activity.tries}`;
    } else {
        $('#activity-details').html(i18next.t("classroom.activities.noSend"))
    }

    let content = manageContentForActivity();

    let correction = ''
    correction += `<h4 class="c-text-primary text-center font-weight-bold">${i18next.t('classroom.activities.bilan.results')}</h4>`

    if (UserManager.getUser().isRegular && Activity.correction > 0) {

        correction += `<div class="giveNote-container c-primary-form">`
        correction += `<label for="givenote-3" onclick="setNote(3)"><input type="radio" id="givenote-3" ${Activity.note == 3 ? "checked=checked" : ""} name="giveNote" value="3">${" " + i18next.t('classroom.activities.accept')}</label>`;
        correction += `<label for="givenote-2" onclick="setNote(2)"><input type="radio" id="givenote-2" ${Activity.note == 2 ? "checked=checked" : ""} name="giveNote" value="2">${" " + i18next.t('classroom.activities.vgood')}</label>`;
        correction += `<label for="givenote-1" onclick="setNote(1)"><input type="radio" id="givenote-1" ${Activity.note == 1 ? "checked=checked" : ""} name="giveNote" value="1">${" " + i18next.t('classroom.activities.good')}</label>`;
        correction += `<label for="givenote-0" onclick="setNote(0)"><input type="radio" id="givenote-0" ${Activity.note == 0 ? "checked=checked" : ""} name="giveNote" value="0">${" " + i18next.t('classroom.activities.refuse')}</label></div>`;

        correction += '<div id="commentary-panel" class="c-primary-form"><label>' + i18next.t("classroom.activities.comments") + '</label><textarea id="commentary-textarea" style="width:100%" rows="8">' + Activity.commentary + '</textarea></div>'
        correction += '<button onclick="giveNote()" class="btn c-btn-primary btn-sm text-wrap w-100"><span class="text-wrap">' + i18next.t('classroom.activities.sendResults') + '<i class="fas fa-chevron-right"> </i></span></button>'
    }

    injectContentForActivity(content, Activity.correction, Activity.activity.type, correction, isDoable);


    isTheActivityIsDoable(false);
}

function injectContentForActivity(content, correction, type = null, correction_div, isDoable)
{
    const activityValidationButtonElt = document.getElementById('activity-validate');
    activityValidationButtonElt.style.display = 'block';
    // Inject the content to the target div
    if (type == null) {
        $('#activity-content').html(bbcodeToHtml(content));
        if (typeof correction == 'string') {
            $('#activity-correction').html(bbcodeToHtml(correction));
        } else {
            $('#activity-correction').html(correction);
        }
    }

    // Things to do for every activity
    setTextArea();
    $('#activity-title').html(Activity.activity.title);

    switch(type) {
        case 'free':
            manageDisplayFree(correction, content, correction_div)
            break;
        case 'quiz':
            manageDisplayQuiz(correction, content, correction_div);
            break;
        case 'fillIn':
            manageDisplayFillIn(correction, content, correction_div);
            break;
        case 'reading':
            manageDisplayCustomAndReading(correction ,content, correction_div);
            break;
        case 'dragAndDrop':
            manageDisplayDragAndDrop(correction, content, correction_div);
            break;
/*
        Rémi : Probably not useful
        case 'custom':
            manageDisplayCustomAndReading(correction ,content, correction_div);
            break; */
        default:
            if (Activity.activity.isLti) {
                manageDisplayLti(correction, content, correction_div, isDoable, activityValidationButtonElt);
            } else {
                manageDisplayOldActivities(correction, content, correction_div, isDoable);
            }
            break;
    }
}

let wbbOpt = {
    buttons: ",bold,italic,underline|,justifyleft,justifycenter,justifyright,img,link,|,quote,bullist,|,vittaiframe,cabriiframe,vittapdf,video,peertube,vimeo,genialyiframe,gdocsiframe,answer",
}

function manageDisplayCustomAndReading(correction, content, correction_div) {

    //$('#activity-title').html(Activity.activity.title);
    $('#activity-content').html(bbcodeToHtml(content));
    $('#activity-content-container').show();
    if (correction == 0) {
        $('#activity-input').wysibb(wbbOpt);
        $('#activity-input-container').show();
    } else if (correction > 0) {
        $('#activity-correction').html(correction_div);
        $('#activity-correction-container').show(); 
    }
}

function manageDisplayFree(correction, content, correction_div) {

    //$('#activity-title').html(Activity.activity.title);
    $('#activity-content').html(bbcodeToHtml(content));
    $('#activity-content-container').show();
    if (correction == 0 || correction == null) {
        if (!UserManager.getUser().isRegular) {
            $('#activity-input').wysibb(wbbOpt);
            $('#activity-input-container').show();
        }
    } else if (correction > 0) {
        $('#activity-student-response').show();
        $('#activity-student-response-content').html(bbcodeToHtml(Activity.response));
        manageCorrectionDiv(correction_div, correction);
    }
}

function manageDisplayLti(correction, content, correction_div, isDoable, activityValidationButtonElt) {
    document.querySelector('#activity-content-container').style.display = 'block';
    //document.querySelector('#activity-title').innerHTML = Activity.activity.title;
    if (isDoable) {
        activityValidationButtonElt.style.display = 'none';
        launchLtiResource(Activity.id, Activity.activity.type, content, true);
    } else {
        document.querySelector('#activity-content').innerHTML = `
        <iframe src="${Activity.url}" width="100%" style="height: 60vh;" allowfullscreen=""></iframe>`;
        if (!Activity.evaluation) {
            document.querySelector('#activity-content').innerHTML += `
            <button onclick="launchLtiResource(${Activity.id}, '${Activity.activity.type}', '${content}', true, '${Activity.url}')">Modifier le travail</button>`;
        }
        
        if (correction != 1 || UserManager.getUser().isRegular) {
            document.querySelector('#activity-correction-container').style.display = 'block';
            document.querySelector('#activity-correction').innerHTML = correction_div;
        }
    }
}

function manageDisplayOldActivities(correction, content, correction_div, isDoable) {
    //document.querySelector('#activity-title').innerHTML = Activity.activity.title;
    document.querySelector('#activity-content').innerHTML = bbcodeToHtml(content);
    document.querySelector('#activity-content-container').style.display = 'block';
    if (!isDoable) {
        if (correction != 1 || UserManager.getUser().isRegular) {
            document.querySelector('#activity-correction-container').style.display = 'block';
            document.querySelector('#activity-correction').innerHTML = correction_div;
        }
    }
}

function manageDisplayQuiz(correction, content, correction_div) {
    $('#activity-states').html(bbcodeToHtml(content.states));
    $('#activity-states-container').show();

    if (correction == 0 || correction == null) {
        if (!UserManager.getUser().isRegular) {
            $('#activity-student-response-content').html("");
            let data = content.quiz.contentForStudent;
            $('#activity-student-response-content').append(createContentForQuiz(data));
            $('#activity-student-response').show();
        }
    } else if (correction > 0) {
        if (Activity.response != null) {
            $('#activity-student-response-content').html("");
            let data = JSON.parse(Activity.response);
            $('#activity-student-response-content').append(createContentForQuiz(data, false)); 
            $('#activity-student-response').show();
        }

        manageCorrectionDiv(correction_div, correction);
    }
}

function createContentForQuiz(data, doable = true) {
    let content = "";
    if (doable) {
        for (let i = 1; i < data.length+1; i++) {
            content += ` <div class="input-group">
                            <input type="checkbox" id="student-quiz-checkbox-${i}">
                            <input type="text" id="student-quiz-suggestion-${i}" value="${data[i-1].inputVal}" readonly>
                        </div>`;
        }
    } else {
        for (let i = 1; i < data.length+1; i++) {
            content += ` <div class="input-group">
                            <input type="checkbox" id="student-quiz-checkbox-${i}" ${data[i-1].isCorrect ? "checked" : ""} onclick="return false">
                            <input type="text" id="student-quiz-suggestion-${i}" value="${data[i-1].inputVal}" readonly>
                        </div>`;
        }
    }
    return content;
}

function manageDisplayFillIn(correction, content, correction_div) {
    $('#activity-title').html(Activity.activity.title);
    // Show the content with the response to the teacher
    if (UserManager.getUser().isRegular) {
        $('#activity-content').html(bbcodeToHtml(content.fillInFields.contentForTeacher));
        $('#activity-content-container').show();
    }

    $('#activity-states').html(bbcodeToHtml(content.states));
    $('#activity-states-container').show();
    
    if (correction <= 1 || correction == null) {
        if (!UserManager.getUser().isRegular) {
            let studentContent = bbcodeToHtml(content.fillInFields.contentForStudent)
            let nbOccu = studentContent.match(/﻿/g).length;

            for (let i = 1; i < nbOccu+1; i++) {
                studentContent = studentContent.replace(`﻿`, `<input type="text" id="student-fill-in-field-${i}" class="answer-student">`);
            }
            $('#activity-content').html(studentContent);

            if (Activity.response != null && Activity.response != "") {
                let response = JSON.parse(Activity.response);
                for (let i = 0; i < response.length; i++) {
                    let input = document.getElementById(`student-fill-in-field-${i+1}`);
                    if (response[i] != "" && response[i] != null) {
                        input.value = response[i];
                    }
                }
            }
            $('#activity-content-container').show();

        }
    } else if (correction > 1) {
        
        let studentContentString = content.fillInFields.contentForStudent,
            studentResponses = JSON.parse(Activity.response);


        studentResponses.forEach((response, i) => {
            studentContentString = studentContentString.replace('﻿', `<input type="text" id="student-fill-in-field-${i}" readonly class="answer-student" value="${response}">`);
        });

        $('#activity-student-response-content').html(studentContentString);
        $('#activity-student-response').show();

        manageCorrectionDiv(correction_div, correction);

    } 
}

function manageDisplayDragAndDrop(correction, content, correction_div) {
    
    $('#activity-title').html(Activity.activity.title);
    // Show the content with the response to the teacher
    if (UserManager.getUser().isRegular) {
        $('#activity-content').html(bbcodeToHtml(content.dragAndDropFields.contentForTeacher));
        $('#activity-content-container').show();
    }

    $('#activity-states').html(bbcodeToHtml(content.states));
    $('#activity-states-container').show();
    let studentResponses = JSON.parse(Activity.response);
    
    if (correction <= 1 || correction == null) {
        if (!UserManager.getUser().isRegular) {
            $('#activity-input').wysibb(wbbOpt);

            let ContentString = manageDragAndDropText(content.dragAndDropFields.contentForStudent);
            $('#drag-and-drop-text').html(`<div>${ContentString}</div>`);

            // Get the response array and shuffle it
            let choices = shuffleArray(JSON.parse(Activity.activity.solution));
            choices.forEach(e => {
                $('#drag-and-drop-fields').append(`<p class="draggable draggable-items drag-drop" id="${e}">${e.trim().toUpperCase()}</p>`);
            });
            $('#activity-drag-and-drop-container').show();
        
        
            let drake = dragula([document.querySelector('#drag-and-drop-fields')]).on('drop', function(el, target, source, sibling){
                if (target.id != 'drag-and-drop-fields') {
                    let swap = $(target).find('p').not(el);
                    swap.length > 0 ? source.append(swap[0]) : null;
                }
            });
        
            $('.dropzone').each((i, e) => {
                drake.containers.push(document.querySelector('#'+e.id));
            });
            
        }
    } else if (correction >  1) {
        
        let studentContentString = content.dragAndDropFields.contentForStudent;
        

        for (let i = 0; i < studentResponses.length; i++) {
            studentContentString = studentContentString.replace(/\|(.*?)\|/, studentResponses[i].string);
        }

        $('#activity-student-response-content').html(studentContentString);
        $('#activity-student-response').show();

        manageCorrectionDiv(correction_div, correction);
    } 
    
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function manageDragAndDropText(studentContentString) {
    let studentResponses = JSON.parse(Activity.activity.solution);
    for (let i = 0; i < studentResponses.length; i++) {
        let input = `<span class="dropable-items dropzone" id="dz-${i}"></span>`;
        studentContentString = studentContentString.replace(`﻿`, input);
    }
    return studentContentString;
}


function manageCorrectionDiv(correction_div, correction) {
    if (UserManager.getUser().isRegular) {
        $('#label-activity-student-response').text(i18next.t("classroom.activities.studentAnswer"));
    } else {
        $('#label-activity-student-response').text(i18next.t("classroom.activities.yourAnswer"));
    }
    if (correction > 1) {
        $('#activity-correction').html(correction_div);
        $('#activity-correction-container').show(); 
    }
}


// Set all the inputs we need to reset
function resetInputsForActivity() {
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

    $("#activity-hint").text('');
    $("#activity-hint-container").hide();

    $('#activity-drag-and-drop-container').hide();
    $('#drag-and-drop-fields').html('');
    $('#drag-and-drop-text').html('');

    $('#warning-text-evaluation').hide();
    $("warning-text-no-evaluation").hide();
    // Quiz reset input
    $(`div[id^="teacher-suggestion-"]`).each(function() {
        $(this).remove();
    })
}

function isTheActivityIsDoable(doable, hideValidationButton = false) {
    if (doable == false) {
        $('#activity-validate').hide();
        $('#activity-save').hide();
    } else {
        let interface = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm.exec(Activity.activity.content)
        if (!hideValidationButton) {
            if (!Activity.activity.isLti) {
                $('#activity-validate').show();
            }
        }
        
        if (interface != undefined && interface != null) {
            $('#activity-save').show()
        }

        if (!Activity.activity.isLti) { 
            Activity.evaluation ? $('#warning-text-evaluation').show() : $("warning-text-no-evaluation").show();
            $('#activity-validate').show();
            if (Activity.activity.type != 'reading') {
                $('#activity-save').show();
            }
        }
    }
}


function manageContentForActivity() {
    let content = "";
    if (IsJsonString(Activity.activity.content)) {
        const contentParsed = JSON.parse(Activity.activity.content);
        if (Activity.activity.type != "fillIn" && Activity.activity.type != "quiz" && Activity.activity.type != "dragAndDrop") {
            if (contentParsed.hasOwnProperty('description')) {
                content = contentParsed.description;
            }
        } else {
            content = contentParsed;
        }
    } else {
        content = Activity.activity.content.replace(/(\[iframe\].*?link=[a-f0-9]{13})/gm, '$1&use=classroom')
        if (Activity.project != null) {
            if (LINK_REGEX.test(Activity.activity.content)) {
                content = content.replace(LINK_REGEX, '$1' + Activity.project.link)
            }
        } else {
            content = content
        }
    }
    return content;
}


function setPluriel(number) {
    if (number > 1) {
        return 's'
    } else return ''
}