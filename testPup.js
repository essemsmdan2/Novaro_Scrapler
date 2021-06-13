const { SlowBuffer } = require('buffer');
const { table } = require('console');
const puppeteer = require('puppeteer');


(async () => {


    const wsChromeEndpointurl = "ws://127.0.0.1:9222/devtools/browser/2b2b46ea-8b7d-49a4-8343-cab2b22f1308";
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl
    });



    const url = "https://www.novaragnarok.com/?module=vending&action=item&id="
    const itemId = "12432";
    const page = await browser.newPage();
    await page.goto(url + itemId);

    async function getItem(page) {

        await page.waitFor(".sorting_1", { timeout: 3000 })
        const result = await page.evaluate(e => {
            return document.querySelectorAll('span')[26].innerText;
        })
        console.log(result);
    }

    getItem(page)





    // const table = await page.evaluate(() => {

    //     return document.querySelectorAll('span')[26].innerText

    //     //fim evaluate  
    // });


    //  await page.screenshot({ path: 'example.png' });
    //await browser.close();
})();













