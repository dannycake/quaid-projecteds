import {QuickDB} from 'quick.db';

const db = new QuickDB({
    filePath: process.env.DB_PATH || 'projs.sqlite',
});

export default db;