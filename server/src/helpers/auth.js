import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index';

dotenv.config();
const secretKey = process.env.SECRET_KEY;

/**
 * @description: Defines an authentication class implementing JWT
 * @class
 */
class Auth {
  /**
   * @description: Initializes instance with 'user' model as local property
   * @constructor
   */
  constructor() {
    this.user = db.User;
  }

  /**
   * @description: Generates a new token for the user
   * @param {Object} payload User information to encode in token
   * @return {String} token The generated token
   */
  static generateToken(payload) {
    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
    console.log(`SUPPLIED PAYLOAD: ${payload}`);
    console.log(`GENERATED TOKEN: ${token}`);
    return token;
  }

  /**
   * @description: Checks for authenticity of a supplied token
   * @param {String} token The token to verify
   * @return {String} currentUserId ID of the logged in user
   */
  static verifyToken(token) {
    let currentUserId;
    try {
      const decodedToken = jwt.verify(token, secretKey);
      if (decodedToken === null || decodedToken === undefined) {
        currentUserId = null;
      }
      currentUserId = decodedToken.userId;
    } catch (err) {
      currentUserId = null;
    }
    return currentUserId;
  }

  /**
   * @description: Extracts authentication token from request object
   * @param {Object} req The incoming request from the client
   * @return {String} Authenticated user ID or null if token is missing
   */
  static getUserIdFromRequest(req) {
    const token = req.headers.token || req.body.token;
    if (!token) {
      return null;
    }
    return this.verifyToken(token);
  }

  /**
   * @description: Checks if user is authenticated
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @param {Function} next Next callback function
   * @return {void}
   */
  static isAuthenticated(req, res, next) {
    const checkUserId = Auth.getUserIdFromRequest(req);
    if (!checkUserId) {
      return res.status(401)
      .json({ message: 'Access denied! Please sign in first.' });
    }
    next();
  }

  /**
   * @description: Fetches the current user's information
   * @param {Object} userId The ID of the current user
   * @return {Object} user Details of the current user
   */
  static async getUserInfoById(userId) {
    const user = await this.user.findById(userId);
    return user;
  }
}

export default Auth;
