const sqlite3 = require('sqlite3').verbose();
const getNews = require('./getNews');

// load database
let db = new sqlite3.Database('../db/cn.db');

// run delete queries
db.run('DELETE FROM en', [], function (err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`EN - Row(s) deleted ${this.changes}`);
});

db.run('DELETE FROM sn', [], function (err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`SN - Row(s) deleted ${this.changes}`);
});

db.run('DELETE FROM tm', [], function (err) {
    if (err) {
        return console.error(err.message);
    }
    console.log(`TM - Row(s) deleted ${this.changes}`);
    // getNews.get();
});

db.close();