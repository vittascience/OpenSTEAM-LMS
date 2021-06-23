const selector = require("../opensteam/selector");

class Login {
    clickOnButton (button) {
        expect(button).toBeDisplayed();
        button.scrollIntoView();
        button.click();
    }

    async inputEmailAndPassword (email, password) {
        expect(selector.emailInput).toBeDisplayed();
        expect(selector.passwordInput).toBeDisplayed();
        expect(selector.buttonConnexionThirdPage).toBeDisplayed();

        expect(selector.buttonConnexionThirdPage).toBeDisabled();

        let emailInput = await selector.emailInput;
        let passwordInput = await selector.passwordInput;

        await emailInput.setValue(email);
        await passwordInput.setValue(password);

        expect(selector.buttonConnexionThirdPage).toBeEnabled();
    }
}

module.exports = new Login();