const express = require('express');
const io = require('socket.io');
const mongoose = require('mongoose');

const app = express();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to mongoDB')
})

mongoose.connect('mongodb://localhost/test');
