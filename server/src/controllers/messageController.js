import db from '../models/index';
import Validator from './validator';

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
  }

  /**
   * @description: Posts a message from current user to a specified group
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
      // Check if the specified group ID is valid
      this.group.findById(req.params.groupId).then((matchingGroup) => {
        if (matchingGroup) {
          this.membership.findOne({
            where: {
              groupId: req.params.groupId,
              memberId: req.session.user.id
            }
          })
            .then((membership) => {
              if (membership) {
                this.message.sync().then(() => {
                  this.message.create({
                    groupId: req.params.groupId,
                    senderId: req.session.user.id,
                    content: req.body.content
                  }).then((newMessage) => {
                    return this.sendNotifications(req, res, newMessage);
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
   * @description: Creates a message notification for each group member
   * @param {Object} req
   * @param {Object} res
   * @param {Object} postedMessage newly posted message for the group
   * @return {Object} newNotification
   */
  sendNotifications(req, res, postedMessage) {
    this.membership.findAll({
      where: {
        groupId: req.params.groupId,
        memberId: { $ne: req.session.user.id }
      }
    })
      .then((memberships) => {
        if (memberships) {
          const notificationsList = [];
          let notificationItem;
          memberships.forEach((membership) => {
            notificationItem = {
              messageId: postedMessage.id,
              recipientId: membership.memberId,
              notificationType: 'in-app',
              status: 'unread'
            }
            notificationsList.push(notificationItem);
          });
          this.notification.sync().then(() => {
            this.notification
              .bulkCreate(notificationsList)
              .then(() => {
                res.status(201).json({
                  message: 'Message posted to group successfully!',
                  'Posted Message': postedMessage,
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
   * @description: Fetches all messages for a specified group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} messages
   */
  getMessagesFromGroup(req, res) {
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
          // Check if the current user is a member of this group
          this.membership.findOne({
            where: {
              groupId: req.params.groupId,
              memberId: req.session.user.id
            }
          })
            .then((membership) => {
              if (membership) {
                this.message
                  .findAll({
                    attributes: ['id', 'content', 'priority', 'createdAt'],
                    where: {groupId: req.params.groupId},
                    include: [{
                      model: this.user,
                      as: 'sender',
                      attributes: ['id', 'username', 'email']
                    }]
                  })
                  .then((messages) => {
                    res.status(200).json({Messages: messages});
                  }).catch((err) => {
                    res.status(500).json({message: err.message});
                  });
              } else {
                res.status(403)
                  .json({message: 'You do not belong to this group!'});
              }
            }).catch((err) => {
              res.status(500).json({message: err.message});
            });
        }
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
      res.status(400).json({message: errorMessage});
    else {
      // Check if the specified group ID is valid
      this.group.findById(req.params.groupId).then((matchingGroup) => {
        if (!matchingGroup) {
          res.status(404)
            .json({message: 'Specified group does not exist!'});
        } else {
          // Check if the specified message ID is valid
          this.message.findById(req.params.messageId)
            .then((matchingMessage) => {
              if (!matchingMessage) {
                res.status(404)
                  .json({message: 'Specified message does not exist!'});
              } else {
                // Check if the current user belongs to the specified group
                this.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: req.session.user.id
                  }
                })
                  .then((membership) => {
                    if (membership) {
                      /* Allow the current user modify the message only if
                      he is the original sender */
                      this.message
                        .findOne({
                          where: {
                            groupId: req.params.groupId,
                            id: req.params.messageId,
                            senderId: req.session.user.id
                          }
                        })
                        .then((message) => {
                          if (message) {
                            this.message
                              .update({content: req.body.content},
                              {
                                where: {id: req.params.messageId},
                                returning: true,
                                plain: true
                              })
                              .then((updatedMessage) => {
                                res.status(200)
                                  .json({
                                    message: 'Message updated successfully!',
                                    'Updated Message': updatedMessage
                                    // 'Updated Message': Validator
                                    //   .trimFields(updatedMessage)
                                  });
                              });
                          } else {
                            res.status(403)
                              .json({
                                message:
                                  'You are not the sender of this message!'
                              });
                          }
                        }).catch((err) => {
                          res.status(500).json({message: err.message});
                        });
                    } else {
                      res.status(403)
                        .json({message: 'You do not belong to this group!'});
                    }
                  }).catch((err) => {
                    res.status(500).json({message: err.message});
                  });
              }
            }).catch((err) => {
              res.status(500).json({message: err.message});
            });
        }
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
      // Check if the specified group ID is valid
      this.group.findById(req.params.groupId).then((matchingGroup) => {
        if (!matchingGroup) {
          res.status(404)
            .json({message: 'Specified group does not exist!'});
        } else {
          // Check if the specified message ID is valid
          this.message.findById(req.params.messageId)
            .then((matchingMessage) => {
              if (!matchingMessage) {
                res.status(404)
                  .json({message: 'Specified message does not exist!'});
              } else {
                // Check if the current user belongs to the specified group
                this.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: req.session.user.id
                  }
                })
                  .then((membership) => {
                    if (membership) {
                      /* Allow the current user delete the message only if
                      he is the original sender */
                      this.message
                        .findOne({
                          where: {
                            groupId: req.params.groupId,
                            id: req.params.messageId,
                            senderId: req.session.user.id
                          }
                        })
                        .then((originalMessage) => {
                          if (originalMessage) {
                            this.message
                              .destroy({where: {id: req.params.messageId}})
                              .then(() => {
                                res.status(200)
                                  .json({
                                    message: 'Message deleted successfully!'
                                  });
                              });
                          } else {
                            res.status(403)
                              .json({
                                message:
                                  'You are not the sender of this message!'
                              });
                          }
                        }).catch((err) => {
                          res.status(500).json({message: err.message});
                        });
                    } else {
                      res.status(403)
                        .json({message: 'You do not belong to this group!'});
                    }
                  }).catch((err) => {
                    res.status(500).json({message: err.message});
                  });
              }
            });
        }
      });
    }
  }

}

export default MessageController;
