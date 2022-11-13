process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

const libraryController = require('../controllers/libraryController')

const {
    _resetAppData
} = libraryController



chai.use(chaiHttp);
//Our parent block
describe('Books', async () => {
    let bookId
    let userId
    let InitialBookData

    before((done) => { //Before each test we empty the database
        let resultData = _resetAppData().then(res => {
            const { books, users } = res
            InitialBookData = books
            bookId = books[0]['_id']
            userId = users[0]['_id']
            done()
        })

    });
    /*
      * Test the /GET route for all the book in library
      */
    describe('/GET books', () => {
        it('it should GET all the books', (done) => {
            chai.request(server)
                .get('/getBooks')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(6);
                    done();
                });
        });
    });
    /*
    * Test the /POST route for borrowing the book
    */
    describe('/POST borrow and Return', () => {

        it('it should Borrow the book from the library', (done) => {

            let body = {
                uid: userId,
                bid: bookId
            }

            chai.request(server)
                .post('/borrow')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });


        it('it should not Borrow the same book from the library, Only 1 copy of a book can be borrowed by a User', (done) => {

            let body = {
                uid: userId,
                bid: bookId
            }
            const error = { error: 'ALREADY BORROWED!, Only 1 copy of a book can be borrowed by a User!' }
            chai.request(server)
                .post('/borrow')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('error').that.is.a('string');
                    res.body.should.have.property('error', error.error)
                    done();
                });
        });

        it('it should able to Borrow another book form the library', (done) => {

            let body = {
                uid: userId,
                bid: InitialBookData[1]['_id']
            }

            chai.request(server)
                .post('/borrow')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

        it('it should not allow to Borrow more that 2 form the library', (done) => {

            let body = {
                uid: userId,
                bid: InitialBookData[3]['_id']
            }

            const error = { error: 'LIMIT EXCEEDED!, User has a borrowing limit of 2 books at any point of time!' }
            chai.request(server)
                .post('/borrow')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('error').that.is.a('string');
                    res.body.should.have.property('error', error.error)
                    done();
                });
        });

        it('it should Return the specified book', (done) => {

            let body = {
                uid: userId,
                bid: bookId
            }

            chai.request(server)
                .post('/return')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('msg').that.is.a('string');
                    res.body.should.have.property('msg', 'success')
                    done();
                });
        });

    });
    /*
    * Test the /GET get borrow list
    */
    describe('/GET borrow list', () => {

        it('it should GET all the borrowed books', (done) => {
            chai.request(server)
                .get(`/borrows/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

    });
});