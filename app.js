const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// ceylon news api
app.get('/cn/v1.0', function (req, res) {
    const cnRequestHandler = require('./api/v1.0/requestHandler');
    if (req.query["action"]) {
        cnRequestHandler.handle(req, res);
    } else {
        res.send("-1:action");
    }
});

app.listen(port);
console.log('Server started at port : ' + port);