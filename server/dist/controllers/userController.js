'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var userModel = _index2.default.User;
var reqPasswordHash = void 0;
var errorMessage = void 0;

/**
 * @description: Defines controller for manipulating 'user' model
 * @class
 */

var UserController = function () {
  /**
   * @description: Initializes instance with 'user' model as local property
   * @constructor
   */
  function UserController() {
    _classCallCheck(this, UserController);

    this.user = userModel;
  }

  /**
   * @description: Registers a new user
   * @param {Object} req
   * @param {Object} res
   * @return {Object} newUser
   */


  _createClass(UserController, [{
    key: 'signUpUser',
    value: function signUpUser(req, res) {
      errorMessage = '';
      if (_validator2.default.isEmpty('Username', req.body.username)) {
        errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      }
      if (_validator2.default.isEmpty('Email Address', req.body.email)) {
        errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      }
      if (_validator2.default.isEmpty('Password', req.body.password)) {
        errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      }
      if (_validator2.default.isEmpty('Password Retype', req.body.cPassword)) {
        errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      }

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else if (!_validator2.default.passwordsMatch(req.body.password, req.body.cPassword)) {
        errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
        res.status(400).json({ message: errorMessage });
      } else if (!_validator2.default.isValidEmail(req.body.email)) {
        errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
        res.status(400).json({ message: errorMessage });
      } else if (!_validator2.default.isValidPassword(req.body.password)) {
        errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
        res.status(400).json({ message: errorMessage });
      } else {
        userModel.findOne({ where: { username: req.body.username } }).then(function (matchingUsers) {
          if (matchingUsers) {
            return res.status(409).json({ message: 'Username is already in use!' });
            // res.end();
          }
        });
        userModel.findOne({ where: { email: req.body.email } }).then(function (matchingUsers) {
          if (matchingUsers) {
            return res.status(409).json({ message: 'Email Address already exists!' });
            // res.end();
          }
        });
        reqPasswordHash = _validator2.default.generateHash(req.body.password);
        return userModel.sync().then(function () {
          userModel.create({
            username: req.body.username,
            email: req.body.email,
            password: reqPasswordHash
          }).then(function (newUser) {
            req.session.user = newUser;
            // res.redirect('/protected_page');
            res.status(201).json({ message: 'You signed up successfully!',
              user: newUser });
          }).catch(function (err) {
            res.status(500).json({ message: err.message });
          });
        });
      }
    }

    /**
     * @description: Logs in a user
     * @param {Object} req
     * @param {Object} res
     * @return {Object} user
     */

  }, {
    key: 'signInUser',
    value: function signInUser(req, res) {
      errorMessage = '';
      if (_validator2.default.isEmpty('Username', req.body.username)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Password', req.body.password)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        userModel.findOne({ where: { username: req.body.username } }).then(function (matchingUser) {
          if (matchingUser) {
            if (_validator2.default.verifyPassword(req.body.password, matchingUser.password)) {
              req.session.user = matchingUser;
              res.status(200).json({ message: 'You signed in successfully!',
                user: matchingUser });
            } else {
              res.status(400).json({ message: 'Password is invalid!' });
            }
          } else {
            res.status(400).json({ message: 'Username does not exist!' });
          }
        }).catch(function (err) {
          res.status(500).json({ message: err.message });
        });
      }
    }

    /**
     * @description: Logs out a user
     * @param {Object} req
     * @param {Object} res
     * @return {void}
     */

  }, {
    key: 'signOutUser',
    value: function signOutUser(req, res) {
      req.session.destroy(function () {
        // res.redirect('/signin');
        res.status(200).json({ message: 'You have been logged out.' });
      });
    }

    /**
     * @description: Checks if user is signed in
     * @param {Object} req
     * @return {Boolean} true/false
     */

  }, {
    key: 'isSignedIn',
    value: function isSignedIn(req) {
      if (req.session.user) return true;
      return false;
    }

    /**
     * @description: Fetches all available users
     * @param {Object} req
     * @param {Object} res
     * @return {Object} allUsers
     */

  }, {
    key: 'getAllUsers',
    value: function getAllUsers(req, res) {
      userModel.findAll().then(function (allUsers) {
        res.status(200).json({ 'Registered users': allUsers });
      }).catch(function (err) {
        res.status(500).json({ message: err.message });
      });
    }

    /**
     * @description: Fetches a user matching specified userKey
     * @param {Object} req
     * @param {Object} res
     * @return {Object} matchingUser
     */

  }, {
    key: 'getUserByKey',
    value: function getUserByKey(req, res) {
      errorMessage = '';
      if (_validator2.default.isEmpty('User ID', req.params.userId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        userModel.findOne({ where: { id: req.params.userId } }).then(function (matchingUser) {
          if (matchingUser) {
            res.status(200).json({ 'Specified user': matchingUser });
          } else {
            res.status(404).json({ message: 'Specified user does not exist' });
          }
        }).catch(function (err) {
          res.status(500).json({ message: err.message });
        });
      }
    }

    /**
     * @description: Deletes a user matching specified userKey
     * @param {Object} req
     * @param {Object} res
     * @return {Object} null
     */

  }, {
    key: 'deleteUser',
    value: function deleteUser(req, res) {
      errorMessage = '';
      if (_validator2.default.isEmpty('User ID', req.params.userId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        userModel.findOne({ where: { id: req.params.userId } }).then(function (matchingUser) {
          if (matchingUser) {
            userModel.destroy({ where: { id: req.params.userId } }).then(function () {
              res.status(200).json({ message: 'User deleted successfully!' });
            }).catch(function (err) {
              res.status(500).json({ message: err.message });
            });
          } else {
            res.status(404).json({ message: 'Specified user does not exist' });
          }
        }).catch(function (err) {
          res.status(500).json({ message: err.message });
        });
      }
    }
  }]);

  return UserController;
}();

exports.default = UserController;