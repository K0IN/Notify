import pup from 'puppeteer';
import { Miniflare } from 'miniflare';

// this test does not work with headless mode see
// https://github.com/puppeteer/puppeteer/issues/3461

jest.setTimeout(100_000);
jest.retryTimes(10);

describe('test browser webpush with password', () => {
    let mf: Miniflare;
    let browser: pup.Browser;
    let server: any;

    beforeEach(async () => {
        mf = new Miniflare({
            args: ['--no-sandbox'],
            envPath: 'test/integrationtests/env/password.env',
            // packagePath: true,
            wranglerConfigPath: true,
            scriptPath: 'dist/index.js',
            port: 5001,
            executablePath: process.env.PUPPETEER_EXEC_PATH,
            buildCommand: '',
            kvNamespaces: ['NOTIFY_USERS'],
        });

        server = await mf.startServer();
        browser = await pup.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

        // allow push notifications
        const context = browser.defaultBrowserContext();
        context.overridePermissions('http://localhost:5001', ['notifications']);
    });

    afterEach(async () => {
        server.close();
        await browser.close();
        await mf.dispose();
    });


    test('test with correct password', async () => {
        const [page] = await browser.pages();
        await page.goto('http://localhost:5001');

        await page.waitForNetworkIdle({ idleTime: 5_000 });
        // click the login button
        await page.click('input');
        await page.waitForTimeout(5_000);
        // enter the password
        await page.type('.mdc-text-field__input', 'test123456');
        await page.waitForTimeout(5_000);
        // click the login button
        await page.click('.mdc-dialog__footer__button--accept');
        await page.waitForTimeout(5_000);
        // reload the page
        await page.reload();
        await page.waitForNetworkIdle({ idleTime: 15_000 });
        // send a notification
        const res = await fetch('http://localhost:5001/api/notify', {
            body: JSON.stringify({
                title: 'test',
                message: 'test'
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test123456'
            },
            method: 'POST'
        });
        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body).toMatchObject({
            successful: true,
            // any string
            data: expect.any(String)
        });

        // this will throw if we do not receive a notification
        await page.waitForXPath('//*[contains(text(), "test")]', { timeout: 60_000 });
    });

});
