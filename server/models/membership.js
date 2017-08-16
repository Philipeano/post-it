import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
  const Membership = sequelize.define('Membership', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userRole: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'member'
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false
    },
  });

  // Membership.associate = (models) => {
  //   Membership.belongsTo(models.User, {
  //     foreignKey: 'memberId',
  //     as: 'member',
  //     onDelete: 'CASCADE',
  //   });
  //
  //   Membership.belongsTo(models.Group, {
  //     foreignKey: 'groupId',
  //     as: 'group',
  //     onDelete: 'CASCADE',
  //   });
  // };
  return Membership;
};
