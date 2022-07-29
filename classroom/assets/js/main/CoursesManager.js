
class CoursesManager {
    /**
     * Creates an instance of Courses.
     * @public
     */
    constructor() {
        this.actualCourses = [];
    }

    init() {
        
    }


    showCoursePanel() {
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    addActivityToCourse() {
        // open modal 
        pseudoModal.openModal('add-activity-to-course');
    }

    
}
// Initialize
const coursesManager = new CoursesManager();
coursesManager.init();


