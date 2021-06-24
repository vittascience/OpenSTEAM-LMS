const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const settings = require('../opensteam/settings');

describe("Teacher login on OpenSTEAM LMS", () => {
    it("login", async () => {
        await page.open('login.php');
        await login.login("admin@cabri.com", "Password123@");
        const isDisplayed = await browser.waitUntil(async () => {
            return await (await selector.accessibilityButton).isDisplayed();
        },{
            timeout: 35000,
            timeoutMsg: "Connexion unsuccesful"
        });

        expect(isDisplayed).toBeTruthy();
        console.log('succefull connexion');
    });

    it("Go to the profile page", async () => {
        const isDisplayed = await browser.waitUntil(async () => {
            return await (await selector.buttonProfile).isDisplayed();
        },{
            timeout: 35000,
            timeoutMsg: "Profile teacher button does not appear"
        });
        expect(isDisplayed).toBeTruthy();
        page.clickOnButton(await selector.buttonProfile);
    });

    it("Go to settings", async () => {
        const isDisplayed = await browser.waitUntil(async () => {
            return await (await selector.buttonSettings).isDisplayed();
        },{
            timeout: 35000,
            timeoutMsg: "Settings button not found"
        });
        page.clickOnButton(await selector.buttonSettings);

        // on popup
        const isDisplayedSecondButton = await browser.waitUntil(async () => {
            return await (await selector.buttonGoToProfile).isDisplayed();
        },{
            timeout: 35000,
            timeoutMsg: "Popup never appear"
        });
        page.clickOnButton(await selector.buttonGoToProfile);
        expect(isDisplayedSecondButton).toBeTruthy();
    });

    it("Modify profile informations", async () => {
        await settings.completeFormular("Cabri", "Log", "cabri@cabri.com", "Password123@");
        await settings.checkSuccess();
    });

    it("Logout", async () => {
        page.clickOnButton(await selector.buttonProfile);
        await page.clickButtonWhenDisplayed(await selector.logoutButton);
    });

    it("Login with new informations", async () => {
        await login.login(settings.formInformations.email, settings.formInformations.password);
        let isDiplayed = await page.waitElementDisplayed(await selector.accessibilityButton);
        if(isDiplayed)
            console.log("login successful");
        else
            console.log("login failed")
    });

    it("Check profile update", async () => {
        page.clickOnButton(await selector.buttonProfile);
        await settings.checkTeacherName();
    });
});


