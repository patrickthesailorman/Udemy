require('./api/data/db.js');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser =require('body-parser');

var routes = require('./api/routes');

app.set('port', process.env.PORT);

app.use(function(req, res, next) {
   console.log(req.method, req.url);
   next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded( {extended : false}));

app.use('/api', routes);

app.get('/', function(req, res) {
    console.log("GET the homepage");
    res
      .status(200)
      .sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.get('/file', function(req, res) {
    console.log("GET the file");
    res
      .status(200)
      .sendFile(path.join(__dirname, 'app.js'));
});

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
console.log('Magic happens on port ' + port);
 });
 
