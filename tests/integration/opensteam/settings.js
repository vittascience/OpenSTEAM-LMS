const selector = require("../opensteam/selector");
const page = require("../opensteam/page");

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

    async login (email, password) {
        await page.open('login.php');
        this.clickOnButton(await selector.buttonConnexionFirstPage);
        this.clickOnButton(await selector.buttonConnexionSecondPage);
        await this.inputEmailAndPassword(email, password);
        this.clickOnButton(await selector.buttonConnexionThirdPage);
    }
}

module.exports = new Login();