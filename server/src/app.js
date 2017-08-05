require('babel-register');
const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const userRouter = require('../routes/userRouter');
const groupRouter = require('../routes/groupRouter');
const membershipRouter = require('../routes/membershipRouter');
const messageRouter = require('../routes/messageRouter');
// const notificationRouter = require('../routes/notificationRouter');
// const path = require('path');

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
app.use('/api/groups', checkSignIn, (req, res, next) => {
  next();
});

app.use('/api/groups', groupRouter);
app.use('/api/groups/:groupId/users', membershipRouter);
app.use('/api/groups/:groupId/messages', messageRouter);


// Default API request
app.get('/api/', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200).send({ message: 'PostIT API is running...' });
});

// Random or invalid request
app.get('*', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(404).send({ message: 'Error! No resource matches your request!' });
});

// Retrieve port for this app environment
const port = process.env.PORT || 8000;

// Create server and initialize it with the express app
const server = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

// Export server
export default server;

