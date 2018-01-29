import db from '../models/index';
import Validator from './validator';

let reqPasswordHash;
let errorMessage;

/**
 * @description: Defines controller for manipulating 'user' model
 * @class
 */
class UserController {
  /**
   * @description: Initializes instance with 'user' model as local property
   * @constructor
   */
  constructor() {
    this.user = db.User;
  }

  /**
   * @description: Registers a new user
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} newUser
   */
  async signUpUser(req, res) {
    errorMessage = Validator.checkEmpty([
      { Username: req.body.username },
      { 'Email Address': req.body.email },
      { Password: req.body.password },
      { 'Password Retype': req.body.cPassword }
    ]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    } else if (!(Validator.passwordsMatch(req.body.password,
        req.body.cPassword))) {
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      return res.status(400).json({ message: errorMessage });
    } else if (!(Validator.isValidEmail(req.body.email))) {
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      return res.status(400).json({ message: errorMessage });
    } else if (!(Validator.isValidPassword(req.body.password))) {
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      return res.status(400).json({ message: errorMessage });
    }
    try {
      let existingUser;
      existingUser = await this.user.findOne({
        where: { username: req.body.username } });
      if (existingUser) {
        return res.status(409)
        .json({ message: 'Username is already in use!' });
      }
      existingUser = await this.user.findOne({
        where: { email: req.body.email } });
      if (existingUser) {
        return res.status(409)
        .json({ message: 'Email Address already exists!' });
      }
      reqPasswordHash = Validator.generateHash(req.body.password);
      await this.user.sync();
      const newUser = await this.user.create({
        username: req.body.username,
        email: req.body.email,
        password: reqPasswordHash
      });
      req.session.user = newUser;
      return res.status(201).json({
        message: 'You signed up successfully!',
        user: Validator.trimFields(newUser)
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Logs in a user
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} user
   */
  async signInUser(req, res) {
    errorMessage = Validator.checkEmpty([
      { Username: req.body.username },
      { Password: req.body.password }
    ]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    }
    try {
      const matchingUser = await this.user.findOne({
        where: { username: req.body.username } });
      if (!matchingUser) {
        return res.status(400).json({ message: 'Username does not exist!' });
      }
      if (!Validator
        .verifyPassword(req.body.password, matchingUser.password)) {
        return res.status(400).json({ message: 'Password is wrong!' });
      }
      req.session.user = matchingUser;
      return res.status(200).json({ message: 'You signed in successfully!',
        user: Validator.trimFields(matchingUser) });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Logs out a user
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {void}
   */
  signOutUser(req, res) {
    req.session.destroy(() => {
      return res.status(200).json({ message: 'You have been logged out.' });
    });
  }

  /**
   * @description: Checks if user is signed in
   * @param {Object} req The incoming request from the client
   * @return {Boolean} true/false
   */
  isSignedIn(req) {
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
  async getAllUsers(req, res) {
    if (!req.session.user) {
      return res.status(401)
      .json({ message: 'Access denied! Please sign in first.' });
    }
    try {
      const allUsers = await this.user.findAll({
        attributes: ['id', 'username', 'email']
      });
      return res.status(200).json({ 'Registered users': allUsers });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Fetches a user matching specified userKey
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} matchingUser
   */
  async getUserByKey(req, res) {
    if (!req.session.user) {
      return res.status(401)
      .json({ message: 'Access denied! Please sign in first.' });
    }
    errorMessage = Validator.checkEmpty([{ 'User ID': req.params.userId }]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    }
    try {
      const matchingUser = await this.user.findOne({
        attributes: ['id', 'username', 'email'],
        where: { id: req.params.userId }
      });
      if (matchingUser) {
        return res.status(200).json({ 'Specified user': matchingUser });
      }
      return res.status(404)
        .json({ message: 'Specified user does not exist!' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Deletes a user matching specified userKey
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} null
   */
  async deleteUser(req, res) {
    if (!req.session.user) {
      return res.status(401)
      .json({ message: 'Access denied! Please sign in first.' });
    }
    errorMessage = Validator.checkEmpty([{ 'User ID': req.params.userId }]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    }
    try {
      const matchingUser = await this.user
      .findOne({ where: { id: req.params.userId } });
      if (matchingUser) {
        await this.user.destroy({ where: { id: req.params.userId } });
        return res.status(200).json({ message: 'User deleted successfully!' });
      }
      return res.status(404)
        .json({ message: 'Specified user does not exist!' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

export default UserController;
