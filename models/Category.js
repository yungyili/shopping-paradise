const mongoose = require('mongoose');
const { Schema } = mongoose;
const NestedSetPlugin = require('mongoose-nested-set');

const CategorySchema = new Schema({
  title: { type: String, unique: true }
});

// Include plugin
CategorySchema.plugin(NestedSetPlugin);

mongoose.model('categories', CategorySchema);
