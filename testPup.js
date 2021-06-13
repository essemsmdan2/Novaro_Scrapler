const { SlowBuffer } = require('buffer');
const puppeteer = require('puppeteer');


(async () => {


    const wsChromeEndpointurl = "ws://127.0.0.1:9222/devtools/browser/a3f83a95-69ac-407c-b5e0-ce73aac1e8fb";
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl
    });



    const url = "https://www.novaragnarok.com/?module=vending&action=item&id="
    const itemId = "6252";
    const page = await browser.newPage();
    await page.goto(url + itemId);


    const resultado = await page.evaluate(() => {

        let kj = document.querySelector('.sorting_1').firstElementChild.innerHTML





        console.log(`${kj}`);

    });




    //  await page.screenshot({ path: 'example.png' });
    //await browser.close();
})();




