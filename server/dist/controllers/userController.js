'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _validator = require('../helpers/validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
        var existingUser, newUser;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ Username: req.body.username }, { 'Email Address': req.body.email }, { Password: req.body.password }, { 'Password Retype': req.body.cPassword }]);

                if (!(errorMessage.trim() !== '')) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 5:
                if (_validator2.default.passwordsMatch(req.body.password, req.body.cPassword)) {
                  _context.next = 10;
                  break;
                }

                errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
                return _context.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 10:
                if (_validator2.default.isValidEmail(req.body.email)) {
                  _context.next = 15;
                  break;
                }

                errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
                return _context.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 15:
                if (_validator2.default.isValidPassword(req.body.password)) {
                  _context.next = 18;
                  break;
                }

                errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
                return _context.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 18:
                _context.prev = 18;
                existingUser = void 0;
                _context.next = 22;
                return this.user.findOne({
                  where: { username: req.body.username } });

              case 22:
                existingUser = _context.sent;

                if (!existingUser) {
                  _context.next = 25;
                  break;
                }

                return _context.abrupt('return', res.status(409).json({ message: 'Username is already in use!' }));

              case 25:
                _context.next = 27;
                return this.user.findOne({
                  where: { email: req.body.email } });

              case 27:
                existingUser = _context.sent;

                if (!existingUser) {
                  _context.next = 30;
                  break;
                }

                return _context.abrupt('return', res.status(409).json({ message: 'Email Address already exists!' }));

              case 30:
                reqPasswordHash = _validator2.default.generateHash(req.body.password);
                _context.next = 33;
                return this.user.sync();

              case 33:
                _context.next = 35;
                return this.user.create({
                  username: req.body.username,
                  email: req.body.email,
                  password: reqPasswordHash
                });

              case 35:
                newUser = _context.sent;

                req.session.user = newUser;
                res.status(201).json({
                  message: 'You signed up successfully!',
                  user: _validator2.default.trimFields(newUser)
                });
                _context.next = 43;
                break;

              case 40:
                _context.prev = 40;
                _context.t0 = _context['catch'](18);

                res.status(500).json({ message: _context.t0.message });

              case 43:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[18, 40]]);
      }));

      function signUpUser(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return signUpUser;
    }()

    /**
     * @description: Logs in a user
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} user
     */

  }, {
    key: 'signInUser',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
        var matchingUser;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ Username: req.body.username }, { Password: req.body.password }]);

                if (!(errorMessage.trim() !== '')) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 3:
                _context2.prev = 3;
                _context2.next = 6;
                return this.user.findOne({
                  where: { username: req.body.username } });

              case 6:
                matchingUser = _context2.sent;

                if (matchingUser) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt('return', res.status(400).json({ message: 'Username does not exist!' }));

              case 9:
                if (_validator2.default.verifyPassword(req.body.password, matchingUser.password)) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt('return', res.status(400).json({ message: 'Password is wrong!' }));

              case 11:
                req.session.user = matchingUser;
                res.status(200).json({ message: 'You signed in successfully!',
                  user: _validator2.default.trimFields(matchingUser) });
                _context2.next = 18;
                break;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2['catch'](3);

                res.status(500).json({ message: _context2.t0.message });

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 15]]);
      }));

      function signInUser(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return signInUser;
    }()

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
      if (req.session.user) {
        return true;
      }
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
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
        var allUsers;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (req.session.user) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return', res.status(401).json({ message: 'Access denied! Please sign in first.' }));

              case 2:
                _context3.prev = 2;
                _context3.next = 5;
                return this.user.findAll({
                  attributes: ['id', 'username', 'email']
                });

              case 5:
                allUsers = _context3.sent;

                res.status(200).json({ 'Registered users': allUsers });
                _context3.next = 12;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3['catch'](2);

                res.status(500).json({ message: _context3.t0.message });

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 9]]);
      }));

      function getAllUsers(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return getAllUsers;
    }()

    /**
     * @description: Fetches a user matching specified userKey
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} matchingUser
     */

  }, {
    key: 'getUserByKey',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res) {
        var matchingUser;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (req.session.user) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return', res.status(401).json({ message: 'Access denied! Please sign in first.' }));

              case 2:
                errorMessage = _validator2.default.checkEmpty([{ 'User ID': req.params.userId }]);

                if (!(errorMessage.trim() !== '')) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 5:
                _context4.prev = 5;
                _context4.next = 8;
                return this.user.findOne({
                  attributes: ['id', 'username', 'email'],
                  where: { id: req.params.userId }
                });

              case 8:
                matchingUser = _context4.sent;

                if (matchingUser) {
                  _context4.next = 11;
                  break;
                }

                return _context4.abrupt('return', res.status(404).json({ message: 'Specified user does not exist!' }));

              case 11:
                res.status(200).json({ 'Specified user': matchingUser });
                _context4.next = 17;
                break;

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4['catch'](5);

                res.status(500).json({ message: _context4.t0.message });

              case 17:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[5, 14]]);
      }));

      function getUserByKey(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return getUserByKey;
    }()

    /**
     * @description: Deletes a user matching specified userKey
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} null
     */

  }, {
    key: 'deleteUser',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(req, res) {
        var matchingUser;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (req.session.user) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', res.status(401).json({ message: 'Access denied! Please sign in first.' }));

              case 2:
                errorMessage = _validator2.default.checkEmpty([{ 'User ID': req.params.userId }]);

                if (!(errorMessage.trim() !== '')) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 5:
                _context5.prev = 5;
                _context5.next = 8;
                return this.user.findOne({ where: { id: req.params.userId } });

              case 8:
                matchingUser = _context5.sent;

                if (matchingUser) {
                  _context5.next = 11;
                  break;
                }

                return _context5.abrupt('return', res.status(404).json({ message: 'Specified user does not exist!' }));

              case 11:
                _context5.next = 13;
                return this.user.destroy({ where: { id: req.params.userId } });

              case 13:
                res.status(200).json({ message: 'User deleted successfully!' });
                _context5.next = 19;
                break;

              case 16:
                _context5.prev = 16;
                _context5.t0 = _context5['catch'](5);

                res.status(500).json({ message: _context5.t0.message });

              case 19:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[5, 16]]);
      }));

      function deleteUser(_x9, _x10) {
        return _ref5.apply(this, arguments);
      }

      return deleteUser;
    }()
  }]);

  return UserController;
}();

exports.default = UserController;