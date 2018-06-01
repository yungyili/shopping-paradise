const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {
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
};
