const config = require('./db');
const User = require('../models/user');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

    module.exports = function(passport) {
     var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = config.secret;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload._id, function(err, user)  {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        
        }
    });
}));    }
