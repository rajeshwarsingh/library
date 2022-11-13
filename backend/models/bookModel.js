const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BookSchema = new Schema({
  bookId: ObjectId,
  bookName: String,
  author: String,
  count:Number
},{collection:'books',_id:true});

const BookModel = mongoose.model('books', BookSchema);

module.exports = BookModel