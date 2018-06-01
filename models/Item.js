const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
  title: String,
  description: String,
  pictureUrl: String,
  price: {type: Number, default: 0},
  storage: {type: Number, default: 0},
  _user: {type: Schema.Types.ObjectId, ref: 'users'},
  _category: {type: Schema.Types.ObjectId, ref: 'categories'}
});

mongoose.model('items', ItemSchema);
