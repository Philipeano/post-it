<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
=======
import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
>>>>>>> server
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
    /*
<<<<<<< HEAD
    id: {
     type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
       primaryKey: true
        },
=======
>>>>>>> server
    senderId: {
     type: DataTypes.UUID,
      allowNull: false
       },
    groupId: {
     type: DataTypes.UUID,
      allowNull: false
       },
    datePosted: {
     type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
       },
    */
  }, {
    classMethods: {
      associate: (models) => {
        Message.belongsTo(models.User, {
          foreignKey: 'senderId',
          as: 'sender',
          onDelete: 'CASCADE',
        });

        Message.belongsTo(models.Group, {
          foreignKey: 'groupId',
          as: 'group',
          onDelete: 'CASCADE',
        });

        Message.hasMany(models.Notification, {
          foreignKey: 'notificationId',
          as: 'notifications',
        });
      }
    }
  });
  return Message;
};
