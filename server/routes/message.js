import express from 'express';
import MessageController from '../controllers/message';

const messageRouter = express.Router();

/**
 * @description: Defines router for handling all 'group message' requests
 * @module
 */

const messageController = new MessageController();

// Post a message to a group
messageRouter.post('/api/groups/:groupId/messages', (req, res) => {
  messageController.postMessageToGroup(req, res);
});

// Fetch all messages available to a group
messageRouter.get('/api/groups/:groupId/messages', (req, res) => {
  messageController.getMessagesFromGroup(req, res);
});

// Delete a message sent to a group
messageRouter.delete('/api/groups/:groupId/messages/:messageId', (req, res) => {
  messageController.deletePostedMessage(req, res);
});

export default messageRouter;

