const newsList = require("./controller/newsList");
const lastUpdated = require("./controller/lastUpdated");
const newsPost = require("./controller/newsPost");
const sourcesList = require("./controller/sourcesList");


const handle = (req, res) => {
    switch (req.query.action) {
        case "news_list":
            newsList.sendResponse(req, res);
            break;
        case "news_check":
            lastUpdated.sendResponse(req, res);
            break;
        case "news_post":
            newsPost.sendResponse(req, res);
            break;
        case "sources_list":
            sourcesList.sendResponse(req, res);
            break;
        case "version":
            res.send(JSON.stringify({ "version": "5.8.1" }));
            break;
        default:
            return ("-1:cnRequestHandler:handle");
    }
};

module.exports = {
    handle
};
