const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');

module.exports = (passport) => {
  passport.serializeUser((user, done) => { //user->id
      done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => { //id->user
      const user = await User.findById(id).exec();
      done(null, user);
  });

  passport.use(new GoogleStrategy({
          clientID: keys.googleClientID,
          clientSecret: keys.googleClientSecret,
          callbackURL: '/api/auth/google/callback',
          proxy: true
      },
      async (token, refreshToken, profile, done) => {
        var user = await User.findOne({googleId: profile.id}).exec();

        if (!user) {
          user = await new User({
            googleId: profile.id
          }).save();
        }
        console.log("GoogleStrategy: return user:", user);

        return done(null, user);
      }));
};
