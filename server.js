// Init development environment
process.env.NODE_ENV !== 'production' && require('dotenv').config();

const mongoose = require('mongoose')
const { server, app, db, sessionStore } = require('./initServer');

// App control
const controllers = require('./controllers');
const {socketServer} = require('./socket-server');

// Initialize MongoDB connection
db.on('Database error::::', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to database')
})

// Init http controllers
controllers(app)
// Init socket controllers
socketServer();


const PORT = 3000;
// Start express 
server.listen(process.env.PORT || PORT, () => {
    console.log(`Listening at https://localhost:${PORT}`)
    // Start MongoDB connection
    mongoose.connect(`mongodb://${process.env.IP || 'localhost'}/test`);
})







// Export for testing
module.exports = app;


