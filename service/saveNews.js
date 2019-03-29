const sqlite3 = require('sqlite3').verbose();

// load database
let db = new sqlite3.Database('../db/cn.db');

const save = (news) => {
    db.run(`INSERT INTO ${news.lang}(source, title, post, link) VALUES(?,?,?,?)`, [`${news.source}`,`${news.title}`,`${news.post}`,`${news.link}`], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
};

module.exports = {
    save
};