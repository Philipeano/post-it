'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @description: Defines utility controller for validating all user input
 * @class
 */
var Validator = function () {
  /**
   * @description: Initializes validator object with no error
   * @constructor
   */
  function Validator() {
    _classCallCheck(this, Validator);

    this.validationMessage = '';
  }

  /**
   * @description: Checks for null/empty entry
   * @param {String} fieldName
   * @param {String} fieldValue
   * @return {Boolean} result
   */


  _createClass(Validator, null, [{
    key: 'isEmpty',
    value: function isEmpty(fieldName, fieldValue) {
      var result = false;
      if (fieldValue === undefined || fieldValue === null || fieldValue.trim() === '') {
        result = true;
        this.validationMessage = fieldName + ' cannot be null or empty.';
      }
      return result;
    }

    /**
     * @description: Checks for valid email address
     * @param {String} testEmail
     * @return {Boolean} result
     */

  }, {
    key: 'isValidEmail',
    value: function isValidEmail(testEmail) {
      var result = true;
      var pattern = /\S+@\S+\.\S+/;
      if (!pattern.test(testEmail)) {
        result = false;
        this.validationMessage = testEmail + ' is not a valid email address.';
      }
      return result;
    }

    /**
     * @description: Checks for valid password
     * @param {String} testPassword
     * @return {Boolean} result
     */

  }, {
    key: 'isValidPassword',
    value: function isValidPassword(testPassword) {
      var result = true;
      var strongRegex = new RegExp('^(?=.*[a-z])' + '(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
      if (!strongRegex.test(testPassword)) {
        result = false;
        this.validationMessage = testPassword + ' is not a valid password.';
      }
      return result;
    }

    /**
     * @description: Checks for matching passwords
     * @param {String} password1
     * @param {String} password2
     * @return {Boolean} result
     */

  }, {
    key: 'passwordsMatch',
    value: function passwordsMatch(password1, password2) {
      var result = true;
      if (password1 !== password2) {
        result = false;
        this.validationMessage = 'The two passwords do not match.';
      }
      return result;
    }

    /**
     * @description: Generates hash from plain password
     * @param {String} plainText
     * @return {String} hash
     */

  }, {
    key: 'generateHash',
    value: function generateHash(plainText) {
      var hash = _bcrypt2.default.hashSync(plainText, 3);
      return hash;
    }

    /**
     * @description: Verifies plain password against hashed DB password
     * @param {String} plainText
     * @param {String} hashFromDB
     * @return {Boolean} result
     */

  }, {
    key: 'verifyPassword',
    value: function verifyPassword(plainText, hashFromDB) {
      var result = _bcrypt2.default.compareSync(plainText, hashFromDB);
      return result;
    }
  }]);

  return Validator;
}();

exports.default = Validator;