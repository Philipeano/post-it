<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
=======
import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
  const GroupMember = sequelize.define('GroupMember', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
>>>>>>> server
    userRole: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'member'
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
