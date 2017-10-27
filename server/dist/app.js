'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _userRouter = require('./routes/userRouter');

var _userRouter2 = _interopRequireDefault(_userRouter);

var _groupRouter = require('./routes/groupRouter');

var _groupRouter2 = _interopRequireDefault(_groupRouter);

var _membershipRouter = require('./routes/membershipRouter');

var _membershipRouter2 = _interopRequireDefault(_membershipRouter);

var _messageRouter = require('./routes/messageRouter');

var _messageRouter2 = _interopRequireDefault(_messageRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import notificationRouter from '../routes/notificationRouter';

// Configure environment settings
_dotenv2.default.config();

// Set up server express
var app = (0, _express2.default)();

// Log requests to the console
app.use((0, _morgan2.default)('dev'));

// Parse incoming requests data
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({ secret: 'PostItMessagingSystemByPhilipeano' }));

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

// Unprotected route
app.use('/api/users', _userRouter2.default);

// Protected routes
app.use('/api/groups', checkSignIn, function (req, res, next) {
  next();
});

app.use('/api/groups', _groupRouter2.default);
app.use('/api/groups/:groupId/users', _membershipRouter2.default);
app.use('/api/groups/:groupId/messages', _messageRouter2.default);

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

exports.default = server;