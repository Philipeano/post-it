'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _validator = require('../helpers/validator');

var _validator2 = _interopRequireDefault(_validator);

var _auth = require('../helpers/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import NotificationController from './notificationController';

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
    // this.notificationController = new NotificationController();
  }

  /**
   * @description: Posts a message from current user to a specified group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} newMessage
   */


  _createClass(MessageController, [{
    key: 'postMessageToGroup',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
        var matchingGroup, membership, recipients, newMessage;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ 'Group ID': req.params.groupId }, { Content: req.body.content }]);

                if (!(errorMessage.trim() !== '')) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 3:
                _context.prev = 3;
                _context.next = 6;
                return this.group.findById(req.params.groupId);

              case 6:
                matchingGroup = _context.sent;

                if (matchingGroup) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return', res.status(404).json({ message: 'Specified group does not exist!' }));

              case 9:
                _context.next = 11;
                return this.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: _auth2.default.getUserIdFromRequest(req)
                  }
                });

              case 11:
                membership = _context.sent;

                if (membership) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt('return', res.status(403).json({ message: 'You do not belong to this group!' }));

              case 14:
                _context.next = 16;
                return this.membership.findAll({
                  where: {
                    groupId: req.params.groupId,
                    memberId: { $ne: _auth2.default.getUserIdFromRequest(req) }
                  }
                });

              case 16:
                recipients = _context.sent;

                if (recipients) {
                  _context.next = 19;
                  break;
                }

                return _context.abrupt('return', res.status(403).json({
                  message: 'Please add members to the group first!'
                }));

              case 19:
                _context.next = 21;
                return this.message.sync();

              case 21:
                _context.next = 23;
                return this.message.create({
                  groupId: req.params.groupId,
                  senderId: _auth2.default.getUserIdFromRequest(req),
                  content: req.body.content
                });

              case 23:
                newMessage = _context.sent;
                _context.next = 26;
                return this.sendNotifications(req, res, newMessage, recipients);

              case 26:
                _context.next = 31;
                break;

              case 28:
                _context.prev = 28;
                _context.t0 = _context['catch'](3);

                res.status(500).json({ message: _context.t0.message });

              case 31:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 28]]);
      }));

      function postMessageToGroup(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return postMessageToGroup;
    }()

    /**
     * @description: Creates a message notification for each group member
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @param {Object} postedMessage newly posted message for the group
     * @param {Object} groupMembers list of recipients of the new message
     * @return {Object} newNotification
     */

  }, {
    key: 'sendNotifications',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, postedMessage, groupMembers) {
        var notificationsList, notificationItem;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                // Build a list of notifications, one for each recipient
                notificationsList = [];
                notificationItem = void 0;

                groupMembers.forEach(function (groupMember) {
                  notificationItem = {
                    messageId: postedMessage.id,
                    recipientId: groupMember.memberId,
                    notificationType: 'in-app',
                    status: 'unread'
                  };
                  notificationsList.push(notificationItem);
                });
                _context2.next = 6;
                return this.notification.sync();

              case 6:
                _context2.next = 8;
                return this.notification.bulkCreate(notificationsList);

              case 8:
                res.status(201).json({
                  message: 'Message posted to group successfully!',
                  'Posted Message': postedMessage,
                  recipients: notificationsList.length
                });
                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2['catch'](0);

                res.status(500).json({ message: _context2.t0.message });

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 11]]);
      }));

      function sendNotifications(_x3, _x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return sendNotifications;
    }()

    /**
     * @description: Fetches all messages for a specified group
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} messages
     */

  }, {
    key: 'getMessagesFromGroup',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
        var matchingGroup, membership, messages;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ 'Group ID': req.params.groupId }]);

                if (!(errorMessage.trim() !== '')) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return this.group.findById(req.params.groupId);

              case 6:
                matchingGroup = _context3.sent;

                if (matchingGroup) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt('return', res.status(404).json({ message: 'Specified group does not exist!' }));

              case 9:
                _context3.next = 11;
                return this.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: _auth2.default.getUserIdFromRequest(req)
                  }
                });

              case 11:
                membership = _context3.sent;

                if (membership) {
                  _context3.next = 14;
                  break;
                }

                return _context3.abrupt('return', res.status(403).json({ message: 'You do not belong to this group!' }));

              case 14:
                messages = this.message.findAll({
                  attributes: ['id', 'content', 'priority', 'createdAt'],
                  where: { groupId: req.params.groupId },
                  include: [{
                    model: this.user,
                    as: 'sender',
                    attributes: ['id', 'username', 'email']
                  }]
                });

                res.status(200).json({ Messages: messages });
                _context3.next = 21;
                break;

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3['catch'](3);

                res.status(500).json({ message: _context3.t0.message });

              case 21:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 18]]);
      }));

      function getMessagesFromGroup(_x7, _x8) {
        return _ref3.apply(this, arguments);
      }

      return getMessagesFromGroup;
    }()

    /**
     * @description: Updates a specified message previously sent to a group
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} null
     */

  }, {
    key: 'updatePostedMessage',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res) {
        var matchingGroup, matchingMessage, membership, message, updatedMessage;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ 'Group ID': req.params.groupId }, { 'Message ID': req.params.messageId }, { Content: req.body.content }]);

                if (!(errorMessage.trim() !== '')) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 3:
                _context4.prev = 3;
                _context4.next = 6;
                return this.group.findById(req.params.groupId);

              case 6:
                matchingGroup = _context4.sent;

                if (matchingGroup) {
                  _context4.next = 9;
                  break;
                }

                return _context4.abrupt('return', res.status(404).json({ message: 'Specified group does not exist!' }));

              case 9:
                _context4.next = 11;
                return this.message.findById(req.params.messageId);

              case 11:
                matchingMessage = _context4.sent;

                if (matchingMessage) {
                  _context4.next = 14;
                  break;
                }

                return _context4.abrupt('return', res.status(404).json({ message: 'Specified message does not exist!' }));

              case 14:
                _context4.next = 16;
                return this.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: _auth2.default.getUserIdFromRequest(req)
                  }
                });

              case 16:
                membership = _context4.sent;

                if (membership) {
                  _context4.next = 19;
                  break;
                }

                return _context4.abrupt('return', res.status(403).json({ message: 'You do not belong to this group!' }));

              case 19:
                _context4.next = 21;
                return this.message.findOne({
                  where: {
                    groupId: req.params.groupId,
                    id: req.params.messageId,
                    senderId: _auth2.default.getUserIdFromRequest(req)
                  }
                });

              case 21:
                message = _context4.sent;

                if (message) {
                  _context4.next = 24;
                  break;
                }

                return _context4.abrupt('return', res.status(403).json({
                  message: 'You are not the sender of this message!'
                }));

              case 24:
                _context4.next = 26;
                return this.message.update({ content: req.body.content }, {
                  where: { id: req.params.messageId },
                  returning: true,
                  plain: true
                });

              case 26:
                updatedMessage = _context4.sent;

                res.status(200).json({
                  message: 'Message updated successfully!',
                  'Updated Message': updatedMessage
                });
                _context4.next = 33;
                break;

              case 30:
                _context4.prev = 30;
                _context4.t0 = _context4['catch'](3);

                res.status(500).json({ message: _context4.t0.message });

              case 33:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 30]]);
      }));

      function updatePostedMessage(_x9, _x10) {
        return _ref4.apply(this, arguments);
      }

      return updatePostedMessage;
    }()

    /**
     * @description: Deletes a specified message from a group
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} null
     */

  }, {
    key: 'deletePostedMessage',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(req, res) {
        var matchingGroup, matchingMessage, membership, originalMessage;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ 'Group ID': req.params.groupId }, { 'Message ID': req.params.messageId }]);

                if (!(errorMessage.trim() !== '')) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 3:
                _context5.prev = 3;
                _context5.next = 6;
                return this.group.findById(req.params.groupId);

              case 6:
                matchingGroup = _context5.sent;

                if (matchingGroup) {
                  _context5.next = 9;
                  break;
                }

                return _context5.abrupt('return', res.status(404).json({ message: 'Specified group does not exist!' }));

              case 9:
                _context5.next = 11;
                return this.message.findById(req.params.messageId);

              case 11:
                matchingMessage = _context5.sent;

                if (matchingMessage) {
                  _context5.next = 14;
                  break;
                }

                return _context5.abrupt('return', res.status(404).json({ message: 'Specified message does not exist!' }));

              case 14:
                _context5.next = 16;
                return this.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: _auth2.default.getUserIdFromRequest(req)
                  }
                });

              case 16:
                membership = _context5.sent;

                if (membership) {
                  _context5.next = 19;
                  break;
                }

                return _context5.abrupt('return', res.status(403).json({ message: 'You do not belong to this group!' }));

              case 19:
                _context5.next = 21;
                return this.message.findOne({
                  where: {
                    groupId: req.params.groupId,
                    id: req.params.messageId,
                    senderId: _auth2.default.getUserIdFromRequest(req)
                  }
                });

              case 21:
                originalMessage = _context5.sent;

                if (originalMessage) {
                  _context5.next = 24;
                  break;
                }

                return _context5.abrupt('return', res.status(403).json({ message: 'You are not the sender of this message!' }));

              case 24:
                _context5.next = 26;
                return this.message.destroy({ where: { id: req.params.messageId } });

              case 26:
                res.status(200).json({ message: 'Message deleted successfully!' });
                _context5.next = 32;
                break;

              case 29:
                _context5.prev = 29;
                _context5.t0 = _context5['catch'](3);

                res.status(500).json({ message: _context5.t0.message });

              case 32:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 29]]);
      }));

      function deletePostedMessage(_x11, _x12) {
        return _ref5.apply(this, arguments);
      }

      return deletePostedMessage;
    }()
  }]);

  return MessageController;
}();

exports.default = MessageController;