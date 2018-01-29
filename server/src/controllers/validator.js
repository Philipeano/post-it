import bcrypt from 'bcrypt';

/**
 * @description: Defines utility controller for validating all user input
 * @class
 */
class Validator {
  /**
   * @description: Initializes validator object
   * @constructor
   */
  constructor() {
    this.validationMessage = '';
  }

  /**
   * @description: Checks for null/empty entries
   * @param {Array} entries Array of key/value pairs to check
   * @return {String} errorMessage Concatenated validation error messages
   */
  static checkEmpty(entries) {
    let entryName, entryValue, errorMessage = '';
    entries.forEach((entry) => {
      entryName = Object.keys(entry)[0];
      entryValue = Object.values(entry)[0];
      if (entryValue === undefined || entryValue === null
        || entryValue.trim() === '') {
        errorMessage = `${errorMessage} ${entryName} cannot be null or empty.`;
      }
    });
    return errorMessage;
  }

  /**
   * @description: Checks for valid email address
   * @param {String} testEmail
   * @return {Boolean} result
   */
  static isValidEmail(testEmail) {
    let result = true;
    const pattern = /\S+@\S+\.\S+/;
    if (!pattern.test(testEmail)) {
      result = false;
      this.validationMessage = `${testEmail} is not a valid email address.`;
    }
    return result;
  }

  /**
   * @description: Checks for valid password
   * @param {String} testPassword
   * @return {Boolean} result
   */
  static isValidPassword(testPassword) {
    let result = true;
    const strongRegex = new RegExp('^(?=.*[a-z])' +
      '(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    if (!strongRegex.test(testPassword)) {
      result = false;
      this.validationMessage = `${testPassword} is not a valid password.`;
    }
    return result;
  }

  /**
   * @description: Checks for matching passwords
   * @param {String} password1
   * @param {String} password2
   * @return {Boolean} result
   */
  static passwordsMatch(password1, password2) {
    let result = true;
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
  static generateHash(plainText) {
    const hash = bcrypt.hashSync(plainText, 3);
    return hash;
  }

  /**
   * @description: Verifies plain password against hashed DB password
   * @param {String} plainText
   * @param {String} hashFromDB
   * @return {Boolean} result
   */
  static verifyPassword(plainText, hashFromDB) {
    const result = bcrypt.compareSync(plainText, hashFromDB);
    return result;
  }

  /**
   * @description: Shrinks given object by removing unnecessary properties
   * @param {Object} originalValue
   * @return {Object} trimmedValue
   */
  static trimFields(originalValue) {
    const originalKeys = Object.keys(originalValue.toJSON());
    const unwantedKeys = ['password', 'createdAt', 'updatedAt', 'isActive'];
    const trimmedValue = {};
    for (let i = 0; i < originalKeys.length; i += 1) {
      if (!unwantedKeys.includes(originalKeys[i])) {
        trimmedValue[originalKeys[i]] = originalValue[originalKeys[i]];
      }
    }
    return trimmedValue;
  }

}
export default Validator;
