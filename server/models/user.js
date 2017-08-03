<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
=======
// import bcrypt from 'bcrypt';
import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
>>>>>>> server
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
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
<<<<<<< HEAD
=======

>>>>>>> server
    // picture: {
    //   type: DataTypes.BINARY,
    //   allowNull: true
    // }
    /*
<<<<<<< HEAD
    id: {
     type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
       primaryKey: true
        },
=======
>>>>>>> server
    dateRegistered: {
     type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
      },
    */
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Group, {
          foreignKey: 'creatorId',
          as: 'ownGroups',
        });

        User.hasMany(models.GroupMember, {
          foreignKey: 'memberId',
          as: 'memberships',
        });

        User.hasMany(models.Message, {
          foreignKey: 'senderId',
          as: 'sentMessages',
        });

        User.hasMany(models.Notification, {
          foreignKey: 'recipientId',
          as: 'notifications',
        });
      },
<<<<<<< HEAD
=======
      /*
      generateHash: (plainText) => {
        // Create hash from new password
        bcrypt.hash(plainText, 10, (err, hash) => {
          // Store hashed password in database
          this.password = hash;
        });
      },
      verifyPassword: (plainText, hashFromDB) => {
        bcrypt.compare(plainText, hashFromDB, (err, res) => {
          // Return comparison result
          return res;
        });
      },
      */
>>>>>>> server
    },
  });
  return User;
};
