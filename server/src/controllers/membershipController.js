import db from '../models/index';
import Validator from '../helpers/validator';

let errorMessage;

/**
 * @description: Defines controller for manipulating 'membership' model
 * @class
 */
class MembershipController {
  /**
   * @description: Initializes instance with necessary database models
   * as local properties
   * @constructor
   */
  constructor() {
    this.group = db.Group;
    this.membership = db.Membership;
    this.user = db.User;
  }

  /**
   * @description: Adds another user as member of a group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} newMembership
   */
  async addOtherMemberToGroup(req, res) {
    errorMessage = Validator.checkEmpty([
      { 'Group ID': req.params.groupId },
      { 'User ID': req.body.userId }
    ]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    }
    try {
      // Check if the specified group ID is valid
      const matchingGroup = await this.group
        .findById(req.params.groupId);
      if (!matchingGroup) {
        return res.status(404)
          .json({ message: 'Specified group does not exist!' });
      }
      // Check if the specified user ID is valid
      const matchingUser = await this.user.findById(req.body.userId);
      if (!matchingUser) {
        return res.status(404)
          .json({ message: 'Specified user does not exist!' });
      }
      // Check if the user is already in the group
      const existingMembership = await this.membership.findOne({
        where: {
          groupId: req.params.groupId,
          memberId: req.body.userId
        }
      });
      if (existingMembership) {
        return res.status(409)
          .json({ message: 'User is already in the group!' });
      }
      await this.membership.sync();
      const newMembership = await this.membership.create({
        groupId: req.params.groupId,
        memberId: req.body.userId,
        userRole: 'member'
      });
      return res.status(201).json({
        message: 'User added to group successfully!',
        membership: newMembership
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Fetches all members in a group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} memberships
   */
  async getMembersInGroup(req, res) {
    errorMessage = Validator.checkEmpty([
      { 'Group ID': req.params.groupId }
    ]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    }
    try {
      const memberships = await this.membership.findAll({
        attributes: ['id', 'userRole'],
        where: { groupId: req.params.groupId },
        include: [{
          model: this.user,
          attributes: ['id', 'username', 'email']
        }]
      });
      return res.status(200).json({ Memberships: memberships });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Deletes a specified member from a group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} null
   */
  async deleteMemberFromGroup(req, res) {
    errorMessage = Validator.checkEmpty([
      { 'Group ID': req.params.groupId },
      { 'User ID': req.params.userId }
    ]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    }
    try {
      // Check if the specified group ID is valid
      const matchingGroup = await this.group.findById(req.params.groupId);
      if (!matchingGroup) {
        return res.status(404)
          .json({ message: 'Specified group does not exist!' });
      }
      // Check if the specified user ID is valid
      const matchingUser = await this.user.findById(req.params.userId);
      if (!matchingUser) {
        return res.status(404)
          .json({ message: 'Specified user does not exist!' });
      }
      /* Allow the current user delete the member only if he is
      the creator of this group or the affected member */
      if ((matchingGroup.creatorId === req.session.user.id)
        || (req.params.userId === req.session.user.id)) {
        const matchingMembership = await this.membership.findOne({
          where: { groupId: req.params.groupId, memberId: req.params.userId }
        });
        if (matchingMembership) {
          await this.membership.destroy({
            where: { groupId: req.params.groupId, memberId: req.params.userId }
          });
          return res.status(200).json({
            message: 'Member deleted from group successfully!'
          });
        }
        return res.status(404)
          .json({ message: 'Specified membership does not exist!' });
      }
      return res.status(403)
        .json({ message: 'You do not have the right to delete this member.' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

}

export default MembershipController;
