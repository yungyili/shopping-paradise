const mongoose = require('mongoose');
const jwt = require("jwt-simple");
const keys = require('../config/keys');
const Item = mongoose.model('items');
const Category = mongoose.model('categories');

const createItem = async (req, res) => {
  console.log("post /api/item:", req.body);

  const {title, description, pictureUrl,
    price, storage, _category, isBuyable} = req.body;

  const _user = req.user._id;

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
  console.log("post /api/item: newItem=", newItem);

  const items = await Item.find({_user: _user}).exec();
  if(!items){
    console.log("post /api/item: cannot find user items");
    res.sendStatus(400);
    return;
  }

  res.json(items);
}

const updateItem = async (req, res) => {
  console.log("put /api/item:", req.body);

  const {title, description, pictureUrl,
    price, storage, _category, isBuyable} = req.body;

  const itemId = req.params.id;

  const newData = {title, description, pictureUrl,
    price, storage, _category, isBuyable};

  const _user = req.user._id;

  try {
    await Item.findOneAndUpdate({_id: itemId},
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

    const items = await Item.find({_user: _user}).exec();
    if(!items){
      console.log("put /api/item: cannot find user items");
      res.sendStatus(400);
      return;
    }

    res.json(items);

  } catch (err) {
    console.log("put /api/item: failed. err=", err);
    res.sendStatus(400);
    return;
  }
}

const deleteItem = async (req, res) => {
  console.log("delete /api/item:", req.body);

  const itemId = req.params.id;
  const _user = req.user._id;

  await Item.findOneAndDelete({_id: itemId, _user: _user},async function(err, doc){
    if (err) {
      console.log("delete /api/item: cannot delete item");
      res.sendStatus(400);
      return;
    }

    const items = await Item.find({_user: _user}).exec();
    if(!items){
      console.log("delete /api/item: cannot find user items");
      res.sendStatus(400);
      return;
    }

    res.json(items);
  });
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

  app.put("/api/item/:id",
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

  app.delete("/api/item/:id",
    (req, res, next) => {
      console.log("delete /api/item: google: req.user", req.user);
      if (req.user){
        deleteItem(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("delete /api/item: jwt: req.user", req.user);
      if (req.user) {
        deleteItem(req, res);
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
