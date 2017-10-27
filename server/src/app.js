import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import groupRouter from './routes/groupRouter';
import membershipRouter from './routes/membershipRouter';
import messageRouter from './routes/messageRouter';
// import notificationRouter from '../routes/notificationRouter';

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
};

// Unprotected route
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

export default server;
