<<<<<<< HEAD:server/models/message.js
<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
=======
import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
=======
export default (sequelize, DataTypes) => {
>>>>>>> server:server/src/models/message.js
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
<<<<<<< HEAD:server/models/message.js
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
    */
=======
>>>>>>> server:server/src/models/message.js
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      as: 'sender',
      foreignKey: 'senderId',
      onDelete: 'CASCADE',
    });

    Message.belongsTo(models.Group, {
      as: 'group',
      foreignKey: 'groupId',
      onDelete: 'CASCADE',
    });
  };

  return Message;
};
