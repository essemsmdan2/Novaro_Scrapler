const puppeteer = require("puppeteer");
var regraNegocio = require("./regraNegocio");

const savageBBQids = [
  [12429, 1],
  [6249, 1],
  [6250, 1],
  [6251, 1],
  [6248, 1],
];

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

  const SavagBBQ = await criaItemCompleto(savageBBQids);
  console.log(SavagBBQ);

  console.log("end");

  //executa todos os passos

  // async function main(ObjItem) {
  //   let ArrRecipe = ObjItem.Recipes;
  //   let newMarketValue = [];
  //   let ValueBefore = [];
  //   await goToItemUrl(12430);
  //   ObjItem.marketPrice = await getItemMarketPrice();

  //   for (var recipe of ArrRecipe) {
  //     await goToItemUrl(recipe.id);

  //     let marketresquest = await getItemMarketPrice();
  //     if (marketresquest) {
  //       newMarketValue.push(marketresquest);
  //       recipe.value = marketresquest;
  //       console.log(marketresquest);
  //     } else {
  //       let npcsell = await buscaNpcSell();
  //       if (npcsell) {
  //         newMarketValue.push(npcsell);

  //         recipe.value = npcsell;
  //       }
  //     }

  //     ValueBefore.push(recipe.value);
  //   }
  //   console.log(
  //     `Valor Hoje = ${newMarketValue} // Valor Anterior = ${ValueBefore}`
  //   );
  // }

  //versão final entregando a food completa = recipes e lucro;
  async function criaItemCompleto(itemsId) {
    const item = await criaItemRecipes(itemsId);

    const resultadoLucroPerda = regraNegocio.regraNegocio.valorTotal(
      item,
      item.name
    );
    item["PerdaOuLucro"] = resultadoLucroPerda;
    return item;
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

    return result.replace(",", "");
  }

  //Busca dentro do MarketPrice
  async function getItemMarketPrice() {
    try {
      const x = await page.waitForSelector(
        "#itemtable > tbody > tr:nth-child(1) > td.sorting_1 > span",
        { timeout: 3000 }
      );

      const result = await page.evaluate((e) => {
        return document.querySelector(
          "#itemtable > tbody > tr:nth-child(1) > td.sorting_1 > span"
        ).innerText;
      });
      result.toString();
      return result.replace(",", "");
    } catch (error) {
      console.log("Item sem valor no mercado. Checando no NpcSell");
      return false;
    }
  }

  //cria um objeto e push pra Objfoods
  async function tryMarketandSell() {
    let marketresquest = await getItemMarketPrice();
    if (marketresquest) {
      return marketresquest;
    } else {
      let npcsell = await buscaNpcSell();
      if (npcsell) {
        return npcsell;
      }
    }
  }

  async function criaItemObj(id, qnt) {
    await goToItemUrl(id);
    const Item = {
      name: await page.evaluate(() => {
        return document.querySelector("#market-item-name > span > a").innerText;
      }),
      id: id,
      count: qnt ? qnt : 1,
      value: await tryMarketandSell(),
    };

    return Item;
  }

  async function criaItemRecipes(ArrayItemsId) {
    let itemSelf = await criaItemObj(ArrayItemsId[0][0], [0][1]);
    let array = ArrayItemsId.slice(1);

    let itemRecipes = [];

    for (const item of array) {
      const itemCriado = await criaItemObj(item[0], item[1]);

      itemRecipes.push(itemCriado);
    }

    itemSelf["Recipes"] = itemRecipes;
    return itemSelf;
  }

  async function criaItemComRecipes() {}
})();
