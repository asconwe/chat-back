// Init development environment
process.env.NODE_ENV !== 'production' && require('dotenv').config();

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('cookie-session');

// App control
const controllers = require('./controllers');
const socketServer = require('./socket-server');

// Initialize express app
const app = express();

// Apply middleware
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Apply Passport middleware
app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize MongoDB connection
const db = mongoose.connection;
db.on('Database error::::', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to database')
})

// Start socket server
const server = http.Server(app)
socketServer(server)
// Start http controllers
controllers(app)

const PORT = 3000;
server.listen(process.env.PORT || PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
    // Start MongoDB connection
    mongoose.connect(`mongodb://${process.env.IP || 'localhost'}/test`);
})

// Export for testing
module.exports = app;


