/**
 * SuperAdminManager
 * Copyright 2020 Vittascience.
 * https://vittascience.com
 *
 *
 * This class purpose to manage the resources.
 */

/**
 * @class GroupAdminManager
 * @author: Clemenard (Clément Menard)
 */
class GroupAdminManager {
    /**
     * Creates an instance of GroupAdminManager.
     * @public
     */
    constructor() {
        this._allGroups = []
        this._addedCreateUserGroup = 0
        this._comboGroups = []
        this._paginationUsersInfo = []
        this._paginationGroupsInfo = []
        this._actualGroup = []
        this._tasksQueue = [];
        this._isExecutingTaskInQueue = false;
    }

    /**
     * Add a task to the queue and execute the queue manager
     * @param {function} task - Function that perform an xhr
     */
    _addTaskToQueue(task) {
        this._tasksQueue.push(task);
        this._executeTasksInQueue();
    }

    /**
     * Loop in the queue and execute queued taks one after another. If the executing loop is already in progress, doesn't do anything.
     */
    async _executeTasksInQueue() {
        // Return if the loop is already in progress.
        if (this._isExecutingTaskInQueue)
            return;
        // Change the state to currently executing the loop
        this._isExecutingTaskInQueue = true;
        // Loop in the queue by shifting tasks and executing them one by one (awaiting for a task to end before looping again)
        while (this._tasksQueue.length > 0) {
            let currentTask = this._tasksQueue.shift();
            await new Promise((resolve, reject) => {
                try {
                    currentTask(resolve);
                } catch (error) {
                    console.warn(error);
                    resolve();
                }
            });
        }
        // When the loop has ended (no more task in the queue), change the state to currently idle
        this._isExecutingTaskInQueue = false;
    }

    /**
     * GROUPS FUNCTION
     */

    /**
     * Get actual group informations
     * Access with Main.getSuperAdminManager()._actualGroupInfos
     * @public
     * @returns {Array}
     */
    getGroupsUserAdmin() {
        const process = (data) => {
            let data_table = "";
            MGA.getGroupAdminManager()._comboGroups = data;
            data.forEach(element => {
                // Affiche simplement l'id des applcatations pour le moment
                let div_img = ""
                if (element.hasOwnProperty('applications')) {
                    element.applications.forEach(element_2 => {
                        div_img += `<img src="assets/media/${element_2.image}" alt="Icône App">`;
                    });
                }
                data_table +=
                    `<tr>
                        <th scope="row" onclick="MGA.getGroupAdminManager().getUsersFromGroup(${element.id},1)">${element.name}</i></th>
                        <td>${element.description}</td>
                        <td>
                            ${div_img}
                        </td>
                    </tr>`;
                $('#groups_table_groupadmin').html(data_table);
            });
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=groupadmin&action=get_all_groups_where_user_is_admin",
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                console.log('error');
            }
        });
    }

    getUsersFromGroup(group_id, page) {
        MGA.getGroupAdminManager()._actualGroup = group_id;

        let sort = $('#sort_users_filter_groupadmin').val(),
            usersPerPage = $('#users_per_page_groupadmin').val();
        const process = (data) => {
            let $data_table = "";
            data.forEach(element => {

                if (element.hasOwnProperty('currentPage')) {
                    let htmlButtons = "";
                    if (element.previousPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MGA.getGroupAdminManager().getUsersFromGroup(${group_id}, 1)">First Page</button>`;
                    }
                    if (element.currentPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MGA.getGroupAdminManager().getUsersFromGroup(${group_id}, ${element.previousPage})">${element.previousPage}</button>`;
                    }
                    htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                    if (element.currentPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MGA.getGroupAdminManager().getUsersFromGroup(${group_id}, ${element.nextPage})">${element.nextPage}</button>`;
                    }
                    if (element.nextPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MGA.getGroupAdminManager().getUsersFromGroup(${group_id}, ${element.totalPagesCount})">Last Page - ${element.totalPagesCount}</button>`;
                    }
                    $('#paginationButtons_users_groupadmin').html(htmlButtons);
                } else {
                    let $droits = " -- ";
                    if (element.hasOwnProperty('rights')) {
                        $droits = element.rights === "1" ? "Admin" : "Prof";
                    }

                    let div_img = ""
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(element_2 => {
                            div_img += `<img src="assets/media/${element_2.image}" alt="Icône App">`;
                        });
                    }
                    $data_table +=
                        `<tr>
                        <td>${element.surname}</td>
                        <td>${element.firstname}</td>
                        <td>${$droits}</td>
                        <td>${div_img}</td>
                        <td>
                            <button class="btn btn-info btn-sm" onclick="console.log(${element.id})">Send</button>
                        </td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="showupdateUserModal_groupadmin(${element.id})">Update</button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser_groupadmin(${element.id})">Delete</button>
                        </td>
                    </tr>`;
                }
            });
            $('#table_info_group_data_groupadmin').html($data_table);
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=groupadmin&action=get_all_users_in_group",
            data: {
                group_id: group_id,
                sort: sort,
                userspp: usersPerPage,
                page: page
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                console.log('error');
            }
        });
    }


    // Récupère tous les groupes et les stocks dans le select "select_groups"
    getAllGroups() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=get_all_groups_where_user_is_admin",
                success: function (response) {
                    resolve(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    createUserAndLinkToGroup($firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $is_teacher, $teacher_grade, $teacher_suject, $school) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=create_user",
                data: {
                    groups: JSON.stringify($groups),
                    surname: $surname,
                    firstname: $firstname,
                    pseudo: $user_pseudo,
                    phone: $phone,
                    bio: $bio,
                    teacher: $is_teacher,
                    grade: parseInt($teacher_grade) + 1,
                    subject: parseInt($teacher_suject) + 1,
                    mail: $mail,
                    school: $school
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    // Récupère tous les groupes et les stocks dans le select "select_groups"
    getAllGroupsInfos($sort, $page, $groupspp) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=panel_groups_info",
                data: {
                    sort: $sort,
                    page: $page,
                    groupspp: $groupspp
                },
                success: function (response) {
                    MainSuperAdmin.getSuperAdminManager()._allGroups = JSON.parse(response);
                    MainSuperAdmin.getSuperAdminManager().showGroupsInTable((JSON.parse(response)));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    getApplicationsFromGroup($id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=get_all_applications_from_group",
                data: {
                    id: $id
                },
                success: function (response) {
                    resolve(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /*     getAllApplications() {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=groupadmin&action=get_all_applications",
                    success: function (response) {
                        resolve(JSON.parse(response))
                    },
                    error: function () {
                        reject();
                    }
                });
            })
        } */

    /*     // Ajout d'un groupe
        createGroup($group_description, $group_name, $group_app) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=create_group",
                data: {
                    name: $group_name,
                    description: $group_description,
                    applications: $group_app
                },
                success: function (response) {
                    console.log(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        }; */

    // Modifier d'un groupe
    updateGroup($group_id, $group_name, $group_description, $group_app) {
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=groupadmin&action=update_group",
            data: {
                id: $group_id,
                name: $group_name,
                description: $group_description,
                applications: $group_app
            },
            success: function (response) {
                console.log(JSON.parse(response))
            },
            error: function () {
                reject();
            }
        });
    }
    /*     // Supprime un groupe
        deleteGroup($group_id) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=delete_group",
                data: {
                    id: $group_id
                },
                success: function (response) {
                    console.log(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        } */


    // Supprime un groupe
    deleteUser($user_id) {
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=groupadmin&action=delete_user",
            data: {
                id: $user_id
            },
            success: function (response) {
                console.log(JSON.parse(response))
            },
            error: function () {
                reject();
            }
        });
    }
}