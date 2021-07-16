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

    async createClass () {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
        await page.clickButtonWhenDisplayed(await selector.buttonCreateClass);
        const className = "Class " + page.randomNumberBetween1to100();
        const schoolName = "UTBM" + page.randomNumberBetween1to100();
        await this.inputInForm(className, schoolName);
        await this.addLearner("Paul");
        await this.addLearner("Seif");
        await page.waitForExist(await selector.secondLearnerInTable);
        await page.checkNumberOfElements(await selector.tableLearner, 2);
        await page.clickButtonWhenDisplayed(await selector.buttonRemoveLearner);
        await page.waitForNotExist(await selector.secondLearnerInTable);
        await page.checkNumberOfElements(await selector.tableLearner, 1);
        await page.clickButtonWhenDisplayed(await selector.buttonSaveClass);
        await this.checkSuccess();
    }

    async deleteClass () {
        const buttonProfile = await selector.buttonProfile;
        const buttonClasses = await selector.buttonClasses;
        const settingsButtonOnClassCard = await selector.settingsButtonOnClassCard;
        const settingsDropdownDeleteButton = await selector.settingsDropdownDeleteButton;

        await page.waitForExist(buttonProfile);
        await page.clickButtonWhenDisplayed(buttonProfile);

        await page.waitForExist(buttonClasses);
        await page.clickButtonWhenDisplayed(buttonClasses);

        await page.waitForExist(settingsButtonOnClassCard);
        await page.clickButtonWhenDisplayed(settingsButtonOnClassCard);

        await page.waitForExist(settingsDropdownDeleteButton);
        await page.clickButtonWhenDisplayed(settingsDropdownDeleteButton);

        await browser.acceptAlert(); // TODO : follow a post https://github.com/webdriverio/webdriverio/issues/6423

        await this.checkSuccess();
    }


}

module.exports = new Classes();