const puppeteer = require("puppeteer");
var regraNegocio = require("./regraNegocio");

const foodIds = {
  savageBBQids: [
    [12429, 1],
    [6249, 1],
    [6250, 1],
    [6251, 1],
    [6248, 1],
  ],

  droserHerbStewids: [
    [12433, 1],
    [6248, 1],
    [6255, 1],
    [507, 3],
    [509, 3],
    [510, 3],
    [6259, 3],
  ],
  Minor_Brisket_ids: [
    [12431, 1],
    [6248, 1],
    [6255, 1],
    [6254, 2],
  ],
  Warg_Blood_Cocktail_ids: [
    [12430, 1],
    [6248, 1],
    [6253, 2],
    [6252, 3],
  ],
  Siroma_Icetea_ids: [
    [12432, 1],
    [6248, 1],
    [6258, 1],
    [6257, 2],
    [6256, 3],
  ],
  Petite_Tail_Noodles_ids: [
    [12434, 1],
    [6248, 1],
    [6262, 1],
    [6261, 2],
    [6260, 3],
  ],
};
//cria a página através do webkit
(async () => {
  const wsChromeEndpointurl =
    "ws://127.0.0.1:9222/devtools/browser/70e09386-b228-41ed-b55f-35fe358536d4";
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  });

  const page = await browser.newPage();
  const urlItemoverview =
    "https://www.novaragnarok.com/?module=vending&action=view&id=";
  const url = "https://www.novaragnarok.com/?module=vending&action=item&id=";

  //executaveis

  const SavagBBQ = await criaItemCompleto(foodIds.savageBBQids);
  console.log(SavagBBQ);
  const Drosera_Herb_Stew = await criaItemCompleto(
    foodIds["droserHerbStewids"]
  );
  console.log(Drosera_Herb_Stew);
  const Minor = await criaItemCompleto(foodIds.Minor_Brisket_ids);
  console.log(Minor);
  const Warg = await criaItemCompleto(foodIds.Warg_Blood_Cocktail_ids);
  console.log(Warg);
  const Siroma = await criaItemCompleto(foodIds.Siroma_Icetea_ids);
  console.log(Siroma);
  const Petite = await criaItemCompleto(foodIds.Petite_Tail_Noodles_ids);
  console.log(Petite);

  console.log("end");

  //gravar dados coletados<<

  //executaveis

  //versão final entregando a food completa = recipes e lucro;
  async function criaItemCompleto(itemsIdArray) {
    const item = await criaItemRecipes(itemsIdArray);

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
    await page.goto(urlItemoverview + itemId);
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
  async function tryMarketandSell(id) {
    let marketresquest = await getItemMarketPrice();
    if (marketresquest) {
      return marketresquest;
    } else {
      let npcsell = await buscaNpcSell(id);
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
      value: await tryMarketandSell(id),
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
