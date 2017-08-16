import db from '../models/index';
import message from '../models/message';
import groupMember from '../models/membership';
// import notification from '../models/notification';
import Validator from '../controllers/validator';

const sequelize = db.sequelize;
let errorMessage;
let messageModelInstance;
let membershipModelInstance;
// let notificationModelInstance;

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
    this.message = message(sequelize);
    this.membership = groupMember(sequelize);
    // this.notification = notification(sequelize);
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
      membershipModelInstance.findOne({
        where: { groupId: req.params.groupId,
          memberId: req.session.user.id } })
        .then((membership) => {
          if (membership) {
            messageModelInstance.sync().then(() => {
              messageModelInstance.create({
                groupId: req.params.groupId,
                senderId: req.session.user.id,
                content: req.body.content
              }).then((newMessage) => {
                res.status(201)
                  .json({ message: 'Message posted to group successfully!',
                    'new message': newMessage });
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
    }
  }
  //
  // /**
  //  * @description: Checks if current user can post to a group
  //  * @param {String} testGroupId
  //  * @param {String} testUserId
  //  * @return {Boolean} true/false
  //  */
  // isMember(testGroupId, testUserId) {
  //   errorMessage = '';
  //   this.groupMember.findOne({
  //     where: { groupId: testGroupId, memberId: testUserId }
  //   })
  //     .then((memberships) => {
  //       if (memberships.length > 0)
  //         return true;
  //       errorMessage = `${errorMessage} You do not belong to this group!`;
  //       return false;
  //     });
  // }
  //
  // /**
  //  * @description: Checks if current user is sender of a message
  //  * @param {String} testMessageId
  //  * @param {String} testUserId
  //  * @return {Boolean} true/false
  //  */
  // isSender(testMessageId, testUserId) {
  //   errorMessage = '';
  //   this.message.findOne({
  //     where: { messageId: testMessageId, senderId: testUserId }
  //   })
  //     .then((matchingMessages) => {
  //       if (matchingMessages.length > 0)
  //         return true;
  //       errorMessage = `${errorMessage} The message was not posted by you!`;
  //       return false;
  //     });
  // }

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
      membershipModelInstance.findOne({
        where: { groupId: req.params.groupId,
          memberId: req.session.user.id } })
        .then((membership) => {
          if (membership) {
            messageModelInstance
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
      membershipModelInstance.findOne({
        where: { groupId: req.params.groupId,
          memberId: req.session.user.id } })
        .then((membership) => {
          if (membership) {
            messageModelInstance
              .findAll({ where: { groupId: req.params.groupId,
                id: req.params.messageId,
                senderId: req.session.user.id } })
              .then((messages) => {
                if (messages) {
                  messageModelInstance
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
