'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var errorMessage = void 0;

/**
 * @description: Defines controller for manipulating 'message' model
 * @class
 */

var MessageController = function () {
  /**
   * @description: Initializes instance with necessary database models
   * as a local properties
   * @constructor
   */
  function MessageController() {
    _classCallCheck(this, MessageController);

    this.group = _index2.default.Group;
    this.message = _index2.default.Message;
    this.user = _index2.default.User;
    this.membership = _index2.default.Membership;
    this.notification = _index2.default.Notification;
  }

  /**
   * @description: Posts a message from current user to a specified group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} newMessage
   */


  _createClass(MessageController, [{
    key: 'postMessageToGroup',
    value: function postMessageToGroup(req, res) {
      var _this = this;

      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Content', req.body.content)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        // Check if the specified group ID is valid
        this.group.findById(req.params.groupId).then(function (matchingGroup) {
          if (matchingGroup) {
            _this.membership.findOne({
              where: {
                groupId: req.params.groupId,
                memberId: req.session.user.id
              }
            }).then(function (membership) {
              if (membership) {
                _this.message.sync().then(function () {
                  _this.message.create({
                    groupId: req.params.groupId,
                    senderId: req.session.user.id,
                    content: req.body.content
                  }).then(function (newMessage) {
                    return _this.sendNotifications(req, res, newMessage);
                  }).catch(function (err) {
                    res.status(500).json({ message: err.message });
                  });
                });
              } else {
                res.status(403).json({ message: 'You do not belong to this group!' });
              }
            }).catch(function (err) {
              res.status(500).json({ message: err.message });
            });
          } else {
            res.status(404).json({ message: 'Specified group does not exist!' });
          }
        }).catch(function (err) {
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

  }, {
    key: 'sendNotifications',
    value: function sendNotifications(req, res, postedMessage) {
      var _this2 = this;

      this.membership.findAll({
        where: {
          groupId: req.params.groupId,
          memberId: { $ne: req.session.user.id }
        }
      }).then(function (memberships) {
        if (memberships) {
          var notificationsList = [];
          var notificationItem = void 0;
          memberships.forEach(function (membership) {
            notificationItem = {
              messageId: postedMessage.id,
              recipientId: membership.memberId,
              notificationType: 'in-app',
              status: 'unread'
            };
            notificationsList.push(notificationItem);
          });
          _this2.notification.sync().then(function () {
            _this2.notification.bulkCreate(notificationsList).then(function () {
              res.status(201).json({
                message: 'Message posted to group successfully!',
                'Posted Message': postedMessage,
                recipients: notificationsList.length
              });
            }).catch(function (err) {
              res.status(500).json({ message: err.message });
            });
          });
        }
      }).catch(function (err) {
        res.status(500).json({ message: err.message });
      });
    }

    /**
     * @description: Fetches all messages for a specified group
     * @param {Object} req
     * @param {Object} res
     * @return {Object} messages
     */

  }, {
    key: 'getMessagesFromGroup',
    value: function getMessagesFromGroup(req, res) {
      var _this3 = this;

      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        // Check if the specified group ID is valid
        this.group.findById(req.params.groupId).then(function (matchingGroup) {
          if (!matchingGroup) {
            res.status(404).json({ message: 'Specified group does not exist!' });
          } else {
            // Check if the current user is a member of this group
            _this3.membership.findOne({
              where: {
                groupId: req.params.groupId,
                memberId: req.session.user.id
              }
            }).then(function (membership) {
              if (membership) {
                _this3.message.findAll({
                  attributes: ['id', 'content', 'priority', 'createdAt'],
                  where: { groupId: req.params.groupId },
                  include: [{
                    model: _this3.user,
                    as: 'sender',
                    attributes: ['id', 'username', 'email']
                  }]
                }).then(function (messages) {
                  res.status(200).json({ Messages: messages });
                }).catch(function (err) {
                  res.status(500).json({ message: err.message });
                });
              } else {
                res.status(403).json({ message: 'You do not belong to this group!' });
              }
            }).catch(function (err) {
              res.status(500).json({ message: err.message });
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

  }, {
    key: 'updatePostedMessage',
    value: function updatePostedMessage(req, res) {
      var _this4 = this;

      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Message ID', req.params.messageId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Content', req.body.content)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        // Check if the specified group ID is valid
        this.group.findById(req.params.groupId).then(function (matchingGroup) {
          if (!matchingGroup) {
            res.status(404).json({ message: 'Specified group does not exist!' });
          } else {
            // Check if the specified message ID is valid
            _this4.message.findById(req.params.messageId).then(function (matchingMessage) {
              if (!matchingMessage) {
                res.status(404).json({ message: 'Specified message does not exist!' });
              } else {
                // Check if the current user belongs to the specified group
                _this4.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: req.session.user.id
                  }
                }).then(function (membership) {
                  if (membership) {
                    /* Allow the current user modify the message only if
                    he is the original sender */
                    _this4.message.findOne({
                      where: {
                        groupId: req.params.groupId,
                        id: req.params.messageId,
                        senderId: req.session.user.id
                      }
                    }).then(function (message) {
                      if (message) {
                        _this4.message.update({ content: req.body.content }, {
                          where: { id: req.params.messageId },
                          returning: true,
                          plain: true
                        }).then(function (updatedMessage) {
                          res.status(200).json({
                            message: 'Message updated successfully!',
                            'Updated Message': _validator2.default.trimFields(updatedMessage)
                          });
                        });
                      } else {
                        res.status(403).json({
                          message: 'You are not the sender of this message!'
                        });
                      }
                    }).catch(function (err) {
                      res.status(500).json({ message: err.message });
                    });
                  } else {
                    res.status(403).json({ message: 'You do not belong to this group!' });
                  }
                }).catch(function (err) {
                  res.status(500).json({ message: err.message });
                });
              }
            }).catch(function (err) {
              res.status(500).json({ message: err.message });
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

  }, {
    key: 'deletePostedMessage',
    value: function deletePostedMessage(req, res) {
      var _this5 = this;

      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Message ID', req.params.messageId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        // Check if the specified group ID is valid
        this.group.findById(req.params.groupId).then(function (matchingGroup) {
          if (!matchingGroup) {
            res.status(404).json({ message: 'Specified group does not exist!' });
          } else {
            // Check if the specified message ID is valid
            _this5.message.findById(req.params.messageId).then(function (matchingMessage) {
              if (!matchingMessage) {
                res.status(404).json({ message: 'Specified message does not exist!' });
              } else {
                // Check if the current user belongs to the specified group
                _this5.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: req.session.user.id
                  }
                }).then(function (membership) {
                  if (membership) {
                    /* Allow the current user delete the message only if
                    he is the original sender */
                    _this5.message.findOne({
                      where: {
                        groupId: req.params.groupId,
                        id: req.params.messageId,
                        senderId: req.session.user.id
                      }
                    }).then(function (originalMessage) {
                      if (originalMessage) {
                        _this5.message.destroy({ where: { id: req.params.messageId } }).then(function () {
                          res.status(200).json({
                            message: 'Message deleted successfully!'
                          });
                        });
                      } else {
                        res.status(403).json({
                          message: 'You are not the sender of this message!'
                        });
                      }
                    }).catch(function (err) {
                      res.status(500).json({ message: err.message });
                    });
                  } else {
                    res.status(403).json({ message: 'You do not belong to this group!' });
                  }
                }).catch(function (err) {
                  res.status(500).json({ message: err.message });
                });
              }
            });
          }
        });
      }
    }
  }]);

  return MessageController;
}();

exports.default = MessageController;