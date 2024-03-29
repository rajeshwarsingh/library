# Library Managment System API-backend

### Overview
Library Management Project, User can view the books in library, borrow it and can return it.</br>
/getBooks : API to get the all availabe books in the liberary.</br>
/borrow : API Will add the book in borrowing list and reduce the copy from the library.</br>
/borrows/:sid : API will get the all borrowed books.</br>
/return : API will Remove the book from the Borrow List and Update the Library with copy of return book.</br>

above 3 APIs used in our project. Rest of others created for futur use.</br>
buy default application run on test mode. Set environment variable, NODE_ENV=production, MONGO_URL, HOST,PORT for production

### Setup
1. Clone the project from Git repo
2. Make sure you have node installed (install Node.js LTS v8.X.X, NPM 5.X)
3. Switch to top level directory
4. From the top level, 
    * Run `npm install` to install the packages
    * Run `npm start` to kick off the app
5. Install MongoDB

### Unit tests
Tests live at test/libraryRoute.js and are written in Mocha and chai.

 From the root dir of a project issue `npm run test`.
 
 ### API
 sid : userId
 bid : bookId
 * api fetch books </br>
 curl --location --request GET 'http://localhost:3001/getBooks'

 * api fetch borrow books of specified user </br>
curl --location --request GET 'http://localhost:3001/borrows/userIDXXXXXXXXXX'


 * api to borrow book </br>
curl --location --request POST 'http://localhost:3001/borrow' \
--header 'Content-Type: application/json' \
--data-raw '{"uid":"userIDXXXXXXXXXX","bid":"bookIDXXXXXXXXXX"}

 * api to return book </br>
curl --location --request POST 'http://localhost:3001/return' \
--header 'Content-Type: application/json' \
--data-raw '{"uid":"userIDXXXXXXXXXX","bid":"bookIDXXXXXXXXXX"}
