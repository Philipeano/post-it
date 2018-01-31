'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _validator = require('../helpers/validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var errorMessage = void 0;

/**
 * @description: Defines controller for manipulating 'membership' model
 * @class
 */

var MembershipController = function () {
  /**
   * @description: Initializes instance with necessary database models
   * as local properties
   * @constructor
   */
  function MembershipController() {
    _classCallCheck(this, MembershipController);

    this.group = _index2.default.Group;
    this.membership = _index2.default.Membership;
    this.user = _index2.default.User;
  }

  /**
   * @description: Adds another user as member of a group
   * @param {Object} req The incoming request from the client
   * @param {Object} res The outgoing response from the server
   * @return {Object} newMembership
   */


  _createClass(MembershipController, [{
    key: 'addOtherMemberToGroup',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
        var matchingGroup, matchingUser, existingMembership, newMembership;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ 'Group ID': req.params.groupId }, { 'User ID': req.body.userId }]);

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
                return this.user.findById(req.body.userId);

              case 11:
                matchingUser = _context.sent;

                if (matchingUser) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt('return', res.status(404).json({ message: 'Specified user does not exist!' }));

              case 14:
                _context.next = 16;
                return this.membership.findOne({
                  where: {
                    groupId: req.params.groupId,
                    memberId: req.body.userId
                  }
                });

              case 16:
                existingMembership = _context.sent;

                if (!existingMembership) {
                  _context.next = 19;
                  break;
                }

                return _context.abrupt('return', res.status(409).json({ message: 'User is already in the group!' }));

              case 19:
                _context.next = 21;
                return this.membership.sync();

              case 21:
                _context.next = 23;
                return this.membership.create({
                  groupId: req.params.groupId,
                  memberId: req.body.userId,
                  userRole: 'member'
                });

              case 23:
                newMembership = _context.sent;

                res.status(201).json({
                  message: 'User added to group successfully!',
                  membership: newMembership
                });
                _context.next = 30;
                break;

              case 27:
                _context.prev = 27;
                _context.t0 = _context['catch'](3);

                res.status(500).json({ message: _context.t0.message });

              case 30:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 27]]);
      }));

      function addOtherMemberToGroup(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return addOtherMemberToGroup;
    }()

    /**
     * @description: Fetches all members in a group
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} memberships
     */

  }, {
    key: 'getMembersInGroup',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
        var memberships;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ 'Group ID': req.params.groupId }]);

                if (!(errorMessage.trim() !== '')) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', res.status(400).json({ message: errorMessage }));

              case 3:
                _context2.prev = 3;
                _context2.next = 6;
                return this.membership.findAll({
                  attributes: ['id', 'userRole'],
                  where: { groupId: req.params.groupId },
                  include: [{
                    model: this.user,
                    attributes: ['id', 'username', 'email']
                  }]
                });

              case 6:
                memberships = _context2.sent;

                res.status(200).json({ Memberships: memberships });
                _context2.next = 13;
                break;

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2['catch'](3);

                res.status(500).json({ message: _context2.t0.message });

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 10]]);
      }));

      function getMembersInGroup(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getMembersInGroup;
    }()

    /**
     * @description: Deletes a specified member from a group
     * @param {Object} req The incoming request from the client
     * @param {Object} res The outgoing response from the server
     * @return {Object} null
     */

  }, {
    key: 'deleteMemberFromGroup',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
        var matchingGroup, matchingUser, matchingMembership;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                errorMessage = _validator2.default.checkEmpty([{ 'Group ID': req.params.groupId }, { 'User ID': req.params.userId }]);

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
                return this.user.findById(req.params.userId);

              case 11:
                matchingUser = _context3.sent;

                if (matchingUser) {
                  _context3.next = 14;
                  break;
                }

                return _context3.abrupt('return', res.status(404).json({ message: 'Specified user does not exist!' }));

              case 14:
                if (!(matchingGroup.creatorId === req.session.user.id || req.params.userId === req.session.user.id)) {
                  _context3.next = 23;
                  break;
                }

                _context3.next = 17;
                return this.membership.findOne({
                  where: { groupId: req.params.groupId, memberId: req.params.userId }
                });

              case 17:
                matchingMembership = _context3.sent;

                if (!matchingMembership) {
                  _context3.next = 22;
                  break;
                }

                _context3.next = 21;
                return this.membership.destroy({
                  where: { groupId: req.params.groupId, memberId: req.params.userId }
                });

              case 21:
                return _context3.abrupt('return', res.status(200).json({
                  message: 'Member deleted from group successfully!'
                }));

              case 22:
                return _context3.abrupt('return', res.status(404).json({ message: 'Specified membership does not exist!' }));

              case 23:
                res.status(403).json({ message: 'You do not have the right to delete this member.' });
                _context3.next = 29;
                break;

              case 26:
                _context3.prev = 26;
                _context3.t0 = _context3['catch'](3);

                res.status(500).json({ message: _context3.t0.message });

              case 29:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 26]]);
      }));

      function deleteMemberFromGroup(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return deleteMemberFromGroup;
    }()
  }]);

  return MembershipController;
}();

exports.default = MembershipController;