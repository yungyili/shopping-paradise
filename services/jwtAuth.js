// auth.js
var passportJWT = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('users');
var keys = require('../config/keys.js');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: keys.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
};

module.exports = (passport) => {
  var strategy = new Strategy(params,
    async (payload, done) => {
      console.log("JWTStragety: ", payload);
      const user = await User.findById(payload.id).exec();
      if (user) {
        return done(null, {
          id: user.id
        });
      } else {
        return done(new Error('User not found'), null);
      }
    });
  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate('jwt', keys.jwtSession);
    }
  };
};
