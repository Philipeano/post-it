import bcrypt from 'bcrypt';

/**
 * @description: Defines utility controller for validating all user input
 * @class
 */
class Validator {
  /**
   * @description: Initializes validator object with no error
   * @constructor
   */
  constructor() {
    this.validationMessage = '';
  }

  /**
   * @description: Holds last generated error message
   * @property {String}
  static message
   */

  /**
   * @description: Checks for null/empty entry
   * @param {String} fieldName
   * @param {String} fieldValue
   * @return {Boolean} result
   */
  static isEmpty(fieldName, fieldValue) {
    let result = false;
    if (fieldValue === undefined || fieldValue === null
      || fieldValue.trim() === '') {
      result = true;
      this.validationMessage = ` - ${fieldName} cannot be null or empty.`;
    }
    return result;
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
      this.validationMessage = ` - ${testEmail} is not a valid email address.`;
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
      this.validationMessage = ` - ${testPassword} is not a valid password.`;
    }
    return result;
  }

  /**
   * @description: Checks for matching passwords
   * @param {String} password1
   * @param {String} password2
   * @return {Object} isValid
   */
  static passwordsMatch(password1, password2) {
    const result = { isValid: true, errorMessage: '' };
    if (password1 !== password2) {
      result.isValid = false;
      result.errorMessage = ' - The two passwords do not match.';
    }
    this.validationMessage = result.errorMessage;
    return result.isValid;
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
   * @return {Boolean} res
   */
  static verifyPassword(plainText, hashFromDB) {
    const result = bcrypt.compareSync(plainText, hashFromDB);
    return result;
  }

}
export default Validator;
