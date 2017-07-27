import express from 'express';
import UserController from '../controllers/user';
// import Validator from '../controllers/validator';

const userRouter = express.Router();

/**
 * @description: Defines router for handling all 'user' requests
 * @module
 */

const userController = new User();
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
  userController.createUser(req, res);
});

// Fetch all users
userRouter.get('/api/users', (req, res) => {
});

userRouter.get('/api/users', (req, res) => {
});

// Fetch users with specified key
userRouter.get('/api/users/:userId', userController.getUserByKey);

// Delete users with specified key
userRouter.delete('/api/users/:userId', userController.deleteUser);

export default userRouter;
