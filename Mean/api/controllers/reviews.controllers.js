var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// Get all reviews for a hotel
module.exports.reviewsGetAll = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);
    
   Hotel
      .findById(hotelId)
      .select('reviews')
      .exec(function(err, doc) { 
          console.log("Returned doc", doc);
        res
          .status(200)
          .json( doc.reviews );
    });
    
};
//Get a single review for a hotel
module.exports.reviewsGetOne = function(req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log("GET reviewId" + reviewId + "for hotelId " + hotelId);
    
     Hotel
      .findById(hotelId)
      .select('reviews')
      .exec(function(err, hotel) { 
          console.log("Returned hotel", hotel);
          var review = hotel.reviews.reviewId(reviewId);
            res
              .status(200)
              .json( review );
    });
};

module.exports.reviewsAddOne = function(req, res) {
    var id = req.params.hotelId;
    console.log("GET hotelId", id);
    
   Hotel
      .findById(id)
      .select('reviews')
      .exec(function(err, doc) { 
                    var response = {
              status : 200,
              message : doc
          };
       if (err) {
          console.log("Error finding Hotel");
          response.status = 500,
          response.message = err;
        } else if(!doc) {
            console.log("Hotel id not found in database", id);
          response.status = 404,
          response.message = {
            "message" : "Hotel ID not found" + id
        };
        } else {
            response.message = doc.reviews ? doc.reviews : [];
        }
        res
          .status(response.status)
          .json(response.message);
    });
};