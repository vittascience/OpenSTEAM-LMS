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
        await page.waitForExist(await selector.settingsDropdownDeleteButton);
        await page.clickButtonWhenDisplayed(await selector.settingsDropdownDeleteButton);
    });

    it("Comfirm delete class", async () => {
        await browser.acceptAlert();
    });

    it("Check class was deleted", async () => {
        await classes.checkSuccess();
    });
});
