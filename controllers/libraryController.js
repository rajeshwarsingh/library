const BookModel = require('../models/bookModel')
const BorrowModel = require('../models/borrowModel')
const StudentModel = require('../models/studentModel')

const getBooks = async (req, res) => {

    const books = await BookModel.find({}).exec()
    return res.send(books)
}

const getBooksById = async (req, res) => {
    const books = await BookModel.findOne({_id:req.params.id}).exec()
    return res.send(books)
}

const borrow = async (req, res) => {
    const { studentId, bookId } = req.body
    await BorrowModel.create({ studentId,bookId })
    const book = await BookModel.findOne({_id:bookId}).exec()
    book.count= book.count-1
    await book.save()
    return res.send('success')
}

const getIssues = async (req, res) => {
    const studentDetails = await StudentModel.findOne({_id:req.params.sid}).exec()
    const Borrows = await BorrowModel.find({studentId:req.params.sid}).exec()
    const bookIds =  Borrows.map(item=>item.bookId)
    console.log("bookids :",bookIds)
    const books = await BookModel.find({ _id: { $in: bookIds } })
    console.log("books :",books);
    console.log("Borrows :",Borrows);


     const Result = Borrows.map(borrow=>{

        console.log("########################",borrow.bookId,borrow)
        const bookDetails = books.filter(item=>borrow.bookId.equals(item['_id']))
        console.log('bookDetails   :',bookDetails)
        return {
            bookName:bookDetails[0]['bookName'],
            bookId:bookDetails[0]['_id'],
            author:bookDetails[0]['author'],
            sName:studentDetails.sName,

        }
    })
    res.send(Result)
}

const returnBook = async (req, res) => {
    const { studentId, bookId } = req.body

    await BorrowModel.deleteOne({ studentId, bookId }).exec()
    const book = await BookModel.findOne({_id:bookId}).exec()
    book.count= book.count+1
    await book.save()
    return res.send('returnbook')
}

const students = async (req, res) => {
    console.log("bookId:",req.params.id)
    // const studentDetails = await StudentModel.findOne({_id:req.params.sid}).exec()
    const Borrows = await BorrowModel.find({bookId:req.params.id}).exec()
    const studentIds =  Borrows.map(item=>item.studentId)
    console.log("bookids :",studentIds)
    const students = await StudentModel.find({ _id: { $in: studentIds } })
    console.log("students :",students);
    console.log("Borrows :",Borrows);


     const Result = Borrows.map(borrow=>{

        console.log("########################",borrow.studentId,borrow)
        const studentDetails = students.filter(item=>borrow.studentId.equals(item['_id']))
        console.log('studentDetails   :',studentDetails)
        return {
            sName:studentDetails[0]['sName'],
            borrowDate:borrow.borrowDate,
            studentId:studentDetails[0]['_id']
        }
    })
    res.send(Result)
    
}

const resetAppData = async (req, res) => {

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

    const StudentData = [
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

    await  BookModel.deleteMany().exec()

    await BookModel.insertMany(BookData)

    await  StudentModel.deleteMany().exec()

    await StudentModel.insertMany(StudentData)

    return res.send('success')
}



module.exports = {
    getBooks,
    getBooksById,
    borrow,
    getIssues,
    returnBook,
    students,
    resetAppData
}