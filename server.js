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
app.use(cookieParser(process.env.SECRET));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    domain: 'localhost',
    maxAge: 1000 * 60 * 60 * 24 * 30
}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "http://localhost:9001");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
         res.sendStatus(200);
     } else {
         next();
     }
});

// Apply Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize MongoDB connection
const db = mongoose.connection;
db.on('Database error::::', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to database')
})

if (process.env.NODE_ENV !== 'production') {
    // Dev only
    const https = require('https');
    const fs = require('fs');

    controllers(app)

    const options = {
        key: fs.readFileSync('./.cert/localhost.key'),
        cert: fs.readFileSync('./.cert/localhost.crt'),
    };

    var devServer = https.createServer(options, app)
    
    // socketServer(devServer)

    devServer.listen(3000, function () {
        console.log("server started at port 3000");
        mongoose.connect(`mongodb://${process.env.IP || 'localhost'}/test`);
    });

} else {

    const server = http.Server(app)
    // Start socket server
    socketServer(server)
    // Init http controllers
    controllers(app)

    const PORT = 3000;
    // Start express 
    server.listen(process.env.PORT || PORT, () => {
        console.log(`Listening at http://localhost:${PORT}`)
        // Start MongoDB connection
        mongoose.connect(`mongodb://${process.env.IP || 'localhost'}/test`);
    })

}






// Export for testing
module.exports = app;


