
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
                difficulty: '',
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
        this.collections = [
            "Sciences et technologie-Cycle 3",
            "Mathématiques-Cycle 3",
            "Technologie-Cycle 3",
            "Physique-Chimie-Cycle 4",
            "Mathématiques-Cycle 4",
            "Technologie-Cycle 4",
            "SVT-Cycle 4", "SNT-Seconde",
            "Physique-Chimie-Seconde",
            "Mathématiques-Seconde",
            "SVT-Seconde",
            "CIT-Seconde",
            "Enseignement scientifique-Première",
            "NSI-Première",
            "Physique-Chimie-Première",
            "Mathématiques-Première",
            "Sciences de l'ingénieur-Première",
            "SVT-Première",
            "Enseignement scientifique-Terminale",
            "NSI-Terminale",
            "Physique-Chimie-Terminale",
            "Mathématiques-Terminale",
            "Sciences de l'ingénieur-Terminale",
            "SVT-Terminale",
            "STI2D-Lycée",
            "Autre-(tout niveau)"
        ];
    }

    init() {
        this.dragula = dragula();
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

    addTutorialToCourse() {
        
        let nbCollect = document.querySelectorAll('[id^="course-tutorial-"]').length;
        let id = 0;
        
        for (let index = 0; index < nbCollect+1; index++) {
            if (document.getElementById('course-tutorial-' + index) == null) {
                id = index;
                break;
            }
        }

        let html = `<div class="col-12 linkedtutorial-row" id="course-tutorial-${id}">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <div class="input-group-text" data-i18n="tutorial.add.form.linkedtuto.label">Lien vers le tutoriel</div>
                            </div>
                            <input type="text" class="form-control linkedtutorial-form" placeholder="" value="" aria-label="" aria-describedby="basic-addon2">
                            <div class="input-group-append">
                                <button class="btn btn-danger remove-linkedtutorial" onclick="coursesManager.deleteTutorialFromCourse(${id})" data-toggle="tooltip" data-placement="top" data-i18n="[title]tutorial.add.form.linkedtuto.tooltip" title="" data-original-title="Supprimer ce tutoriel"><i class="fas fa-times"></i></button>
                            </div>
                        </div>																																																																
                    </div>`;
        const tutorialsDiv = document.getElementById('course-tutorials-content');
        tutorialsDiv.innerHTML += html;
    }

    addProductToCourse() {

        let nbCollect = document.querySelectorAll('[id^="course-product-"]').length;
        let id = 0;
        
        for (let index = 0; index < nbCollect+1; index++) {
            if (document.getElementById('course-product-' + index) == null) {
                id = index;
                break;
            }
        }

        let html = `<div class="form-group mb-2 row product-row" id="course-product-${id}">
                        <div class="form-row col row">    
                            <div class="input-group-text col-3">
                                <span data-i18n="tutorial.add.form.products.name">Nom</span>
                            </div>
                            <input type="text" class="form-control col-9 product-name">
                        </div>

                        <div class="form-row col row">  
                            <div class="input-group-text col-3">
                                <span data-i18n="tutorial.add.form.products.url">URL</span>
                            </div><input type="text" class="form-control col-9 product-url"> 
                        </div>

                        <button type="button" onclick="coursesManager.deleteProductFromCourse(${id})" class="btn btn-danger remove-product" data-toggle="tooltip" data-placement="top" title="Supprimer ce produit" data-i18n="[title]tutorial.add.form.products.tooltip" data-original-title="Supprimer ce produit"><i class="fas fa-times"></i>
                        </button>
                    </div>`;
        const productsDiv = document.getElementById('course-products-content');
        productsDiv.innerHTML += html;
    }

    deleteProductFromCourse(productId) {
        document.getElementById('course-product-' + productId).remove();
    }

    deleteTutorialFromCourse(tutorialId) {
        document.getElementById('course-tutorial-' + tutorialId).remove();
    }

    
    fillCollectionSelect(collection) {
        const collectionSelect = document.getElementById('collection-select');
        collectionSelect.innerHTML = '';
        collection.forEach(collection => {
            const collectionOption = document.createElement('option');
            collectionOption.value = collection.id;
            collectionOption.innerHTML = collection.name;
            collectionSelect.appendChild(collectionOption);
        });
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

    addChapterToCourse() {

        // check how many "select-collection-" id exist 
        let nbCollect = document.querySelectorAll('[id^="select-collection-"]').length;
        let id = 0;
        
        for (let index = 0; index < nbCollect+1; index++) {
            if (document.getElementById('select-collection-' + index) == null) {
                id = index;
                break;
            }
        }
        const chaptersContent = document.getElementById('course-chapters-content');
        let collections = "",
            selectChapter = "",
            selectCollection = "";


        for (let i = 0; i < this.collections.length; i++) {
            collections += `<option value="${i}">${this.collections[i]}</option>`;
        }

        selectCollection = `<div class="form-group col-md">
                                    <label for="select-collection-${id}">Collection <span class="c-text-red">*Obligatoire</span></label>
                                    <select class="form-control" id="select-collection-${id}" aria-label="Default select example">
                                        ${collections}
                                    </select>
                                </div>`;

        
        this.getChapterByCollection(1, "Sciences et technologie", "Cycle 3").then(chapters => {
            let chaptersDiv = "";
            for(let i = 0; i < chapters.length; i++) {
                chaptersDiv += `<option value="${chapters[i].id}">${chapters[i].name}</option>`;
            }
    
    
            selectChapter = `   <div class="form-group col-md">
                                        <label for="select-chapter-${id}">Chapitre <span class="c-text-red">*Obligatoire</span></label>
                                        <select class="form-control" id="select-chapter-${id}" aria-label="Default select example">
                                            ${chaptersDiv}
                                        </select>
                                    </div>`;

            chaptersContent.innerHTML += `<div class="form-row col-12" id="course-chapter-${id}">
                ${selectCollection}
                ${selectChapter}
                <button type="button" onclick="coursesManager.deleteChapter(${id})" class="btn btn-danger remove-chapter" data-toggle="tooltip" data-placement="top" title="Supprimer ce chapitre" data-i18n="[title]tutorial.add.form.chapter.tooltip" data-original-title="Supprimer ce chapitre"><i class="fas fa-times"></i>
            </div>`;

            document.getElementById('select-collection-' + id).addEventListener('change', (e) => {
                console.log(e)
                let selectedValue = this.collections[e.target.value];
                this.getChapterByCollection(parseInt(e.target.value)+1, selectedValue.split("-")[0], selectedValue.split("-")[1]).then(chapters => {
                    let chaptersDiv = "";
                    for(let i = 0; i < chapters.length; i++) {
                        chaptersDiv += `<option value="${chapters[i].id}">${chapters[i].name}</option>`;
                    }
                    document.getElementById('select-chapter-' + id).innerHTML = chaptersDiv;
                })
            });
        });
    }

    deleteChapter(id) {
        console.log("deleteChapter");
        document.getElementById('course-chapter-' + id).remove();
    }

    // fetch POST chapter controller=chapter&action=get_chapter_by_collection with params: id, nameCollection, gradeCollection
    getChapterByCollection(id, nameCollection, gradeCollection) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=chapter&action=get_chapter_by_collection",
                data: {
                    id: id,
                    nameCollection: nameCollection,
                    gradeCollection: gradeCollection
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }


    // make an array of collection
    //<option value="1" selected="">Sciences et technologie-Cycle 3</option><option value="2">Mathématiques-Cycle 3</option><option value="3">Technologie-Cycle 3</option><option value="4">Physique-Chimie-Cycle 4</option><option value="5">Mathématiques-Cycle 4</option><option value="6">Technologie-Cycle 4</option><option value="7">SVT-Cycle 4</option><option value="8">SNT-Seconde</option><option value="9">Physique-Chimie-Seconde</option><option value="10">Mathématiques-Seconde</option><option value="11">SVT-Seconde</option><option value="12">CIT-Seconde</option><option value="13">Enseignement scientifique-Première</option><option value="14">NSI-Première</option><option value="15">Physique-Chimie-Première</option><option value="16">Mathématiques-Première</option><option value="17">Sciences de l'ingénieur-Première</option><option value="18">SVT-Première</option><option value="19">Enseignement scientifique-Terminale</option><option value="20">NSI-Terminale</option><option value="21">Physique-Chimie-Terminale</option><option value="22">Mathématiques-Terminale</option><option value="23">Sciences de l'ingénieur-Terminale</option><option value="24">SVT-Terminale</option><option value="25">STI2D-Lycée</option><option value="26">Autre-(tout niveau)</option>





    
}
// Initialize
const coursesManager = new CoursesManager();
coursesManager.init();


