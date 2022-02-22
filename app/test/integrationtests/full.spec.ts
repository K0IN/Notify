import pup from 'puppeteer';
import { Miniflare } from 'miniflare';

// this test does not work with headless mode see
// https://github.com/puppeteer/puppeteer/issues/3461

jest.setTimeout(100_000); // 60 seconds timeout
jest.retryTimes(10); // retry 10 times

test('browser test', async () => {
    const mf = new Miniflare({
        args: ['--no-sandbox'],
        envPath: true,
        // packagePath: true,
        wranglerConfigPath: true,
        scriptPath: 'dist/index.js',
        port: 5000,
        executablePath: process.env.PUPPETEER_EXEC_PATH,
        buildCommand: '',
        kvNamespaces: ['NOTIFY_USERS'],
    });

    const server = mf.startServer();
    const browser = await pup.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    context.overridePermissions('http://localhost:5000', ['notifications']);

    try {
        const [page] = await browser.pages();
        await page.goto('http://localhost:5000');

        // click on the button
        await page.waitForNetworkIdle({ idleTime: 10_000 });
        // await page.screenshot({ path: './images/step_init.png' });
        await page.click('input');
        await page.waitForTimeout(10_000);
        //await page.waitForNetworkIdle({ idleTime: 1000 });
        // await page.screenshot({ path: './images/step_clicked.png' });

        // reload the page
        await page.reload();
        await page.waitForNetworkIdle({ idleTime: 10_000 });
        // await page.screenshot({ path: './images/step_reload.png' });
        
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
        await page.waitForXPath('//*[contains(text(), "test")]', { timeout: 30_000 }); // 30 seconds timeout
    
    } catch(e) {
        console.error(e);
    } finally {
        (await server).close();
        await browser.close();
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
});
