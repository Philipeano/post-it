import db from '../models/index';
import user from '../models/user';
import Validator from '../controllers/validator';

const sequelize = db.sequelize;
let errorMessage;
let reqPasswordHash;

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
    this.user = user(sequelize);
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
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('E-mail Address', req.body.email.toString()))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('Password', req.body.password))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('Password Retype', req.body.cPassword))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (!Validator.passwordsMatch(req.body.password, req.body.cPassword))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else if (this.isDuplicate(req.body.username, req.body.email))
      res.status(409).json({ message: 'Username or email already exists!' });
    else {
      reqPasswordHash = user.classMethods.generateHash(req.body.password);
      return this.user.sync().then(() => {
        this.user.create({
          username: req.body.username,
          email: req.body.email,
          password: reqPasswordHash
        }).then((newUser) => {
          req.session.user = newUser;
          // res.redirect('/protected_page');
          res.status(201).json(newUser);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
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
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('Password', req.body.password))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.user.findOne({ where: { username: req.body.username } })
        .then((matchingUser) => {
          if (matchingUser) {
            if (user.classMethods
                .verifyPassword(req.body.password, matchingUser.password)) {
              req.session.user = matchingUser;
              // res.redirect('/protected_page');
              res.status(200).json(matchingUser);
            } else {
              res.status(400).json({ message: 'Password is invalid!' });
            }
          } else {
            res.status(400).json({ message: 'Username does not exist!' });
          }
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
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
      // console.log('You have been logged out.');
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
    console.log('You are not logged in!');
    return false;
  }

  /**
   * @description: Checks if supplied username and email already exist
   * @param {String} testUsername
   * @param {String} testEmail
   * @return {Boolean} true/false
   */
  isDuplicate(testUsername, testEmail) {
    errorMessage = '';
    this.user.findOne({ where: { username: testUsername } })
      .then((matchingUsers) => {
        if (matchingUsers.length > 0)
          errorMessage = `${errorMessage}\n - Username is already taken!`;
      });
    this.user.findOne({ where: { email: testEmail } })
      .then((matchingUsers) => {
        if (matchingUsers.length > 0)
          errorMessage = `${errorMessage}\n - Email already exists!`;
      });
    if (errorMessage.trim() === '')
      return false;
    console.log(errorMessage);
    return true;
  }

  /**
   * @description: Fetches all available users
   * @param {Object} req
   * @param {Object} res
   * @return {Object} allUsers
   */
  getAllUsers(req, res) {
    this.user.findAll().then((allUsers) => {
      res.status(200).json(allUsers);
    }).catch((err) => {
      // throw new Error(err);
      console.error(err.stack)
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
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.user.findOne({ where: { userId: req.params.userId } })
        .then((matchingUser) => {
          res.status(200).json(matchingUser);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
          res.status(500).json({ message: err.message });
        });
    }
  }

  /**
   * @description: Deletes a user matching specified userKey
   * @param {Object} req
   * @param {Object} res
   * @return {Object} deletedUser
   */
  deleteUser(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('User ID', req.params.userId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.user.destroy({ where: { userId: req.params.userId } })
        .then((matchingUser) => {
          res.status(200).json(matchingUser);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
          res.status(500).json({ message: err.message });
        });
    }
  }

}

export default UserController;
