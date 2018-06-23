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
        console.log("GoogleStrategy: profile=",profile);
        var user = await User.findOne({googleId: profile.id}).exec();
        let email = '';
        try {
          email = profile.emails[0].value;
        } catch(err){}

        if (!user) {
          user = await new User({
            googleId: profile.id,
            name: profile.displayName,
            email: email
          }).save();
        }
        console.log("GoogleStrategy: return user:", user);

        return done(null, user);
      }));
};
