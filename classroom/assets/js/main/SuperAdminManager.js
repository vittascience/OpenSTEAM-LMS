/**
 * SuperAdminManager
 * Copyright 2021 Vittascience.
 * https://vittascience.com
 *
 *
 * This class purpose to manage the resources.
 */

/**
 * @class SuperAdminManager
 * @author: COINTE Rémi
 */
class SuperAdminManager {
    /**
     * Creates an instance of SuperAdminManager.
     * @public
     */
    constructor() {
        this._allGroups = []
        this._comboGroups = []
        this._addedCreateUserGroup = 0
        this._updatedUserGroup = 0
        this._allActualUsers = []
        this._allMembersAndTheirGroups = []
        this._paginationUsersInfo = []
        this._paginationGroupsInfo = []
        this._allApplications = []
        this._actualGroup = 0
        this._actualUser = 0
        this._actualUserDetails = []
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
    getGroupInfos($group_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_group_info",
                data: {
                    id: $group_id
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
    getAllGroups() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_groups",
                success: function (response) {
                    MSA.getSuperAdminManager()._comboGroups = JSON.parse(response);
                    resolve(JSON.parse(response))
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
                url: "/routing/Routing.php?controller=superadmin&action=panel_groups_info",
                data: {
                    sort: $sort,
                    page: $page,
                    groupspp: $groupspp
                },
                success: function (response) {
                    MSA.getSuperAdminManager()._allGroups = JSON.parse(response);
                    MSA.getSuperAdminManager().showGroupsInTable((JSON.parse(response)));
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
                url: "/routing/Routing.php?controller=superadmin&action=get_all_applications_from_group",
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

    getAllApplications() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_applications",
                success: function (response) {
                    resolve(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    // Ajout d'un groupe
    createGroup($group_description, $group_name, $group_app) {
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=create_group",
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
    };

    /**
     * @param {int} $group_id 
     * @param {string} $group_name 
     * @param {string} $group_description 
     * @param {array} $group_app 
     * @returns {object} response
     */
    updateGroup($group_id, $group_name, $group_description, $group_app) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_group",
                data: {
                    id: $group_id,
                    name: $group_name,
                    description: $group_description,
                    applications: $group_app
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

    /**
     * @param {int} $group_id 
     * @returns {object} response
     */
    deleteGroup($group_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=delete_group",
                data: {
                    id: $group_id
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

    /**
     * Update the user's applications
     * @param {int} $user_id 
     * @param {array} $user_app 
     * @returns 
     */
    updateUserApps($user_id, $user_app) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_user_app",
                data: {
                    user_id: $user_id,
                    user_app: $user_app
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

    /**
     * @param {int} $id 
     * @returns 
     */
    getAdminFromGroup($id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_admin_from_group",
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

    getAllAdmins() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_admins",
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    createUserAndLinkToGroup($firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $is_admin, $is_teacher, $teacher_grade, $teacher_suject, $school, $is_active) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=create_user",
                data: {
                    groups: JSON.stringify($groups),
                    surname: $surname,
                    firstname: $firstname,
                    pseudo: $user_pseudo,
                    phone: $phone,
                    bio: $bio,
                    admin: $is_admin,
                    teacher: $is_teacher,
                    grade: parseInt($teacher_grade) + 1,
                    subject: parseInt($teacher_suject) + 1,
                    mail: $mail,
                    school: $school,
                    isactive: $is_active
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

    updateUser($user_id, $firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $is_admin, $is_teacher, $teacher_grade, $teacher_suject, $school, $is_active) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_user",
                data: {
                    user_id: $user_id,
                    groups: JSON.stringify($groups),
                    surname: $surname,
                    firstname: $firstname,
                    pseudo: $user_pseudo,
                    phone: $phone,
                    bio: $bio,
                    admin: $is_admin,
                    teacher: $is_teacher,
                    grade: parseInt($teacher_grade) + 1,
                    subject: parseInt($teacher_suject) + 1,
                    mail: $mail,
                    school: $school,
                    isactive: $is_active
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

    disableUser($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=disable_user",
                data: {
                    user_id: $user_id,
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

    deleteUser($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=delete_user",
                data: {
                    user_id: $user_id,
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

    deleteUserFromGroup($group_id, $user_id) {
        const process = (data) => {
            console.log(JSON.parse(response));
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=delete_user_from_froup",
            data: {
                user_id: $user_id,
                group_id: $group_id
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    }

    getUserInfo($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_user_info",
                data: {
                    id: $user_id
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

    getUserInfoWithHisGroups($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_user_info_with_his_groups",
                data: {
                    id: $user_id
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

    showGroupMembers($group_id, $page, $userspp, $sort) {
        MSA.getSuperAdminManager()._actualGroup = $group_id;
        const process = (data) => {
            let $data_table = "",
                group = "";

            MSA.getSuperAdminManager()._allActualUsers = [];

            MSA.getSuperAdminManager()._allGroups.forEach(element => {
                if (element.id == $group_id)
                    group = element;
            });

            if ($group_id == -1)
                $('#group_name_from_table').text('Utilisateurs sans groupe');
            else if ($group_id == -2)
                $('#group_name_from_table').text('Utilisateurs inactifs et non regular');
            else
                $('#group_name_from_table').text(group.name);



            data.forEach(element => {
                if (element.hasOwnProperty('currentPage')) {
                    MSA.getSuperAdminManager()._paginationUsersInfo = element;
                    let usersperpage = $('#users_per_page').val(),
                        htmlButtons = "",
                        sort = $('#sort_users_filter').val();;

                    if (element.previousPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().showGroupMembers(${$group_id}, 1, ${usersperpage}, ${sort})">First Page</button>`;
                    }
                    if (element.currentPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().showGroupMembers(${$group_id}, ${element.previousPage}, ${usersperpage}, ${sort})">${element.previousPage}</button>`;
                    }
                    htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                    if (element.currentPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().showGroupMembers(${$group_id}, ${element.nextPage}, ${usersperpage}, ${sort})">${element.nextPage}</button>`;
                    }
                    if (element.nextPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().showGroupMembers(${$group_id}, ${element.totalPagesCount}, ${usersperpage}, ${sort})">Last Page - ${element.totalPagesCount}</button>`;
                    }
                    $('#paginationButtons_users').html(htmlButtons);
                } else {

                    MSA.getSuperAdminManager()._allActualUsers.push(element);

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

                    let rowDelete = "";
                    if ($group_id == -2)
                        rowDelete = `<button class = "btn btn-danger btn-sm" data-i18n="superadmin.buttons.delete" onclick="deleteUser(${element.id})"> Delete </button>`;
                    else
                        rowDelete = `<button class = "btn btn-danger btn-sm" data-i18n="superadmin.buttons.disable" onclick="disableUser(${element.id})"> Disabled </button>`;

                    $data_table +=
                        `<tr>
                            <td>${element.surname}</td>
                            <td>${element.firstname}</td>
                            <td>${$droits}</td>
                            <td>${div_img}</td>
                            <td>
                                <button class="btn btn-info btn-sm" data-i18n="superadmin.buttons.reset" onclick="resetUserPassword(${element.id})">Send</button>
                            </td>
                            <td>
                                <button class="btn btn-warning btn-sm" data-i18n="superadmin.buttons.update" onclick="showupdateUserModal(${element.id})">Update</button>
                            </td>
                            <td>
                                ${rowDelete}
                            </td>
                        </tr>`;
                }
            });
            $('#table_info_group_data').html($data_table);
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=get_all_members_from_group",
            data: {
                id: $group_id,
                page: $page,
                userspp: $userspp,
                sort: $sort
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    }

    globalSearchUser($name, $page, $usersperpage) {
        const process = (res) => {
            MSA.getSuperAdminManager()._allActualUsers = [];
            let $data_table = "";
            $('#group_name_from_table').text('Résultat de la recherche :');
            res.forEach(element => {
                if (element.hasOwnProperty('currentPage')) {
                    MSA.getSuperAdminManager()._paginationUsersInfo = element;
                    let name = $('#name_user_search').val(),
                        usersperpage = $('#users_per_page').val(),
                        htmlButtons = "";

                    if (element.previousPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().globalSearchUser(${name}, 1, ${usersperpage})">First Page</button>`;
                    }
                    if (element.currentPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().globalSearchUser(${name}, ${element.previousPage}, ${usersperpage})">${element.previousPage}</button>`;
                    }
                    htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                    if (element.currentPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().globalSearchUser(${name}, ${element.nextPage}, ${usersperpage})">${element.nextPage}</button>`;
                    }
                    if (element.nextPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().globalSearchUser(${name}, ${element.totalPagesCount}, ${usersperpage})">Last Page - ${element.totalPagesCount}</button>`;
                    }

                    $('#paginationButtons_users').html(htmlButtons);
                } else {
                    MSA.getSuperAdminManager()._allActualUsers.push(element);
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
                                <button class="btn btn-info btn-sm" data-i18n="superadmin.buttons.reset" onclick="resetUserPassword(${element.id})">Send</button>
                            </td>
                            <td>
                                <button class="btn btn-warning btn-sm" data-i18n="superadmin.buttons.update" onclick="showupdateUserModal(${element.id})">Update</button>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-sm" data-i18n="superadmin.buttons.delete" onclick="disableUser(${element.id})">Delete</button>
                            </td>
                        </tr>`;
                }
            });
            $('#table_info_group_data').html($data_table);
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=global_search_user_by_name",
            data: {
                name: $name,
                page: $page,
                userspp: $usersperpage,
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    }

    showGroupsInTable(table) {
        let data_table = "",
            users_sort = $('#sort_users_filter').val(),
            users_per_page = $('#users_per_page').val();

        data_table +=
            `<tr>
                <th scope="row" onclick="showGroupMembers(-2, 1 ,${users_per_page}, ${users_sort})">Utilisateurs inactifs et/ou non regular</i></th>
                <td>Groupement d'utilisateurs inactifs et/ou non regular</td>
                <td>
                    --
                </td>
                <td>
                    --
                </td>
                <td>
                    --
                </td>
            </tr>
            <tr>
                <th scope="row" onclick="showGroupMembers(-1, 1 ,${users_per_page}, ${users_sort})">Utilisateurs sans groupe</i></th>
                <td>Groupement d'utilisateurs n'étant liés à aucun groupe</td>
                <td>
                    --
                </td>
                <td>
                    --
                </td>
                <td>
                    --
                </td>
            </tr>`;

        table.forEach(element => {
            if (element.hasOwnProperty('currentPage')) {
                MSA.getSuperAdminManager()._paginationGroupsInfo = element;
                let sort = $('#sort_groups_filter').val(),
                    groupsperpage = $('#groups_per_page').val(),
                    htmlButtons = "";

                if (element.previousPage > 1) {
                    htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().getAllGroupsInfos(${sort}, 1, ${groupsperpage})">First Page</button>`;
                }
                if (element.currentPage > 1) {
                    htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().getAllGroupsInfos(${sort}, ${element.previousPage}, ${groupsperpage})">${element.previousPage}</button>`;
                }
                htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                if (element.currentPage < element.totalPagesCount) {
                    htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().getAllGroupsInfos(${sort}, ${element.nextPage}, ${groupsperpage})">${element.nextPage}</button>`;
                }
                if (element.nextPage < element.totalPagesCount) {
                    htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().getAllGroupsInfos(${sort}, ${element.totalPagesCount}, ${groupsperpage})">Last Page - ${element.totalPagesCount}</button>`;
                }

                $('#paginationButtons_groups').html(htmlButtons);
            } else {
                // Affiche simplement l'id des applcatations pour le moment

                let div_img = ""
                if (element.hasOwnProperty('applications')) {
                    element.applications.forEach(element_2 => {
                        div_img += `<img src="assets/media/${element_2.image}" alt="Icône App">`;
                    });
                }
                data_table +=
                    `<tr>
                <th scope="row" onclick="showGroupMembers(${element.id}, 1 ,${users_per_page}, ${users_sort})">${element.name}</i></th>
                <td>${element.description}</td>
                <td>
                    ${div_img}
                </td>
                <td>
                    <button class="btn btn-warning btn-sm" data-i18n="superadmin.buttons.update" onclick="showupdateGroupModal(${element.id})">Update</button>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" data-i18n="superadmin.buttons.delete" onclick="deleteGroup(${element.id})">Delete</button>
                </td>
                </tr>`;
            }
        });
        $('#groups_table_superadmin').html(data_table);
    }

    searchGroup($name, $page, $groupspp) {
        const process = (res) => {
            let data_table = "",
                users_sort = $('#sort_users_filter').val(),
                users_per_page = $('#users_per_page').val();
            res.forEach(element => {
                let App = "";

                if (element.hasOwnProperty('currentPage')) {
                    MSA.getSuperAdminManager()._paginationGroupsInfo = element;
                    let sort = $('#sort_groups_filter').val(),
                        groupperpage = $('#groups_per_page').val(),
                        htmlButtons = "";


                    if (element.previousPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().searchGroup(${sort}, 1, ${groupperpage})">First Page</button>`;
                    }
                    if (element.currentPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().searchGroup(${sort}, ${element.previousPage}, ${groupperpage})">${element.previousPage}</button>`;
                    }
                    htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                    if (element.currentPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().searchGroup(${sort}, ${element.nextPage}, ${groupperpage})">${element.nextPage}</button>`;
                    }
                    if (element.nextPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="MSA.getSuperAdminManager().searchGroup(${sort}, ${element.totalPagesCount}, ${groupperpage})">Last Page - ${element.totalPagesCount}</button>`;
                    }

                    $('#paginationButtons_groups').html(htmlButtons);
                } else {
                    // Affiche simplement l'id des applcatations pour le moment
                    let div_img = ""
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(element_2 => {
                            div_img += `<img src="assets/media/${element_2.image}" alt="Icône App">`;
                        });
                    }
                    data_table +=
                        `<tr>
                            <th scope="row" onclick="showGroupMembers(${element.id}, 1 ,${users_per_page}, ${users_sort})">${element.name}</i></th>
                            <td>${element.description}</td>
                            <td>
                                ${div_img}
                            </td>
                            <td>
                                <button class="btn btn-warning btn-sm" data-i18n="superadmin.buttons.update" onclick="showupdateGroupModal(${element.id})">Update</button>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-sm" data-i18n="superadmin.buttons.delete" onclick="deleteGroup(${element.id})">Delete</button>
                            </td>
                        </tr>`;
                }
            });
            $('#groups_table_superadmin').html(data_table);
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=search_group_by_name",
            data: {
                name: $name,
                page: $page,
                groupspp: $groupspp
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    }

    // Send a reset password request by mail to the user
    sendResetPassword($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=send_request_reset_user_password",
                data: {
                    user_id: $user_id,
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

}