
class Folders {
    /**
     * Creates an instance of Folders.
     * @public
     */
    constructor() {
        this.userFolders = [];
        this.viewModal = ["#create-folder-manager", "#delete-folder-manager", "#update-folder-manager"];
        this.actualFolder = null;
        this.treeFolder = $("#breadcrumb");
        this.dragula = null;
        this.parent = null;
    }

    init() {
        this.dragula = dragula();
        this.getAllUserFolders().then(res => {
            this.userFolders = res;
            setTimeout(() => {
                this.dragulaInitObjects();
            }, 1000);
        })

        $('#dashboard-activities-teacher').on('click', () => {
            this.resetTreeFolders();
        })

        $('body').on('click', '.folder-card', function () {
            if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
                let id = $(this).attr('data-id');
                folders.openFolder(id);
            }
        })
    }

    openFolderModal() {
        pseudoModal.openModal("folder-manager-modal");
        $("#create-folder-manager").show();
    }
    
    persistCreateFolder() {
        let name = $("#folder_create_name").val(),
            parent = this.actualFolder;
        this.createFolder(name, parent).then(res => {
            if (!res.hasOwnProperty("error")) {
                this.userFolders.push(res);
                this.closeModalAndCleanInputFolder();
            } else {
                console.log("error");
            }
        })
    }
    
    persistDeleteFolder() {
        let id = this.actualFolder,
            parent = this.getFolderById(this.actualFolder).parentFolder;

        this.deleteFolderById(id).then(res => {
            if (!res.hasOwnProperty("error")) {
                this.getAllUserFolders().then(res => {
                    this.closeModalAndCleanInputFolder();
                    this.userFolders = res;
                    this.displayAndDragulaInitObjects();
                    let backToId = parent ? parent.id : null;
                    this.goToFolder(backToId);
                })
            } else {
                console.log("error");
            }
        })
    }
    
    persistUpdateFolder() {
        let id = this.actualFolder,
            name = $("#folder_update_name").val();
            
        this.updateFolderById(id, name).then(res => {
            if (!res.hasOwnProperty("error")) {
                this.replaceFolderData(res);
                this.closeModalAndCleanInputFolder();
            } else {
                console.log("error");
            }
        })
    }
    
    closeModalAndCleanInputFolder() {
        this.viewModal.forEach(view => {
            $(view).hide();
        });
        $("#folder_create_name").val("");
        $("#folder_update_name").val("");
        this.parent = null;
        this.actualFolder = null;
        this.displayAndDragulaInitObjects();
        pseudoModal.closeModal("folder-manager-modal");
    }
    
    deleteFolder(folderId) {
        this.actualFolder = folderId;
        pseudoModal.openModal("folder-manager-modal");
        $("#delete-folder-manager").show();
    }

    updateFolder(folderId) {
        this.actualFolder = folderId;
        let folder = this.getFolderById(folderId);
        $("#folder_update_name").val(folder.name);
        pseudoModal.openModal("folder-manager-modal");
        $("#update-folder-manager").show();
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
        this.treeFolder.append(`<button class="btn tree-folders-items" onclick="folders.goToFolder(${folder.id})">📁 ${folder.name}</button>`);  
    }

    goToFolder(folderId) {
        this.actualFolder = folderId;
        this.resetTreeFolders();
        if (folderId != null) {
            this.createTreeFolders();
        }
        this.displayAndDragulaInitObjects();
    }

    deleteFolderFromUserFolders(id) {
        let index = this.userFolders.findIndex(f => f.id == id);
        this.userFolders.splice(index, 1);
    }

    resetTreeFolders() {
        this.treeFolder.html(`<button class="btn tree-folders-items" onclick="folders.goToFolder(null)">Mes activités</button>`);
    }

    createTreeFolders() {
        let actualFolder = this.getFolderById(this.actualFolder),
            idOfParents = [actualFolder],
            parent = actualFolder.parentFolder;
        
        while (parent) {
            idOfParents.push(parent);
            parent = this.getFolderById(parent.id).parentFolder;
        }

        idOfParents.reverse().forEach(folder => {
            this.treeFolder.append(`<button class="btn tree-folders-items" onclick="folders.goToFolder(${folder.id})">📁 ${folder.name}</button>`);
        });
    }

    displayAndDragulaInitObjects() {
        Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager()).then(() => {
            teacherActivitiesDisplay();
            this.dragulaInitObjects();
        });
    }


    dragulaInitObjects() {


        // Reset the dragula fields
        this.dragula.containers = [];
        //this.dragula.containers.push(document.querySelector('#list-activities-teacher'));
        let foldersArray = document.querySelectorAll('.folder-item');
        let activitiesArray = document.querySelectorAll('.activity-item');

        this.dragula = dragula([...activitiesArray, ...foldersArray])
            .on('drop', function(el, target, source) {
                if (target != undefined && source != undefined) {
                    if (target.className == "folder-item") {
                        let elId = source.getAttribute('data-id'),
                            targetId = target.getAttribute('data-id');
                        
                        if (source.className == "folder-item") {
                           folders.moveFolderToFolder(elId, targetId).then(res => {
                                if (!res.hasOwnProperty("error")) {
                                    folders.getAllUserFolders().then(res => {
                                        folders.userFolders = res;
                                        folders.displayAndDragulaInitObjects();
                                    })
                                } else {
                                    console.log("error");
                                }
                            })
                        } else {
                            folders.moveActivityToFolder(elId, targetId).then(res => {
                                if (!res.hasOwnProperty("error")) {
                                    folders.getAllUserFolders().then(res => {
                                        folders.userFolders = res;
                                        folders.displayAndDragulaInitObjects();
                                    })
                                } else {
                                    console.log("error");
                                }
                            })
                        }
                    } else {
                        folders.displayAndDragulaInitObjects();
                    }
                } else {
                    folders.displayAndDragulaInitObjects();
                }
            }).on('shadow', function(el) { 
                el.remove();
            }).on('cancel', function() {
                folders.displayAndDragulaInitObjects();
            })
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
}
// Initialize
const folders = new Folders();
folders.init();


