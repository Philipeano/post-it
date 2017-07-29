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

var _user = require('../routes/user');

var _user2 = _interopRequireDefault(_user);

var _group = require('../routes/group');

var _group2 = _interopRequireDefault(_group);

var _groupmember = require('../routes/groupmember');

var _groupmember2 = _interopRequireDefault(_groupmember);

var _message = require('../routes/message');

var _message2 = _interopRequireDefault(_message);

var _notification = require('../routes/notification');

var _notification2 = _interopRequireDefault(_notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// User route
app.use('/api/users', _user2.default);

// Protected routes
app.use('/api/groups/*', checkSignIn, function (req, res, next) {
  next();
});

app.use('/api/groups', _group2.default);
app.use('/api/groups/:groupId/users', _groupmember2.default);
app.use('/api/groups/:groupId/messages', _message2.default);

// Respond to random requests
app.use('/api/*', function (req, res) {
  res.status(200).send({ message: 'PostIT API is running...' });
});

// Random API route
app.use('*', function (req, res) {
  res.status(200).sendFile('../../template/index.html');
});

// Retrieve port for this app environment
var port = process.env.PORT || 8000;

// Create server and initialize it with the express app
var server = app.listen(port, function () {
  console.log('Listening at port ' + port);
});

// Export server
exports.default = server;
// module.exports = server;