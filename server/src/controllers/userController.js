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
  signUpUser(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Username', req.body.username))
    { errorMessage = `${errorMessage} ${Validator.validationMessage}`; }
    if (Validator.isEmpty('Email Address', req.body.email))
    { errorMessage = `${errorMessage} ${Validator.validationMessage}`; }
    if (Validator.isEmpty('Password', req.body.password))
    { errorMessage = `${errorMessage} ${Validator.validationMessage}`; }
    if (Validator.isEmpty('Password Retype', req.body.cPassword))
    { errorMessage = `${errorMessage} ${Validator.validationMessage}`; }

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else if (!(Validator.passwordsMatch(req.body.password,
        req.body.cPassword))) {
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      res.status(400).json({ message: errorMessage });
    } else if (!(Validator.isValidEmail(req.body.email))) {
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      res.status(400).json({ message: errorMessage });
    } else if (!(Validator.isValidPassword(req.body.password))) {
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      res.status(400).json({ message: errorMessage });
    } else {
      this.user.findOne({ where: { username: req.body.username } })
        .then((matchingUser1) => {
          if (matchingUser1) {
            res.status(409)
              .json({ message: 'Username is already in use!' });
          } else {
            this.user.findOne({ where: { email: req.body.email } })
              .then((matchingUser2) => {
                if (matchingUser2) {
                  res.status(409)
                    .json({ message: 'Email Address already exists!' });
                } else {
                  reqPasswordHash = Validator.generateHash(req.body.password);
                  return this.user.sync().then(() => {
                    this.user.create({
                      username: req.body.username,
                      email: req.body.email,
                      password: reqPasswordHash
                    }).then((newUser) => {
                      req.session.user = newUser;
                      return res.status(201).json({
                        message: 'You signed up successfully!',
                        user: Validator.trimFields(newUser)
                      });
                    }).catch((err) => {
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
  signInUser(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Username', req.body.username))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('Password', req.body.password))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.user.findOne({ where: { username: req.body.username } })
        .then((matchingUser) => {
          if (matchingUser) {
            if (Validator
                .verifyPassword(req.body.password, matchingUser.password)) {
              req.session.user = matchingUser;
              res.status(200).json({ message: 'You signed in successfully!',
                user: Validator.trimFields(matchingUser) });
            } else {
              res.status(400).json({ message: 'Password is wrong!' });
            }
          } else {
            res.status(400).json({ message: 'Username does not exist!' });
          }
        }).catch((err) => {
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
  signOutUser(req, res) {
    req.session.destroy(() => {
      res.status(200).json({ message: 'You have been logged out.' });
    });
  }

  /**
   * @description: Checks if user is signed in
   * @param {Object} req The incoming request from the client
   * @return {Boolean} true/false
   */
  isSignedIn(req) {
    if (req.session.user)
      return true;
    return false;
  }

  /**
   * @description: Fetches all available users
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} allUsers
   */
  getAllUsers(req, res) {
    if (req.session.user) {
      this.user.findAll({
        attributes: ['id', 'username', 'email']
      }).then((allUsers) => {
        res.status(200).json({ 'Registered users': allUsers });
      }).catch((err) => {
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
  getUserByKey(req, res) {
    if (req.session.user) {
      errorMessage = '';
      if (Validator.isEmpty('User ID', req.params.userId))
        errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      if (errorMessage.trim() !== '')
        res.status(400).json({ message: errorMessage });
      else {
        this.user.findOne({
          attributes: ['id', 'username', 'email'],
          where: { id: req.params.userId }
        })
          .then((matchingUser) => {
            if (matchingUser) {
              res.status(200).json({ 'Specified user': matchingUser });
            } else {
              res.status(404)
                .json({ message: 'Specified user does not exist!' });
            }
          }).catch((err) => {
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
  deleteUser(req, res) {
    if (req.session.user) {
      errorMessage = '';
      if (Validator.isEmpty('User ID', req.params.userId))
        errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      if (errorMessage.trim() !== '')
        res.status(400).json({ message: errorMessage });
      else {
        this.user.findOne({ where: { id: req.params.userId } })
          .then((matchingUser) => {
            if (matchingUser) {
              this.user.destroy({ where: { id: req.params.userId } })
                .then(() => {
                  res.status(200)
                    .json({ message: 'User deleted successfully!' });
                }).catch((err) => {
                  res.status(500).json({ message: err.message });
                });
            } else {
              res.status(404)
                .json({ message: 'Specified user does not exist!' });
            }
          }).catch((err) => {
            res.status(500).json({ message: err.message });
          });
      }
    } else {
      res.status(401).json({ message: 'Access denied! Please sign in first.' });
    }
  }

}

export default UserController;
