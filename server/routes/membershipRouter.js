import express from 'express';
import MembershipController from '../controllers/membershipController';

const groupMemberRouter = express.Router();

/**
 * @description: Defines router for handling all 'group membership' requests
 * @module
 */

const membershipController = new MembershipController();
// baseURL /api/groups/:groupId/users

// Add a user to a group
groupMemberRouter.post('/', (req, res) => {
  membershipController.addOtherMemberToGroup(req, res);
});

// Fetch all members in a group
groupMemberRouter.get('/', (req, res) => {
  membershipController.getMembersInGroup(req, res);
});

// Remove a member from a group
groupMemberRouter.delete('/:userId', (req, res) => {
  membershipController.deleteMemberFromGroup(req, res);
});

// export default membershipController;
module.exports = membershipController;
