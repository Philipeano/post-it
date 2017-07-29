// import express from 'express';
// import dotenv from 'dotenv';
// import logger from 'morgan';
// import bodyParser from 'body-parser';
// import session from 'express-session';
// import cookieParser from 'cookie-parser';
// import userRouter from '../routes/user';
// import groupRouter from '../routes/group';
// import groupMemberRouter from '../routes/groupmember';
// import messageRouter from '../routes/message';
// import notification from '../routes/notification';

require('babel-register');
const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const userRouter = require('../routes/user');
const groupRouter = require('../routes/group');
const groupMemberRouter = require('../routes/groupmember');
const messageRouter = require('../routes/message');
// const notificationRouter = require('../routes/notification');

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
app.use(session({ secret: 'PostItMessagingSystemByPhilipeano' }));

/**
 * @description: Checks if user is authenticated
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {void}
 */
const checkSignIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Access denied! Please sign in first.' });
  }
}

// User route
app.use('/api/users', userRouter);

// Protected routes
app.use('/api/groups/*', checkSignIn, (req, res, next) => {
  next();
});

app.use('/api/groups', groupRouter);
app.use('/api/groups/:groupId/users', groupMemberRouter);
app.use('/api/groups/:groupId/messages', messageRouter);


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


// Create server and initialize it with the express app
const server = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

// Export server
export default server;
// module.exports = server;
