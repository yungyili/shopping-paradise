const mongoose = require('mongoose');
const Category = mongoose.model('categories');
const Item = mongoose.model('items');

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

    app.get("/api/category/:id/sub", /*auth.authenticate(),*/
      async (req, res) => {
        console.log("get /api/category/:id/sub: ", req.params.id);
        const category = await Category.findOne({_id: req.params.id}).exec();

        if(!category){
          res.sendStatus(400);
          return;
        }

        await category.selfAndChildren(function(err, categories){
          if (err){
            res.sendStatus(400);
          }
          res.json(categories);
        });

      });

    app.get("/api/category/:id/path", /*auth.authenticate(),*/
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

      app.get("/api/category/:id/item",
        async (req, res) => {
          console.log("get /api/category/:id/item:", req.params.id);
          console.log("get /api/category/:id/item: query:", req.query);
          const categoryId = req.params.id;
          const category = await Category.findOne({_id: categoryId}).exec();

          if(!category) {
            console.log('get /api/category/:id/item: cannot find category');
            res.sendStatus(400);
            return;
          }

          if (!req.query.pageNum || !req.query.perPage) {
            await Item.find({_category: categoryId},function(err, items){
              if (err){
                console.log('get /api/category/:id/item: cannot find items');
                res.sendStatus(400);
                return;
              }
              res.json(items);
            });
          } else {
            const limit = parseInt(req.query.perPage);
            const page = parseInt(req.query.pageNum);

            Item.paginate({_category: categoryId}, { page: page, limit: limit }, function(err, result) {
              if (err){
                console.log('get /api/category/:id/item: cannot find items');
                res.sendStatus(400);
                return;
              }
              res.json(result.docs);
            });
          }

        });
}
