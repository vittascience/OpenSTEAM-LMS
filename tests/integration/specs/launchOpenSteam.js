const Page = require('../pageobjects/page');

describe('OpenSteam App', () => {
    it('should launch OpenSteam', async () => {
        await Page.open('login.php');
        let b = await $("#home-connexion");
        b.scrollIntoView(); b.click();
        await browser.pause(5000);
    });
});


