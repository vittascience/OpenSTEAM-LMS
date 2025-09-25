/**
 * Listener for direct communications from iframes in LTI application interoperability context
 */
window.addEventListener(
    "message", 
    (event) => {
        readEvent(event).catch((error) => {console.error(error)});
    }, 
    false
);

async function readEvent (event) {
    if(event.data.type === "" || event.data.type === "loaded") return; // ignore msg
    try {
        JSON.parse(event.data);
    } catch(error) {
        return false;
    }
    const msg = event.data.type ? event.data.type : JSON.parse(event.data);
    switch(msg.type) {
        // Message received when an LTI resource launch has gone to submission
        case 'end-lti-score':
            // Update the activities from database
            await Main.getClassroomManager().getStudentActivities(Main.getClassroomManager());
            // Get the results of the current activity
            for (let state in Main.getClassroomManager()._myActivities) {
                const currentSearch = Main.getClassroomManager()._myActivities[state].filter(x => x.id == Activity.id)[0];
                if (typeof currentSearch != 'undefined') {
                    Activity = currentSearch;
                    break;
                }
            }


            if (!Activity.isFromCourse) {
                // If the current activity needs a manual review, display the relevant panel
                if (Activity.correction == 1) {
                    navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-activities');
                } else {
                    // Otherwise display the relevant panel for success or fail
                    switch (Activity.note) {
                        case 0:
                            navigatePanel('classroom-dashboard-activity-panel-fail', 'dashboard-activities');
                            break;
                        case 3:
                            navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities');
                            break;
                            
                        default:
                            navigatePanel('classroom-dashboard-activities-panel', 'dashboard-activities');
                            break;
                    }
                }
                // Clearing the LTI content div
                document.querySelector('#lti-loader-container').innerHTML = '';
            } else {
                let courseId = parseInt(coursesManager.actualCourse.id);
                let course = Main.getClassroomManager()._myCourses.filter(x => x.course.id == courseId)[0];
                if (!course.course.format) {
                    coursesManager.validateCourse(1);
                } else {
                    // todo for one page course
                    let iframeId = event.source.frameElement.dataset.id;
                    let iframeLink = event.source.frameElement.dataset.link;
                    coursesManager.validateLtiOnePageCourse(iframeId, iframeLink);
                }
            }

           
            break;
        // Message received when an LTI deep link has returned
        case 'end-lti-deeplink':
            // Saving the deeplink response into the activity creation data
            Main.getClassroomManager()._createActivity.content.description = msg.content;
            // Automatically stepping forward in the activity creation process
            contentForward();
            // Clear the activity content to close the LTI iframe
            document.querySelector('#activity-content').innerHTML = '';
            break;
        case 'lti-edited':
            new ActivityTracker().setIsUpToDate(false);
            break;
        case 'lti-saved':
            new ActivityTracker().setIsUpToDate(true);
            break;
        default:
            console.warn('The current message type isn\'t supported!');
    }
}

//formulaire de création de classe
$('body').on('click', '.teacher-new-classe', function (event) {
    ClassroomSettings.classroom = null;
    let classCount = Main.getClassroomManager()._myClasses.length;
    let maxClass = getMaxClass();
    if (classCount >= maxClass && maxClass != -1) {
        displayNotification('#notif-div', "classroom.notif.classNotCreated", "error", `'{"classroomNumberLimit": "${UserManager.getUser().restrictions.maxClassrooms}"}'`);
        let event = new CustomEvent('displayPremiumModal', {detail: 'classroomAddition'});
        document.dispatchEvent(event);
        return;
    }
    navigatePanel('classroom-dashboard-form-classe-panel', 'dashboard-classes-teacher');
    $('#table-students ul').html('<li id="no-student-label" data-i18n="classroom.classes.form.noStudent"></li>').localize();
});


function getMaxClass() {
    if (UserManager.getUser().restrictions.premium) {
        return 20
    } else {
        return UserManager.getUser().restrictions.maxClassrooms
    }
}


//student modal-->supprimer
$('body').on('click', '.modal-student-delete', function () {
    pseudoModal.openModal('delete-student-modal');
    let inputValidation = document.getElementById("validation-delete-student");
    inputValidation.focus();
    $("#student-to-delete-id").val($(this).attr('data-student-id'));
})

function persistDeleteStudent() {

    let validation = $('#validation-delete-student').val(),
        placeholderWord = $('#validation-delete-student').attr('placeholder');

    if (validation == placeholderWord) {
        ClassroomSettings.student = parseInt($("#student-to-delete-id").val());
        Main.getClassroomManager().deleteStudent(ClassroomSettings.student).then(() => {
            let classroom = deleteStudentInList(ClassroomSettings.student, ClassroomSettings.classroom)
            displayStudentsInClassroom(classroom.students)
            displayNotification('#notif-div', "classroom.notif.accountIsDelete", "success")
        })
        $('#validation-delete-student').val("");
        pseudoModal.closeModal('delete-student-modal');
    }
}

function cancelDeleteStudent() {
    $('#validation-delete-student').val("");
    pseudoModal.closeModal('delete-student-modal');
}





//student modal-->restaurer le mot de passe
$('body').on('click', '.modal-student-password', function () {
    ClassroomSettings.student = parseInt($(this).attr('data-student-id'))
    Main.getClassroomManager().generatePassword(ClassroomSettings.student).then((response) => {
        displayNotification('#notif-div', "classroom.notif.newPwd", "success", `'{
            "pseudo": "${response.pseudo}",
            "pwd": "${response.mdp}"
        }'`)
        $(this).parent().find('#masked').html(response.mdp)
    })

})

/**
 * Setup and open the student pseudo modal
 * @param {*} id 
 */
function changePseudoModal(id) {
    ClassroomSettings.student = id
    const pseudo = Main.getClassroomManager().getLocalCurrentClassroomStudentById(id).user.pseudo;
    document.querySelector('.change-pseudo-modal').value = pseudo;
    pseudoModal.openModal('update-pseudo-modal');
}

$('body').on('click', '#update-pseudo-close', function () {
    Main.getClassroomManager().changePseudo(ClassroomSettings.student, $('.change-pseudo-modal').val()).then(function (formerPseudo) {
        pseudoModal.closeModal('update-pseudo-modal');
        // Refresh instant
        dashboardAutoRefresh.refresh();
        changePseudoStudentInList(ClassroomSettings.student, ClassroomSettings.classroom, $('.change-pseudo-modal').val());
        displayNotification('#notif-div', "classroom.notif.pseudoUpdated", "success", `'{"newPseudo": "${$('.change-pseudo-modal').val()}"}'`);
        $('.change-pseudo-modal').val('');
    })

})

//classroom modal-->supprimer
$('body').on('click', '.modal-classroom-delete', function (e) {
    e.stopPropagation();
    
    const card = this.closest('.class-card');
    if (!card) return console.warn('Aucune .class-card parente');
    
    const linkEl = card.querySelector('[data-link]');
    if (!linkEl) return console.warn('no [data-link] in .class-card');
    
    const link = linkEl.dataset.link;
    
    Main.getClassroomManager()._selectedClassroomToDelete = link;

    $('#validation-delete-classroom').val("");
    pseudoModal.openModal("delete-classroom");
    let inputInModal = document.getElementById("validation-delete-classroom")
    inputInModal.focus();
})

function persistDeleteClassroom() {
    let validation = $('#validation-delete-classroom').val(),
        placeholderWord = $('#validation-delete-classroom').attr('placeholder');

    if (validation == placeholderWord) {
        Main.getClassroomManager().deleteClassroom(Main.getClassroomManager()._selectedClassroomToDelete).then(function (classroom) {
            const classroomFullName = classroom.group != null ? `${classroom.name}-${classroom.group}` : `${classroom.name}`;
            deleteClassroomInList(classroom.link);
            classroomsDisplay();
            displayNotification('#notif-div', "classroom.notif.classroomDeleted", "success", `'{"classroomName": "${classroomFullName}"}'`);
            pseudoModal.closeAllModal();
        })
        ClassroomSettings.classroom = null;
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function cancelDeleteClassroom() {
    pseudoModal.closeAllModal();
    Main.getClassroomManager()._selectedClassroomToDelete = null;
}

$('body').on('click', '.modal-classroom-modify', function (e) {
  e.stopPropagation();

  const card = this.closest('.class-card');
  if (!card) return console.warn('Aucune .class-card parente');

  const linkEl = card.querySelector('[data-link]');
  if (!linkEl) return console.warn('no [data-link] in .class-card');

  const link = linkEl.dataset.link;
  ClassroomSettings.classroom = link;

  navigatePanel('classroom-dashboard-form-classe-panel-update', 'dashboard-classes-teacher');
});


//ouvre le dashboard d'une classe
$('body').on('click', '.class-card', function () {
    if (!$(this).find("i:hover").length) {
        ClassroomSettings.classroom = $(this).find('.class-card-top').attr('data-link')
        navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', ClassroomSettings.classroom)
    }
})

function setNote(note) {
    Activity.note = note
    if (note > 1) {
        Activity.correction = 2
    } else {
        Activity.correction = 3
    }
}

function giveNote() {
    let comment = $('#commentary-textarea').val()
    Main.getClassroomManager().setActivityCorrection(Activity, Activity.correction, Activity.note, comment).then(function (exercise) {
        Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(function () {
            Activity = exercise
            navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', ClassroomSettings.classroom)
        })

    })
}


//affiche le bilan d'un élève
$('body').on('click', '.username .col-6, .username .propic', function () {
    if ($('#student-bilan-return').length > 0) {
        let id = parseInt($(this).parent().attr('data-student-id'))
        let students = getClassroomInListByLink(ClassroomSettings.classroom)[0].students
        let student = getStudentInListById(id, students)
        displayStudentsInClassroom(student)
        $('.legend').after('<button id="student-bilan-return"class="btn c-btn-primary">Retour à la classe</button>')
    }
})
$('body').on('click', '#student-bilan-return', function () {
    $(this).remove()
    navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', ClassroomSettings.classroom)
})
//retirer un étudiant du tableau
$('body').on('click', '.remove-student', function () {
    $(this).parent().remove()
})

// Classroom addition in database
document.querySelector('#classroom-create-form').addEventListener('submit', (e) => {
    e.preventDefault();
    e.submitter.disabled = true;
    Main.getClassroomManager().addClassroom({
        'name': document.querySelector('#classroom-form-name').value,
        'school': document.querySelector('#classroom-form-school').value,
        'isBlocked': false
    }).then((classroom) => {
        // handle specific error
        if(classroom.errorType){
            displayNotification('#notif-div', `classroom.notif.${classroom.errorType}`, "error", `'{"ClassroomNameInvalid": "${classroom.errorType}"}'`)
            e.submitter.disabled = false;
            return;
        } 
        // If the backend detects that the user is not a premium user and that he already has one classroom
        else if (classroom.isClassroomAdded == false) {
            displayNotification('#notif-div', "classroom.notif.classNotCreated", "error", `'{"classroomNumberLimit": "${classroom.classroomNumberLimit}"}'`);
            e.submitter.disabled = false;

            // fire an event to display the premium modal
            let event = new CustomEvent('displayPremiumModal', {detail: 'classroomAddition'});
            document.dispatchEvent(event);
        }else{
            const students = [];
            const existingStudents = [];
            for (let studentRowElt of document.querySelectorAll('#table-students ul li')){
                if (studentRowElt.id != 'no-student-label') {
                    students.push(studentRowElt.getAttribute('data-pseudo'));
                }
            }
            if(students.length){
                Main.getClassroomManager().addUsersToGroup(students, existingStudents, classroom.link).then((response) => {
                    if(!response.isUsersAdded){
                        if(response.errorType){
                            displayNotification('#notif-div', `classroom.notif.${response.errorType}`, "error");
                        } else{
                            displayNotification('#notif-div', "classroom.notif.classCreatedButNotUsers", "error", `'{"classroomName": "${classroom.name}", "learnerNumber": "${response.currentLearnerCount+response.addedLearnerNumber}"}'`);
                        }
                        
                        Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
                            e.submitter.disabled = false;
                            navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', classroom.link);
                        });
                    } else{
                        Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
                            ClassroomSettings.classroom = classroom.link;
                            addUserAndGetDashboard(classroom.link);
                            displayNotification('#notif-div', "classroom.notif.classroomCreated", "success", `'{"classroomName": "${classroom.name}"}'`);
                            e.submitter.disabled = false;
                        });
                    }
                });
            }else{
                Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
                    ClassroomSettings.classroom = classroom.link;
                    addUserAndGetDashboard(classroom.link);
                    displayNotification('#notif-div', "classroom.notif.classroomCreated", "success", `'{"classroomName": "${classroom.name}"}'`);
                    e.submitter.disabled = false;
                });
            }
        }
    });
});

document.querySelector('#classroom-update-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitter = e.submitter;
    if (submitter) submitter.disabled = true;

    try {
        const classroomFound = Main.getClassroomManager()._myClasses.find(c => c.classroom.link === ClassroomSettings.classroom).classroom.isBlocked;
        const classroom = await Main.getClassroomManager().updateClassroom({
            name: document.querySelector('#classroom-form-name-update').value,
            school: document.querySelector('#classroom-form-school-update').value,
            link: ClassroomSettings.classroom,
            isBlocked: classroomFound
        });
        if (classroom.errorType) {
            displayNotification('#notif-div', `classroom.notif.${classroom.errorType}`, 'error', `'{"ClassroomNameInvalid": "${classroom.errorType}"}'`);
        }
        updateClassroomElementWithNewInfo(classroom);
        addUserAndGetDashboard(ClassroomSettings.classroom);
    } catch (err) {
        console.error(err);
        // Ajuste la clé de notif d’erreur générique selon ton i18n
        displayNotification('#notif-div', 'common.error.unknown', 'error');
    } finally {
        if (submitter) submitter.disabled = false;
    }
});

function updateClassroomElementWithNewInfo(classroom) {
    const classroomIndex = Main.getClassroomManager()._myClasses.findIndex(c => c.classroom.link === classroom.link);
    if (classroomIndex !== -1) {
        Main.getClassroomManager()._myClasses[classroomIndex].classroom = classroom;
    }
}

//add students to an existing classroom on the classroom dashboard
$('body').on('click', '#add-student-to-classroom', function () {

    // disable button to avoid multiple click
    document.querySelector('#add-student-to-classroom').disabled = true;
    const studentNameInput = document.querySelector('#add-student-input-from-modal');
    const studentName = studentNameInput.value;

    if (studentName != ''){
        let students = [studentName];
        let existingStudents = [];

        Main.getClassroomManager().addUsersToGroup(students, existingStudents, ClassroomSettings.classroom).then((response) => {
            if (!response.isUsersAdded) {
                if(response.noUser){
                    displayNotification('#notif-div', "classroom.notif.noUserUsername", "error");
                    return;
                }
                /**
                 * Update Rémi : Users limitation by group 
                 * possible return : personalLimit, personalLimitAndGroupOutDated, bothLimitReached
                 */
                if (response.errorType) {
                    // a specific error has been returned, display it
                    displayNotification('#notif-div', `classroom.notif.${response.errorType}`, "error", `'{"reservedNickname": "${demoStudentName}"}'`);
                    return;
                } else {
                    manageResponseOfAddUsers(response);
                }
            } else {
                Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(function () {
                    addUserAndGetDashboard(ClassroomSettings.classroom);
                    //document.querySelector('#classroom-dashboard-add-student-div').innerHTML = BASE_STUDENT_FORM;
                    studentNameInput.value = '';
                    pseudoModal.closeModal('add-student-modal');
                    displayNotification('#notif-div', "classroom.notif.usersAdded", "success");
                });
            }
        });
    } else {
        displayNotification('#notif-div', "classroom.notif.noUserUsername", "error");
    }
});

//add students to an existing classroom on the update classroom panel
$('body').on('click', '#update-classroom-add-student-to-list', function () {
    if ($('#update-classroom-add-student-div .student-form-name').val() != ''){
        $('#table-students-update ul').append(addStudentRow($('#update-classroom-add-student-div .student-form-name').val()));
        pseudoModal.closeModal('update-classroom-student-modal');
        // Reset the input field
        $('#update-classroom-add-student-div .student-form-name').val('');
    } else {
        displayNotification('#notif-div', "classroom.notif.noUserUsername", "error");
    }

});

// Add students to a new classroom on the create classroom panel (select by ID -> add id to button in modal)
$('body').on('click', '#create-classroom-add-student-to-list', () => {
    if ($('#add-student-div .student-form-name').val() != ''){
        $('#no-student-label').remove();
        $('#table-students ul').append(addStudentRow($('#add-student-div .student-form-name').val()))
        pseudoModal.closeModal('create-classroom-student-modal');
        // Reset the input field
        $('#add-student-div .student-form-name').val('');
    } else {
        displayNotification('#notif-div', "classroom.notif.noUserUsername", "error");
    }
});

/**
 * Manages the display notification from the response
 * @param {*} response 
 */
function manageResponseOfAddUsers(response) {
    if (response.hasOwnProperty('message')) { 
        if (response.message == "personalLimit") {
            displayNotification('#notif-div', "classroom.notif.personalLimitationsReached", "error", `'{"max": "${response.teacherInfo.maxStudents}"}'`);
            // Show upgrade modal
            let event = new CustomEvent('displayPremiumModal', {detail: 'learnerAddition', isGar: UserManager.getUser().isFromGar});
            document.dispatchEvent(event);
        } else if (response.message == "personalLimitAndGroupOutDated") {
            displayNotification('#notif-div', "classroom.notif.groupLimitationsTeacher", "error", `'{"learnerNumber": "${response.currentLearnerCount+response.addedLearnerNumber}"}'`);
           // Show upgrade modal
        } else if (response.message == "bothLimitReached") {
            // Teacher's and Group's limits reached
            displayNotification('#notif-div', "classroom.notif.bothLimitationsReached", "error", `'{"maxP": "${response.teacherInfo.maxStudents}", "maxG": "${response.groupInfo.maxStudents}"}'`);;  
        }
    } else {
        displayNotification('#notif-div', "classroom.notif.usersNotAdded", "error", `'{"learnerNumber": "${response.currentLearnerCount+response.addedLearnerNumber}"}'`);
    }
}

/**
 * Opens the modal which allows to add users using a csv file
 * @param {boolean} update - Gives the context to open the relevant modal
 */
function openCsvModal(update = false){
    if (update) {
        pseudoModal.openModal('import-csv-update-classroom');
    } else if (ClassroomSettings.classroom !== null){
        pseudoModal.openModal('import-csv');
    } else {
        pseudoModal.openModal('import-csv-create-classroom');
    }
}


/**
 * Add students to a classroom using a csv file
 * @param {boolean} update - Gives the context to operate on the relevant elements
 */
function importLearnerCsv(update = false){
    if (update) {
        // If the current call is in the context of a classroom modification
        importLearnerCsvCreateUpdateClassroom(document.getElementById('importcsv-fileinput-classroom-update'), document.querySelector('#table-students-update ul'), 'import-csv-update-classroom');
    } else if(ClassroomSettings.classroom){
        // If the current call is directly from the classroom dashboard
        csvToClassroom(ClassroomSettings.classroom).then((response) => {
            /**
             * Updated @Rémi
             * the case where the students was not added was not implemented
             */
            if (response == true) {
                pseudoModal.closeModal('import-csv');
                Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
                    let students = getClassroomInListByLink(ClassroomSettings.classroom)[0].students;
                    displayStudentsInClassroom(students);
                    displayNotification('#notif-div', "classroom.notif.usersAddedFromCsv", "success");
                });
            } else {
                if(response.errorType){
                  // a specific error has been returned, display it
                  displayNotification('#notif-div', `classroom.notif.${response.errorType}`, "error", `'{"reservedNickname": "${demoStudentName}"}'`);
                  return;
                } else {
                  manageResponseOfAddUsers(response);
                }  
            }
        })
        .catch((response) => {
            console.error(response);
        });
    } else {
        // import the students before the class creation
        importLearnerCsvCreateUpdateClassroom(document.getElementById('importcsv-fileinput-classroom-create'), document.querySelector('#table-students ul'), 'import-csv-create-classroom');
    }
}

/**
 * Get the student list from a csv file and append it in the classroom creation/update panel
 * @param {DOM Element} fileInputElt - The file input element
 * @param {DOM Element} tableStudentUlElt The ul listing all the students
 * @param {string} modalId The id of the current modal
 */
function importLearnerCsvCreateUpdateClassroom(fileInputElt, tableStudentUlElt, modalId) {
    const csvFile = fileInputElt.files[0];
    if (csvFile){
        const reader = new FileReader();
        try {
            reader.readAsText(csvFile);
            reader.onload = function (event) {
                let csv = event.target.result;
                let lines = csv.split("\n");
                let headers = lines[0].split(/[,;]/);

                
                if (!checkMaxStudentsWhenImportingCsv(csv)) {
                    pseudoModal.closeAllModal();
                    // Show upgrade modal
                    let event = new CustomEvent('displayPremiumModal', {detail: 'learnerAddition', isGar: UserManager.getUser().isFromGar});
                    document.dispatchEvent(event);
                    return;
                }

                for(let i = 0; i < headers.length; i++) {
                    headers[i] = headers[i].replace("\r","");
                }
                
                let missingPseudoError = false;
                for (let i = 1; i < lines.length; i++) {
                    // sanitize the current line
                    lines[i] = lines[i].replace(/(\r\n|\n|\r)/gm, "")
                    // ignore current empty line
                    // NOTE : EXCEL return a single character for an empty line when we use the "pseudo;password" example file
                    if(lines[i] == '' || lines[i] ==';') continue;

                    let currentline = lines[i].split(/[,;]/);
                    
                    // set the error flag to true if the pseudo is missing in the csv
                    if(currentline[0].trim() == '') missingPseudoError = true;

                    // add the student into the students table
                    else tableStudentUlElt.innerHTML += addStudentRow(currentline[0]);
                }

                // display the missing pseudo error
                if(missingPseudoError == true) displayNotification('#notif-div', 'classroom.notif.pseudoMissingInCsvFile', 'error');

                if (document.querySelectorAll('#table-students ul li .col').length > 1) {
                    if (document.querySelector('#no-student-label') !== null)
                        document.querySelector('#no-student-label').remove();
                }
                // remove the previous filename uploaded on open 
                fileInputElt.value = '';
                pseudoModal.closeModal(modalId);
            }
        } catch (error) {
            reject(`Error while opening the csv file! Reason: ${error}`);
            displayNotification('#notif-div', "classroom.notif.errorWithCsv", "error", `'{"error": "${error}"}'`);
        }
    } else {
        displayNotification('#notif-div', "classroom.notif.CsvFileMissing", "error");
    }
}



/**
 * Process and send data from csv to the server
 * @param {string} link 
 */
function csvToClassroom(link) {
    return new Promise((resolve, reject) => {
        let csvFile = document.getElementById('importcsv-fileinput').files[0];
        if(csvFile){
            const reader = new FileReader();
            try {
                reader.readAsText(csvFile);
                reader.onload = function (event) {
                    const csv = event.target.result;
                    let json = csvJSON(csv);

                    if (!checkMaxStudentsWhenImportingCsv(csv)) {
                        pseudoModal.closeAllModal();
                        // Show upgrade modal
                        let event = new CustomEvent('displayPremiumModal', {detail: 'learnerAddition', isGar: UserManager.getUser().isFromGar});
                        document.dispatchEvent(event);
                        return;
                    }

                    Main.getClassroomManager().addUsersToGroupByCsv(JSON.parse(json), link, "csv").then((response) => {
                        resolve(response);
                    });
                }
            } catch (error) {
                reject(`Error while opening the csv file! Reason: ${error}`);
                displayNotification('#notif-div', "classroom.notif.errorWithCsv", "error", `'{"error": "${error}"}'`);
            }
        }else{
            reject('No csv file given!');
            displayNotification('#notif-div', "classroom.notif.CsvFileMissing", "error");
        }
    });
}

function checkMaxStudentsWhenImportingCsv(csvFile) {
    let maxStudents = UserManager.getUser().restrictions.maxStudents,
    currentLearnerCount = UserManager.getUser().teacherData.students;
    if (csvFile.split("\n").length + currentLearnerCount > maxStudents && maxStudents != -1 && !UserManager.getUser().isFromGar) {
        displayNotification('#notif-div', "classroom.notif.personalLimitationsReached", "error", `'{"max": "${maxStudents}"}'`);
        return false;
    }
    return true;
}

/**
 * Convert a csv file into data to be sent to the server
 * @param {*} csv 
 * @returns {string} - list of learners and their passwords
 */
function csvJSON(csv) {

    /**
     * define array of internal headers 
     * to replace incoming headers 
     * following this format => student|password
     */
    const internalHeaders = ["apprenant","mot_de_passe"]
    let lines = csv.split("\n");
    const result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then convert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    let headers = lines[0].split(/[,;]/);
    
    for(let i=0; i< headers.length; i++){
        headers[i] = internalHeaders[i]
        // headers[i] = headers[i].replace("\r","")
    }
    for (let i = 1; i < lines.length; i++) {
        // sanitize the current line
        lines[i] = lines[i].replace(/(\r\n|\n|\r)/gm, "")
        // ignore current empty line
        // NOTE : EXCEL return a single character for an empty line when we use the "pseudo;password" example file
        if(lines[i] == '' || lines[i] ==';') continue 

        // create empty object to fill and split line data
        let obj = {};
        let currentline = lines[i].split(/[,;]/);

        for (let j = 0; j < headers.length; j++) {
            if(typeof currentline[j] != 'undefined' ){
                // fill the object with data 
                obj[headers[j]] = currentline[j].replace("\r","").trim();
            }
        }
        result.push(obj);
    }
    // remove the previous filename uploaded on open 
    $('#importcsv-fileinput').val("");
    return JSON.stringify(result); //JSON
}

/**
 * Open the modal which allows to download csv files
 */
function openDownloadCsvModal(){
    pseudoModal.openModal('export-csv');
}

/**
 * Download the current classroom list of learners and close the export-csv modal
 */
function exportLearnerCsv(){
    if(ClassroomSettings.classroom){
        classroomToCsv(ClassroomSettings.classroom);
        pseudoModal.closeModal('export-csv');
    }
}

/**
 * Download the current classroom dashboard and close the export-csv modal
 */
function exportDashboardCsv(){
    if(ClassroomSettings.classroom){
        dashboardToCsv(ClassroomSettings.classroom);
        pseudoModal.closeModal('export-csv');
    }
}

/**
 * Generate and download a csv file containing the list of the learners in the classroom and their passwords
 * @param {string} link - link of the classroom
 */
function classroomToCsv(link) {
    let html = "apprenant;mot_de_passe \n"
    let classroom = getClassroomInListByLink(link)[0]
    for (let i = 0; i < classroom.students.length; i++) {
        if(classroom.students[i].user.pseudo != demoStudentName){
            html += classroom.students[i].user.pseudo + ";" + classroom.students[i].pwd + "\n";
        }
    }
    let date = new Date();
    let name = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '-' + date.getHours() + 'h-' + date.getMinutes() + 'm.csv';
    let element = document.createElement('a');
    let encodedUri = 'data:application/csv;charset=utf-8,' + encodeURIComponent(html);
    element.setAttribute('href', encodedUri);
    element.setAttribute('download', name)
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Generate and download a csv file containing the classroom dashboard
 * @param {string} link - link of the classroom
 */
function dashboardToCsv(link) {
    let html = ""
    let headHtml = "apprenant;"
    let classroom = getClassroomInListByLink(link)[0]
    let index = listIndexesActivities(classroom.students)
    for (let j = 0; j < index.length; j++) {
        headHtml += index[j].title + ';'
    }
    headHtml += "\n"
    for (let i = 0; i < classroom.students.length; i++) {
        if(classroom.students[i].user.pseudo != demoStudentName){
            let arrayActivities = reorderActivities(classroom.students[i].activities, index)
            html += classroom.students[i].user.pseudo + ";"
            for (let j = 0; j < arrayActivities.length; j++) {
                html += statusActivity(arrayActivities[j], 'csv') + ';'
            }
            html += "\n"
        }
    }
    html = headHtml + html
    let date = new Date();
    let name = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '-' + date.getHours() + 'h-' + date.getMinutes() + 'm.csv';
    let element = document.createElement('a');
    let encodedUri = 'data:application/csv;charset=utf-8,' + encodeURIComponent(html);
    element.setAttribute('href', encodedUri);
    element.setAttribute('download', name)
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

}

/**
 * Order the current user array of activities to fit the current classroom index of activities
 * @param {Object} activities - The current user array of activities
 * @param {array} indexes - The current classroom index of activities
 * @returns {array} - The current user array of activities ordered to fit the current classroom index of activities
 */
function reorderActivities(activities, indexes) {
    let orderedActivities = [];
    for (let i = 0; i < indexes.length; i++) {
        for(activity of activities) {
            if (activity.reference == indexes[i].reference) {
                orderedActivities[i] = activity;
                break;
            } else {
                orderedActivities[i] = false;
            }
        };
    }
    return orderedActivities;
}
//ne peut attribuer une activité qu'une fois pour le dashboard
//faudrait ajouter une notif "cette activité lui a déja été attribuée"
function listIndexesActivities(students) {
    ClassroomSettings.indexRef = []
    let indexArray = new Array()
    let indexArraybis = new Array()
    students.forEach(element => {
        element.activities.forEach(element => {
            if (!indexArray.includes(element.reference) && !element.isFromCourse) {
                indexArray.push(element.reference)
                indexArraybis.push({
                    id: element.activity.id,
                    title: element.activity.title,
                    reference: element.reference,
                    isCourse: false,
                    //isFromCourse: element.isFromCourse,
                    //course: element.hasOwnProperty('course') ? element.course : null
                })
                ClassroomSettings.indexRef.push(element)
            }
        })

        for(let course of element.courses) {
            if (!indexArray.includes(course.reference) && course.activitiesReferences != null) {
                indexArray.push(course.reference)
                indexArraybis.push({
                    id: course.id,
                    courseId: course.course.id,
                    title: course.course.title,
                    reference: course.reference,
                    activitiesReference: course.activitiesReferences,
                    isCourse: true,
                    courseLength: course.activitiesReferences.length,
                })
                ClassroomSettings.indexRef.push(course)
            }
        }
    });
    // sorting the index array by date
    indexArraybis.sort((a, b) => {
        return (a.reference > b.reference) ? 1 : -1;
    });

    return indexArraybis;
}

function addUserAndGetDashboard(link) {
    navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', link)
}

function getClassroomInListByLink(link) {
    return Main.getClassroomManager()._myClasses.filter(x => x.classroom.link == link)
}

function addClassroomInList(classroom) {
    Main.getClassroomManager()._myClasses.push(classroom)
}

function addSandboxInList(project) {
    Main.getClassroomManager()._myProjects.push(project)
}

function addStudentActivityInList(student, activity) {
    Main.getClassroomManager()._myClasses.foreach(function (element, index) {
        if (ClassroomSettings.classroom == element.classroom.link) {
            var classroomIndex = index;
            element.students.foreach(function (element, index) {
                if (student.id == element.id) {
                    var studentIndex = index;
                    element.activities.push(activity)

                }
            })
        }
    })
    if (classroomIndex && studentIndex) {
        Main.getClassroomManager()._myClasses[classroomIndex].students[studentIndex].push(activity)
    } else {
        console.log("l'actualisation des activités a échoué")
    }
}

function deleteClassroomInList(link) {
    Main.getClassroomManager()._myClasses = Main.getClassroomManager()._myClasses.filter(x => x.classroom.link !== link)
}

function deleteStudentInList(id, linkClassroom) {
    let classroom = getClassroomInListByLink(linkClassroom)[0]
    let classroomToChange = classroom.students.filter(x => x.user.id !== id)
    classroomToChange = {
        classroom: classroom.classroom,
        students: classroomToChange
    }
    Main.getClassroomManager()._myClasses = Main.getClassroomManager()._myClasses.filter(x => x.classroom.link !== linkClassroom)
    Main.getClassroomManager()._myClasses.push(classroomToChange)
    return classroomToChange
}

function changePseudoStudentInList(id, linkClassroom, pseudo) {
    let classroom = getClassroomInListByLink(linkClassroom)[0];
    let userToChange = classroom.students.filter(x => x.user.id == id)[0];
    userToChange.user.pseudo = pseudo
    let studentList = classroom.students.filter(x => x.user.id !== id)
    studentList.push(userToChange)
    classroom = {
        classroom: classroom.classroom,
        students: studentList
    }
    Main.getClassroomManager()._myClasses = Main.getClassroomManager()._myClasses.filter(x => x.classroom.link !== linkClassroom)
    Main.getClassroomManager()._myClasses.push(classroom)
    return classroom
}

function getStudentInListById(id, students) {
    return students.filter(x => x.user.id == id)
}

function getAttributionByRef(ref) {
    return ClassroomSettings.indexRef.filter(x => x.reference == ref)[0]

}

function getTeacherActivityInList(id) {
    return Main.getClassroomManager()._myTeacherActivities.filter(x => x.id == id)[0]
}

function deleteTeacherActivityInList(id) {
    Main.getClassroomManager()._myTeacherActivities = Main.getClassroomManager()._myTeacherActivities.filter(x => x.id !== id)
}


function deleteSandboxInList(link) {
    Main.getClassroomManager()._myProjects = Main.getClassroomManager()._myProjects.filter(x => x.link !== link)
}

function addTeacherActivityInList(activity) {
    Main.getClassroomManager()._myTeacherActivities.push(activity)
}

function addProjectInList(project) {
    Main.getClassroomManager()._myProjects.push(project)
}

function filterTeacherActivityInList(keywords = [], orderBy = 'id', asc = true, excludedTypes = [], tagsList = []) {

    let expression = ''
    for (let i = 0; i < keywords.length; i++) {
        expression += '(?=.*'
        expression += keywords[i].toUpperCase()
        expression += ')'
    }

    let regExp = new RegExp(expression);
    let list = Main.getClassroomManager()._myTeacherActivities.filter(x => regExp.test(x.title.toUpperCase()));

    // filter the list
    if (tagsList.length > 0) {
        list = list.filter(element => {
            if (element.hasOwnProperty('tags') == false) return false;
            let elementsTag = element.tags;
            // check if at least one tag is selected

            let found = false;

            // check if all taglist's tag are in the element tags
            for (let i = 0; i < tagsList.length; i++) {
                if (elementsTag.includes(tagsList[i])) {
                    found = true;
                } else {
                    found = false;
                    break;
                }
            }
            return found;
        });
    }

    let listFiltered = list.filter(x => !excludedTypes.includes(x.type))

    if (asc) {
        return listFiltered.sort(function (a, b) {
            return a[orderBy] - b[orderBy];
        })
    } else {
        return listFiltered.sort(function (a, b) {
            return b[orderBy] - a[orderBy];
        })
    }
}

function filterSandboxInList(keywords = [], orderBy = 'id', asc = true) {

    let expression = ''
    for (let i = 0; i < keywords.length; i++) {
        expression += '(?=.*'
        expression += keywords[i].toUpperCase()
        expression += ')'

    }
    regExp = new RegExp(expression)
    let list = Main.getClassroomManager()._myProjects.filter(x => regExp.test(x.name.toUpperCase()) || regExp.test(x.description.toUpperCase()))
    if (asc) {
        return list.sort(function (a, b) {
            return a[orderBy] - b[orderBy];
        })
    } else {
        return list.sort(function (a, b) {
            return b[orderBy] - a[orderBy];
        })
    }

}

function resetDisplayClassroom() {
    // Clean the display
    document.querySelector('#body-table-teach').innerHTML = '';
    document.querySelector('#add-student-container').innerHTML = '';
    document.querySelector('#export-class-container').innerHTML = '';
    document.querySelector('#header-table-teach').innerHTML = '';
}

function getFirstLetterOfPseudo(pseudo) {
    let firstLetter = pseudo.match(/[a-zA-Z]/);
    try {
        if (firstLetter) {
            return firstLetter[0].toUpperCase();
        } else {
            let firstNumber = pseudo.match(/[0-9]/);
            return 'abcdefghij'[firstNumber];
        }
    } catch (error) {
        return 'A';
    }
}

/**
 * Display the teacher dashboard in the classroom tab
 * @param {array} students - Array of students in a classroom
 */
function displayStudentsInClassroom(students, link=false) {
    if (link && link != $_GET('option')) {
        return;
    }
    // Clean the display
    document.querySelector('#body-table-teach').innerHTML = '';
    document.querySelector('#add-student-container').innerHTML = '';
    document.querySelector('#export-class-container').innerHTML = '';
    
    // Display the classroom name
    const classroomName = getClassroomInListByLink(ClassroomSettings.classroom)[0].classroom.name;
    const classroomId = getClassroomInListByLink(ClassroomSettings.classroom)[0].classroom.id;
    const reducedclassroomName = classroomName.length > 16 ? `${classroomName.substring(0, 16)}...` : classroomName;

    document.querySelector('#header-table-teach').innerHTML = `<th class="table-title" style="max-width: 250px; font-size: 14pt; text-align: left; height: 3em;" data-bs-toggle="tooltip" title="${classroomName}" role="columnheader" aria-label="Nom de la classe">${reducedclassroomName}</th>`;

    $('#is-monochrome').attr('data-link', link);
    $('#is-anonymised').attr('data-link', link);

    // get the current classroom index of activities
    let arrayIndexesActivities = listIndexesActivities(students);

    students.forEach(element => {
        // reorder the current student activities to fit to the classroom index of activities
        let arrayActivities = reorderActivities([...element.activities, ...element.courses], arrayIndexesActivities);
        let pseudo = element.user.pseudo;
        let html = '';

        // shorten the current student nickname to fit in the table
        if (element.user.pseudo.length > 10) {
            pseudo = element.user.pseudo.slice(0, 9) + "&#8230;";
        }

        // Add demoStudent's head table cell if it's the current student
        if (element.user.pseudo == demoStudentName) {
            html = `<tr>
                <th class="username" data-student-id="${element.user.id}" role="rowheader" aria-label="Élève ${element.user.pseudo}">
                    <div class="user-cell-container">
                        <img class="propic" src="${_PATH}assets/media/alphabet/${getFirstLetterOfPseudo(element.user.pseudo)}.png" alt="Photo de profil de ${element.user.pseudo}">
                        <div class="user-cell-username" id="username-${element.user.id}" title="${element.user.pseudo}">${pseudo}</div>
                          <div class="dropdown">
                            <i class="classroom-clickable line_height34 fas fa-exchange-alt" 
                               type="button" 
                               id="dropdown-studentItem-${element.user.id}" 
                               data-bs-toggle="dropdown" 
                               aria-haspopup="true" 
                               aria-expanded="false"
                               tabindex="0"
                               role="button"
                               aria-label="Actions sur l'élève ${element.user.pseudo}"
                               onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); $(this).dropdown('toggle'); }">
                            </i>
                            <div class="dropdown-menu" 
                                 role="menu" 
                                 aria-labelledby="dropdown-studentItem-${element.user.id}">
                                <button id="mode-apprenant" 
                                    class="dropdown-item classroom-clickable col-12" 
                                    onclick="modeApprenant()" 
                                    role="menuitem"
                                    tabindex="0"
                                    aria-labelledby="username-${element.user.id}"
                                    onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }"
                                    data-i18n="classroom.profil.switchMode">Mode apprenant</button>
                            </div>
                        </div>
                    </div>
                </th>`;
        // Add the current student head table cell
        } else {
            html = `<tr>
                <th class="username" data-student-id="${element.user.id}" role="rowheader" aria-label="Élève ${element.user.pseudo}">
                    <div class="user-cell-container">
                        <img class="propic" src="${_PATH}assets/media/alphabet/${getFirstLetterOfPseudo(element.user.pseudo)}.png" alt="Photo de profil de ${element.user.pseudo}">
                        <div class="user-cell-username" id="username-${element.user.id}" title="${element.user.pseudo}">${pseudo}</div>`
            if (!UserManager.getUser().isFromGar) {
                html += `<div class="dropdown">
                    <i class="classroom-clickable line_height34 fas fa-cog" 
                       type="button" 
                       id="dropdown-studentItem-${element.user.id}" 
                       data-bs-toggle="dropdown" 
                       aria-haspopup="true" 
                       aria-expanded="false"
                       tabindex="0"
                       role="button"
                       aria-label="Actions sur l'élève ${element.user.pseudo}"
                       onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); $(this).dropdown('toggle'); }">
                    </i>
                    <div class="dropdown-menu" 
                         role="menu" 
                         aria-labelledby="dropdown-studentItem-${element.user.id}">
                        <div class="col-12 pwd-display-stud" 
                            role="menuitem"
                            tabindex="0"
                            aria-labelledby="username-${element.user.id}">
                            <div data-i18n="classroom.classes.panel.password">Votre mot de passe :</div> 
                            <span class="masked" id="masked">${element.pwd}</span>
                            <i class="classroom-clickable fas fa-low-vision switch-pwd ms-2" 
                               role="button"
                               tabindex="0"
                               aria-label="Afficher ou masquer le mot de passe de ${element.user.pseudo}"
                               onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                            </i>
                        </div>
                        <button class="classroom-clickable col-12 dropdown-item" 
                            role="menuitem"
                            tabindex="0"
                            onclick="copyPinToClipboard('${element.pwd}')" 
                            onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }"
                            aria-label="Copier le mot de passe de ${element.user.pseudo}"
                            data-i18n="classroom.profil.copyPinStudent">Copier le mot de passe</button> 
                        <button class="modal-student-password classroom-clickable col-12 dropdown-item" 
                            role="menuitem"
                            tabindex="0"
                            data-student-id="${element.user.id}" 
                            onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }"
                            aria-label="Régénérer le mot de passe de ${element.user.pseudo}"
                            data-i18n="classroom.classes.panel.resetPassword">Régenérer le mot de passe</button>
                        <button class="classroom-clickable col-12 dropdown-item" 
                            role="menuitem"
                            tabindex="0"
                            aria-label="Modifier le pseudo de ${element.user.pseudo}"
                            onclick="changePseudoModal(${element.user.id})"
                            onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }"
                            data-i18n="classroom.classes.panel.editNickname">Modifier le pseudo</button>
                        <button class="dropdown-item modal-student-delete classroom-clickable col-12" 
                            role="menuitem"
                            tabindex="0"
                            data-i18n="classroom.classes.panel.delete" 
                            data-student-id="${element.user.id}"
                            aria-label="Supprimer l'élève ${element.user.pseudo}"
                            onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">Supprimer</button>
                    </div>
                </div>
                </div>`;
            }
            html += `</th>`;
        }

        let activityNumber = 1;
        // Display the current student activities in the dashboard

        // Loop in the classroom activities index (with ids) to generate the dashboard table header and body
        for (let i = 0; i < arrayIndexesActivities.length; i++) {
            const currentActivity = arrayActivities[i];
            let isCourse = false;
            if (currentActivity && currentActivity.hasOwnProperty('courseState')) {
                isCourse = true;
            }
            
            if (element.user.pseudo == demoStudentName) {
                let thModular = "";
                let optionContent = "";
                if (!isCourse) {
                    thModular = `<th data-bs-toggle="tooltip" class="border-header-class" data-bs-placement="top" title="${arrayIndexesActivities[i].title.replaceAll('"', " ")}" role="columnheader" aria-label="Activité ${activityNumber}">`;
                    optionContent = `<div class="ms-5" style="border-bottom:solid 2px black;">
                                        <b>${ arrayIndexesActivities[i].title }</b>
                                    </div>
                                    <button class="classroom-clickable col-12 dropdown-item" 
                                        role="menuitem"
                                        tabindex="0"
                                        onclick="activityWatch(${arrayIndexesActivities[i].id})"
                                        aria-label="Voir l'activité '${arrayIndexesActivities[i].title}'"
                                        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                                        <i class="fas fa-eye" aria-hidden="true"></i> <span data-i18n="classroom.classes.panel.seeActivity">Voir l'activité</span>
                                    </button>
                                    <button class="classroom-clickable col-12 dropdown-item" 
                                        role="menuitem"
                                        tabindex="0"
                                        onclick="activityModify(${arrayIndexesActivities[i].id})"
                                        aria-label="Modifier l'activité '${arrayIndexesActivities[i].title}'"
                                        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                                        <i class="fas fa-pen" aria-hidden="true"></i> <span data-i18n="classroom.classes.panel.editActivity">Modifier l'activité</span>
                                    </button>
                                    <button class="classroom-clickable col-12 dropdown-item" 
                                        role="menuitem"
                                        tabindex="0"
                                        onclick="attributeActivity(${arrayIndexesActivities[i].id},${arrayIndexesActivities[i].reference})"
                                        aria-label="Modifier l'attribution de l'activité '${arrayIndexesActivities[i].title}'"
                                        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                                        <i class="fas fa-user-alt" aria-hidden="true"></i> <span data-i18n="classroom.classes.panel.editAttribution">Modifier l'attribution</span>
                                    </button>
                                    <button class="dropdown-item classroom-clickable col-12" 
                                        role="menuitem"
                                        tabindex="0"
                                        onclick="undoAttributeActivity(${arrayIndexesActivities[i].reference},'${Main.getClassroomManager().getClassroomIdByLink(ClassroomSettings.classroom)}')"
                                        aria-label="Retirer l'attribution de l'activité '${arrayIndexesActivities[i].title}'"
                                        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                                        <i class="fas fa-trash-alt" aria-hidden="true"></i> <span data-i18n="classroom.classes.panel.removeAttribution">Retirer l'attribution</span>
                                    </button>`;
                
                    $('#header-table-teach').append(`
                        ${thModular}
                        <div class="dropdown dropdown-act m-auto" style="width:30px;">
                            <div id="dropdown-act-${activityNumber}" 
                                 data-bs-toggle="dropdown" 
                                 aria-haspopup="true" 
                                 aria-expanded="false"
                                 role="button"
                                 tabindex="0"
                                 aria-label="Menu d'actions pour l'activité '${arrayIndexesActivities[i].title}'"
                                 onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); $(this).dropdown('toggle'); }">
                                    <span class="span-act">Act.</br>n°${ activityNumber }</span>
                                    <i style="display:none;font-size:2em;" class="fa fa-cog i-act" aria-hidden="true"></i>
                                    <div class="dropdown-menu" 
                                         role="menu"
                                         aria-labelledby="dropdown-act-${activityNumber}" 
                                         data-id="${arrayIndexesActivities[i].id}" 
                                         style="text-transform: none;">
                                    ${optionContent}
                                </div>
                            </div>
                        </th>`
                    );
                    activityNumber++;
                } else {
                    let tableLength = `colspan="${currentActivity.activitiesReferences.length}"`;
                    let thModular = `<th data-bs-toggle="tooltip" class="border-header-class" ${tableLength} data-bs-placement="top" title="${currentActivity.course.title}" role="columnheader" aria-label="Parcours ${activityNumber}">`;
                    optionContent = `
                    <div class="ms-5" style="border-bottom:solid 2px black;">
                        <b>${currentActivity.course.title}</b>
                    </div>
                    
                    <button class="classroom-clickable col-12 dropdown-item" 
                        role="menuitem"
                        tabindex="0"
                        onclick="coursesManager.courseOverview(${currentActivity.course.id})"
                        aria-label="Voir le parcours '${currentActivity.course.title}'"
                        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                        <i class="fas fa-eye" aria-hidden="true"></i> <span data-i18n="courses.show">Voir le parcours</span>
                    </button>
                    <button class="classroom-clickable col-12 dropdown-item" 
                        role="menuitem"
                        tabindex="0"
                        onclick="coursesManager.updateCourse(${currentActivity.course.id})"
                        aria-label="Modifier le parcours '${currentActivity.course.title}'"
                        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                        <i class="fas fa-pen" aria-hidden="true"></i> <span data-i18n="courses.update">Modifier le parcours</span>
                    </button>
                    <button class="classroom-clickable col-12 dropdown-item" 
                        role="menuitem"
                        tabindex="0"
                        onclick="coursesManager.attributeCourse(${currentActivity.course.id}, ${currentActivity.reference})"
                        aria-label="Modifier l'attribution du parcours '${currentActivity.course.title}'"
                        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                        <i class="fas fa-user-alt" aria-hidden="true"></i> <span data-i18n="classroom.classes.panel.editAttribution">Modifier l'attribution</span>
                    </button>
                    <button class="dropdown-item classroom-clickable col-12" 
                        role="menuitem"
                        tabindex="0"
                        onclick="coursesManager.undoAttribution(${currentActivity.course.id}, ${currentActivity.reference}, ${classroomId})"
                        aria-label="Retirer l'attribution du parcours '${currentActivity.course.title}'"
                        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                        <i class="fas fa-trash-alt" aria-hidden="true"></i> <span data-i18n="classroom.classes.panel.removeAttribution">Retirer l'attribution</span>
                    </button>`;
                
                    $('#header-table-teach').append(`
                        ${thModular}
                        <div class="dropdown dropdown-act m-auto" style="width:30px;">
                            <div id="dropdown-act-${activityNumber}" 
                                 data-bs-toggle="dropdown" 
                                 aria-haspopup="true" 
                                 aria-expanded="false"
                                 role="button"
                                 tabindex="0"
                                 aria-label="Menu d'actions pour le parcours '${currentActivity.course.title}'"
                                 onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); $(this).dropdown('toggle'); }">
                                    <span class="span-act">Par.</br>n°${ activityNumber }</span>
                                    <i style="display:none;font-size:2em;" class="fa fa-cog i-act" aria-hidden="true"></i>
                                    <div class="dropdown-menu" 
                                         role="menu"
                                         aria-labelledby="dropdown-act-${activityNumber}" 
                                         data-id="" 
                                         style="text-transform: none;">
                                    ${optionContent}
                                </div>
                            </div>
                        </th>`
                    );
                    activityNumber++;
                }
            }

            // Display the current student activities in the dashboard
            if (currentActivity && !isCourse) {
                html += renderActivityDashboard(currentActivity);
            } else if (isCourse) {
                if (currentActivity.activitiesReferences) {
                    for(let j = 0; j < currentActivity.activitiesReferences.length; j++) {
                        let tempActivity = findOneActivityLinkUserByReference(currentActivity.activitiesReferences[j], element);
                        if (tempActivity) {
                            html += renderActivityDashboard(tempActivity);
                        }
                        
                    }
                }
                            } else {
                    if (arrayIndexesActivities[i].isCourse) {
                        for (let k = 0; k < arrayIndexesActivities[i].courseLength; k++) {
                            html += `<td class="no-activity bilan-cell" role="cell" aria-label="Pas d'activité pour cette session"></td>`;
                        }
                    } else {
                        html += `<td class="no-activity bilan-cell" role="cell" aria-label="Pas d'activité pour cette session"></td>`;
                    }
                }
        }

        // addition of 6 "empty" cells at the end of the current table row
        for (let i = 0; i < 6; i++) {
            html += '<td class="no-activity bilan-cell" role="cell" aria-label="Pas d\'activité"></td>';
        }
        // end of the current table row
        html += '</tr>';
        $('#body-table-teach').append(html).localize();
        $('[data-bs-toggle="tooltip"]').tooltip()
    });
    
    appendAddStudentButton();
    // get classroom settings from localstorage
    let settings = getClassroomDisplaySettings(link);
    
    if (!settings) {
        settings = {}; // Initialisez settings comme un objet vide s'il est undefined
    }

    if (!('monochrome' in settings)) {
        settings['monochrome'] = false;
    }

    if (settings['monochrome']) {
        $('#body-table-teach').addClass('is-monochrome')
        $('#legend-container').addClass('is-monochrome')
        $('#is-monochrome').prop('checked', true);          
    } else {
        $('#body-table-teach').removeClass('is-monochrome')
        $('#legend-container').removeClass('is-monochrome')
        $('#is-monochrome').prop('checked', false);
    }
    
    if (settings['anonymised']) {
        anonymizeStudents()
        $('#is-anonymised').prop('checked', true);
    } else {
        $('#is-anonymised').prop('checked', false);
    }

    $('#export-class-container').append(`<button id="download-csv" class="btn c-btn-tertiary" onclick="openDownloadCsvModal()" role="button" tabindex="0" aria-label="Exporter les données de la classe en format CSV" onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }"><i class="fa fa-download" aria-hidden="true"></i><span class="ms-1" data-i18n="classroom.activities.exportCsv">Exporter CSV</span></button>`).localize();

    $('#header-table-teach').append(`<th class="add-activity-th" colspan="7" role="columnheader"> 
        <button class="btn c-btn-primary dashboard-activities-teacher" 
                onclick="pseudoModal.openModal('add-activity-modal')" 
                role="button"
                tabindex="0"
                aria-label="Ajouter une nouvelle activité à la classe"
                onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }"
                data-i18n="classroom.activities.addActivity">Ajouter une activité</button>
    </th>`).localize();

    // add four empty divs for monochrome styling
    $('#body-table-teach .bilan-cell').html(`<div class="monochrome-grade-div"></div><div class="monochrome-grade-div"></div><div class="monochrome-grade-div"></div><div class="monochrome-grade-div"></div>`);

    $('#classroom-panel-table-container table .dropdown').on('show.bs.dropdown', (event) => {
        let classroomTable = event.target.closest('table');
        classroomTable.classList.add('dropdowns-opened');
        $(classroomTable).find('tr').addClass('non-dropdown');
        event.target.closest('tr').classList.remove('non-dropdown');
    });
    
    $('#classroom-panel-table-container table .dropdown').on('hidden.bs.dropdown', (event) => {
        let classroomTable = event.target.closest('table');
        classroomTable.classList.remove('dropdowns-opened');
        $(classroomTable).find('tr').removeClass('non-dropdown');
    });
}

function copyPinToClipboard(pin) {
    navigator.clipboard.writeText(pin).then(function() {
        displayNotification('#notif-div', "classroom.profil.codeCopied", "success");
    }).catch(function(err) {
        console.error('Erreur lors de la copie dans le presse-papiers:', err);
        displayNotification('#notif-div', "classroom.notif.copyError", "error");
    });
}

function renderActivityDashboard(currentActivity) {
    const formatedTimePast = typeof currentActivity.timePassed == 'undefined' ? '' : currentActivity.timePassed == 0 ? '' : `<br><em>${i18next.t("classroom.classes.panel.timePassed") + formatDuration(currentActivity.timePassed)}</em><br><em>${i18next.t("classroom.activities.numberOfTries")} ${currentActivity.tries}</em>`;
    
    // Label for the activity cell
    const activityStatus = statusActivity(currentActivity, false);
    const activityTitle = currentActivity.activity.title;
    const activityType = getTranslatedActivityName(currentActivity.activity.type);
    const dueDate = i18next.t("classroom.classes.panel.dueBy") + " " + formatDay(currentActivity.dateEnd);
    const timeInfo = formatedTimePast ? formatedTimePast : '';
    const ariaLabel = `${activityTitle} - ${activityType} - ${activityStatus} - ${dueDate}${timeInfo}`;
    
    let html = `<td class="${statusActivity(currentActivity, true, formatedTimePast)} bilan-cell classroom-clickable" 
        tabindex="0"
        role="cell"
        data-state="${activityStatus}" 
        data-id="${currentActivity.id}" 
        data-bs-toggle="tooltip" 
        data-bs-html="true" 
        data-bs-placement="top" 
        aria-label="${ariaLabel}"
        title="<b>${activityTitle}</b>
        <br>
        <em>${activityType}</em></br>
        <em>${dueDate}</em>${formatedTimePast}"
        onclick="coursesManager.openActivity(${currentActivity.id})"
        onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }"
        >
    </td>`;
    
    return html;
}


function findOneActivityLinkUserByReference(reference, student) {
    let activity = null;
    student.activities.forEach(act => {
        if (act.reference == reference) {
            activity = act;
        }
    })
    return activity;
}

function appendAddStudentButton() {
    $('#body-table-teach').append('<tr role="row"><td role="cell" colspan="100%"><button id="add-student-dashboard-panel" class="btn c-btn-primary" aria-label="Ajouter des apprenants à la classe"><span data-i18n="classroom.activities.addLearners">Ajouter des apprenants</span> <i class="fas fa-plus" aria-hidden="true"></i></button></td></tr>').localize();
}

$('body').on('click', '.switch-pwd', function (event) {
    $(this).parent().find('span').toggleClass('masked');
    event.stopPropagation();
})

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function displayNotification(div, message, status, options = '{}', timer = 20000) {
    let randId = Math.floor(Math.random() * Math.floor(10000))
    // get i18n text
    let html = "";
    let i18nText = i18next.t(message);
    
    let ariaRole = 'status';
    let ariaLive = 'polite';
    let ariaLabel = '';
    
    switch(status) {
        case 'error':
            ariaRole = 'alert';
            ariaLive = 'assertive';
            ariaLabel = 'Erreur : ';
            break;
        case 'warning':
            ariaRole = 'status';
            ariaLive = 'assertive';
            ariaLabel = 'Attention : ';
            break;
        case 'success':
            ariaRole = 'status';
            ariaLive = 'polite';
            ariaLabel = 'Succès : ';
            break;
        default: // info
            ariaRole = 'status';
            ariaLive = 'polite';
            ariaLabel = 'Information : ';
    }

    if (i18nText == message) {
        html = `<div id='notif-${randId}' onclick="closeOnClick('notif-${randId}')" class="vitta-notif status-${status}" role="${ariaRole}" aria-live="${ariaLive}" aria-atomic="true" aria-label="${ariaLabel}${message}">
                    <span class="notification-content">${message}</span>
                    <div class="vitta-notif-exit-btn" role="button" tabindex="0" aria-label="Fermer la notification" onkeydown="if(event.key==='Enter'||event.key===' '){closeOnClick('notif-${randId}');}">
                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                    </div>
                </div>`;
    } else {
        html = `<div id='notif-${randId}' onclick="closeOnClick('notif-${randId}')" class="vitta-notif status-${status}" data-i18n="${message}" data-i18n-options=${options} role="${ariaRole}" aria-live="${ariaLive}" aria-atomic="true" aria-label="${ariaLabel}">
                    <span class="notification-content"></span>
                    <div class="vitta-notif-exit-btn" role="button" tabindex="0" aria-label="Fermer la notification" onkeydown="if(event.key==='Enter'||event.key===' '){closeOnClick('notif-${randId}');}">
                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                    </div>
                </div>`
    }

    //let html = `<div id='notif-` + randId + `' class="vitta-notif status-` + status + `" data-i18n="` + message + `" data-i18n-options=` + options + `><div class="vitta-notif-exit-btn"><i class="fa fa-times-circle"></i></div></div>`
    $(div).append(html)
    $(div).localize()

    notifyA11y(i18nText, status);

    setTimeout(function () {
        if ($('#notif-' + randId).length > 0) {
            $('#notif-' + randId).remove()
        }
    }, timer);
}

function closeOnClick(id) {
    document.getElementById(id).remove()
}


$('body').on('click', '.vitta-notif-exit-btn', function () {
    $(this).parent().remove()
})

function setStudentsSelect() {
    ClassroomSettings.studentList = ''
    let classrooms = Main.getClassroomManager()._myClasses
    classrooms.forEach(function (classroom) {
        classroom.students.forEach(function (student) {
            ClassroomSettings.studentList += `<input type="checkbox" class=" col-12 checkStudent-sandbox-${student.user.id}" value="${student.user.id}" id="student-${student.user.id}" aria-label="Sélectionner l'élève ${student.user.pseudo} de la classe ${classroom.classroom.name}">${student.user.pseudo} from ${classroom.classroom.name}</option>`
        })
    })
}

function actualizeStudentActivities(activity, correction) {
    let tempActivities = Main.getClassroomManager()._myActivities.newActivities.filter(x => x.id !== activity.id)
    Main.getClassroomManager()._myActivities.newActivities = tempActivities

    if (correction == 1) {
        Main.getClassroomManager()._myActivities.currentActivities.push(activity)
    } else {
        Main.getClassroomManager()._myActivities.doneActivities.push(activity)
    }

}

function addStudentRow(pseudo, studentId = false, isNotDeletable) {
    return `<li data-pseudo="${pseudo}" data-id="${studentId}" class="row align-items-center my-1 " role="listitem" aria-label="Élève ${pseudo}">
        <div class="col-2">
            <img class="w-100 propic pic-width" src="${_PATH}assets/media/alphabet/` + getFirstLetterOfPseudo(pseudo) + `.png" alt="Photo de profil de ${pseudo}">
        </div>
        <div class="col" role="text" aria-label="Nom de l'élève">` + pseudo + `</div>
        ${isNotDeletable ? '' : `<div class="col-2">
            <button type="button" class="btn btn-danger remove-student h-50" data-bs-toggle="tooltip" data-bs-placement="top" role="button" tabindex="0" aria-label="Supprimer l'élève ${pseudo}" onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.stopPropagation(); this.click(); }">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>`}
    </li>`;
}

/**
 * Format a duration provided in seconds into a "h m s" format
 * @param {integer} secs - Number of seconds
 * @returns {string} - The formated duration or an empty string if the provided argument is 0
 */
function formatDuration(secs) {
    const sec_num = parseInt(secs, 10);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;
    const displayedUnits = ['h', 'm', 's'];
    let firstFilled = false;

    return [hours,minutes,seconds]
    .map((v, i) => {
        if (!firstFilled) {
            firstFilled = v > 0 ? true : false;
            return v > 0 ? v + displayedUnits[i] : '';
        } else {
            return ` ${v + displayedUnits[i]}`;
        }
    })
    .join('');
}

/**
 * Password display toggler : if an element that has the class password-display-toggler is clicked, it show/hide the password in the adjacent input element
 */
document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
    if(e.target.classList.contains('password-display-toggler')){
        e.stopPropagation();
        for(let childElt of e.target.parentNode.childNodes){
            if(childElt.tagName == 'INPUT'){
                if(childElt.getAttribute('type') == 'password'){
                    childElt.setAttribute('type', 'text');
                }else{
                    childElt.setAttribute('type', 'password');
                }
            }
        }
    }
});

/**
 * Mutation observer that remove a tooltip from the dom if its related element is deleted (to avoid an issue where the tooltip remains in place and never disappears)
 */
const deletionObserver = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		mutation.removedNodes.forEach(function(removed_node) {
			browseRemovedNodes(removed_node);
		});
	});
});
deletionObserver.observe(document.querySelector("body"), { subtree: true, childList: true });

/**
 * Check if the provided element and all its children has a displayed tooltip to remove
 * @param {DOM Element} removed_node - The DOM Element to browse
 */
function browseRemovedNodes(removed_node) {
    if (removed_node.getAttribute && removed_node.getAttribute('data-bs-toggle') == 'tooltip') {
        const toolTipId = removed_node.getAttribute('aria-describedby');
        if (toolTipId && document.getElementById(toolTipId)) {
            document.getElementById(toolTipId).remove();
        }
    }
    if (removed_node.childNodes) {
        for (let child of removed_node.childNodes) {
            browseRemovedNodes(child);
        }
    }
}

/**
 * Open teacher account panel
 */
function openTeacherAccountPanel(){
    pseudoModal.closeModal('settings-teacher-modal');
    getAndPopulateAccountInfo();
    navigatePanel('classroom-dashboard-account-panel-teacher', 'dashboard-profil-teacher', null);
}

/**
 * Get all the relevant teacher info and fill the associated form fields in teacher account panel
 */
function getAndPopulateAccountInfo(){
    let userInfo = {
        firstname: UserManager.getUser().firstname ?? '',
        lastname: UserManager.getUser().surname ?? '',
        email: UserManager.getUser().isRegular ?? '',
        teacherId: UserManager.getUser().id
    };
    populateAccountInfo(userInfo);
}

/**
 * Fill all the account form fields with the provided datas
 * @param {object} data - fields data from the database
 */
function populateAccountInfo(data){
    let firstNameInputElt = document.getElementById('profile-form-first-name'),
    lastNameInputElt = document.getElementById('profile-form-last-name'),
    emailInputElt = document.getElementById('profile-form-email'),
    teacherIdInputElt = document.getElementById('profile-form-teacher-id');

    firstNameInputElt.value = data.firstname;
    lastNameInputElt.value = data.lastname;
    emailInputElt.value = data.email;
    teacherIdInputElt.value = data.teacherId;
}

/**
 * Update teacher form submit listener
 */
document.querySelector('#validate-profile-update').addEventListener('click', () => {
    pseudoModal.openModal('profile-update-password-confirm');
});

// Initialize form accessibility when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFormAccessibility();
    initializeTableAccessibility();
    initializeModalAccessibility();
});

document.querySelector('body').addEventListener('click', (e) => {
    if (e.target.id == 'saveProfileUpdate') {
        const userPassword = document.querySelector('#current_password_prompt').value;
        if (!userPassword.length) {
            displayNotification('#notif-div', "classroom.notif.passwordMissing", "error");
            return;
        }
        document.querySelector('#current-password').value = userPassword;
        document.querySelector('#update-teacher-account-form').dispatchEvent(new Event('submit'));
    }
});


document.querySelector('#update-teacher-account-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    if(teacherAccountUpdateFormCheck(data)){
        Main.getClassroomManager().updateTeacherAccount(data).then((response) => {
            if(response.isUserUpdated){
                document.getElementById('profile-form-password').value = '';
                document.getElementById('profile-form-confirm-password').value = '';
                displayNotification('#notif-div', "classroom.notif.accountUpdated", "success");
                if(data.get('email') != UserManager.getUser().isRegular){
                    displayNotification('#notif-div', "classroom.notif.emailUpdated", "success");
                }
                pseudoModal.closeModal('profile-update-password-confirm');
                UserManager.init();
            }else{
                if(response.errorType){
                    switch (response.errorType) {
                        case 'unknownUser':
                            displayNotification('#notif-div', "classroom.notif.unknownUser", "error");
                            break;
                    
                        default:
                            break;
                    }
                }
                if(response.errors){
                    for(let error in response.errors){
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                    }
                }
            }
            document.querySelector('#current-password').value = '';
            document.querySelector('#current_password_prompt').value = '';
        });
    }
});

/**
 * Check if the teacher's account update form values are correct
 * @returns {boolean} - true if check ok, false otherwise
 */
function teacherAccountUpdateFormCheck(formData){
    
    let formValues = {
        'firstname': {
            value: formData.get('first-name'),
            id: 'profile-form-first-name'
        },
        'surname': {
            value: formData.get('last-name'),
            id: 'profile-form-last-name'
        },
        'email': {
            value: formData.get('email'),
            id: 'profile-form-email'
        },
        'password': {
            value: formData.get('password'),
            id: 'profile-form-password'
        },
        'confirmPassword': {
            value: formData.get('confirm-password'),
            id: 'profile-form-confirm-password'
        }
    },
    errors = [];
    
    for(let input in formValues){
        let currentElt = document.getElementById(formValues[input].id);
        if(currentElt.classList.contains('form-input-error')){
            currentElt.classList.remove('form-input-error');
            currentElt.removeAttribute('aria-invalid');
            currentElt.removeAttribute('aria-describedby');
            
            // Remove error message element if it exists
            const errorId = `${formValues[input].id}-error`;
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    if(!formValues.firstname.value.length == 0 && formValues.firstname.value.length < 2){
        errors.push('firstNameTooShort');
        showFormInputError(formValues.firstname.id);
    }
    
    if(!formValues.surname.value.length == 0 && formValues.surname.value.length < 2){
        errors.push('lastNameTooShort');
        showFormInputError(formValues.surname.id);
    }

    if(!formValues.email.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)){
        errors.push('invalidEmail');
        showFormInputError(formValues.email.id);
    }

    if(!formValues.password.value.length == 0 && !formValues.password.value.length > 7){
        errors.push('invalidPassword');
        showFormInputError(formValues.password.id);
    }

    if(formValues.password.value != formValues.confirmPassword.value){
        errors.push('passwordAndConfirmMismatch');
        showFormInputError(formValues.password.id);
        showFormInputError(formValues.confirmPassword.id);
    }

    if(errors.length){
        for(let error of errors){
            displayNotification('#notif-div', `classroom.notif.${error}`, "error");
        }
        return false;
    }else{
        return true;
    }
}

/**
 * Add the error class on input form
 * @param {string} id - the id of the form input
 */
function showFormInputError(id){
    const element = document.getElementById(id);
    element.classList.add('form-input-error');
    element.setAttribute('aria-invalid', 'true');
    
    // Add error message if not already present
    if (!element.getAttribute('aria-describedby')) {
        const errorId = `${id}-error`;
        element.setAttribute('aria-describedby', errorId);
        
        // Create error message element if it doesn't exist
        if (!document.getElementById(errorId)) {
            const errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'form-error-message';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            element.parentNode.appendChild(errorElement);
        }
    }
}

/**
 * Initialize accessibility features for form elements
 */
function initializeFormAccessibility() {
    // Add aria-required to required form fields
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        if (!field.hasAttribute('aria-required')) {
            field.setAttribute('aria-required', 'true');
        }
    });
    
    // Add aria-describedby to form fields with help text
    const helpTexts = document.querySelectorAll('.form-text, .help-text');
    helpTexts.forEach(help => {
        const fieldId = help.getAttribute('data-field-id');
        if (fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                const currentDescribedBy = field.getAttribute('aria-describedby');
                const helpId = help.id || `help-${fieldId}`;
                help.id = helpId;
                field.setAttribute('aria-describedby', currentDescribedBy ? `${currentDescribedBy} ${helpId}` : helpId);
            }
        }
    });
}

/**
 * Initialize accessibility features for tables
 */
function initializeTableAccessibility() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.hasAttribute('role')) {
            table.setAttribute('role', 'table');
        }
        
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.className = 'sr-only';
            caption.textContent = 'Tableau de données';
            table.insertBefore(caption, table.firstChild);
        }
    });
    
    const theads = document.querySelectorAll('thead');
    theads.forEach(thead => {
        if (!thead.hasAttribute('role')) {
            thead.setAttribute('role', 'rowgroup');
        }
    });
    
    const tbodies = document.querySelectorAll('tbody');
    tbodies.forEach(tbody => {
        if (!tbody.hasAttribute('role')) {
            tbody.setAttribute('role', 'rowgroup');
        }
    });
}

/**
 * Initialize accessibility features for modals
 */
function initializeModalAccessibility() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (!modal.hasAttribute('role')) {
            modal.setAttribute('role', 'dialog');
        }
        if (!modal.hasAttribute('aria-modal')) {
            modal.setAttribute('aria-modal', 'true');
        }
        
        const modalTitle = modal.querySelector('.modal-title, h1, h2, h3, h4, h5, h6');
        if (modalTitle && !modalTitle.id) {
            modalTitle.id = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
        }
        if (modalTitle && modalTitle.id && !modal.hasAttribute('aria-labelledby')) {
            modal.setAttribute('aria-labelledby', modalTitle.id);
        }
    });
    
    const modalButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
    modalButtons.forEach(button => {
        if (!button.hasAttribute('aria-haspopup')) {
            button.setAttribute('aria-haspopup', 'dialog');
        }
    });
}

/**
 * Refresh the current classroom every 15 seconds if we are in the classroom dashboard
 */
class DashboardAutoRefresh {
    constructor(refreshInterval) {
        this.isRefreshing = false;
        this.refreshInterval = refreshInterval;
    }

    refresh() {
        if($_GET('panel') == 'classroom-table-panel-teacher' && $_GET('option')){
            this.isRefreshing = true;
            let previousClassroomState, newClassroomState;
            if (getClassroomInListByLink($_GET('option'))[0]) {
                previousClassroomState = {
                    data: JSON.stringify(getClassroomInListByLink($_GET('option'))[0].students),
                    link: $_GET('option')
                };
            }
            Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
                if ($_GET('option') == previousClassroomState.link) {
                    if (getClassroomInListByLink($_GET('option'))[0]) {
                        newClassroomState = JSON.stringify(getClassroomInListByLink($_GET('option'))[0].students);
                    }
                    // Only refresh the classroom if it has changed
                    if (previousClassroomState.data != newClassroomState){
                        if (getClassroomInListByLink($_GET('option'))[0]) {
                            let students = getClassroomInListByLink($_GET('option'))[0].students;
                            displayStudentsInClassroom(students);
                        }
                    }
                }
            });
            setTimeout(() => { this.refresh() }, this.refreshInterval);
        } else {
            this.isRefreshing = false;
        }
    }

    refreshLater() {
        if (!this.isRefreshing){
            this.isRefreshing = true;
            setTimeout(() => { this.refresh() }, this.refreshInterval);
        }
    }
}

const dashboardAutoRefresh = new DashboardAutoRefresh(15000);