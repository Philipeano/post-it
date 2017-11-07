export default (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
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

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      as: 'sender',
      foreignKey: 'senderId',
      onDelete: 'CASCADE',
    });

    Message.belongsTo(models.Group, {
      // as: 'group',
      foreignKey: 'groupId',
      onDelete: 'CASCADE',
    });
  };

  return Message;
};
