import express from 'express';
import UserController from '../controllers/user';
// import Validator from '../controllers/validator';

const userRouter = express.Router();

/**
 * @description: Defines router for handling all 'user' requests
 * @module
 */

const userController = new UserController();
/*

// Register new user
userRouter.post('/api/user/signup', (req, res) => {
  if (Validator.isEmpty('Username', req.body.username)) {
    res.json({ message: Validator.lastErrorMessage });
  }
  else if (Validator.isEmpty('E-mail Address',
      req.body.email.toString())) {
    res.json({ message: Validator.lastErrorMessage });
  }
  else if (Validator.isEmpty('Password', req.body.password)) {
    res.json({ message: Validator.lastErrorMessage });
  }
  else if (Validator.isEmpty('Password Retype', req.body.cPassword)) {
    res.json({ message: Validator.lastErrorMessage });
  }
  else {
    userController.createUser(req.body.username, req.body.email,
      req.body.password, () => {})
      .then(res.status(201).json(user));
  }
});
*/


// Register new user
userRouter.post('/api/users/signup', (req, res) => {
  userController.signUpUser(req, res);
});

// Authenticate user
userRouter.post('/api/users/signin', (req, res) => {
  userController.signInUser(req, res);
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
