<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
=======
import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
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
