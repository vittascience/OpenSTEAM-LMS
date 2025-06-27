class CoursesManager {
    /**
     * Creates an instance of Courses.
     * @public
     */
    constructor() {
        this.myCourses = [];
        this.attriReference = null;
        this.actualCourse = {
            id: null,
            state: null,
            link: null,
            activity: null,
            format: 0,
        };
        this.courseOrder = [];
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
                format: 0,
            }
        };
        this.resetCourseData = null;
        this.attributeData = {
            students: [],
            classrooms: [],
            courseId: null,
        };

        this.onePageCourseActivitiesLimit = [];
        

        this.wbbptions = null;

        this.activityType = [ "reading", "dragAndDrop", "fillIn", "quiz", "free"];

        this.sortable = null;
    }

    init() {
        this.resetCourseData = () => {
            this.isUpdate = false;
            this.courseId = null;
            this.courseOrder = [];
            this.actualCourse = {
                id: null,
                state: null,
                link: null,
                activity: null,
                format: 0
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

        const courseFormat = document.getElementsByName('course-format');
        for (let i = 0; i < courseFormat.length; i++) {
            courseFormat[i].addEventListener('click', () => {
                if (courseFormat[i].id == 'course-one-page') {
                    this.actualCourse.format = 1;
                } else {
                    this.actualCourse.format = 0;
                }
            });
        }
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

        if (this.courseData.parameters.format != null) {
            if (this.courseData.parameters.format == 1) {
                document.getElementById('course-one-page').checked = true;
            } else {
                document.getElementById('course-standard').checked = true;
            }
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
        this.sortable = new Draggable.Sortable(document.querySelectorAll('.course-activities-content'), {
            draggable: '.course-item-draggable',
        });
        this.sortable.on('sortable:stop', () => {
            setTimeout(() => {
                this.sortActualCourseArrayFromDiv();
            }, 150);
        });
    }

    undoAttribution(id, references = [], classId = null) {
        this._requestUsersUnlinkCourse(id, references, classId).then((res) => {
            if (res.hasOwnProperty('success')) {
                Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(()=>{
                    displayNotification('#notif-div', "classroom.notif.attributeActivityUndone", "success");
                    navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', ClassroomSettings.classroom);
                });
            } else {
                displayNotification('error', res.message);
            }
        });
    }


    showCoursePanel() {
        this.resetCourseData();
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
        breadcrumbManager.setCreateCourses();
    }

    sortActualCourseArrayFromDiv() {
        const courseItems = document.querySelectorAll('div[class^=course-item-draggable]');
        this.courseData.courses = [];
        this.courseOrder = [];
        courseItems.forEach(item => {
            const courseId = parseInt(item.getAttribute('data-course-id'));
            let activity = Main.getClassroomManager()._myTeacherActivities.find(activity => activity.id === courseId);
            this.courseData.courses.push(activity);
            this.courseOrder.push(activity.id);
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
        activitiesDiv.setAttribute('role', 'list');
        activitiesDiv.setAttribute('aria-label', 'Liste des activités disponibles');
        
        // create the list of activities
        activitiesToAdd.forEach(activity => {
            this.createCheckboxElements(activitiesDiv, activity);
        });
        this.bindChangeCheckbox();
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
            activitiesDiv.setAttribute('role', 'list');
            activitiesDiv.setAttribute('aria-label', 'Liste des activités disponibles');
            
            activitiesToAdd.forEach(activity => {
                if (activity.title.toLowerCase().includes(search.toLowerCase())) {
                    this.createCheckboxElements(activitiesDiv, activity);
                }
            });
            this.bindChangeCheckbox();
        });
    }

    createCheckboxElements(target = null, activity = null) {
        // Activity icon with proper alt text
        let activityImg = foldersManager.icons.hasOwnProperty(activity.type) 
            ? `<img class="list-item-img d-inline" 
                    src="${foldersManager.icons[activity.type]}" 
                    alt="${i18next.t('words.activity')} ${activity.type}" 
                    class="folder-icons">` 
            : `<span class='list-item-img' aria-hidden="true"> 
                <div class='list-item-no-icon'>
                    <i class='fas fa-laptop'></i>
                </div>
               </span>`;

        const activityDiv = document.createElement('div');
        activityDiv.classList.add('activity-item-courses');
        activityDiv.setAttribute('data-activity-id', activity.id);
        activityDiv.setAttribute('role', 'listitem');
        activityDiv.setAttribute('aria-label', `${i18next.t('words.activity')}: ${activity.title}`);

        // Checkbox with improved accessibility
        activityDiv.innerHTML = `
            <div class="form-check c-checkbox" role="group" aria-labelledby="activity-label-${activity.id}">
                <input class="activity-item-checkbox-input" 
                       type="checkbox" 
                       value="${activity.id}" 
                       id="courses-activity-${activity.id}"
                       aria-label="${activity.title}"
                       aria-describedby="activity-type-${activity.id}">
                <label class="form-check-label" 
                       id="activity-label-${activity.id}" 
                       for="courses-activity-${activity.id}">
                    ${activityImg}    
                    <span id="activity-type-${activity.id}" class="sr-only">${i18next.t('words.activity')} ${activity.type}</span>
                    ${activity.title}
                </label>
            </div>`;

        activityDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const checkbox = activityDiv.querySelector('.activity-item-checkbox-input');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });

        target.appendChild(activityDiv);
    }

    bindChangeCheckbox() {
        let checkboxes = document.querySelectorAll('.activity-item-checkbox-input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.manageActivitiesOrder(e.target.checked, e.target.value);
            });
        });
    }

    manageActivitiesOrder(checked, activityId) {
        if (checked) {
            this.courseOrder.push(parseInt(activityId));
        } else {
            if (this.courseOrder.indexOf(parseInt(activityId)) > -1) {
                this.courseOrder.splice(this.courseOrder.indexOf(parseInt(activityId)), 1);
            }
        }
    }

    orderCourseActivities() {
        this.courseData.courses.sort((a, b) => {
            return this.courseOrder.indexOf(a.id) - this.courseOrder.indexOf(b.id);
        });
    }

    persistActivityToCourse() {
        const activities = Main.getClassroomManager()._myTeacherActivities;
        const activitiesChecked = document.getElementsByClassName('activity-item-checkbox-input');


        let tempLimit = new Map(),
            limited = false;
        

        for (let i = 0; i < activitiesChecked.length; i++) {
            let id = parseInt(activitiesChecked[i].value);
            if (activitiesChecked[i].checked && id) {

                let acti = activities.find(activity => {
                    return activity.id === id;
                })
                this.courseData.courses.push(acti);
                tempLimit.set(acti.type, tempLimit.get(acti.type) ? tempLimit.get(acti.type) + 1 : 1);
            }
        }


        for(let i = 0; i < this.courseData.courses.length; i++) {
            let acti = this.courseData.courses[i];
            let type = acti.type;
            if (this.onePageCourseActivitiesLimit.length > 0 && this.onePageCourseActivitiesLimit.some(limit => limit[0] == type)) {
                let limitArray = this.onePageCourseActivitiesLimit.find(limit => limit[0] == type);
                if (limitArray[1] > 0) {
                    if (tempLimit.get(type) > limitArray[1]) {
                        displayNotification('#notif-div', limitArray[2], "error");
                        this.courseData.courses = [];
                        limited = true;
                        break;
                    }
                }
            }
        }

        if (limited) {
            return;
        }

        this.orderCourseActivities();

        this.refreshCourses();
        this.emptyDivFromActivityToCourse();
        pseudoModal.closeModal('add-activity-to-course');
    }

    deleteActivityFromCourse(activityId) {
        this.courseData.courses = this.courseData.courses.filter(course => {
            return course.id !== activityId;
        });
        this.courseOrder.splice(this.courseOrder.indexOf(activityId), 1);
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
            let format = parseInt(document.querySelector('input[name="course-format"]:checked').value);


        if (duration && difficulty && language && license) {
            this.courseData.parameters.duration = duration;
            this.courseData.parameters.difficulty = difficulty;
            this.courseData.parameters.language = language;
            this.courseData.parameters.license = license;
            this.courseData.parameters.format = format;
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
        this.courseData.parameters.format = course.format;

        this.courseData.courses = [];
        this.courseOrder = [];

        course.activities.forEach(item => {
            let activity = Main.getClassroomManager()._myTeacherActivities.find(activity => activity.id === item.id);
            this.courseData.courses.push(activity);
            this.courseOrder.push(activity.id);
        });

        if (rename) {
            this.goToTitle();
        } else {
            this.goToCreate(false);
        }
    }


    attributeCourse(id = null, reference = null) {
        $("#assign-total-student-number-course").text(0);

        if (id) {
            this.courseId = id;
        } else {
            this.courseId = this.lastestCourse;
        }

        if (reference) {
            this.attriReference = reference;
        } else {
            this.attriReference = null;
        }

        if (this.courseId < 1) {
            return displayNotification('#notif-div', "Id de parcours manquant", "error");
        }

        let dateBginPicker = document.getElementById('date-begin-course-form'),
            dateEndPicker = document.getElementById('date-end-course-form');

        let now = new Date()
        let future = new Date();
        future.setMonth(future.getMonth() + 1);
        future.setDate(future.getMonth() + 1);

        dateBginPicker.value = now.toISOString().split('T')[0];
        dateEndPicker.value = future.toISOString().split('T')[0];

        document.getElementsByClassName('student-number')[0].textContent = '0';

        $('#list-student-attribute-modal').html('');
        this.listStudentsToAttributeForCouse(reference);

        navigatePanel('classroom-dashboard-classes-new-course-attribution-select', 'dashboard-activities-teacher');
    }

    persistAttribution() {
        let students = [],
            classrooms = [],
            studentId = $('#attribute-activity-modal .student-attribute-form-row');

        let dateBeginPicker = document.getElementById('date-begin-course-form'),
            dateEndPicker = document.getElementById('date-end-course-form');

        let dateBegin = null,
            dateEnd = null;

        let isDateSelected = document.getElementById('isDate-course-form');
        if (isDateSelected && isDateSelected.checked) {
            dateBegin = dateBeginPicker.value;
            dateEnd = dateEndPicker.value;
        }

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

        this._requestUsersLinkCourse(this.courseId, students, classrooms, this.attriReference, dateBegin, dateEnd).then((res) => {
            if (res == true) {
                displayNotification('#notif-div', "classroom.notif.courseAttributed", "success")
                $('#attribute-course-to-students').attr('disabled', false)
                navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher')
            } else {
                displayNotification('#notif-div', "classroom.notif.courseNotAttributed", "error")
            }
        });
    }

    listStudentsToAttributeForCouse(ref = null) {
        let classes = Main.getClassroomManager()._myClasses;
        if (classes.length == 0) {
            $('#attribute-activity-to-students-close').after(NO_CLASS);
            $('#attribute-activity-to-students-close').hide();

        } else {
            classes.forEach(element => {
                $('#list-student-attribute-modal').append(classeList(element, ref));
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
                processDisplay();
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
            content = `<div class="course-item course-teacher" data-id="${course.id}" aria-label="Activité ${course.title}" tabindex="-1">
                            <div>
                                <div class="course-card"
                                    onkeydown="if(event.key==='Enter'||event.key===' '){ event.preventDefault(); event.target.click(); }" tabindex="0"
                                >
                                <img src="${_PATH}assets/media/cards/card-course.png" class="course-card-img">
                                <div class="course-card-info">
                                    <div class="course-card-top">
                                        <div class="dropdown" onkeydown="if(event.key==='Enter'||event.key===' '){event.stopPropagation();}" tabindex="0">
                                            <i class="fas fa-cog fa-2x" type="button" id="dropdown-courseItem-${course.id}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                            <h3 data-bs-toggle="tooltip" title="${course.title}" class="course-item-title">${course.title}</h3>
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
                                <i class="fas fa-cog fa-2x" type="button" id="dropdown-list-courseItem-${course.id}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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

    callBackForCourse(activity) {
        coursesManager.manageAllActivityResponse(activity);
    }

    validateCourse(correction) {
        const funct = customActivity.activityAndCase.filter(activityValidate => activityValidate[0] == Activity.activity.type)[0];
        if (funct) {
            funct[1](funct[2] ? correction : null, true, this.callBackForCourse);
        } else {
            if (Activity.activity.isLti) {
                let messageDiv = document.getElementById("course-result-message"),
                    endCourse = document.getElementById("course-options-course-buttons"),
                    messageContent = document.getElementById("course-result-message-content"),
                    validateBtn = document.getElementById("course-validate-buttons");

                validateBtn.style.display = "none";
                endCourse.style.display = "none";
                messageDiv.style.display = "none";

                this._requestUpdateState(coursesManager.actualCourse.id, coursesManager.actualCourse.state + 1, coursesManager.actualCourse.courseLink).then(res => {
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
            this._requestUpdateState(coursesManager.actualCourse.id, coursesManager.actualCourse.state + 1, coursesManager.actualCourse.courseLink).then(res => {
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

    viewCourseActivitiesResult(id = null, courseLink = null) {
        let activitiesResultDiv = document.getElementById("course-activities-result"),
            courseResultNote = document.getElementById("course-result-note");

        activitiesResultDiv.innerHTML = "";
        let course = id == null ? Main.getClassroomManager()._myCourses.find(course => course.course.id == this.actualCourse.id && course.id == courseLink) : Main.getClassroomManager()._myCourses.find(course => course.course.id == id && course.id == courseLink);
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
                                <p onclick="coursesManager.loadActivity(${course.course.id}, ${course.activities[i].id}, ${course.id})">ACTVITÉ <br> N°${i+1}</p>
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

    loadActivity(courseId, activityId, courseLink = null) {
        let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == courseId && course.id == courseLink),
            btnContainer = document.getElementById("course-validate-buttons");
        Activity = course.activities.find(activity => activity.id == activityId);
        navigatePanel('classroom-dashboard-course-panel', 'dashboard-activities-teacher', 'course', '');
        loadCourseAndActivityForStudents(true, course, false, true);
        btnContainer.style.display = "none";
    }

    readCourseFromStudent(id = null, courseLink = null) {
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

            if (courseLink == null) {
                courseLink = coursesManager.actualCourse.courseLink;
            } else {
                coursesManager.actualCourse.courseLink = courseLink;
            }
    
            let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == id && course.id == courseLink);
            if (course.courseState == 999) {
                this.viewCourseActivitiesResult(id, courseLink);
                return false;
            }

            Activity = course.activities[course.courseState];
            

            this.actualCourse = {
                id: id, 
                state: course.courseState, 
                link: Activity.id, 
                activity: Activity.activity.id,
                courseLink: course.id
            };

            navigatePanel('classroom-dashboard-course-panel', 'dashboard-activities', 'course', '');
            loadCourseAndActivityForStudents(true, course, true, true);

            if (!Activity.activity.isLti) {
                btnValidate.style.display = "block";
            } else {
                btnValidate.style.display = "none";
            }
        });
    }

    readCourseOnePage(id = null, courseLink = null) {
        this._requestGetMyCourseStudent().then(res => {
            Main.getClassroomManager()._myCourses = res;

            if (id == null) {
                id = coursesManager.actualCourse.id;
            }

            let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == id && course.id == courseLink);
            if (course.courseState == 999) {
                this.viewCourseActivitiesResult(id, courseLink);
                return false;
            }
            
            Activity = course.activities[course.courseState];
            this.actualCourse = {
                id: id, 
                state: course.courseState, 
                link: Activity.id, 
                activity: Activity.activity.id,
                courseLink: course.id
            };
            navigatePanel('classroom-dashboard-course-panel-one-page', 'dashboard-activities', 'course', '');
            breadcrumbManager.setCourseTitle(course.course.title, course.course.id);
            this.loadOnePageCourseForStudent(course);
        });
    }

    courseOverview(id = null) {
        let activitiesResultDiv = document.getElementById("course-activities-overview");
        activitiesResultDiv.innerHTML = "";
        let course = coursesManager.myCourses.find(course => course.id == id);
        for (let i = 0; i < course.activities.length; i++) {
            let activityType = course.activities[i].type;
            let imagePath = "",
                imageAlt = "";
            if (activityType == null || activityType == undefined) {
                imagePath = foldersManager.icons["reading"];
                imageAlt = "reading";
            } else {
                imagePath = foldersManager.icons[course.activities[i].type];
                imageAlt = course.activities[i].type;
            }


            let html = `<div class="course-activities-result-activity" id="course-${course.id}" onclick="coursesManager.simulateActivityOpen(${course.activities[i].id})"> 
                            <div class="preview-result-course-activity-title d-flex align-items-center">
                                <img class="list-item-img" src="${imagePath}" alt="image-${imageAlt}">
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

        navigatePanel('classroom-dashboard-teacher-course-panel', 'dashboard-activities-teacher');
        breadcrumbManager.setCourseTitle(course.title, course.id);
    }

    simulateActivityOpen(idActivity) {
        breadcrumbManager.setCourseOpening();
        navigatePanel('classroom-dashboard-activity-panel', 'activity-item', 'WK' + idActivity, '');
    }

    makeOptionsCourseForOverview(course) {
        let html = "";
        html = `
            <div class="dropdown mx-2">
                <button class="btn c-btn-outline-grey" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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


    /**
     * Load one page course for student
     * @param {*} course 
     */
    loadOnePageCourseForStudent(course) {
        const onePageCourseContent = document.getElementById('one-page-course-student-content');
        onePageCourseContent.innerHTML = "";

        // create h3 title 
        const courseTitle = document.createElement('h3');
        courseTitle.classList.add('fw7-primary', 'my-2', 'text-center');
        courseTitle.innerHTML = course.course.title;

        // create p description
        const courseDescription = document.createElement('p');
        courseDescription.classList.add('fw7-uncolored', 'my-2', 'text-center');
        courseDescription.innerHTML = course.course.description;

        // insert title and description in the div
        onePageCourseContent.appendChild(courseTitle);
        onePageCourseContent.appendChild(courseDescription);
    
        for (let i = 0; i < course.activities.length; i++) {
            this.processForOneActivity(course.activities[i], onePageCourseContent);
        }

        onePageCourseContent.classList.remove('d-none');
    }

    /**
     * Parse and render activities in the one page course
     * @param {*} activity 
     * @param {*} onePageCourseContent 
     */
    processForOneActivity(activity, onePageCourseContent = document.getElementById('one-page-course-student-content'), course = null) {
        const activityType = [ "reading", "dragAndDrop", "fillIn", "quiz", "free"];

        let divActivity = document.createElement('div');
        if (document.getElementById(`activity-${activity.activity.id}-course-one-page`) != null) {
            divActivity = document.getElementById(`activity-${activity.activity.id}-course-one-page`);
            divActivity.innerHTML = "";
        } else {
            divActivity.id = `activity-${activity.activity.id}-course-one-page`;
            divActivity.classList.add('one-page-course-activity-block');
            onePageCourseContent.appendChild(divActivity);
        }


        let titleH3 = document.createElement('h4');
        titleH3.id = `activity-title-${activity.activity.id}-course-one-page`;
        titleH3.classList.add('fw7-uncolored', 'my-2', 'text-center');
        titleH3.innerHTML = activity.activity.title;
        divActivity.appendChild(titleH3);

        // Check if the activity has an introduction
        if (activity.activity.introduction != null && activity.activity.introduction != "") {
            textIntroductionSpan.innerHTML = bbcodeToHtml(activity.activity.introduction);
            introductionP.classList.remove('d-none');
        }

        /*Correction TBD*/
        let correction = '',
            isDoable = true;

        const content = this.manageContentActivitiesOnePageCourse(activity);
        const activityData = this.returnContentForActivityInOnePageCourse(content, activity, correction, isDoable);

        if (!activity.evaluation && correction < 2 && !isDoable) {
            isDoable = activityType.includes(Activity.activity.type) ? true : false;
        }

        // proc the adequat function to render the activity
        if (coursesManager.activityType.includes(activity.activity.type)) {
            const func = customActivity.renderActivities.filter(x => x[0] == activity.activity.type)[0];
            if (func) {
                func[1](activityData, divActivity, activity.activity.id, activity.response);
            }
        } else if (activity.activity.isLti) {
            this.renderLtiActivity(activityData, divActivity, activity.activity.id, activity.response);
        }
    }


    /**
     * Display the hint for the one page course activities
     * @param {*} response 
     * @param {*} activityId 
     * @returns 
     */
    displayHintForOnePageCourse(response, activityId) {
        if (!response.hasOwnProperty('hint') || !activityId) {
            return;
        }

        if (response.hint == "") {
            return;
        }

        let hintDiv = document.getElementById(`hint-${activityId}`);
        hintDiv.innerHTML = response.hint;
        hintDiv.classList.remove("d-none");
    }


    /* 
    * Manage the content of the activities for the one page course
    * @param activity : the activity to manage
    * @return content : the content of the activity
    * @return activityData : the data of the activity
    */
    manageValidateBtnForOnePageCourse(activityId, container, activity = null, onlyValidate = false) {

        const hint = document.createElement('p');
        hint.classList.add('c-text-primary', 'm-2', 'fw7-uncolored', 'hint-one-page-course', 'd-none');
        hint.innerHTML = i18next.t('classroom.activities.hint');
        hint.id = 'hint-' + activityId;
        container.appendChild(hint);

        const btnDiv = document.createElement('div');
        btnDiv.classList.add('d-flex', 'justify-content-end', 'mt-2');

        const validateBtn = document.createElement('button');
        validateBtn.dataset.id = activity.id;
        validateBtn.dataset.link = activity.link;
        validateBtn.dataset.type = activity.type;
        validateBtn.id = 'validate-activity-' + activityId;
        validateBtn.classList.add('btn', 'c-btn-primary', 'mx-1');
        validateBtn.innerHTML = i18next.t('classroom.activities.validate');



        container.appendChild(hint);
        container.appendChild(btnDiv);
        btnDiv.appendChild(validateBtn);

        if (!onlyValidate) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'save-activity-' + activityId;
            saveBtn.dataset.id = activityId;
            saveBtn.dataset.link = activity.link;
            saveBtn.dataset.type = activity.type;
            saveBtn.classList.add('btn', 'c-btn-grey', 'mx-1', 'd-none');
            saveBtn.innerHTML = i18next.t('classroom.activities.save-draft');
            btnDiv.appendChild(saveBtn);

            
            saveBtn.addEventListener('click', () => {
                this.manageValidateByTypeForOnePageCourse(saveBtn, 0);
            });
        }

        validateBtn.addEventListener('click', () => {
            this.manageValidateByTypeForOnePageCourse(validateBtn, 1);
        });
    }


    /* 
    * Manage the states and content for one page course
    * @param {int} activityId
    * @param {HTMLElement} container
    * @param {Object} activityData
    */
    manageStatesAndContentForOnePageCourse(activityId, container, activityData, withContent = true) {
        const states = document.createElement('h5');
        states.classList.add('c-text-primary', 'mt-2');
        states.innerHTML = i18next.t('classroom.activities.states');
        container.appendChild(states);

        const paragraph = document.createElement('p');
        paragraph.innerHTML = activityData.states;
        container.appendChild(paragraph);

        if (!activityData.isDoable) {
            const h5 = document.createElement('h5');
            h5.id = 'h5-one-page-activity-content-' + activityId;
            h5.classList.add('c-text-primary', 'mt-2');
            if (activityData.doable) {
                h5.innerHTML = i18next.t("classroom.activities.content");
            } else {
                h5.innerHTML = i18next.t("classroom.activities.yourAnswer");
            }
            container.appendChild(h5);
        }

        if (withContent) {
            const contentDiv = document.createElement('div');
            contentDiv.id = 'activity-content-' + activityId;

            if (activityData.type == "quiz") {
                contentDiv.classList.add('d-flex', 'flex-wrap', 'justify-content-center', 'align-items-center');
            }
            contentDiv.innerHTML = activityData.content;
            container.appendChild(contentDiv);
        }
    }

    /*
    * Manage the content of the activities for the one page course
    * @param {Object} content
    * @param {Object} correction
    * @param {String} type
    * @param {String} correction_div
    * @param {Boolean} isDoable
    * @param {Object} optionalData
    * @return {Object} contentData
    */
    returnContentForActivityInOnePageCourse(content, activity, correction_div, isDoable)
    {
        let contentData = "";
    
        if (activity.activity.type == null) {
            if (typeof correction == 'string') {
                contentData.correction = bbcodeToHtml(correction);
            } else {
                contentData.correction = correction;
            }
        }
    
        const funct = customActivity.getManageDisplayCustom.filter(activityValidate => activityValidate[0] == activity.activity.type)[0];
        if (funct) {
            contentData = funct[1](content, activity, correction_div);
        } else {
            if (activity.activity.isLti) {
                contentData = this.manageDisplayLtiForOnePageCourse(activity, content, correction_div, isDoable);
            } else {
                contentData = this.manageDisplayOldActivitiesForOnePageCourse(activity.activity.correction, content, correction_div, isDoable);
            };
        }
    
        return contentData;
    }
    
    manageDisplayOldActivitiesForOnePageCourse(correction, content, correction_div, isDoable) {
        const activityData = {
            states: null,
            content: null,
            correction: null,
            doable: isDoable,
            type: null
        }
    
        activityData.content = content;
        if (!isDoable) {
            if (correction != 1 || UserManager.getUser().isRegular) {
                activityData.correction = correction_div;
            }
        }
    
        return activityData;
    }

    renderLtiActivity(activityData, container, activityId, response) {
        const contentDiv = document.createElement('div');
        contentDiv.id = 'activity-content-' + activityId;
        if (typeof activityData.content == 'string') {
            contentDiv.innerHTML = activityData.content;
        } else {
            contentDiv.innerHTML = activityData.content[0];
        }

        container.appendChild(contentDiv);
        if (typeof activityData.content == 'object') {
            document.forms[activityData.content[1]].submit();
        }
    }
    
    
    manageDisplayLtiForOnePageCourse(activity, content, correction_div, isDoable) {
        const activityData = {
            states: null,
            content: null,
            correction: null,
            doable: isDoable
        }

        let url = false;
        if (activity.url) {
            url = activity.url;
        }
        if (isDoable) {
            activityData.content = this.launchLtiResourceOnePageCourse(activity.id, activity.activity.id, activity.activity.type, content, !UserManager.getUser().isRegular, url);
        } else {
            activityData.content = `<iframe src="${activity.url}" width="100%" style="height: 60vh;" allowfullscreen=""></iframe>`;
            if (!UserManager.getUser().isRegular) {
                if (!activity.evaluation && activity.activity.correction < 2) {
                    activityData.content += `<button onclick="launchLtiResource(${activity.id}, '${activity.activity.type}', '${content}', true, '${activity.url}')">Modifier le travail</button>`;
                }
            }
            if (correction != 1 || UserManager.getUser().isRegular) {
                activityData.correction = correction_div;
            }
        }

        return activityData;
    }

    /**
     * Validate an lti activity in a one page course
     * @param {*} activityId 
     * @param {*} activityLink 
     */
    async validateLtiOnePageCourse(activityId, activityLink) {
        let activity = {
            id: activityId,
            activity: {
                id: activityLink,
            }
        }

        const activityData = await Main.getClassroomManager().getOneUserLinkActivity(activityId);
        const course = coursesManager.getParcoursFromHisActivity(activity);

        let activityDataFiltered = course.activities.filter(activity => activity.id == activityId)[0];
        let reValidate = false;
        if (activityDataFiltered.url) {
            reValidate = true;
        }

        activityDataFiltered = activityData;

        const content = coursesManager.manageContentActivitiesOnePageCourse(activityData);
        const data = coursesManager.manageDisplayLtiForOnePageCourse(activityData, content, "", true);
        const courseState = reValidate ? course.courseState : course.courseState + 1;

        const res  =  await coursesManager._requestUpdateState(course.course.id, courseState, course.id);
        if (res.hasOwnProperty('success')) {
            if (res.success) {
                course.courseState = parseInt(res.courseLinkUser.courseState);
                if (courseState < course.activities.length) {
                    let divContent = document.getElementById('activity-content-' + activityLink);
                    if (typeof data == 'object') {
                        divContent.innerHTML = data.content[0];
                        document.forms[data.content[1]].submit();
                    }
                } else {
                    coursesManager.viewCourseActivitiesResult(course.course.id, course.id);
                }
            } else {
                displayNotification('#notif-div', "classroom.notif.errorSending", "error");
            }
        }
    }

    /**
     * This function is called when the user validate an reading activity in one page course
     * @param {*} activity 
     */
    callBackForCourseOnePage(activity) {
        coursesManager.manageValidateReponse(activity);
    }

    /**
     * This function is called when the user validate an activity in one page course
     * @param {htmlelement} btn 
     */
    manageValidateByTypeForOnePageCourse(btn, correction) {
        const   id = btn.dataset.id,
                type = btn.dataset.type,
                link = btn.dataset.link;

        const funct = customActivity.activityValidateOnePageCourse.filter(activityValidate => activityValidate[0] == type)[0];
        if (funct && type != 'reading') {
            funct[1](id, link, correction);
        } else if (type == 'reading') {
            let foundActivity = Main.getClassroomManager()._myCourses.filter((course) => {
                return course.activities.filter((activity) => {
                    return activity.id == link && activity.activity.id == id;
                });
            });
            if (foundActivity.length > 0) {
                foundActivity = foundActivity[0].activities.filter((activity) => {
                    return activity.id == link && activity.activity.id == id;
                })[0];
                defaultProcessValidateActivity(1, false, this.callBackForCourseOnePage, foundActivity);
            } 
        }
    }

    getOneActivityFromCourse(activityId, activityLink) {
        let activityFound = null;
        Main.getClassroomManager()._myCourses.forEach((course) => {
            course.activities.forEach((activity) => {
                if (activity.id == activityLink && activity.activity.id == activityId) {
                    activityFound = activity;
                }
            });
        });

        if (activityFound) {
            return activityFound;
        }
        return null;
    }

    manageValidateReponse(response, reValidate = false) {
        if (response) {
            if (response.hasOwnProperty("message")) {
                if (response.message == "activitySaved") {
                    displayNotification('#notif-div', "classroom.activities.saved", "success");
                } else if (response.message == "emptyAnswer") {
                    displayNotification('#notif-div', "classroom.activities.emptyAnswer", "error");
                }
            } else {
                const course = this.getParcoursFromHisActivity(response);
                if (course) {
                    let courseState = reValidate ? course.courseState : course.courseState + 1;
                    this._requestUpdateState(course.course.id, courseState, course.id).then((res) => {
                        if (res.hasOwnProperty('success')) {
                            if (res.success) {
                                // update the course state
                                course.courseState = parseInt(res.courseLinkUser.courseState);
                                if (courseState < course.activities.length) {
                                    this.processForOneActivity(response);
                                } else {
                                    this.viewCourseActivitiesResult(course.course.id, course.id);
                                }
                            } else {
                                displayNotification('#notif-div', "classroom.notif.errorSending", "error");
                            }
                        }
                    });
                }
            }
        } else {
            displayNotification('#notif-div', "classroom.notif.errorSending", "error");
        }
    }

    getParcoursFromHisActivity(activity) {
        let parcours = null;
        Main.getClassroomManager()._myCourses.forEach((course) => {
            if (course.activities.filter((act) => act.id == activity.id && activity.activity.id == act.activity.id).length > 0) {
                parcours = course;
            }
        });
        return parcours;
    }
    
    launchLtiResourceOnePageCourse(activityId, activityLink, activityType, activityContent, isStudentLaunch = false, studentResourceUrl = false) {
        let height = window.innerHeight - 220;
        return [`<input id="activity-score" type="text" hidden/>
        <form name="resource_launch_form_${activityId}" action="${_PATH}lti/ltilaunch.php" method="post" target="lti_student_iframe_${activityId}">
            <input type="hidden" id="application_type" name="application_type" value="${activityType}">
            <input type="hidden" id="target_link_uri" name="target_link_uri" value="${activityContent.replace('&amp;', '&')}">
            <input type="hidden" id="student_launch" name="student_launch" value="${isStudentLaunch}">
            <input type="hidden" id="activities_link_user" name="activities_link_user" value="${activityId}">
            <input type="hidden" id="student_resource_url" name="student_resource_url" value="${studentResourceUrl}">
        </form>
        <iframe id="lti_student_iframe_${activityId}" src="about:blank" data-id="${activityId}" data-link="${activityLink}" name="lti_student_iframe_${activityId}" title="Tool Content" width="100%" style="height: ${height}px" allow="fullscreen *; microphone *; camera *; serial *; usb *"></iframe>`, 
        `resource_launch_form_${activityId}`];
    }
    
    manageContentActivitiesOnePageCourse(activity) {
        let content = "";
        if (IsJsonString(activity.activity.content)) {
            const contentParsed = JSON.parse(activity.activity.content);
            if (activity.activity.type != "fillIn" && activity.activity.type != "quiz" && activity.activity.type != "dragAndDrop") {
                if (contentParsed.hasOwnProperty('description')) {
                    content = contentParsed.description;
                    if (activity.project != null) {
                        if (LINK_REGEX.test(activity.content)) {
                            content = content.replace(LINK_REGEX, '$1' + activity.project.link)
                        }
                    }
                }
            } else {
                content = contentParsed;
            }
        } else {
            content = activity.activity.content.replace(/(\[iframe\].*?link=[a-f0-9]{13})/gm, '$1&use=classroom')
            if (activity.project != null) {
                if (LINK_REGEX.test(activity.activity.content)) {
                    content = content.replace(LINK_REGEX, '$1' + activity.project.link)
                }
            } else {
                content = content
            }
        }
        return content;
    }


    _requestUpdateState(id, state, courseLink) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=set_state_from_course",
                data: {
                    courseId: id,
                    courseLinkUserId: courseLink,
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

    _requestUsersLinkCourse(courseId, students, classrooms, reference = null, dateBegin = null, dateEnd = null) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user_link_course&action=link_user_to_course",
                data: {
                    courseId: courseId,
                    students: students,
                    classrooms: classrooms,
                    reference: reference,
                    dateBegin: dateBegin,
                    dateEnd: dateEnd
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

    _requestUsersUnlinkCourse(courseId, references = [], classId = null) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user_link_course&action=unlink_course_to_users",
                data: {
                    courseId: courseId,
                    classId: classId,
                    references: references
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


    _requestCourseDebug() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=debug_course",
                success: function () {
                    resolve();
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }



}
// Initialize
const coursesManager = new CoursesManager();
coursesManager.init();
