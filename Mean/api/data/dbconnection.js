var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://' + process.env.IP + ':27017/Mean'

var _connection = null;

var open = function() {
    MongoClient.connect(dburl, function (err, client) {
        if(err) {
          console.log("DB connection failed");
          return;
        }
        _connection = client.db("meanhotel");
        console.log("DB connection open", client);
    });
};
var get = function() {
    return _connection;
};

module.exports = {
    open : open,
    get : get
};



