class CoursesManager {
    /**
     * Creates an instance of Courses.
     * @public
     */
    constructor() {
        this.myCourses = [];
        this.actualCourse = {
            id: null,
            state: null,
            link: null,
            activity: null
        };
        this.courseId = null;
        this.isUpdate = false;
        this.lastestCourse = null;
        this.coursesAsStudent = [];
        this.courseData = {
            courses: [],
            title: null,
            description: null,
            image: null,
            parameters: {
                duration: null,
                difficulty: null,
                language: null,
                license: null,
            }
        };
        this.dragula = null;
        this.resetCourseData = null;
        this.attributeData = {
            students: [],
            classrooms: [],
            courseId: null,
        };
    }

    init() {
        this.dragula = dragula();
        this.resetCourseData = () => {
            this.isUpdate = false;
            this.courseId = null;
            this.actualCourse = {
                id: null,
                state: null,
                link: null,
                activity: null
            };
            this.courseData = {
                courses: [],
                title: null,
                description: null,
                image: null,
                parameters: {
                    duration: null,
                    difficulty: null,
                    language: null,
                    license: null,
                }
            }
            this.refreshCourses();
        };

        if (UserManager.getUser()) {
            if (UserManager.getUser().isRegular) {
                this.actualizeCourse();
            }
        }

        $('#new-course-attribute').click(function () {
            pseudoModal.openModal('attribute-activity-modal');
            $("#attribute-activity-modal").localize();
        })
    }

    goToCreate(fresh = false) {
        if (fresh) {
            this.courseData.courses = [];
        }
        this.refreshCourses();
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    goToTitle() {
        if (this.courseData.title != null && this.courseData.description != null) {
            document.getElementById('course-title').value = this.courseData.title;
            document.getElementById('course-description').value = this.courseData.description;
        } else {
            document.getElementById('course-title').value = '';
            document.getElementById('course-description').value = '';
        }
        navigatePanel('classroom-dashboard-classes-new-course-title', 'dashboard-activities-teacher');
    }

    goToParameters() {
        if (this.courseData.parameters.duration != null) {
            document.getElementById('course-duration').value = this.courseData.parameters.duration;
        } else {
            document.getElementById('course-duration').value = 1;
        }
        if (this.courseData.parameters.difficulty != null) {
            document.getElementById('course-difficulty').value = this.courseData.parameters.difficulty;
        } else {
            document.getElementById('course-difficulty').value = '';
        }
        if (this.courseData.parameters.license != null) {
            document.getElementById('course-license').value = this.courseData.parameters.license;
        } else {
            document.getElementById('course-license').value = '';
        }
        navigatePanel('classroom-dashboard-classes-new-course-parameters', 'dashboard-activities-teacher');
    }

    goToAttribution(fromParameters = false) {
        if (fromParameters) {

            if (!this.isUpdate) {
                this._requestAddCourse().then((res) => {
                    if (res.hasOwnProperty('success')) {
                        this.lastestCourse = res.course.id;
                        navigatePanel('classroom-dashboard-classes-new-course-attribution', 'dashboard-activities-teacher');
                        this.resetCourseData();
                        this.actualizeCourse();
                    } else {
                        displayNotification('error', res.message);
                    }
                })
            } else {
                this._requestUpdateCourse().then((res) => {
                    if (res.hasOwnProperty('success')) {
                        this.lastestCourse = res.course.id;
                        navigatePanel('classroom-dashboard-classes-new-course-attribution', 'dashboard-activities-teacher');
                        this.resetCourseData();
                        this.actualizeCourse();
                    } else {
                        displayNotification('error', res.message);
                    }
                });
            }

        }
    }

    facultativeOptions() {
        $('#course-options').toggle()
        $('#i-course-options').toggleClass('fa-chevron-down')
        $('#i-course-options').toggleClass('fa-chevron-up')
    }

    refreshCourses() {
        const coursesDiv = document.getElementById('course-activities-content');
        coursesDiv.innerHTML = '';
        this.courseData.courses.forEach(course => {
            let activityImg = foldersManager.icons.hasOwnProperty(course.type) ? `<img class="list-item-img d-inline" src="${foldersManager.icons[course.type]}" alt="${course.type}" class="folder-icons">` : "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>";
            const courseDiv = document.createElement('div');
            courseDiv.classList.add('course-item-draggable');
            courseDiv.setAttribute('data-course-id', course.id);
            courseDiv.innerHTML = `
                <div class="preview-activity-in-courses">
                    ${activityImg}    
                    ${course.title}
                    <button class="btn btn-warning btn-sm btn-delete-course" onclick="coursesManager.deleteActivityFromCourse(${course.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>`;
            coursesDiv.appendChild(courseDiv);
        });
        if (coursesDiv.innerHTML == '') {
            coursesDiv.innerHTML = `<p data-i18n="courses.informationWhenEmpty" class="text-center my-2">Cliquer sur les boutons ci-dessus pour ajouter des activités au parcours.</p>`;
        } else {
            this.dragulaInit();
        }
        $("#course-activities-content").localize();
    }

    dragulaInit() {
        let activityFromCourses = document.getElementById('course-activities-content');
        if (this.dragula.containers.length > 0) {
            this.dragula.containers = [];
        }
        this.dragula = dragula([activityFromCourses]).on('drop', () => {
            setTimeout(() => {
                this.sortActualCourseArrayFromDiv();
            }, 150);
        });
    }


    showCoursePanel() {
        this.resetCourseData();
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    sortActualCourseArrayFromDiv() {
        const courseItems = document.querySelectorAll('div[class^=course-item-draggable]');
        this.courseData.courses = [];
        courseItems.forEach(item => {
            const courseId = parseInt(item.getAttribute('data-course-id'));
            this.courseData.courses.push(Main.getClassroomManager()._myTeacherActivities.find(activity => activity.id === courseId));
        });
    }

    addActivityToCourse() {
        // get all the activities
        const activitiesDiv = document.getElementById('add-activity-content'),
            activities = Main.getClassroomManager()._myTeacherActivities;

        // filter with the ones that are not in the course
        let activitiesToAdd = activities.filter(activity => {
            return !this.courseData.courses.some(course => {
                return course.id === activity.id;
            });
        });

        activitiesDiv.innerHTML = '';
        // create the list of activities
        activitiesToAdd.forEach(activity => {
            const activityImg = foldersManager.icons.hasOwnProperty(activity.type) ? `<img class="list-item-img d-inline" src="${foldersManager.icons[activity.type]}" alt="${activity.type}" class="folder-icons">` : "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>",
                activityDiv = document.createElement('div');
            activityDiv.classList.add('activity-item-courses');
            activityDiv.classList.add('mt-3');
            activityDiv.setAttribute('data-activity-id', activity.id);
            // add checkbox 
            activityDiv.innerHTML = `
                    <div class="form-check">
                        <input class="activity-item-checkbox-input" type="checkbox" value="${activity.id}" id="courses-activity-${activity.id}">
                        <label class="form-check-label" for="courses-activity-${activity.id}">
                            ${activityImg}    
                            ${activity.title}
                        </label>
                    </div>
            `;
            activitiesDiv.appendChild(activityDiv);
        });

        this.bindEventsToSearch();
        pseudoModal.openModal('add-activity-to-course');
    }

    bindEventsToSearch() {
        document.getElementById('course-activity-search').addEventListener('input', () => {
            const search = document.getElementById('course-activity-search').value,
                activities = Main.getClassroomManager()._myTeacherActivities,
                activitiesDiv = document.getElementById('add-activity-content');

            let activitiesToAdd = activities.filter(activity => {
                return !this.courseData.courses.some(course => {
                    return course.id === activity.id;
                });
            });

            activitiesDiv.innerHTML = '';
            activitiesToAdd.forEach(activity => {
                if (activity.title.toLowerCase().includes(search.toLowerCase())) {
                    let activityImg = foldersManager.icons.hasOwnProperty(activity.type) ? `<img class="list-item-img d-inline" src="${foldersManager.icons[activity.type]}" alt="${activity.type}" class="folder-icons">` : "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>";
                    const activityDiv = document.createElement('div');
                    activityDiv.classList.add('activity-item-courses');
                    activityDiv.setAttribute('data-activity-id', activity.id);
                    // add checkbox 
                    activityDiv.innerHTML = `
                            <div class="form-check">
                                <input class="activity-item-checkbox-input" type="checkbox" value="${activity.id}" id="courses-activity-${activity.id}">
                                <label class="form-check-label" for="courses-activity-${activity.id}">
                                    ${activityImg}    
                                    ${activity.title}
                                </label>
                            </div>
                    `;
                    activitiesDiv.appendChild(activityDiv);
                }
            });
        });
    }

    persistActivityToCourse() {
        const activities = Main.getClassroomManager()._myTeacherActivities;
        const activitiesChecked = document.getElementsByClassName('activity-item-checkbox-input');

        for (let i = 0; i < activitiesChecked.length; i++) {
            let id = parseInt(activitiesChecked[i].value);
            if (activitiesChecked[i].checked && id) {
                this.courseData.courses.push(activities.find(activity => {
                    return activity.id === id;
                }));
            }
        }

        this.refreshCourses();
        this.emptyDivFromActivityToCourse();
        pseudoModal.closeModal('add-activity-to-course');
    }

    deleteActivityFromCourse(activityId) {
        this.courseData.courses = this.courseData.courses.filter(course => {
            return course.id !== activityId;
        });
        this.refreshCourses();
    }

    cancelActivityToCourse() {
        this.emptyDivFromActivityToCourse();
        pseudoModal.closeModal('add-activity-to-course');
    }

    emptyDivFromActivityToCourse() {
        document.getElementById('add-activity-content').innerHTML = '';
    }

    persistTitlePage() {
        const title = document.getElementById('course-title').value,
            description = document.getElementById('course-description').value,
            image = null;
            //image = document.getElementById('course-image').files[0];

        if (title && description) {
            this.courseData.title = title;
            this.courseData.description = description;
            this.courseData.image = image;
            this.goToParameters(true);
        } else {
            displayNotification('#notif-div', "classroom.notif.courseMissingData", "error");
        }
    }

    persistParameters() {
        const duration = document.getElementById('course-duration').value,
            difficulty = document.getElementById('course-difficulty').value,
            language = getCookie("lng") != "" ? getCookie("lng") : "fr",
            license = document.getElementById('course-license').value;

        if (duration && difficulty && language && license) {
            this.courseData.parameters.duration = duration;
            this.courseData.parameters.difficulty = difficulty;
            this.courseData.parameters.language = language;
            this.courseData.parameters.license = license;
            this.goToAttribution(true);
        } else {
            displayNotification('#notif-div', "classroom.notif.courseMissingParameters", "error");
        }
    }

    restoreParametersForUpdate(course, rename = false) {
        this.isUpdate = true;
        this.courseId = course.id;
        this.courseData.title = course.title;
        this.courseData.description = course.description;
        this.courseData.image = course.image;
        this.courseData.parameters.duration = course.duration;
        this.courseData.parameters.difficulty = course.difficulty;
        this.courseData.parameters.language = course.lang;
        this.courseData.parameters.license = course.rights;

        this.courseData.courses = [];
        course.activities.forEach(item => {
            this.courseData.courses.push(Main.getClassroomManager()._myTeacherActivities.find(activity => activity.id === item.id));
        });

        if (rename) {
            this.goToTitle();
        } else {
            this.goToCreate(false);
        }
    }


    attributeCourse(id = null) {
        $("#assign-total-student-number-course").text(0);

        if (id) {
            this.courseId = id;
        } else {
            this.courseId = this.lastestCourse;
        }

        if (this.courseId < 1) {
            return displayNotification('#notif-div', "Id de parcours manquant", "error");
        }

        document.getElementsByClassName('student-number')[0].textContent = '0';

        $('#list-student-attribute-modal').html('');
        this.listStudentsToAttributeForCouse();

        navigatePanel('classroom-dashboard-classes-new-course-attribution-select', 'dashboard-activities-teacher');
    }

    persistAttribution() {
        let students = [],
            classrooms = [],
            studentId = $('#attribute-activity-modal .student-attribute-form-row');

        const retroAttribution = $('#retro-attribution-activity-form').prop('checked')

        for (let i = 0; i < studentId.length; i++) {
            if ($(studentId[i]).find(".student-id").is(':checked')) {
                students.push($(studentId[i]).find(".student-id").val())
                let classId = $(studentId[i]).parent().attr("id").substring(13)
                if (!classrooms.includes(classId)) {
                    classrooms.push(classId)
                }
            }
        }

        if (students.length == 0) {
            $('#attribute-course-to-students').attr('disabled', false)
            displayNotification('#notif-div', "classroom.notif.mustAttributeToStudent", "error")
        }

        this._requestUsersLinkCourse(this.courseId, students, classrooms).then((res) => {
            if (res == true) {
                displayNotification('#notif-div', "classroom.notif.courseAttributed", "success")
                $('#attribute-course-to-students').attr('disabled', false)
                navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher')
            } else {
                displayNotification('#notif-div', "classroom.notif.courseNotAttributed", "error")
            }
        });
    }

    listStudentsToAttributeForCouse() {
        let classes = Main.getClassroomManager()._myClasses;
        if (classes.length == 0) {
            $('#attribute-activity-to-students-close').after(NO_CLASS);
            $('#attribute-activity-to-students-close').hide();

        } else {
            classes.forEach(element => {
                $('#list-student-attribute-modal').append(classeList(element));
            });
            $('.no-classes').remove();
            $('#attribute-activity-to-students-close').show();
        }
    }


    deleteCourse(id) {
        this.resetInputs();
        this.courseId = id;
        pseudoModal.openModal("course-manager-modal");
    }

    resetInputs() {
        pseudoModal.closeModal("course-manager-modal");
        document.getElementById('validation-delete-course').value = '';
    }

    updateCourse(id = null, rename = false) {
        if (id == null) {
            id = this.lastestCourse;
        }
        this._requestGetOneCourseById(id).then((res) => {
            if (res.hasOwnProperty('success')) {
                if (res.success) {
                    this.restoreParametersForUpdate(res.course, rename);
                } else {
                    displayNotification('#notif-div', "classroom.notif.errorCourse", "error")
                }
            } else {
                displayNotification('#notif-div', "classroom.notif.undefinedCourse", "error")
            }
        });
    }

    actualizeCourse(fromDeletion = false) {
        this._requestGetMyCourseTeacher().then((res) => {
            this.myCourses = res;
            if (fromDeletion) {
                teacherActivitiesDisplay();
            }
        });
    }

    moveCourseToFolder(id) {
        foldersManager.moveToFolderModal(id, 'course');
    }

    persistDeleteCourse() {
        let id = this.courseId;
        if ($("#validation-delete-course").val() == $("#validation-delete-course").attr("placeholder")) {
            this._requestDeleteCourse(id).then((res) => {
                if (res.hasOwnProperty("success")) {
                    if (res.success) {
                        displayNotification('#notif-div', "classroom.notif.courseDeleted", "success");
                        pseudoModal.closeModal("course-manager-modal");
                        this.actualizeCourse(true);
                    } else {
                        displayNotification('#notif-div', "classroom.notif.courseNotDeleted", "error");
                    }
                } else {
                    displayNotification('#notif-div', "manager.input.writeDelete", "error");
                }
            });
        }
    }

    duplicateCourse(id) {
        this._requestDuplicateCourse(id).then((res) => {
            if (res.hasOwnProperty("success")) {
                if (res.success) {
                    this.actualizeCourse(true);
                    displayNotification('#notif-div', "classroom.notif.courseDuplicated", "success");
                    pseudoModal.closeModal("course-manager-modal");
                } else {
                    displayNotification('#notif-div', "classroom.notif.courseNotDuplicated", "error");
                }
            } else {
                displayNotification('#notif-div', "manager.input.writeDuplicate", "error");
            }
        });
    }


    teacherCourseItem(course, displayStyle) {
        let content = "";
        if (displayStyle == "card") {
            content = `<div class="course-item course-teacher" data-id="${course.id}">
                            <div>
                                <div class="course-card">
                                <img src="${_PATH}assets/media/cards/card-course.png" class="course-card-img">
                                <div class="course-card-info">
                                    <div class="course-card-top">
                                        <div class="dropdown">
                                            <i class="fas fa-cog fa-2x" type="button" id="dropdown-courseItem-${course.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            </i>
                                            <div class="dropdown-menu" aria-labelledby="dropdown-courseItem-${course.id}" data-id="${course.id}">
                                                <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.attributeCourse(${course.id})" style="border-bottom:2px solid rgba(0,0,0,.15">${capitalizeFirstLetter(i18next.t('words.attribute'))}</li>
                                                <li class="dropdown-item classroom-clickable col-12" href="#" onclick="coursesManager.duplicateCourse(${course.id})">${capitalizeFirstLetter(i18next.t('words.duplicate'))}</li>
                                                <li class=" classroom-clickable col-12 dropdown-item" onclick="coursesManager.updateCourse(${course.id})" href="#">${capitalizeFirstLetter(i18next.t('words.modify'))}</li>
                                                <li class=" classroom-clickable col-12 dropdown-item" onclick="coursesManager.updateCourse(${course.id}, true)" href="#">${capitalizeFirstLetter(i18next.t('words.rename'))}</li>
                                                <li class="dropdown-item modal-course-delete classroom-clickable col-12" href="#" onclick="coursesManager.deleteCourse(${course.id})">${capitalizeFirstLetter(i18next.t('words.delete'))}</li>
                                                <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.moveCourseToFolder(${course.id})">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</li>
                                            </div>
                                        </div> 
                                    </div>
                                    <div class="course-card-mid">
                                        <span class="course-card-activities-count">${course.activities ? course.activities.length : 0}<span>
                                    </div>
                                    <div class="course-card-bot">
                                        <div class="info-tutorials" data-id="${course.id}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 data-toggle="tooltip" title="${course.title}" class="course-item-title">${course.title}</h3>
                            </div>
                        </div>`
        } else if (displayStyle == "list") {

            let activityImg = "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>";
            /* let activityTypeImg = activity.type != null && "" ?  */
            content = `<div class="row course-item-list" data-id="${course.id}">
                <div class="container-draggable">
                    <div class="course-list">
                        <div class="course-list-icon">
                            ${activityImg}
                        </div>
        
                        <div class="course-list-center">
                            <div class="course-list-title">
                                ${course.title}
                            </div>
                        </div>
        
                        <div class="course-list-options">
                            <div class="course-list-options dropdown">
                                <i class="fas fa-cog fa-2x" type="button" id="dropdown-list-courseItem-${course.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                </i>
                                <div class="dropdown-menu" aria-labelledby="dropdown-list-courseItem-${course.id}" data-id="${course.id}">
                                    <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.attributeCourse(${course.id})" style="border-bottom:2px solid rgba(0,0,0,.15">${capitalizeFirstLetter(i18next.t('words.attribute'))}</li>
                                    <li class="dropdown-item classroom-clickable col-12" href="#" onclick="coursesManager.duplicateCourse(${course.id})">${capitalizeFirstLetter(i18next.t('words.duplicate'))}</li>
                                    <li class=" classroom-clickable col-12 dropdown-item" onclick="coursesManager.updateCourse(${course.id})" href="#">${capitalizeFirstLetter(i18next.t('words.modify'))}</li>
                                    <li class=" classroom-clickable col-12 dropdown-item" onclick="coursesManager.updateCourse(${course.id}, true)" href="#">${capitalizeFirstLetter(i18next.t('words.rename'))}</li>
                                    <li class="dropdown-item modal-course-delete classroom-clickable col-12" href="#" onclick="coursesManager.deleteCourse(${course.id})">${capitalizeFirstLetter(i18next.t('words.delete'))}</li>
                                    <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.moveCourseToFolder(${course.id})">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</li>
                                </div>
                            </div>
                        </div>
                        <div class="info-tutorials d-none" data-id="${course.id}"></div>
                        
                    </div>
                </div>
            </div>`
        }
        return content;
    }

    validateCourse(correction) {
        const funct = customActivity.activityAndCase.filter(activityValidate => activityValidate[0] == Activity.activity.type)[0];
        if (funct) {
            funct[1](funct[2] ? correction : null, true);
        } else {
            if (Activity.activity.isLti) {
                let messageDiv = document.getElementById("course-result-message"),
                    endCourse = document.getElementById("course-options-course-buttons"),
                    messageContent = document.getElementById("course-result-message-content"),
                    validateBtn = document.getElementById("course-validate-buttons");

                validateBtn.style.display = "none";
                endCourse.style.display = "none";
                messageDiv.style.display = "none";

                this._requestUpdateState(coursesManager.actualCourse.id, coursesManager.actualCourse.state + 1).then(res => {
                    if (res.hasOwnProperty('success')) {
                        if (res.success) {
                            let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == coursesManager.actualCourse.id);
                            if (course.activities.length <= coursesManager.actualCourse.state + 1) {
                                // the course is ended
                                this.readCourseFromStudent();
                            } else {
                                // the course is not ended
                                messageDiv.style.display = "block";
                                endCourse.style.display = "flex";
                                messageContent.classList.add("course-text-success");
                                messageContent.innerHTML = "BRAVO ! TU AS RÉUSSI CETTE ACTIVIÉ !";
                            }
                        } else {
                            displayNotification('#notif-div', "classroom.notif.errorSending", "error");
                        }
                    }
                });
                
            }
        }
    }

    coursesResponseManager(response, type) {
        if (response) {
            if (response.hasOwnProperty("message")) {
                if (response.message == "activitySaved") {
                    return "saved";
                } else if (response.message == "emptyAnswer") {
                    return "empty";
                }
            } else if (response.hasOwnProperty("badResponse")) {
                saveActivitiesAndCoursesResponseManager(type, response, true);
                return "bad";
            } else {
                $("#activity-validate-course").attr("disabled", false);
                this.manageAllActivityResponse(response);
            }
        } else {
            displayNotification('#notif-div', "classroom.notif.errorSending", "error");
        }
    }

    manageAllActivityResponse(response, isLti = false) {
        
        let messageDiv = document.getElementById("course-result-message"),
            endCourse = document.getElementById("course-options-course-buttons"),
            messageContent = document.getElementById("course-result-message-content"),
            validateBtn = document.getElementById("course-validate-buttons");

        validateBtn.style.display = "none";
        endCourse.style.display = "none";
        messageDiv.style.display = "none";

        if ((response.note != null && response.correction >= 1) || isLti) {
            this._requestUpdateState(coursesManager.actualCourse.id, coursesManager.actualCourse.state + 1).then(res => {
                if (res.hasOwnProperty('success')) {
                    if (res.success) {
                        let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == coursesManager.actualCourse.id);
                        if (course.activities.length <= coursesManager.actualCourse.state + 1) {
                            // the course is ended
                            this.readCourseFromStudent();
                        } else {
                            // the course is not ended
                            messageDiv.style.display = "block";
                            endCourse.style.display = "flex";
                            messageContent.classList.add("course-text-success");
                            messageContent.innerHTML = i18next.t('classroom.courses.note-3');
                        }
                    } else {
                        displayNotification('#notif-div', "classroom.notif.errorSending", "error");
                    }
                }
            });
        }
    }

    viewCourseActivitiesResult(id = null) {
        let activitiesResultDiv = document.getElementById("course-activities-result"),
            courseResultNote = document.getElementById("course-result-note");

        activitiesResultDiv.innerHTML = "";
        let course = id == null ? Main.getClassroomManager()._myCourses.find(course => course.course.id == this.actualCourse.id) : Main.getClassroomManager()._myCourses.find(course => course.course.id == id);
        let courseLength = course.activities.length,
            courseSuccess = 0;
     
        for (let i = 0; i < course.activities.length; i++) {
            let note = 0;

            
            if (course.activities[i].note == 3) {
                note = i18next.t('classroom.courses.note-3');
            } else if (course.activities[i].note < 3 && course.activities[i].note > 0) {
                note = i18next.t('classroom.courses.note-2');
            } else if (course.activities[i].note == 4) {
                note = i18next.t('classroom.courses.note-4');
            } else if (course.activities[i].note == 0) {
                note = i18next.t('classroom.courses.note-0');
            }

            let html = `<div class="course-activities-result-activity" id="course-${course.id}"> 
                            <div class="preview-result-course-activity-title">
                                <p onclick="coursesManager.loadActivity(${course.course.id}, ${course.activities[i].id})">ACTVITÉ <br> N°${i+1}</p>
                            </div>

                            <div>
                                <div class="bilan-cell-course bilan-${course.activities[i].note}"></div>
                            </div>

                            <div class="align-self-center"> 
                                <p class="course-texte-result">${note}</p>
                            </div>
                        </div>`;

            activitiesResultDiv.innerHTML += html;

            if (course.activities[i].note === 3) {
                courseSuccess++;
            } else if (course.activities[i].note === 4) {
                courseLength -= 1;
            }
        }

        courseResultNote.innerText = `${courseSuccess}/${courseLength}`;
        navigatePanel('classroom-dashboard-course-panel-ended', 'dashboard-activities');
    }

    loadActivity(courseId, activityId) {
        let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == courseId),
            btnContainer = document.getElementById("course-validate-buttons");
        Activity = course.activities.find(activity => activity.id == activityId);
        navigatePanel('classroom-dashboard-course-panel', 'dashboard-activities-teacher', 'course', '');
        loadCourseAndActivityForStudents(true, course, false, true);
        btnContainer.style.display = "none";
    }

    readCourseFromStudent(id = null) {
        let resMessage = document.getElementById("course-result-message"),
            btnNext = document.getElementById("course-options-course-buttons"),
            btnValidate = document.getElementById("course-validate-buttons");

        resMessage.style.display = "none";
        btnNext.style.display = "none";

        this._requestGetMyCourseStudent().then(res => {
            Main.getClassroomManager()._myCourses = res;

            if (id == null) {
                id = coursesManager.actualCourse.id;
            }
    
            let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == id);

            if (course.courseState == 999) {
                this.viewCourseActivitiesResult(id);
                return false;
            }
            
            Activity = course.activities[course.courseState];
            

            this.actualCourse = {
                id: id, 
                state: course.courseState, 
                link: Activity.id, 
                activity: Activity.activity.id
            };

            navigatePanel('classroom-dashboard-course-panel', 'dashboard-activities-teacher', 'course', '');
            loadCourseAndActivityForStudents(true, course, true, true);

            if (!Activity.activity.isLti) {
                btnValidate.style.display = "block";
            } else {
                btnValidate.style.display = "none";
            }
        });
    }

    courseOverview(id = null) {
        let activitiesResultDiv = document.getElementById("course-activities-overview");
        activitiesResultDiv.innerHTML = "";
        let course = coursesManager.myCourses.find(course => course.id == id);
        for (let i = 0; i < course.activities.length; i++) {
            let html = `<div class="course-activities-result-activity" id="course-${course.id}" onclick="coursesManager.simulateActivityOpen(${course.activities[i].id})"> 
                            <div class="preview-result-course-activity-title d-flex align-items-center">
                                <img class="list-item-img" src="${foldersManager.icons[course.activities[i].type]}" alt="reading">
                                <p onclick="">ACTVITÉ N°${i+1}</p>
                            </div>

                            <div class="align-self-center"> 
                                <p class="course-title">${course.activities[i].title}</p>
                            </div>
                            <div class="activity-list-info d-flex align-items-center">
                                ${course.activities[i].isAutocorrect ? `<div class="activity-list-auto">
                                    <img src='${_PATH}assets/media/auto-icon-grey.svg' title='Auto' onload="SVGInject(this)">
                                </div>` 
                                : "" }
                            </div>
                        </div>`;

            activitiesResultDiv.innerHTML += html;
        }

        $('#course-title-options').html(course.title + " - " + this.makeOptionsCourseForOverview(course));
        navigatePanel('classroom-dashboard-teacher-course-panel', 'dashboard-activities-panel-teacher');
    }

    simulateActivityOpen(idActivity) {
        navigatePanel('classroom-dashboard-activity-panel', 'activity-item', 'WK' + idActivity, '');
    }

    makeOptionsCourseForOverview(course) {
        let html = "";
        html = `
            <div class="dropdown mx-2">
                <button class="btn c-btn-outline-grey" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${capitalizeFirstLetter(i18next.t('words.options'))}
                    <i class="fas fa-cog"></i>
                </button>
        
                <ul class="dropdown-menu">
                    <li class="dropdown-item" onclick="coursesManager.attributeCourse(${course.id})">
                        ${capitalizeFirstLetter(i18next.t('words.attribute'))}
                    </li>
                
                    <li class="dropdown-item" onclick="coursesManager.duplicateCourse(${course.id})">
                        ${capitalizeFirstLetter(i18next.t('words.duplicate'))}
                    </li>
                        
                    <li class="dropdown-item" onclick="coursesManager.updateCourse(${course.id})">
                        ${capitalizeFirstLetter(i18next.t('words.modify'))}
                    </li>
        
                    <li class="dropdown-item" onclick="coursesManager.updateCourse(${course.id}, true)">
                        ${capitalizeFirstLetter(i18next.t('words.rename'))}
                    </li>
        
                    <li class="dropdown-item" onclick="coursesManager.deleteCourse(${course.id})">
                        ${capitalizeFirstLetter(i18next.t('words.delete'))}
                    </li>

                    <li class="dropdown-item" onclick="coursesManager.moveCourseToFolder(${course.id})">
                        ${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}
                    </li>
                </ul>
            </div>`
        return html;
    }

    _requestUpdateState(id,state) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=set_state_from_course",
                data: {
                    courseId: id,
                    state: state
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }


    _requestGetOneCourseById(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=get_one_from_classroom",
                data: {
                    courseId: id
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestAddCourse() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=add_from_classroom",
                data: {
                    course: JSON.stringify(this.courseData),
                    folder: foldersManager.actualFolder
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestUpdateCourse() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=update_from_classroom",
                data: {
                    courseId: this.courseId,
                    course: JSON.stringify(this.courseData)
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestDeleteCourse(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=delete_from_classroom",
                data: {
                    courseId: id,
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }


    _requestDuplicateCourse(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=duplicate_from_classroom",
                data: {
                    courseId: id,
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestUsersLinkCourse(courseId, students, classrooms) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user_link_course&action=link_user_to_course",
                data: {
                    courseId: courseId,
                    students: students,
                    classrooms: classrooms
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestGetMyCourseTeacher() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user_link_course&action=get_my_courses_as_teacher",
                success: (response) => {
                    let courses = [];
                    response = JSON.parse(response);
                    response.forEach(course => {
                        // keep only course when linked to activity
                        if (course.hasOwnProperty("activities")) {
                            courses.push(course);
                        }
                    });
                    resolve(courses);
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestGetMyCourseStudent() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user_link_course&action=get_my_courses_as_student",
                success: (response) => {
                    let courses = [];
                    response = JSON.parse(response);
                    response.forEach(course => {
                        // keep only course when linked to activity
                        if (course.hasOwnProperty("activities")) {
                            courses.push(course);
                        }
                    });
                    resolve(courses);
                }
            });
        })
    }



}
// Initialize
const coursesManager = new CoursesManager();
coursesManager.init();