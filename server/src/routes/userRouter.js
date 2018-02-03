import express from 'express';
import dotenv from 'dotenv';
import UserController from '../controllers/userController';
import Auth from '../helpers/auth';

dotenv.config();

const userRouter = express.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'user' requests
 * @module
 */

const userController = new UserController();

/**
 * @description: Register new user
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
userRouter.post('/signup', (req, res) => {
  userController.signUpUser(req, res);
});

/**
 * @description: Log in user
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
userRouter.post('/signin', (req, res) => {
  userController.signInUser(req, res);
});

/**
 * @description: Log out user
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
userRouter.post('/signout', (req, res) => {
  userController.signOutUser(req, res);
});

/**
 * @description: Fetch all users
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
userRouter.get('/', Auth.isAuthenticated, (req, res) => {
  userController.getAllUsers(req, res);
});

/**
 * @description: Fetch user with specified key
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
userRouter.get('/:userId', Auth.isAuthenticated, (req, res) => {
  userController.getUserByKey(req, res);
});

/**
 * @description: Delete user with specified key
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
userRouter.delete('/:userId', Auth.isAuthenticated, (req, res) => {
  userController.deleteUser(req, res);
});

export default userRouter;
