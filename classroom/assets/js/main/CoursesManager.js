
class CoursesManager {
    /**
     * Creates an instance of Courses.
     * @public
     */
    constructor() {
        this.actualCourses = [];
        this.courseData = {
            title: '',
            description: '',
            image: '',
            parameters: {
                duration: '',
                level: '',
                language: '',
                support: '',
                options: {
                    chapters: [],
                    products: [],
                    tutorials: [],
                }
            }
        };
        this.dragula = null;
    }

    init() {
        
    }

    goToCreate(fresh = false) {
        if (fresh) {
            this.actualCourses = [];
        }
        this.refrashCourses();
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    goToTitle(fromCreate = false) {
        if (!fromCreate) {
            document.getElementById('course-title').value = this.courseData.title;
            document.getElementById('course-description').value = this.courseData.description;
        } else {
            document.getElementById('course-title').value = '';
            document.getElementById('course-description').value = '';
        }
        navigatePanel('classroom-dashboard-classes-new-course-title', 'dashboard-activities-teacher');
    }

    goToParameters(fromTitle = false) {
        if (!fromTitle) {
            document.getElementById('course-duration').value = this.courseData.parameters.duration;
            document.getElementById('course-level').value = this.courseData.parameters.level;
            document.getElementById('course-language').value = this.courseData.parameters.language;
            document.getElementById('course-support').value = this.courseData.parameters.support;
        } else {
            document.getElementById('course-duration').value = '';
            document.getElementById('course-level').value = '';
            document.getElementById('course-language').value = '';
            document.getElementById('course-support').value = '';
        }
        navigatePanel('classroom-dashboard-classes-new-course-parameters', 'dashboard-activities-teacher');
    }

    goToAttribution(fromParameters = false) {
        navigatePanel('classroom-dashboard-classes-new-course-attribution', 'dashboard-activities-teacher');
    }

    facultativeOptions() {
        $('#course-options').toggle()
        $('#i-course-options').toggleClass('fa-chevron-down')
        $('#i-course-options').toggleClass('fa-chevron-up')
    }

    refrashCourses() {
        const coursesDiv = document.getElementById('course-activities-content');
        coursesDiv.innerHTML = '';
        this.actualCourses.forEach(course => {
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
        this.dragula = dragula([activityFromCourses]);
    }


    showCoursePanel() {
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    addActivityToCourse() {
        // get all the activities
        const   activitiesDiv = document.getElementById('add-activity-content'),
                activities = Main.getClassroomManager()._myTeacherActivities;

        // filter with the ones that are not in the course
        let activitiesToAdd = activities.filter(activity => {
            return !this.actualCourses.some(course => {
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
                return !this.actualCourses.some(course => {
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
                this.actualCourses.push(activities.find(activity => {
                    return activity.id === id;
                }));
            }
        }

        this.refrashCourses();
        this.emptyDivFromActivityToCourse();
        pseudoModal.closeModal('add-activity-to-course');
    }

    deleteActivityFromCourse(activityId) {
        this.actualCourses = this.actualCourses.filter(course => {
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

        if (title && description && image) {
            this.courseData.title = title;
            this.courseData.description = description;
            this.courseData.image = image;
        }

        this.goToParameters(true);
    }


    
}
// Initialize
const coursesManager = new CoursesManager();
coursesManager.init();


