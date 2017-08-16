import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
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
      foreignKey: 'creatorId',
      as: 'creator',
      onDelete: 'CASCADE',
    });
    Group.belongsToMany(models.User, {
      through: models.Membership,
      foreignKey: 'memberId',
      as: 'member',
    });
    Group.hasMany(models.Message, {
      foreignKey: 'groupId',
    });
  };

  return Group;
};
