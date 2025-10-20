/**
 * managerManager
 * Copyright 2021 Vittascience.
 * https://vittascience.com
 *
 */

/**
 * @class managerManager
 * @author: COINTE Rémi
 */
class managerManager {
    /**
     * Creates an instance of managerManager.
     * @public
     */
    constructor(tableSelector = '#usersTable') {
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
        this._defaultRestrictions = [];

        this.tableSelector = tableSelector;
        this.dt = null;

        this.groupFilter = {};
        this.initialPage = 1;
        this.initialLen = 25;
        this.initialSort = 'id';


        this.tableSelector = tableSelector;
        this.dt = null;

        this.groupFilter = {};
        this.extraFilters = {};

        this.initialPage = 1;
        this.initialLen = 25;
        this.initialSort = 'id';
    }

    /**
     * GROUPS FUNCTION
     */

    isAdmin() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=is_user_admin",
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Get actual group informations
     * Access with Main.getmanagerManager()._actualGroupInfos
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

    // Fetch all the groups and store them in "_comboGroups"
    getAllGroups() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_groups",
                success: function (response) {
                    resolve(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    // fetch all the groups in the page and store them in "_allGroups"
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
                    let groupsRes = JSON.parse(response);
                    mainManager.getmanagerManager()._allGroups = groupsRes;
                    mainManager.getmanagerManager().showGroupsInTable((JSON.parse(response)));

                    // do not do another request to get the groups for the combo box
                    groupsRes.pop();
                    mainManager.getmanagerManager()._comboGroups = groupsRes;
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Récupère des utilisateurs paginés avec recherche/tri/filters.
     *
     * @param {Object}   [opts]
     * @param {number}   [opts.page=1]               Page courante (1-based)
     * @param {number}   [opts.nusers=25]            Nombre d'items par page (1..200)
     * @param {string?}  [opts.search=null]          Recherche globale: firstname, surname, email, groupName
     * @param {string}   [opts.sort='id']            Champ de tri (ex: 'id','email','groupName','premiumEnd'...)
     * @param {('asc'|'desc')} [opts.dir='asc']      Direction de tri
     * @param {Object}   [opts.filters={}]           Filtres avancés
     *
     * Filtres disponibles (extraits principaux) :
     * - newsletter, is_active, is_admin, teacher: boolean (true/false)
     * - email, email~, firstname, firstname~, surname, surname~, isFromSSO, isFromSSO~
     * - isFromSSO = 'null' | 'notnull'              (équivaut à isFromSSO:null / :notnull)
     *
     * Filtres Groupe :
     * - groupId: number                             (users dans ce groupe)
     * - groupIdIn: number[] | "1,5,9"               (users dans l’un de ces groupes)
     * - groupName: string                           (égalité stricte)
     * - groupName~: string                          (LIKE)
     * - hasGroup: boolean                           (au moins un groupe actif)
     * - group: 'null' | 'notnull'                   (sans/avec groupe actif)
     *
     * @returns {Promise<Object|null>}               Réponse JSON { page, perPage, search, sort, dir, filters, result }
     */
    async fetchUserMetaSearchUpdated({
        page = 1,
        nusers = 100,
        search = null,
        sort = 'id',
        dir = 'asc',
        filters = {}
    } = {}) {
        const payload = { page, nusers, search, sort, dir, filter: filters };

        try {
            const response = await fetch('/routing/Routing.php?controller=user&action=user-meta-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            console.log('Résultat :', result);
            return result;
        } catch (error) {
            console.error('Erreur lors de la requête :', error);
            return null;
        }
    }


    // fetch all the applications linked to the group
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

    getAllActivitiesRestrictions($application_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_activities_restrictions_applications",
                data: {
                    application_id: $application_id
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
     * @param {*} $restriction_id 
     * @returns promise
     */
    getActivityRestrictionFromApp($application_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_restriction_activity_applications",
                data: {
                    application_id: $application_id
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
     * @param {*} $restriction_id 
     * @returns promise
     */
    getDefaultRestrictions() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_default_restrictions",
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
     * @returns promise
     */
    getDefaultActivitiesRestrictions() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_default_activities_restrictions",
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
     * @returns promise
     */
    getDefaultGroupsRestrictions() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_default_groups_restrictions",
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
     * @returns promise
     */
    getDefaultUsersRestrictions() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_default_users_restrictions",
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
     * @returns promise
     */
    updateDefaultUsersRestrictions($maxStudents, $maxClassrooms) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_default_users_restrictions",
                data: {
                    maxStudents: $maxStudents,
                    maxClassrooms: $maxClassrooms
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
     * @returns promise
     */
    updateDefaultGroupsRestrictions($maxStudents, $maxTeachers, $maxPerTeachers, $maxClassrooms) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_default_groups_restrictions",
                data: {
                    maxStudents: $maxStudents,
                    maxTeachers: $maxTeachers,
                    maxPerTeachers: $maxPerTeachers,
                    maxClassrooms: $maxClassrooms,
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

    getApplicationById($application_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_application_by_id",
                data: {
                    application_id: $application_id
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

    updateApplication($application_id, $application_name, $application_description, $application_image, $lti_data, $application_color, $restriction_max, $application_sort_index) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_application",
                data: {
                    application_id: $application_id,
                    application_name: $application_name,
                    application_description: $application_description,
                    application_color: $application_color,
                    application_image: $application_image,
                    restriction_max: $restriction_max,
                    lti_data: JSON.stringify($lti_data),
                    application_sort_index: $application_sort_index
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

    deleteApplication($application_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=delete_application",
                data: {
                    application_id: $application_id
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


    createApplication($application_name, $application_description, $application_image, $lti_data, $application_color, $restriction_max, $application_sort_index) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=create_application",
                data: {
                    application_name: $application_name,
                    application_description: $application_description,
                    application_image: $application_image,
                    application_description: $application_description,
                    application_color: $application_color,
                    restriction_max: $restriction_max,
                    lti_data: JSON.stringify($lti_data),
                    application_sort_index: $application_sort_index
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

    // Add a group
    createGroup($group_description, $group_name, $group_app, $global_restriction) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=create_group",
                data: {
                    name: $group_name,
                    description: $group_description,
                    applications: $group_app,
                    global_restriction: $global_restriction
                },
                success: function (response) {
                    resolve(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        })
    };

    /**
     * @param {int} $group_id 
     * @param {string} $group_name 
     * @param {string} $group_description 
     * @param {array} $group_app 
     * @returns {object} response
     */
    updateGroup($group_id, $group_name, $group_description, $group_app, $global_restriction) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_group",
                data: {
                    id: $group_id,
                    name: $group_name,
                    description: $group_description,
                    applications: $group_app,
                    global_restriction: $global_restriction
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
    updateUserApps($user_id, $user_app, $global_user_restriction) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_user_app",
                data: {
                    user_id: $user_id,
                    user_app: $user_app,
                    global_user_restriction: $global_user_restriction
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

    createUserAndLinkToGroup($firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $is_admin, $is_teacher, $teacher_grade, $teacher_suject, $school, $apps) {
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
                    grade: $teacher_grade,
                    subject: $teacher_suject,
                    mail: $mail,
                    school: $school,
                    apps: JSON.stringify($apps)
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

    updateUser($user_id, $firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $is_admin, $is_teacher, $teacher_grade, $teacher_suject, $school, $is_active, $application) {
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
                    grade: $teacher_grade,
                    subject: $teacher_suject,
                    mail: $mail,
                    school: $school,
                    isactive: $is_active,
                    application: $application
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

    mapColToField(index) {
        switch (index) {
            case 0: return 'surname';
            case 1: return 'firstname';
            case 2: return 'email';
            case 3: return 'newsletter';
            case 4: return 'isFromSSO';
            case 5: return 'groupRights';
            // case 6: 'apps' non triable → on ne mappe pas
            case 7: return 'premium';      // 👉 tri par statut premium (1/0)
            // si tu préfères trier par date de fin premium :
            // case 7: return 'premiumEnd';
            default: return 'id';
        }
    }

    renderRights(rights) {
        if (rights === '1' || rights === 1)
            return `<i class="fas fa-crown fa-2x c-text-gold" title="Admin"></i>`;
        if (rights === '0' || rights === 0)
            return `<i class="fas fa-user fa-2x c-text-primary" title="Teacher"></i>`;
        return `<i class="fas fa-question fa-2x" title="No rights"></i>`;
    }

    renderPremium(p) {
        if (!p?.active) return '—';
        const end = p?.dateEnd ? new Date(p.dateEnd) : null;
        if (!end) return 'Premium';
        return end < new Date() ? 'Premium expired' : 'Premium';
    }

    init() {
        if (this.dt) {
            this.dt.destroy();
            this.dt = null;
        }

        const self = this;

        this.dt = new DataTable(this.tableSelector, {
            serverSide: true,
            processing: true,
            paging: true,
            pageLength: this.initialLen,
            lengthChange: false,
            searching: true,
            ordering: true,

            columns: [
                { title: 'Nom', data: null, orderable: true, render: row => row.surname || '' },
                { title: 'Prénom', data: null, orderable: true, render: row => row.firstname || '' },
                { title: 'Email', data: null, orderable: true, render: row => row.email || '' },
                { title: 'Newsletter', data: null, orderable: true, class: 'text-center', render: row => this.renderNewsletter(row.newsletter) },
                { title: 'From SSO', data: null, orderable: true, class: 'text-center', render: row => this.renderSSO(row.isFromSSO) },
                { title: 'Droits', data: null, orderable: false, class: 'text-center', render: row => this.renderRights(row) },
                {
                    title: 'Apps', data: null, orderable: false, render: row => (row.applications || []).map(a =>
                        `<img src="${a?.image || 'assets/media/no-app-icon.svg'}" alt="${a?.name || ''}" title="${a?.name || ''}" style="max-height:24px;" class="mx-1">`
                    ).join('')
                },
                { title: 'Premium', data: null, orderable: true, class: 'text-center', render: row => this.renderPremium(row.premiumData) },
                {
                    title: 'Actions',
                    data: null,
                    orderable: false,
                    class: 'text-center',
                    render: row => {
                        const btnReset = `
                            <a class="c-link-primary mx-1" href="javascript:void(0)" 
                                onclick="resetUserPassword(${row.id})" title="Reset password">
                                <i class="fas fa-redo-alt"></i>
                            </a>`;

                        const btnEdit = `
                            <a class="c-link-secondary mx-1" href="javascript:void(0)" 
                                onclick="showupdateUserModal(${row.id})" title="Edit user">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;

                        const btnDelete = (row.is_active == 1)
                            ? `<button class="btn btn-sm text-warning mx-1" 
                                        onclick="disableUser(${row.id})" 
                                        title="Disable user">
                                <i class="fas fa-lock"></i>
                                </button>`
                            : `<button class="btn btn-sm text-danger mx-1" 
                                        onclick="deleteUser(${row.id})" 
                                        title="Delete user">
                                <i class="fas fa-trash"></i>
                                </button>`;

                        return `
                            <div class="d-flex justify-content-center align-items-center">
                                ${btnReset}
                                ${btnEdit}
                                ${btnDelete}
                            </div>`;
                    }
                }
            ],

            ajax: async function (dtParams, callback) {
                try {
                    const start = Number(dtParams.start) || 0;
                    const length = Number(dtParams.length) || self.initialLen;
                    const page = Math.floor(start / length) + 1;

                    let sortField = self.initialSort;
                    let dir = 'asc';
                    if (Array.isArray(dtParams.order) && dtParams.order.length) {
                        const o = dtParams.order[0];
                        sortField = self.mapColToField(o.column);
                        dir = (o.dir === 'desc') ? 'desc' : 'asc';
                    }

                    const searchValue = (dtParams.search && dtParams.search.value) ? dtParams.search.value.trim() : null;

                    const payload = {
                        page,
                        nusers: length,
                        search: searchValue || null,
                        sort: sortField,
                        dir,
                        // 👇 merge groupe + checkboxes ici
                        filter: self._currentFilters()
                    };

                    // (debug) console.log('[DT payload]', payload);

                    const res = await fetch('/routing/Routing.php?controller=user&action=user-meta-search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!res.ok) {
                        const t = await res.text();
                        console.error('HTTP error', res.status, t);
                        callback({ data: [], recordsTotal: 0, recordsFiltered: 0, error: 'HTTP ' + res.status });
                        return;
                    }

                    const json = await res.json();
                    const items = json?.result?.items || [];
                    const total = Number(json?.result?.total ?? 0);
                    const filtered = Number(json?.result?.filtered ?? total);

                    // (option) header groupe
                    const gName = items.find(u => u.group?.name)?.group?.name;
                    const title = document.getElementById('group_name_from_table');
                    if (title) {
                        if (self.groupFilter?.group === 'null') title.textContent = 'Enseignants sans groupe';
                        else title.textContent = gName || 'Tous les utilisateurs';
                    }

                    callback({
                        data: items,
                        recordsTotal: total,
                        recordsFiltered: filtered,
                        draw: dtParams.draw
                    });
                } catch (e) {
                    console.error('DataTables ajax error', e);
                    callback({ data: [], recordsTotal: 0, recordsFiltered: 0, error: String(e?.message || e) });
                }
            },
            rowCallback: (row, data) => {
                if (data.is_admin == 1 || data.is_admin === true) {
                    row.classList.add('user-admin-row');
                } else {
                    row.classList.remove('user-admin-row');
                }
            }
        });

        if (this.initialPage > 1) {
            const start = (this.initialPage - 1) * this.initialLen;
            this.dt.page(start / this.initialLen).draw(false);
        }
    }

    showGroup(group_id, page, userspp, sort) {
        if (Number(group_id) === -1) this.groupFilter = { group: 'null' };
        else if (Number(group_id) > 0) this.groupFilter = { groupId: Number(group_id) };
        else this.groupFilter = { hasGroup: true };

        this.initialPage = Number(page) || 1;
        this.initialLen = Number(userspp) || 25;
        this.initialSort = (typeof sort === 'string' ? sort : 'id');

        this.init(); // la table repart avec filters = groupFilter + extraFilters (vides ici)
    }

    renderNewsletter(n) {
        const yes = (n === 1 || n === '1' || n === true);
        return yes ? `<i class="fas fa-envelope text-secondary icon-table-size"></i>` : `-`;
    }

    renderSSO(val) {
        if (!val) return `-`;
        if (val === 'google') return `<i class="fab fa-google text-secondary icon-table-size"></i>`;
        if (val === 'microsoft') return `<i class="fab fa-microsoft text-secondary icon-table-size"></i>`;
        if (val === 'apple') return `<i class="fab fa-apple text-secondary icon-table-size"></i>`;
        if (val.toLowerCase().includes('saml')) return `<i class="fab fa-keycdn text-secondary icon-table-size"></i>`;
        return `<span class="badge bg-info text-dark">${String(val)}</span>`;
    }

    renderPremium(p) {
        if (!p?.active)
            return `<span class="badge bg-secondary">Free</span>`;

        const end = p?.dateEnd ? new Date(p.dateEnd) : null;
        const type = p?.primaryType || 'Premium';
        const label = this.getPremiumType(type);
        const now = new Date();

        if (!end)
            return `<span class="badge bg-success">${label}</span>`;

        const expired = end < now;
        const badgeClass = expired ? 'bg-warning text-dark' : 'bg-success';
        const dateText = end.toLocaleDateString();

        return `
            <div class="premium-cell">
                <span class="badge ${badgeClass}">${label}${expired ? ' (expiré)' : ''}</span>
                <div class="premium-date">${dateText}</div>
            </div>
        `;
    }


    getPremiumType(type) {
        if (type == "LegacyPersonalPremium") {
            type = "Ancien premium"
        } else if (type == "PersonalPremium") {
            type = "Premium"
        } else if (type == "Group") {
            type = "Premium Éducation"
        } else {
            type = "Standard"
        }
        return type;
    }

    renderRights(row) {
        const r = row?.group?.rights;
        if (r === 1 || r === '1') {
            return `<i class="fas fa-crown text-secondary icon-table-size"></i>`;
        }
        if (r === 0 || r === '0') {
            return `<i class="fas fa-user icon-table-size"></i>`;
        }
        return `-`;
    }


    _currentFilters() {
        return { ...this.groupFilter, ...this.extraFilters };
    }

    // Appelé par la barre de filtres
    setExtraFilters(obj) {
        this.extraFilters = { ...obj };
        // recharge la table (sans re-créer)
        if (this.dt) this.dt.ajax.reload(null, true);
    }

    // Lie les checkboxes à this.extraFilters
    bindFilters(containerId = 'userFilters') {
        const root = document.getElementById(containerId);
        if (!root) return;

        const $admin = root.querySelector('#flt-admin');
        const $newsletter = root.querySelector('#flt-newsletter');
        const $premium = root.querySelector('#flt-premium');
        const $fromsso = root.querySelector('#flt-fromsso');
        const $clear = root.querySelector('#flt-clear');

        const apply = () => {
            const f = {};
            // bool côté backend : 1/0
            if ($admin?.checked) f.is_admin = 1;
            if ($newsletter?.checked) f.newsletter = 1;
            if ($premium?.checked) f.premium = 1;
            // fromSSO: on veut "présents uniquement" -> notnull
            if ($fromsso?.checked) f.isFromSSO = 'notnull';

            this.setExtraFilters(f);
        };

        [$admin, $newsletter, $premium, $fromsso].forEach(el => {
            el?.addEventListener('change', apply);
        });

        $clear?.addEventListener('click', () => {
            [$admin, $newsletter, $premium, $fromsso].forEach(el => { if (el) el.checked = false; });
            this.setExtraFilters({});
        });
    }


    showGroupsInTable(table) {
        let data_table = "",
            users_sort = $('#sort_users_filter').val(),
            users_per_page = $('#users_per_page').val();

        data_table +=
            `<tr tabindex="0" 
                onclick="showGroupMembers(-1, 1 ,${users_per_page}, ${users_sort})" 
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showGroupMembers(-1, 1 ,${users_per_page}, ${users_sort});}"
                aria-label="Voir les utilisateurs sans groupe">
                <th scope="row">${i18next.t('manager.group.usersWithoutGroups')}</th>
                <td>${i18next.t('manager.group.usersWithoutGroupsDescription')}</td>
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
                mainManager.getmanagerManager()._paginationGroupsInfo = element;
                let sort = $('#sort_groups_filter').val(),
                    groupsperpage = $('#groups_per_page').val(),
                    htmlButtons = "";

                if (element.totalPagesCount > 1) {
                    if (element.previousPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" tabindex="0" 
                            onclick="mainManager.getmanagerManager().getAllGroupsInfos(${sort}, 1, ${groupsperpage})" 
                            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();mainManager.getmanagerManager().getAllGroupsInfos(${sort}, 1, ${groupsperpage});}"
                            aria-label="Aller à la première page">First Page</button>`;
                    }
                    if (element.currentPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" tabindex="0" 
                            onclick="mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.previousPage}, ${groupsperpage})" 
                            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.previousPage}, ${groupsperpage});}"
                            aria-label="Aller à la page ${element.previousPage}">${element.previousPage}</button>`;
                    }
                    htmlButtons += `<button class="btn btn-primary btn-sm active mx-2" tabindex="0" aria-label="Page actuelle ${element.currentPage}" aria-current="page">${element.currentPage}</button>`;
                    if (element.currentPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" tabindex="0" 
                            onclick="mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.nextPage}, ${groupsperpage})" 
                            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.nextPage}, ${groupsperpage});}"
                            aria-label="Aller à la page ${element.nextPage}">${element.nextPage}</button>`;
                    }
                    if (element.nextPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" tabindex="0" 
                            onclick="mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.totalPagesCount}, ${groupsperpage})" 
                            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.totalPagesCount}, ${groupsperpage});}"
                            aria-label="Aller à la dernière page (page ${element.totalPagesCount})">Last Page - ${element.totalPagesCount}</button>`;
                    }
                }

                $('#paginationButtons_groups').html(htmlButtons);
            } else {
                // Affiche simplement l'id des applcatations pour le moment

                let div_img = ""
                if (element.hasOwnProperty('applications')) {
                    element.applications.forEach(element_2 => {
                        if (element_2.image != null && element_2.image != "") {
                            div_img += `<img src="${element_2.image}" data-bs-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                        } else {
                            div_img += `<img src="assets/media/no-app-icon.svg" data-bs-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                        }
                    });
                }
                data_table +=
                    `<tr tabindex="0" 
                        onclick="showGroupMembers(${element.id}, 1 ,${users_per_page}, ${users_sort})" 
                        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showGroupMembers(${element.id}, 1 ,${users_per_page}, ${users_sort});}"
                        aria-label="Voir les membres du groupe ${element.name}">
                        <th scope="row">${element.name}</th>
                        <td>${element.description}</td>
                        <td>
                            ${div_img}
                        </td>
                        <td>
                            ${element.nbUsers}
                        </td>
                        <td>
                            <a class="c-link-secondary" href="javascript:void(0)" tabindex="0" 
                               onclick="showupdateGroupModal(${element.id})" 
                               onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showupdateGroupModal(${element.id});}"
                               aria-label="Modifier le groupe ${element.name}">
                                <i class="fas fa-pencil-alt fa-2x" aria-hidden="true"></i>
                            </a>
                        </td>
                        <td>
                            <a class="c-link-red" href="javascript:void(0)" tabindex="0" 
                               onclick="deleteGroup(${element.id})" 
                               onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();deleteGroup(${element.id});}"
                               aria-label="Supprimer le groupe ${element.name}">
                                <i class="fas fa-trash-alt fa-2x" aria-hidden="true"></i>
                            </a>
                        </td>
                    </tr>`;
            }
        });
        $('#groups_table_manager').html(data_table);
        $('[data-bs-toggle="tooltip"]').tooltip()
    }

    searchGroup($name, $page, $groupspp) {
        const process = (res) => {
            let data_table = "",
                users_sort = $('#sort_users_filter').val(),
                users_per_page = $('#users_per_page').val();
            res.forEach(element => {
                let App = "";

                if (element.hasOwnProperty('currentPage')) {
                    mainManager.getmanagerManager()._paginationGroupsInfo = element;
                    let sort = $('#sort_groups_filter').val(),
                        groupperpage = $('#groups_per_page').val(),
                        htmlButtons = "";

                    if (element.totalPagesCount > 1) {
                        if (element.previousPage > 1) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().searchGroup(${sort}, 1, ${groupperpage})">First Page</button>`;
                        }
                        if (element.currentPage > 1) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().searchGroup(${sort}, ${element.previousPage}, ${groupperpage})">${element.previousPage}</button>`;
                        }
                        htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                        if (element.currentPage < element.totalPagesCount) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().searchGroup(${sort}, ${element.nextPage}, ${groupperpage})">${element.nextPage}</button>`;
                        }
                        if (element.nextPage < element.totalPagesCount) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().searchGroup(${sort}, ${element.totalPagesCount}, ${groupperpage})">Last Page - ${element.totalPagesCount}</button>`;
                        }
                    }
                    $('#paginationButtons_groups').html(htmlButtons);
                } else {
                    // Affiche simplement l'id des applcatations pour le moment
                    let div_img = ""
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(element_2 => {
                            if (element_2.image != null && element_2.image != "") {
                                div_img += `<img src="${element_2.image}" data-bs-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            } else {
                                div_img += `<img src="assets/media/no-app-icon.svg" data-bs-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            }
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
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateGroupModal(${element.id})" aria-label="Modifier le groupe ${element.name}"><i class="fas fa-pencil-alt fa-2x" aria-hidden="true"></i></a>
                            </td>
                            <td>
                                <a class="c-link-red" href="javascript:void(0)" onclick="deleteGroup(${element.id})" aria-label="Supprimer le groupe ${element.name}"><i class="fas fa-trash-alt fa-2x" aria-hidden="true"></i></a>
                            </td>
                        </tr>`;
                }
            });
            $('#groups_table_manager').html(data_table);
            $('[data-bs-toggle="tooltip"]').tooltip()

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
