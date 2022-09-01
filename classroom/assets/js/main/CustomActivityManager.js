class CustomActivity {
    constructor() {
        // activity added by plugins
        this.activityAndCase = [
            ["free", freeValidateActivity, true],
            ["reading", defaultProcessValidateActivity, false],
            ["fillIn", fillInValidateActivity, true],
            ["quiz", quizValidateActivity, true],
            ["dragAndDrop", dragAndDropValidateActivity, true],
        ];

        this.activityAndCaseView = [
            ['free', "#activity-free"],
            ['quiz', "#activity-quiz"],
            ['fillIn', "#activity-fill-in"],
            ['reading', "#activity-reading"],
            ['custom', "#activity-reading"],
            ['dragAndDrop', "#activity-drag-and-drop"],
        ];
        this.ContentForwardCustom = [

        ];


        this.appName = null;
        this.mediaItems = [];
        this.itemsPagination = 12;
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalItems = 0;
        this.paginationDiv = document.getElementById("app-media-galery-pagination");
        this.selectedItem = null;

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
        if (this.currentPage == 1) {
            previous.classList.add("disabled");
        }
        previous.innerHTML = `<button class="page-link" onclick="customActivity.goToPage(${this.currentPage - 1})">Previous</button>`;
        this.paginationDiv.appendChild(previous);


        for (let i = 1; i <= this.totalPages; i++) {
            let page = document.createElement("li");
            page.classList.add("page-item");
            page.innerHTML = `<button class="page-link" onclick="customActivity.goToPage(${i})">${i}</button>`;
            this.paginationDiv.appendChild(page);
        }


        let next = document.createElement("li");
        next.classList.add("page-item");
        if (this.currentPage == this.totalPages) {
            next.classList.add("disabled");
        }
        next.innerHTML = `<button class="page-link" onclick="customActivity.goToPage(${this.currentPage + 1})">Next</button>`;
        this.paginationDiv.appendChild(next);
    }

    goToPage(page) {
        this.currentPage = page;
        this.managePagination();
        this.manageDisplay();
    }

    displayItems() {
        document.getElementById("app-media-galery-container").innerHTML = "";
        this.mediaItems.forEach((element, key) => {
           document.getElementById("app-media-galery-container").innerHTML += `
               <div class="app-media-galery-item col-4 p-2 flex-column" data-name="${element}" style="display:none;">
                    <div class="row mx-auto">
                        <a href="/classroom/assets/media/apps_media/${this.appName}/${element}"><i class="fas fa-file-pdf"></i> ${element}</a>
                    </div>
                    <div class="row mx-auto">
                        <button class="btn btn-sm btn-primary" onclick="customActivity.selectMedia(${key})">Sélectionner ce document</button>
                    </div>
               </div>`;
       });
    }

    selectMedia(key) {
        this.selectedItem = this.mediaItems[key].replaceAll(" ", "%20");
        const itemPath = `/classroom/assets/media/apps_media/${this.appName}/${this.selectedItem}`;
        console.log(itemPath);
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

    populateGalery(appName = null) {
        if (appName != null) {
            this.appName = appName;
        }
        console.log(appName);
        document.getElementById("app-media-galery-container").innerHTML = "";
        customActivity.getGaleryWithMedia(this.appName).then((res) => {
            customActivity.totalItems = res.length;
            customActivity.mediaItems = res;
            customActivity.displayItems();
            customActivity.managePagination();
            customActivity.manageDisplay();
        });
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

