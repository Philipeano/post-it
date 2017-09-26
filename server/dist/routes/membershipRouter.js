'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _membershipController = require('../controllers/membershipController');

var _membershipController2 = _interopRequireDefault(_membershipController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var membershipRouter = _express2.default.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'membership' requests
 * @module
 */

var membershipController = new _membershipController2.default();

/**
 * @description: Add a user to a group
 * @param {Object} req
 * @param {Object} res
 */
membershipRouter.post('/', function (req, res) {
  membershipController.addOtherMemberToGroup(req, res);
});

/**
 * @description: Fetch all members in a group
 * @param {Object} req
 * @param {Object} res
 */
membershipRouter.get('/', function (req, res) {
  membershipController.getMembersInGroup(req, res);
});

/**
 * @description: Remove a member from a group
 * @param {Object} req
 * @param {Object} res
 */
membershipRouter.delete('/:userId', function (req, res) {
  membershipController.deleteMemberFromGroup(req, res);
});

exports.default = membershipRouter;