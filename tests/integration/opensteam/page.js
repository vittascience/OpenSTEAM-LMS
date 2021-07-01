/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    open (path) {
        return browser.url(`/classroom/` + path)
    }

    clickOnButton (button) {
        expect(button).toBeDisplayed();
        button.scrollIntoView();
        button.click();
    }

    async waitElementDisplayed (selector) {
        return await browser.waitUntil(async () => {
            return await (selector).isDisplayed();
        },{
            timeout: 35000,
            timeoutMsg: "Element never appear"
        });
    }

    async clickButtonWhenDisplayed(selector) {
        let isDisplay = await this.waitElementDisplayed(selector);
        this.clickOnButton(selector);
        expect(isDisplay).toBeTruthy();
    }

    randomNumberBetween1to100() {
        return Math.floor(Math.random() * 100);
    }

    waitForExist(selector) {
        selector.waitForExist({timeout: 30000});
    }

    async input (selector, input) {
        if(input) {
            expect(selector).toBeDisplayed();
            await selector.setValue(input);
        } else {
            expect(false).toBeTruthy();
        }
    }
}

module.exports = new Page();