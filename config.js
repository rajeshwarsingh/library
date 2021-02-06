const ENV = process.env.NODE_ENV || 'test'

let config = {
    mongoUrl : 'mongodb://localhost:27017/library', 
    HOST : 'localhost',
    PORT : 3001,
}

if(ENV === 'test'){
    config = {
        mongoUrl : process.env.MONGO_URL || 'mongodb://localhost:27017/libraryTest', 
        HOST : 'localhost',
        PORT : 3001,
    }
}

if(ENV === 'production'){
    config = {
        mongoUrl : process.env.MONGO_URL, 
        HOST : process.env.HOST,
        PORT : process.env.PORT || 3001,
    }
}

module.exports = config
