import db from '../models/index';
import Validator from './validator';

const groupModel = db.Group;
const membershipModel = db.Membership;
const messageModel = db.Message;
const notificationModel = db.Notification;
let errorMessage;

/**
 * @description: Defines controller for manipulating 'message' model
 * @class
 */
class MessageController {
  /**
   * @description: Initializes instance with 'message', 'membership' and
   * 'notification' as local properties
   * @constructor
   */
  constructor() {
    this.group = groupModel;
    this.membership = membershipModel;
    this.message = messageModel;
  }

  /**
   * @description: Posts a message from current user to a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} newMessage
   */
  postMessageToGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('Content', req.body.content))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      groupModel.findById(req.params.groupId).then((matchingGroup) => {
        if (matchingGroup) {
          membershipModel.findOne({
            where: {
              groupId: req.params.groupId,
              memberId: req.session.user.id
            }
          })
            .then((membership) => {
              if (membership) {
                messageModel.sync().then(() => {
                  messageModel.create({
                    groupId: req.params.groupId,
                    senderId: req.session.user.id,
                    content: req.body.content
                  }).then((newMessage) => {
                    return this.sendNotifications(req, res, newMessage);
                    // res.status(201).json({
                    //   message: 'Message posted to group successfully!',
                    //   'posted message': newMessage
                    // });
                  }).catch((err) => {
                    res.status(500).json({ message: err.message });
                  });
                });
              } else {
                res.status(403)
                  .json({ message: 'You do not belong to this group!' });
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
   * @description: Creates a notification for each group member
   * @param {Object} req
   * @param {Object} res
   * @param {Object} postedMessage newly posted message for the group
   * @return {Object} newNotification
   */
  sendNotifications(req, res, postedMessage) {
    membershipModel.findAll({
      where: {
        groupId: req.params.groupId,
        memberId: { $ne: req.session.user.id }
      }
    })
      .then((memberships) => {
        if (memberships) {
          const notificationsList = [];
          let notificationItem;
          for (let i = 0; i < memberships.length; i += 1) {
            notificationItem = {
              messageId: postedMessage.id,
              recipientId: memberships[i].memberId,
              notificationType: 'in-app',
              status: 'unread'
            }
            notificationsList.push(notificationItem);
          }
          notificationModel.sync().then(() => {
            notificationModel
              .bulkCreate(notificationsList)
              .then(() => {
                res.status(201).json({
                  message: 'Message posted to group successfully!',
                  'posted message': postedMessage,
                  recipients: notificationsList.length
                });
              }).catch((err) => {
                res.status(500).json({ message: err.message });
              });
          });
        }
      }).catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }

  /**
   * @description: Fetches all messages in a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} messages
   */
  getMessagesFromGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      membershipModel.findOne({
        where: { groupId: req.params.groupId,
          memberId: req.session.user.id } })
        .then((membership) => {
          if (membership) {
            messageModel
              .findAll({ where: { groupId: req.params.groupId } })
              .then((messages) => {
                res.status(200).json({ Messages: messages });
              }).catch((err) => {
                res.status(500).json({ message: err.message });
              });
          } else {
            res.status(403)
              .json({ message: 'You do not belong to this group!' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

  /**
   * @description: Updates a specified message previously sent to a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} null
   */
  updatePostedMessage(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('Message ID', req.params.messageId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('Content', req.body.content))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      membershipModel.findOne({
        where: { groupId: req.params.groupId,
          memberId: req.session.user.id } })
        .then((membership) => {
          if (membership) {
            messageModel
              .findOne({ where: { groupId: req.params.groupId,
                id: req.params.messageId,
                senderId: req.session.user.id } })
              .then((message) => {
                if (message) {
                  messageModel
                    .update({ content: req.body.content },
                    { where: { id: req.params.messageId },
                      returning: true,
                      plain: true
                    })
                    .then((result) => {
                      res.status(200)
                        .json({
                          message: 'Message updated successfully!',
                          'Updated Message': result[1]
                        });
                    });
                } else {
                  res.status(403)
                    .json({ message:
                      'You are not the sender of this message!' });
                }
              }).catch((err) => {
                res.status(500).json({ message: err.message });
              });
          } else {
            res.status(403)
              .json({ message: 'You do not belong to this group!' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

  /**
   * @description: Deletes a specified message from a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} null
   */
  deletePostedMessage(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;
    if (Validator.isEmpty('Message ID', req.params.messageId))
      errorMessage = `${errorMessage} ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      membershipModel.findOne({
        where: { groupId: req.params.groupId,
          memberId: req.session.user.id } })
        .then((membership) => {
          if (membership) {
            messageModel
              .findAll({ where: { groupId: req.params.groupId,
                id: req.params.messageId,
                senderId: req.session.user.id } })
              .then((messages) => {
                if (messages) {
                  messageModel
                    .destroy({ where: { id: req.params.messageId } })
                    .then(() => {
                      res.status(200)
                        .json({ message: 'Message deleted successfully!' });
                    });
                } else {
                  res.status(403)
                    .json({ message:
                      'You are not the sender of this message!' });
                }
              }).catch((err) => {
                res.status(500).json({ message: err.message });
              });
          } else {
            res.status(403)
              .json({ message: 'You do not belong to this group!' });
          }
        }).catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  }

}

export default MessageController;
