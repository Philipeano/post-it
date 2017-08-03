import express from 'express';
import GroupMemberController from '../controllers/groupmember';

const groupMemberRouter = express.Router();

/**
 * @description: Defines router for handling all 'group membership' requests
 * @module
 */

const groupMemberController = new GroupMemberController();
// baseURL /api/groups/:groupId/users

// Add a user to a group
groupMemberRouter.post('/', (req, res) => {
  groupMemberController.addOtherMemberToGroup(req, res);
});

// Fetch all members in a group
groupMemberRouter.get('/', (req, res) => {
  groupMemberController.getMembersInGroup(req, res);
});

// Remove a member from a group
groupMemberRouter.delete('/:userId', (req, res) => {
  groupMemberController.deleteMemberFromGroup(req, res);
});

// export default groupMemberRouter;
module.exports = groupMemberRouter;
