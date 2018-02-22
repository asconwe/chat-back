const express = require('express');
const io = require('socket.io');
const mongoose = require('mongoose');

const controllers = require('./controllers');
const socketControllers = require('./socket-controllers');

const testSchemas = require('./models/testSchemas');

const app = express();

// Initialize MongoDB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to mongoDB')
    
})

mongoose.connect(`mongodb://${process.env.IP}/test`);


