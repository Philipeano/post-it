import express from 'express';
import GroupController from '../controllers/groupController';

const groupRouter = express.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'group' requests
 * @module
 */

const groupController = new GroupController();

/**
 * @description: Create new group
 * @param {Object} req
 * @param {Object} res
 */
groupRouter.post('/', (req, res) => {
  groupController.createGroup(req, res);
});

/**
 * @description: Fetch all groups
 * @param {Object} req
 * @param {Object} res
 */
groupRouter.get('/', (req, res) => {
  groupController.getAllGroups(req, res);
});

/**
 * @description: Fetch group with specified key
 * @param {Object} req
 * @param {Object} res
 */
groupRouter.get('/:groupId', (req, res) => {
  groupController.getGroupByKey(req, res);
});

/**
 * @description: Delete group with specified key
 * @param {Object} req
 * @param {Object} res
 */
groupRouter.delete('/:groupId', (req, res) => {
  groupController.deleteGroup(req, res);
});

export default groupRouter;

