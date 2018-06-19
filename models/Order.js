const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  _buyer: {type: Schema.Types.ObjectId, ref: 'users'},
  _seller: {type: Schema.Types.ObjectId, ref: 'users'},
  items: [{type: Schema.Types.ObjectId, ref: 'items'}],
  quantities: [{type: Number, default: 0}],
  receiverName: String,
  receiverAddress: String,
  total: {type: Number, default: 0},
  isPaid: {type: Boolean, default: false},
  isShipped: {type: Boolean, default: false},
  isCanceled: {type: Boolean, default: false}
});

mongoose.model('orders', OrderSchema);
