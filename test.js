const puppeteer = require('puppeteer');

const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;


const tableURL = {
    LIVE: 'https://www.novaragnarok.com/?module=vending&action=item&id=',
    HISTORY: 'https://www.novaragnarok.com/?module=vending&action=itemhistory&id=',
};

(async () => {

    const wsChromeEndpointurl = "ws://127.0.0.1:9222/devtools/browser/bb502975-eef4-4c76-af54-7c1a0d5a0d84";
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl
    });



    const page = await browser.newPage();
    await page.goto('https://www.novaragnarok.com/?module=vending&action=item&id=2162');

    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    await bodyHandle.dispose();

    const getTableData = async (itemId, tableType, callback) => {
        let url = '';
        let iconURL = '';
        let itemName = '';

        if (tableType === 'LIVE') url = tableURL.LIVE;
        else if (tableType === 'HISTORY') url = tableURL.HISTORY;
        else {
            console.log(`Error: Invalid value in 'tableType'. Raised from getTableData/3.`);
            return;
        }
        let urlItem = url + itemId;
        await page.goto(urlItem);
        if (html) {
            const dom = new JSDOM(html);

            let table = dom.window.document.getElementById('itemtable');
            if (table !== undefined && table !== null) {
                let tableRows = table.rows;
                let normalizedTable = [];

                for (let row of tableRows) {
                    let arrOfCells = [];
                    for (let cell of row.cells) {
                        arrOfCells.push(cell.textContent.replace(/\\n|\\t|\s/g, ''));
                    }
                    normalizedTable.push(arrOfCells);
                }

                if (dom.window.document.getElementById('market-item-name') !== undefined &&
                    dom.window.document.getElementById('market-item-name').children[0] !== undefined &&
                    dom.window.document.getElementById('market-item-name').children[0].attributes[0] !== undefined) {
                    iconURL = 'https://www.novaragnarok.com' + dom.window.document.getElementById('market-item-name').children[0].attributes[0].textContent;
                }

                if (dom.window.document.getElementById('market-item-name') !== undefined &&
                    dom.window.document.getElementById('market-item-name').children[2] !== undefined) {
                    itemName = dom.window.document.getElementById('market-item-name').children[2].textContent;
                }

                callback(normalizedTable, iconURL, itemName);
            }
        }

    };

    const toMarkdown = (tableData, tableType) => {
        let title = '';

        if (tableType === 'LIVE') title = 'Live Market Data';
        else if (tableType === 'HISTORY') title = 'Transaction History';
        else {
            console.log(`Error: Invalid value in 'tableType'. Raised from toMarkdown/2.`);
            return;
        }

        let data = '```\n';
        for (let row of tableData) {
            for (let cell of row) {
                data = data + cell + ' | ';
            }
            data = data + '\n';
        }
        data = data + '```';
        data.replace('| \n', '\n');
        return {
            title,
            data
        };
    };



    getTableData('2162', 'LIVE', (tableData, iconURL, itemName) => {
        console.log(tableData);
        console.log(iconURL);
        console.log(itemName);

        let message = toMarkdown(tableData, 'LIVE');
        console.log(message);
    });





})();


