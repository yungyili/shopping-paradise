const jwt = require("jwt-simple");
const keys = require('../config/keys');
const mongoose = require('mongoose');
const stripe = require("stripe")(keys.stripeSecretKey);
const User = mongoose.model('users');
const Order = mongoose.model('orders');
const Item = mongoose.model('items');

const handlePayment = async (req, res) => {
  const token = req.body;
  const orderId = req.params.id;

  const order = await Order.findOne({_id: orderId}).exec();
  if (!order){
    console.log("handlePayment failed: cannot find order");
    res.send(400);
    return;
  }

  try {
    const charge = await stripe.charges.create({
      amount: parseInt(order.total * 100),
      currency: 'usd',
      description: '5$ for 5 credits',
      source: token.id
    });

  } catch (err) {
    console.log("handlePayment failed:", err);
    res.sendStatus(400);
    return;
  }

  //TODO: need to substract what in the order from storage
  
  res.send(orderId);
}

const makeOrder = async (req, res) => {
  console.log("make order: req.body=", req.body);

  if (!req.body) {
    res.sendStatus(400);
    return;
  }

  try {
    const {items, payment, receiverAddress, receiverName} = req.body;
  } catch(err){
    res.sendStatus(400);
    return;
  }

  const {items, payment, receiverAddress, receiverName} = req.body;

  if (items.length == 0){
    res.sendStatus(400);
    console.log("makeOrder: failed. No item.");
    return;
  }

  const sellerId = items[0]._user;
  for(var i=0;i<items.length;i++){
    if (sellerId != items[i]._user){
      res.sendStatus(400);
      console.log("makeOrder: failed. Not all of the items belong to same seller");
      return;
    }
  }

  var total = 0;
  for (var i=0; i<items.length;i++){
    const storageItem = await Item.findOne({_id: items[i].item._id}).exec();
    if (storageItem.storage < items[i].quantity){
      res.sendStatus(400);
      console.log("makeOrder: failed. Not enough storage.");
      return;
    }
    console.log("makeOrder: storageItem=",storageItem, "items[i]=", items[i]);
    total += storageItem.price * items[i].quantity;
  }

  const newOrder = await new Order({
    _buyer: req.user._id,
    _seller: sellerId,
    items: items.map(item=>item.item),
    quantities: items.map(item=>item.quantity),
    receiverName: receiverName,
    receiverAddress: receiverAddress,
    total: total
  }).save();
  console.log("makeOrder: newOrder=", newOrder);

  res.send(newOrder._id);
}

module.exports = (app, passport)=> {
  app.post('/api/order/:id/payment',
    (req, res, next) => {
      console.log("/api/order/:id/payment: google: req.user", req.user);
      if (req.user){
        handlePayment(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("/api/order/:id/payment: jwt: req.user", req.user);
      handlePayment(req, res);
    }
  );

  app.post('/api/order',
    (req, res, next) => {
      console.log("/api/order: google: req.user", req.user);
      if (req.user){
        makeOrder(req, res);
        return;
      }
      next();
    },
    passport.authenticate('jwt', keys.jwtSession),
    (req, res) => {
      console.log("/api/order: jwt: req.user", req.user);
      makeOrder(req, res);
    }
  );
}
