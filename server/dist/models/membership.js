'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Membership = sequelize.define('Membership', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userRole: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'member'
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });

  Membership.associate = function (models) {
    Membership.belongsTo(models.User, {
      foreignKey: 'memberId'
    });

    Membership.belongsTo(models.Group, {
      foreignKey: 'groupId'
    });
  };

  return Membership;
};