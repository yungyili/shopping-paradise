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

const updateItem = async (req, res) => {
  console.log("put /api/item:", req.body);

  const {_id, title, description, pictureUrl,
    price, storage, _category, isBuyable} = req.body;

  const newData = {title, description, pictureUrl,
    price, storage, _category, isBuyable};

  const _user = req.user.id;

  try {
    await Item.findOneAndUpdate({_id: _id},
      {
      title: title,
      description: description,
      pictureUrl: pictureUrl,
      price: price,
      storage: storage,
      _user: _user,
      _category: _category,
      isBuyable: isBuyable
    }).exec();

    const item = await Item.findOne({_id: _id}).exec();
    if (!item) {
      console.log("put /api/item: cannot find item");
      res.sendStatus(400);
      return;
    } else {
      res.json(item);
    }

  } catch (err) {
    console.log("put /api/item: failed. err=", err);
    res.sendStatus(400);
    return;
  }
}


module.exports = (app, passport) => {
  app.post("/api/item",
    (req, res, next) => {
      console.log("post /api/item: google: req.user", req.user);
      if (req.user){
        createItem(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("post /api/item: jwt: req.user", req.user);
      if (req.user){
        createItem(req, res);
      } else {
        res.sendStatus(400);
      }
    }
  );

  app.put("/api/item",
    (req, res, next) => {
      console.log("put /api/item: google: req.user", req.user);
      if (req.user){
        updateItem(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("put /api/item: jwt: req.user", req.user);
      if (req.user){
        updateItem(req, res);
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
