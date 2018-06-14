const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const ItemSchema = new Schema({
  title: String,
  description: String,
  pictureUrl: String,
  price: {type: Number, default: 0},
  storage: {type: Number, default: 0},
  _user: {type: Schema.Types.ObjectId, ref: 'users'},
  _category: {type: Schema.Types.ObjectId, ref: 'categories'},
  isBuyable: {type: Boolean, default: false},
  hasBeenPublished: {type: Boolean, default: false}
});

ItemSchema.plugin(mongoosePaginate);

mongoose.model('items', ItemSchema);
