var hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(req, res) {
    console.log("GET the hotels");
    res
    .status(200)
    .json( hotelData );
};

module.exports.hotelsGetOne = function(req, res) {
    var hotelID = req.params.hotelID; 
    var thisHotel = hotelData[hotelID];
    console.log("GET the hotelID", hotelID);
    res
    .status(200)
    .json( thisHotel );
};