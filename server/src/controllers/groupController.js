import db from '../models/index';
import Validator from './validator';

let errorMessage;

/**
 * @description: Defines controller for manipulating 'group' model
 * @class
 */
class GroupController {
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
   * @description: Creates a new group and adds creator as member
   * @param {Object} req
   * @param {Object} res
   * @return {Object} newGroup
   */
  createGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Title', req.body.title))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('Purpose', req.body.purpose))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.group.findOne({ where: { title: req.body.title } })
        .then((matchingGroup) => {
          if (matchingGroup) {
            res.status(409).json({message: 'Group Title is already taken!'});
          } else {
            // Create the new group with the title, purpose and creator ID
            this.group.sync().then(() => {
              this.group.create({
                title: req.body.title,
                purpose: req.body.purpose,
                creatorId: req.session.user.id
              }).then((newGroup) => {
                // Add the creator as the first member of the group
                this.membership.sync().then(() => {
                  this.membership.create({
                    userRole: 'admin',
                    groupId: newGroup.id,
                    memberId: req.session.user.id
                  }).then(() => {
                    res.status(201).json({
                      message: 'Group created successfully!',
                      group: Validator.trimFields(newGroup)
                    });
                  });
                }).catch((err) => {
                  res.status(500).json({ message: err.message });
                });
              });
            });
          }
        });
    }
  }

  /**
   * @description: Fetches all available groups
   * @param {Object} req
   * @param {Object} res
   * @return {Object} allGroups
   */
  getAllGroups(req, res) {
    this.group.findAll({
      attributes: ['id', 'title', 'purpose'],
      include: [{
        model: this.user,
        as: 'creator',
        attributes: ['id', 'username', 'email']
      },
      {
        model: this.user,
        as: 'members',
        attributes: ['id', 'username', 'email'],
        through: { attributes: ['userRole'] }
      }]
    })
      .then((allGroups) => {
        res.status(200).json({ 'Available groups': allGroups });
      }).catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }

  /**
   * @description: Fetches a group matching specified groupKey
   * @param {Object} req
   * @param {Object} res
   * @return {Object} matchingGroup
   */
  getGroupByKey(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.group.findOne({
        attributes: ['id', 'title', 'purpose'],
        where: { id: req.params.groupId },
        include: [{
          model: this.user,
          as: 'creator',
          attributes: ['id', 'username', 'email']
        },
        {
          model: this.user,
          as: 'members',
          attributes: ['id', 'username', 'email'],
          through: { attributes: ['userRole'] }
        }]
      })
        .then((matchingGroup) => {
          if (matchingGroup) {
            res.status(200).json({ 'Requested group': matchingGroup });
          } else {
            res.status(404).json({
              message: 'Requested group does not exist!'
            });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

  /**
   * @description: Deletes a group matching specified groupKey
   * @param {Object} req
   * @param {Object} res
   * @return {Object} null
   */
  deleteGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({message: errorMessage});
    else {
      // Check if the specified group ID is valid
      this.group.findById(req.params.groupId).then((matchingGroup) => {
        if (!matchingGroup) {
          res.status(404)
            .json({message: 'Specified group does not exist!'});
        } else {
          /* Allow the current user delete the group only if he is
          the original creator */
          if (matchingGroup.creatorId === req.session.user.id) {
            this.group.destroy({where: {id: req.params.groupId}})
              .then(() => {
                res.status(200)
                  .json({message: 'Group deleted successfully!'});
              }).catch((err) => {
                res.status(500).json({message: err.message});
              });
          } else {
            res.status(403).json({
              message: 'You do not have the right to delete this group!'
            });
          }
        }
      }).catch((err) => {
        res.status(500).json({message: err.message});
      });
    }
  }

}

export default GroupController;
