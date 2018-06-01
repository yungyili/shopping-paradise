const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {type:String, default:"John Doe"},
  email: String,
  password: String,
  activated: {type:Boolean, default:true},
  googleId: String
});

mongoose.model('users', UserSchema);
