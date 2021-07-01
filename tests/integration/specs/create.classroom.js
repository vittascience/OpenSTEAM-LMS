const page = require('../opensteam/page');
const login = require('../opensteam/login');
const selector = require('../opensteam/selector');
const classes = require('../opensteam/classes');




describe("Creation of classroom", () => {
    it("Login", async () => {
        await page.open('login.php');
        await login.login(login.email, login.password);
    });

    it("Click on classes button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonClasses);
    });

    it("Click on create class button", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonCreateClass);
    });

    it("Complete name of class and school", async () => {
        const className = "Class " + page.randomNumberBetween1to100();
        const schoolName = "UTBM" + page.randomNumberBetween1to100();
        await classes.inputInForm(className, schoolName);
    });

    it("Add two learner", async () => {
        await classes.addLearner("Paul");
        await classes.addLearner("Seif");
    });

    it("Add remove one learner", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonRemoveLearner);
    });

    it("Save class", async () => {
        await page.clickButtonWhenDisplayed(await selector.buttonSaveClass);
    });

    it("Class was created", async () => {
        await classes.checkSuccess();
    });
});


