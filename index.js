import * as items from './lib/items.js';
import * as rolimons from "./lib/rolimons.js";
import db from "./lib/db.js";
import {sleep, repeat, print} from "./lib/globals.js";
import {Worker} from 'node:worker_threads';

const getAllItems = async () => (await db.get('items')) || {};

const updateMissingItems = async () => {
    const itemsStored = Object.keys(await getAllItems());
    const ollieItems = Object.values(items.getOllieData());

    const missingItems = ollieItems
        .filter(ollieItem => !itemsStored.find(item => Number(item) === ollieItem.id));

    for (const missingItem of missingItems) {
        print(`Scraping missing data for "${missingItem.name}" (${missingItem.id})...`);

        // fetch all points for the item from rolimons
        const allPoints = await rolimons.fetchItemSales(missingItem.id);
        if (!allPoints) {
            print(`Failed to scrape data for "${missingItem.name}" (${missingItem.id})`);
            continue;
        }

        // condense each array into a single array of objects
        const mappedPoints = allPoints.timestamp_list.map((point, index) => ({
            saleId: allPoints.sale_id_list[index],
            timestamp: point,
            rap: allPoints.sale_rap_list[index],
            // value: allPoints.sale_value_list[index],
            price: allPoints.sale_price_list[index],
        }));

        // store the data for later use
        await db.set(`items.${missingItem.id}.points`, mappedPoints);

        print(`Saved ${mappedPoints.length} points for "${missingItem.name}" (${missingItem.id})...`);

        // courtesy sleep yw rolimon
        await sleep(4 * 1000);
    }
};
const handleNewSales = async () => {
    const newSales = await rolimons.fetchAllRecentSales();
    if (!newSales) return;

    for (const saleData of newSales) {
        const [
            timestamp,
            _unknown,
            itemId,
            oldRap,
            newRap,
            saleId,
        ] = saleData;
        const itemSales = await db.get(`items.${itemId}.points`);
        if (!itemSales) {
            print(`Found sale for ${itemId}, but previous data hasn't been scraped yet`);
            continue;
        }

        // check if sale is a duplicate
        if (itemSales.find(sale => sale.saleId === saleId)) continue;

        const estimatedPrice = oldRap + (newRap - oldRap) * 10;
        await db.push(`items.${itemId}.points`, {
            saleId,
            timestamp,
            rap: newRap,
            price: estimatedPrice,
        });

        print(`Found new sale for ${itemId} (${oldRap.toLocaleString()} -> ${newRap.toLocaleString()} | approx. ${estimatedPrice.toLocaleString()})`);
    }
};

const main = async () => {
    print(`Fetching data from api.danny.ink...`);
    await items.refreshOllieData();

    repeat(items.refreshOllieData, 60 * 1000);
    repeat(updateMissingItems, 5 * 60 * 1000);
    repeat(handleNewSales, 20 * 1000);
}

main();

new Worker('./lib/server.js')