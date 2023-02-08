import superagent from 'superagent';
import {print, sleep} from "./globals.js";

let ollieData = {};
export const getOllieData = () => ollieData;

export const refreshOllieData = () => new Promise(resolve => {
    superagent('GET', `https://api.danny.ink/api/itemdetails`)
        .then(resp => {
            ollieData = resp.body;
            resolve();
        })
        .catch(async error => {
            if (!error.response) {
                print(`Internal error fetching ollie data:`, error);
                return resolve();
            }

            print(`Error fetching ollie data:`, error.text);

            await sleep(25 * 1000);
            return refreshOllieData().then(resolve);
        })
});