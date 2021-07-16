const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');

describe("update of classroom", () => {
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

    it("Click on delete button", async () => {
        const settingsDropdownDeleteButton = await selector.settingsDropdownDeleteButton;
        await page.waitForExist(settingsDropdownDeleteButton);
        await page.clickButtonWhenDisplayed(settingsDropdownDeleteButton);
    });

    it("Comfirm delete class", async () => {
        await browser.acceptAlert(); // TODO : Bug sur l'alert
    });

    it("Check class was deleted", async () => {
        await classes.checkSuccess();
    });
});
