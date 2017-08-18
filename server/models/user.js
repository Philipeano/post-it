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
<<<<<<< HEAD
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
=======
  });

  User.associate = (models) => {
    User.hasMany(models.Group, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
>>>>>>> server

    User.hasMany(models.Message, {
      foreignKey: 'senderId',
      as: 'sender',
    });

    User.hasMany(models.Notification, {
      foreignKey: 'recipientId',
      as: 'recipient',
    });

<<<<<<< HEAD
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
=======
    User.belongsToMany(models.Group, {
      through: models.Membership,
      foreignKey: 'groupId',
    });
  };
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
  return User;
};
