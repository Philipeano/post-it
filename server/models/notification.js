import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
  const Notification = sequelize.define('Notification', {
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
    /*
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
  });
  return Notification;
};
