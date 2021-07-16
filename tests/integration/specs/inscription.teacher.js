const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const register = require('../opensteam/register');


describe("Teacher try to subscribe", () => {
    it("Click login on first page", async () => {
        await page.open('login.php');
        await page.clickButtonWhenDisplayed(await selector.buttonConnexionFirstPage);
    });

    it("Click Register on portal page", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonRegisterSecondPage);
    });

    it("Complete formular", async () => {
        await register.completeFormular("Cabri" + page.randomNumberBetween1to100(), "Log" + page.randomNumberBetween1to100(), "Temporary","baptiste.ledoyen@cabri.com", "Azerty123@");
    });
});


