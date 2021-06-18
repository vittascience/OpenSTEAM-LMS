const Page = require('../pageobjects/page');

describe('OpenSteam App', () => {
    it('should launch OpenSteam', async () => {
        Page.open('login.php');
    });
});


