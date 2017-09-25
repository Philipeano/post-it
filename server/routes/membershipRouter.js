import express from 'express';
import MembershipController from '../controllers/membershipController';

const membershipRouter = express.Router({ mergeParams: true });

/**
 * @description: Defines router for handling all 'membership' requests
 * @module
 */

const membershipController = new MembershipController();

/**
 * @description: Add a user to a group
 * @param {Object} req
 * @param {Object} res
 */
membershipRouter.post('/', (req, res) => {
  membershipController.addOtherMemberToGroup(req, res);
});

/**
 * @description: Fetch all members in a group
 * @param {Object} req
 * @param {Object} res
 */
membershipRouter.get('/', (req, res) => {
  membershipController.getMembersInGroup(req, res);
});

/**
 * @description: Remove a member from a group
 * @param {Object} req
 * @param {Object} res
 */
membershipRouter.delete('/:userId', (req, res) => {
  membershipController.deleteMemberFromGroup(req, res);
});

export default membershipRouter;
