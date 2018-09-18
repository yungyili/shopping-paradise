const mongoose = require('mongoose');
const jwt = require("jwt-simple");
const keys = require('../config/keys');
const Item = mongoose.model('items');
const Category = mongoose.model('categories');

const createItem = async (req, res) => {
  console.log("post /api/item:", req.body);

  const {title, description, pictureUrl,
    price, storage, _category, isBuyable} = req.body;

  const _user = req.user.id;

  const newItem = await new Item({
    title: title,
    description: description,
    pictureUrl: pictureUrl,
    price: price,
    storage: storage,
    _user: _user,
    _category: _category,
    isBuyable: isBuyable
  }).save();
  console.log("post /item: newItem=", newItem);

  res.json(newItem);
}


module.exports = (app, passport) => {
  app.post("/api/item",
  (req, res, next) => {
    console.log("/api/item: google: req.user", req.user);
    if (req.user){
      createItem(req, res);
      return;
    }
    next();
  },
  passport.authenticate('jwt', keys.jwtSession),
  (req, res) => {
    console.log("/api/item: jwt: req.user", req.user);
    if (req.user){
      createItem(req, res);
    } else {
      res.sendStatus(400);
    }
  }
);

  app.get('/api/item/:id' /*auth.authenticate(),*/,
    async (req, res) => {
      console.log('get /api/item:', req.params.id);
      const itemId = req.params.id;

      const item = await Item.findOne({_id: itemId}).exec();
      if (!item) {
        res.sendStatus(400);
        return;
      }

      const category = await Category.findOne({_id: item._category}).exec();
      if (!item) {
        res.sendStatus(400);
        return;
      }

      await category.selfAndAncestors(function(err, path) {
        if (err) {
          res.sendStatus(400);
          return;
        }

        res.json([{
          ...item._doc,
          path: path
        }]);
      });
    });
}
