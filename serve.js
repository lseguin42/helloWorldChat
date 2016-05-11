// simple static server

var express = require('express');
var app = express();

app.use('/', express.static('dist'));

app.use(function(req, res, next){
    return res.sendfile('/dist/index.html', { root: __dirname });
});

app.listen(8080, function () {
    console.log('Static server start on 8080 !');
});