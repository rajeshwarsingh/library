const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const StudentSchema = new Schema({
  studentId:ObjectId,
  sName:String,
},{collection:'students'});

const StudentModel = mongoose.model('students', StudentSchema);

module.exports = StudentModel