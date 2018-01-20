var express = require('express');
var router = express.Router();

router
    .route('/json')
    .get('/json', function(req, res) {
    console.log("GET the json");
    res
      .status(200)
      .json( {"jsonData" : true} );
})
    .post('/json', function(req, res) {
    console.log("POST the json route");
    res
      .status(200)
      .json( {"jsonData" : "POST recieved"} );
});
    

module.exports = router;