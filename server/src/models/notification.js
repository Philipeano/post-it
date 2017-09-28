<<<<<<< HEAD:server/models/notification.js
<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
=======
import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
=======
export default (sequelize, DataTypes) => {
>>>>>>> server:server/src/models/notification.js
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
>>>>>>> server
    notificationType: {
      type: DataTypes.STRING,
      defaultValue: 'in-app'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['unread', 'read', 'archived'],
      defaultValue: 'unread'
    }
<<<<<<< HEAD
    /*
<<<<<<< HEAD
    id: {
     type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
       primaryKey: true
        },
=======
>>>>>>> server
    recipientId: {
     type: DataTypes.UUID,
      allowNull: false
       },
    messageId: {
     type: DataTypes.UUID,
      allowNull: false
       },
    */
  }, {
    classMethods: {
      associate: (models) => {
        Notification.belongsTo(models.User, {
          foreignKey: 'recipientId',
          as: 'recipient',
          onDelete: 'CASCADE',
        });

        Notification.belongsTo(models.Message, {
          foreignKey: 'messageId',
          as: 'originalMessage',
          onDelete: 'CASCADE',
        });
      }
    }
=======
>>>>>>> server
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'recipientId',
      as: 'recipient',
      onDelete: 'CASCADE',
    });

    Notification.belongsTo(models.Message, {
      foreignKey: 'messageId',
      as: 'originalMessage',
      onDelete: 'CASCADE',
    });
  };

  return Notification;
};
