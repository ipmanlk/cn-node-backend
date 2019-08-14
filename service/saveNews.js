const sqlite3 = require('sqlite3').verbose();
const cheerio = require('cheerio');

// load database
let db = new sqlite3.Database('../db/cn.db');

const save = (newsData) => {
    news = clean(newsData);
    if (news.title !== "") {
        db.run(`INSERT INTO ${news.lang}(source, title, post, link) VALUES(?,?,?,?)`, [`${news.source}`, `${news.title}`, `${news.post}`, `${news.link}`], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }
};

const clean = (news) => {
    const $ = cheerio.load(news.post);
    // remove ada feed junk
    $('.sr-date').parent().remove();
    news.post = $.html();
    return news;
};

module.exports = {
    save
};