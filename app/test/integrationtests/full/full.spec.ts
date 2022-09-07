import pup from 'puppeteer';
import { Miniflare } from 'miniflare';

// this test does not work with headless mode see
// https://github.com/puppeteer/puppeteer/issues/3461

jest.setTimeout(60_000);
jest.retryTimes(3);

describe('integration tests with browser', () => {
    let mf: Miniflare;
    let browser: pup.Browser;
    let server: any;

    beforeEach(async () => {
        mf = new Miniflare({
            args: ['--no-sandbox'],
            envPath: 'test/integrationtests/env/default.env',
            // packagePath: true,
            wranglerConfigPath: true,
            scriptPath: 'dist/index.js',
            port: 5000,
            executablePath: process.env.PUPPETEER_EXEC_PATH,
            buildCommand: '',
            kvNamespaces: ['NOTIFY_USERS'],
        });

        server = await mf.startServer();
        browser = await pup.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

        // allow push notifications
        const context = browser.defaultBrowserContext();
        context.overridePermissions('http://localhost:5000', ['notifications']);
    });

    afterEach(async () => {
        server.close();
        await browser.close();
        await mf.dispose();
    });


    test('simple', async () => {
        const [page] = await browser.pages();
        await page.goto('http://localhost:5000');

        await page.waitForNetworkIdle({ idleTime: 5_000 });
        // click the login button
        await page.click('input');
        await page.waitForTimeout(5_000);

        // reload the page
        await page.reload();
        await page.waitForNetworkIdle({ idleTime: 15_000 });

        // send a notification
        const res = await fetch('http://localhost:5000/api/notify', {
            body: JSON.stringify({
                title: 'test',
                message: 'test'
            }),
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

    test('weird characters', async () => {
        const [page] = await browser.pages();
        await page.goto('http://localhost:5000');

        await page.waitForNetworkIdle({ idleTime: 5_000 });
        // click the login button
        await page.click('input');
        await page.waitForTimeout(5_000);

        // reload the page
        await page.reload();
        await page.waitForNetworkIdle({ idleTime: 15_000 });

        // send a notification
        const res = await fetch('http://localhost:5000/api/notify', {
            body: JSON.stringify({
                title: '通知',
                message: '测试'
            }),
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
        await page.waitForXPath('//*[contains(text(), "通知")]', { timeout: 60_000 });
        await page.waitForXPath('//*[contains(text(), "测试")]', { timeout: 1_000 });
    });

    test('multiple messages', async () => {
        const [page] = await browser.pages();
        await page.goto('http://localhost:5000');

        await page.waitForNetworkIdle({ idleTime: 5_000 });
        // click the login button
        await page.click('input');
        await page.waitForTimeout(5_000);

        // reload the page
        await page.reload();
        await page.waitForNetworkIdle({ idleTime: 15_000 });

        for (let i = 0; i < 10; i++) {
            // send a notification
            const res = await fetch('http://localhost:5000/api/notify', {
                body: JSON.stringify({
                    title: `this is #${i}`,
                    message: `this is a test message (${i})`,
                }),
                method: 'POST'
            });
            expect(res.status).toBe(200);
            const body = await res.json();

            expect(body).toMatchObject({
                successful: true,
                // any string
                data: expect.any(String)
            });
        }

        await page.waitForTimeout(20_000);

        // this will throw if we do not receive a notification
        for (let i = 0; i < 10; i++) {
            await page.waitForXPath(`//*[contains(text(), "this is #${i}")]`, { timeout: 60_000 });
        }
    });
});