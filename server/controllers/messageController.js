import db from '../models/index';
import message from '../models/message';
import groupMember from '../models/groupmember';
import Validator from '../controllers/validator';

const sequelize = db.sequelize;
let errorMessage;

/**
 * @description: Defines controller for manipulating 'message' model
 * @class
 */
class MessageController {
  /**
   * @description: Initializes instance with 'message' as local property
   * @constructor
   */
  constructor() {
    this.message = message(sequelize);
    this.groupMember = groupMember(sequelize);
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
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('Content', req.body.content))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else if (!this.isMember(req.params.groupId, req.session.user.userId))
      res.status(403).json({ message: errorMessage });
    else {
      return this.message.sync().then(() => {
        this.message.create({
          groupId: req.params.groupId,
          senderId: req.session.user.userId,
          content: req.body.content
        }).then((newMessage) => {
          res.status(201).json(newMessage);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack);
          res.status(500).json({ message: err.message });
        });
      });
    }
  }

  /**
   * @description: Checks if current user can post to a group
   * @param {String} testGroupId
   * @param {String} testUserId
   * @return {Boolean} true/false
   */
  isMember(testGroupId, testUserId) {
    errorMessage = '';
    this.groupMember.findOne({
      where: { groupId: testGroupId, memberId: testUserId }
    })
      .then((memberships) => {
        if (memberships.length > 0)
          return true;
        errorMessage = `${errorMessage}\n - You do not belong to this group!`;
        return false;
      });
  }

  /**
   * @description: Checks if current user is sender of a message
   * @param {String} testMessageId
   * @param {String} testUserId
   * @return {Boolean} true/false
   */
  isSender(testMessageId, testUserId) {
    errorMessage = '';
    this.message.findOne({
      where: { messageId: testMessageId, senderId: testUserId }
    })
      .then((matchingMessages) => {
        if (matchingMessages.length > 0)
          return true;
        errorMessage = `${errorMessage}\n - The message was not posted by you!`;
        return false;
      });
  }

  /**
   * @description: Fetches all messages in a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} matchingMessages
   */
  getMessagesFromGroup(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else {
      this.message.findAll({ where: { groupId: req.params.groupId } })
        .then((matchingMessages) => {
          res.status(200).json(matchingMessages);
        }).catch((err) => {
          // throw new Error(err);
          console.error(err.stack)
          res.status(500).json({ message: err.message });
        });
    }
  }

  /**
   * @description: Deletes a specified message from a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} deletedMessage
   */
  deletePostedMessage(req, res) {
    errorMessage = '';
    if (Validator.isEmpty('Group ID', req.params.groupId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;
    if (Validator.isEmpty('Message ID', req.params.userId))
      errorMessage = `${errorMessage}\n - ${Validator.validationMessage}`;

    if (errorMessage.trim() !== '')
      res.status(400).json({ message: errorMessage });
    else if (!this.isSender(req.params.messageId, req.session.user.userId))
      res.status(403).json({ message: errorMessage });
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

export default MessageController;
