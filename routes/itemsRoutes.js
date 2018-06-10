const mongoose = require('mongoose');
const Item = mongoose.model('items');
const Category = mongoose.model('categories');

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
