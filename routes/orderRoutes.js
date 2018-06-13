const jwt = require("jwt-simple");
const keys = require('../config/keys');
const mongoose = require('mongoose');
const stripe = require("stripe")(keys.stripeSecretKey);
const User = mongoose.model('users');


const handlePayment = async (req, res) => {
  const token = req.body;
  const categoryId = req.params.id;

  //TODO: query for Order

  try {
    const charge = await stripe.charges.create({
      amount: 500,//TODO: replace by real number
      currency: 'usd',
      description: '5$ for 5 credits',
      source: token.id
    });

  } catch (err) {
    console.log("handlePayment failed:", err);
    res.sendStatus(400);
  }
}

module.exports = (app, passport)=> {

  /* For Google auth */
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
      console.log("/api/auth/current_user: jwt: req.user", req.user);
      handlePayment(req, res);
    }
  );
}
