import express from 'express';
import GroupController from '../controllers/group';

const groupRouter = express.Router();

/**
 * @description: Defines router for handling all 'group' requests
 * @module
 */

const groupController = new GroupController();
// baseURL /api/groups

// Create new group
groupRouter.post('/', (req, res) => {
  groupController.createGroup(req, res);
});

// Fetch all groups
groupRouter.get('/', (req, res) => {
  groupController.getAllGroups(req, res);
});

// Fetch groups with specified key
groupRouter.get('/:groupId', groupController.getGroupByKey);

// Delete groups with specified key
groupRouter.delete('/:groupId', groupController.deleteGroup);

// export default groupRouter;
module.exports = groupRouter;
