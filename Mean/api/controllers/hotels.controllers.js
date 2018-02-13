var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
    var lng =  parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    
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
            "message" : "Count limit of " + maxCount + " exceeded."
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
    var id = req.params.hotelId;
    console.log("GET hotelId", id);
    
  Hotel
    .findById(id)
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("HotelId not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      }
      res
        .status(response.status)
        .json(response.message);
    });

};

var _splitArray = function(input) {
    var output;
    if (input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(req, res) {
    
    Hotel
    .create({
        name : req.body.name,
        description : req.body.description,
        stars : parseInt(req.body.stars, 10),
        services : _splitArray(req.body.services),
        photos : _splitArray(req.body.photos),
        currency : req.body.currency,
        location : {
            address: req.body.address,
            coordinates :[ 
                parseFloat(req.body.lng), 
                parseFloat(req.body.lat)]
        }
    }, function(err, hotel) {
        if (err) {
            console.log("Error creating Hotel");
            res
            .status(400)
            .json(err);
        } else {
            console.log("Hotel Created", hotel);
            res
            .status(201)
            .json(hotel);
        }
    });

};