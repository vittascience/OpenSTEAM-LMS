class Selector {

    /**
     *    Profile page
     */
    get buttonProfile () {
        return $("#dashboard-profil-teacher"); //#dashboard-classes-teacher");
    }

    get buttonSettings () {
        return $("#settings-teacher");
    }
    // popup
    get buttonGoToProfile() {
        return $("#teacher-account-button");
    }

    get teacherName() {
        return $("#user-name-teacher");
    }

    get logoutButton() {
        return $("#classroom-dashboard-profil-panel-teacher button:last-child");
    }

    /**
     *    My personal info. form page
     */
    get formInputFirstName() {
        return $("#profile-form-first-name");
    }

    get formInputLastName() {
        return $("#profile-form-last-name");
    }

    get formInputNickname() {
        return $("#profile-form-nick-name");
    }

    get formInputEmail() {
        return $("#profile-form-email");
    }

    get formInputPassword() {
        return $("#profile-form-password");
    }

    get formInputConfirmPassword() {
        return $("#profile-form-confirm-password");
    }

    get formButtonUpdate() {
        return $("#update-teacher-account-form div div:last-child input:last-child");
    }

    get formButtonRegister () {
        return $("#create-teacher-account-form .btn");
    }

    get notifOfUpdateInformation() {
        return $("#notif-div div");
    }


    get accessibilityButton () {
        return $("#dropdownMenuButton");
    }


    // connexion button
    get buttonConnexionFirstPage () {
        return $("#home-connexion");
    }

    get buttonConnexionSecondPage () {
        return $("#login-vittascience");
    }

    get buttonRegisterSecondPage () {
        return $("#register-link");
    }

    get buttonConnexionThirdPage () {
        return $("#login-button");
    }

    get emailInput () {
        return $("#login-mail-input");
    }

    get passwordInput () {
        return $("#login-pwd-input");
    }

    get infoConnexion () {
        return $("#info-div div");
    }

    /**
     *    Classroom page
     */

    get buttonClasses () {
        return $("#dashboard-classes-teacher");
    }

    get buttonCreateClass () {
        return $("#classroom-dashboard-classes-panel-teacher .btn");
    }

    get inputClassName() {
        return $("#classroom-form-name");
    }

    get inputSchoolName() {
        return $("#classroom-form-school");
    }

    get inputLimitLearner() {
        return $("#classroom-form-is-blocked");
    }

    get buttonAddLearner() {
        return $("#classroom-dashboard-form-classe-panel button");
    }

    // modal
    get inputLearnerName() {
        return $("#add-student-div input:first-child");
    }

    // modal
    get buttonAddLearnerInModal() {
        return $("#add-student-modal button");
    }

    get tableLearner() {
        return $$("#table-students ul li");
    }

    get secondLearnerInTable() {
        return $("#table-students ul li:nth-child(2)");
    }

    get buttonRemoveLearner() {
        return $("#table-students li button");
    }

    get buttonSaveClass() {
        return $("#classroom-dashboard-form-classe-panel .new-classroom-form:last-child");
    }

    get divListMyClasses () {
        return $("#classroom-dashboard-classes-panel-teacher .list-classes");
    }

    get settingsButtonOnClassCard () {
        return $("#classroom-dashboard-classes-panel-teacher .dropdown i");
    }

    get settingsDropdown () {
        return $("#classroom-dashboard-classes-panel-teacher .dropdown .dropdown-menu");
    }

    get settingsDropdownModifyButton () {
        return $("#classroom-dashboard-classes-panel-teacher .dropdown .dropdown-menu li:nth-child(1)");
    }

    get settingsDropdownDeleteButton () {
        return $("#classroom-dashboard-classes-panel-teacher .dropdown .dropdown-menu li:nth-child(2)");
    }
}

module.exports = new Selector();