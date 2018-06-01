const mongoose = require('mongoose');
const Item = mongoose.model('items');

module.exports = (app) => {
  app.post("/api/item",
    async (req, res) => {
      console.log("post /item:", req.body);

      const {title, description, pictureUrl,
        price, storage, _user, _category} = req.body;

      const newItem = await new Item({
        title: title,
        description: description,
        pictureUrl: pictureUrl,
        price: price,
        storage: storage,
        _user: _user,
        _category: _category
      }).save();
      console.log("post /item: newItem=", newItem);

      res.json(newItem);
    });

  app.get("/api/item/:id", /*auth.authenticate(),*/
    async (req, res) => {
      const item = await Item.findOne({_id: req.params.id}).exec();

      res.json(item);
    });
}
