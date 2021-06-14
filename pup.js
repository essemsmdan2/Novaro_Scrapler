const puppeteer = require("puppeteer");
const regraNegocio = require("./regraNegocio");
const regraNegocios = regraNegocio.regraNegocio;
const ObjFoods = regraNegocio.regraNegocio.ObjFoods;
const Wg = ObjFoods["Warg Blood Cocktail"];

(async () => {
  //cria a página através do webkit

  const wsChromeEndpointurl =
    "ws://127.0.0.1:9222/devtools/browser/1a29c4d5-5b60-4ce2-88ad-b0708e33ff7e";
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  });

  const page = await browser.newPage();
  const url = "https://www.novaragnarok.com/?module=vending&action=item&id=";

  //executaveis
  await mainExecute();
  regraNegocios.resolveAll();
  console.log("the end");
  //percorrer um array de ids
  //verificar todos os valores de market
  //atualiza os valores do nosso DB

  async function atualizaValores() {}

  //executa todos os passos

  async function mainExecute() {
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

      console.log(
        `Valor Hoje = ${newMarketValue} // Valor Anterior = ${ValueBefore}`
      );
    }
  }

  //vai a página de todos os itens e verifica os valores
  async function buscaItensReceita(ArrObjItem) {
    for (var item of ArrItemsRecipe) {
      const itemMarketPrice = await goToItemUrl(item.id);
      //console.log(itemMarketPrice);
      console.log(itemMarketPrice);
      marketPrice.push(itemMarketPrice);
    }
  }

  //leva a página até o item id
  async function goToItemUrl(itemIdInput) {
    let itemUrl = url + itemIdInput;
    await page.goto(itemUrl);
  }

  //leva até a página de npc Sell
  async function buscaNpcSell(itemId) {
    await page.click("#nova-market-link > a:nth-child(1)");
    await page.waitForSelector(".vertical-table", { timeout: 5000 });
    const result = await page.evaluate((e) => {
      return document.getElementsByTagName("td")[23].innerText;
    });
    console.log(result);
    return result;
  }

  //Busca dentro do MarketPrice
  async function getItemMarketPrice() {
    try {
      await page.waitForSelector(
        "#itemtable > tbody > tr:nth-child(1) > td.sorting_1 > span",
        { timeout: 5000 }
      );
      const result = await page.evaluate((e) => {
        return document.querySelectorAll("span")[26].innerText;
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log("Item sem valor no mercado. Checando no NpcSell");
      return false;
    }
  }
})();
