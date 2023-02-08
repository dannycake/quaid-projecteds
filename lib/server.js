import express from 'express';
import db from './db.js';
import * as calculations from './calculations.js';
import {print} from "./globals.js";

let cachedResponse = {};

const app = express();
app.use(express.json());

app.get('/', async (req, resp) => {
    if (cachedResponse.iat && Date.now() - cachedResponse.iat < 1000 * 60 * 5)
        return resp.send(cachedResponse);

    const items = await db.get('items');

    let response = {
        iat: Date.now(),
        items: {}
    };

    for (const itemId in items) {
        const item = items[itemId];
        const points = item.points.reverse().slice(0, 150);

        const filteredPriceOutliars = calculations.filterUnneeded(
            points.map(i => i.price)
        );
        const filteredRapOutliars = calculations.filterUnneeded(
            points.map(i => i.rap)
        );

        if (filteredPriceOutliars.length < 3 || filteredRapOutliars.length < 3) {
            response.items[itemId] = null;
            continue;
        }

        response.items[itemId] = Math.floor(calculations.mean([
            calculations.mean(filteredRapOutliars), calculations.mean(filteredPriceOutliars)
        ]))
    }

    cachedResponse = response;
    return resp.send(response);
});

app.listen(3000, () => {
    print('Server started on port 3000');
});