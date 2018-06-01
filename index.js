const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const app = express();
require('./models/User');
require('./models/Category');
require('./models/Item');
mongoose.connect(keys.mongoURI);

app.use(bodyParser.json());

app.get('/api', (req,res)=>{
  res.send({
    status: 'Service is alive!'
  });
});

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
