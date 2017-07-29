import express from 'express';
import GroupController from '../controllers/group';

const groupRouter = express.Router();

/**
 * @description: Defines router for handling all 'group' requests
 * @module
 */

const groupController = new GroupController();

// Create new group
groupRouter.post('/api/groups', (req, res) => {
  groupController.createGroup(req, res);
});

// Fetch all groups
groupRouter.get('/api/groups', (req, res) => {
  groupController.getAllUsers(req, res);
});

// Fetch groups with specified key
groupRouter.get('/api/groups/:groupId', groupController.getGroupByKey);

// Delete groups with specified key
groupRouter.delete('/api/groups/:groupId', groupController.deleteGroup);

export default groupRouter;
