import express from 'express';
import UserController from '../controllers/user';

const userRouter = express.Router();

/**
 * @description: Defines router for handling all 'user' requests
 * @module
 */

const userController = new UserController();

// Register new user
userRouter.post('/api/users/signup', (req, res) => {
  userController.signUpUser(req, res);
});

// Log in user
userRouter.post('/api/users/signin', (req, res) => {
  userController.signInUser(req, res);
});

// Log out user
userRouter.post('/api/users/signout', (req, res) => {
  userController.signOutUser(req, res);
});

// Fetch all users
userRouter.get('/api/users', (req, res) => {
  userController.getAllUsers(req, res);
});

// Fetch user with specified key
userRouter.get('/api/users/:userId', userController.getUserByKey);

// Delete user with specified key
userRouter.delete('/api/users/:userId', userController.deleteUser);

export default userRouter;
