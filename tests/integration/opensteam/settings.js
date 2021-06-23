const selector = require("../opensteam/selector");
const page = require("../opensteam/page");

class Settings {
    constructor() {
        this.formInformations = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        };
    }

    async inputFirstName (firstname) {
        let formInputFirstName = await selector.formInputFirstName;

        expect(formInputFirstName).toBeDisplayed();

        await formInputFirstName.setValue(firstname);
    }

    async inputLastName (lastname) {
        let formInputLastName = await selector.formInputLastName;

        expect(formInputLastName).toBeDisplayed();

        await formInputLastName.setValue(lastname);
    }

    async inputEmail (email) {
        let formInputEmail = await selector.formInputEmail;

        expect(formInputEmail).toBeDisplayed();

        await formInputEmail.setValue(email);
    }

    async inputPasswords (password) {
        let formInputPassword = await selector.formInputPassword;
        let formInputConfirmPassword = await selector.formInputConfirmPassword;

        expect(formInputPassword).toBeDisplayed();
        expect(formInputConfirmPassword).toBeDisplayed();

        await formInputPassword.setValue(password);
        await formInputConfirmPassword.setValue(password);
    }

    async inputInForm (firstname, lastname, email, password) {
        this.formInformations.firstname = firstname;
        this.formInformations.lastname = lastname;
        this.formInformations.email = email;
        this.formInformations.password = password;

        await this.inputFirstName(firstname);
        await this.inputLastName(lastname);
        await this.inputEmail(email);
        await this.inputPasswords(password);
    }
}

module.exports = new Settings();