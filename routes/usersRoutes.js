const mongoose = require('mongoose');
const jwt = require("jwt-simple");
const User = mongoose.model('users');
const Category = mongoose.model('categories');
const Item = mongoose.model('items');
const keys = require('../config/keys');

const getUserItems = async (req, res) => {
  const items = await Item.find({_user: req.user.id}).exec();

  res.json(items);
}

module.exports = (app, passport) => {
  app.post("/api/user",
    async (req, res) => {
      console.log("post /user:", req.body);

      const user = await User.findOne({email: req.body.email}).exec();

      if (user) {
        res.sendStatus(406);
        return;
      }

      const {email, password, name} = req.body;

      const newUser = await new User({
        email: email,
        password: password, //TODO: password should be encrypted
        name: name
      }).save();
      console.log("post /user: newUser=", newUser);

      res.json(newUser);
    });

  app.get("/api/user", /*auth.authenticate(),*/
    async (req, res) => {
      console.log("get /user:", req.user);
      const user = await User.findOne({_id: req.user.id}).exec();

      res.json(user);
    });

    app.get('/api/user/item',
      (req, res, next) => {
        console.log("/api/user/items: google: req.user", req.user);
        if (req.user){
          getUserItems(req, res);
          return;
        }
        next();
      },
      passport.authenticate('jwt', keys.jwtSession),
      (req, res) => {
        console.log("/api/user/items: jwt: req.user", req.user);
        if (req.user){
          getUserItems(req, res);
        } else {
          res.sendStatus(406);
        }
      }
    );
};
