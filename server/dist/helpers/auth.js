'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();
var secretKey = process.env.SECRET_KEY;

/**
 * @description: Defines an authentication class implementing JWT
 * @class
 */

var Auth = function () {
  /**
   * @description: Initializes instance with 'user' model as local property
   * @constructor
   */
  function Auth() {
    _classCallCheck(this, Auth);

    this.user = _index2.default.User;
  }

  /**
   * @description: Generates a new token for the user
   * @param {Object} payload User information to encode in token
   * @return {String} token The generated token
   */


  _createClass(Auth, null, [{
    key: 'generateToken',
    value: function generateToken(payload) {
      var token = _jsonwebtoken2.default.sign(payload, secretKey, { expiresIn: '24h' });
      return token;
    }

    /**
     * @description: Checks for authenticity of a supplied token
     * @param {String} token The token to verify
     * @return {String} currentUserId ID of the logged in user
     */

  }, {
    key: 'verifyToken',
    value: function verifyToken(token) {
      var currentUserId = void 0;
      try {
        var decodedToken = _jsonwebtoken2.default.verify(token, secretKey);
        if (decodedToken === null || decodedToken === undefined) {
          currentUserId = null;
        }
        currentUserId = decodedToken.userId;
      } catch (err) {
        currentUserId = null;
      }
      return currentUserId;
    }

    /**
     * @description: Extracts authentication token from request object
     * @param {Object} req The incoming request from the client
     * @return {String} Authenticated user ID or null if token is missing
     */

  }, {
    key: 'getUserIdFromRequest',
    value: function getUserIdFromRequest(req) {
      var token = req.headers.token || req.body.token;
      if (!token) {
        return null;
      }
      return this.verifyToken(token);
    }

    /**
     * @description: Checks if user is authenticated
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @param {Function} next Next callback function
     * @return {void}
     */

  }, {
    key: 'isAuthenticated',
    value: function isAuthenticated(req, res, next) {
      var checkUserId = Auth.getUserIdFromRequest(req);
      if (!checkUserId) {
        return res.status(401).json({ message: 'Access denied! Please sign in first.' });
      }
      next();
    }

    /**
     * @description: Fetches the current user's information
     * @param {Object} userId The ID of the current user
     * @return {Object} user Details of the current user
     */

  }, {
    key: 'getUserInfoById',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(userId) {
        var user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.user.findById(userId);

              case 2:
                user = _context.sent;
                return _context.abrupt('return', user);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getUserInfoById(_x) {
        return _ref.apply(this, arguments);
      }

      return getUserInfoById;
    }()
  }]);

  return Auth;
}();

exports.default = Auth;