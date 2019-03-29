//  query = query string
// sql query = SQL statements 

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const moment = require('moment-timezone');
const dbPath = path.resolve(__dirname, '../../../db/cn.db');

const sendResponse = (req, res) => {
    if (checkInputs(req)) {
        getRecords(req.query).then(newsList => {
            res.send(JSON.stringify(newsList));
        });
    } else {
        return ("-1:getNews");
    }
};

const getRecords = (query) => new Promise((resolve, reject) => {
    let db = new sqlite3.Database(dbPath);
    let sql = getSqlQuery(query);
    let newsList = [];

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            newsList.push(getNewsListItem(row));
        });

        resolve(newsList);
    });

    // close the database connection
    db.close();
});

function getNewsListItem(row) {
    let item = {
        "id": row.id,
        "source": row.source,
        "datetime": formatDateTime(row.datetime),
        "title": row.title,
        "mainImg": getMainImg(row.post)
    };

    return item;
}

function formatDateTime(datetime) {
    let dt = moment(datetime).tz('Asia/Colombo').format('YYYY-MM-DD hh:mm A');
    return dt;
}

function getMainImg(post) {
    const regEx = /<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/;
    try {
        let imgs = (regEx.exec(`${post}`));
        return imgs[1];
    } catch (e) {
        return "null";
    }
}

function checkInputs(req) {
    // check if all requred keys are present
    const required = ['post_id', 'source', 'mode', 'lang'];
    const keys = Object.keys(req.query);

    for (let i = 0; i < required.length; i++) {
        const key = required[i];
        if (!keys.includes(key)) return false;
    }
    return true;
}

function getSqlQuery(query) {
    let post_id = (query.post_id).trim();
    let source = (query.source).trim();
    let mode = (query.mode).trim();
    let lang = (query.lang).trim();
    let sqlQuery;

    if (post_id == '-1' && source == '-1') {
        sqlQuery = `SELECT id,source,datetime,title,post FROM ${lang} ORDER BY datetime DESC LIMIT 15`;
    }

    if (post_id !== '-1' && source == '-1') {
        sqlQuery = `SELECT id,source,datetime,title, post FROM ${lang} WHERE id < '${post_id}' ORDER BY datetime DESC LIMIT 5`;
    }

    if (post_id == '-1' && source !== '-1') {
        sqlQuery = `SELECT id,source,datetime,title, post FROM ${lang} WHERE source = '${source}' ORDER BY datetime DESC LIMIT 15`;
    }

    if (post_id !== '-1' && source !== '-1') {
        sqlQuery = `SELECT id,source,datetime,title, post FROM ${lang}  WHERE id < '${post_id}' AND source='${source}' ORDER BY datetime DESC LIMIT 5`;
    }

    if (post_id !== '-1' && source == '-1' && mode == 'check') {
        sqlQuery = `SELECT id,source,datetime,title, post FROM ${lang} WHERE id > '${post_id}' ORDER BY datetime DESC LIMIT 5`;
    }

    return sqlQuery;
}

module.exports = {
    sendResponse
};