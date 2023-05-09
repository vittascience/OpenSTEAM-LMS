class BreadcrumbManager {

    constructor() {
        this.breadcrumb = $('#breadcrumb');
        this.chrevron = `<span class="chevron-breadcrumb"> <i class="fas fa-chevron-right"></i> </span>`;
    }

    reset() {
        this.breadcrumb.innerHTML = '';
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

    setActivityTitle(title = null, delay = 0) {
        setTimeout(() => {
            title = title == null ? Activity.activity.title : title;
            UserManager.getUser().isRegular ? this.setMyActivities() : this.setMyActivitiesStudent();
            const btnBC = document.createElement('button');
            btnBC.classList.add('btn', 'c-btn-outline-primary');
            btnBC.setAttribute('type', 'button');
            btnBC.innerHTML = title;
            
            this.breadcrumb.append(this.chrevron);
            this.breadcrumb.append(btnBC);
        }, delay);
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
        const   translation = i18next.t("classroom.ids.classroom-dashboard-activities-panel-student"),
                btnBC = document.createElement('button');
        btnBC.classList.add('btn', 'c-btn-outline-primary');
        btnBC.setAttribute('type', 'button');
        btnBC.setAttribute('onclick', "navigatePanel('classroom-dashboard-activities-panel-student', 'dashboard-activities-student')");
        btnBC.innerHTML = translation;
        this.breadcrumb.html(btnBC);
    }

    navigatePanelBreadcrumb(idNav = null, currentBreadcrumbStructure = null) {
        this.reset();
        let innerBreadCrumbHtml = '';
        for (let i = 0; i < currentBreadcrumbStructure.length - 1; i++) {
            // Define the last element of the breadcrumb
            if (i == currentBreadcrumbStructure.length - 2) {
                if ($_GET("panel") == "classroom-dashboard-activity-panel") {
                    if (UserManager.getUser().isRegular) {
                        innerBreadCrumbHtml += `<button class="btn c-btn-outline-primary" onclick="navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher')"><span data-i18n="[html]classroom.ids.${currentBreadcrumbStructure[i]}">${currentBreadcrumbStructure[i]}</span></button>`;
                    } else {
                        innerBreadCrumbHtml += `<button class="btn c-btn-outline-primary" onclick="navigatePanel('classroom-dashboard-activities-panel', 'dashboard-activities')"><span data-i18n="[html]classroom.ids.${currentBreadcrumbStructure[i]}">${currentBreadcrumbStructure[i]}</span></button>`;
                    }
                } else {
                    innerBreadCrumbHtml += `<button class="btn c-btn-outline-primary" onclick="navigatePanel('${currentBreadcrumbStructure[i]}', '${idNav}')"><span data-i18n="[html]classroom.ids.${currentBreadcrumbStructure[i]}">${currentBreadcrumbStructure[i]}</span></button>`;
                }
            } else {
                innerBreadCrumbHtml += `<button class="btn c-btn-outline-primary last" onclick="navigatePanel('${currentBreadcrumbStructure[i]}', '${idNav}')"><span data-i18n="[html]classroom.ids.${currentBreadcrumbStructure[i]}">${currentBreadcrumbStructure[i]}</span><i class="fas fa-chevron-right ml-2"></i></button>`;
            }
        }
        this.breadcrumb.html(innerBreadCrumbHtml);
        this.breadcrumb.localize();
    }

    setCreateCourses() {
        const translation = i18next.t("courses.add");
        this.setMyActivities();
        this.addItem(`${translation}`, `coursesManager.showCoursePanel()`);
    }
}
const breadcrumbManager = new BreadcrumbManager();
