import db from '../models/index';
import Validator from '../helpers/validator';
// import NotificationController from './notificationController';

let errorMessage;

/**
 * @description: Defines controller for manipulating 'message' model
 * @class
 */
class MessageController {
  /**
   * @description: Initializes instance with necessary database models
   * as a local properties
   * @constructor
   */
  constructor() {
    this.group = db.Group;
    this.message = db.Message;
    this.user = db.User;
    this.membership = db.Membership;
    this.notification = db.Notification;
    // this.notificationController = new NotificationController();
  }

  /**
   * @description: Posts a message from current user to a specified group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} newMessage
   */
  async postMessageToGroup(req, res) {
    errorMessage = Validator.checkEmpty([
      { 'Group ID': req.params.groupId },
      { Content: req.body.content }
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
      // Check if the user belongs to this group
      const membership = await this.membership.findOne({
        where: {
          groupId: req.params.groupId,
          memberId: req.session.user.id
        }
      });
      if (!membership) {
        return res.status(403)
          .json({ message: 'You do not belong to this group!' });
      }
      // Check if there are members in the group, other than the sender
      const recipients = await this.membership.findAll({
        where: {
          groupId: req.params.groupId,
          memberId: { $ne: req.session.user.id }
        }
      });
      if (!recipients) {
        return res.status(403).json({
          message: 'Please add members to the group first!'
        });
      }
      // Post the message centrally to the group
      await this.message.sync();
      const newMessage = await this.message.create({
        groupId: req.params.groupId,
        senderId: req.session.user.id,
        content: req.body.content
      });
      //  Send notifications to all other group members about the new message
      return await this.sendNotifications(req, res, newMessage, recipients);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Creates a message notification for each group member
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @param {Object} postedMessage newly posted message for the group
   * @param {Object} groupMembers list of recipients of the new message
   * @return {Object} newNotification
   */
  async sendNotifications(req, res, postedMessage, groupMembers) {
    try {
      // Build a list of notifications, one for each recipient
      const notificationsList = [];
      let notificationItem;
      groupMembers.forEach((groupMember) => {
        notificationItem = {
          messageId: postedMessage.id,
          recipientId: groupMember.memberId,
          notificationType: 'in-app',
          status: 'unread'
        };
        notificationsList.push(notificationItem);
      });
      await this.notification.sync();
      await this.notification.bulkCreate(notificationsList);
      return res.status(201).json({
        message: 'Message posted to group successfully!',
        'Posted Message': postedMessage,
        recipients: notificationsList.length
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Fetches all messages for a specified group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} messages
   */
  async getMessagesFromGroup(req, res) {
    errorMessage = Validator.checkEmpty([
      { 'Group ID': req.params.groupId }
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
      // Check if the current user is a member of this group
      const membership = await this.membership.findOne({
        where: { groupId: req.params.groupId, memberId: req.session.user.id }
      });
      if (!membership) {
        return res.status(403)
        .json({ message: 'You do not belong to this group!' });
      }
      const messages = this.message.findAll({
        attributes: ['id', 'content', 'priority', 'createdAt'],
        where: { groupId: req.params.groupId },
        include: [{
          model: this.user,
          as: 'sender',
          attributes: ['id', 'username', 'email']
        }]
      });
      return res.status(200).json({ Messages: messages });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Updates a specified message previously sent to a group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} null
   */
  async updatePostedMessage(req, res) {
    errorMessage = Validator.checkEmpty([
      { 'Group ID': req.params.groupId },
      { 'Message ID': req.params.messageId },
      { Content: req.body.content }
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
      // Check if the specified message ID is valid
      const matchingMessage = await this.message
        .findById(req.params.messageId);
      if (!matchingMessage) {
        return res.status(404)
          .json({ message: 'Specified message does not exist!' });
      }
      // Check if the current user belongs to the specified group
      const membership = await this.membership.findOne({
        where: { groupId: req.params.groupId, memberId: req.session.user.id }
      });
      if (!membership) {
        return res.status(403)
          .json({ message: 'You do not belong to this group!' });
      }
      /* Allow the current user modify the message only if
      he is the original sender */
      const message = await this.message.findOne({
        where: {
          groupId: req.params.groupId,
          id: req.params.messageId,
          senderId: req.session.user.id
        }
      });
      if (!message) {
        return res.status(403).json({
          message: 'You are not the sender of this message!'
        });
      }
      const updatedMessage = await this.message
      .update({ content: req.body.content },
        {
          where: { id: req.params.messageId },
          returning: true,
          plain: true
        });
      return res.status(200).json({
        message: 'Message updated successfully!',
        'Updated Message': updatedMessage
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * @description: Deletes a specified message from a group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} null
   */
  async deletePostedMessage(req, res) {
    errorMessage = Validator.checkEmpty([
      { 'Group ID': req.params.groupId },
      { 'Message ID': req.params.messageId }
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
      // Check if the specified message ID is valid
      const matchingMessage = await this.message.findById(req.params.messageId);
      if (!matchingMessage) {
        return res.status(404)
          .json({ message: 'Specified message does not exist!' });
      }
      // Check if the current user belongs to the specified group
      const membership = await this.membership.findOne({
        where: {
          groupId: req.params.groupId,
          memberId: req.session.user.id
        }
      });
      if (!membership) {
        return res.status(403)
        .json({ message: 'You do not belong to this group!' });
      }
      /* Allow the current user delete the message only if
      he is the original sender */
      const originalMessage = await this.message.findOne({
        where: {
          groupId: req.params.groupId,
          id: req.params.messageId,
          senderId: req.session.user.id
        }
      });
      if (!originalMessage) {
        return res.status(403)
        .json({ message: 'You are not the sender of this message!' });
      }
      await this.message.destroy({ where: { id: req.params.messageId } });
      return res.status(200)
        .json({ message: 'Message deleted successfully!' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

}

export default MessageController;
