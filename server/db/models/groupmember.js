module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
    userRole: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'member'
    }
  /*
    id: {
     type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
       primaryKey: true
        },
    groupId: {
     type: DataTypes.UUID,
      allowNull: false
       },
    memberId: {
     type: DataTypes.UUID,
      allowNull: false
       },
    dateAdded: {
     type: DataTypes.DATE,
     defaultValue: DataTypes.NOW
     },
  */
  }, {
    classMethods: {
      associate: (models) => {
        GroupMember.belongsTo(models.User, {
          foreignKey: 'memberId',
          as: 'member',
          onDelete: 'CASCADE',
        });

        GroupMember.belongsTo(models.Group, {
          foreignKey: 'groupId',
          as: 'group',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return GroupMember;
};
