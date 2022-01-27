import pup from 'puppeteer';
import { Miniflare } from 'miniflare';

jest.setTimeout(120_000);

test('responds with url', async () => { 
    const mf = new Miniflare({  
        envPath: true,
        // packagePath: true,
        wranglerConfigPath: true,
        scriptPath: 'dist/index.js',
        port: 5000,
        buildCommand: '',
        kvNamespaces: ['NOTIFY_USERS'],
    });
    const server = mf.startServer();
    const browser = await pup.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    context.overridePermissions('http://localhost:5000', ['notifications']);
 
    const page = await browser.newPage();
    await page.goto('http://localhost:5000');

    // click on the button
    await page.waitForTimeout( 2000 );
    await page.screenshot({ path: './images/step_init.png' });
    await page.click('input');
    await page.waitForTimeout( 2000 );
    await page.screenshot({ path: './images/step_clicked.png' });

    // reload the page
    await page.reload();
    await page.waitForTimeout( 2000 );
    await page.screenshot({ path: './images/step_reload.png' });

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
    await page.waitForXPath('//*[contains(text(), "test")]', { timeout: 5000 });
    await page.screenshot({ path: './images/step_message.png' });

    (await server).close();
    await browser.close();
});
