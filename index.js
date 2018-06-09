const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const app = express();
require('./models/User');
require('./models/Category');
require('./models/Item');
mongoose.connect(keys.mongoURI);

require('./services/googleAuth')(passport);
require('./services/jwtAuth')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [keys.cookieKey] // can use multiple keys
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes.js')(app, passport);
require('./routes/usersRoutes.js')(app);
require('./routes/itemsRoutes.js')(app);
require('./routes/categoriesRoutes.js')(app);

if (process.env.NODE_ENV == 'production') { //set by Heroku
  // 1. Express will serve up production assets
  // Like our mina.js file, or main.css file.
  app.use(express.static('client/build'));

  // 2. Express will serve up index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res)=>{
    res.sendFile(
      path.resolve(
        __dirname,
        'client', 'build', 'index.html'
      ));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log("Listening on port", PORT));

// for testing
module.exports = app;
