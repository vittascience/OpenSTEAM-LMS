class CustomActivity {
    constructor() {
        // activity added by plugins
        this.activityAndCase = [
            ["free", freeManager.freeValidateActivity, true],
            ["reading", defaultProcessValidateActivity, false],
            ["fillIn", fillInManager.fillInValidateActivity, true],
            ["quiz", quizManager.quizValidateActivity, true],
            ["dragAndDrop", dragAndDropManager.dragAndDropValidateActivity, true],
        ];

        this.activityAndCaseView = [
            ['free', "#activity-free", false],
            ['reading', "#activity-reading", false],
            ['fillIn', "#activity-fill-in", false],
            ['quiz', "#activity-quiz", false],
            ['dragAndDrop', "#activity-drag-and-drop", false],
            ['custom', "#activity-reading", false],
        ];

        this.ContentForwardCustom = [];

        this.getTeacherActivityCustom = [
            ["free", freeManager.showTeacherFreeActivity],
            ["reading", readingManager.showTeacherReadingActivity],
            ["fillIn", fillInManager.showTeacherFillInActivity],
            ["quiz", quizManager.showTeacherQuizActivity],
            ["dragAndDrop", dragAndDropManager.showTeacherDragAndDropActivity],
        ];

        
        this.getTeacherActivityCustomDoable = [
            ["free", freeManager.showTeacherFreeActivityDoable],
            ["reading", readingManager.showTeacherReadingActivityDoable],
            ["fillIn", fillInManager.showTeacherFillInActivityDoable],
            ["quiz", quizManager.showTeacherQuizActivityDoable],
            ["dragAndDrop", dragAndDropManager.showTeacherDragAndDropActivityDoable],
        ];

        this.manageDisplayCustom = [
            ['free', freeManager.manageDisplayFree],
            ['reading', readingManager.manageDisplayReading],
            ['fillIn', fillInManager.manageDisplayFillIn],
            ['quiz', quizManager.manageDisplayQuiz],
            ['dragAndDrop', dragAndDropManager.manageDisplayDragAndDrop],
            ['custom', manageDisplayCustom],
        ];

        this.getManageDisplayCustom = [
            ['free', freeManager.getManageDisplayFree],
            ['reading', readingManager.getManageDisplayReading],
            ['fillIn', fillInManager.getManageDisplayFillIn],
            ['quiz', quizManager.getManageDisplayQuiz],
            ['dragAndDrop', dragAndDropManager.getManageDisplayDragAndDrop],
        ];

        this.renderActivities = [
            ['free', freeManager.renderFreeActivity],
            ['reading', readingManager.renderReadingActivity],
            ['fillIn', fillInManager.renderFillInActivity],
            ['quiz', quizManager.renderQuizActivity],
            ['dragAndDrop', dragAndDropManager.renderDragAndDropActivity],
        ];

        this.manageUpdateCustom = [
            ['free', freeManager.manageUpdateForFree],
            ['quiz', quizManager.manageUpdateForQuiz],
            ['fillIn', fillInManager.manageUpdateForFillIn],
            ['reading', readingManager.manageUpdateForReading],
            ['dragAndDrop', dragAndDropManager.manageUpdateForDragAndDrop],
            ['custom', manageUpdateForDefaultCase],
            [null, readingManager.manageUpdateForReading],
        ];

        this.managePreviewCustom = [
            ['free', freeManager.freePreview],
            ['quiz', quizManager.quizPreview],
            ['fillIn', fillInManager.fillInPreview],
            ['reading', readingManager.readingPreview],
            ['dragAndDrop', dragAndDropManager.dragAndDropPreview],
        ];

        this.activityValidateOnePageCourse = [
            ['free', freeManager.freeValidateActivityOnePageCourse],
            ['fillIn', fillInManager.fillInValidateActivityOnePageCourse],
            ['quiz', quizManager.quizValidateActivityOnePageCourse],
            ['dragAndDrop', dragAndDropManager.dragAndDropValidateActivityOnePageCourse],
        ];

        this.normalMedia = true;
        this.appName = null;
        this.mediaItems = [];
        this.itemsPagination = 12;
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalItems = 0;
        this.paginationDiv = document.getElementById("app-media-galery-pagination");
        this.selectedItem = null;
        this.activityToImport = null;
    }

    init() {
        document.getElementById("apps-file-search").addEventListener("input", () => {
            let search = document.getElementById("apps-file-search").value;
            let items = document.getElementsByClassName("app-media-galery-item");
            if (search != "") {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].getAttribute("data-name").toLowerCase().includes(search.toLowerCase())) {
                        items[i].style.display = "flex";
                    } else {
                        items[i].style.display = "none";
                    }
                }
            } else {
                this.manageDisplay();
            }
        });
    }

    managePagination() {
        this.totalPages = Math.ceil(this.totalItems / this.itemsPagination);
        this.paginationDiv.innerHTML = "";

        let previous = document.createElement("li");
        previous.classList.add("page-item");
        previous.innerHTML = `<button class="c-btn-primary" id="galery-media-btn-previous" onclick="customActivity.goToPage(${this.currentPage - 1})">${i18next.t(`classroom.pagination.previous`)}</button>`;
        this.paginationDiv.appendChild(previous);
        if (this.currentPage == 1) {
            document.querySelector('#galery-media-btn-previous').disabled = true
            document.querySelector('#galery-media-btn-previous').classList.remove("c-btn-primary");
            document.querySelector('#galery-media-btn-previous').style.backgroundColor = "#78787887";
        } else {
            document.querySelector('#galery-media-btn-previous').disabled = false
            document.querySelector('#galery-media-btn-previous').classList.add("c-btn-primary");
        }
        for (let i = 1; i <= this.totalPages; i++) {
            let page = document.createElement("li");
            page.classList.add("page-item");
            page.innerHTML = `<button class="c-btn-primary" id="galery-media-btn-${i}" onclick="customActivity.goToPage(${i})">${i}</button>`;
            this.paginationDiv.appendChild(page);
        }

        document.querySelector('#galery-media-btn-'+ this.currentPage).classList.remove("c-btn-primary");
        document.querySelector('#galery-media-btn-'+ this.currentPage).classList.add("c-btn-secondary");


        let next = document.createElement("li");
        next.classList.add("page-item");
        next.innerHTML = `<button class="c-btn-primary" id="galery-media-btn-next" onclick="customActivity.goToPage(${this.currentPage + 1})">${i18next.t(`classroom.pagination.next`)}</button>`;
        this.paginationDiv.appendChild(next);
        //this.currentPage == this.totalPages ? document.querySelector('#galery-media-btn-next').disabled = true : document.querySelector('#galery-media-btn-next').disabled = false;
        if (this.currentPage == this.totalPages) {
            document.querySelector('#galery-media-btn-next').disabled = true
            document.querySelector('#galery-media-btn-next').classList.remove("c-btn-primary");
            document.querySelector('#galery-media-btn-next').style.backgroundColor = "#78787887";
        } else {
            document.querySelector('#galery-media-btn-next').disabled = false
            document.querySelector('#galery-media-btn-next').classList.add("c-btn-primary");
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.managePagination();
        this.manageDisplay();
    }

    displayItems() {
        document.getElementById("app-media-galery-container").innerHTML = "";
        if (this.normalMedia) {
            this.mediaItems.forEach((element, key) => {
                document.getElementById("app-media-galery-container").innerHTML += 
                                `<div class="card m-2 app-media-galery-item" style="width: 18rem;" data-name="${element}" style="display:none;">
                                    <img src="/classroom/assets/plugins/media/${Main.getClassroomManager()._createActivity.id}/${element.split('.')[0]}.jpg" class="card-img-top" onclick="customActivity.openPdfInModal('${element}')" alt="${element}">
                                    <div class="card-body align-self-center">
                                        <button class="btn btn-sm c-btn-primary" onclick="customActivity.selectMedia(${key})">Sélectionner ce document</button>
                                    </div>
                                </div>`;
            });
        } else {

            this.mediaItems.forEach((element, key) => {
                document.getElementById("app-media-galery-container").innerHTML += 
                                `<div class="card m-2 app-media-galery-item" style="width: 18rem;" data-name="${element.title}" style="display:none;">
                                    <p>${element.title}</p>
                                    <p>${element.difficulty}</p>
                                    <div class="card-body align-self-center">
                                        <button class="btn btn-sm c-btn-primary" onclick="customActivity.selectActivity(${element.exercises[0]})">Sélectionner ce document</button>
                                    </div>
                                </div>`;
            });
        }
    }

    openPdfInModal(pdf) {
        const divPdf = document.getElementById("pdf-preview-galery");
        divPdf.innerHTML = "";
        divPdf.innerHTML = `<embed width="100%" height="700" type="application/pdf" src="/classroom/assets/plugins/media/${Main.getClassroomManager()._createActivity.id}/${pdf}">`;
        pseudoModal.openModal("pdf-preview");
    }

    selectMedia(key) {
        this.selectedItem = `${location.origin}/classroom/assets/plugins/media/${Main.getClassroomManager()._createActivity.id}/${this.mediaItems[key].replaceAll(" ", "%20")}`;
        contentForward();
    }

    selectActivity(key) {
        let customSelect = this.manageCustomSelectGalery.filter(element => element[0] == this.appName)[0];
        let url = customSelect[1] + key;
        this.selectedItem = url;
        contentForward();
    }

    manageDisplay() {
        let items = document.getElementsByClassName("app-media-galery-item");
        for (let i = 0; i < items.length; i++) {
            if (i < (this.currentPage - 1) * this.itemsPagination || i >= this.currentPage * this.itemsPagination) {
                items[i].style.display = "none";
            } else {
                items[i].style.display = "flex";
            }
        }
    }

    populateGalery(appName = null, data = null) {
        if (appName != null) {
            customActivity.appName = appName;
        }
        document.getElementById("app-media-galery-container").innerHTML = "";

        if (data == null) {
            customActivity.normalMedia = true;
            customActivity.getGaleryWithMedia(customActivity.appName).then((res) => {
                customActivity.totalItems = res.length;
                customActivity.mediaItems = res;
                customActivity.displayItems();
                customActivity.managePagination();
                customActivity.manageDisplay();
            });
        } else {
            customActivity.normalMedia = false;
            customActivity.totalItems = data.length;
            customActivity.mediaItems = data;
            customActivity.displayItems();
            customActivity.managePagination();
            customActivity.manageDisplay(); 
        }
        navigatePanel("app-media-galery", "dashboard-activities-teacher");
    }


    getGaleryWithMedia(appName) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_file_names",
                data: {
                    appName: appName
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
}

const customActivity = new CustomActivity();
customActivity.init();

