'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _groupController = require('../controllers/groupController');

var _groupController2 = _interopRequireDefault(_groupController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var groupRouter = _express2.default.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'group' requests
 * @module
 */

var groupController = new _groupController2.default();

/**
 * @description: Create new group
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
groupRouter.post('/', function (req, res) {
  groupController.createGroup(req, res);
});

/**
 * @description: Fetch all groups
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
groupRouter.get('/', function (req, res) {
  groupController.getAllGroups(req, res);
});

/**
 * @description: Fetch group with specified key
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
groupRouter.get('/:groupId', function (req, res) {
  groupController.getGroupByKey(req, res);
});

/**
 * @description: Delete group with specified key
 * @param {Object} req The incoming request from the client
 * @param {Object} res The outgoing response from the server
 */
groupRouter.delete('/:groupId', function (req, res) {
  groupController.deleteGroup(req, res);
});

exports.default = groupRouter;