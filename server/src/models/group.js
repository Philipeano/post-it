<<<<<<< HEAD:server/models/group.js
<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
=======
import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
=======
export default (sequelize, DataTypes) => {
>>>>>>> server:server/src/models/group.js
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
>>>>>>> server
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
<<<<<<< HEAD
    // picture: {
    //   type: DataTypes.BINARY,
    //   allowNull: true
    // }
    /*
    id: {
<<<<<<< HEAD
     type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
       primaryKey: true
        },
=======
>>>>>>> server
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
=======
  });
>>>>>>> server

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
      as: 'messages',
      foreignKey: 'groupId'
    });
  };

  return Group;
};
