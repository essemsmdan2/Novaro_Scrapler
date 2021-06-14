const puppeteer = require("puppeteer");
var regraNegocio = require("./regraNegocio");

let dataBase = {
  ObjFoods: {
    "Warg Blood Cocktail": {
      id: 12430,
      marketPrice: 15999,

      ArrRecipe: [
        {
          name: "Cold Ice",
          id: 6253,
          count: 2,
          value: 3050,
        },
        {
          name: "Blood of Wolf",
          id: 6252,
          count: 2,
          value: 4998,
        },
        {
          name: "Melage Pot",
          id: 6248,
          count: 1,
          value: 300,
        },
      ],
    },
  },
};

//cria a página através do webkit
(async () => {
  const wsChromeEndpointurl =
    "ws://127.0.0.1:9222/devtools/browser/bb2240a0-9708-42a4-98f3-93bec99a892f";
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  });

  const page = await browser.newPage();
  const url = "https://www.novaragnarok.com/?module=vending&action=item&id=";

  //executaveis

  await main(dataBase.ObjFoods["Warg Blood Cocktail"]);

  const seila = regraNegocio.regraNegocio.valorTotal(
    dataBase.ObjFoods,
    "Warg Blood Cocktail"
  );
  console.log(seila);

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
        recipe.value = parseInt(marketresquest).toFixed(3);
        console.log(marketresquest);
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

    return parseFloat(result.replace(/,/g, ".")).toFixed(2);
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
      result.toString();

      return result;
    } catch (error) {
      console.log("Item sem valor no mercado. Checando no NpcSell");
      return false;
    }
  }
})();
