'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: import all routes
// TODO: import all models

// Configure environment settings
// const express = require('express');
// const logger = require('morgan');
// const bodyParser = require('body-parser');
_dotenv2.default.config();

// Set up server express
var app = (0, _express2.default)();

// Log requests to the console
app.use((0, _morgan2.default)('dev'));

// Parse incoming requests data
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// TODO: Set up middleware
// TODO: Set up authentication routes
// TODO: Set up all other routes

// Default/random route
app.use('/api', function (req, res) {
  res.status(200).send({ message: 'Welcome! PostIT API is running...' });
});

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