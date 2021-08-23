const BASE_STUDENT_FORM = `<div class="green-form row col-12">
        
<label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
<input class="col-5 student-form-name" type="text">
</div>`;
const LINK_REGEX = /(\[iframe\].*link=)([a-f0-9]{13})/
const NO_CLASS = "<p class='no-classes'> Vous devez d'abord créer une classe pour pouvoir utiliser cette fonctionalité"
const classroomModals = {
    'import-csv': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudentByCsv.title'
        },
        content: `<div class="text-center mx-auto w-100 mh-100 mb-2">
                    <p><span data-i18n="classroom.modals.addStudentByCsv.description"></span><a data-i18n="classroom.modals.addStudentByCsv.csvTemplate" href="${_PATH}assets/media/csv_template.csv"></a> - <a data-i18n="classroom.modals.addStudentByCsv.csvTemplateNoPassword" href="${_PATH}assets/media/csv_template_nopw.csv"></a>.</p>
                    <input type="file" id="importcsv-fileinput" name="importcsvfileinput"/><br>
                    <button class="btn c-btn-secondary mt-2" onclick="importLearnerCsv()">
                        <i class="fas fa-file-csv"></i> 
                        <span data-i18n="classroom.modals.addStudentByCsv.importStudentByCsvButton">Importer les apprenants</span>
                    </button>
                </div>`,
        footer: ``
    },
    'export-csv': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.exportCsv.title'
        },
        content: `
            <div class="text-center mx-auto w-100 mh-100 mb-2">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <p data-i18n="classroom.modals.exportCsv.exportLearnersDescription"></p>
                    <button class="btn c-btn-secondary mt-2" onclick="exportLearnerCsv()">
                        <i class="fa fa-download" aria-hidden="true"></i> 
                        <span data-i18n="classroom.modals.exportCsv.exportLearners">Exporter la liste des apprenants</span>
                    </button>
                    <div class="d-flex justify-content-center modal-separator mt-4 mb-4">
                        <span data-i18n="classroom.modals.addActivity.orSeparator">OU</span>
                    </div>
                    <p data-i18n="classroom.modals.exportCsv.exportDashboardDescription"></p>
                    <button class="btn c-btn-secondary mt-2" onclick="exportDashboardCsv()">
                        <i class="fa fa-download" aria-hidden="true"></i> 
                        <span data-i18n="classroom.modals.exportCsv.exportDashboard">Exporter le tableau de bord</span>
                    </button>
                </div>
            </div>`,
        footer: ``
    },
    'settings-student-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.settingsTeacher.title'
        },
        content: `<h4 data-i18n="classroom.modals.settingsTeacher.lang">Langue</h4>
        <div id="switch-lang-list" class="justify-content-center">
            <img class="flags-item" alt="flag" src="assets/media/flags/fr.png" onclick="changeLang('fr')">
            <img class="flags-item" alt="flag" src="assets/media/flags/en.png" onclick="changeLang('en')">
        </div>
        <h4 data-i18n="classroom.modals.settingsTeacher.password">Mot de passe</h4>
        <p class="text-center" data-i18n="classroom.modals.settingsTeacher.passwordDescription"></p>
        <div class="d-flex justify-content-center">
            <div class="pwd-display-stud pwd-display-stud-modal" href="#">
                <input type="password" readonly class="modal-pwd" id="password-display-area"><i class="classroom-clickable fas fa-low-vision ml-2 password-display-toggler"></i>
            </div>
            
            <button class="btn c-btn-secondary" id="pwd-change-modal">Réinitialiser <i class="fas fa-chevron-right"></i></button>`,
        footer: ``
    },
    'settings-teacher-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.settingsTeacher.title'
        },
        /*  <h4>Choisir une image de profil</h4>
                    <input type="checkbox" id="firstletter-teach-setting"><label>Première lettre de mon nom</label></br>
                    <input type="file" id="avatar" name="avatar"accept="image/png, image/jpeg"><label style="margin-left: 1em;font-size: 1em;">Importer une image de profil</label></br>
                          
                    <h4>Notifications mail</h4>
                    <input type="checkbox" id="action-teach-setting" ><label>Je souhaite être informé de toute action dans mes classes</label></br>
                    <input type="checkbox" id="abstract-teach-setting" ><label>Je souhaite recevoir un résumé quotidien</label></br>
                    <input type="checkbox" id="nonotif-teach-setting" ><label>Je ne souhaite pas recevoir de notification par mail</label></br>
                    */
        content: `<div>

                    <h4 data-i18n="classroom.modals.settingsTeacher.lang">Langue</h4>
                    <div id="switch-lang-list" class="justify-content-center">
                    <img class="flags-item" alt="flag" src="assets/media/flags/fr.png" onclick="changeLang('fr')">
                    <img class="flags-item" alt="flag" src="assets/media/flags/en.png" onclick="changeLang('en')">
                    </div>
                    <h4 data-i18n="classroom.modals.settingsTeacher.description">Pour modifier votre mot de passe ou d'autres paramètres de votre compte</h4>
                    <div class="d-flex flex-column align-items-center">
                        <button class="btn c-btn-primary" id="teacher-account-button" onclick="openTeacherAccountPanel()">
                            <span data-i18n="classroom.modals.settingsTeacher.accessButton">Accéder à votre profil</span>
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    </div>
                </div>`,
        footer: ``
    },
    'attribute-activity-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'modals.classroom.attributeActivity.title'
        },
        content: `
    <h4>Sélectionner des apprenants</h4>
    <p><span class="student-number">0</span> apprenants sélectionnés</p>
    <div id="list-student-attribute-modal" class="row"></div>
    <button id="attribute-activity-to-students-close" class="btn btn-lg c-btn-secondary">Valider</button>
                `,
        footer: ``
    },
    'list-classes-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.listClass.title'
        },
        content: `
        <p data-i18n="classroom.modals.listClass.description">Vous pouvez tester en toute simplicité l'interface en tant qu'apprenant, et revenir à tout moment à votre profil d'enseignant. La progression en tant qu'apprenant sera sauvegardée sur le compte Vittademo.</p>
        <div id="list-classes" class=""></div>
        <button class="btn  mb-2 c-btn-primary" id="mode-student-check" onclick="modeApprenant()" > <span class="mr-1" data-i18n="classroom.modals.listClass.switchButton">Passer en mode apprenant</span> <i class="fas fa-cog"></i></button>
                `,
        footer: ``
    },
    'share-project-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'modals.classroom.shareProject.title'
        },
        content: `
    <h4>Sélectionner des apprenants</h4>
    <p><span class="student-number">0</span> apprenants sélectionnés</p>
    <div id="list-student-share-modal" class="row"></div>
    <button id="share-project-to-students-close" class="btn btn-lg c-btn-primary">Valider</button>
                `,
        footer: ``
    },
    'add-activity-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addActivity.title'
        },
        content: `<div class="d-flex flex-column justify-content-center align-items-center">
    <div class="d-flex"><h4 data-i18n="classroom.modals.addActivity.attributeActivity.title">Attribuer une activité en cliquant sur l'icône</h4></div>
    <button class="btn btn-lg c-btn-primary" onclick="goToActivityPanel()"><span data-i18n="classroom.modals.addActivity.attributeActivity.button">Attribuer </span><i class="fas fa-chevron-right"></i></button>
    <div class="d-flex justify-content-center modal-separator mt-4 mb-4"><span data-i18n="classroom.modals.addActivity.orSeparator"></span></div>
    <h4 data-i18n="classroom.modals.addActivity.createActivity.title">Créer une activité puis l'attribuer</h4>
    <button class="btn btn-lg c-btn-secondary" onclick="goToCreateActivityPanel()"><span data-i18n="classroom.modals.addActivity.createActivity.button">Créer une activité </span><i class="fas fa-chevron-right"></i></button>
    </div>
                `,
        footer: ``
    },
    'update-pseudo-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.changePseudo.title'
        },
        content: `
    <h4 data-i18n="classroom.modals.changePseudo.description">Modifier le pseudo</h4>
    <input class="change-pseudo-modal" type="text">
    <button id="update-pseudo-close" class="btn btn-lg c-btn-primary" data-i18n="classroom.modals.changePseudo.validateButton">Valider</button>
                `,
        footer: ``
    },
    'add-student-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudent.title'
        },
        content: `
        <div id="add-student-div" class=">
        <div class="c-primary-form row col-12">
        
        <label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
        <input class="col-5 student-form-name" type="text">
    </div></div>
    <button class="save-student-in-classroom c-btn-primary m-3"><i class="fas fa-save"></i> <span class="ml-1" data-i18n="classroom.modals.addStudent.addStudentButton">Ajouter l'apprenant</span></button>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <div class="d-flex justify-content-center modal-separator mt-4 mb-4">
            <span data-i18n="classroom.modals.addActivity.orSeparator">OU</span>
        </div>
        <button class="btn c-btn-secondary" onclick="openCsvModal();">
            <span data-i18n="classroom.modals.addStudent.addStudentByCsvButton">Ajouter un fichier d'apprenants (.csv)</span><i class="fas fa-chevron-right ml-1"></i>
        </button>
    </div>`,
        footer: ``
    },
    'superadmin-create-group': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudentByCsv.title'
        },
        content: `  <div class="form-group">
                        <label for="group_name">Group name</label>
                        <input type="text" class="form-control" id="group_name">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Group description</label>
                        <input type="text" class="form-control" id="group_desc">
                    </div>
                    <div class="form-group" id="group_apps_options">
                    </div>
                    <button class="btn btn-primary" onclick="createGroupWithModal()">Create</button>`,
        footer: ``
    },
    'superadmin-update-group': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudentByCsv.title'
        },
        content: `  <div class="form-group">
                        <label for="group_name">Group name</label>
                        <input type="text" class="form-control" id="upd_group_name">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Group description</label>
                        <input type="text" class="form-control" id="upd_group_desc">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Group link</label>
                        <input type="text" class="form-control" id="upd_group_link">
                     </div>
                    <div class="form-group" id="group__upd_apps_options">
                    </div>
                    <input type="hidden" class="form-control" id="upd_group_id">
                    <button class="btn btn-primary" onclick="updateGroupWithModal()">Update</button>`,
        footer: ``
    },
    'superadmin-create-user': {
        selector: '',
        header: {
            icon: '',
            title: 'Création d\'un utilisateur'
        },
        content: `<div class="row mt-1">
        <div class="col">
            <label for="u_firstname">Prénom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="u_firstname">
        </div>
        <div class="col">
            <label for="u_surname">Nom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="u_surname">
        </div>
        <div class="col">
            <label for="u_pseudo">Pseudonyme</label>
            <input type="text" class="form-control" id="u_pseudo">
        </div>
    </div>
    <div class="form-group">
        <div id="regular_options">
            <div class="row mt-2">
                <div class="col">
                    <label for="u_mail">Adresse E-mail <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="u_mail">
                </div>
                <div class="col">
                    <label for="u_phone">Numéro de telephone</label>
                    <input type="text" class="form-control" id="u_phone">
                </div>
            </div>
            <div class="form-group mt-2">
                <label for="u_bio">Bio <span class="text-danger">*</span></label>
                <textarea class="form-control" id="u_bio" rows="3"></textarea>
            </div>
            <div class="form-check form-check-inline">
                <input type="checkbox" id="u_is_active">
                <label class="form-check-label" for="u_is_active">
                    Compte actif
                </label>
            </div>
            <div class="form-check form-check-inline">
                <input type="checkbox" id="u_is_admin">
                <label class="form-check-label" for="u_is_admin">
                    Administrateur
                </label>
            </div>
        </div>
    </div>
    <hr>
    <div class="form-group">
        <div class="form-check">
            <input type="checkbox" id="u_is_teacher">
            <label class="form-check-label" for="u_is_teacher">
                Enseignant
            </label>
            <div class="row" id="user_teacher_infos" style="display: none;">
                <select class="form-control col-5" id="user_teacher_grade">
                    <option selected value="0">Primaire</option>
                    <option value="1">Collège</option>
                    <option value="2">Lycée</option>
                    <option value="3">Lycée professionel</option>
                    <option value="4">POST-BAC</option>
                </select>
                <select class="form-control col-5" id="user_teacher_subjects">
                </select>
                <div class="col-12 my-3">
                    <label for="u_school">School</label>
                    <input type="text" class="form-control" id="u_school">
                </div>
            </div>
        </div>
    </div>
    <hr>
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <div class="input-group-text">
                <input type="checkbox" id="u_is_group_admin">
                <label class="form-check-label mx-1" for="u_is_group_admin">
                    Administrateur du groupe
                </label>
            </div>
        </div>
        <select class="form-control" id="u_group">
        </select>
        <button class="btn btn-sm btn-info ml-1" onclick="addGroupSuperAdmin()" id="add_group_superadmin">Ajouter un
            groupe</button>
    </div>
    <div id="group_add_sa">
    </div>
    
    <button class="btn btn-primary" onclick="createUserAndLinkToGroup()">Create user</button>`,
        footer: ``
    },
    'superadmin-update-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.user.update'
        },
        content: `<div class="row mt-1">
        <input type="hidden" class="form-control" id="update_u_id">
        <div class="col">
            <label for="update_u_firstname">Prénom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="update_u_firstname">
        </div>
        <div class="col">
            <label for="update_u_surname">Nom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="update_u_surname">
        </div>
        <div class="col">
            <label for="update_u_pseudo">Pseudonyme</label>
            <input type="text" class="form-control" id="update_u_pseudo">
        </div>
    </div>
    <div class="form-group">
        <div id="update_regular_options">
            <div class="row mt-2">
                <div class="col">
                    <label for="update_u_mail">Adresse E-mail <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="update_u_mail">
                </div>
                <div class="col">
                    <label for="update_u_phone">Numéro de telephone</label>
                    <input type="text" class="form-control" id="update_u_phone">
                </div>
            </div>
            <div class="form-group mt-2">
                <label for="update_u_bio">Bio <span class="text-danger">*</span></label>
                <textarea class="form-control" id="update_u_bio" rows="3"></textarea>
            </div>
            <div class="form-check form-check-inline">
                <input type="checkbox" id="update_u_is_active">
                <label class="form-check-label" for="update_u_is_active">
                    Compte actif
                </label>
            </div>
            <div class="form-check form-check-inline">
                <input type="checkbox" id="update_u_is_admin">
                <label class="form-check-label" for="update_u_is_admin">
                    Administrateur
                </label>
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="form-check">
            <input type="checkbox" id="update_u_is_teacher">
            <label class="form-check-label" for="update_u_is_teacher">
                Enseignant
            </label>
            <div class="row" id="update_user_teacher_infos" style="display: none;">
                <select class="form-control col-5" id="update_user_teacher_grade">
                    <option selected value="0">Primaire</option>
                    <option value="1">Collège</option>
                    <option value="2">Lycée</option>
                    <option value="3">Lycée professionel</option>
                    <option value="4">POST-BAC</option>
                </select>
                <select class="form-control col-5" id="update_user_teacher_subjects">
                </select>
                <div class="col-12 my-3">
                    <label for="update_u_school">School</label>
                    <input type="text" class="form-control" id="update_u_school">
                </div>
            </div>
        </div>
    </div>
    <hr>
    <div id="update_actualgroup_sa">
    </div>
    
    <button class="btn btn-sm btn-info" onclick="updateAddGroupSuperAdmin()" id="update_add_group_superadmin">Ajouter un
        groupe</button>
    
    <button class="btn btn-info" onclick="updateUserModal()">Update user</button>`,
        footer: ``
    },
    'groupeadmin-create-user': {
        selector: '',
        header: {
            icon: '',
            title: 'Création d\'un utilisateur'
        },
        content: `<div class="row mt-1">
        <div class="col">
            <label for="u_firstname_ga">Prénom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="u_firstname_ga">
        </div>
        <div class="col">
            <label for="u_surname_ga">Nom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="u_surname_ga">
        </div>
    </div>
    <div class="row mt-2">
        <div class="col">
            <label for="u_mail_ga">Adresse E-mail <span class="text-danger">*</span></label>
            <input type="email" class="form-control" id="u_mail_ga">
        </div>
        <div class="col">
            <label for="u_phone_ga">Numéro de telephone</label>
            <input type="text" class="form-control" id="u_phone_ga">
        </div>
        <div class="col">
            <label for="u_pseudo_ga">Pseudonyme</label>
            <input type="text" class="form-control" id="u_pseudo_ga">
        </div>
    </div>
    <div class="form-group mt-2">
        <label for="u_bio_ga">Bio <span class="text-danger">*</span></label>
        <textarea class="form-control" id="u_bio_ga" rows="3"></textarea>
    </div>
    
    <div class="form-group">
        <div class="form-check">
            <div class="row" id="user_teacher_infos_ga">
                <div class="col">
                    <label for="user_teacher_grade_ga">Grade <span class="text-danger">*</span></label>
                    <select class="form-control col-5" id="user_teacher_grade_ga">
                        <option selected value="0">Primaire</option>
                        <option value="1">Collège</option>
                        <option value="2">Lycée</option>
                        <option value="3">Lycée professionel</option>
                        <option value="4">POST-BAC</option>
                    </select>
                    </div>
                <div class="col">
                    <label for="user_teacher_subjects_ga">Subject <span class="text-danger">*</span></label>
                    <select class="form-control col-5" id="user_teacher_subjects_ga">
                    </select>
                </div>
                <div class="col-12 my-3">
                    <label for="u_school">School</label>
                    <input type="text" class="form-control" id="u_school_ga">
                </div>
            </div> 
        </div>
    </div>
    
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <div class="input-group-text">
              <input type="checkbox" id="u_is_group_admin_ga">
              <label class="form-check-label mx-1" for="u_is_group_admin_ga">
                    Administrateur du groupe
                </label>
            </div>
        </div>
          <select class="form-control" id="u_group_ga">
          </select>
          <button class="btn btn-sm btn-info ml-1" id="add_group_groupadmin">Ajouter un groupe</button>
    </div>
    <div id="group_add_ga">
    
    </div>
    
    <button class="btn btn-primary" onclick="createUserAndLinkToGroup_groupAdmin()">Create user</button>`,
        footer: ``
    },
    'groupadmin-update-user': {
        selector: '',
        header: {
            icon: '',
            title: 'Modifier un utilisateur'
        },
        content: `<div class="row mt-1">
        <input type="hidden" class="form-control" id="update_u_id_ga">
        <div class="col">
            <label for="update_u_firstname_ga">Prénom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="update_u_firstname_ga">
        </div>
        <div class="col">
            <label for="update_u_surname_ga">Nom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="update_u_surname_ga">
        </div>
        <div class="col">
            <label for="update_u_pseudo_ga">Pseudonyme</label>
            <input type="text" class="form-control" id="update_u_pseudo_ga">
        </div>
    </div>
    <div class="form-group">
        <div id="update_regular_options_ga">
            <div class="row mt-2">
                <div class="col">
                    <label for="update_u_mail_ga">Adresse E-mail <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="update_u_mail_ga">
                </div>
                <div class="col">
                    <label for="update_u_phone_ga">Numéro de telephone</label>
                    <input type="text" class="form-control" id="update_u_phone_ga">
                </div>
            </div>
            <div class="form-group mt-2">
                <label for="update_u_bio_ga">Bio <span class="text-danger">*</span></label>
                <textarea class="form-control" id="update_u_bio_ga" rows="3"></textarea>
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="form-check">
            <div class="row" id="update_user_teacher_infos_ga">
                <select class="form-control col-5" id="update_user_teacher_grade_ga">
                    <option selected value="0">Primaire</option>
                    <option value="1">Collège</option>
                    <option value="2">Lycée</option>
                    <option value="3">Lycée professionel</option>
                    <option value="4">POST-BAC</option>
                </select>
                <select class="form-control col-5" id="update_user_teacher_subjects_ga">
                </select>
                <div class="col-12 my-3">
                    <label for="update_u_school">School</label>
                    <input type="text" class="form-control" id="update_u_school_ga">
                </div>
            </div>
        </div>
    </div>
    <hr>
    <div id="update_actualgroup_ga">
    </div>
    
    <button class="btn btn-sm btn-info" onclick="updateAddGroupSuperAdminGA()" id="update_add_group_superadmin_ga">Ajouter un
        groupe</button>
    
    <button class="btn btn-info" onclick="updateUserModalGA()">Update user</button>`,
        footer: ``
    },
    'groupadmin-delete-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDisableUserGA" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold text-danger m-auto text-center" data-i18n="superadmin.users.disable.title"></h3>
                            <p data-i18n="[html]superadmin.users.disable.intention" class="text-center"></p>
                            <p data-i18n="superadmin.users.disable.message" class="text-center"></p>.
                            <input type="text" name="validation_deleteGA" id="validation_deleteGA" placeholder="supprimer">
                            <button class="btn btn-info mx-auto mt-3 btn-lg" onclick="cancelDeleteGA()" data-i18n="superadmin.users.disable.cancel">Annuler</button>
                            <button class="btn btn-danger mx-auto mt-3 btn-lg" onclick="persistDeleteGA()" data-i18n="superadmin.users.disable.validate">Valider</button>
                        </div>
                    </div>`,
        footer: ``
    },
    'superadmin-delete-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDeleteUser" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold text-danger m-auto text-center">Confirmer la suppression</h3>
                            <p class="text-center">Vous vous apprêtez à supprimer l'utilisateur : <span id="mdi_firstnameSA"></span></p>
                            <p class="text-center">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>.
                            <input type="text" name="validation_delete" id="validation_delete" placeholder="supprimer">
                            <button class="btn btn-info mx-auto mt-3 btn-lg" onclick="cancelDelete()">Annuler</button>
                            <button class="btn btn-danger mx-auto mt-3 btn-lg" onclick="persistDelete()">Valider</button>
                        </div>
                    </div>`,
        footer: ``
    },
    'superadmin-disable-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDisableUser" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold text-danger m-auto text-center">Confirmer la désactivation</h3>
                            <p class="text-center">Vous vous apprêtez à désactiver l'utilisateur : <span id="mde_firstnameSA"></span></p>
                            <p>Veuillez écrire "désactiver" dans le champ si dessous pour valider l'action.</p>.
                            <input type="text" name="validation_disable" id="validation_disable" placeholder="désactiver">
                            <button class="btn btn-info mx-auto mt-3 btn-lg" onclick="cancelDisable()">Annuler</button>
                            <button class="btn btn-danger mx-auto mt-3 btn-lg" onclick="persistDisable()">Valider</button>
                        </div>
                    </div>`,
        footer: ``
    },
    'superadmin-delete-group': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDeleteGroup" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold text-danger m-auto text-center">Confirmer la suppression</h3>
                            <p class="text-center">Vous vous apprêtez à suppression le groupe : <span id="md_group"></span></p>
                            <p>Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>.
                            <input type="text" name="validation_delete_group" id="validation_delete_group" placeholder="supprimer">
                            <button class="btn btn-info mx-auto mt-3 btn-lg" onclick="cancelDeleteGroup()">Annuler</button>
                            <button class="btn btn-danger mx-auto mt-3 btn-lg" onclick="persistDeleteGroup()">Valider</button>
                        </div>
                    </div>`,
        footer: ``
    },

}