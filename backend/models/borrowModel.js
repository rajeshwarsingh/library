const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BorrowSchema = new Schema({
    bookId: ObjectId,
  userId:ObjectId,
  borrowId:ObjectId,
  borrowDate: { type: Date, default: Date.now },
},{collection:'borrows'});

const BorrowModel = mongoose.model('borrows', BorrowSchema);

module.exports = BorrowModel