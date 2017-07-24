import express from 'express';
import user from '../controllers/user';
import InputValidator from '../controllers/validator';

const userRouter = express.Router();

/**
 * @description: Defines router for handling all 'user' requests
 * @module
 */

const userController = new user.User();

// Register new user
userRouter.post('api/user/signup', (req, res) => {
  if (InputValidator.isEmpty('Username', req.body.username)) {
    res.json({ message: InputValidator.lastErrorMessage });
  }
  else if (InputValidator.isEmpty('E-mail Address',
      req.body.email.toString())) {
    res.json({ message: InputValidator.lastErrorMessage });
  }
  else if (InputValidator.isEmpty('Password', req.body.password)) {
    res.json({ message: InputValidator.lastErrorMessage });
  }
  else if (InputValidator.isEmpty('Password Retype', req.body.cPassword)) {
    res.json({ message: InputValidator.lastErrorMessage });
  }
  else {
    userController.createUser(req.body.username, req.body.email,
      req.body.password, () => {})
      .then(res.status(201).json(user));
  }
});

// Fetch all users
userRouter.get('api/users', (req, res) => {
});

// Fetch users with specified key
userRouter.get('api/:userId/users', userController.getUserByKey);

// Delete users with specified key
userRouter.delete('/:userId/users', userController.deleteUser);

// Respond to random requests
userRouter.use('/*', (req, res) => {
  res.status(200).send({ message: 'PostIT API is running...' });
});

export default userRouter;
