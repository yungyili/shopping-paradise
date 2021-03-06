const mongoose = require('mongoose');
const jwt = require("jwt-simple");
const User = mongoose.model('users');
const Category = mongoose.model('categories');
const Order = mongoose.model('orders');
const Item = mongoose.model('items');
const keys = require('../config/keys');

const getUserItems = async (req, res) => {
  await Item.find({_user: req.user._id}, function(err, items){
    if (err){
      res.sendStatus(400);
      return;
    }
    res.json(items);
  });
}

const normalizeOrder = async (order) => {
  console.log("normalizeOrder: order=", order);
  let buyer, seller, items;

  try{
    buyer = (({ name , email, _id }) => ({ name, email, _id }))
      (await User.findOne({_id: order._buyer}).exec());

    seller = (({ name , email, _id }) => ({ name, email, _id }))
      (await User.findOne({_id: order._seller}).exec());

    const combinedQuery = {
      $or: order.items.map(id => {
        return { _id: id };
      })
    };

    items = (await Item.find(combinedQuery).exec())
      .map((({ title , price, storage, _category, pictureUrl }) =>
        ({ title , price, storage, _category, pictureUrl })));

  } catch(err) {
  }

  const ret = {
    _id: order._id,
    _buyer: buyer,
    _seller: seller,
    items: items,
    quantities: order.quantities,
    receiverName: order.receiverName,
    receiverAddress: order.receiverAddress,
    total: order.total,
    isPaid: order.isPaid,
    isShipped: order.isShipped,
    isCanceled: order.isCanceled
  };

  console.log("normalizeOrder: normalized order=", ret);
  return ret;
}

const getOrders = async (req, res, character) => {
  console.log("getOrders: character=", character);
  const orders = await Order.find({[character]: req.user._id}).exec();
  console.log("getOrders: orders=", orders);

  const normalizedOrder = await Promise.all(orders.map(async (order) => {return await normalizeOrder(order);} ));
  console.log("getOrders: normalizedOrder=", normalizedOrder);
  res.json(normalizedOrder);
}

const getUserSellOrders = (req, res) => {
  return getOrders(req, res, '_seller');
}

const getUserBuyOrders = async (req, res) => {
  return getOrders(req, res, '_buyer');
}

const sellerUpdateOrders = async (req,res) => {
  const orderId = req.params.id;
  const {isShipped, isCanceled} = req.body;
  console.log("sellerCancelOrders: orderId=", orderId);
  console.log("sellerCancelOrders: req.body=", req.body);

  const modify = {};
  if(isCanceled){
    modify.isCanceled = true;
  }
  if(isShipped){
    modify.isShipped = true;
  }

  await Order.updateOne(
  {
    _id: orderId,
    _seller: req.user._id
  }, {
    $set:{...modify}
  }, async function(err){
    if (err){
      res.sendStatus(400);
      return;
    }
    await getOrders(req, res, '_seller');
  });
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
      const user = await User.findOne({_id: req.user._id}).exec();

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

  app.get('/api/user/buy/order',
    (req, res, next) => {
      console.log("/api/user/buy/order: google: req.user", req.user);
      if (req.user){
        getUserBuyOrders(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("/api/user/buy/order: jwt: req.user", req.user);
      if (req.user){
        getUserBuyOrders(req, res);
      } else {
        res.sendStatus(406);
      }
    }
  );

  app.get('/api/user/sell/order',
    (req, res, next) => {
      console.log("/api/user/sell/order: google: req.user", req.user);
      if (req.user){
        getUserSellOrders(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("/api/user/sell/order: jwt: req.user", req.user);
      if (req.user){
        getUserSellOrders(req, res);
      } else {
        res.sendStatus(406);
      }
    }
  );

  app.put('/api/user/sell/order/:id',
    (req, res, next) => {
      console.log("put /api/user/sell/order: google: req.user", req.user);
      if (req.user){
        sellerUpdateOrders(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("put /api/user/sell/order: jwt: req.user", req.user);
      if (req.user){
        sellerUpdateOrders(req, res);
      } else {
        res.sendStatus(406);
      }
    }
  );

};
