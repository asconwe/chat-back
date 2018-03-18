
// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const db = mongoose.connection;
const sessionStore =  new MongoStore({
  uri: `mongodb://${process.env.IP || 'localhost'}/test`,
  databaseName: process.env.DATABASE,
  collection: 'userSessions'
});

sessionStore.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

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
  resave: false,
  saveUninitialized: true,
  domain: 'localhost',
  maxAge: 1000 * 60 * 60 * 24 * 7,
  store: sessionStore,
  unset: 'destroy'
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

// Use https with self-signed certificates in dev environment

function httpServer() {
  const http = require('http');
  return http.Server(app);
}

function httpsServer() {
  const https = require('https');
  const fs = require('fs');
  const options = {
    key: fs.readFileSync('./.cert/localhost.key'),
    cert: fs.readFileSync('./.cert/localhost.crt'),
  };
  return https.createServer(options, app);
}

const server = process.env.NODE_ENV === 'production' ? httpServer() : httpsServer();

module.exports = {
  app,
  server,
  sessionStore,
  db
}