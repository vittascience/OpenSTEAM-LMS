
class CoursesManager {
    /**
     * Creates an instance of Courses.
     * @public
     */
    constructor() {
        this.myCourses = [];
        this.courseId = null;
        this.isUpdate = false;
        this.lastestCourse = null;
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

        this.actualizeCourse();

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
            courseDiv.classList.add('course-item');
            courseDiv.setAttribute('data-course-id', course.id);
            courseDiv.innerHTML = `
                <div class="preview-activity-in-courses">
                    ${activityImg}    
                    ${course.title}
                    <button class="btn btn-warning btn-sm btn-delete-course" onclick="coursesManager.deleteActivityFromCourse(${course.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            coursesDiv.appendChild(courseDiv);
        });
        this.dragulaInit();
    }

    // Wip
    dragulaInit() {
        let activityFromCourses = document.getElementById('course-activities-content');
        if (this.dragula.containers.length > 0) {
            this.dragula.containers = [];
        }
        this.dragula = dragula([activityFromCourses]).on('drop', () => {
            setTimeout(() => {
                this.sortActualCourseArrayFromDiv();
            }, 100);
        });
    }


    showCoursePanel() {
        this.resetCourseData();
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    sortActualCourseArrayFromDiv() {
        const courseItems = document.querySelectorAll('[class^=course-item]');
        this.courseData.courses = [];
        courseItems.forEach(item => {
            const courseId = parseInt(item.getAttribute('data-course-id'));
            this.courseData.courses.push(Main.getClassroomManager()._myTeacherActivities.find(activity => activity.id === courseId));
        });
    }

    addActivityToCourse() {
        // get all the activities
        const   activitiesDiv = document.getElementById('add-activity-content'),
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
            const   activityImg = foldersManager.icons.hasOwnProperty(activity.type) ? `<img class="list-item-img d-inline" src="${foldersManager.icons[activity.type]}" alt="${activity.type}" class="folder-icons">` : "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>",
                    activityDiv = document.createElement('div');
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
        });

        this.bindEventsToSearch();
        pseudoModal.openModal('add-activity-to-course');
    }

    bindEventsToSearch() {
        document.getElementById('course-activity-search').addEventListener('input', () => {
            const   search = document.getElementById('course-activity-search').value,
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
            image = document.getElementById('course-image').files[0];

        if (title && description) {
            this.courseData.title = title;
            this.courseData.description = description;
            this.courseData.image = image;
            this.goToParameters(true);
        } else {
            displayNotification('#notif-div', "informations manquantes", "error");
        } 
    }

    persistParameters() {
        const duration = document.getElementById('course-duration').value,
            difficulty = document.getElementById('course-difficulty').value,
            language = getCookie("lng"),
            license = document.getElementById('course-license').value;

        if (duration && difficulty && language && license) {
            this.courseData.parameters.duration = duration;
            this.courseData.parameters.difficulty = difficulty;
            this.courseData.parameters.language = language;
            this.courseData.parameters.license = license;
            this.goToAttribution(true);
        } else {
            displayNotification('#notif-div', "informations manquantes", "error");
        }
    }

    restoreParametersForUpdate(course) {
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
        this.goToCreate(false);
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

/*     showMyCourses() {
        const courses = this.courseData.courses;
    } */

    deleteCourse(id) {
        this.resetInputs();
        this.courseId = id;
        pseudoModal.openModal("course-manager-modal");
    }

    resetInputs() {
        document.getElementById('validation-delete-course').value = '';
    }

    duplicateCourse(id) {
    
    }

    updateCourse(id = null) {
        if (id == null) {
            id = this.lastestCourse;
        }
        this._requestGetOneCourseById(id).then((res) => {
            if (res.hasOwnProperty('success')) {
                if (res.success) {
                    this.restoreParametersForUpdate(res.course);
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
                        this.actualizeCourse(true);
                        displayNotification('#notif-div', "classroom.notif.courseDeleted", "success");
                        pseudoModal.closeModal("course-manager-modal");
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
                                    <div class="course-card-top">
                                    <div class="dropdown">
                                        <i class="fas fa-cog fa-2x" type="button" id="dropdown-courseItem-${course.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        </i>
                                        <div class="dropdown-menu" aria-labelledby="dropdown-courseItem-${course.id}" data-id="${course.id}">
                                            <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.attributeCourse(${course.id})" style="border-bottom:2px solid rgba(0,0,0,.15">${capitalizeFirstLetter(i18next.t('words.attribute'))}</li>
                                            <li class="dropdown-item classroom-clickable col-12" href="#" onclick="coursesManager.duplicateCourse(${course.id})">${capitalizeFirstLetter(i18next.t('words.duplicate'))}</li>
                                            <li class=" classroom-clickable col-12 dropdown-item" onclick="coursesManager.updateCourse(${course.id})" href="#">${capitalizeFirstLetter(i18next.t('words.modify'))}</li>
                                            <li class="dropdown-item modal-course-delete classroom-clickable col-12" href="#" onclick="coursesManager.deleteCourse(${course.id})">${capitalizeFirstLetter(i18next.t('words.delete'))}</li>
                                            <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.moveCourseToFolder(${course.id})">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</li>
                                        </div>
                                    </div> 
                                </div>
                                <div class="course-card-mid">
                                </div>
                                <div class="course-card-bot">
                                    <div class="info-tutorials" data-id="${course.id}">
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
                                    <li class="dropdown-item classroom-clickable col-12" href="#" onclick="">${capitalizeFirstLetter(i18next.t('words.duplicate'))}</li>
                                    <li class=" classroom-clickable col-12 dropdown-item" onclick="" href="#">${capitalizeFirstLetter(i18next.t('words.modify'))}</li>
                                    <li class="dropdown-item modal-activity-delete classroom-clickable col-12" href="#">${capitalizeFirstLetter(i18next.t('words.delete'))}</li>
                                    <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</li>
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



}
// Initialize
const coursesManager = new CoursesManager();
coursesManager.init();


