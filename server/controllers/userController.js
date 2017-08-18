import db from '../models/index';
import Validator from '../controllers/validator';

const userModel = db.User;
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
    this.user = userModel;
  }

  /**
   * @description: Registers a new user
   * @param {Object} req
   * @param {Object} res
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
    }
    else if (!(Validator.isValidEmail(req.body.email))) {
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      res.status(400).json({ message: errorMessage });
    }
    else if (!(Validator.isValidPassword(req.body.password))) {
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
      res.status(400).json({ message: errorMessage });
    }
    else {
      userModel.findOne({ where: { username: req.body.username } })
        .then((matchingUsers) => {
          if (matchingUsers) {
            res.status(409)
              .json({ message: 'Username is already in use!' });
            res.end();
          }
        });
      userModel.findOne({ where: { email: req.body.email } })
        .then((matchingUsers) => {
          if (matchingUsers) {
            res.status(409)
              .json({ message: 'Email Address already exists!' });
            res.end();
          }
        });
      reqPasswordHash = Validator.generateHash(req.body.password);
      return userModel.sync().then(() => {
        userModel.create({
          username: req.body.username,
          email: req.body.email,
          password: reqPasswordHash
        }).then((newUser) => {
          req.session.user = newUser;
          // res.redirect('/protected_page');
          res.status(201).json({ message: 'You signed up successfully!',
            user: newUser });
        }).catch((err) => {
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
  signInUser(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Username', req.body.username))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('Password', req.body.password))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      userModel.findOne({ where: { username: req.body.username } })
        .then((matchingUser) => {
          if (matchingUser) {
            if (Validator
                .verifyPassword(req.body.password, matchingUser.password)) {
              req.session.user = matchingUser;
              res.status(200).json({ message: 'You signed in successfully!',
                user: matchingUser });
            } else {
              res.status(400).json({ message: 'Password is invalid!' });
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
   * @param {Object} req
   * @param {Object} res
   * @return {void}
   */
  signOutUser(req, res) {
    req.session.destroy(() => {
      // res.redirect('/signin');
      res.status(200).json({ message: 'You have been logged out.' });
    });
  }

  /**
   * @description: Checks if user is signed in
   * @param {Object} req
   * @return {Boolean} true/false
   */
  isSignedIn(req) {
    if (req.session.user)
      return true;
    return false;
  }

  /**
   * @description: Fetches all available users
   * @param {Object} req
   * @param {Object} res
   * @return {Object} allUsers
   */
  getAllUsers(req, res) {
    userModel.findAll().then((allUsers) => {
      res.status(200).json({ 'Registered users': allUsers });
    }).catch((err) => {
      res.status(500).json({ message: err.message });
    });
  }

  /**
   * @description: Fetches a user matching specified userKey
   * @param {Object} req
   * @param {Object} res
   * @return {Object} matchingUser
   */
  getUserByKey(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('User ID', req.params.userId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      userModel.findOne({ where: { id: req.params.userId } })
        .then((matchingUser) => {
          if (matchingUser) {
            res.status(200).json({ 'Specified user': matchingUser });
          } else {
            res.status(404).json({ message: 'Specified user does not exist' });
          }
        }).catch((err) => {
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
  deleteUser(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('User ID', req.params.userId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      userModel.findOne({ where: { id: req.params.userId } })
        .then((matchingUser) => {
          if (matchingUser) {
            userModel.destroy({ where: { id: req.params.userId } })
              .then(() => {
                res.status(200).json({ message: 'User deleted successfully!' });
              }).catch((err) => {
                res.status(500).json({ message: err.message });
              });
          } else {
            res.status(404).json({ message: 'Specified user does not exist' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

}

export default UserController;
