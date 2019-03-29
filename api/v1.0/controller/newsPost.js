const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../db/cn.db');

const sendResponse = (req, res) => {
    if (!req.query.lang || !req.query.post_id) {
        res.send("-1:newsPost");
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
    let post_id = (query.post_id).trim();
    let sql = `SELECT id,link,post FROM ${lang} WHERE id='${post_id}' LIMIT 1`;

    db.get(sql, [], (err, row) => {
        if (err) {
            reject(err.message);
        }
        resolve(row);
    });

    // close the database connection
    db.close();
});

module.exports = {
    sendResponse
};