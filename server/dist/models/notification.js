'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    notificationType: {
      type: DataTypes.STRING,
      defaultValue: 'in-app'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['unread', 'read', 'archived'],
      defaultValue: 'unread'
    }
  });

  Notification.associate = function (models) {
    Notification.belongsTo(models.User, {
      as: 'recipient',
      foreignKey: 'recipientId',
      onDelete: 'CASCADE'
    });

    Notification.belongsTo(models.Message, {
      as: 'originalMessage',
      foreignKey: 'messageId',
      onDelete: 'CASCADE'
    });
  };

  return Notification;
};