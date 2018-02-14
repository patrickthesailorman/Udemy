var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// Get all reviews for a hotel
module.exports.reviewsGetAll = function(req, res) {
    var id = req.params.hotelId;
    console.log("GET hotelId", id);
    
  Hotel
    .findById(id)
    .select('reviews')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        response.message = doc.reviews ? doc.reviews : [];
      }
      res
        .status(response.status)
        .json(response.message);
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

var _addReview = function(req,res, hotel) {
   hotel.reviews.push({
       name : req.body.name,
       rating : parseInt(req.body.rating, 10),
       review : req.body.review
   });
   
   hotel.save(function(err, hotelUpdated) {
       if (err) {
           res
           .status(500)
           .json(err);
       } else {
           res
           .status(201)
           .json(hotelUpdated.reviews[hotelUpdated.reviews.length -1]);
       }
   });
};

module.exports.reviewsAddOne = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);
    
   Hotel
      .findById(hotelId)
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
            console.log("Hotel id not found in database", hotelId);
          response.status = 404,
          response.message = {
            "message" : "Hotel ID not found" + hotelId
        };
        } else {
            response.message = doc.reviews ? doc.reviews : [];
        }
        res
          .status(response.status)
          .json(response.message);
    });
};

module.exports.reviewsUpdateOne = function(req, res) {
    var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};

module.exports.reviewsDeleteOne = function(req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log('PUT reviewId ' + reviewId + 'for hotelId ' + hotelId);
    
    Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
        var thisReview;
        var response = {
            status : 200,
            message : {}
        };
        if (err) {
           console.log("Error finding Hotel"); 
           response.status = 500,
           response.message = err;
        } else if(!hotel) {
            console.log("Hotel id not found in database", hotelId);
          response.status = 404,
          response.message = {
            "message" : "Hotel ID not found" + hotelId
        };
        } else {
            // Get the review
            thisReview = hotel.reviews.id(reviewId);
            // If the review doesn't exist Mongoose returns null
            if (!thisReview) {
                response.status = 404;
                response.message = {
                    "message" : "Review Id not found " + reviewId
                };
            }
        }
        if (response.status !== 200) {
            res
            .status(response.status)
            .json(response.message);
        } else {
           hotel.reviews.id(reviewId).remove()
           hotel.save(function(err, hotelUpdated) {
               if (err) {
                   res
                   .status(500)
                   .json(err);
               } else {
                   res
                   .status(204)
                   .json();
               }
           });
        }
    });
    
};