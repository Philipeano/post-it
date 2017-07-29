import db from '../models/index';
import groupMember from '../models/groupmember';
import Validator from '../controllers/validator';

const sequelize = db.sequelize;
let errorMessage;

/**
 * @description: Defines controller for manipulating 'groupMember' model
 * @class
 */
class GroupMemberController {
  /**
   * @description: Initializes instance with 'groupMember' as local property
   * @constructor
   */
  constructor() {
    this.groupMember = groupMember(sequelize);
  }

  /**
   * @description: Adds current user as admin in specified group
   * @param {String} groupId
   * @param {String} userId
   * @return {Object} newMembership
   */
  addDefaultMemberToGroup(groupId, userId) {
    errorMessage = '';
    return this.groupMember.sync().then(() => {
      this.groupMember.create({
        groupId,
        memberId: userId,
        userRole: 'admin'
      }).then((newMembership) => {
        return newMembership;
      }).catch((err) => {
        // throw new Error(err);
        console.error(err.stack);
        return {};
      });
    });
  }

  /**
   * @description: Adds another user as member of a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} newMembership
   */
  addOtherMemberToGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('User ID', req.params.userId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else if (this.isDuplicate(req.params.groupId, req.params.userId))
      res.status(409).json({ message: errorMessage });
    else {
      return this.groupMember.sync().then(() => {
        this.groupMember.create({
          groupId: req.params.groupId,
          memberId: req.params.userId,
          userRole: 'member'
        }).then((newMembership) => {
          res.status(201).json(newMembership);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack);
          res.status(500).json({ message: err.message });
        });
      });
    }
  }

  /**
   * @description: Checks if specified user already exists in a group
   * @param {String} testGroupId
   * @param {String} testUserId
   * @return {Boolean} true/false
   */
  isDuplicate(testGroupId, testUserId) {
    errorMessage = '';
    this.groupMember.findAll({ where: { groupId: testGroupId,
      memberId: testUserId } })
      .then((memberships) => {
        if (memberships.length > 0)
          errorMessage = `${errorMessage}\n - User is already in the group!`;
      });
    if (errorMessage.trim() === '')
      return false;
    console.log(errorMessage);
    return true;
  }

  /**
   * @description: Fetches all members in a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} matchingMembers
   */
  getMembersInGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({message: errorMessage});
    else {
      this.groupMember.findAll({ where: { groupId: req.params.groupId } })
        .then((matchingMembers) => {
          res.status(200).json(matchingMembers);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
          res.status(500).json({ message: err.message });
        });
    }
  }

  /**
   * @description: Deletes a specified member from a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} deletedMember
   */
  deleteMemberFromGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('User ID', req.params.userId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.groupMember.destroy({ where: { groupId: req.params.groupId,
        memberId: req.params.userId } })
        .then((deletedMember) => {
          res.status(200).json(deletedMember);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
          res.status(500).json({ message: err.message });
        });
    }
  }

}

export default GroupMemberController;
