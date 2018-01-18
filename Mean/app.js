var express = require('express');
var app = express();

app.set('port', 3000);

app.get('/', function(req, res) {
    console.log("GET the homepage");
    res
    .status(404)
    .send("Express yourself");
});

app.get('/json', function(req, res) {
    console.log("GET the json");
    res
    .status(200)
    .json( {"jsonData" : true } );
});

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
console.log('Magic happens on port ' + port);
 });
 
 console.log('Me first!');