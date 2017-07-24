import db from '../models/index';
import user from '../models/user';

const sequelize = db.sequelize;

/**
 * @description: Defines controller for manipulating 'user' model
 * @class
 */
class User {
  /**
   * @description: Initializes instance with 'user' model as local property
   * @constructor
   */
  constructor() {
    this.user = user(sequelize);
  }

  /**
   * @description: creates a new user
   * @param {String} username
   * @param {String} email
   * @param {String} password
   * @param {Function} done
   * @return {Object} newUser
   */
  createUser(username, email, password, done) {
    const hashedPassword = user.classMethods.generateHash(password);
    return this.user.sync().then(() => {
      this.user.create({ username, email, hashedPassword }).then((newUser) => {
        done(newUser);
      }).catch((err) => {
        throw new Error(err);
      });
    });
  }

  /**
   * @description: fetches all available users
   * @param {Function} done
   * @return {Object} allUsers
   */
  getAllUsers(done) {
    this.user.findAll().then((allUsers) => {
      done(allUsers);
    });
  }

  /**
   * @description: fetches all users matching specified userKey
   * @param {String} userKey
   * @param {Function} done
   * @return {Object} matchingUsers
   */
  getUserByKey(userKey, done) {
    this.user.findAll({ where: { userId: userKey } })
      .then((matchingUsers) => {
        done(matchingUsers);
      });
  }

  /**
   * @description: deletes a user matching specified userKey
   * @param {String} userKey
   * @return {Object} deletedUser
   */
  deleteUser(userKey) {
    this.user.destroy({ where: { userId: userKey } });
  }
}

export default User;
