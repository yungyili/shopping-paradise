const mongoose = require('mongoose');
const Category = mongoose.model('categories');

module.exports = (app) => {
  app.post("/api/category",
    async (req, res) => {
      console.log("post /category:", req.body);
      var parentId = undefined;

      if (!req.body || !req.body.title) {
        res.sendStatus(400);
        return;
      }

      if(req.body.parentId){
        parentId = req.body.parentId;
      }
      const {title} = req.body;

      const category =
        await Category.findOne({
          title: title,
          parentId: parentId
        }).exec();

      if (category) {
        res.sendStatus(406);
        return;
      }

      await new Category({
        title: title,
        parentId: parentId
      }).save();

      const root = await Category.findOne({parentId:undefined}).exec();

      if (!root){
        res.sendStatus(400);
        return;
      }

      await Category.rebuildTree(root, 1);
      res.json(newCategory);
    });

  app.get("/api/category", /*auth.authenticate(),*/
      async (req, res) => {
        console.log("get /category root");
        const category = await Category.findOne({parentId: undefined}).exec();

        if(!category){
          res.sendStatus(400);
          return;
        }

        await category.selfAndDescendants(function(err, categories){
          if (err){
            res.sendStatus(400);
          }
          res.json(categories);
        });

      });

  app.get("/api/category/:id", /*auth.authenticate(),*/
    async (req, res) => {
      console.log("get /category:", req.params.id);
      const category = await Category.findOne({_id: req.params.id}).exec();

      if(!category){
        res.sendStatus(400);
        return;
      }

      await category.selfAndDescendants(function(err, categories){
        if (err){
          res.sendStatus(400);
        }
        res.json(categories);
      });

    });

    app.get("/api/category/path/:id", /*auth.authenticate(),*/
      async (req, res) => {
        console.log("get /category:", req.params.id);
        const category = await Category.findOne({_id: req.params.id}).exec();

        if(!category){
          res.sendStatus(400);
          return;
        }

        await category.selfAndAncestors(function(err, categories){
          if (err){
            res.sendStatus(400);
          }
          res.json(categories);
        });

      });
}
