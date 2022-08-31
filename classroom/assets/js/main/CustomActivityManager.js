class CustomActivity {
    constructor() {
        this.activityAndCase = [

        ];
        
        this.activityAndCaseView = [

        ];

        this.ContentForwardCustom = [

        ];

        this.appName = "plume";
        this.itemsPagination = 10;
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalItems = 0;
    }

    init() {
        document.getElementById("apps-file-search").addEventListener("input", () => {
            let search = document.getElementById("apps-file-search").value;
            let items = document.getElementsByClassName("app-media-galery-item");
            for (let i = 0; i < items.length; i++) {
                if (items[i].getAttribute("data-name").toLowerCase().includes(search.toLowerCase())) {
                    items[i].style.display = "flex";
                } else {
                    items[i].style.display = "none";
                }
            }
        });
    }

    populateGalery(appName = null) {
        if (appName != null) {
            this.appName = appName;
        }
        document.getElementById("app-media-galery-container").innerHTML = "";
        this.getGaleryWithMedia(this.appName).then((res) => {
            res.forEach((element) => {
                document.getElementById("app-media-galery-container").innerHTML += `
                    <div class="app-media-galery-item col-4" data-name="${element}">
                        <a href="/classroom/assets/media/apps_media/${this.appName}/${element}"><i class="fas fa-file-pdf"></i> ${element}</a>
                    </div>`;
            });
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