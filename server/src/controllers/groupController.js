import db from '../models/index';
import Validator from './validator';

const groupModel = db.Group;
const membershipModel = db.Membership;
const userModel = db.User;
let errorMessage;

/**
 * @description: Defines controller for manipulating 'group' model
 * @class
 */
class GroupController {
  /**
   * @description: Initializes instance with 'group' and 'membership' models
   * as local properties
   * @constructor
   */
  constructor() {
    this.group = groupModel;
    this.membership = membershipModel;
    this.user = userModel;
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
      groupModel.findOne({ where: { title: req.body.title } })
        .then((matchingGroup) => {
          if (matchingGroup)
            res.status(409).json({ message: 'Group Title is already taken!' });
          else {
            groupModel.sync().then(() => {
              groupModel.create({
                title: req.body.title,
                purpose: req.body.purpose,
                creatorId: req.session.user.id
              }).then((newGroup) => {
                membershipModel.sync().then(() => {
                  membershipModel.create({
                    userRole: 'admin',
                    groupId: newGroup.id,
                    memberId: req.session.user.id
                  }).then(() => {
                    res.status(201).json({
                      message: 'Group created successfully!',
                      group: newGroup
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
    groupModel.findAll({
      // include: [{ model: 'User', as: 'Creator' },
      //   { model: 'Message', as: 'messages' }]
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
      groupModel.findOne({ where: { id: req.params.groupId } })
        .then((matchingGroup) => {
          if (matchingGroup) {
            res.status(200).json({ 'Specified group': matchingGroup });
          } else {
            res.status(404).json({ message: 'Specified group does not exist' });
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
      res.status(400).json({ message: errorMessage });
    else {
      groupModel.findOne({ where: { id: req.params.groupId } })
        .then((matchingGroup) => {
          if (matchingGroup) {
            groupModel.destroy({ where: { id: req.params.groupId } })
              .then(() => {
                res.status(200)
                  .json({ message: 'Group deleted successfully!' });
              }).catch((err) => {
                res.status(500).json({ message: err.message });
              });
          } else {
            res.status(404).json({ message: 'Specified group does not exist' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

}

export default GroupController;
