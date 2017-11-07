import express from 'express';
import MessageController from '../controllers/messageController';

const messageRouter = express.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'message' requests
 * @module
 */

const messageController = new MessageController();

/**
 * @description: Post a message to a group
 * @param {Object} req
 * @param {Object} res
 */
messageRouter.post('/', (req, res) => {
  messageController.postMessageToGroup(req, res);
});

/**
 * @description: Fetch all messages available to a group
 * @param {Object} req
 * @param {Object} res
 */
messageRouter.get('/', (req, res) => {
  messageController.getMessagesFromGroup(req, res);
});

/**
 * @description: Update a message previously sent to a group
 * @param {Object} req
 * @param {Object} res
 */
messageRouter.patch('/:messageId', (req, res) => {
  messageController.updatePostedMessage(req, res);
});

/**
 * @description: Delete a message previously sent to a group
 * @param {Object} req
 * @param {Object} res
 */
messageRouter.delete('/:messageId', (req, res) => {
  messageController.deletePostedMessage(req, res);
});

export default messageRouter;
