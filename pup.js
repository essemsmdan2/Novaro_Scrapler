const puppeteer = require('puppeteer');
const regraNegocio = require('./regraNegocio');
const ObjFoods = regraNegocio.regraNegocio.ObjFoods;

(async () => {

    //cria a página através do webkit

    const wsChromeEndpointurl = "ws://127.0.0.1:9222/devtools/browser/2b2b46ea-8b7d-49a4-8343-cab2b22f1308";
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl
    });

    const page = await browser.newPage();
    const url = "https://www.novaragnarok.com/?module=vending&action=item&id="

    await Warg_Blood_Cocktail()




    async function Warg_Blood_Cocktail() {
        let marketPrice = [];
        let ArrItemsRecipe = ObjFoods['Warg Blood Cocktail'].ArrRecipe;

        for (var item of ArrItemsRecipe) {

            const itemMarketPrice = await goToItemUrl(item.id);
            //console.log(itemMarketPrice);
            console.log(itemMarketPrice);
            marketPrice.push(itemMarketPrice);

        }
        console.log(marketPrice);
    }

    async function goToItemUrl(itemIdInput) {

        let itemUrl = url + itemIdInput;
        await page.goto(itemUrl);


        if (await getItemMarketPrice() == undefined) {
            return await buscaNpcSell(itemIdInput);

        } else {
            return getItemMarketPrice();
        }

    }

    async function buscaNpcSell(itemId) {
        await page.click('#nova-market-link > a:nth-child(1)');
        await page.waitForNavigation();

        const result = await page.evaluate(e => {
            return document.getElementsByTagName("td")[23].innerText;
        })
        console.log(result);

        return result;

    }




    async function getItemMarketPrice() {



        try {

            await page.waitForSelector(".sorting_1", { timeout: 3000 })
            const result = await page.evaluate(e => {
                return document.querySelectorAll('span')[26].innerText;
            })

            return result;

        } catch (error) {
            buscaNpcSell();




        }
    }



    //receber um id
    //vai até a página do item
    //encontra o valor do item de mercado devolver o preço de mercado
    //caso o preço de mercado não exista, verificar histórico






})();













