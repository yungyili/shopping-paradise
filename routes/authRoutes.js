const jwt = require("jwt-simple");
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');


const getCurrentUser = async (req, res) => {
  if (req.user){
    const userId = req.user._id;
    const user = await User.findOne({_id: userId}, (err, user) => {
      if (err){
        res.sendStatus(401);
        return;
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email
      })
    });

    return;
  } else {
    res.sendStatus(401);
  }
}

module.exports = (app, passport)=> {

  /* For Google auth */
  app.get('/api/auth/current_user',
    (req, res, next) => {
      console.log("/api/auth/current_user: google: req.user", req.user);
      if (req.user){
        getCurrentUser(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("/api/auth/current_user: jwt: req.user", req.user);
      getCurrentUser(req, res);
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
                  _id: user.id
              };
              var token = jwt.encode(payload, keys.jwtSecret);
              res.json({
                  token: token,
                  name: user.name,
                  email: user.email
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

      if (req.body === undefined || req.body === null){
          res.sendStatus(400);
          return;
      }

      const {userName, password, email} = req.body;
      if (!userName || !password || !email){
        console.log("post /api/auth/sign-up: invalid param");
        res.sendStatus(400);
        return;
      }

      const existedEmail = await User.findOne({email: email}).exec();
      if (existedEmail){
        console.log("post /api/auth/sign-up: email existed");
        res.sendStatus(400);
        return;
      }

      const existedUserName = await User.findOne({name: userName}).exec();
      if (existedUserName){
        console.log("post /api/auth/sign-up: user name existed");
        res.sendStatus(400);
        return;
      }

      const user = await new User({
        name: userName,
        email: email,
        password: password
      }).save();

      if (user) {
          var payload = {
              _id: user.id
          };
          var token = jwt.encode(payload, keys.jwtSecret);
          res.json({
              token: token,
              _id: user.id,
              name: user.name,
              email: user.email
          });
      } else {
          console.log("post /api/auth/sign-up: failed to create user");
          res.sendStatus(400);
      }
    });
}
