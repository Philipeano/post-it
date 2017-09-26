'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['visible', 'archived'],
      defaultValue: 'visible'
    },
    priority: {
      type: DataTypes.ENUM,
      values: ['normal', 'urgent', 'critical'],
      defaultValue: 'normal'
    }
  });

  Message.associate = function (models) {
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
      onDelete: 'CASCADE'
    });

    Message.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
      onDelete: 'CASCADE'
    });
  };

  return Message;
};