'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _userController = require('../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRouter = _express2.default.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'user' requests
 * @module
 */

var userController = new _userController2.default();

/**
 * @description: Register new user
 * @param {Object} req
 * @param {Object} res
 */
userRouter.post('/signup', function (req, res) {
  userController.signUpUser(req, res);
});

/**
 * @description: Log in user
 * @param {Object} req
 * @param {Object} res
 */
userRouter.post('/signin', function (req, res) {
  userController.signInUser(req, res);
});

/**
 * @description: Log out user
 * @param {Object} req
 * @param {Object} res
 */
userRouter.post('/signout', function (req, res) {
  userController.signOutUser(req, res);
});

/**
 * @description: Fetch all users
 * @param {Object} req
 * @param {Object} res
 */
userRouter.get('/', function (req, res) {
  userController.getAllUsers(req, res);
});

/**
 * @description: Fetch user with specified key
 * @param {Object} req
 * @param {Object} res
 */
userRouter.get('/:userId', function (req, res) {
  userController.getUserByKey(req, res);
});

/**
 * @description: Delete user with specified key
 * @param {Object} req
 * @param {Object} res
 */
userRouter.delete('/:userId', function (req, res) {
  userController.deleteUser(req, res);
});

exports.default = userRouter;