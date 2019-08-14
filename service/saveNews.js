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
    try {
        $('.sr-date').parent().remove();
        $('a[href="https://blockads.fivefilters.org"]').parent().remove();
        $('a[href="https://blockads.fivefilters.org/acceptable.html"]').parent().remove();
        $('img[src="https://data.gossiplankanews.com/box0/arti.png"]').remove();
        $(".adsbygoogle").remove();
        $('*').removeAttr("style");
        news.post = escapedHtmlFix($.html());
        news.title = escapedHtmlFix(news.title);
    } catch (error) {

    }

    return news;
};

const escapedHtmlFix = (text) => {
    return text
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("&#039;", "'")
        .replace("&amp;#039;", "'");
};

module.exports = {
    save
};