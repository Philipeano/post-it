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

// const db.Group = db.Group;
// const db.Membership = db.Membership;
// const db.Message = db.Message;
// const db.Notification = db.Notification;
var errorMessage = void 0;

/**
 * @description: Defines controller for manipulating 'message' model
 * @class
 */

var MessageController = function () {
  /**
   * @description: Initializes instance with 'message', 'membership' and
   * 'notification' as local properties
   * @constructor
   */
  function MessageController() {
    _classCallCheck(this, MessageController);

    this.group = _index2.default.Group;
    this.membership = _index2.default.Membership;
    this.message = _index2.default.Message;
  }

  /**
   * @description: Posts a message from current user to a group
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
        _index2.default.Group.findById(req.params.groupId).then(function (matchingGroup) {
          if (matchingGroup) {
            _index2.default.Membership.findOne({
              where: {
                groupId: req.params.groupId,
                memberId: req.session.user.id
              }
            }).then(function (membership) {
              if (membership) {
                _index2.default.Message.sync().then(function () {
                  _index2.default.Message.create({
                    groupId: req.params.groupId,
                    senderId: req.session.user.id,
                    content: req.body.content
                  }).then(function (newMessage) {
                    return _this.sendNotifications(req, res, newMessage);
                    // res.status(201).json({
                    //   message: 'Message posted to group successfully!',
                    //   'posted message': newMessage
                    // });
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
     * @description: Creates a notification for each group member
     * @param {Object} req
     * @param {Object} res
     * @param {Object} postedMessage newly posted message for the group
     * @return {Object} newNotification
     */

  }, {
    key: 'sendNotifications',
    value: function sendNotifications(req, res, postedMessage) {
      _index2.default.Membership.findAll({
        where: {
          groupId: req.params.groupId,
          memberId: { $ne: req.session.user.id }
        }
      }).then(function (memberships) {
        if (memberships) {
          var notificationsList = [];
          var notificationItem = void 0;
          for (var i = 0; i < memberships.length; i += 1) {
            notificationItem = {
              messageId: postedMessage.id,
              recipientId: memberships[i].memberId,
              notificationType: 'in-app',
              status: 'unread'
            };
            notificationsList.push(notificationItem);
          }
          _index2.default.Notification.sync().then(function () {
            _index2.default.Notification.bulkCreate(notificationsList).then(function () {
              res.status(201).json({
                message: 'Message posted to group successfully!',
                'posted message': postedMessage,
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
     * @description: Fetches all messages in a group
     * @param {Object} req
     * @param {Object} res
     * @return {Object} messages
     */

  }, {
    key: 'getMessagesFromGroup',
    value: function getMessagesFromGroup(req, res) {
      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        _index2.default.Membership.findOne({
          where: { groupId: req.params.groupId,
            memberId: req.session.user.id } }).then(function (membership) {
          if (membership) {
            _index2.default.Message.findAll({ where: { groupId: req.params.groupId } }).then(function (messages) {
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
      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Message ID', req.params.messageId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Content', req.body.content)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        _index2.default.Membership.findOne({
          where: { groupId: req.params.groupId,
            memberId: req.session.user.id } }).then(function (membership) {
          if (membership) {
            _index2.default.Message.findOne({ where: { groupId: req.params.groupId,
                id: req.params.messageId,
                senderId: req.session.user.id } }).then(function (message) {
              if (message) {
                _index2.default.Message.update({ content: req.body.content }, { where: { id: req.params.messageId },
                  returning: true,
                  plain: true
                }).then(function (result) {
                  res.status(200).json({
                    message: 'Message updated successfully!',
                    'Updated Message': result[1]
                  });
                });
              } else {
                res.status(403).json({ message: 'You are not the sender of this message!' });
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
      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Message ID', req.params.messageId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        _index2.default.Membership.findOne({
          where: { groupId: req.params.groupId,
            memberId: req.session.user.id } }).then(function (membership) {
          if (membership) {
            _index2.default.Message.findAll({ where: { groupId: req.params.groupId,
                id: req.params.messageId,
                senderId: req.session.user.id } }).then(function (messages) {
              if (messages) {
                _index2.default.Message.destroy({ where: { id: req.params.messageId } }).then(function () {
                  res.status(200).json({ message: 'Message deleted successfully!' });
                });
              } else {
                res.status(403).json({ message: 'You are not the sender of this message!' });
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
    }
  }]);

  return MessageController;
}();

exports.default = MessageController;