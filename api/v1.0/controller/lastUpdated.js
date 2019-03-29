const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../db/cn.db');

const sendResponse = (req, res) => {
    if (!req.query.lang) {
        res.send("-1:lastUpdated");
    } else {
        getRecord(req.query).then((row) => {
            res.send(JSON.stringify(row));
        }).catch((e) => {
            console.log(e);
        });
    }
};

const getRecord = (query) => new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath);
    let lang = (query.lang).trim();
    let sql = `SELECT id FROM ${lang} ORDER BY id DESC LIMIT 1`;

    db.get(sql, [], (err, row) => {
        if (err) {
            reject(console.error(err.message));
        }
        resolve(row);
    });

    // close the database connection
    db.close();
});

module.exports = {
    sendResponse
};