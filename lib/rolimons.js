import superagent from 'superagent';
import {print} from "./globals.js";

const agent = superagent.agent()
    .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36')

export const fetchItemSales = itemId => new Promise(resolve => {
    agent.get(`https://www.rolimons.com/itemsales/${itemId}`)
        .then(resp => {
            if (!resp || !resp.text) return resolve();

            return resolve(
                JSON.parse(resp.text.split('var item_sales            = ')[1].split(';')[0])
            )
        })
        .catch(error => {
            if (!error.response) {
                print(`Internal error fetching item sales for ${itemId}:`, error);
                return resolve();
            }

            if (error.response.status === 403) {
                print(`Request blocked when fetching item sales for ${itemId}:`, error);
                return resolve();
            }

            print(`Error fetching item sales for ${itemId}:`, error);
            resolve();
        })
});

export const fetchAllRecentSales = () => new Promise(resolve => {
    agent.get(`https://www.rolimons.com/api/activity`)
        .then(resp => {
            if (!resp.body || !resp.body.activities) return resolve();

            return resolve(resp.body.activities);
        })
        .catch(error => {
            if (!error.response) {
                print(`Internal error fetching recent sales:`, error);
                return resolve();
            }

            if (error.response.status === 403) {
                print(`Request blocked when fetching recent sales:`, error);
                return resolve();
            }

            print(`Error fetching recent sales:`, error);
            resolve();
        })
});