var mongoose = require('mongoose');

var hotelSchema = new mongoose.Schema ({
    name : {
        type : String
    },
    stars : Number,
    services : [String],
    description : String,
    photos : [String],
    currency : String
});