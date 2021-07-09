const selector = require("../opensteam/selector");
const page = require("../opensteam/page");
const login = require("../opensteam/login");

class Classes {
    constructor() {
        this.className = "";
        this.schoolName = "";
    }

    async inputInForm (className, schoolName) {
        this.className = className;
        this.schoolName = schoolName;

        await page.input(await selector.inputClassName, className);
        await page.input(await selector.inputSchoolName, schoolName);
    }

    async addLearner(learnerName) {
        await page.clickButtonWhenDisplayed(await selector.buttonAddLearner);
        await page.input(await selector.inputLearnerName, learnerName);
        await page.clickButtonWhenDisplayed(await selector.buttonAddLearnerInModal);

    }

    async checkSuccess () {
        const success = /status-success/g;
        let notifOfUpdateInformation = await selector.notifOfUpdateInformation;

        await page.waitElementDisplayed(notifOfUpdateInformation);

        let classAttrsOfNotif = await notifOfUpdateInformation.getAttribute('class');
        if (classAttrsOfNotif.match(success) === null) {
            expect(false).toBeTruthy();
        } else {
            expect(true).toBeTruthy();
        }
    }
}

module.exports = new Classes();