import express from 'express';
import Group from '../controllers/group';
import Validator from '../controllers/validator';

const groupRouter = express.Router();

/**
 * @description: Defines router for handling all 'group' requests
 * @module
 */

const groupController = new Group();

// Create new group
groupRouter.post('/api/group', (req, res) => {
  if (Validator.isEmpty('Title', req.body.title)) {
    res.json({ message: Validator.validationMessage });
  }
  else if (Validator.isEmpty('Purpose',
      req.body.purpose.toString())) {
    res.json({ message: Validator.validationMessage });
  }
  else {
    groupController.createGroup(
      req.body.title,
      req.body.creatorId,
      req.body.purpose,
      true, () => {})
      .then(res.status(201).json(group));
  }
});


// Fetch all groups
groupRouter.get('/api/group', (req, res) => {
});

// Fetch groups with specified key
groupRouter.get('/api/group/:groupId', groupController.getGroupByKey);

// Delete groups with specified key
groupRouter.delete('/api/group/:groupId', groupController.deleteGroup);

export default groupRouter;

/*
An API route that allow users add other users to groups:
  POST: /api/group/<group id>/user
An API route that allows a logged in user post messages to created groups:
  POST: /api/group/<group id>/message
An API route that allows a logged in user retrieve messages that have been
posted to groups he/she belongs to:
  GET: /api/group/<group id>/messages
*/
