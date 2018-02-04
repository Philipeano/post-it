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

var errorMessage = void 0;

/**
 * @description: Defines controller for manipulating 'group' model
 * @class
 */

var GroupController = function () {
  /**
   * @description: Initializes instance with necessary database models
   * as local properties
   * @constructor
   */
  function GroupController() {
    _classCallCheck(this, GroupController);

    this.group = _index2.default.Group;
    this.membership = _index2.default.Membership;
    this.user = _index2.default.User;
  }

  /**
   * @description: Creates a new group and adds creator as member
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} newGroup
   */


  _createClass(GroupController, [{
    key: 'createGroup',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
        var matchingGroup, newGroup;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ Title: req.body.title }, { Purpose: req.body.purpose }]);

                if (!(errorMessage.trim() !== '')) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 3:
                _context.prev = 3;
                _context.next = 6;
                return this.group.findOne({ where: { title: req.body.title } });

              case 6:
                matchingGroup = _context.sent;

                if (!matchingGroup) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return', res.status(409).json({ message: 'Group Title is already taken!' }));

              case 9:
                _context.next = 11;
                return this.group.sync();

              case 11:
                _context.next = 13;
                return this.group.create({
                  title: req.body.title,
                  purpose: req.body.purpose,
                  creatorId: _auth2.default.getUserIdFromRequest(req)
                });

              case 13:
                newGroup = _context.sent;
                _context.next = 16;
                return this.membership.sync();

              case 16:
                _context.next = 18;
                return this.membership.create({
                  userRole: 'admin',
                  groupId: newGroup.id,
                  memberId: _auth2.default.getUserIdFromRequest(req)
                });

              case 18:
                res.status(201).json({
                  message: 'Group created successfully!',
                  group: _validator2.default.trimFields(newGroup)
                });
                _context.next = 24;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context['catch'](3);

                res.status(500).json({ message: _context.t0.message });

              case 24:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 21]]);
      }));

      function createGroup(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return createGroup;
    }()

    /**
     * @description: Fetches all available groups
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} allGroups
     */

  }, {
    key: 'getAllGroups',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
        var allGroups;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.group.findAll({
                  attributes: ['id', 'title', 'purpose'],
                  include: [{
                    model: this.user,
                    as: 'creator',
                    attributes: ['id', 'username', 'email']
                  }, {
                    model: this.user,
                    as: 'members',
                    attributes: ['id', 'username', 'email'],
                    through: { attributes: ['userRole'] }
                  }]
                });

              case 3:
                allGroups = _context2.sent;

                res.status(200).json({ 'Available groups': allGroups });
                _context2.next = 10;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](0);

                res.status(500).json({ message: _context2.t0.message });

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function getAllGroups(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getAllGroups;
    }()

    /**
     * @description: Fetches a group matching specified groupKey
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} matchingGroup
     */

  }, {
    key: 'getGroupByKey',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
        var matchingGroup;
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
                return this.group.findOne({
                  attributes: ['id', 'title', 'purpose'],
                  where: { id: req.params.groupId },
                  include: [{
                    model: this.user,
                    as: 'creator',
                    attributes: ['id', 'username', 'email']
                  }, {
                    model: this.user,
                    as: 'members',
                    attributes: ['id', 'username', 'email'],
                    through: { attributes: ['userRole'] }
                  }]
                });

              case 6:
                matchingGroup = _context3.sent;

                if (matchingGroup) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt('return', res.status(404).json({ message: 'Requested group does not exist!' }));

              case 9:
                res.status(200).json({ 'Requested group': matchingGroup });
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3['catch'](3);

                res.status(500).json({ message: _context3.t0.message });

              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 12]]);
      }));

      function getGroupByKey(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return getGroupByKey;
    }()

    /**
     * @description: Deletes a group matching specified groupKey
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} null
     */

  }, {
    key: 'deleteGroup',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res) {
        var matchingGroup;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ 'Group ID': req.params.groupId }]);

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
                if (!(matchingGroup.creatorId === _auth2.default.getUserIdFromRequest(req))) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 12;
                return this.group.destroy({ where: { id: req.params.groupId } });

              case 12:
                return _context4.abrupt('return', res.status(200).json({ message: 'Group deleted successfully!' }));

              case 13:
                res.status(403).json({ message: 'You do not have the right to delete this group!' });
                _context4.next = 19;
                break;

              case 16:
                _context4.prev = 16;
                _context4.t0 = _context4['catch'](3);

                res.status(500).json({ message: _context4.t0.message });

              case 19:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 16]]);
      }));

      function deleteGroup(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return deleteGroup;
    }()
  }]);

  return GroupController;
}();

exports.default = GroupController;