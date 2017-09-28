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
 * @description: Defines controller for manipulating 'group' model
 * @class
 */

var GroupController = function () {
  /**
   * @description: Initializes instance with 'group' and 'membership' models
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
   * @param {Object} req
   * @param {Object} res
   * @return {Object} newGroup
   */


  _createClass(GroupController, [{
    key: 'createGroup',
    value: function createGroup(req, res) {
      var _this = this;

      errorMessage = '';
      if (_validator2.default.isEmpty('Title', req.body.title)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (_validator2.default.isEmpty('Purpose', req.body.purpose)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;

      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        this.group.findOne({ where: { title: req.body.title } }).then(function (matchingGroup) {
          if (matchingGroup) res.status(409).json({ message: 'Group Title is already taken!' });else {
            _this.group.sync().then(function () {
              _this.group.create({
                title: req.body.title,
                purpose: req.body.purpose,
                creatorId: req.session.user.id
              }).then(function (newGroup) {
                _this.membership.sync().then(function () {
                  _this.membership.create({
                    userRole: 'admin',
                    groupId: newGroup.id,
                    memberId: req.session.user.id
                  }).then(function () {
                    res.status(201).json({
                      message: 'Group created successfully!',
                      group: newGroup
                    });
                  });
                }).catch(function (err) {
                  res.status(500).json({ message: err.message });
                });
              });
            });
          }
        });
      }
    }

    /**
     * @description: Fetches all available groups
     * @param {Object} req
     * @param {Object} res
     * @return {Object} allGroups
     */

  }, {
    key: 'getAllGroups',
    value: function getAllGroups(req, res) {
      this.group.findAll({
        include: [{ model: this.user, as: 'creator' }, { model: this.message, as: 'messages' }, { model: this.user, as: 'members' }]
      }).then(function (allGroups) {
        res.status(200).json({ 'Available groups': allGroups });
      }).catch(function (err) {
        res.status(500).json({ message: err.message });
      });
    }

    /**
     * @description: Fetches a group matching specified groupKey
     * @param {Object} req
     * @param {Object} res
     * @return {Object} matchingGroup
     */

  }, {
    key: 'getGroupByKey',
    value: function getGroupByKey(req, res) {
      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        this.group.findOne({
          where: { id: req.params.groupId },
          include: [{ model: this.user, as: 'creator' }, { model: this.message, as: 'messages' }, { model: this.user, as: 'members' }]
        }).then(function (matchingGroup) {
          if (matchingGroup) {
            res.status(200).json({ 'Specified group': matchingGroup });
          } else {
            res.status(404).json({ message: 'Specified group does not exist' });
          }
        }).catch(function (err) {
          res.status(500).json({ message: err.message });
        });
      }
    }

    /**
     * @description: Deletes a group matching specified groupKey
     * @param {Object} req
     * @param {Object} res
     * @return {Object} null
     */

  }, {
    key: 'deleteGroup',
    value: function deleteGroup(req, res) {
      var _this2 = this;

      errorMessage = '';
      if (_validator2.default.isEmpty('Group ID', req.params.groupId)) errorMessage = errorMessage + ' ' + _validator2.default.validationMessage;
      if (errorMessage.trim() !== '') res.status(400).json({ message: errorMessage });else {
        this.group.findOne({ where: { id: req.params.groupId } }).then(function (matchingGroup) {
          if (matchingGroup) {
            _this2.group.destroy({ where: { id: req.params.groupId } }).then(function () {
              res.status(200).json({ message: 'Group deleted successfully!' });
            }).catch(function (err) {
              res.status(500).json({ message: err.message });
            });
          } else {
            res.status(404).json({ message: 'Specified group does not exist' });
          }
        }).catch(function (err) {
          res.status(500).json({ message: err.message });
        });
      }
    }
  }]);

  return GroupController;
}();

exports.default = GroupController;