export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Group, {
      foreignKey: 'creatorId',
      as: 'creator'
    });

    User.hasMany(models.Message, {
      foreignKey: 'senderId',
      as: 'sender'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'recipientId',
      as: 'recipient'
    });

    User.belongsToMany(models.Group, {
      through: models.Membership,
      foreignKey: 'memberId',
      otherKey: 'groupId'
    });
  };
  return User;
};