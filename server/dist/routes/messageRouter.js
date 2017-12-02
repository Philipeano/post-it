'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _messageController = require('../controllers/messageController');

var _messageController2 = _interopRequireDefault(_messageController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messageRouter = _express2.default.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'message' requests
 * @module
 */

var messageController = new _messageController2.default();

/**
 * @description: Post a message to a group
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
messageRouter.post('/', function (req, res) {
  messageController.postMessageToGroup(req, res);
});

/**
 * @description: Fetch all messages available to a group
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
messageRouter.get('/', function (req, res) {
  messageController.getMessagesFromGroup(req, res);
});

/**
 * @description: Update a message previously sent to a group
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
messageRouter.patch('/:messageId', function (req, res) {
  messageController.updatePostedMessage(req, res);
});

/**
 * @description: Delete a message previously sent to a group
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
messageRouter.delete('/:messageId', function (req, res) {
  messageController.deletePostedMessage(req, res);
});

exports.default = messageRouter;