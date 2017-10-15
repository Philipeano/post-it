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
 * @description: Defines controller for manipulating 'membership' model
 * @class
 */

var MembershipController = function () {
  /**
   * @description: Initializes instance with 'membership' as local property
   * @constructor
   */
  function MembershipController() {
    _classCallCheck(this, MembershipController);

    this.group = _index2.default.Group;
    this.membership = _index2.default.Membership;
  }

  /**
   * @description: Adds another user as member of a group
   * @param {Object} req
   * @param {Object} res
   * @return {Object} newMembership
   */


  _createClass(MembershipController, [{
    key: 'addOtherMemberToGroup',
    value: function addOtherMemberToGroup(req, res) {
      var _this = this;

      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('User ID', req.body.userId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        this.group.findById(req.params.groupId).then(function (matchingGroup) {
          if (matchingGroup) {
            _this.membership.findOne({
              where: {
                groupId: req.params.groupId,
                memberId: req.body.userId
              }
            }).then(function (existingMembership) {
              if (existingMembership) res.status(409).json({ message: 'User is already in the group!' });else {
                _this.membership.sync().then(function () {
                  _this.membership.create({
                    groupId: req.params.groupId,
                    memberId: req.body.userId,
                    userRole: 'member'
                  }).then(function (newMembership) {
                    res.status(201).json({
                      message: 'User added to group successfully!',
                      membership: newMembership
                    });
                  }).catch(function (err) {
                    res.status(500).json({ message: err.message });
                  });
                });
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
     * @description: Fetches all members in a group
     * @param {Object} req
     * @param {Object} res
     * @return {Object} memberships
     */

  }, {
    key: 'getMembersInGroup',
    value: function getMembersInGroup(req, res) {
      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        this.membership.findAll({ where: { groupId: req.params.groupId } }).then(function (memberships) {
          res.status(200).json({ Memberships: memberships });
        }).catch(function (err) {
          res.status(500).json({ message: err.message });
        });
      }
    }

    /**
     * @description: Deletes a specified member from a group
     * @param {Object} req
     * @param {Object} res
     * @return {Object} null
     */

  }, {
    key: 'deleteMemberFromGroup',
    value: function deleteMemberFromGroup(req, res) {
      var _this2 = this;

      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('User ID', req.params.userId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        this.membership.findOne({ where: { groupId: req.params.groupId,
            memberId: req.params.userId } }).then(function (matchingMembership) {
          if (matchingMembership) {
            _this2.membership.destroy({ where: { groupId: req.params.groupId,
                memberId: req.params.userId } }).then(function () {
              res.status(200).json({ message: 'Member deleted from group successfully!' });
            });
          } else {
            res.status(404).json({ message: 'Specified membership does not exist' });
          }
        }).catch(function (err) {
          res.status(500).json({ message: err.message });
        });
      }
    }
  }]);

  return MembershipController;
}();

exports.default = MembershipController;