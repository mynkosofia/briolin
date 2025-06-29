const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/db');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
     role: {
        type: String,
        default: 'user' // або 'admin' для адмінів
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByLogin = function(login, callback) {
    const query = {login: login};
    User.findOne(query, callback);
};

module.exports.getUserById = function(Id, callback) {
    User.findById(Id, callback);
};

module.exports.addUser = function(newUser, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) throw err;
        newUser.password = hash;
       newUser.save().then(result => callback(null, result)).catch(err => callback(err));
    });
});
  
};

module.exports.comparePass = function(passFromUser, userDbPass, callback) {
    bcrypt.compare(passFromUser, userDbPass, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};