
class CoursesManager {
    /**
     * Creates an instance of Courses.
     * @public
     */
    constructor() {
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
    }

    init() {
        this.dragula = dragula();
        this.courseId = null;
        this.resetCourseData = () => {
            this.courseData = {
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
        };
    }

    goToCreate(fresh = false) {
        if (fresh) {
            this.courseData.courses = [];
        }
        this.refrashCourses();
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    goToTitle() {
        if (this.courseData.title != null && this.courseData.description != null) {
            document.getElementById('course-title').value = this.courseData.title;
            document.getElementById('course-description').value = this.courseData.description;
        }
        navigatePanel('classroom-dashboard-classes-new-course-title', 'dashboard-activities-teacher');
    }

    goToParameters() {
        navigatePanel('classroom-dashboard-classes-new-course-parameters', 'dashboard-activities-teacher');
    }

    goToAttribution(fromParameters = false) {
        if (fromParameters) {
            this._requestAddCourse().then((res) => {
                if (res.hasOwnProperty('success')) {
                    console.log(res);
                    this.courseId = res.course.id;
                    navigatePanel('classroom-dashboard-classes-new-course-attribution', 'dashboard-activities-teacher');
                    this.resetCourseData();
                } else {
                    displayNotification('error', res.message);
                }
            })
        }
    }

    facultativeOptions() {
        $('#course-options').toggle()
        $('#i-course-options').toggleClass('fa-chevron-down')
        $('#i-course-options').toggleClass('fa-chevron-up')
    }

    refrashCourses() {
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

        this.refrashCourses();
        this.emptyDivFromActivityToCourse();
        pseudoModal.closeModal('add-activity-to-course');
    }

    deleteActivityFromCourse(activityId) {
        this.courseData.courses = this.courseData.courses.filter(course => {
            return course.id !== activityId;
        });
        this.refrashCourses();
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
            language = document.getElementById('course-language').value,
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

    //création activité vers attribution
    attributeActivity(id, ref = null) {

        $("#assign-total-student-number").text(0);

        Main.getClassroomManager()._idActivityOnAttribution = id;
    
        if (id == 0) {
            id = Main.getClassroomManager()._lastCreatedActivity;
        }

        ClassroomSettings.activity = id
        ClassroomSettings.ref = ref

        document.getElementsByClassName('student-number')[0].textContent = '0';

        $('#list-student-attribute-modal').html('')
        listStudentsToAttribute(ref)
        $('#form-autocorrect').hide()
        ClassroomSettings.willAutocorrect = false;
        navigatePanel('classroom-dashboard-new-activity-panel3', 'dashboard-activities-teacher', ref);

    }

    updateCourse() {

    }

    attributeCourse() {

    }

    _requestAddCourse() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=add_from_classroom",
                data: {
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


}
// Initialize
const coursesManager = new CoursesManager();
coursesManager.init();


