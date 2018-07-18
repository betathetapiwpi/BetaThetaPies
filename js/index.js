var express = require('express');
var app = express();

const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname + '/../'));

app.get('/', function (req, res) {
    res.render('/index.html');
});

app.listen(PORT);