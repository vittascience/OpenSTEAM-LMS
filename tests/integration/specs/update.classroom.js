const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

describe("update of classroom", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Click on classes button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
    });

    it("Click on settings button", async () => {
        await page.clickButtonWhenDisplayed(await selector.settingsButtonOnClassCard);
    });

    it("Click on modify button", async () => {
        await page.waitForExist(await selector.settingsDropdown);
        await page.clickButtonWhenDisplayed(await selector.settingsDropdownModifyButton);
    });

    it("Change name of class and school", async () => {
        const className = "Class " + page.randomNumberBetween1to100();
        const schoolName = "UTBM" + page.randomNumberBetween1to100();
        await classes.inputInForm(className, schoolName);
    });

    it("Save class", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonSaveClass);
    });

    it("Class was created", async () => {
        await classes.checkSuccess();
    });
});
