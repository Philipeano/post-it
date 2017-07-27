require('babel-register');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRouter = require('../routes/user');
const groupRouter = require('../routes/group');
const groupMemberRouter = require('../routes/groupmember');
const messageRouter = require('../routes/message');
const notificationRouter = require('../routes/notification');
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
const app = express();

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
