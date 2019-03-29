const saveNews = require("./saveNews");
const fs = require("fs");
const Parser = require('rss-parser');

let parser = new Parser();


function get() {
    // read source site list from sites.json
    const sites = JSON.parse(fs.readFileSync("./sites/sites.json", {
        encoding: 'utf-8', flag: 'r'
    }));

    // loop through each site
    sites.forEach((site) => {
        site.feeds.forEach(feed => {
            loadPosts(site.lang, feed.source, feed.feed);
        });
    });
}

// get news posts using rss
async function loadPosts(lang, source, url) {
    try {
        let feed = await parser.parseURL(url);
        feed.items.forEach(item => {
            let news = {
                lang,
                source,
                title: item.title,
                post: item.content,
                link: item.link
            };
            saveNews.save(news);
        });
    } catch (error) {

    }
}

get();

module.exports = {
    get
};