import db from '../models/index';
import Validator from '../helpers/validator';

let errorMessage;

/**
 * @description: Defines controller for manipulating 'group' model
 * @class
 */
class GroupController {
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
   * @description: Creates a new group and adds creator as member
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} newGroup
   */
  async createGroup(req, res) {
    errorMessage = Validator.checkEmpty([
      { Title: req.body.title },
      { Purpose: req.body.purpose }
    ]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    }
    try {
      // Check if supplied group title is already in use
      const matchingGroup = await this.group
        .findOne({ where: { title: req.body.title } });
      if (matchingGroup) {
        return res.status(409)
        .json({ message: 'Group Title is already taken!' });
      }
      // Create the new group with the title, purpose and creator ID
      await this.group.sync();
      const newGroup = await this.group.create({
        title: req.body.title,
        purpose: req.body.purpose,
        creatorId: req.session.user.id
      });
      // Add the creator as the first member of the group
      await this.membership.sync();
      await this.membership.create({
        userRole: 'admin',
        groupId: newGroup.id,
        memberId: req.session.user.id
      });
      res.status(201).json({
        message: 'Group created successfully!',
        group: Validator.trimFields(newGroup)
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Fetches all available groups
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} allGroups
   */
  async getAllGroups(req, res) {
    try {
      const allGroups = await this.group.findAll({
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
      });
      res.status(200).json({ 'Available groups': allGroups });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Fetches a group matching specified groupKey
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} matchingGroup
   */
  async getGroupByKey(req, res) {
    errorMessage = Validator.checkEmpty([{ 'Group ID': req.params.groupId }]);
    if (errorMessage.trim() !== '') {
      return res.status(400).json({ message: errorMessage });
    }
    try {
      const matchingGroup = await this.group.findOne({
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
      });
      if (!matchingGroup) {
        return res.status(404)
        .json({ message: 'Requested group does not exist!' });
      }
      res.status(200).json({ 'Requested group': matchingGroup });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Deletes a group matching specified groupKey
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} null
   */
  async deleteGroup(req, res) {
    errorMessage = Validator.checkEmpty([{ 'Group ID': req.params.groupId }]);
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
      /* Allow the current user delete the group only if he is
      the original creator */
      if (matchingGroup.creatorId === req.session.user.id) {
        await this.group.destroy({ where: { id: req.params.groupId } });
        return res.status(200).json({ message: 'Group deleted successfully!' });
      }
      res.status(403)
        .json({ message: 'You do not have the right to delete this group!' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

}

export default GroupController;
