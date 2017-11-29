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

    this.user = _index2.default.User;
  }

  /**
   * @description: Registers a new user
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} newUser
   */


  _createClass(UserController, [{
    key: 'signUpUser',
    value: function signUpUser(req, res) {
      var _this = this;

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
        this.user.findOne({ where: { username: req.body.username } }).then(function (matchingUser1) {
          if (matchingUser1) {
            res.status(409).json({ message: 'Username is already in use!' });
          } else {
            _this.user.findOne({ where: { email: req.body.email } }).then(function (matchingUser2) {
              if (matchingUser2) {
                res.status(409).json({ message: 'Email Address already exists!' });
              } else {
                reqPasswordHash = _validator2.default.generateHash(req.body.password);
                return _this.user.sync().then(function () {
                  _this.user.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: reqPasswordHash
                  }).then(function (newUser) {
                    req.session.user = newUser;
                    return res.status(201).json({
                      message: 'You signed up successfully!',
                      user: _validator2.default.trimFields(newUser)
                    });
                  }).catch(function (err) {
                    return res.status(500).json({ message: err.message });
                  });
                });
              }
            });
          }
        });
      }
    }

    /**
     * @description: Logs in a user
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} user
     */

  }, {
    key: 'signInUser',
    value: function signInUser(req, res) {
      errorMessage = '';
      if (_validator2.default.isEmpty('Username', req.body.username)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Password', req.body.password)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        this.user.findOne({ where: { username: req.body.username } }).then(function (matchingUser) {
          if (matchingUser) {
            if (_validator2.default.verifyPassword(req.body.password, matchingUser.password)) {
              req.session.user = matchingUser;
              res.status(200).json({ message: 'You signed in successfully!',
                user: _validator2.default.trimFields(matchingUser) });
            } else {
              res.status(400).json({ message: 'Password is wrong!' });
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
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {void}
     */

  }, {
    key: 'signOutUser',
    value: function signOutUser(req, res) {
      req.session.destroy(function () {
        res.status(200).json({ message: 'You have been logged out.' });
      });
    }

    /**
     * @description: Checks if user is signed in
     * @param {Object} req The incoming request from the client
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
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} allUsers
     */

  }, {
    key: 'getAllUsers',
    value: function getAllUsers(req, res) {
      if (req.session.user) {
        this.user.findAll({
          attributes: ['id', 'username', 'email']
        }).then(function (allUsers) {
          res.status(200).json({ 'Registered users': allUsers });
        }).catch(function (err) {
          res.status(500).json({ message: err.message });
        });
      } else {
        res.status(401).json({ message: 'Access denied! Please sign in first.' });
      }
    }

    /**
     * @description: Fetches a user matching specified userKey
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} matchingUser
     */

  }, {
    key: 'getUserByKey',
    value: function getUserByKey(req, res) {
      if (req.session.user) {
        errorMessage = '';
        if (_validator2.default.isEmpty('User ID', req.params.userId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
        if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
          this.user.findOne({
            attributes: ['id', 'username', 'email'],
            where: { id: req.params.userId }
          }).then(function (matchingUser) {
            if (matchingUser) {
              res.status(200).json({ 'Specified user': matchingUser });
            } else {
              res.status(404).json({ message: 'Specified user does not exist!' });
            }
          }).catch(function (err) {
            res.status(500).json({ message: err.message });
          });
        }
      } else {
        res.status(401).json({ message: 'Access denied! Please sign in first.' });
      }
    }

    /**
     * @description: Deletes a user matching specified userKey
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} null
     */

  }, {
    key: 'deleteUser',
    value: function deleteUser(req, res) {
      var _this2 = this;

      if (req.session.user) {
        errorMessage = '';
        if (_validator2.default.isEmpty('User ID', req.params.userId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
        if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
          this.user.findOne({ where: { id: req.params.userId } }).then(function (matchingUser) {
            if (matchingUser) {
              _this2.user.destroy({ where: { id: req.params.userId } }).then(function () {
                res.status(200).json({ message: 'User deleted successfully!' });
              }).catch(function (err) {
                res.status(500).json({ message: err.message });
              });
            } else {
              res.status(404).json({ message: 'Specified user does not exist!' });
            }
          }).catch(function (err) {
            res.status(500).json({ message: err.message });
          });
        }
      } else {
        res.status(401).json({ message: 'Access denied! Please sign in first.' });
      }
    }
  }]);

  return UserController;
}();

exports.default = UserController;