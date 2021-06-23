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

    /**
     *    My settings page
     */
    get formInputFirstName() {
        return $("#profile-form-first-name");
    }

    get formInputLastName() {
        return $("#profile-form-last-name");
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

    get notifOfUpdateInformation() {
        return $("#notif-div");
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

    waitForExist(selector) {
        selector.waitForExist({timeout: 30000});
    }

}

module.exports = new Selector();