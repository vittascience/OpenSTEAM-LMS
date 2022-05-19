
class Folders {
    /**
     * Creates an instance of Folders.
     * @public
     */
    constructor() {
        this.userFolders = [];
        this.viewModal = ["#create-folder-manager", "#delete-folder-manager", "#update-folder-manager"];
        this.actualFolder = null;
    }

    init() {
        this.getAllUserFolders().then(res => {
            this.userFolders = res;
        })
    }


    openFolderModal() {
        pseudoModal.openModal("folder-manager-modal");
        $("#create-folder-manager").show();
    }
    
    persistCreateFolder() {
        let name = $("#folder_create_name").val();
        this.createFolder(name).then(res => {
            if (!res.hasOwnProperty("error")) {
                pseudoModal.closeModal("folder-manager-modal");
            } else {
                console.log("error");
            }
        })
    }
    
    persistDeleteFolder() {
        let id = this.actualFolder;
        this.deleteFolderById(id).then(res => {
            if (!res.hasOwnProperty("error")) {
                pseudoModal.closeModal("folder-manager-modal");
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
                teacherActivitiesDisplay();
                pseudoModal.closeModal("folder-manager-modal");
            } else {
                console.log("error");
            }
        })
    }
    
    closeModalAndCleanInputFolder() {
        this.viewModal.forEach(view => {
            $(view).hide();
        });
        pseudoModal.closeModal("folder-manager-modal");
    }
    
    deleteFolder(folderId) {
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


    /**
     * XHR
     */

    createFolder($name, $image) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=create_folder",
                data: {
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

    updateFolderById(id, $name, $image) {
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
}
// 
const folders = new Folders();
folders.init();


