import db from '../models/index';
import user from '../models/user';
import Validator from '../controllers/validator';

const sequelize = db.sequelize;
let errorMessage;
let reqPasswordHash;
// let reqUsername, reqEmail, reqPassword, reqPasswordRetype;

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
  createUser(req, res) {
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
      res.status(400).json({message: errorMessage});
    else {
      reqPasswordHash = user.classMethods.generateHash(req.body.password);
      return this.user.sync().then(() => {
        this.user.create({
          username: req.body.username,
          email: req.body.email,
          password: reqPasswordHash
        }).then((newUser) => {
          res.status(201).json(newUser);
        }).catch((err) => {
          throw new Error(err);
          res.status(500).json({ message: err.message });
        });
      });
    }
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
      throw new Error(err);
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
      res.status(400).json({message: errorMessage});
    else {
      this.user.findOne({where: { userId: req.params.userId } })
        .then((matchingUser) => {
          res.status(200).json(matchingUser);
        }).catch((err) => {
          throw new Error(err);
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
      this.user.destroy({where: { userId: req.params.userId } })
        .then((matchingUser) => {
          res.status(200).json(matchingUser);
        }).catch((err) => {
          throw new Error(err);
          res.status(500).json({ message: err.message });
        });
    }
  }

}

export default UserController;


// POST: /api/user/signin
// Username & Password

/**
 * @description: Registers a new user
 * @param {String} username
 * @param {String} email
 * @param {String} password
 * @param {Function} done
 * @return {Object} newUser
 */
/*
createUser(username, email, password, done) {
  const hashedPassword = user.classMethods.generateHash(password);
  return this.user.sync().then(() => {
    this.user.create({
      username: username,
      email: email,
      password: hashedPassword
    }).then((newUser) => {
      done(newUser);
    }).catch((err) => {
      throw new Error(err);
    });
  });
}*/

/**
 * @description: Fetches all available users
 * @param {Function} done
 * @return {Object} allUsers
 */
/*
  getAllUsers(done) {
    this.user.findAll().then((allUsers) => {
      done(allUsers);
    });
  }
*/

/**
 * @description: Fetches a user matching specified userKey
 * @param {String} userKey
 * @param {Function} done
 * @return {Object} matchingUsers
 */
/*getUserByKey(userKey, done) {
  this.user.findOne({ where: { userId: userKey } })
    .then((matchingUser) => {
      done(matchingUser);
    });
}*/

/**
 * @description: Deletes a user matching specified userKey
 * @param {String} userKey
 * @return {Object} deletedUser
 */
/*deleteUser(userKey) {
  this.user.destroy({ where: { userId: userKey } });
}*/
