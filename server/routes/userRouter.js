import express from 'express';
import UserController from '../controllers/userController';

const userRouter = express.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'user' requests
 * @module
 */

const userController = new UserController();

/**
 * @description: Register new user
 * @param {Object} req
 * @param {Object} res
 */
userRouter.post('/signup', (req, res) => {
  userController.signUpUser(req, res);
});

/**
 * @description: Log in user
 * @param {Object} req
 * @param {Object} res
 */
userRouter.post('/signin', (req, res) => {
  userController.signInUser(req, res);
});

/**
 * @description: Log out user
 * @param {Object} req
 * @param {Object} res
 */
userRouter.post('/signout', (req, res) => {
  userController.signOutUser(req, res);
});

/**
 * @description: Fetch all users
 * @param {Object} req
 * @param {Object} res
 */
userRouter.get('/', (req, res) => {
  userController.getAllUsers(req, res);
});

/**
 * @description: Fetch user with specified key
 * @param {Object} req
 * @param {Object} res
 */
userRouter.get('/:userId', (req, res) => {
  userController.getUserByKey(req, res);
});

/**
 * @description: Delete user with specified key
 * @param {Object} req
 * @param {Object} res
 */
userRouter.delete('/:userId', (req, res) => {
  userController.deleteUser(req, res);
});

export default userRouter;
