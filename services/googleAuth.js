const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');

module.exports = (passport) => {
    passport.serializeUser((user, done) => { //user->id
        done(null, user.googleId);
    });

    passport.deserializeUser(async (id, done) => { //id->user
        const user = await User.findOne({googleId: id}).exec();
        done(null, user);
    });

    passport.use(new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/api/auth/google/callback'
        },
        async (token, refreshToken, profile, done) => {
          var user = await User.findOneAndUpdate({googleId: profile.id},{token: token}).exec();

          if (!user) {
            user = await new User({
              googleId: profile.id,
              token: token
            }).save();
          }

          return done(null, user);
        }));
};
