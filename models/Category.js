const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  path: { type: String, unique: true }
});

mongoose.model('categories', CategorySchema);
