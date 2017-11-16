import db from '../models/index';
import Validator from './validator';

let errorMessage;

/**
 * @description: Defines controller for manipulating 'membership' model
 * @class
 */
class MembershipController {
  /**
   * @description: Initializes instance with necessary database models
   * as a local properties
   * @constructor
   */
  constructor() {
    this.group = db.Group;
    this.membership = db.Membership;
    this.user = db.User;
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
      // Check if the specified group ID is valid
      this.group.findById(req.params.groupId).then((matchingGroup) => {
        if (!matchingGroup) {
          res.status(404)
            .json({ message: 'Specified group does not exist!' });
        } else {
          // Check if the specified user ID is valid
          this.user.findById(req.body.userId).then((matchingUser) => {
            if (!matchingUser) {
              res.status(404)
                .json({ message: 'Specified user does not exist!' });
            } else {
              this.membership.findOne({
                where: {
                  groupId: req.params.groupId,
                  memberId: req.body.userId
                }
              })
                .then((existingMembership) => {
                  if (existingMembership) {
                    res.status(409)
                      .json({ message: 'User is already in the group!' });
                  } else {
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
                        res.status(500).json({message: err.message});
                      });
                    });
                  }
                }).catch((err) => {
                  res.status(500).json({ message: err.message });
                });
            }
          }).catch((err) => {
            res.status(500).json({ message: err.message });
          });
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
        .findAll({
          attributes: ['id', 'userRole'],
          where: { groupId: req.params.groupId },
          include: [{
            model: this.user,
            attributes: ['id', 'username', 'email']
          }]
        })
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
      // Check if the specified group ID is valid
      this.group.findById(req.params.groupId).then((matchingGroup) => {
        if (!matchingGroup) {
          res.status(404)
            .json({ message: 'Specified group does not exist!' });
        } else {
          // Check if the specified user ID is valid
          this.user.findById(req.params.userId).then((matchingUser) => {
            if (!matchingUser) {
              res.status(404)
                .json({ message: 'Specified user does not exist!' });
            } else {
              /* Allow the current user delete the member only if he is
              the creator of this group or the affected member */
              if ((matchingGroup.creatorId === req.session.user.id) ||
                (req.params.userId === req.session.user.id)) {
                this.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: req.params.userId
                  }
                })
                  .then((matchingMembership) => {
                    if (matchingMembership) {
                      this.membership
                        .destroy({
                          where: {
                            groupId: req.params.groupId,
                            memberId: req.params.userId
                          }
                        })
                        .then(() => {
                          res.status(200)
                            .json({
                              message: 'Member deleted from group successfully!'
                            });
                        }).catch((err) => {
                          res.status(500).json({ message: err.message });
                        });
                    } else {
                      res.status(404)
                        .json({
                          message: 'Specified membership does not exist!'
                        });
                    }
                  }).catch((err) => {
                    res.status(500).json({ message: err.message });
                  });
              } else {
                res.status(403)
                  .json({
                    message: 'You do not have the right to delete this member.'
                  });
              }
            }
          }).catch((err) => {
            res.status(500).json({ message: err.message });
          });
        }
      }).catch((err) => {
        res.status(500).json({ message: err.message });
      });
    }
  }

}

export default MembershipController;
