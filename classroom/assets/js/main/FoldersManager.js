
class FoldersManager {
    /**
     * Creates an instance of Folders.
     * @public
     */
    constructor() {
        this.userFolders = [];
        this.viewModal = ["#create-folder-manager", "#delete-folder-manager", "#update-folder-manager"];
        this.actualFolder = null;
        this.treeFolder = $("#breadcrumb");
        this.parent = null;
        this.objectToMove = null;
        this.objectId = null;
        this.isSeek = false;
        this.icons = {}
        this.lastElementOver = null;
        this.lastElementDragged = null;
    }

    init() {
        this.getAllUserFolders().then(res => {
            this.userFolders = res;
        });

        $('#dashboard-activities-teacher').on('click', () => {
            this.resetTreeFolders();
            if ($_GET('panel') == "classroom-dashboard-activities-panel-teacher") {
                this.createTreeFolders();
            }
        });

        $('body').on('click', '.folder-card', function () {
            if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
                let id = $(this).attr('data-id');
                foldersManager.openFolder(id);
            }
        });

        $('body').on('click', '.folder-list', function (event) {
            // Ignore clicks that come from dropdown buttons or their children
            if ($(event.target).closest('.dropdown').length > 0) {
                return;
            }
            
            if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
                let id = $(this).attr('data-id');
                foldersManager.openFolder(id);
            }
        });

        let showType = localStorage.getItem('classroomViewMode') ? localStorage.getItem('classroomViewMode') : "card";
        if (showType == "list") {
            $("#switcherCard").addClass("half-opacity");
            $("#switcherList").addClass("selected-display");
        } else {
            $("#switcherList").addClass("half-opacity");
            $("#switcherCard").addClass("selected-display");
        }
    }


    openFolderModal() {
        this.resetInputs();
        pseudoModal.openModal("folder-manager-modal");
        $("#create-folder-manager").show();
    }

    persistCreateFolder() {
        let name = $("#folder_create_name").val(),
            parent = this.actualFolder;

        if (name.length > 0 && name.length <= 31) {
            this.createFolder(name, parent).then(res => {
                if (!res.hasOwnProperty("error")) {
                    this.userFolders.push(res);
                    this.refreshSettings(this.actualFolder);
                    displayNotification('#notif-div', "classroom.activities.foldersMessages.created", "success");
                } else {
                    if (res.error == "folderNameInvalid") {
                        displayNotification('#notif-div', "classroom.activities.foldersMessages.errorLenght", "error");
                    } else {
                        displayNotification('#notif-div', "classroom.activities.foldersMessages.errorCreate", "error");
                    }
                }
            })
        } else {
            displayNotification('#notif-div', "classroom.activities.foldersMessages.errorLenght", "error");
        }
    }

    persistDeleteFolder() {
        let id = this.actualFolder,
            parent = this.getFolderById(this.actualFolder).parentFolder;

        if ($("#validation-delete-folder").val() == $("#validation-delete-folder").attr("placeholder")) {
            this.deleteFolderById(id).then(res => {
                if (!res.hasOwnProperty("error")) {
                    this.getAllUserFolders().then(res => {
                        this.refreshSettings();
                        this.userFolders = res;
                        let backToId = parent ? parent.id : null;
                        this.goToFolder(backToId);
                    })
                    displayNotification('#notif-div', "classroom.activities.foldersMessages.deleted", "success");
                } else {
                    displayNotification('#notif-div', "classroom.activities.foldersMessages.errorDelete", "error");
                }
            })
        } else {
            displayNotification('#notif-div', "manager.input.writeDelete", "error");
        }
    }

    persistUpdateFolder() {
        let id = this.actualFolder,
            name = $("#folder_update_name").val();

        this.updateFolderById(id, name).then(res => {
            if (!res.hasOwnProperty("error")) {
                this.replaceFolderData(res);
                let parentId = this.getFolderById(id).parentFolder != null ? this.getFolderById(id).parentFolder.id : null;
                this.refreshSettings(parentId);
                displayNotification('#notif-div', "classroom.activities.foldersMessages.updated", "success");
            } else {
                displayNotification('#notif-div', "classroom.activities.foldersMessages.errorUpdate", "error");
            }
        })
    }

    deleteFolder(folderId) {
        this.resetInputs();
        this.actualFolder = folderId;
        pseudoModal.openModal("folder-manager-modal");
        $("#delete-folder-manager").show();
        let inputValidate = document.getElementById("validation-delete-folder");
        inputValidate.focus();
    }

    updateFolder(folderId) {
        this.resetInputs();
        this.actualFolder = folderId;
        let folder = this.getFolderById(folderId);
        $("#folder_update_name").val(folder.name);
        pseudoModal.openModal("folder-manager-modal");
        $("#update-folder-manager").show();
    }

    refreshSettings(location = null) {
        this.parent = null;
        this.actualFolder = null;
        this.displayAndDragulaInitObjects();
        if (location) {
            this.goToFolder(location);
        }
        this.resetInputs();
    }

    resetInputs() {
        this.viewModal.forEach(view => {
            $(view).hide();
        });

        $("#folder_create_name").val("");
        $("#folder_update_name").val("");
        $("#folders-tree-content-modal").html("");
        $("#folders-seek-tree-content-modal").html("");
        $('#validation-delete-folder').val("");

        pseudoModal.closeAllModal();
    }

    seekFolderModal() {
        this.moveToFolderModal(null, null, true);
        pseudoModal.openModal("folders-seek");
    }

    persistGoToSelected() {
        let folderId = $("input[name='tree-structure']:checked").attr("data-id");
        if (folderId == "0") {
            folderId = null;
        }
        this.goToFolder(folderId);
        this.resetInputs();
    }
    /**
     * Utils
     */

    getFolderById(id) {
        return this.userFolders.find(folder => folder.id == id);
    }

    replaceFolderData(folder) {
        let index = this.userFolders.findIndex(f => f.id == folder.id);
        this.userFolders[index] = folder;
    }

    openFolder(folderId) {
        this.actualFolder = folderId;
        this.addTreeFolder(this.getFolderById(folderId));
        this.displayAndDragulaInitObjects();
    }

    addTreeFolder(folder) {
        if (this.treeFolder.html() == "") {
            this.resetTreeFolders();
        }

        let alreadyExist = this.returnIfFolderExist(folder.id);

        if (!alreadyExist) {
            this.treeFolder.append(`<span class="chevron-breadcrumb"> <i class="fas fa-chevron-right"></i> </span> <button class="btn c-btn-outline-primary folder-breadcrumb-item" data-id="${folder.id}" onclick="foldersManager.goToFolder(${folder.id})"><i class="fas fa-folder-open folder-breadcrumb"></i> ${folder.name}</button>`);
        }
    }

    goToFolder(folderId = null) {
        this.resetDashboardList();
        this.actualFolder = folderId;
        this.resetTreeFolders();

        // switch the panel if we're not on the activity panel without procing the navigatePanel function
        if ($_GET('panel') != 'classroom-dashboard-activities-panel-teacher') {
            $('.classroom-navbar-button').removeClass("active");
            $('.dashboard-block').hide();
            $('#classroom-dashboard-activities-panel-teacher').show();
            $('#dashboard-activities-teacher').addClass("active");
        }

        if (folderId != null) {
            this.createTreeFolders();
        }
        this.displayAndDragulaInitObjects();
    }

    returnIfFolderExist(folderId) {
        let breadCrumbFolderItems = document.querySelectorAll(".folder-breadcrumb-item"),
            alreadyExist = false;

        breadCrumbFolderItems.forEach(e => {
            if (e.dataset.id == folderId) {
                alreadyExist = true;
            }
        });
        return alreadyExist;
    }

    resetDashboardList() {
        document.getElementById("list-activities-teacher").innerHTML = "";
    }

    deleteFolderFromUserFolders(id) {
        let index = this.userFolders.findIndex(f => f.id == id);
        this.userFolders.splice(index, 1);
    }

    resetTreeFolders() {
        // only feed the breadcrumb when we're on the activity panel
        if ($_GET('nav') == 'dashboard-activities-teacher') {
            let translation = i18next.t("classroom.ids.classroom-dashboard-activities-panel-teacher");
            this.treeFolder.html(`<button class="btn c-btn-outline-primary" onclick="foldersManager.goToFolder(null)">${translation}</button>`);
        } else {
            this.treeFolder.html();
        }
    }

    createTreeFolders() {
        let actualFolder = this.getFolderById(this.actualFolder),
            idOfParents = [actualFolder],
            parent = null;

        if (actualFolder != null && actualFolder.parentFolder != undefined) {
            parent = actualFolder.parentFolder;
        }

        while (parent) {
            idOfParents.push(parent);
            parent = this.getFolderById(parent.id).parentFolder;
        }

        if (this.treeFolder.html() == "") {
            this.resetTreeFolders();
        }

        idOfParents.reverse().forEach(folder => {
            if (folder != null && folder.id != undefined) {
                this.treeFolder.append(`<span class="chevron-breadcrumb"> <i class="fas fa-chevron-right"></i> </span>  <button class="btn c-btn-outline-primary" onclick="foldersManager.goToFolder(${folder.id})"><i class="fas fa-folder-open folder-breadcrumb"></i> ${folder.name}</button>`);
            }
        });
    }

    async displayAndDragulaInitObjects() {
        let activities = await Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager());
        let folders = await this.getAllUserFolders();
        this.userFolders = folders;
        coursesManager.myCourses = await coursesManager._requestGetMyCourseTeacher();
        processDisplay();
        this.dragulaInitObjects();
    }

    createRandomString() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    moveToFolderModal(id, itemType, seek = false) {
        this.objectToMove = itemType;
        this.objectId = id;
        this.isSeek = seek;

        const foldersWithoutParent = this.userFolders.filter(folder => folder.parentFolder == null);
        let folderTreeContent = !seek ? $("#folders-tree-content-modal") : $("#folders-seek-tree-content-modal"),
            content = "",
            rootFolderTranslation = i18next.t("classroom.activities.rootFolder");

        folderTreeContent.html("");
        if (foldersWithoutParent.length > 0) {
            let randomString = this.createRandomString();
            content += `<ul id="folders-move-to-list">`;
            content += `<li>
                            <input type="radio" name="tree-structure" data-id="0" id="${randomString}">
                                <label for="${randomString}">${rootFolderTranslation}</label>
                            </input>
                            
                        `;
            foldersWithoutParent.forEach(folder => {
                content += this.makeContentForTree(folder);
            });

            content += `</li></ul>`;
        }
        folderTreeContent.html(content);
        pseudoModal.openModal("folders-move-to");
    }
    // ${seek ? "" : this.createChildActivitiesUl(null)}

    createChildUl(folder) {
        let children = this.userFolders.filter(f => f.parentFolder != null),
            content = "";
        children = children.filter(child => child.parentFolder.id == folder);
        if (children.length > 0) {
            content += `<li>`;
            children.forEach(child => {
                content += this.makeContentForTree(child);
            });
            content += `</li>`;
        }
        return content;
    }

    makeContentForTree(item) {
        let radioString = this.makeTreeWithOutInitialFolderAndChildren(item);
        let content = `<ul>
                        <li>${radioString}</li>
                        ${this.createChildUl(item.id)}
                    </ul>`
        return content;
    }
    // ${this.isSeek ? "" : this.createChildActivitiesUl(item.id)}

    makeTreeWithOutInitialFolderAndChildren(folder) {
        let content = "",
            randomString = this.createRandomString(),
            isOneOfParents = false,
            hasParentFolder = folder.parentFolder != null;

        // check if the folder is a parents of the actual folder
        let folderToCheck = folder;
        while (hasParentFolder) {
            let parentFolder = this.getFolderById(folderToCheck.parentFolder.id);
            if (parentFolder.id == this.objectId) {
                isOneOfParents = true;
            }
            hasParentFolder = parentFolder.parentFolder != null;
            if (hasParentFolder) {
                folderToCheck = parentFolder;
            }
        }
        if ((folder.id == this.objectId && this.isSeek == false) || (isOneOfParents && this.isSeek == false)) {
            content = `<label>📁 - ${folder.name}</label>`;
        } else {
            content = `<input type="radio" name="tree-structure" id="${randomString}" data-id="${folder.id}">
                       <label for="${randomString}"><i class="fas fa-folder-open folder-breadcrumb"></i> - ${folder.name}</label>`;
        }
        return content;
    }

    createChildActivitiesUl(folder) {
        let myActivities = Main.getClassroomManager()._myTeacherActivities,
            children = [],
            content = "";

        if (folder != null) {
            children = myActivities.filter(child => child.folder != null);
            children = children.filter(child => child.folder.id == folder);
        } else {
            children = myActivities.filter(child => child.folder == null);
        }

        if (children.length > 0) {
            content += `<ul>`;
            children.forEach(child => {
                content += `<li>
                                <label> <img src="${this.icons.hasOwnProperty(child.type) ? this.icons[child.type] : "💻"}" alt="${child.type}" class="folder-icons"> ${child.title}</label>
                            </li>`;
            });
            content += `</ul>`;
        }
        return content;
    }

    persistMoveToFolder() {
        let folderId = $("input[name='tree-structure']:checked").attr("data-id");
        if (folderId == "0") {
            folderId = null;
        }

        if (this.objectToMove == "folder") {
            this.moveFolderToFolder(this.objectId, folderId).then(res => {
                this.manageResponseFromMoved(res);
            })
        } else if (this.objectToMove == "activity") {
            this.moveActivityToFolder(this.objectId, folderId).then(res => {
                this.manageResponseFromMoved(res);
            })
        } else if (this.objectToMove == "course") {
            this.moveCourseToFolder(this.objectId, folderId).then(resMove => {
                coursesManager._requestGetMyCourseTeacher().then((res) => {
                    coursesManager.myCourses = res;
                    this.manageResponseFromMoved(resMove);
                });
            })
        }
        this.resetInputs();
    }

    manageResponseFromMoved(res) {
        if (!res.hasOwnProperty("error")) {
            this.getAllUserFolders().then(res => {
                this.userFolders = res;
                this.displayAndDragulaInitObjects();
                displayNotification('#notif-div', "classroom.activities.foldersMessages.movedTo", "success");
            })
        } else {
            displayNotification('#notif-div', "classroom.activities.foldersMessages.errorMovedTo", "success");
        }
    }

    dragulaInitObjects() {
        let droppableName = 'droppable-activityList'
        if (Main.getClassroomManager().droppable[droppableName] != undefined) {
            Main.getClassroomManager().droppable[droppableName].destroy();
        }

        Main.getClassroomManager().droppable[droppableName] = new Draggable.Draggable(document.querySelectorAll("#list-activities-teacher"), {
            draggable: "#list-activities-teacher>div",
            delay: {
                drag: 150,
                mouse: 150,
                touch: 150
            }
        });

        Main.getClassroomManager().droppable[droppableName].on("drag:over", (evt) => {
            this.lastElementOver = evt.data.over;
            this.lastElementDragged = evt.data.originalSource;

            if (Main.getClassroomManager().displayMode == "list") {
                if ($(container).hasClass("folder-item-list")) {
                    $(container).find(".folder-list").find(".list-folder-img-manager").attr("src", `${_PATH}assets/media/folders/folder_open_icon.svg`);
                    SVGInject($(container).find(".folder-list").find(".list-folder-img-manager"));
                }
            } else {
                if (evt.data.over.classList.contains("folder-item")) {
                    evt.data.over.querySelector(".folder-card").classList.add("folder-open");
                }
            }
        });

        Main.getClassroomManager().droppable[droppableName].on("drag:out", (evt) => {
            if (Main.getClassroomManager().displayMode == "list") {
                if ($(container).hasClass("folder-item-list")) {
                    $(container).find(".folder-list").find(".list-folder-img-manager").attr("src", `${_PATH}assets/media/folders/folder_close_icon.svg`);
                    SVGInject($(container).find(".folder-list").find(".list-folder-img-manager"));
                }
            } else {
                let folders = document.querySelectorAll(".folder-card.folder-open");
                folders.forEach(element => {
                    element.classList.remove("folder-open");
                });
            }
        });

        Main.getClassroomManager().droppable[droppableName].on("drag:stop", (evt) => {
            let source = this.lastElementDragged,
                target = this.lastElementOver;

            if (source == null || target == null) {
                evt.cancel();
                return;
            }

            if (source.dataset.id == target.dataset.id) {
                evt.cancel();
                return;
            }

            if ($(target).hasClass("folder-item") || $(target).hasClass("folder-item-list")) {
                let elId = source.getAttribute('data-id'),
                    targetId = target.getAttribute('data-id');
                
                if ($(source).hasClass("folder-item") || $(source).hasClass("folder-item-list")) {
                    foldersManager.moveFolderToFolder(elId, targetId).then(res => {
                        foldersManager.manageResponseFromMoved(res);
                    })
                } else if ($(source).hasClass("activity-item") || $(source).hasClass("activity-item-list")) {
                    foldersManager.moveActivityToFolder(elId, targetId).then(res => {
                        foldersManager.manageResponseFromMoved(res);
                    })
                } else if ($(source).hasClass("course-item") || $(source).hasClass("course-item-list")) {
                    foldersManager.moveCourseToFolder(elId, targetId).then(resMove => {
                        coursesManager._requestGetMyCourseTeacher().then((res) => {
                            coursesManager.myCourses = res;
                            foldersManager.manageResponseFromMoved(resMove);
                        });
                    })
                }
            }

            this.lastElementDragged = null;
            this.lastElementOver = null;
            evt.cancel();
        });
    }


    displayModeSwitch(display) {
        let switcherCard = document.getElementById("switcherCard"), 
            switcherList =  document.getElementById("switcherList");

        console.log("Display mode switch to: ", display);
        console.log(switcherCard, switcherList);
        if (display == "list") {
            switcherCard.classList.add("half-opacity");
            switcherCard.classList.remove("selected-display");

            switcherList.classList.remove("half-opacity");
            switcherList.classList.add("selected-display");



            Main.getClassroomManager().displayMode = "list";
            localStorage.setItem('classroomViewMode', "list");
            this.displayAndDragulaInitObjects();
        } else {
            switcherList.classList.add("half-opacity");
            switcherList.classList.remove("selected-display");
            switcherCard.classList.remove("half-opacity");
            switcherCard.classList.add("selected-display");
            Main.getClassroomManager().displayMode = "card";
            localStorage.setItem('classroomViewMode', "card");
            this.displayAndDragulaInitObjects();
        }
    }


    /**
     * XHR
    */

    createFolder($name, $parent = null) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=create_folder",
                data: {
                    name: $name,
                    parent: $parent
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

    deleteFolderById(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=delete_folder",
                data: {
                    id: id,
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

    updateFolderById(id, $name) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=update_folder",
                data: {
                    id: id,
                    name: $name
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

    getAllUserFolders() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=get_all_user_folders",
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    moveActivityToFolder(activityId, folderId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=moveActiToFolder",
                data: {
                    activityId: activityId,
                    folderId: folderId
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

    moveFolderToFolder(folderId, destinationFolderId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=moveFolderToFolder",
                data: {
                    folderId: folderId,
                    destinationFolderId: destinationFolderId
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

    moveCourseToFolder(courseId, folderId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=moveCourseToFolder",
                data: {
                    courseId: courseId,
                    folderId: folderId
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
// Initialize
const foldersManager = new FoldersManager();
foldersManager.init();


