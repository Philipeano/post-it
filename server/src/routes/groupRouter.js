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
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
groupRouter.post('/', (req, res) => {
  groupController.createGroup(req, res);
});

/**
 * @description: Fetch all groups
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
groupRouter.get('/', (req, res) => {
  groupController.getAllGroups(req, res);
});

/**
 * @description: Fetch group with specified key
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
groupRouter.get('/:groupId', (req, res) => {
  groupController.getGroupByKey(req, res);
});

/**
 * @description: Delete group with specified key
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
groupRouter.delete('/:groupId', (req, res) => {
  groupController.deleteGroup(req, res);
});

export default groupRouter;

