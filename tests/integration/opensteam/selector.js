class Selector {
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