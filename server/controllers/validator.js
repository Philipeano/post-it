/**
 * @description: Defines controller for validating all user input
 * @class
 */
class InputValidator {
  /**
   * @description: Initializes validator object with no error
   * @param {Object} errors
   * @constructor
   */
  constructor() {
    this.lastErrorMessage = '';
  }

  /**
   * @description: holds last generated error message
   * @property {String}
  static message
   */

  /**
   * @description: checks for null/empty entry
   * @param {String} fieldName
   * @param {String} fieldValue
   * @return {Object} isValid
   */
  static isEmpty(fieldName, fieldValue) {
    const result = { isValid: false, errorMessage: '' };
    if (fieldValue === undefined || fieldValue === null
      || fieldValue.trim() === '') {
      result.isValid = true;
      result.errorMessage = `${fieldName} cannot be null or empty.`;
    }
    this.lastErrorMessage = result.errorMessage;
    return result;
  }

  /**
   * @description: checks for valid email address
   * @param {String} fieldName
   * @param {String} fieldValue
   * @return {Object} isValid
   */
  static isValidEmail(fieldName, fieldValue) {
    const result = { isValid: true, errorMessage: '' };
    const pattern = /\S+@\S+\.\S+/;
    if (pattern.test(fieldValue) === false) {
      result.isValid = false;
      result.errorMessage = `${fieldName} is not a valid email address.`;
    }
    this.lastErrorMessage = result.errorMessage;
    return result;
  }

  /**
   * @description: checks for valid password
   * @param {String} fieldName
   * @param {String} fieldValue
   * @return {Object} isValid
   */
  static isValidPassword(fieldName, fieldValue) {
    const result = { isValid: true, errorMessage: '' };
    const pattern = /^\w+([.-]? w+)*@\w+([.-]? w+)*(.\w{2,3})+$/;
    if (fieldValue.match(pattern) === false) {
      result.isValid = false;
      result.errorMessage = `${fieldName} is not a valid password.`;
    }
    this.lastErrorMessage = result.errorMessage;
    return result;
  }

  /**
   * @description: checks for matching passwords
   * @param {String} password1
   * @param {String} password2
   * @return {Object} isValid
   */
  static passwordsMatch(password1, password2) {
    const result = { isValid: true, errorMessage: '' };
    if (password1 !== password2) {
      result.isValid = false;
      result.errorMessage = 'The two passwords do not match.';
    }
    this.lastErrorMessage = result.errorMessage;
    return result;
  }
}
export default InputValidator;
