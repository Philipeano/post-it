import db from '../models/index';
import group from '../models/group';
import MembershipController from './membershipController';
import Validator from '../controllers/validator';

const sequelize = db.sequelize;
const membershipController = new MembershipController();
let errorMessage;

/**
 * @description: Defines controller for manipulating 'group' model
 * @class
 */
class GroupController {
  /**
   * @description: Initializes instance with 'group' model as local property
   * @constructor
   */
  constructor() {
    this.group = group(sequelize);
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
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('Purpose', req.body.purpose))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else if (this.isDuplicate(req.body.title))
      res.status(409).json({ message: 'Group Title is already taken!' });
    else {
      return this.group.sync().then(() => {
        this.group.create({
          title: req.body.title,
          purpose: req.body.purpose,
          creatorId: req.session.userId
        }).then((newGroup) => {
          membershipController.addDefaultMemberToGroup(groupId, userId);
          res.status(201).json(newGroup);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
          res.status(500).json({ message: err.message });
        });
      });
    }
  }

  /**
   * @description: Checks if supplied group title already exists
   * @param {String} testTitle
   * @return {Boolean} true/false
   */
  isDuplicate(testTitle) {
    errorMessage = '';
    this.group.findOne({ where: { title: testTitle } })
      .then((matchingGroups) => {
        if (matchingGroups.length > 0)
          errorMessage = `${errorMessage}\n - Group Title is already taken!`;
      });
    if (errorMessage.trim() === '')
      return false;
    console.log(errorMessage);
    return true;
  }

  /**
   * @description: Fetches all available groups
   * @param {Object} req
   * @param {Object} res
   * @return {Object} allGroups
   */
  getAllGroups(req, res) {
    this.group.findAll().then((allGroups) => {
      res.status(200).json(allGroups);
    }).catch((err) => {
      // throw new Error(err);
      console.error(err.stack)
      res.status(500).json({ message: err.message });
    });
  }

  /**
   * @description: Fetches all groups matching specified groupKey
   * @param {Object} req
   * @param {Object} res
   * @return {Object} matchingGroup
   */
  getGroupByKey(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.group.findOne({ where: { groupId: req.params.groupId } })
        .then((matchingGroup) => {
          res.status(200).json(matchingGroup);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
          res.status(500).json({ message: err.message });
        });
    }
  }

  /**
   * @description: Deletes a group matching specified groupKey
   * @param {Object} req
   * @param {Object} res
   * @return {Object} deletedGroup
   */
  deleteGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.group.destroy({ where: { groupId: req.params.groupId } })
        .then((matchingGroup) => {
          res.status(200).json(matchingGroup);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
          res.status(500).json({ message: err.message });
        });
    }
  }

}

export default GroupController;
