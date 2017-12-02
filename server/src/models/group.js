export default (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  });

  Group.associate = (models) => {
    Group.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'creatorId',
      onDelete: 'CASCADE'
    });

    Group.belongsToMany(models.User, {
      as: 'members',
      through: models.Membership,
      foreignKey: 'groupId',
      otherKey: 'memberId'
    });

    Group.hasMany(models.Message, {
      // as: 'messages',
      foreignKey: 'groupId'
    });
  };

  return Group;
};