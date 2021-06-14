const puppeteer = require("puppeteer");
var regraNegocio = require("./regraNegocio");
regraNegocio = regraNegocio.regraNegocio;
const dataBase = require("./dataBase");

const foodDatabase = dataBase.dataBase.ObjFoods;
//cria a página através do webkit
(async () => {
  const wsChromeEndpointurl =
    "ws://127.0.0.1:9222/devtools/browser/1971bb4b-6422-4b3e-927a-f337732b7fe0";
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  });

  const page = await browser.newPage();
  const url = "https://www.novaragnarok.com/?module=vending&action=item&id=";

  //executaveis

  //main(foodDatabase["Warg Blood Cocktail"]);
  //regraNegocios.resolveAll();
  //console.log("the end");

  //executa todos os passos

  async function main(Wg) {
    let newMarketValue = [];
    let ValueBefore = [];

    for (var recipe of Wg.ArrRecipe) {
      await goToItemUrl(recipe.id);

      let marketresquest = await getItemMarketPrice();
      if (marketresquest) {
        newMarketValue.push(marketresquest);
        recipe.value = marketresquest;
      } else {
        let npcsell = await buscaNpcSell();
        if (npcsell) {
          newMarketValue.push(npcsell);
          recipe.value = npcsell;
        }
      }

      ValueBefore.push(recipe.value);
    }
    console.log(
      `Valor Hoje = ${newMarketValue} // Valor Anterior = ${ValueBefore}`
    );
  }

  //leva a página até o item id
  async function goToItemUrl(itemIdInput) {
    let itemUrl = url + itemIdInput;
    await page.goto(itemUrl);
  }

  //leva até a página de npc Sell
  async function buscaNpcSell(itemId) {
    await page.click("#nova-market-link > a:nth-child(1)");
    await page.waitForSelector(".vertical-table", { timeout: 3000 });
    const result = await page.evaluate((e) => {
      return document.getElementsByTagName("td")[23].innerText;
    });

    return result;
  }

  //Busca dentro do MarketPrice
  async function getItemMarketPrice() {
    try {
      await page.waitForSelector(
        "#itemtable > tbody > tr:nth-child(1) > td.sorting_1 > span",
        { timeout: 3000 }
      );
      const result = await page.evaluate((e) => {
        return document.querySelectorAll("span")[26].innerText;
      });

      return result;
    } catch (error) {
      console.log("Item sem valor no mercado. Checando no NpcSell");
      return false;
    }
  }
})();
