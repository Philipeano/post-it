import db from '../models/index';
import Validator from './validator';

let errorMessage;

/**
 * @description: Defines controller for manipulating 'membership' model
 * @class
 */
class MembershipController {
  /**
   * @description: Initializes instance with 'membership' as local property
   * @constructor
   */
  constructor() {
    this.group = db.Group;
    this.membership = db.Membership;
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
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('User ID', req.body.userId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.group.findById(req.params.groupId).then((matchingGroup) => {
        if (matchingGroup) {
          this.membership.findOne({
            where: {
              groupId: req.params.groupId,
              memberId: req.body.userId
            }
          })
            .then((existingMembership) => {
              if (existingMembership)
                res.status(409)
                  .json({ message: 'User is already in the group!' });
              else {
                this.membership.sync().then(() => {
                  this.membership.create({
                    groupId: req.params.groupId,
                    memberId: req.body.userId,
                    userRole: 'member'
                  }).then((newMembership) => {
                    res.status(201).json({
                      message: 'User added to group successfully!',
                      membership: newMembership
                    });
                  }).catch((err) => {
                    res.status(500).json({ message: err.message });
                  });
                });
              }
            }).catch((err) => {
              res.status(500).json({ message: err.message });
            });
        } else {
          res.status(404)
            .json({ message: 'Specified group does not exist!' });
        }
      }).catch((err) => {
        res.status(500).json({ message: err.message });
      });
    }
  }

  /**
   * @description: Fetches all members in a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} memberships
   */
  getMembersInGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.membership
        .findAll({ where: { groupId: req.params.groupId } })
        .then((memberships) => {
          res.status(200).json({ Memberships: memberships });
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

  /**
   * @description: Deletes a specified member from a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} null
   */
  deleteMemberFromGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('User ID', req.params.userId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.membership.findOne({ where: { groupId: req.params.groupId,
        memberId: req.params.userId } })
        .then((matchingMembership) => {
          if (matchingMembership) {
            this.membership
              .destroy({ where: { groupId: req.params.groupId,
                memberId: req.params.userId } })
              .then(() => {
                res.status(200)
                  .json({ message: 'Member deleted from group successfully!' });
              });
          } else {
            res.status(404)
              .json({ message: 'Specified membership does not exist' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

}

export default MembershipController;
