const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app, passport)=> {
  app.get('/api/current_user',
    async (req, res) => {
      console.log("/api/current_user: req.user", req.user);
      res.send(req.user);
    }
  );

  app.get('/api/auth/google',
    passport.authenticate('google', {
      scope: ['profile','email']
    }));

  app.get('/api/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
        res.redirect('/surveys');
    }
  );

  app.get('/api/auth/logout',
    (req, res) => {
      req.logout();
      res.redirect('/');
    });
}
