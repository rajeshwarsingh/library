var express = require('express');
var router = express.Router();

const libraryController = require('../controllers/libraryController');

const {
  getBooks,
  getBooksById,
  borrow,
  getIssues,
  returnBook,
  students,
  resetAppData
} = libraryController


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getBooks',getBooks);

router.get('/getBooks/:id', getBooksById);

router.post('/borrow', borrow);

router.get('/getIssues/:sid', getIssues);

router.post('/return', returnBook);

router.get('/students/:id', students);

router.get('/resetAppData', resetAppData);

router.get('*', function(req, res, next) {
  res.send('not found');
});

module.exports = router;
