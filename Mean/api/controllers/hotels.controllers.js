var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
    var lng = ParseFloat(req.query.lng);
    var lat =ParseFloat(req.query.lat);
    
    // A geoJSON point
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };
    
    var geoOptions = {
        spherical : true,
        maxDistance : 2000,
        num : 5
    };
    
    Hotel
    .geoNear(point, geoOptions, function(err, results, stats) {
        console.log('Geo results', results);
        console.log('Geo stats', stats);
        res
        .status(200)
        .json(results);
    });
};

module.exports.hotelsGetAll = function(req, res) {
    
    var offset = 0;
    var count = 5;
    var maxCount = 10;
    
    if (req.query && req.query.lat && req.query.lng) {
      runGeoQuery(req, res);
      return;
    }
    
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    
     if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }
    
    if (isNaN(offset) || isNaN(count)) {
        res
        .status(400)
        .json({
            "message" : "if supplied in querystring count and offset should be numbers"
        });
        return;
    }
    
    if (count > maxCount) {
        res
        .status(400)
        .json({
            "message" : "Count limit of " + maxCount + "exceeded."
        });
        return;
    }
    
    Hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, hotels) {
        if (err) {
          console.log("Error finding Hotels");
          res  
            .status(500)
            .json(err);
        } else {
          console.log("Found hotels", hotels.length);
          res
           .json(hotels);
        }
    });
    
  // collection
  //   .find()
  //   .skip(offset)
  //   .limit(count)
  //   .toArray(function(err, docs) {
  //       console.log("Found Hotels", docs);
  //       res
  //       .status(200)
  //       .json(docs);
  //   });
  
};

module.exports.hotelsGetOne = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);
    
   Hotel
      .findById(hotelId)
      .exec(function(err, doc) { 
        res
          .status(200)
          .json( doc );
    });
};

module.exports.hotelsAddOne = function(req, res) {
    var db = dbconn.get();
    var collection = db.collection('hotels');
    var newHotel;
    
    console.log("POST new hotel");
    
    if(req.body && req.body.name && req.body.stars) {
        newHotel = req.body;
        newHotel.stars = parseInt(req.body.stars, 10);
        collection.insertOne(newHotel, function(err, response) {
          console.log(response);
          console.log(response.ops);
          res
            .status(201)
            .json(response.ops);
        });
    } else {
        console.log("Data missing from body");
        res
        .status(400)
        .json({ message: "Required data missing from body" });
    }
};