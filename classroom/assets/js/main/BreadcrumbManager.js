class BreadcrumbManager {

    constructor() {
        this.breadcrumb = $('#breadcrumb');
        this.chrevron = `<span class="chevron-breadcrumb"> <i class="fas fa-chevron-right"></i> </span>`;
        this.courseOpening = false;
        this.classroomOpening = false;
        this.folderOpening = false;
    }

    reset() {
        if (this.locked) {
            return;
        }
        this.breadcrumb[0].innerHTML = '';
    }

    addItem(text, funct = null) {
        const btnBC = document.createElement('button');

        btnBC.classList.add('btn', 'c-btn-outline-primary');
        btnBC.setAttribute('type', 'button');
        btnBC.innerHTML = text;

        funct ? btnBC.setAttribute('onclick', funct) : null;

        this.breadcrumb.append(this.chrevron);
        this.breadcrumb.append(btnBC);
    }

    setActivityTitle(title = null) {
        title = title == null ? Activity.activity.title : title;
 
        if (!this.courseOpening && !this.classroomOpening) {
            UserManager.getUser().isRegular ? this.setMyActivities() : this.setMyActivitiesStudent();
        }

        if (foldersManager.actualFolder && !this.courseOpening) {
            foldersManager.createTreeFolders();
        }
        
        const btnBC = document.createElement('button');
        btnBC.classList.add('btn', 'c-btn-outline-primary');
        btnBC.setAttribute('type', 'button');
        btnBC.innerHTML = "📃" + title;
        
        this.breadcrumb.append(this.chrevron);
        this.breadcrumb.append(btnBC);
        this.unlockEverything();
    }

    setCourseTitle(title = null, courseId = null) {
        if (!this.courseOpening) {
            UserManager.getUser().isRegular ? this.setMyActivities() : this.setMyActivitiesStudent();
        }

        if (foldersManager.actualFolder) {
            foldersManager.createTreeFolders();
        }

        const btnBC = document.createElement('button');
        btnBC.classList.add('btn', 'c-btn-outline-primary');
        btnBC.setAttribute('type', 'button');
        btnBC.innerHTML = "📚 " + title;

        btnBC.addEventListener('click', () => {
            coursesManager.courseOverview(courseId)
        });
        
        this.breadcrumb.append(this.chrevron);
        
        this.breadcrumb.append(btnBC);
        this.unlockEverything();
    }

    setCourseOpening() {
        this.courseOpening = true;
    }

    setClassroomOpening() {
        this.classroomOpening = true;
    }

    unlockEverything() {
        this.courseOpening = false;
        this.classroomOpening = false;
        this.folderOpening = false;
    }

    removeTwoLastItems() {
        this.breadcrumb[0].lastChild.remove();
        this.breadcrumb[0].lastChild.remove();
    }

    addItemCreateActivity(type) {
        const   translation     =   i18next.t("classroom.activities.add"),
            activityType   =  i18next.t(`newActivities.ActivitiesData.title.${type}`);
        this.setMyActivities();
        this.addItem(`${translation} : ${activityType}`, `launchCustomActivity('${type}')`);
    }

    addItemCreateActivityEmpty() {
        const translation = i18next.t("classroom.activities.add");
        this.setMyActivities();
        this.addItem(`${translation}`);
    }

    setMyActivities() {
        this.reset();
        const   translation = i18next.t("classroom.ids.classroom-dashboard-activities-panel-teacher"),
                btnBC = document.createElement('button');
        btnBC.classList.add('btn', 'c-btn-outline-primary');
        btnBC.setAttribute('type', 'button');
        btnBC.setAttribute('onclick', "navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher')");
        btnBC.innerHTML = translation;
        this.breadcrumb.html(btnBC);
    }

    setMyActivitiesStudent() {
        this.reset();
        const   translation = i18next.t("classroom.ids.classroom-dashboard-activities-panel-teacher"),
                btnBC = document.createElement('button');
        btnBC.classList.add('btn', 'c-btn-outline-primary');
        btnBC.setAttribute('type', 'button');
        btnBC.setAttribute('onclick', "navigatePanel('classroom-dashboard-activities-panel', 'dashboard-activities')");
        btnBC.innerHTML = translation;
        this.breadcrumb.html(btnBC);
    }

    setMyClass() {
        this.reset();
        const   translation = i18next.t("classroom.ids.classroom-dashboard-classes-panel-teacher"),
                btnBC = document.createElement('button');
        btnBC.classList.add('btn', 'c-btn-outline-primary');
        btnBC.setAttribute('type', 'button');
        btnBC.setAttribute('onclick', "navigatePanel('classroom-dashboard-classes-panel-teacher', 'dashboard-classes-teacher')");
        btnBC.innerHTML = translation;
        this.breadcrumb.html(btnBC);
    }

    setSpecificClass(className, link = null) {
        this.setMyClass();
        const   translation = className,
                btnBC = document.createElement('button');

        btnBC.classList.add('btn', 'c-btn-outline-primary');
        btnBC.setAttribute('type', 'button');
        btnBC.setAttribute('onclick', "navigatePanel('classroom-dashboard-classes-panel-teacher', 'dashboard-classes-teacher')");
        btnBC.innerHTML = translation;

        btnBC.addEventListener('click', () => {
            navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', link)
        });

        this.breadcrumb.append(this.chrevron);
        this.breadcrumb.append(btnBC);
        this.unlockEverything();
    }

    navigatePanelBreadcrumb(idNav = null, idPanel = null, oldNav = null, oldPanel = null) {
        if (this.courseOpening || this.classroomOpening) {
            return;
        }

        this.breadcrumb[0].innerHTML = '';
        if (idNav == "dashboard-classes-teacher" && idPanel == "classroom-dashboard-classes-panel-teacher") {
            this.setMyClass();
            return;
        }

        if (idNav == "dashboard-activities" && idPanel == "classroom-dashboard-activities-panel") {
            this.setMyActivitiesStudent();
            return;
        }
    }

    setCreateCourses() {
        const translation = i18next.t("courses.add");
        this.setMyActivities();
        this.addItem(`${translation}`, `coursesManager.showCoursePanel()`);
    }
}
const breadcrumbManager = new BreadcrumbManager();
