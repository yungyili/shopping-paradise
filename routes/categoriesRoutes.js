const mongoose = require('mongoose');
const Category = mongoose.model('categories');

module.exports = (app) => {
  app.post("/api/category",
    async (req, res) => {
      console.log("post /category:", req.body);

      const category = await Category.findOne({email: req.body.path}).exec();

      if (category) {
        res.sendStatus(406);
        return;
      }

      const {path} = req.body;

      const newCategory = await new Category({
        path: path
      }).save();
      console.log("post /category: newCategory=", newCategory);

      res.json(newCategory);
    });

  app.get("/api/category/:path", /*auth.authenticate(),*/
    async (req, res) => {
      console.log("get /category:", req.params.path);
      const path = `/${req.params.path}`;
      const category = await Category.findOne({path: path}).exec();

      res.json(category);
    });
}
