import express from 'express';
import UserController from '../controllers/userController';

const userRouter = express.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'user' requests
 * @module
 */

const userController = new UserController();

// Register new user
userRouter.post('/signup', (req, res) => {
  userController.signUpUser(req, res);
});

// Log in user
userRouter.post('/signin', (req, res) => {
  userController.signInUser(req, res);
});

// Log out user
userRouter.post('/signout', (req, res) => {
  userController.signOutUser(req, res);
});

// Fetch all users
userRouter.get('/', (req, res) => {
  userController.getAllUsers(req, res);
});

// Fetch user with specified key
userRouter.get('/:userId', userController.getUserByKey);

// Delete user with specified key
userRouter.delete('/:userId', userController.deleteUser);

// export default userRouter;
module.exports = userRouter;
