const mongoose = require('mongoose');
const BookModel = require('../models/bookModel')
const BorrowModel = require('../models/borrowModel')
const userModel = require('../models/userModel')

const getBooks = async (req, res) => {
    const books = await BookModel.find({}).exec()
    return res.send(books)
}

const getUsers = async (req, res) => {
    const users = await userModel.find({}).exec()
    return res.send(users)
}


const getBooksById = async (req, res) => {
    const books = await BookModel.findOne({_id:req.params.id}).exec()
    return res.send(books)
}

const borrow = async (req, res) => {
    const { uid, bid } = req.body
    let error ={}

    const BorrowsCount = await BorrowModel.estimatedDocumentCount({userId:uid}).exec()
    error = {error:'LIMIT EXCEEDED!, User has a borrowing limit of 2 books at any point of time!'}
    if(BorrowsCount>=2) return res.send(error)

    const BorrowsBookCount = await BorrowModel.find({userId:mongoose.Types.ObjectId(uid), bookId:mongoose.Types.ObjectId(bid)}).exec()
    error = {error:'ALREADY BORROWED!, Only 1 copy of a book can be borrowed by a User!'}
    if(BorrowsBookCount.length>=1) return res.send(error)

    const BookCount = await BookModel.findOne({_id:bid},{count:1}).exec()
    error = {error:'UNAVAILABLE!, Copy of book is not available!'}
    if(BookCount.count<=0) return res.send(error)
    
    await BorrowModel.create({ userId:uid,bookId:bid })
    const book = await BookModel.findOne({_id:bid}).exec()
    book.count= book.count-1
    const updatedbook = await book.save()
    return res.send(updatedbook)
}

const getIssues = async (req, res) => {
    const userDetails = await userModel.findOne({_id:req.params.sid}).exec()
    const Borrows = await BorrowModel.find({userId:req.params.sid}).exec()
    const bookIds =  Borrows.map(item=>item.bookId)

    const books = await BookModel.find({ _id: { $in: bookIds } })
    
     const Result = Borrows.map(borrow=>{
        const bookDetails = books.filter(item=>borrow.bookId.equals(item['_id']))
        return {
            bookName:bookDetails[0]['bookName'],
            bookId:bookDetails[0]['_id'],
            author:bookDetails[0]['author'],
            sName:userDetails.sName,

        }
    })
    res.send(Result)
}

const returnBook = async (req, res) => {
    const { uid, bid } = req.body

    await BorrowModel.deleteOne({ userId:uid, bookId:bid }).exec()
    const book = await BookModel.findOne({_id:bid}).exec()
    book.count= book.count+1
    await book.save()
    return res.send({"msg":"success"})
}

const users = async (req, res) => {
    const Borrows = await BorrowModel.find({bookId:req.params.id}).exec()
    const userIds =  Borrows.map(item=>item.userId)
    const users = await userModel.find({ _id: { $in: userIds } })

     const Result = Borrows.map(borrow=>{

        const userDetails = users.filter(item=>borrow.userId.equals(item['_id']))
        return {
            sName:userDetails[0]['sName'],
            borrowDate:borrow.borrowDate,
            userId:userDetails[0]['_id']
        }
    })
    res.send(Result)
    
}

const resetAppData = async (req, res) => {

    const resultData = await _resetAppData()
    return res.send(resultData)
}

const clearAppData = async (req, res) => {
    
    await  BorrowModel.deleteMany().exec()

    await  BookModel.deleteMany().exec()

    return res.send({"msg":"success"})
}

async function _resetAppData(){
    const BookData = [{
        "bookName" : "Pat the Zombie",
        "author" : "Aaron Ximm",
        "count" : 1
    },
    {
        "bookName" : "Darwin",
        "author" : "Adrian Desmond & James Moore",
        "count" : 2
    },
    {
        "bookName" : "Focus",
        "author" : "Al Ries",
        "count" : 1
    },
    {
        "bookName" : "The Origin of Brands",
        "author" : "Al Ries",
        "count" : 1
    },
    {
        "bookName" : "The Prefect",
        "author" : "Alastair Reynolds",
        "count" : 3
    },
    {
        "bookName" : "Brave New World",
        "author" : "Aldous Huxley",
        "count" : 1
    }]

    const userData = [
        {
            "sName" : "nav"
        },
        {
            "sName" : "jes"
        },
        {
            "sName" : "miki"
        }
    ]

    await  BorrowModel.deleteMany().exec()
    
    await  BookModel.deleteMany().exec()
    
    const booksRes = await BookModel.insertMany(BookData)

    await  userModel.deleteMany().exec()

    const usersRes = await userModel.insertMany(userData)

    return {
        books:booksRes,
        users:usersRes
    }

}

module.exports = {
    _resetAppData,
    getBooks,
    getBooksById,
    borrow,
    getIssues,
    returnBook,
    users,
    getUsers,
    resetAppData,
    clearAppData,
}