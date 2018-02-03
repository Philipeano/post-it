import 'babel-polyfill';
import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import groupRouter from './routes/groupRouter';
import membershipRouter from './routes/membershipRouter';
import messageRouter from './routes/messageRouter';
import Auth from './helpers/auth';
// import notificationRouter from './routes/notificationRouter';

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

// Unprotected routes
app.use('/api/users', userRouter);

// Protected routes
// app.use('/api/users/:userId/notifications',
// Auth.isAuthenticated, (req, res, next) => {
//   next();
// });
// app.use('/api/users/:userId/notifications', notificationRouter);

app.use('/api/groups', Auth.isAuthenticated, (req, res, next) => { next(); });
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
