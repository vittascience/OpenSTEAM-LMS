const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');

describe("Teacher login on OpenSTEAM LMS", () => {
    it("should launch OpenSteam", async () => {
        await page.open('login.php');
    });

    it("Click on first connexion button", async () => {
        login.clickOnButton(await selector.buttonConnexionFirstPage);
    });

    it("Click on second connexion button", async () => {
        login.clickOnButton(await selector.buttonConnexionSecondPage);
    });

    it("Enter username and password and login", async () => {
        await login.inputEmailAndPassword(login.email, login.password);
    });

    it("Click to connect", async () => {
        login.clickOnButton(await selector.buttonConnexionThirdPage);
    });

    it("User is Connected and redirect on home page", async () => {
        const isDisplayed = await browser.waitUntil(async () => {
            return await (await selector.accessibilityButton).isDisplayed();
        },{
            timeout: 35000,
            timeoutMsg: "Connexion unsuccesful"
        });

        expect(isDisplayed).toBeTruthy();
    });


});


