var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res) {
    console.log('registering user');
    
    var username = req.body.username;
    var name = req.body.name || null;
    var password = req.body.password;
    
    User.create({
        username: username,
        name: name,
        password: password
    }, function(err, user) {
        if (err) {
            console.log(err);
            res
            .status(400)
            .json(err);
        } else {
            console.log('user created', user);
            res
            .status(201)
            .json(user);
        }
    });
};

module.exports.login = function(req, res) {
    
};