'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('babel-register');
var express = require('express');
var dotenv = require('dotenv');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var userRouter = require('../routes/userRouter');
var groupRouter = require('../routes/groupRouter');
var membershipRouter = require('../routes/membershipRouter');
var messageRouter = require('../routes/messageRouter');
// const notificationRouter = require('../routes/notificationRouter');
// const path = require('path');

// Configure environment settings
dotenv.config();

// Set up server express
var app = express();

// Log requests to the console
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'PostItMessagingSystemByPhilipeano' }));

/**
 * @description: Checks if user is authenticated
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {void}
 */
var checkSignIn = function checkSignIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Access denied! Please sign in first.' });
  }
};

// User route
app.use('/api/users', userRouter);

// Protected routes
app.use('/api/groups', checkSignIn, function (req, res, next) {
  next();
});

app.use('/api/groups', groupRouter);
app.use('/api/groups/:groupId/users', membershipRouter);
app.use('/api/groups/:groupId/messages', messageRouter);

// Default API request
app.get('/api/', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.status(200).send({ message: 'PostIT API is running...' });
});

// Random or invalid request
app.get('*', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.status(404).send({ message: 'Error! No resource matches your request!' });
});

// Retrieve port for this app environment
var port = process.env.PORT || 8000;

// Create server and initialize it with the express app
var server = app.listen(port, function () {
  console.log('Listening at port ' + port);
});

// Export server
exports.default = server;