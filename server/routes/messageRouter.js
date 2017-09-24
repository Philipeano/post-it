import express from 'express';
import MessageController from '../controllers/messageController';

const messageRouter = express.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'group message' requests
 * @module
 */

const messageController = new MessageController();
// baseURL /api/groups/:groupId/messages

// Post a message to a group
messageRouter.post('/', (req, res) => {
  messageController.postMessageToGroup(req, res);
});

// Fetch all messages available to a group
messageRouter.get('/', (req, res) => {
  messageController.getMessagesFromGroup(req, res);
});

// Update a message sent to a group
messageRouter.patch('/:messageId', (req, res) => {
  messageController.updatePostedMessage(req, res);
});

// Delete a message sent to a group
messageRouter.delete('/:messageId', (req, res) => {
  messageController.deletePostedMessage(req, res);
});

module.exports = messageRouter;
// export default messageRouter;
