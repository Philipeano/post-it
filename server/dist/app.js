'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('babel-register');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var userRouter = require('../routes/user');
var groupRouter = require('../routes/group');
var groupMemberRouter = require('../routes/groupmember');
var messageRouter = require('../routes/message');
var notificationRouter = require('../routes/notification');
// const models = require('../models');

// import express from 'express';
// import logger from 'morgan';
// import bodyParser from 'body-parser';
// import dotenv from 'dotenv';
// import userRouter from '../routes/user';
// import group from '../routes/group';
// import groupmember from '../routes/groupmember';
// import message from '../routes/message';
// import notification from '../routes/notification';
// import models from '../models';

// Configure environment settings
dotenv.config();

// Set up server express
var app = express();

// Log requests to the console
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// TODO: Set up middleware
// TODO: Set up authentication routes
// TODO: Set up all other routes

// User route
app.use('/api/user', userRouter);

// Default API route
app.use('/api', function (req, res) {
  res.status(200).send({ message: 'Welcome! PostIT API is running...' });
});

// Random API route
app.use('*', function (req, res) {
  res.status(200).sendFile('../../template/index.html');
});

// Retrieve port for this app environment
var port = process.env.PORT || 8000;

// TODO: Run Sequelize sync on models

// Create server and initialize it with the express app
var server = app.listen(port, function () {
  console.log('Listening at port ' + port);
});

// Export server
exports.default = server;
// module.exports = server;