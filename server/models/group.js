export default (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
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
    // picture: {
    //   type: DataTypes.BINARY,
    //   allowNull: true
    // }
    /*
    id: {
     type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
       primaryKey: true
        },
    creatorId: {
     type: DataTypes.UUID,
      allowNull: false
       },
    dateCreated: {
     type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
       },
    */
  }, {
    classMethods: {
      associate: (models) => {
        Group.belongsTo(models.User, {
          foreignKey: 'creatorId',
          as: 'creator',
          onDelete: 'CASCADE',
        });

        Group.hasMany(models.GroupMember, {
          foreignKey: 'id',
          as: 'memberGroups',
        });

        Group.hasMany(models.Message, {
          foreignKey: 'groupId',
          as: 'messages',
        });
      },
    },
  });
  return Group;
};
