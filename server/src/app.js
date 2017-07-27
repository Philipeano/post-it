import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import userRouter from '../routes/user';
import group from '../routes/group';
import groupmember from '../routes/groupmember';
import message from '../routes/message';
import notification from '../routes/notification';
import models from '../models';

// require('babel-register');
// const express = require('express');
// const dotenv = require('dotenv');
// const logger = require('morgan');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const userRouter = require('../routes/user');
// const groupRouter = require('../routes/group');
// const groupMemberRouter = require('../routes/groupmember');
// const messageRouter = require('../routes/message');
// const notificationRouter = require('../routes/notification');
// const models = require('../models');

// Configure environment settings
dotenv.config();

// Set up server express
const app = express();

// Log requests to the console
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'PostItGroupChatByPhilipeano' }));

// TODO: Set up middleware
// TODO: Set up authentication routes
// TODO: Set up all other routes

// User route
app.use('/api/user', userRouter);


function checkSignIn(req, res) {
  if (req.session.user) {
    next();     // If session exists, proceed to page
  } else {
    const err = new Error('Not logged in!');
    console.log(req.session.user);
    next(err);  // Error, trying to access unauthorized page!
  }
}

app.get('/protected_page', checkSignIn, (req, res) => {
  res.render('protected_page', {id: req.session.user.id});
});


// Group route
app.use('/api/group', userRouter);

// Respond to random requests
app.use('/api/*', (req, res) => {
  res.status(200).send({ message: 'PostIT API is running...' });
});

// Random API route
app.use('*', (req, res) => {
  res.status(200).sendFile('../../template/index.html');
});

// Retrieve port for this app environment
const port = process.env.PORT || 8000;

// TODO: Run Sequelize sync on models

// Create server and initialize it with the express app
const server = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

// Export server
export default server;
// module.exports = server;
