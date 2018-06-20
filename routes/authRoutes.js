const jwt = require("jwt-simple");
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app, passport)=> {

  /* For Google auth */
  app.get('/api/auth/current_user',
    (req, res, next) => {
      console.log("/api/auth/current_user: google: req.user", req.user);
      if (req.user){
        res.send(req.user);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("/api/auth/current_user: jwt: req.user", req.user);
      if (req.user){
        res.send(req.user);
      } else {
        res.send({});
      }
    }
  );

  app.get('/api/auth/google',
    passport.authenticate('google', {
      scope: ['profile','email']
    }));

  app.get('/api/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
        res.redirect('/');
    }
  );

  app.get('/api/auth/logout',
    (req, res) => {
      req.logout();
      res.redirect('/');
    });

  /* For JWT auth */
  app.post("/api/auth/jwt",
    async (req, res) => {
      console.log("post /api/auth/jwt: ", req.body);
      if (req.body.email && req.body.password) {
          const {email, password} = req.body;
          const user = await User.findOne({'email':email, 'password':password}).exec();
          if (user) {
              var payload = {
                  id: user.id
              };
              var token = jwt.encode(payload, keys.jwtSecret);
              res.json({
                  token: token
              });
          } else {
              res.sendStatus(401);
          }
      } else {
          res.sendStatus(401);
      }
    });

  app.post("/api/auth/sign-up",
    async (req, res) => {
      console.log("post /api/auth/sign-up: ", req.body);
      res.sendStatus(401);
    });
}
