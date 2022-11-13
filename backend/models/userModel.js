const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  userId:ObjectId,
  sName:String,
},{collection:'users'});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel