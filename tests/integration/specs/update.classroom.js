const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

describe("Update of classroom", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Create class", async () => {
        await classes.createClass();
    });

    it("Click on classes button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
    });

    it("Click on settings button", async () => {
        await page.clickButtonWhenDisplayed(await selector.settingsButtonOnClassCard);
    });

    it("Click on modify button", async () => {
        const settingsDropdownModifyButton = await selector.settingsDropdownModifyButton;
        await page.waitForExist(settingsDropdownModifyButton);
        await page.clickButtonWhenDisplayed(settingsDropdownModifyButton);
    });

    it("Change name of class and school", async () => {
        const className = "Class " + page.randomNumberBetween1to100();
        const schoolName = "UTBM" + page.randomNumberBetween1to100();
        await classes.inputInForm(className, schoolName);
    });

    it("Save class", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonSaveClass);
    });

    it("Class was modified", async () => {
        await classes.checkSuccess();
    });
});
