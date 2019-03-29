const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../db/cn.db');

const sendResponse = (req, res) => {
    if (!req.query.lang) {
        res.send("-1:sourcesList");
    } else {
        getRecords(req.query).then((sourceList) => {
            res.send(JSON.stringify(sourceList));
        }).catch((e) => {
            console.log(e);
        });
    }
};

const getRecords = (query) => new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath);
    let lang = (query.lang).trim();
    let sql = `SELECT DISTINCT(source) FROM ${lang} ORDER BY source`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            reject(err.message);
        }

        resolve(rows);
    });

    // close the database connection
    db.close();
});

module.exports = {
    sendResponse
};